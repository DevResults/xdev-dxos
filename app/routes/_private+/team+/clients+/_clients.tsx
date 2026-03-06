import { useSpace } from "@dxos/react-client/echo"
import { useDbQuery } from "~/hooks/useDbQuery"
import { useLocalState } from "~/hooks/useLocalState"
import { Client } from "~/schema/Client"
import { ClientsTable } from "~/ui/ClientsTable"
import { Pane } from "~/ui/layouts/Pane"

/** Page for editing the client list. */
export default function ClientsPage() {
  const clients = useDbQuery(Client)
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  return (
    <Pane>
      <ClientsTable clients={clients} space={space} />
    </Pane>
  )
}
