class Template {
  constructor() {
    this.loaded = false;
  }

  async load(url) {
    const data = await fetch(url);
    const text = await data.text();
    this.dom = new DOMParser().parseFromString(text, "image/svg+xml");
    this.loaded = true;
  }

  renderBase64(formattedTime) {
    this.dom.querySelector("text").innerHTML = formattedTime;
    const contents = new XMLSerializer().serializeToString(this.dom);
    return `data:image/svg+xml;base64,${btoa(contents)}`;
  }

  setStyle(selector, style, value) {
    this.dom.querySelector(selector).style[style] = value;
  }
}
