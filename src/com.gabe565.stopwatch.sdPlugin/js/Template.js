class Template {
  constructor() {
    this.loaded = false;
  }

  formattedTime(difference) {
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      minutes %= 60;
      return `${hours}:${minutes.toString().padStart(2, "0")}`;
    } else {
      seconds %= 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  async load(url) {
    const data = await fetch(url);
    const text = await data.text();
    this.dom = new DOMParser().parseFromString(text, "image/svg+xml");
    this.loaded = true;
  }

  moveIndicator(difference) {
    const seconds = difference / 1000;
    console.log(seconds);
    const degrees = ((seconds / 60) % 60) * 2 * Math.PI;
    this.dom.querySelector("circle").cx.baseVal.value = Math.sin(degrees) * 24.25 + 35.75;
    this.dom.querySelector("circle").cy.baseVal.value = -1 * Math.cos(degrees) * 24.25 + 39.25;
  }

  renderBase64(startTime) {
    const difference = new Date() - startTime;
    this.dom.querySelector("text").innerHTML = this.formattedTime(difference);
    this.moveIndicator(difference);
    const contents = new XMLSerializer().serializeToString(this.dom);
    return `data:image/svg+xml;base64,${btoa(contents)}`;
  }

  setStyle(selector, style, value) {
    this.dom.querySelector(selector).style[style] = value;
  }
}
