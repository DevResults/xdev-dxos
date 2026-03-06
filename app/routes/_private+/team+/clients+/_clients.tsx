import { useSpace } from "@dxos/react-client/echo"
import { useDatabase } from "~/hooks/useDatabase"
import { useLocalState } from "~/hooks/useLocalState"
import { ClientsTable } from "~/ui/ClientsTable"
import { Pane } from "~/ui/layouts/Pane"

/** Page for editing the client list. */
export default function ClientsPage() {
  const { clients } = useDatabase()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  return (
    <Pane>
      <ClientsTable clients={clients} space={space} />
    </Pane>
  )
}
