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
        onInvite={userId => {
          void navigate(`/team/members/invite/${userId}`)
        }}
        onAddContact={() => {
          void navigate("/team/members/add")
        }}
        onRevokeInvitation={() => {}}
      />
      {/* Outlet for dialogs */}
      <Outlet />
    </>
  )
}
