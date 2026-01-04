import fs from "node:fs"
import path from "node:path"
import { type Plugin } from "vite"
import { defineConfig } from "vitest/config"
import topLevelAwait from "vite-plugin-top-level-await"
import { ConfigPlugin } from "@dxos/config/vite-plugin"
import ReactPlugin from "@vitejs/plugin-react"
import wasm from "vite-plugin-wasm"

const combineShellWithApp = () => ({
  name: "combineShellWithApp",
  closeBundle() {
    const dist = "./dist"
    const build = "./build/client"

    if (!fs.existsSync(dist) || !fs.existsSync(build)) {
      return
    }

    // copy the shell file
    fs.renameSync(path.join(dist, "public", "shell.html"), path.join(build, "shell.html"))

    // copy all the assets
    for (const asset of fs.readdirSync(path.join(dist, "assets"))) {
      fs.renameSync(path.join(dist, "assets", asset), path.join(build, "assets", asset))
    }

    // remove the remaining
    fs.rmSync(dist, { recursive: true, force: true })
  },
})

export default defineConfig({
  build: {
    copyPublicDir: false, // those files are for xdev, not the shell
    rollupOptions: {
      input: "./public/shell.html",
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  plugins: [
    ConfigPlugin(),
    topLevelAwait(),
    wasm() as Plugin,
    ReactPlugin({ jsxRuntime: "classic" }),
    combineShellWithApp(),
  ],
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm() as Plugin],
  },
  optimizeDeps: {
    // use route files as entry points when crawling for dependencies
    entries: ["**/routes/**/*.tsx"],
  },
  test: { include: ["app/**/*.test.ts"] },
})
