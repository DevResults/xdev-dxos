import { LocalDate } from "@js-joda/core"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, waitFor, within } from "@storybook/test"
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
    doneEntries: [] as DoneEntry[],
    timeEntries: [] as TimeEntry[],
    onAddDone: fn(),
    onRemoveDone: fn(),
    onAddTime: fn(),
    onRemoveTime: fn(),
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

export const Empty: Story = {}

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

/** Shows Hours and Dones section headings. */
export const ShowsSections: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("heading", { name: "Hours" })).toBeInTheDocument()
    expect(canvas.getByRole("heading", { name: "Dones" })).toBeInTheDocument()
  },
}

/** Shows weekday abbreviations (Mon-Fri). */
export const ShowsDaysOfWeek: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText(/mon/i)).toBeInTheDocument()
    expect(canvas.getByText(/tue/i)).toBeInTheDocument()
    expect(canvas.getByText(/wed/i)).toBeInTheDocument()
    expect(canvas.getByText(/thu/i)).toBeInTheDocument()
    expect(canvas.getByText(/fri/i)).toBeInTheDocument()
  },
}

/** Weekends are hidden by default but shown when showWeekends is true. */
export const ShowsWeekends: Story = {
  args: { showWeekends: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText(/sat/i)).toBeInTheDocument()
    expect(canvas.getByText(/sun/i)).toBeInTheDocument()
  },
}

/** Creating a time entry calls onAddTime. */
export const CreatesTimeEntry: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const inputs = canvas.getAllByRole("combobox")
    const firstInput = inputs[0]
    await userEvent.click(firstInput)
    await userEvent.clear(firstInput)
    await userEvent.paste("1h #out")
    await new Promise(r => setTimeout(r, 50))
    firstInput.blur()
    await new Promise(r => setTimeout(r, 50))
    await waitFor(() => {
      expect(args.onAddTime).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 60, project: "out-" }),
      )
    })
  },
}

/** Creating a done entry calls onAddDone. */
export const CreatesDone: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textareas = canvas.getAllByRole("textbox")
    const firstDoneInput = textareas[0]
    await userEvent.click(firstDoneInput)
    await userEvent.type(firstDoneInput, "Completed task A")
    await userEvent.tab()
    await waitFor(() => {
      expect(args.onAddDone).toHaveBeenCalledWith(
        expect.objectContaining({ content: "Completed task A" }),
      )
    })
  },
}

/** Shows weekly total when time entries exist. */
export const ShowsWeeklyTotal: Story = {
  args: {
    timeEntries: [
      {
        contactId: herb.id,
        date: "2024-11-04",
        duration: 120,
        project: "Out",
        input: "2h #out",
      } as unknown as TimeEntry,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Both the weekly total and daily total show "2:00"
    const totals = canvas.getAllByText("2:00")
    expect(totals.length).toBeGreaterThanOrEqual(1)
  },
}
