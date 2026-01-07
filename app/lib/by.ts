/**
 * Sorts an array of objects by a given key.
 * @example
 * ```ts
 * contacts.sort(by('firstName'))
 * ```
 */
export const by =
  <T, K extends keyof T>(key: K) =>
  (a: T, b: T) => {
    const aValue = String(a[key])
    const bValue = String(b[key])
    return aValue.localeCompare(bValue)
  }
