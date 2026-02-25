import { useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { InviteMemberDialog } from "ui/InviteMemberDialog"
import { useTeam } from "~/hooks/useTeam"

/** Shows the invitation QR code and link for a contact with a pending invitation. */
export default function ViewInvitationPage() {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const { contacts } = useTeam()

  const contact = contactId ? contacts.find(c => c.id === contactId) : undefined
  const invitationCode = contact?.invitation?.invitationCode
  const authCode = contact?.invitation?.authCode

  const handleClose = useCallback(() => {
    void navigate("..")
  }, [navigate])

  if (!contactId || !invitationCode) {
    return null
  }

  return (
    <InviteMemberDialog
      defaultOpen={true}
      onClose={handleClose}
      invitationCode={invitationCode}
      authCode={authCode}
    />
  )
}
