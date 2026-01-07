/* eslint-disable @typescript-eslint/no-unsafe-assignment */ // state is any

import { useLocation, useNavigate } from "react-router"
import { useEffect } from "react"
import { useLocalState } from "./useLocalState"
import type { LocalState } from "~/types/types"

export function useRedirect({ from, to, condition = true, localState = undefined }: Parameters_) {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const { update } = useLocalState()
  useEffect(() => {
    if (!condition) {
      return
    }

    if (typeof from === "string" && pathname === from) {
      // Exact match
      if (localState) {
        update(localState)
      }

      void navigate(to, { state })
    } else if (from instanceof RegExp && from.test(pathname)) {
      // Regex match
      const newTo = pathname.replace(from, to)
      if (localState) {
        update(localState)
      }

      void navigate(newTo, { state })
    } else {
      // Nothing to do
    }
  }, [pathname, state, from, to, condition, navigate])
}

type Parameters_ = {
  from: string | RegExp
  to: string
  condition?: boolean
  localState?: Partial<LocalState>
}
