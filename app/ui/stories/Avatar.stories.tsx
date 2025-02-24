import type { Meta, StoryObj } from "@storybook/react"
import { Avatar } from "../Avatar"
import { storyContact } from "./util/storyContact"
import { CenteredDecorator } from "./util/CenteredDecorator"

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  decorators: [CenteredDecorator],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const herb = storyContact("herb")
const herbWithoutAvatar = storyContact("herb")
herbWithoutAvatar.contact.avatarUrl = ""

export const ExtraSmall: Story = { args: { size: "xs", contact: herb } }
export const ExtraSmallNoImage: Story = {
  name: "Extra Small, Initial Only",
  args: { size: "xs", contact: herbWithoutAvatar },
}

export const Small: Story = { args: { size: "sm", contact: herb } }
export const SmallNoImage: Story = {
  name: "Small, Initial Only",
  args: { size: "sm", contact: herbWithoutAvatar },
}

export const Medium: Story = { args: { contact: herb } }
export const MediumNoImage: Story = {
  name: "Medium, Initial Only",
  args: { contact: herbWithoutAvatar },
}

export const Large: Story = { args: { size: "lg", contact: herb } }
export const LargeNoImage: Story = {
  name: "Large, Initial Only",
  args: { size: "lg", contact: herbWithoutAvatar },
}
