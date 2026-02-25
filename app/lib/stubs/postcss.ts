/**
 * Browser stub for postcss. The real postcss is only needed at build time (via
 * Vite's PostCSS pipeline). This stub prevents Node-module-externalization
 * warnings that occur when @ch-ui/tokens pulls postcss into the client bundle.
 */

const noop = () => ({})

export const parse = noop
export const stringify = noop
export const fromJSON = noop
export const plugin = noop
export const list = { space: noop, comma: noop }
export const document = noop
export const comment = noop
export const atRule = noop
export const rule = noop
export const decl = noop
export const root = noop

export const CssSyntaxError = class {}
export const Declaration = class {}
export const Container = class {}
export const Document = class {}
export const Comment = class {}
export const AtRule = class {}
export const Rule = class {}
export const Root = class {}
export const Node = class {}
export const Input = class {}
export const Result = class {}
export const Warning = class {}
export const Processor = class {}
export const LazyResult = class {}

const postcss = Object.assign(noop, {
  parse,
  stringify,
  fromJSON,
  plugin,
  list,
  document,
  comment,
  atRule,
  rule,
  decl,
  root,
})

export default postcss
