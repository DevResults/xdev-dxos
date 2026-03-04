import { useCallback, useEffect } from "react"
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

  const closeDetailPane = useCallback(() => {
    void navigate("/team/members")
  }, [navigate])

  /** Close the detail pane when the Escape key is pressed. */
  useEffect(() => {
    if (!hasDetailPane) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetailPane()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [hasDetailPane, closeDetailPane])

  return (
    <>
      <Pane>
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
        <Pane className="relative flex-1">
          <button
            onClick={closeDetailPane}
            className="absolute right-4 top-4 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            title="Close"
          >
            <IconX className="size-5" />
          </button>
          <Outlet />
        </Pane>
      )}
      {!hasDetailPane && <Outlet />}
    </>
  )
}
