import { useCallback, useState } from "react"

/** Manages state for async batch operations with progress tracking. */
export function useBatchWork() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string>()
  const [error, setError] = useState<string>()

  const run = useCallback(async (work: BatchWorkFn) => {
    setIsRunning(true)
    setProgress(0)
    setResult(undefined)
    setError(undefined)

    // Yield so React can render the disabled/spinner state before work begins
    await new Promise<void>(r => requestAnimationFrame(r))

    try {
      const msg = await work(setProgress)
      setProgress(1)
      setResult(msg)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsRunning(false)
    }
  }, [])

  return { isRunning, progress, result, error, run }
}

export type BatchWorkFn = (
  /** Report progress from 0 to 1 */
  onProgress: (progress: number) => void,
) => Promise<string>
