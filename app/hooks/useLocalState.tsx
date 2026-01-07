import { useLocalStorage } from "@uidotdev/usehooks"
import type { LocalState } from "~/types/types"

export function useLocalState() {
  const initialState: LocalState = {}
  const [state, setState] = useLocalStorage("xdev-localstate", initialState)

  const { spaceKey, invitationCode } = state

  return {
    spaceKey,
    invitationCode,

    update(s: Partial<LocalState>) {
      setState({ ...state, ...s })
    },
    reset() {
      setState(initialState)
    },
  }
}
