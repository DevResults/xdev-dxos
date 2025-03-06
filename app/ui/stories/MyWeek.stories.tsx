import { LocalDate } from "@js-joda/core"
import type { Meta, StoryObj } from "@storybook/react"
import { clients } from "data/clients"
import { contacts } from "data/contacts"
import { projects } from "data/projects"
import { NO_OP } from "lib/constants"
import { generateDones } from "lib/generateDones"
import { generateTimeEntries } from "lib/generateTimeEntries"
import { getSunday } from "lib/getSunday"
import { type DoneEntry } from "schema/DoneEntry"
import { type TimeEntry } from "schema/TimeEntry"
import { MyWeek } from "../MyWeek"
import { storyContact } from "./util/storyContact"

const herb = storyContact("herb")

const meta = {
  title: "MyWeek/MyWeek",
  parameters: { layout: "fullscreen" },
  component: MyWeek,
  args: {
    self: herb,
    start: getSunday(LocalDate.parse("2024-11-07")),
    contacts,
    clients,
    projects,
    onAddDone: NO_OP,
    onRemoveDone: NO_OP,
    onAddTime: NO_OP,
    onRemoveTime: NO_OP,
  },
  decorators: [
    Story => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MyWeek>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    doneEntries: [] as DoneEntry[],
    timeEntries: [] as TimeEntry[],
  },
}

export const Partial: Story = {
  args: {
    doneEntries: [
      {
        contactId: herb.id,
        date: "2024-11-07",
        content: "Completed terabytes of coding and compiling",
        likes: [],
      } as unknown as DoneEntry,
    ],
    timeEntries: [
      {
        contactId: herb.id,
        date: "2024-11-07",
        duration: 8 * 60,
        project: "Out",
        input: "8h #out",
      } as unknown as TimeEntry,
    ],
  },
}

export const Full: Story = {
  args: {
    doneEntries: generateDones({
      today: LocalDate.parse("2024-11-09"),
      weeks: 1,
      productivity: 2,
      enthusiasm: 0.1,
      contacts,
    }).filter(d => d.contactId === herb.id) as DoneEntry[],
    timeEntries: generateTimeEntries({
      clients,
      contacts,
      projects,
      startDate: LocalDate.parse("2024-11-09"),
      weekCount: 3,
    }).filter(t => t.contactId === herb.id) as TimeEntry[],
  },
}
