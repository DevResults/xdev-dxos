import { LocalDate } from "@js-joda/core"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import MockDate from "mockdate"
import { clients } from "data/clients"
import { contacts } from "data/contacts"
import { projects } from "data/projects"
import { generateTimeEntries } from "lib/generateTimeEntries"
import { type TimeEntry } from "schema/TimeEntry"
import { HoursReport } from "../HoursReport"

const resetDate: Decorator = Story => {
  MockDate.reset()
  return <Story />
}

const setDate =
  (date: string): Decorator =>
  Story => {
    MockDate.set(new Date(date))
    return <Story />
  }

const meta = {
  title: "Hours/HoursReport",
  parameters: { layout: "fullscreen" },
  component: HoursReport,
  args: {
    year: 2024,
    contacts,
  },
  decorators: [
    resetDate,
    Story => (
      <div className="h-screen p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HoursReport>

export default meta
type Story = StoryObj<typeof meta>

const makeStory = ({
  today,
  weekCount,
  procrastinators = [],
  entries = weekCount
    ? (generateTimeEntries({
        clients,
        contacts,
        projects,
        startDate: LocalDate.parse("2024-01-01"),
        weekCount,
        procrastinators,
        omit: ["Colleen"],
      }) as TimeEntry[])
    : [],
}: {
  today: string
  entries?: TimeEntry[]
  weekCount?: number
  procrastinators?: string[]
}): Story => ({
  args: {
    timeEntries: entries,
  },
  decorators: [setDate(today)],
})

export const Empty = makeStory({ today: LocalDate.now().toString(), entries: [] })

export const OneEntry = makeStory({
  today: "2024-01-07",
  entries: [
    {
      contactId: contacts[0].id,
      date: "2024-01-07",
      duration: 60,
      project: "Out",
      input: "1h #out",
    } as unknown as TimeEntry,
  ],
})

export const January = makeStory({ today: "2024-01-07", weekCount: 2 })

export const July = makeStory({
  today: "2024-07-13",
  weekCount: 29,
  procrastinators: ["Herb", "Aasit"],
})

export const December = makeStory({
  today: "2024-12-31",
  weekCount: 53,
  procrastinators: ["Herb", "Aasit"],
})
