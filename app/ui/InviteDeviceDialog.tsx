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
import QRCode from "react-qr-code"
import { CopyCode } from "ui/CopyCode"

export function InviteDeviceDialog({
  onClose,
  invitationCode,
  authCode,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

  if (!invitationCode) {
    return null
  }

  const linkUrl = `${globalThis.location.origin}/auth/setup/link/${invitationCode}`

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
          <DialogTitle>Link another device</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex min-w-0 flex-col space-y-4 overflow-hidden">
            <p className="text-sm text-neutral-600">
              Scan this QR code on your other device to link it to your account.
            </p>

            {/* QR Code */}
            <div className="flex justify-center rounded-lg bg-white p-4">
              <QRCode value={linkUrl} size={160} />
            </div>

            {/* Link */}
            <div>
              <p className="mb-2 text-sm font-medium">Link URL</p>
              <CopyCode label="Copy link" labelAfter="Link copied" code={linkUrl} />
            </div>

            {/* Auth code - for verification */}
            {authCode && (
              <div>
                <p className="mb-2 text-sm font-medium">Verification code</p>
                <p className="mb-2 text-xs text-neutral-500">
                  Enter this code on your other device to verify the connection.
                </p>
                <CopyCode label="Copy code" labelAfter="Code copied" code={authCode} />
              </div>
            )}
          </div>
        </DialogBody>
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
  authCode?: string | undefined
  defaultOpen?: boolean
}
