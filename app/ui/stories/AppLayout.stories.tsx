import type { Meta, StoryObj } from "@storybook/react"
import { PageLayout } from "ui/layouts/PageLayout"
import { SecondaryNav } from "ui/SecondaryNav"
import { AppLayout } from "../layouts/AppLayout"
import { storyContact } from "./util/storyContact"

const meta = {
  title: "Layouts/AppLayout",
  parameters: { layout: "fullscreen" },
  args: { self: storyContact("herb") },

  component: AppLayout,
} satisfies Meta<typeof AppLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { children: null } }

export const WithTopNav: Story = {
  args: {
    children: (
      <PageLayout
        nav={
          <SecondaryNav
            heading="Test"
            parent="foo"
            items={[
              { to: `/one`, label: "One" },
              { to: `/two`, label: "Two" },
            ]}
          />
        }
      >
        Content goes here
      </PageLayout>
    ),
  },
}
