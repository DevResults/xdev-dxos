import { resolve } from "node:path"
import { ConfigPlugin } from "@dxos/config/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { type Options as AutoImportOptions } from "unplugin-auto-import/types"
import autoImport from "unplugin-auto-import/vite"
import iconsResolver from "unplugin-icons/resolver"
import icons from "unplugin-icons/vite"
import { type Plugin } from "vite"
import { VitePWA as vitePWA, type VitePWAOptions } from "vite-plugin-pwa"
import topLevelAwait from "vite-plugin-top-level-await"
import wasm from "vite-plugin-wasm"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

const pwaOptions: Partial<VitePWAOptions> = {
  includeAssets: ["favicon.ico"],
  srcDir: "app",
  filename: "sw.ts",
  registerType: "autoUpdate",
  strategies: "injectManifest",
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,ico,wasm}"],
    maximumFileSizeToCacheInBytes: 5_000_000, // Default is ~2MB but DXOS 0.8.x bundles are larger
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

// Auto-import setup for icons
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
const isVitest = process.env.VITEST === "true"

/**
 * Suppress noisy build warnings from third-party deps that we can't fix.
 * These warnings come from Rollup (console.warn), esbuild (stderr), and
 * Vite's reporter, so we intercept at the process level.
 */
const suppressedPatterns = [
  "Use of eval", // onnxruntime-web, protobufjs
  "@apply -mie-", // @dxos/lit-ui CSS @apply directives
  "Some chunks are larger than", // DXOS bundles are inherently large
  "css-syntax-error", // esbuild CSS warnings for @apply
]

const shouldSuppress = (text: string) => suppressedPatterns.some(p => text.includes(p))

const originalConsoleWarn = console.warn
console.warn = (...args: unknown[]) => {
  if (args.some(a => typeof a === "string" && shouldSuppress(a))) return
  originalConsoleWarn(...args)
}

const originalStderrWrite = process.stderr.write.bind(process.stderr)
process.stderr.write = ((chunk: any, ...rest: any[]) => {
  if (typeof chunk === "string" && shouldSuppress(chunk)) return true
  return originalStderrWrite(chunk, ...rest)
}) as typeof process.stderr.write

export default defineConfig({
  plugins: [
    !isStorybook && !isVitest && reactRouter(),
    tsconfigPaths(),
    wasm(),
    ConfigPlugin(),
    vitePWA(pwaOptions),
    autoImport(autoImportOptions),
    icons({ compiler: "jsx", jsx: "react" }),
    topLevelAwait(), // Needed for DXOS WASM modules
    // Strip invalid @apply directives from DXOS CSS/PCSS files to prevent
    // PostCSS errors and esbuild minification warnings (e.g. @apply -mie-2)
    {
      name: "strip-dxos-apply",
      enforce: "pre",
      transform(code, id) {
        if (id.includes("node_modules/@dxos") && (id.endsWith(".pcss") || id.endsWith(".css"))) {
          return {
            code: code.replaceAll(/@apply\s+[^;}]+;?/g, "/* skipped @apply */"),
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
  resolve: {
    alias: {
      // Suppress "module externalized for browser compatibility" console warnings.
      // postcss is pulled into the client bundle by @ch-ui/tokens (via @dxos/react-ui-theme)
      // but only runs at build time; util is used by readable-stream (via @dxos/node-std)
      // for optional debug logging.
      postcss: resolve(__dirname, "app/lib/stubs/postcss.ts"),
      util: resolve(__dirname, "app/lib/stubs/util.ts"),
    },
  },
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm() as Plugin],
  },
  optimizeDeps: {
    // Use route files as entry points when crawling for dependencies
    entries: ["**/routes/**/*.tsx"],
    // Force DXOS packages to be pre-bundled upfront to avoid race conditions
    // during test startup where dynamic imports fail with 404
    include: [
      "@dxos/react-client",
      "@dxos/react-client/echo",
      "@dxos/react-client/halo",
      "@dxos/react-client/worker",
      "@dxos/config",
      "@dxos/echo-schema",
      "@dxos/shell/react",
    ],
  },
  test: { include: ["app/**/*.test.ts", "app/**/*.test.tsx"] },
})
