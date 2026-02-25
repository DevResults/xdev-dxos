import { useCallback, useMemo, useRef } from "react"
import { useNavigate } from "react-router"
import { useSpace } from "@dxos/react-client/echo"
import type { FieldPath } from "react-hook-form"
import { ContactForm, type ContactFormValues } from "ui/ContactForm"
import { useLocalState } from "~/hooks/useLocalState"
import { extendContact, make as makeContact, type Contact } from "~/schema/Contact"

/** Route for adding a new contact. Creates a blank contact upfront and auto-saves fields on blur. */
export default function MembersAddContactPage() {
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const contactRef = useRef<Contact | undefined>(undefined)

  // Create the blank contact exactly once
  if (space && !contactRef.current) {
    const newContact = makeContact({
      firstName: "",
      lastName: "",
      userName: "",
      avatarUrl: "",
    })
    space.db.add(newContact)
    contactRef.current = newContact
  }

  const contact = contactRef.current

  const extendedContact = useMemo(() => {
    if (!contact) return undefined
    return extendContact({
      contact,
      member: undefined,
      selfIdentity: undefined,
      invitation: undefined,
      invitationStatus: "NOT_INVITED",
    })
  }, [contact])

  const handleSaveField = useCallback(
    async (name: FieldPath<ContactFormValues>, value: string) => {
      if (!contact) return
      ;(contact as any)[name] = value
      await space?.db.flush()
    },
    [contact, space],
  )

  const handleDone = useCallback(() => {
    if (!contact) return
    void navigate(`/team/members/invite/${contact.id}`)
  }, [navigate, contact])

  const handleCancel = useCallback(() => {
    if (contact && space) {
      space.db.remove(contact)
    }
    void navigate("..")
  }, [contact, space, navigate])

  // ----- ^ hooks

  if (!extendedContact) return null

  return (
    <ContactForm
      contact={extendedContact}
      onSaveField={handleSaveField}
      onDone={handleDone}
      onCancel={handleCancel}
      title="Add contact"
      description="Enter contact details to add a new team member."
    />
  )
}
