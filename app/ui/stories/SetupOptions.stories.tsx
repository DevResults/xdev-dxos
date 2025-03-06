import type { Meta, StoryObj } from "@storybook/react"
import { CenteredDecorator } from "ui/stories/util/CenteredDecorator"
import { SetupOptions } from "../SetupOptions"

const meta: Meta<typeof SetupOptions> = {
  title: "Auth/SetupOptions",
  component: SetupOptions,
  decorators: [CenteredDecorator],
}

export default meta
type Story = StoryObj<typeof meta>

// STORIES

export const Options: Story = { args: { confirmed: false } }
