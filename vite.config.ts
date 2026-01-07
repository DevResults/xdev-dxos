import { reactRouter } from "@react-router/dev/vite"
import { type Plugin } from "vite"
import { defineConfig } from "vitest/config"
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
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,ico,wasm}"],
    maximumFileSizeToCacheInBytes: 5_000_000, // default is ~2MB but DXOS 0.8.x bundles are larger
  },
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

// Don't load remix plugin when vite is being used by storybook
// https://github.com/remix-run/remix/issues/7953#issuecomment-1805649822
const isStorybook = process.argv[1].includes("storybook")

export default defineConfig({
  plugins: [
    !isStorybook && reactRouter(),
    tsconfigPaths(),
    wasm(),
    ConfigPlugin(),
    vitePWA(pwaOptions),
    autoImport(autoImportOptions),
    icons({ compiler: "jsx", jsx: "react" }),
    topLevelAwait(), // needed for DXOS WASM modules
    // Skip PostCSS for DXOS CSS files that use their own Tailwind classes
    {
      name: "skip-postcss-for-dxos",
      enforce: "pre",
      transform(code, id) {
        if (id.includes("node_modules/@dxos") && id.endsWith(".pcss")) {
          // Return raw CSS without @apply transforms
          return {
            code: code.replaceAll(/@apply\s+[^;]+;/g, "/* skipped @apply */"),
            map: null,
          }
        }
      },
    },
  ] as Plugin[],
  // DXOS 0.8.x requires modern browser targets for top-level await support
  build: {
    target: "esnext",
  },
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm() as Plugin],
  },
  optimizeDeps: {
    // use route files as entry points when crawling for dependencies
    entries: ["**/routes/**/*.tsx"],
    // force DXOS packages to be pre-bundled upfront to avoid race conditions
    // during test startup where dynamic imports fail with 404
    include: [
      "@dxos/react-client",
      "@dxos/react-client/echo",
      "@dxos/react-client/halo",
      "@dxos/config",
      "@dxos/echo-schema",
      "@dxos/shell/react",
    ],
  },
  test: { include: ["app/**/*.test.ts"] },
})
