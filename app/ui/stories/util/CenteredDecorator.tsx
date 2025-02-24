import type { Decorator } from "@storybook/react"
import { CenteredLayout } from "ui/layouts/CenteredLayout"

export const CenteredDecorator: Decorator = Story => (
  <CenteredLayout>
    <Story />
  </CenteredLayout>
)
