class Template {
  constructor() {
    this.loaded = false;
  }

  formattedTime(difference, secondsEnabled) {
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      minutes %= 60;
      return `${hours}:${minutes.toString().padStart(2, "0")}`;
    } else {
      if (secondsEnabled) {
        seconds %= 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      } else {
        return `${minutes}`;
      }
    }
  }

  async load(url) {
    const data = await fetch(url);
    let text = await data.text();
    text = text.replaceAll(/>\s+</g, "><");
    this.dom = new DOMParser().parseFromString(text, "image/svg+xml");
    this.loaded = true;
  }

  moveIndicator(difference) {
    const seconds = difference / 1000;
    const degrees = ((seconds / 60) % 60) * 2 * Math.PI;
    this.dom.querySelector("circle").cx.baseVal.value = Math.sin(degrees) * 24.25 + 35.75;
    this.dom.querySelector("circle").cy.baseVal.value = -1 * Math.cos(degrees) * 24.25 + 39.25;
  }

  renderBase64(startTime, settings) {
    const difference = new Date() - startTime;
    this.dom.querySelector("text").innerHTML = this.formattedTime(
      difference,
      settings.secondsEnabled,
    );
    if (settings.indicatorEnabled) {
      this.moveIndicator(difference);
    }
    const contents = new XMLSerializer().serializeToString(this.dom);
    return `data:image/svg+xml;base64,${btoa(contents)}`;
  }

  set frameColor(color) {
    this.dom.querySelector("path").style.fill = color;
  }

  set textColor(color) {
    this.dom.querySelector("text").style.fill = color;
  }

  set showIndicator(shown) {
    this.dom.querySelector("circle").style.display = shown ? "" : "none";
  }

  set indicatorColor(color) {
    this.dom.querySelector("circle").style.fill = color;
  }
}
