import { ConfirmDialog } from "./ConfirmDialog"
import { displayFirstName } from "~/lib/displayFirstName"

export function RemoveMemberDialog({
  onClose = () => {},
  contact,
  remove = () => {},
  defaultOpen = false,
}: Props) {
  if (!contact) {
    return null
  }

  return (
    <ConfirmDialog
      title="Remove member"
      body={`${displayFirstName(contact)} will be permanently removed from this team.`}
      intent="danger"
      onConfirm={() => {
        remove()
        onClose()
      }}
      onCancel={onClose}
      defaultOpen={defaultOpen}
    ></ConfirmDialog>
  )
}

export type Props = {
  onClose: () => void
  contact: any
  remove: () => void
  defaultOpen?: boolean
}
