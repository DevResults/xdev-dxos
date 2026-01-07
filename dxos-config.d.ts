declare module "@dxos/config/vite-plugin" {
  import type { Plugin } from "vite"

  export function ConfigPlugin(options?: { root?: string; env?: string[] }): Plugin
}
