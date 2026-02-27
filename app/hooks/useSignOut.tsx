import { useClient } from "@dxos/react-client"
import { useLocalState } from "~/hooks/useLocalState"

export const useSignOut = () => {
  const localState = useLocalState()
  const client = useClient()

  return async () => {
    // Clear user, device, team from local storage / halo
    localState.reset()
    await client.reset()
  }
}
