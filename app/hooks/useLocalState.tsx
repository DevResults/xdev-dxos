import { useLocalStorage } from "@uidotdev/usehooks"
import { useCallback } from "react"
import type { LocalState } from "~/types/types"

const initialState: LocalState = {}

export function useLocalState() {
  const [state, setState] = useLocalStorage("xdev-localstate", initialState)

  const { spaceKey, invitationCode } = state

  /** Merge partial state into the current local state. */
  const update = useCallback(
    (s: Partial<LocalState>) => {
      setState(prev => ({ ...prev, ...s }))
    },
    [setState],
  )

  /** Reset local state to defaults. */
  const reset = useCallback(() => {
    setState(initialState)
  }, [setState])

  return {
    spaceKey,
    invitationCode,
    update,
    reset,
  }
}
