import { resolve } from "node:path"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig, type Plugin } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import topLevelAwait from "vite-plugin-top-level-await"
import { ConfigPlugin } from "@dxos/config/vite-plugin"
import wasm from "vite-plugin-wasm"
import icons from "unplugin-icons/vite"
import iconsResolver from "unplugin-icons/resolver"
import { type Options as AutoImportOptions } from "unplugin-auto-import/types"
import { VitePWA as vitePWA, type VitePWAOptions } from "vite-plugin-pwa"
import autoImport from "unplugin-auto-import/vite"

const pwaOptions: Partial<VitePWAOptions> = {
  includeAssets: ["favicon.ico"],
  srcDir: "app",
  filename: "sw.ts",
  registerType: "autoUpdate",
  strategies: "injectManifest",
  injectManifest: { globPatterns: ["**/*.{js,css,html,ico,wasm}"] },
  manifest: {
    name: "XDev",
    short_name: "XDev",
    description: "DevResults local-first team app",
    theme_color: "#ffffff",
    background_color: "#FFFFFF",
    display: "standalone",
    icons: [
      { src: "icon-128x128.png", sizes: "128x128", type: "image/png", purpose: "any maskable" },
      { src: "icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "icon-256x256.png", sizes: "256x256", type: "image/png", purpose: "any maskable" },
      { src: "icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  },
}

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
        main: resolve(import.meta.dirname, "./app/root.tsx"),
        shell: resolve(import.meta.dirname, "./public/shell.html"),
      },
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    topLevelAwait(),
    wasm() as Plugin,
    ConfigPlugin(),
    vitePWA(pwaOptions),
    autoImport(autoImportOptions) as Plugin,
    icons({ compiler: "jsx", jsx: "react" }),
  ],
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm() as Plugin],
  },
  optimizeDeps: {
    // use route files as entry points when crawling for dependencies
    entries: ["**/routes/**/*.tsx"],
  },
})
