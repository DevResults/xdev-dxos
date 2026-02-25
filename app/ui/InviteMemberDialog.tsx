import { Button } from "@ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { CopyCode } from "ui/CopyCode"

export function InviteMemberDialog({ onClose, invitationCode, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

  if (!invitationCode) {
    return null
  }

  const joinUrl = `${globalThis.location.origin}/auth/setup/join/${invitationCode}`

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open)
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex min-w-0 flex-col space-y-4 overflow-hidden">
            <DialogDescription>
              Share this QR code or link with the person you want to invite.
            </DialogDescription>

            {/* QR Code */}
            <div className="flex justify-center rounded-lg bg-white p-4">
              <QRCode value={joinUrl} size={160} />
            </div>

            {/* Invitation link */}
            <div>
              <p className="mb-2 text-sm font-medium">Invitation link</p>
              <CopyCode label="Copy link" labelAfter="Link copied" code={joinUrl} />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            intent="primary"
            size="md"
            onClick={() => {
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
