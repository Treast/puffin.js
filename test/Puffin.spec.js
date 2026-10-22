import test from "node:test";
import assert from "node:assert";
import Puffin from "../dist/puffin.esm.js";

// Setup minimal DOM environment for testing
class ClassList {
	constructor() {
		this._classes = new Set();
	}
	add(c) {
		this._classes.add(c);
	}
	remove(c) {
		this._classes.delete(c);
	}
	contains(c) {
		return this._classes.has(c);
	}
}

class MockElement {
	constructor(tagName = "div") {
		this.tagName = tagName.toUpperCase();
		this.classList = new ClassList();
		this.style = {};
		this.children = [];
		this.parentNode = null;
		this.listeners = {};
		this.offsetWidth = 500;
		this.offsetHeight = 400;
	}

	getBoundingClientRect() {
		return {
			width: this.offsetWidth,
			height: this.offsetHeight,
			top: 0,
			left: 0,
			right: this.offsetWidth,
			bottom: this.offsetHeight,
		};
	}

	appendChild(child) {
		child.parentNode = this;
		this.children.push(child);
		return child;
	}

	prepend(child) {
		child.parentNode = this;
		this.children.unshift(child);
		return child;
	}

	removeChild(child) {
		const idx = this.children.indexOf(child);
		if (idx !== -1) {
			this.children.splice(idx, 1);
			child.parentNode = null;
		}
		return child;
	}

	addEventListener(event, fn) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(fn);
	}

	removeEventListener(event, fn) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter((f) => f !== fn);
	}

	dispatchEvent(event) {
		const list = this.listeners[event.type] || [];
		list.forEach((fn) => {
			fn(event);
		});
		return true;
	}
}

class MockEvent {
	constructor(type, options = {}) {
		this.type = type;
		this.detail = options.detail;
	}
}

const mockRegistry = new Map();

global.window = global;
global.CustomEvent = MockEvent;
global.Event = MockEvent;
global.document = {
	head: new MockElement("head"),
	getElementById: (id) =>
		id === "puffin-default-style" ? new MockElement("style") : null,
	createElement: (tag) => new MockElement(tag),
	querySelector: (sel) => mockRegistry.get(sel) || null,
};

test("Puffin initialization with element", () => {
	const container = new MockElement("div");
	const puffin = new Puffin({
		element: container,
		image: "./image.jpg",
		duration: 0.5,
		overlay: "Test overlay",
		parts: [
			{ x: -80, y: -180, width: 120, height: 250 },
			{ x: 100, y: 90, width: 160, height: 210, delay: 0.2 },
		],
	});

	assert.strictEqual(container.classList.contains("puffin"), true);
	assert.strictEqual(container.style.backgroundImage, 'url("./image.jpg")');
	assert.strictEqual(puffin.parts.length, 2);
	assert.ok(puffin.overlay !== null);
	assert.strictEqual(puffin.overlay.innerHTML, "Test overlay");
});

test("Puffin initialization via selector lookup", () => {
	const container = new MockElement("div");
	mockRegistry.set("#my-puffin", container);

	const puffin = new Puffin({
		selector: "#my-puffin",
		image: "./image.jpg",
		parts: [{ x: 10, y: 10, width: 50, height: 50 }],
	});

	assert.strictEqual(puffin.element, container);
	assert.strictEqual(container.classList.contains("puffin"), true);
	mockRegistry.delete("#my-puffin");
});

test("Puffin handles invalid selector gracefully without throwing", () => {
	const puffin = new Puffin({
		selector: "#non-existent",
		image: "./image.jpg",
	});

	assert.strictEqual(puffin.element, undefined);
});

test("Puffin calculates correct minimum and maximum without string comparison bugs", () => {
	const container = new MockElement("div");
	const puffin = new Puffin({
		element: container,
		image: "./image.jpg",
		parts: [
			{ x: -80, y: -180, width: 100, height: 100 },
			{ x: -180, y: 80, width: 100, height: 100 },
			{ x: 100, y: 90, width: 100, height: 100 },
			{ x: 90, y: -60, width: 100, height: 100 },
		],
	});

	// -180 is smaller than -80 (numerically)
	assert.strictEqual(puffin.getMinimumPart("x"), -180);
	assert.strictEqual(puffin.getMinimumPart("data-x"), -180);
	// 100 is greater than 90 (numerically, whereas in string comparison "90" > "100")
	assert.strictEqual(puffin.getMaximumPart("x"), 100);
	assert.strictEqual(puffin.getMaximumPart("data-x"), 100);
	assert.strictEqual(puffin.getMinimumPart("y"), -180);
	assert.strictEqual(puffin.getMaximumPart("y"), 90);
});

test("Puffin handles empty parts gracefully without crashing", () => {
	const container = new MockElement("div");
	const puffin = new Puffin({
		element: container,
		image: "./image.jpg",
		parts: [],
	});

	assert.strictEqual(puffin.parts.length, 0);
	assert.strictEqual(puffin.getMinimumPart("x"), 0);
	assert.strictEqual(puffin.getMaximumPart("x"), 0);
});

test("Puffin triggers events on mouseenter, mouseleave and click", () => {
	const container = new MockElement("div");
	const puffin = new Puffin({
		element: container,
		image: "./image.jpg",
		overlay: "Hover me",
		parts: [{ x: 50, y: 50, width: 100, height: 100 }],
	});

	const events = [];
	container.addEventListener("puffin:enter", (e) => events.push(e.type));
	container.addEventListener("puffin:leave", (e) => events.push(e.type));
	container.addEventListener("puffin:click", (e) => events.push(e.type));
	container.addEventListener("customEvent", (e) => events.push(e.type));

	container.dispatchEvent(new MockEvent("mouseenter"));
	assert.strictEqual(puffin.overlay.style.opacity, "1");

	container.dispatchEvent(new MockEvent("mouseleave"));
	assert.strictEqual(puffin.overlay.style.opacity, "0");

	container.dispatchEvent(new MockEvent("click"));

	assert.ok(events.includes("puffin:enter"));
	assert.ok(events.includes("puffin:leave"));
	assert.ok(events.includes("puffin:click"));
	assert.ok(events.includes("customEvent"));
});

test("Puffin.destroy cleans up classes, styles, overlay and parts", () => {
	const container = new MockElement("div");
	const puffin = new Puffin({
		element: container,
		image: "./image.jpg",
		overlay: "Hover me",
		parts: [{ x: 50, y: 50, width: 100, height: 100 }],
	});

	assert.strictEqual(container.classList.contains("puffin"), true);
	assert.strictEqual(container.children.length, 2); // overlay + 1 part

	puffin.destroy();

	assert.strictEqual(container.classList.contains("puffin"), false);
	assert.strictEqual(container.children.length, 0);
	assert.strictEqual(container.style.backgroundImage, "");
	assert.strictEqual(puffin.parts.length, 0);
	assert.strictEqual(puffin.overlay, null);

	// Calling destroy again should be safe
	puffin.destroy();
});
