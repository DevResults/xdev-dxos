/** Process items one by one, yielding to the browser periodically so the UI stays responsive. */
export async function processBatch<T>(
  /** The items to process */
  items: T[],
  /** Called for each item */
  fn: (item: T) => void,
  /** Called with progress from 0 to 1 */
  onProgress?: (progress: number) => void,
) {
  let lastYield = performance.now()
  for (let i = 0; i < items.length; i++) {
    fn(items[i])
    const now = performance.now()
    if (now - lastYield > 16) {
      onProgress?.((i + 1) / items.length)
      await new Promise<void>(r => requestAnimationFrame(r))
      lastYield = performance.now()
    }
  }
  onProgress?.(1)
}
