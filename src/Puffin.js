import PuffinPart from "./PuffinPart.js";
import "./puffin.css";

const DEFAULT_CSS = `
.puffin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  height: 400px;
  width: 500px;
  background-color: transparent;
  background-repeat: no-repeat;
  z-index: 0;
  cursor: pointer;
  overflow: visible;
}
.puffin--overlay {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  text-align: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
  color: #ffffff;
  font-size: 26px;
  opacity: 0;
  pointer-events: none;
}
.puffin--part {
  position: absolute;
  display: block;
  background-color: transparent;
  z-index: 2;
  pointer-events: none;
  will-change: transform, background-position;
}
`;

function injectStylesIfNeeded() {
	if (
		typeof document === "undefined" ||
		document.getElementById("puffin-default-style")
	) {
		return;
	}
	const style = document.createElement("style");
	style.id = "puffin-default-style";
	style.textContent = DEFAULT_CSS;
	document.head.appendChild(style);
}

class Puffin {
	constructor(options = {}) {
		this.options = {
			duration: 0.4,
			delay: 0,
			easing: "cubic-bezier(0.25, 1, 0.5, 1)",
			parts: [],
			...options,
		};

		const target =
			options.element ||
			(options.selector && typeof options.selector === "string"
				? document.querySelector(options.selector)
				: null);

		if (!target) {
			console.error(
				`[puffin.js] Target element not found for selector: "${options.selector}"`,
			);
			return;
		}

		injectStylesIfNeeded();

		this.element = target;
		this.element.classList.add("puffin");
		this.imageSrc = options.image || "";
		this.parts = [];

		this.buildParts();
		this.setupOverlay();
		this.setupLayout();
		this.setupListeners();
	}

	buildParts() {
		const defaultDuration = this.options.duration;
		const defaultDelay = this.options.delay;
		const defaultEasing = this.options.easing;

		(this.options.parts || []).forEach((partConfig) => {
			const part = new PuffinPart({
				...partConfig,
				duration:
					partConfig.duration !== undefined
						? partConfig.duration
						: defaultDuration,
				delay: partConfig.delay !== undefined ? partConfig.delay : defaultDelay,
				easing: partConfig.easing || defaultEasing,
				imageSrc: this.imageSrc,
			});

			this.element.appendChild(part.element);
			this.parts.push(part);
		});
	}

	setupOverlay() {
		if (this.options.overlay) {
			const overlay = document.createElement("div");
			overlay.classList.add("puffin--overlay");
			overlay.innerHTML = this.options.overlay;
			this.element.prepend(overlay);
			this.overlay = overlay;
		} else {
			this.overlay = null;
		}
	}

	setupLayout() {
		const minX = this.getMinimumPart("x");
		const maxX = this.getMaximumPart("x");
		const minY = this.getMinimumPart("y");
		const maxY = this.getMaximumPart("y");

		const rect = this.element.getBoundingClientRect();
		const width = rect.width || this.element.offsetWidth || 500;
		const height = rect.height || this.element.offsetHeight || 400;

		const maxImageX = width + Math.abs(minX) + Math.abs(maxX);
		const maxImageY = height + Math.abs(minY) + Math.abs(maxY);

		this.element.style.backgroundPosition = `${Math.floor(minX)}px ${Math.floor(minY)}px`;
		this.element.style.backgroundSize = `${maxImageX}px ${maxImageY}px`;
		this.element.style.backgroundImage = `url("${this.imageSrc}")`;

		this.parts.forEach((part) => {
			part.setup(
				Math.floor(minX),
				Math.floor(minY),
				maxImageX,
				maxImageY,
				width,
				height,
			);
		});
	}

	setupListeners() {
		this._onMouseEnter = () => {
			this.parts.forEach((part) => {
				part.animateIn();
			});
			if (this.overlay) {
				this.overlay.style.transition = `opacity ${this.options.duration}s ${this.options.easing}`;
				this.overlay.style.opacity = "1";
			}
			this.emit("puffin:enter");
		};

		this._onMouseLeave = () => {
			this.parts.forEach((part) => {
				part.animateOut();
			});
			if (this.overlay) {
				this.overlay.style.transition = `opacity ${this.options.duration}s ${this.options.easing}`;
				this.overlay.style.opacity = "0";
			}
			this.emit("puffin:leave");
		};

		this._onClick = (e) => {
			this.emit("puffin:click", { originalEvent: e });
		};

		this.element.addEventListener("mouseenter", this._onMouseEnter);
		this.element.addEventListener("mouseleave", this._onMouseLeave);
		this.element.addEventListener("click", this._onClick);
	}

	emit(name, detail = {}) {
		if (!this.element) return;
		this.element.dispatchEvent(
			new CustomEvent(name, { detail: { puffin: this, ...detail } }),
		);
		this.element.dispatchEvent(new Event("customEvent"));
	}

	getMinimumPart(attribute) {
		if (!this.parts.length) return 0;
		const values = this.parts.map((p) => {
			if (attribute === "data-x" || attribute === "x") return p.x;
			if (attribute === "data-y" || attribute === "y") return p.y;
			return 0;
		});
		return Math.min(...values);
	}

	getMaximumPart(attribute) {
		if (!this.parts.length) return 0;
		const values = this.parts.map((p) => {
			if (attribute === "data-x" || attribute === "x") return p.x;
			if (attribute === "data-y" || attribute === "y") return p.y;
			return 0;
		});
		return Math.max(...values);
	}

	destroy() {
		if (!this.element) return;

		this.element.removeEventListener("mouseenter", this._onMouseEnter);
		this.element.removeEventListener("mouseleave", this._onMouseLeave);
		this.element.removeEventListener("click", this._onClick);

		this.parts.forEach((part) => {
			part.destroy();
		});
		this.parts = [];

		if (this.overlay?.parentNode) {
			this.overlay.parentNode.removeChild(this.overlay);
			this.overlay = null;
		}

		this.element.classList.remove("puffin");
		this.element.style.backgroundPosition = "";
		this.element.style.backgroundSize = "";
		this.element.style.backgroundImage = "";
	}
}

if (typeof window !== "undefined") {
	window.Puffin = Puffin;
}

export default Puffin;
