export default class PuffinPart {
	constructor(options = {}) {
		this.x = Number(options.x) || 0;
		this.y = Number(options.y) || 0;
		this.width = Number(options.width) || 0;
		this.height = Number(options.height) || 0;
		this.duration =
			options.duration !== undefined ? Number(options.duration) : 0.4;
		this.delay = options.delay !== undefined ? Number(options.delay) : 0;
		this.easing = options.easing || "cubic-bezier(0.25, 1, 0.5, 1)";
		this.imageSrc = options.imageSrc || "";

		this.element = document.createElement("div");
		this.element.classList.add("puffin--part");
		this.element.style.width = `${this.width}px`;
		this.element.style.height = `${this.height}px`;

		this.positions = {
			initial: { x: 0, y: 0, bgX: 0, bgY: 0 },
			hover: { x: 0, y: 0, bgX: 0, bgY: 0 },
		};
	}

	setup(minX, minY, maxImageX, maxImageY, containerWidth, containerHeight) {
		let left;
		let leftHover;
		let bgLeft;
		let bgHoverX;

		let top;
		let topHover;
		let bgTop;
		let bgHoverY;

		if (this.x < 0) {
			left = 0;
			leftHover = this.x;
			bgLeft = minX;
			bgHoverX = minX - this.x;
		} else {
			left = containerWidth - this.width;
			leftHover = containerWidth - this.width + this.x;
			bgLeft = minX - containerWidth + this.width;
			bgHoverX = bgLeft - this.x;
		}

		if (this.y < 0) {
			top = 0;
			topHover = this.y;
			bgTop = minY;
			bgHoverY = minY - this.y;
		} else {
			top = containerHeight - this.height;
			topHover = containerHeight - this.height + this.y;
			bgTop = minY - containerHeight + this.height;
			bgHoverY = bgTop - this.y;
		}

		this.positions.initial = { x: left, y: top, bgX: bgLeft, bgY: bgTop };
		this.positions.hover = {
			x: leftHover,
			y: topHover,
			bgX: bgHoverX,
			bgY: bgHoverY,
		};

		this.element.style.backgroundImage = `url("${this.imageSrc}")`;
		this.element.style.backgroundSize = `${maxImageX}px ${maxImageY}px`;
		this.element.style.backgroundRepeat = "no-repeat";

		this.applyPosition(this.positions.initial, false);
	}

	applyPosition(pos, animated, isEntering = false) {
		if (animated) {
			const delay = isEntering ? this.delay : 0;
			this.element.style.transition = `transform ${this.duration}s ${this.easing} ${delay}s, background-position ${this.duration}s ${this.easing} ${delay}s`;
		} else {
			this.element.style.transition = "none";
		}
		this.element.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
		this.element.style.backgroundPosition = `${pos.bgX}px ${pos.bgY}px`;
	}

	animateIn() {
		this.applyPosition(this.positions.hover, true, true);
	}

	animateOut() {
		this.applyPosition(this.positions.initial, true, false);
	}

	destroy() {
		if (this.element?.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
	}
}
