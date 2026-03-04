import { useEffect, useState } from "react"
import { Spinner } from "./Spinner"
import { Heading } from "~/ui/Heading"

export function Loading() {
  const [hung, setHung] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHung(true)
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (!hung) {
    return null
  } // Don't show the spinner until we've waited a bit

  return (
    <div className="mt-24 flex w-full flex-col items-center">
      <div className="flex w-[20em] flex-col space-y-3">
        <Heading level={1} className="flex items-center space-x-2">
          <Spinner />
          <span>Loading...</span>
        </Heading>
      </div>
    </div>
  )
}
