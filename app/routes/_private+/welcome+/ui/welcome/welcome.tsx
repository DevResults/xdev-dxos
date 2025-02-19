import { useIdentity } from "@dxos/react-client/halo"
import { humanize } from "@dxos/util"
import { useQuery, useSpace } from "@dxos/react-client/echo"
import { useLocalState } from "~/hooks/useLocalState"

export function Welcome() {
  // Get the user to log in before a space can be obtained.
  const identity = useIdentity()
  // Get the first available space, created with the identity.
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  // Grab everything in the first space.
  const objects = useQuery(space, {})
  // Show the id of the first object returned.
  return (
    <>
      {JSON.stringify(identity, null, 2)}
      {JSON.stringify({ id: humanize(space!.id), properties: space!.properties }, null, 2)}
      {objects.map(d => JSON.stringify(d, null, 2))}
    </>
  )
}
