import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, within } from "@storybook/test"
import { CenteredDecorator } from "ui/stories/util/CenteredDecorator"
import { UserNameForm } from "ui/UserNameForm"

const meta: Meta<typeof UserNameForm> = {
  title: "Auth/UserNameForm",
  component: UserNameForm,
  args: { onSubmit: fn() },
  decorators: [CenteredDecorator],
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { userName: "" } }

export const WithName: Story = { args: { userName: "Ritika" } }

/** Submitting a single-character name shows a validation error. */
export const RejectsSingleCharacter: Story = {
  args: { userName: "R" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }))
    await expect(canvas.getByText("Name must be at least 2 characters.")).toBeInTheDocument()
    expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

/** Submitting with an empty name shows a validation error. */
export const RejectsEmpty: Story = {
  args: { userName: "" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }))
    await expect(canvas.getByText("Name must be at least 2 characters.")).toBeInTheDocument()
    expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

/** A two-character name is accepted. */
export const AcceptsTwoCharacters: Story = {
  args: { userName: "" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox")
    await userEvent.clear(input)
    await userEvent.type(input, "Jo")
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ n: "Jo" }),
      expect.anything(),
    )
  },
}
