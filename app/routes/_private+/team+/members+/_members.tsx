import { Outlet, useLocation, useNavigate, useParams } from "react-router"
import { Pane } from "ui/layouts/Pane"
import { Members } from "ui/Members"
import { useTeam } from "~/hooks/useTeam"

export default function MembersPage() {
  const { contacts, self } = useTeam()
  const { contactId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  /** True when a child route (edit or add) is active. */
  const hasDetailPane = contactId != null || location.pathname.endsWith("/add")

  return (
    <>
      <Pane className="shrink-0">
        <Members
          contacts={Object.values(contacts)}
          self={self}
          selectedContactId={contactId}
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
      </Pane>
      {hasDetailPane && (
        <Pane className="flex-1">
          <Outlet />
        </Pane>
      )}
      {!hasDetailPane && <Outlet />}
    </>
  )
}
