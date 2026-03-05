import { useSpace } from "@dxos/react-client/echo"
import { useCallback } from "react"
import type { FieldPath } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { ContactForm, type ContactFormValues } from "ui/ContactForm"
import { useLocalState } from "~/hooks/useLocalState"
import { useTeam } from "~/hooks/useTeam"

/** Route for editing a single contact's details. */
export default function EditContactPage() {
  const { contactId } = useParams()
  const { contacts } = useTeam()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const navigate = useNavigate()

  const contact = contacts.find(({ id }) => id === contactId)

  const handleSaveField = useCallback(
    async (name: FieldPath<ContactFormValues>, value: string | undefined) => {
      if (!contact) return
      ;(contact as any)[name] = value
      await space?.db.flush()
    },
    [contact, space],
  )

  const handleDone = useCallback(
    (_values: ContactFormValues) => {
      void navigate("/team/members")
    },
    [navigate],
  )

  // ----- ^ hooks

  if (!contact) return null

  return (
    <ContactForm
      key={contactId}
      title={contact.fullName}
      defaultValues={{
        firstName: contact.firstName ?? "",
        lastName: contact.lastName ?? "",
        userName: contact.userName ?? "",
        avatarUrl: contact.avatarUrl ?? "",
        status: contact.contact.status ?? "active",
        middleName: contact.contact.middleName ?? "",
        suffix: contact.contact.suffix ?? "",
        preferredName: contact.contact.preferredName ?? "",
        pronouns: contact.contact.pronouns ?? "",
        birthdate: contact.contact.birthdate ?? "",
        startDate: contact.contact.startDate ?? "",
        title: contact.contact.title ?? "",
        phone: contact.contact.phone ?? "",
        homeAddress: contact.contact.homeAddress ?? "",
        homeCity: contact.contact.homeCity ?? "",
        homeState: contact.contact.homeState ?? "",
        homeZip: contact.contact.homeZip ?? "",
        country: contact.contact.country ?? "",
        workAddress: contact.contact.workAddress ?? "",
        workCity: contact.contact.workCity ?? "",
        workState: contact.contact.workState ?? "",
        workZip: contact.contact.workZip ?? "",
        emergencyContactName: contact.contact.emergencyContactName ?? "",
        emergencyContactRelationship: contact.contact.emergencyContactRelationship ?? "",
        emergencyContactPhone: contact.contact.emergencyContactPhone ?? "",
        passportNumber: contact.contact.passportNumber ?? "",
        passportIssueDate: contact.contact.passportIssueDate ?? "",
        passportExpirationDate: contact.contact.passportExpirationDate ?? "",
        passportCountry: contact.contact.passportCountry ?? "",
        driversLicense: contact.contact.driversLicense ?? "",
        driversLicenseExpiration: contact.contact.driversLicenseExpiration ?? "",
      }}
      onSaveField={handleSaveField}
      onDone={handleDone}
    />
  )
}
