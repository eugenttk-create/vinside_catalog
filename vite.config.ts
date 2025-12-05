import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  build: {
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
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
