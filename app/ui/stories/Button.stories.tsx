import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "../shadcn/button"
import { CenteredDecorator } from "./util/CenteredDecorator"

const meta = {
  title: "Components/Button",
  component: Button,
  decorators: [CenteredDecorator],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { children: "Click me", intent: "neutral" } }
export const Primary: Story = { args: { children: "Continue", intent: "primary" } }
export const Danger: Story = { args: { children: "Delete", intent: "danger" } }
export const ExtraSmall: Story = { args: { children: "Click me", size: "xs" } }
export const Small: Story = { args: { children: "Click me", size: "sm" } }
export const Medium: Story = { args: { children: "Click me", size: "md" } }
export const Large: Story = { args: { children: "Click me", size: "lg" } }
