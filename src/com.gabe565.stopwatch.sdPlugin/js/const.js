const Actions = {
  Reset: "reset",
  Pause: "pause",
};

const States = {
  Stopped: 0,
  Running: 1,
  Paused: 2,
};

const DefaultSettings = {
  frameColor: "#547cff",
  textColor: "#ffffff",
  indicatorColor: "#ee4b2b",
  secondsEnabled: "on",
  indicatorEnabled: "on",
  shortPressAction: Actions.Pause,
  longPressAction: Actions.Reset,
  longPressTime: 300,
  updateInterval: 250,
};
