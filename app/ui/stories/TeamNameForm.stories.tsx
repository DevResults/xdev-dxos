import type { Meta, StoryObj } from "@storybook/react"
import { userEvent, within } from "@storybook/test"
import { CenteredDecorator } from "ui/stories/util/CenteredDecorator"
import { TeamNameForm } from "../TeamNameForm"

const meta: Meta<typeof TeamNameForm> = {
  title: "Auth/TeamNameForm",
  component: TeamNameForm,
  args: { onSubmit() {} },
  decorators: [CenteredDecorator],
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { teamName: "" } }

export const WithName: Story = { args: { teamName: "DevResults" } }

export const WithInvalidName: Story = {
  args: { teamName: "d" },
  play: async ({ canvasElement }) => userEvent.click(within(canvasElement).getByRole("button")),
}
