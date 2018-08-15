export default class PuffinPart {
  constructor(element, imageSrc) {
    this.element = element;
    this.imageSrc = imageSrc;
    this.deltaX = parseFloat(this.element.getAttribute('data-x'));
    this.deltaY = parseFloat(this.element.getAttribute('data-y'));
    this.configuration = {
      delay: this.element.getAttribute('data-delay') || 0,
      duration: this.element.getAttribute('data-duration') || 0.4,
    };
    this.setBackground();
  }

  setSize() {
    let height = this.element.getAttribute('data-height');
    let width = this.element.getAttribute('data-width');

    this.element.style.height = height + 'px';
    this.element.style.width = width + 'px';
  }

  move(minX, minY, imageWidth, imageHeight) {
    if (this.deltaX < 0) {
      this.configuration.leftHover = this.deltaX + 'px';
      this.configuration.left = 0;
      this.configuration.backgroundLeft = minX;
    } else {
      this.configuration.leftHover =
        imageWidth -
        (this.element.getBoundingClientRect().width - this.deltaX) +
        'px';
      this.configuration.left =
        imageWidth - this.element.getBoundingClientRect().width + 'px';
      this.configuration.backgroundLeft =
        minX - imageWidth + this.element.getBoundingClientRect().width;
      //this.element.getBoundingClientRect().width + this.deltaX;
    }

    if (this.deltaY < 0) {
      this.configuration.topHover = this.deltaY + 'px';
      this.configuration.top = 0;
      this.configuration.backgroundTop = minY;
    } else {
      this.configuration.topHover =
        imageHeight -
        (this.element.getBoundingClientRect().height - this.deltaY) +
        'px';
      this.configuration.top =
        imageHeight - this.element.getBoundingClientRect().height + 'px';
      this.configuration.backgroundTop =
        minY - imageHeight + this.element.getBoundingClientRect().height;
      //this.element.getBoundingClientRect().height + this.deltaY;
    }

    TweenMax.set(this.element, {
      x: this.configuration.left,
      y: this.configuration.top,
      backgroundPosition:
        this.configuration.backgroundLeft +
        'px ' +
        this.configuration.backgroundTop +
        'px',
    });
  }

  animateIn() {
    TweenMax.to(this.element, this.configuration.duration, {
      x: this.configuration.leftHover,
      y: this.configuration.topHover,
      backgroundPosition: this.configuration.backgroundPosition,
      delay: this.configuration.delay,
    });
  }

  animateOut() {
    TweenMax.to(this.element, this.configuration.duration, {
      x: this.configuration.left,
      y: this.configuration.top,
      backgroundPosition:
        this.configuration.backgroundLeft +
        'px ' +
        this.configuration.backgroundTop +
        'px',
      delay: this.configuration.delay,
    });
  }

  setBackground(minX, minY, maxImageX, maxImageY, imageWidth, imageHeight) {
    let x = 0;
    let y = minY - this.deltaY;

    if (this.deltaX < 0) {
      x = minX - this.deltaX;
    } else {
      x = this.configuration.backgroundLeft - this.deltaX;
    }

    if (this.deltaY < 0) {
      y = minY - this.deltaY;
    } else {
      y = this.configuration.backgroundTop - this.deltaY;
    }

    this.configuration.backgroundPosition = x + 'px ' + y + 'px';
    this.element.style.backgroundSize = maxImageX + 'px ' + maxImageY + 'px';
    this.element.style.backgroundImage = 'url(' + this.imageSrc + ')';
  }
}
