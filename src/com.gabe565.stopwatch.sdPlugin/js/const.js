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
  shortPressAction: Actions.Reset,
  longPressAction: Actions.Pause,
  holdToClearTime: 300,
  frameColor: "#547cff",
  textColor: "#ffffff",
};
