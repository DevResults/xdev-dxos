import { makeRandom } from "@herbcaudill/random"
import { LocalDate } from "@js-joda/core"
import type { Meta, StoryObj } from "@storybook/react"
import { contacts } from "data/contacts"
import { generateDones } from "lib/generateDones"
import type { Contact } from "schema/Contact"
import type { DoneEntry } from "schema/DoneEntry"
import { TeamDones } from "../TeamDones"
import { storyContact } from "./util/storyContact"

const random = makeRandom("dones")

const meta: Meta<typeof TeamDones> = {
  title: "Dones/TeamDones",
  component: TeamDones,
  args: {
    contacts,
    self: storyContact("herb"),
  },
}

export default meta
type Story = StoryObj<typeof meta>

const generateDonesForContacts = (storyContacts: Contact[]) =>
  generateDones({
    today: LocalDate.parse("2024-11-08"),
    weeks: 1,
    productivity: 0.75,
    enthusiasm: 0.05,
    contacts: storyContacts,
  })

export const Empty: Story = {
  args: {
    dones: [],
  },
}

export const Partial: Story = {
  args: {
    dones: generateDonesForContacts(random.sample(contacts, 5)) as DoneEntry[],
  },
}

export const Full: Story = {
  args: {
    dones: generateDonesForContacts(contacts) as DoneEntry[],
  },
}
