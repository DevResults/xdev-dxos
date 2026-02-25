/**
 * Browser stub for Node's `util` module. Provides minimal implementations of
 * `debuglog` and `inspect`, which are the only functions accessed at runtime by
 * `readable-stream` (via @dxos/node-std).
 */

/** Returns a no-op logger. */
export const debuglog = () => () => {}

/** Returns a basic string representation. */
export const inspect = (obj: unknown) => String(obj)

export default { debuglog, inspect }
