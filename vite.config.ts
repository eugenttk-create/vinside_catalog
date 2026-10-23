import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { isolateWidgetCss } from "./build/isolateWidgetCss";

export default defineConfig({
  base: "/",
  plugins: [react()],
  css: {
    modules: { generateScopedName: "carcat_[name]_[local]_[hash:base64:6]" },
    postcss: { plugins: [isolateWidgetCss()] },
  },

  build: {
    cssCodeSplit: false,
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      preserveEntrySignatures: "strict",
      input: {
        main: resolve(__dirname, "index.html"),
        widget: resolve(__dirname, "src/embed-widget.tsx"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "widget") {
            return "widget.js";
          }
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? "";

          if (name.endsWith(".css")) {
            return "widget.css";
          }

          if (name.match(/\.(woff2?|ttf|eot|otf)$/)) {
            return "fonts/[name][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
