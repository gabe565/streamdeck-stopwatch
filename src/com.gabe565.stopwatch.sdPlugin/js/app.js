/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="js/Stopwatch.js" />

const stopwatchAction = new Action("com.gabe565.stopwatch.action");

stopwatchAction.onDidReceiveSettings(
  (data) => (Stopwatch.Get(data).settings = data.payload.settings),
);

stopwatchAction.onKeyDown((data) => Stopwatch.Get(data).keyDown());

stopwatchAction.onKeyUp((data) => Stopwatch.Get(data).keyUp());

stopwatchAction.onWillDisappear((data) => (Stopwatch.Get(data).active = false));
stopwatchAction.onWillAppear((data) => (Stopwatch.Get(data).active = true));
