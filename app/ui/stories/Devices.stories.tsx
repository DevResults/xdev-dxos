import type { Meta, StoryObj } from "@storybook/react"
import { Devices } from "../Devices"
import { createDevice } from "./util/createDevice"
import { userAgentStrings } from "./util/userAgentStrings"

const macBook = createDevice(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
)
const iPhone = createDevice(
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
)
const allTheDevices = Object.values(userAgentStrings).map(ua => createDevice(ua))

const meta: Meta<typeof Devices> = {
  title: "Settings/Devices",
  component: Devices,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  args: { ownDevice: macBook },
}

export default meta
type Story = StoryObj<typeof meta>

// STORIES

export const OneDevice: Story = {
  args: { devices: [macBook] },
}

export const TwoDevices: Story = {
  args: { devices: [macBook, iPhone] },
}

export const AllTheDevices: Story = {
  args: { devices: [macBook, ...allTheDevices] },
}
