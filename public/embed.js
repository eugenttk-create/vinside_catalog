(function () {
  const script = document.currentScript;
  if (!script) {
    console.error("Cannot detect current script");
    return;
  }

  const configuredBase = "$VITE_BASE_URL";
  const base = !configuredBase || configuredBase.startsWith("$")
    ? new URL(".", script.src).href
    : configuredBase.replace(/\/$/, "") + "/";
  const container = document.createElement("div");
  container.id = "my-widget-root";
  script.parentNode.insertBefore(container, script);

  const options = {
    token: script.dataset.token,
    language: script.dataset.language,
    link: script.dataset.link,
    view: script.dataset.view,
  };

  import(new URL("widget.js", base).href)
    .then((mod) => {
      if (typeof mod.mountWidget !== "function") {
        throw new Error("mountWidget() not found in widget.js");
      }
      return mod.mountWidget(container, options);
    })
    .catch(console.error);
})();
