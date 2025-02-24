import type { StoryObj } from "@storybook/react"
import { Spinner } from "../Spinner"
import { CenteredDecorator } from "./util/CenteredDecorator"

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  decorators: [CenteredDecorator],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OnDark: Story = {
  args: { onDark: true },
  decorators: [
    Story => (
      <div className="rounded-lg bg-primary-500 p-12">
        <Story />
      </div>
    ),
  ],
}
