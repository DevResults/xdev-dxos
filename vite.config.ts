import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import topLevelAwait from "vite-plugin-top-level-await";
import { ConfigPlugin } from "@dxos/config/vite-plugin";
import { resolve } from "node:path";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./app/root.tsx"),
        shell: resolve(__dirname, "./public/shell.html"),
      },
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), topLevelAwait(), wasm(), ConfigPlugin()],
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm()],
  },
});
