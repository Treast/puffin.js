import * as _ from 'lodash';
import { TweenMax } from 'gsap';
import PuffinPart from './PuffinPart';
import './Puffin.scss';

class Puffin {
  constructor(options) {
    this.options = options;
    this.element = document.querySelector(options.selector);
    this.element.classList.add('puffin');
    this.imageSrc = options.image;
    this.parts = [];
    this.buildParts();
    this.setupHtml();
    this.setupHover();
    this.setupOverlay();
    this.setupListeners();
  }

  buildParts() {
    this.options.parts.forEach((part) => {
      let div = document.createElement('div');
      div.setAttribute('data-x', part.x);
      div.setAttribute('data-y', part.y);
      div.setAttribute('data-height', part.height);
      div.setAttribute('data-width', part.width);
      div.setAttribute('data-duration', part.duration || this.options.duration || 0.4);
      div.setAttribute('data-delay', part.delay || this.options.delay || 0);
      div.classList.add('puffin--part');
      this.element.append(div);
      this.parts.push(new PuffinPart(div, this.imageSrc));
    });
  }

  setupOverlay() {
    if (this.options.overlay) {
      let overlayText = this.options.overlay;
      let overlay = document.createElement('div');
      overlay.classList.add('puffin--overlay');
      overlay.innerHTML = overlayText;
      this.element.prepend(overlay);
      this.overlay = overlay;
    } else {
      this.overlay = null;
    }
  }

  setupListeners() {
    this.element.addEventListener('mouseover', (e) => {
      this.parts.forEach((part) => {
        part.animateIn();
      });
      if (this.overlay) {
        TweenMax.to(this.overlay, 0.4, {
          alpha: 1,
        });
      }
      this.element.dispatchEvent(new Event('customEvent'));
    });
    this.element.addEventListener('mouseleave', (e) => {
      this.parts.forEach((part) => {
        part.animateOut();
      });
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

  setupHtml() {
    let minX = this.getMinimumPart('data-x');
    let minY = this.getMinimumPart('data-y');

    this.parts.forEach((part) => {
      part.setSize();
      part.move(minX, minY, this.element.getBoundingClientRect().width, this.element.getBoundingClientRect().height);
    });
  }

  setupHover() {
    let minX = this.getMinimumPart('data-x');
    let maxX = this.getMaximumPart('data-x');
    let minY = this.getMinimumPart('data-y');
    let maxY = this.getMaximumPart('data-y');
    let maxImageX = this.element.getBoundingClientRect().width + Math.abs(minX) + Math.abs(maxX);
    let maxImageY = this.element.getBoundingClientRect().height + Math.abs(minY) + Math.abs(maxY);
    let centerImage = {
      x: maxImageX / 2,
      y: maxImageY / 2,
    };
    let positionImage = {
      x: (centerImage.x + Math.abs(minX)) * -1,
      y: (centerImage.y + Math.abs(minY)) * -1,
    };

    this.element.style.backgroundPosition = Math.floor(minX) + 'px ' + Math.floor(minY) + 'px';
    this.element.style.backgroundSize = maxImageX + 'px ' + maxImageY + 'px';
    this.element.style.backgroundImage = 'url(' + this.imageSrc + ')';
    this.parts.forEach((part) => {
      part.setBackground(
        Math.floor(minX),
        Math.floor(minY),
        maxImageX,
        maxImageY,
        this.element.getBoundingClientRect().width,
        this.element.getBoundingClientRect().height
      );
    });
  }

  getMinimumPart(attribute) {
    let minimum = _.minBy(this.parts, (part) => {
      return part.element.getAttribute(attribute);
    }).element.getAttribute(attribute);
    return parseFloat(minimum);
  }

  getMaximumPart(attribute) {
    let maximum = _.maxBy(this.parts, (part) => {
      return part.element.getAttribute(attribute);
    }).element.getAttribute(attribute);
    return parseFloat(maximum);
  }
}
window.Puffin = Puffin;
export default Puffin;
