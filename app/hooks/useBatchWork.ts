import { useCallback, useState } from "react"

/** Manages state for async batch operations with progress tracking. */
export function useBatchWork() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string>()

  const run = useCallback(async (work: BatchWorkFn) => {
    setIsRunning(true)
    setProgress(0)
    setResult(undefined)

    // Yield so React can render the disabled/spinner state before work begins
    await new Promise<void>(r => requestAnimationFrame(r))

    const msg = await work(setProgress)
    setProgress(1)
    setIsRunning(false)
    setResult(msg)
  }, [])

  return { isRunning, progress, result, run }
}

export type BatchWorkFn = (
  /** Report progress from 0 to 1 */
  onProgress: (progress: number) => void,
) => Promise<string>
