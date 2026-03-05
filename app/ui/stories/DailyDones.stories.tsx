import { LocalDate } from "@js-joda/core"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, waitFor, within } from "@storybook/test"
import { contacts } from "data/contacts"
import type { DoneEntry } from "schema/DoneEntry"
import { DailyDones } from "../DailyDones"

const herb = contacts.find(c => c.id === "herb")!
const date = LocalDate.parse("2024-11-07")

const makeDone = (content: string): DoneEntry =>
  ({
    id: `done-${content.slice(0, 10)}`,
    contactId: herb.id,
    date: date.toString(),
    content,
    likes: [],
    timestamp: Date.now(),
  }) as unknown as DoneEntry

const meta: Meta<typeof DailyDones> = {
  title: "Dones/DailyDones",
  component: DailyDones,
  args: {
    date,
    doneEntries: [],
    self: herb,
    contacts,
    onAdd: fn(),
    onRemove: fn(),
  },
  decorators: [
    Story => (
      <div className="h-64 w-80 p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithDones: Story = {
  args: {
    doneEntries: [
      makeDone("Completed terabytes of coding and compiling"),
      makeDone("Reviewed pull requests"),
    ],
  },
}

/** Typing text and pressing Tab creates a new done. */
export const CreatesDone: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox")
    await userEvent.click(input)
    await userEvent.type(input, "Completed terabytes of coding and compiling")
    await userEvent.tab()
    await waitFor(() => {
      expect(args.onAdd).toHaveBeenCalledWith(
        expect.objectContaining({ content: "Completed terabytes of coding and compiling" }),
      )
    })
  },
}

/** Clicking delete on an existing done calls onRemove. */
export const DeletesDone: Story = {
  args: {
    doneEntries: [makeDone("Completed terabytes of coding and compiling")],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const doneText = canvas.getByDisplayValue("Completed terabytes of coding and compiling")
    await userEvent.click(doneText)
    const deleteButton = canvas.getByTitle("Delete")
    await userEvent.click(deleteButton)
    expect(args.onRemove).toHaveBeenCalled()
  },
}

/** Editing a done's text and blurring updates it. */
export const EditsDone: Story = {
  args: {
    doneEntries: [makeDone("Completed terabytes of coding and compiling")],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const doneText = canvas.getByDisplayValue("Completed terabytes of coding and compiling")
    await userEvent.click(doneText)
    await userEvent.clear(doneText)
    await userEvent.type(doneText, "Completed petabytes of coding and compiling")
    await userEvent.tab()
    // The textarea should reflect the updated value
    await waitFor(() => {
      expect(doneText).toHaveValue("Completed petabytes of coding and compiling")
    })
  },
}
