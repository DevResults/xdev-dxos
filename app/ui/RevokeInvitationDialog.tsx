import { ConfirmDialog } from "./ConfirmDialog"
import type { ExtendedContact } from "~/schema/Contact"
import type { Invitation } from "~/schema/Invitation"

export function RevokeInvitationDialog({
  onClose = () => {},
  contact,
  invitation,
  revoke = () => {},
  defaultOpen = false,
}: Props) {
  if (!invitation) {
    return null
  }

  return (
    <ConfirmDialog
      title={`Revoke ${contact.firstName}’s invitation?`}
      body={`${contact.firstName} will no longer be able to use it to join.`}
      intent="danger"
      onConfirm={async () => {
        await revoke()
        await onClose()
      }}
      onCancel={onClose}
      confirmButtonText="Yes, revoke"
      defaultOpen={defaultOpen}
    ></ConfirmDialog>
  )
}

export type Props = {
  onClose: () => void | Promise<void>
  contact: ExtendedContact
  invitation: Invitation
  revoke: () => void | Promise<void>
  defaultOpen?: boolean
}
