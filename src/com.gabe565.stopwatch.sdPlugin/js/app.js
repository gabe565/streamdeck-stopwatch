/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="js/Stopwatch.js" />

const stopwatchAction = new Action("com.gabe565.stopwatch.action");

const contexts = {};

stopwatchAction.onDidReceiveSettings((data) => {
  const stopwatch = newOrGetStopwatch(data);
  stopwatch.settings = data.payload.settings;
});

stopwatchAction.onKeyDown((data) => {
  newOrGetStopwatch(data).keyDown(data);
});

stopwatchAction.onKeyUp((data) => {
  newOrGetStopwatch(data).keyUp(data);
});

const newOrGetStopwatch = ({ context, payload: { settings } }) => {
  if (!contexts[context]) {
    contexts[context] = new Stopwatch(context);
    contexts[context].settings = settings;
  }
  return contexts[context];
};
