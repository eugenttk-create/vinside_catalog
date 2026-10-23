import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Use Node's test runner and the same TS bundler already used by Vite.
const output = new URL("../node_modules/.tmp/navigation.test.mjs", import.meta.url);
const result = await build({
  entryPoints: [fileURLToPath(new URL("../tests/navigation.test.mjs", import.meta.url))],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  write: false,
  define: { "import.meta.env": JSON.stringify({ VITE_API_URL: "https://catalog.test", VITE_API_TOKEN: "test" }) },
  plugins: [{
    name: "bundle-jsencrypt",
    setup(build) {
      build.onResolve({ filter: /^jsencrypt$/ }, () => ({
        path: fileURLToPath(new URL("../node_modules/jsencrypt/lib/index.js", import.meta.url)),
      }));
    },
  }],
});
await mkdir(new URL(".", output), { recursive: true });
await writeFile(output, result.outputFiles[0].contents);
const run = spawnSync(process.execPath, ["--test", fileURLToPath(output)], { stdio: "inherit" });
process.exitCode = run.status ?? 1;
