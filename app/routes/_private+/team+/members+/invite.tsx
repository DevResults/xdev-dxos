import { useLocation, useNavigate } from "react-router"
import { InviteMemberDialog } from "./ui/InviteMemberDialog"

export default function MembersInvitePage() {
  // the userId of the contact we're inviting is passed in the location state
  const { userId } = useLocation().state
  const navigate = useNavigate()

  // look up the contact information for the user we're inviting
  const contact = { userId }

  // generate an invitation code for the contact
  const invitationCode = "hello"

  // ↑ hooks

  return (
    <InviteMemberDialog
      defaultOpen={true}
      onClose={async () => navigate("..")}
      contact={contact}
      invitationCode={invitationCode}
    />
  )
}
