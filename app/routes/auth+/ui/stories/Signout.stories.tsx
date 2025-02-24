import type { Meta, StoryObj } from "@storybook/react"
import { CenteredDecorator } from "ui/stories/util/CenteredDecorator"
import { Signout } from "../Signout"

const meta: Meta<typeof Signout> = {
  title: "Auth/Signout",
  component: Signout,
  decorators: [CenteredDecorator],
}

export default meta
type Story = StoryObj<typeof meta>

// STORIES

export const Warning: Story = { args: { confirmed: false } }
export const Confirmed: Story = { args: { confirmed: true } }
