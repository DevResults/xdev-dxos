import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, within } from "@storybook/test"
import { CenteredDecorator } from "ui/stories/util/CenteredDecorator"
import { TeamNameForm } from "../TeamNameForm"

const meta: Meta<typeof TeamNameForm> = {
  title: "Auth/TeamNameForm",
  component: TeamNameForm,
  args: { onSubmit: fn() },
  decorators: [CenteredDecorator],
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { teamName: "" } }

export const WithName: Story = { args: { teamName: "DevResults" } }

/** Submitting with an empty team name shows a validation error. */
export const RejectsEmpty: Story = {
  args: { teamName: "" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }))
    await expect(canvas.getByText("Team name must be at least 2 characters.")).toBeInTheDocument()
    expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

/** Submitting a single-character team name shows a validation error. */
export const RejectsSingleCharacter: Story = {
  args: { teamName: "" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox")
    await userEvent.clear(input)
    await userEvent.type(input, "X")
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }))
    await expect(canvas.getByText("Team name must be at least 2 characters.")).toBeInTheDocument()
    expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

/** A two-character team name is accepted. */
export const AcceptsTwoCharacters: Story = {
  args: { teamName: "" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox")
    await userEvent.clear(input)
    await userEvent.type(input, "DR")
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ teamName: "DR" }),
      expect.anything(),
    )
  },
}
