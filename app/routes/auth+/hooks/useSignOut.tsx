import { type Client, useClient } from "@dxos/react-client"
import { useLocalState } from "~/hooks/useLocalState"

export const useSignOut = () => {
  const localState = useLocalState()
  const client = useClient() as Client

  return async () => {
    // clear user, device, team from local storage / halo
    localState.reset()
    await client.reset()
  }
}
