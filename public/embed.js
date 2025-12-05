(function () {
  const WIDGET_CONTAINER_ID = "my-widget-root";
  const WIDGET_BUNDLE_URL = "https://vinside.carcatonline.com/widget.js";

  let container = document.getElementById(WIDGET_CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = WIDGET_CONTAINER_ID;
    document.body.appendChild(container);
  }

  const script = document.createElement("script");
  script.src = WIDGET_BUNDLE_URL;
  script.type = "module";
  script.onload = () => {
    import(WIDGET_BUNDLE_URL).then((mod) => {
      mod.mountWidget(container);
    });
  };

  document.body.appendChild(script);
})();
