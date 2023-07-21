/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="js/Stopwatch.js" />

const stopwatchAction = new Action("com.gabe565.stopwatch.action");

stopwatchAction.onDidReceiveSettings((data) => {
  Stopwatch.IfExists(data.context, (stopwatch) => (stopwatch.settings = data.payload.settings));
});

stopwatchAction.onKeyDown((data) => new Stopwatch(data).keyDown());

stopwatchAction.onKeyUp((data) => new Stopwatch(data).keyUp());

stopwatchAction.onWillDisappear((data) => {
  Stopwatch.IfExists(data.context, (stopwatch) => (stopwatch.active = false));
});

stopwatchAction.onWillAppear((data) => {
  Stopwatch.IfExists(data.context, (stopwatch) => (stopwatch.active = true));
});
