/// <reference path="../../../libs/js/property-inspector.js" />
/// <reference path="../../../libs/js/utils.js" />

$PI.onConnected((jsn) => {
  const form = document.querySelector("#property-inspector");
  const { actionInfo, appInfo, connection, messageType, port, uuid } = jsn;
  const { payload, context } = actionInfo;
  const { settings } = payload;

  if (Object.keys(settings).length !== 0) {
    Utils.setFormValue(settings, form);
  } else {
    Utils.setFormValue(DefaultSettings, form);
  }

  form.addEventListener(
    "input",
    Utils.debounce(150, () => {
      const value = Utils.getFormValue(form);
      $PI.setSettings(value);
    }),
  );
});

document.querySelector("#reset").addEventListener("click", () => {
  const form = document.querySelector("#property-inspector");
  Utils.setFormValue(DefaultSettings, form);
  const value = Utils.getFormValue(form);
  $PI.setSettings(value);
});
