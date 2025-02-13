import { Button } from "~/ui/shadcn/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/ui/shadcn/dialog"
import { useEffect, useState } from "react"

export function InviteDeviceDialog({ onClose, invitationCode, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [invitationCode])

  if (!invitationCode) return null

  const url = `${window.location.origin}/link/${invitationCode}`

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open)
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link another device</DialogTitle>
        </DialogHeader>
        <DialogBody>This is where device invites go</DialogBody>
        <DialogFooter>
          <Button
            intent="primary"
            size="md"
            onClick={() => {
              onClose?.()
              setIsOpen(false)
            }}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type Props = {
  onClose: () => void
  invitationCode: string | undefined
  defaultOpen?: boolean
}
