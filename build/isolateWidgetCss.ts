import type { Plugin } from "postcss";

// The repeated widget IDs give the local reset enough specificity to beat
// ordinary host-site ID/tag rules. Inline styles used for zoom/resize still win.
const scope = ":is(:global(#my-widget-root#my-widget-root), :global(#widget-catalog-portal#widget-catalog-portal), :global([data-carcat-root]))";

export function isolateWidgetCss(): Plugin {
  return {
    postcssPlugin: "carcat-isolate-css",
    Once(root) {
      const file = root.source?.input.file?.replaceAll("\\", "/") ?? "";
      if (file.endsWith("/scope.module.css") || file.endsWith("/demo.module.css")) return;
      root.walkRules((rule) => {
        if (rule.parent?.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
        rule.selectors = rule.selectors.map((selector) => `${scope} ${selector}`);
      });
    },
  };
}
