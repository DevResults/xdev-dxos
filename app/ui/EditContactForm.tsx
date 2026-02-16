import { Link } from "react-router"
import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { useEffect, useState } from "react"
import type { ExtendedContact } from "~/schema/Contact"

/** Form for editing an existing contact's profile details. */
export function EditContactForm({ onSubmit, onCancel, contact }: Props) {
  const [firstName, setFirstName] = useState(contact.firstName)
  const [lastName, setLastName] = useState(contact.lastName)
  const [userName, setUserName] = useState(contact.userName)
  const [avatarUrl, setAvatarUrl] = useState(contact.avatarUrl)

  // Reset form when contact changes
  useEffect(() => {
    setFirstName(contact.firstName)
    setLastName(contact.lastName)
    setUserName(contact.userName)
    setAvatarUrl(contact.avatarUrl)
  }, [contact])

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <Link to="/team/members" className="text-sm text-neutral-500 hover:text-neutral-700">
          &larr; Back to members
        </Link>
      </div>

      <h2 className="mb-1">Edit contact</h2>
      <p className="mb-6 text-sm text-neutral-500">Update the contact's information.</p>

      <form
        data-testid="edit-contact-form"
        className="grid gap-4"
        onSubmit={event => {
          event.preventDefault()

          const nextFirstName = firstName.trim()
          const nextUserName = userName.trim()

          if (!nextFirstName || !nextUserName) {
            return
          }

          onSubmit({
            contactId: contact.id,
            firstName: nextFirstName,
            lastName: lastName.trim(),
            userName: nextUserName,
            avatarUrl: avatarUrl.trim(),
          })
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

        <div className="flex justify-end gap-2">
          <Button type="button" intent="neutral" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" intent="primary" size="md">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export type Props = {
  onSubmit: (values: EditContactValues) => void
  onCancel: () => void
  contact: ExtendedContact
}

export type EditContactValues = {
  contactId: string
  firstName: string
  lastName: string
  userName: string
  avatarUrl: string
}
