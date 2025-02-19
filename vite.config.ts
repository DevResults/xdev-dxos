import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import topLevelAwait from "vite-plugin-top-level-await"
import { ConfigPlugin } from "@dxos/config/vite-plugin"
import { resolve } from "node:path"
import wasm from "vite-plugin-wasm"
import icons from "unplugin-icons/vite"
import iconsResolver from "unplugin-icons/resolver"
import { type Options as AutoImportOptions } from "unplugin-auto-import/types"
import autoImport from "unplugin-auto-import/vite"

// auto-import setup for icons
const autoImportOptions: AutoImportOptions = {
  dts: false,
  resolvers: [
    iconsResolver({
      prefix: false,
      extension: "jsx",
      enabledCollections: ["tabler"],
      alias: { icon: "tabler" },
    }),
  ],
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./app/root.tsx"),
        shell: resolve(__dirname, "./public/shell.html"),
      },
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    topLevelAwait(),
    wasm(),
    ConfigPlugin(),
    autoImport(autoImportOptions),
    icons({ compiler: "jsx", jsx: "react" }),
  ],
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm()],
  },
  optimizeDeps: {
    // use route files as entry points when crawling for dependencies
    entries: ["**/routes/**/*.tsx"],
  },
})
