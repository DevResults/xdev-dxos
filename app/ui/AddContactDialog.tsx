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
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { useEffect, useState } from "react"

/** Collect a new contact's profile details in a dialog form. */
export function AddContactDialog({ onClose, onSubmit, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

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
          <DialogTitle>Add contact</DialogTitle>
          <DialogDescription>Enter contact details to add a new team member.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form
            data-testid="add-contact-form"
            className="grid gap-4"
            onSubmit={event => {
              event.preventDefault()

              const nextFirstName = firstName.trim()
              const nextUserName = userName.trim()

              if (!nextFirstName || !nextUserName) {
                return
              }

              onSubmit({
                firstName: nextFirstName,
                lastName: lastName.trim(),
                userName: nextUserName,
                avatarUrl: avatarUrl.trim(),
              })

              setIsOpen(false)
              onClose()
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={firstName}
                required
                autoFocus
                onChange={event => {
                  setFirstName(String(event.currentTarget.value))
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={event => {
                  setLastName(String(event.currentTarget.value))
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                value={userName}
                required
                onChange={event => {
                  setUserName(String(event.currentTarget.value))
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                value={avatarUrl}
                onChange={event => {
                  setAvatarUrl(String(event.currentTarget.value))
                }}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                intent="neutral"
                size="md"
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" intent="primary" size="md">
                Add contact
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export type Props = {
  onClose: () => void
  onSubmit: (contact: AddContactValues) => void
  defaultOpen?: boolean
}

export type AddContactValues = {
  firstName: string
  lastName: string
  userName: string
  avatarUrl: string
}
