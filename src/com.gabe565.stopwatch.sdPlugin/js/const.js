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
  indicatorEnabled: "on",
  shortPressAction: Actions.Reset,
  longPressAction: Actions.Pause,
  holdToClearTime: 300,
  updateInterval: 250,
};
