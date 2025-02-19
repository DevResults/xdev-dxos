import { DoneDisplay } from "./DoneDisplay"
import { Avatar } from "~/ui/Avatar"
import { CenteredLayout } from "~/ui/layouts/CenteredLayout"
import type { DoneEntry } from "~/schema/DoneEntry"
import type { Contact } from "~/schema/Contact"

export const TeamDones = ({ dones, contacts, self }: Props) => {
  if (dones.length === 0)
    return (
      <CenteredLayout>
        <p className="flex flex-col items-center">
          <span className="text-6xl text-gray-400">
            <IconCactus />
          </span>

          <span className="text-sm">No dones yet for this week!</span>
        </p>
      </CenteredLayout>
    )

  const donesByContact = dones.reduce<Record<string, DoneEntry[]>>((userDones, doneData) => {
    if (userDones[doneData.contactId]) userDones[doneData.contactId].push(doneData)
    else userDones[doneData.contactId] = [doneData]
    return userDones
  }, {})
  return (
    <div className="flex grow flex-col gap-x-2 gap-y-8 sm:grid sm:grid-cols-3 lg:grid-cols-5">
      {contacts.map(contact => {
        const contactDones = donesByContact[contact.id]

        return contactDones?.length > 0 ?
            <div className="min-h-1/3 flex flex-col gap-2" key={contact.id}>
              {/* user's avatar & name */}
              <h3 className="flex flex-row items-center gap-2 text-base">
                <Avatar size="md" contact={contact} />
                <span>{contact.firstName}</span>
              </h3>
              {/* user's dones */}
              <ul className="flex flex-col gap-1 font-normal text-neutral-700">
                {contactDones?.map(done => {
                  return <DoneDisplay key={done.id} done={done} self={self} contacts={contacts} />
                })}
              </ul>
            </div>
          : null
      })}
    </div>
  )
}

type Props = {
  dones: DoneEntry[]
  contacts: Contact[]
  self: Contact
}
