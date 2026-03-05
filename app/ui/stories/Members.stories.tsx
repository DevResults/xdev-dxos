import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, within } from "@storybook/test"
import { type ExtendedContact } from "schema/Contact"
import { Members } from "ui/Members"
import { storyContact } from "./util/storyContact"

const meta: Meta<typeof Members> = {
  title: "Settings/Members",
  component: Members,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  args: {
    onPromote: fn(),
    onDemote: fn(),
    onInvite: fn(),
    onAddContact: fn(),
    onRevokeInvitation: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

// STORIES

export const FirstUse = makeStory([
  storyContact("ritika", { admin: true, self: true }),
  storyContact("fred"),
  storyContact("herb"),
])

export const AllMembers = makeStory([
  storyContact("ritika", { admin: true, self: true }),
  storyContact("fred", { admin: false }),
  storyContact("herb", { admin: false }),
])

export const AllAdmins = makeStory([
  storyContact("ritika", { admin: true, self: true }),
  storyContact("fred", { admin: true }),
  storyContact("herb", { admin: true }),
])

export const SelfIsNotAdmin = makeStory([
  storyContact("ritika", { admin: false, self: true }),
  storyContact("fred", { admin: true }),
  storyContact("herb"),
])

/** Displays the current user with "You" label. */
export const ShowsCurrentUser: Story = {
  ...makeStory([storyContact("herb", { admin: true, self: true }), storyContact("ritika")]),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText("You")).toBeInTheDocument()
    expect(canvas.getByText("Herb Caudill")).toBeInTheDocument()
  },
}

/** Shows the current user as admin. */
export const ShowsAdminStatus: Story = {
  ...makeStory([storyContact("herb", { admin: true, self: true }), storyContact("ritika")]),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText("Admin")).toBeInTheDocument()
  },
}

/** Shows the "Add member" button. */
export const ShowsAddMemberButton: Story = {
  ...makeStory([storyContact("herb", { admin: true, self: true })]),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("button", { name: "Add member" })).toBeInTheDocument()
  },
}

/** Clicking "Add member" calls onAddContact. */
export const ClickAddMember: Story = {
  ...makeStory([storyContact("herb", { admin: true, self: true })]),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Add member" }))
    expect(args.onAddContact).toHaveBeenCalled()
  },
}

// HELPERS

function makeStory(contacts: ExtendedContact[]): Story {
  return {
    args: {
      contacts,
      self: contacts.find(c => c.isSelf)!,
      selectedContactId: undefined,
    },
  }
}
