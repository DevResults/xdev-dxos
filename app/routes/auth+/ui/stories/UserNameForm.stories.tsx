import type { Meta, StoryObj } from "@storybook/react"
import { userEvent, within } from "@storybook/test"
import { CenteredDecorator } from "ui/stories/util/CenteredDecorator"
import { UserNameForm } from "../UserNameForm"

const meta: Meta<typeof UserNameForm> = {
  title: "Auth/UserNameForm",
  component: UserNameForm,
  args: { onSubmit() {} },
  decorators: [CenteredDecorator],
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { userName: "" } }

export const WithName: Story = { args: { userName: "Ritika" } }

export const WithInvalidName: Story = {
  args: { userName: "R" },
  play: async ({ canvasElement }) => userEvent.click(within(canvasElement).getByRole("button")),
}
