import { Outlet, useNavigate } from "react-router"
import { Members } from "ui/Members"
import { useTeam } from "~/hooks/useTeam"

export default function MembersPage() {
  const { contacts, self } = useTeam()
  const navigate = useNavigate()

  return (
    <>
      <Members
        contacts={Object.values(contacts)}
        self={self}
        onPromote={() => {}}
        onDemote={() => {}}
        onRemove={() => {}}
        onInvite={() => {
          void navigate("/team/members/invite")
        }}
        onRevokeInvitation={() => {}}
      />
      {/* Outlet for dialogs */}
      <Outlet />
    </>
  )
}
