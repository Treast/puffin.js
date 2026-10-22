# puffin.js

`puffin.js` is a lightweight, **zero-dependency** library to bring interactive parallax hover effects to your images.

## Documentation: https://treast.github.io/puffin.js/

![Demonstration](https://github.com/Treast/puffin.js/raw/master/example/demonstration.gif)

Inspired by Oxygenna (https://www.uplabs.com/posts/extreme-hover)

---

## Highlights

- ⚡ **Zero runtime dependencies**: Pure ES6+ and hardware-accelerated CSS transitions.
- 📦 **Ultra lightweight**: ~9 KB unminified, ~3 KB minified/gzipped (reduced from 130+ KB).
- 🔄 **Modern formats**: Supports ESM (`import`), CommonJS (`require`), and UMD script tags.
- 🧹 **Lifecycle-ready**: Clean up listeners and elements anytime with `puffin.destroy()`.

---

## Installation

### With NPM (recommended)

```bash
npm install puffin.js --save
```

### With direct `<script>` tag

```html
<script src="./dist/puffin.min.js"></script>
```

---

## Usage

### ES Module (Vite, Webpack, Rollup)

```javascript
import Puffin from "puffin.js";

const puffin = new Puffin({
	selector: "#foo", // or pass DOM element: element: document.querySelector('#foo')
	image: "./bar.jpg",
	overlay: "Demonstration puffin.js",
	duration: 0.4,
	delay: 0,
	easing: "cubic-bezier(0.25, 1, 0.5, 1)",
	parts: [
		{
			x: -80,
			y: -180,
			height: 250,
			width: 120,
		},
		{
			x: -180,
			y: 80,
			height: 150,
			width: 250,
			delay: 0.1,
			duration: 0.4,
		},
		{
			x: 100,
			y: 90,
			height: 210,
			width: 160,
			delay: 0.2,
			duration: 0.5,
		},
		{
			x: 140,
			y: -60,
			height: 100,
			width: 190,
			delay: 0.3,
			duration: 0.6,
		},
	],
});
```

### Cleanup

When removing the element or unmounting a component (e.g. in React/Vue):

```javascript
puffin.destroy();
```

---

## Options

| Name       | Type            | Default                           | Description                                      |
| ---------- | --------------- | --------------------------------- | ------------------------------------------------ |
| `selector` | `string`        | `undefined`                       | CSS selector of target container (e.g. `#myDiv`) |
| `element`  | `HTMLElement`   | `undefined`                       | DOM element directly (alternative to `selector`) |
| `image`    | `string`        | `''`                              | Path or URL to the background image              |
| `overlay`  | `string\|false` | `false`                           | HTML / text to display on overlay on hover       |
| `duration` | `number`        | `0.4`                             | Default transition duration (seconds)            |
| `delay`    | `number`        | `0`                               | Default enter animation delay (seconds)          |
| `easing`   | `string`        | `'cubic-bezier(0.25, 1, 0.5, 1)'` | CSS transition timing function                   |
| `parts`    | `Object[]`      | `[]`                              | Array of slicing definitions (see below)         |

### Part Options

| Name       | Type     | Default    | Description                         |
| ---------- | -------- | ---------- | ----------------------------------- |
| `x`        | `number` | `0`        | Target horizontal offset upon hover |
| `y`        | `number` | `0`        | Target vertical offset upon hover   |
| `width`    | `number` | `0`        | Width of the slice in pixels        |
| `height`   | `number` | `0`        | Height of the slice in pixels       |
| `duration` | `number` | _(parent)_ | Duration override for this slice    |
| `delay`    | `number` | _(parent)_ | Delay override for this slice       |
| `easing`   | `string` | _(parent)_ | Easing override for this slice      |

---

## Events

The container dispatches standard CustomEvents:
- `puffin:enter`: Emitted when mouse enters the element.
- `puffin:leave`: Emitted when mouse leaves the element.
- `puffin:click`: Emitted when the element is clicked.
- `customEvent`: Legacy event dispatched for backward compatibility.

Example:

```javascript
document.querySelector("#foo").addEventListener("puffin:enter", (e) => {
	console.log("Hovered!", e.detail.puffin);
});
```

---

## Development

```bash
# Start dev server
npm run dev

# Build library (with Vite)
npm run build

# Run unit tests
npm test

# Format code (with Biome)
npm run format

# Lint code (with Biome)
npm run lint
```

---

## License

[MIT](LICENSE.md)
