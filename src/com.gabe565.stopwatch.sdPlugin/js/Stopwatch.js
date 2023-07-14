const stopwatchMap = {};

class Stopwatch {
  constructor({ context, payload: { settings } }) {
    this.template = new Template();
    this.template
      .load("actions/template/assets/state_1.svg")
      .then(() => this.configureFrame(false))
      .catch((err) => {
        $SD.showAlert(this.context);
        console.error(err);
      });
    this.context = context;
    this.tickInterval = null;
    this.state = States.Stopped;
    this.settings = settings;
  }

  static Get(data) {
    if (!stopwatchMap[data.context]) {
      stopwatchMap[data.context] = new Stopwatch(data);
    }
    return stopwatchMap[data.context];
  }

  set settings(settings) {
    if (Object.keys(settings).length === 0) {
      this._settings = DefaultSettings;
    } else {
      this._settings = settings;
    }
    if (this.template.loaded) {
      this.configureFrame();
    }
  }

  get settings() {
    return this._settings;
  }

  set state(state) {
    this._state = state;
    this.emitState();
  }

  emitState() {
    let sdState = 0;
    if (this.state !== States.Stopped) {
      sdState = 1;
    }
    $SD.setState(this.context, sdState);
  }

  get state() {
    return this._state;
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
    if (this.template.loaded) {
      const encoded = this.template.renderBase64(this.formattedTime);
      $SD.setImage(this.context, encoded, 1);
    }
  }

  beginTick() {
    this.tick();
    this.stopTick();
    this.tickInterval = setInterval(() => this.tick(), 1000);
  }

  stopTick() {
    clearInterval(this.tickInterval);
  }

  configureFrame(render = true) {
    if (this.template.loaded) {
      this.template.setStyle("path", "fill", this.settings.frameColor);
      this.template.setStyle("text", "fill", this.settings.textColor);
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
        $SD.showAlert(this.context);
      }
    } else {
      this.emitState();
    }
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
