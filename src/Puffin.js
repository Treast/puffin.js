import * as _ from 'lodash';
import { TweenMax } from 'gsap';
import { PuffinPart } from './PuffinPart';

export default class Puffin {
  constructor(options) {
    this.options = options;
    this.element = document.querySelector(options.selector);
    this.imageSrc = options.image;
    this.parts = [];
    this.buildParts();
    this.setupParts();
    this.setupHtml();
    this.setupHover();
    this.setupOverlay();
    this.setupListeners();
  }

  buildParts() {
    for (let part of this.options.parts) {
      let div = document.createElement('div');
      div.setAttribute('data-x', part.x);
      div.setAttribute('data-y', part.y);
      div.setAttribute('data-height', part.height);
      div.setAttribute('data-width', part.width);
      div.setAttribute(
        'data-duration',
        part.duration || this.options.duration || 0.4,
      );
      div.setAttribute('data-delay', part.delay || this.options.delay || 0);
      div.classList.add('hover__image--part');
      this.element.append(div);
    }
  }

  setupOverlay() {
    if (this.options.overlay) {
      let overlayText = this.options.overlay;
      let overlay = document.createElement('div');
      overlay.classList.add('hover__image--overlay');
      overlay.innerHTML = overlayText;
      this.element.prepend(overlay);
      this.overlay = overlay;
    } else {
      this.overlay = null;
    }
  }

  setupListeners() {
    this.element.addEventListener('mouseover', e => {
      for (let part of this.parts) {
        part.animateIn();
      }
      if (this.overlay) {
        TweenMax.to(this.overlay, 0.4, {
          alpha: 1,
        });
      }
      this.element.dispatchEvent(new Event('customEvent'));
    });
    this.element.addEventListener('mouseleave', e => {
      for (let part of this.parts) {
        part.animateOut();
      }
      if (this.overlay) {
        TweenMax.to(this.overlay, 0.4, {
          alpha: 0,
        });
      }
      this.element.dispatchEvent(new Event('customEvent'));
    });
    this.element.addEventListener('click', () => {
      this.element.dispatchEvent(new Event('customEvent'));
    });
  }

  setupParts() {
    for (let part of this.element.querySelectorAll('.hover__image--part')) {
      this.parts.push(new PuffinPart(part, this.imageSrc));
    }
  }

  setupHtml() {
    let minX = this.getMinimumPart('data-x');
    let minY = this.getMinimumPart('data-y');
    for (let part of this.parts) {
      part.setSize();
      part.move(
        minX,
        minY,
        this.element.getBoundingClientRect().width,
        this.element.getBoundingClientRect().height,
      );
    }
  }

  setupHover() {
    let minX = this.getMinimumPart('data-x');
    let maxX = this.getMaximumPart('data-x');
    let minY = this.getMinimumPart('data-y');
    let maxY = this.getMaximumPart('data-y');
    let maxImageX =
      this.element.getBoundingClientRect().width +
      Math.abs(minX) +
      Math.abs(maxX);
    let maxImageY =
      this.element.getBoundingClientRect().height +
      Math.abs(minY) +
      Math.abs(maxY);
    let centerImage = {
      x: maxImageX / 2,
      y: maxImageY / 2,
    };
    let positionImage = {
      x: (centerImage.x + Math.abs(minX)) * -1,
      y: (centerImage.y + Math.abs(minY)) * -1,
    };

    this.element.style.backgroundPosition =
      Math.floor(minX) + 'px ' + Math.floor(minY) + 'px';
    this.element.style.backgroundSize = maxImageX + 'px ' + maxImageY + 'px';
    this.element.style.backgroundImage = 'url(' + this.imageSrc + ')';
    for (let part of this.parts) {
      part.setBackground(
        Math.floor(minX),
        Math.floor(minY),
        maxImageX,
        maxImageY,
        this.element.getBoundingClientRect().width,
        this.element.getBoundingClientRect().height,
      );
    }
  }

  getMinimumPart(attribute) {
    let minimum = _.minBy(this.parts, part => {
      return part.element.getAttribute(attribute);
    }).element.getAttribute(attribute);
    return parseFloat(minimum);
  }

  getMaximumPart(attribute) {
    let maximum = _.maxBy(this.parts, part => {
      return part.element.getAttribute(attribute);
    }).element.getAttribute(attribute);
    return parseFloat(maximum);
  }
}
