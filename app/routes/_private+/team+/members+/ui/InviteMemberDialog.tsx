import { Button } from "@ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog"
import { useEffect, useState } from "react"

export function InviteMemberDialog({
  onClose,
  contact,
  invitationCode,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [contact, defaultOpen])

  if (!invitationCode) return null

  const url = `${window.location.origin}/join/${invitationCode}`

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open)
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>
        <DialogBody>Here's where invites go</DialogBody>
        <DialogFooter>
          <Button intent="primary" size="md" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type Props = {
  onClose: () => void
  contact: any
  invitationCode: string | undefined
  defaultOpen?: boolean
}
