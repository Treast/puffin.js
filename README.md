# puffin.js
`puffin.js` is a new way to bring hover on your images.

 - [Installation](#installation)
	 - [NPM](#with-npm-recommended)
	 - [Git](#with-git)
- [Usage](#usage)
	- [Import](#import)
	- [Example](#example)
	- [Options](#options)

![Demonstration](https://i.imgur.com/JGAfbZG.gif)

Inspired by Oxygenna (https://www.uplabs.com/posts/extreme-hover)

# Installation
## With NPM (recommended)
`npm install puffin.js --save`

## With Git
`git clone https://github.com/Treast/puffin.js.git`
`mv ./puffin.js/dist/puffin.min.js ./foo/bar`

# Usage
## Import
`import Puffin from 'puffin.js`

## Example

      let puffin = new Puffin({
        selector: '#foo',
        image: './bar.jpg',
        overlay: "Demonstration puffin.js",
        duration: 0.4,
        delay: 0,
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
## Options
|Name|Informations|
|--|--|
|selector `(string)`|Where to put the image *(ex: `#myDiv`, `.myOtherDiv` ..)*|
|image `(string)`|The image to display|
|overlay `(string|false)`|The text displayed on the overlay (any string or `false` to disable)|
|duration `(float)`|The default animation duration (by default `0.4`)|
|delay `(float)`|The default delay between the mouse entering the image and the animation (by default `0`)|
|parts `Object[]`|The definitions of all the parts (rectangles)|
|x `(float)`|The position on the *x-axis* once hovered|
|y `(float)`|The position on the *y-axis* once hovered|
|height `(integer)`|The height of the part|
|width `(integer)`|The width of the part|
|duration `(float)`|The duration for that part|
|delay `(float)`|The delay for that part|
