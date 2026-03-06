import { useSpace } from "@dxos/react-client/echo"
import { useCallback } from "react"
import type { FieldPath } from "react-hook-form"
import { ContactForm, type ContactFormValues } from "ui/ContactForm"
import { Pane } from "ui/layouts/Pane"
import { useLocalState } from "~/hooks/useLocalState"
import { useTeam } from "~/hooks/useTeam"

/** This is where people can update their personal info, avatar, etc. */
export default function ProfilePage() {
  const { self } = useTeam()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  const handleSaveField = useCallback(
    async (name: FieldPath<ContactFormValues>, value: string | undefined) => {
      if (!self) return
      ;(self as any)[name] = value
      await space?.db.flush()
    },
    [self, space],
  )

  const handleDone = useCallback((_values: ContactFormValues) => {
    // Stay on the profile page — nothing to navigate to
  }, [])

  // ----- ^ hooks

  if (!self) return null

  return (
    <Pane>
      <ContactForm
        title="My profile"
        defaultValues={{
          firstName: self.firstName ?? "",
          lastName: self.lastName ?? "",
          userName: self.userName ?? "",
          avatarUrl: self.avatarUrl ?? "",
          status: self.contact.status ?? "active",
          middleName: self.contact.middleName ?? "",
          suffix: self.contact.suffix ?? "",
          preferredName: self.contact.preferredName ?? "",
          pronouns: self.contact.pronouns ?? "",
          birthdate: self.contact.birthdate ?? "",
          startDate: self.contact.startDate ?? "",
          title: self.contact.title ?? "",
          phone: self.contact.phone ?? "",
          homeAddress: self.contact.homeAddress ?? "",
          homeCity: self.contact.homeCity ?? "",
          homeState: self.contact.homeState ?? "",
          homeZip: self.contact.homeZip ?? "",
          country: self.contact.country ?? "",
          workAddress: self.contact.workAddress ?? "",
          workCity: self.contact.workCity ?? "",
          workState: self.contact.workState ?? "",
          workZip: self.contact.workZip ?? "",
          emergencyContactName: self.contact.emergencyContactName ?? "",
          emergencyContactRelationship: self.contact.emergencyContactRelationship ?? "",
          emergencyContactPhone: self.contact.emergencyContactPhone ?? "",
          passportNumber: self.contact.passportNumber ?? "",
          passportIssueDate: self.contact.passportIssueDate ?? "",
          passportExpirationDate: self.contact.passportExpirationDate ?? "",
          passportCountry: self.contact.passportCountry ?? "",
          driversLicense: self.contact.driversLicense ?? "",
          driversLicenseExpiration: self.contact.driversLicenseExpiration ?? "",
        }}
        onSaveField={handleSaveField}
        onDone={handleDone}
        showStatusSwitch={false}
      />
    </Pane>
  )
}
