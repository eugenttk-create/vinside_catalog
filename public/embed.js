(function () {
  const ROOT_ID = "my-widget-root";

  const BASE = "https://vinside-dev.carcatonline.com";
  const JS = BASE + "/widget.js";
  const CSS = BASE + "/widget.css";
  const CSS2 = BASE + "/widget2.css";
  const script = document.currentScript;
  if (!script) {
    console.error("Cannot detect current script");
    return;
  }

  const token = script.dataset.token;
  const language = script.dataset.language;
  const link = script.dataset.link;

  const container = document.createElement("div");
  container.id = ROOT_ID;

  script.parentNode.insertBefore(container, script);

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
      mod.mountWidget(shadowRoot, { token, language, link });
    })
    .catch(console.error);
})();
