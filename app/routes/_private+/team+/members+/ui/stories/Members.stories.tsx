import type { Meta, StoryObj } from "@storybook/react"
import { type ExtendedContact } from "schema/Contact"
import { storyContact } from "ui/stories/util/storyContact"
import { Members } from "../Members"

const meta: Meta<typeof Members> = {
  title: "Settings/Members",
  component: Members,
  parameters: {
    layout: "padded",
    controls: { disable: true },
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

// HELPERS

function makeStory(contacts: ExtendedContact[]): Story {
  return {
    args: {
      contacts,
      self: contacts.find(c => c.isSelf)!,
    },
  }
}
