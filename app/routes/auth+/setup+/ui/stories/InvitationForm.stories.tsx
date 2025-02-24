import type { Meta, StoryObj } from "@storybook/react"
import { userEvent, within } from "@storybook/test"
import { CenteredDecorator } from "ui/stories/util/CenteredDecorator"
import { InvitationForm } from "../InvitationForm"

const meta: Meta<typeof InvitationForm> = {
  title: "Auth/InvitationForm",
  component: InvitationForm,
  args: {
    heading: "Join a team",
    onSubmit() {},
  },
  decorators: [CenteredDecorator],
}

// adding this to a story submits the form to trigger validation
const submit = async ({ canvasElement }: { canvasElement: HTMLElement }) =>
  userEvent.click(within(canvasElement).getByRole("button"))

export default meta
type Story = StoryObj<typeof meta>

// STORIES

export const Empty: Story = {}

export const WithCode: Story = {
  args: { invitationCode: "abcd1234" },
}

export const WithPrefilledCode: Story = {
  args: {
    heading: "You've been invited to join a team",
    invitationCode: "abcd1234",
    readOnly: true,
  },
}

export const WithTooShortCode: Story = {
  args: { invitationCode: "1234" },
  play: submit,
}

export const WithInvalidCode: Story = {
  args: { invitationCode: "abcd-1234" },
  play: submit,
}

export const WithError: Story = {
  args: {
    invitationCode: "abcd1234",
    error: "That code didn't work - did you mistype it?",
  },
  play: submit,
}

export const SubmittingThenError: Story = {
  args: {
    invitationCode: "abcd1234",
    async onSubmit() {
      await pause(1000)
      throw new Error("That code didn't work - did you mistype it?")
    },
  },
  play: submit,
}

export const SubmittingForever: Story = {
  args: {
    invitationCode: "abcd1234",
    onSubmit: async () => pause(999_999),
  },
  play: submit,
}

const pause = async (t = 0) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), t)
  })
