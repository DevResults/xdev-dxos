/** Default pause between batches in milliseconds. */
const DEFAULT_BATCH_DELAY = 50

/** Process items one by one, yielding to the browser periodically so the UI stays responsive. */
export async function processBatch<T>(
  /** The items to process */
  items: T[],
  /** Called for each item */
  fn: (item: T) => void,
  /** Called with progress from 0 to 1 */
  onProgress?: (progress: number) => void,
  /** Milliseconds to pause between batches (default 50ms), giving the database time to catch up */
  batchDelay = DEFAULT_BATCH_DELAY,
) {
  let lastYield = performance.now()
  for (let i = 0; i < items.length; i++) {
    fn(items[i])
    const now = performance.now()
    if (now - lastYield > 16) {
      onProgress?.((i + 1) / items.length)
      await new Promise<void>(r => setTimeout(r, batchDelay))
      lastYield = performance.now()
    }
  }
  onProgress?.(1)
}
