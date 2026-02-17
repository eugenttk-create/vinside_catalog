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

  const shadowRoot = container.attachShadow({ mode: "open" });

  const link1 = document.createElement("link");
  link1.rel = "stylesheet";
  link1.href = CSS;
  shadowRoot.appendChild(link1);

  const link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = CSS2;
  shadowRoot.appendChild(link2);

  import(JS)
    .then((mod) => {
      if (typeof mod.mountWidget !== "function") {
        console.error("mountWidget() not found in widget.js", mod);
        return;
      }
      mod.mountWidget(shadowRoot);
    })
    .catch(console.error);
})();
