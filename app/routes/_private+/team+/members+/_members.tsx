import { Outlet } from "react-router"
import { useSpace } from "@dxos/react-client/echo"
import { useShell } from "@dxos/react-client"
import { Members } from "./ui/Members"
import { useTeam } from "~/hooks/useTeam"
import { useLocalState } from "~/hooks/useLocalState"

export default function MembersPage() {
  const { contacts, self } = useTeam()

  const shell = useShell()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  return (
    <>
      <Members
        contacts={Object.values(contacts)}
        self={self}
        onPromote={() => {}}
        onDemote={() => {}}
        onRemove={() => {}}
        onInvite={() => {
          void shell.shareSpace({ spaceId: space!.id })
        }}
        onRevokeInvitation={() => {}}
      />
      {/* Outlet for dialogs */}
      <Outlet />
    </>
  )
}
