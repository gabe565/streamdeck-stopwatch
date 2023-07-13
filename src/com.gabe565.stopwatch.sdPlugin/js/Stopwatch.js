const States = {
  Stopped: 0,
  Running: 1,
  Paused: 2,
};

class Stopwatch {
  constructor(context) {
    this.context = context;
    this.tickInterval = null;
    this.state = States.Stopped;
    this._settings = {
      holdToClearTime: 300,
      frameColor: "#547cff",
      textColor: "#fff",
    };
    (async () => {
      const data = await fetch("actions/template/assets/frame.svg");
      const text = await data.text();
      this.frame = new DOMParser().parseFromString(text, "image/svg+xml");
      this.configureFrame(false);
    })();
  }

  start() {
    console.log("Starting stopwatch");
    this.state = States.Running;
    this.startTime = new Date();
    this.beginTick();
  }

  beginTick() {
    this.tick();
    this.stopTick();
    this.tickInterval = setInterval(() => this.tick(), 1000);
  }

  stopTick() {
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
    }
  }

  tick() {
    if (this.frame) {
      this.frame.querySelector("text").innerHTML = this.formattedTime;
      const contents = new XMLSerializer().serializeToString(this.frame);
      const encoded = `data:image/svg+xml;base64,${btoa(contents)}`;
      $SD.setImage(this.context, encoded, 1);
    }
  }

  stop() {
    console.log("Stopping stopwatch");
    this.stopTick();
    $SD.clearTitle(this.context);
    this.state = States.Stopped;
  }

  pause() {
    console.log("Pausing stopwatch");
    this.stopTick();
    this.state = States.Paused;
    this.add = new Date() - this.startTime;
  }

  unpause() {
    console.log("Unpausing stopwatch");
    this.state = States.Running;
    this.startTime = new Date() - this.add;
    this.beginTick();
  }

  keyDown({ payload: { state } }) {
    this.cancelKeyUp = false;
    this.pressTimeout = setTimeout(() => {
      if (this.state !== States.Stopped) {
        this.cancelKeyUp = true;
        this.stop();
      }
    }, this.settings.holdToClearTime);
  }

  configureFrame(render = true) {
    if (this.frame) {
      this.frame.querySelector("path").style.fill = this.settings.frameColor;
      this.frame.querySelector("text").style.fill = this.settings.textColor;
      if (render) {
        this.tick();
      }
    }
  }

  set settings(settings) {
    this._settings = settings;
    if (this.frame) {
      this.configureFrame();
    }
  }

  get settings() {
    return this._settings;
  }

  get sdState() {
    if (this.state === States.Stopped) {
      return 0;
    }
    return 1;
  }

  keyUp() {
    if (this.cancelKeyUp) {
      return;
    } else {
      clearTimeout(this.pressTimeout);
    }

    if (this.state === States.Stopped) {
      this.start();
    } else if (this.state === States.Running) {
      this.pause();
    } else if (this.state === States.Paused) {
      this.unpause();
    } else {
      console.error(`Invalid state: ${this.state}`);
      $SD.setState(this.context, States.Stopped);
    }

    $SD.setState(this.context, this.sdState);
  }

  get formattedTime() {
    let seconds = Math.floor((new Date() - this.startTime) / 1000);
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
}
