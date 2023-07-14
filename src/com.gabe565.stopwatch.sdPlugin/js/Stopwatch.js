class Stopwatch {
  constructor(context) {
    this.context = context;
    this.tickInterval = null;
    this.state = States.Stopped;
    this._settings = DefaultSettings;
    (async () => {
      const data = await fetch("actions/template/assets/state_1.svg");
      const text = await data.text();
      this.frame = new DOMParser().parseFromString(text, "image/svg+xml");
      this.configureFrame(false);
    })();
  }

  set settings(settings) {
    if (Object.keys(settings).length === 0) {
      this._settings = DefaultSettings;
    } else {
      this._settings = settings;
    }
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

  tick() {
    if (this.frame) {
      this.frame.querySelector("text").innerHTML = this.formattedTime;
      const contents = new XMLSerializer().serializeToString(this.frame);
      const encoded = `data:image/svg+xml;base64,${btoa(contents)}`;
      $SD.setImage(this.context, encoded, 1);
    }
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

  configureFrame(render = true) {
    if (this.frame) {
      this.frame.querySelector("path").style.fill = this.settings.frameColor;
      this.frame.querySelector("text").style.fill = this.settings.textColor;
      if (render) {
        this.tick();
      }
    }
  }

  start() {
    console.log("Starting stopwatch");
    this.startTime = new Date();
    this.beginTick();
    this.state = States.Running;
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
    this.add = new Date() - this.startTime;
    this.state = States.Paused;
  }

  unpause() {
    console.log("Unpausing stopwatch");
    this.startTime = new Date() - this.add;
    this.beginTick();
    this.state = States.Running;
  }

  keyDown() {
    this.cancelKeyUp = false;
    if (this.state !== States.Stopped) {
      this.pressTimeout = setTimeout(() => {
        this.cancelKeyUp = true;
        if (this.settings.longPressAction === Actions.Reset) {
          this.stop();
        } else if (this.settings.longPressAction === Actions.Pause) {
          if (this.state === States.Running) {
            this.pause();
          } else if (this.state === States.Paused) {
            this.unpause();
          }
        }
        $SD.setState(this.context, this.sdState);
      }, this.settings.longPressTime);
    }
  }

  keyUp() {
    if (!this.cancelKeyUp) {
      clearTimeout(this.pressTimeout);
      if (this.state === States.Stopped) {
        this.start();
      } else if (this.state === States.Running) {
        if (this.settings.shortPressAction === Actions.Pause) {
          this.pause();
        } else if (this.settings.shortPressAction === Actions.Reset) {
          this.stop();
        }
      } else if (this.state === States.Paused) {
        if (this.settings.shortPressAction === Actions.Pause) {
          this.unpause();
        } else if (this.settings.shortPressAction === Actions.Reset) {
          this.stop();
        }
      } else {
        console.error(`Invalid state: ${this.state}`);
        $SD.setState(this.context, States.Stopped);
      }
    }

    $SD.setState(this.context, this.sdState);
  }

  set active(active) {
    if (active) {
      if (this.state === States.Running) {
        this.beginTick();
      }
    } else {
      this.stopTick();
    }
  }
}
