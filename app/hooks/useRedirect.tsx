import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import { useLocalState } from "./useLocalState"
import type { LocalState } from "~/types/types"

export function useRedirect({ from, to, condition = true, localState = undefined }: Parameters_) {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const { update } = useLocalState()

  // Use a ref for `from` to avoid re-triggering the effect when a new RegExp is created each render
  const fromRef = useRef(from)
  fromRef.current = from

  // Use a ref for localState to avoid re-triggering the effect with new object references
  const localStateRef = useRef(localState)
  localStateRef.current = localState

  useEffect(() => {
    if (!condition) {
      return
    }

    const currentFrom = fromRef.current
    const currentLocalState = localStateRef.current

    if (typeof currentFrom === "string" && pathname === currentFrom) {
      // Exact match
      if (currentLocalState) {
        update(currentLocalState)
      }

      void navigate(to, { state })
    } else if (currentFrom instanceof RegExp && currentFrom.test(pathname)) {
      // Regex match
      const newTo = pathname.replace(currentFrom, to)
      if (currentLocalState) {
        update(currentLocalState)
      }

      void navigate(newTo, { state })
    } else {
      // Nothing to do
    }
  }, [pathname, state, to, condition, navigate, update])
}

type Parameters_ = {
  from: string | RegExp
  to: string
  condition?: boolean
  localState?: Partial<LocalState>
}
