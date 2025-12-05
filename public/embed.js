(function () {
  const ROOT_ID = "my-widget-root";

  const BASE = "https://vinside.carcatonline.com";
  const JS = BASE + "/widget.js";
  const CSS = BASE + "/widget.css";
  const CSS2 = BASE + "/widget2.css";

  let container = document.getElementById(ROOT_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = ROOT_ID;
    document.body.appendChild(container);
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CSS;
  document.head.appendChild(link);

  const link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = CSS2;
  document.head.appendChild(link2);

  import(JS)
    .then((mod) => mod.mountWidget(container))
    .catch(console.error);
})();
