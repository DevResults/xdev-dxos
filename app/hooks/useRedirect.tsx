/* eslint-disable @typescript-eslint/no-unsafe-assignment */ // state is any

import { useLocation, useNavigate } from "react-router"
import { useEffect } from "react"
import { useLocalState } from "./useLocalState"
import type { LocalState } from "~/types/types"

export function useRedirect({ from, to, condition = true, localState = undefined }: Params) {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const { update } = useLocalState()
  useEffect(() => {
    if (!condition) return
    if (typeof from === "string" && pathname === from) {
      console.log(`redirecting from ${from} to ${to}`)
      if (localState) update(localState)
      void navigate(to, { state })
    } else if (from instanceof RegExp && from.test(pathname)) {
      const newTo = pathname.replace(from, to)
      console.log(`redirecting from ${from} to ${newTo}`)
      if (localState) update(localState)
      void navigate(newTo, { state })
    } else {
      console.log("oops... don't know how to redirect", { from, to, pathname })
    }
  }, [pathname, state, from, to, condition, navigate])
}

type Params = {
  from: string | RegExp
  to: string
  condition?: boolean
  localState?: Partial<LocalState>
}
