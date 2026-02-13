import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  plugins: [react()],

  build: {
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
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "widget.css";
          }
          return "assets/[name]-[hash].[ext]";
        },
      },
    },
  },
});
