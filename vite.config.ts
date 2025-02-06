import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import topLevelAwait from "vite-plugin-top-level-await";
import { ConfigPlugin } from "@dxos/config/vite-plugin";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), topLevelAwait(), wasm(), ConfigPlugin()],
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm()],
  },
});
