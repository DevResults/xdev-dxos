import { LocalDate } from "@js-joda/core"
import type { Meta, StoryObj } from "@storybook/react"
import { reactRouterParameters } from "storybook-addon-remix-react-router"
import { WeekNav } from "ui/WeekNav"

const meta: Meta<typeof WeekNav> = {
  title: "Components/WeekNav",
  component: WeekNav,
  decorators: [
    Story => (
      <div className="m-auto flex max-w-xl justify-end border p-3">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WeekNav>

const createStory = (date: string): Story => {
  return {
    parameters: {
      reactRouter: reactRouterParameters({
        location: {
          pathParams: { date },
        },
        routing: {
          path: "/myweek/:date",
          handle() {},
        },
      }),
    },
  }
}

const today = LocalDate.now()

export const CurrentWeek: Story = createStory(today.toString())
export const PastWeek: Story = createStory(today.minusWeeks(1).toString())
export const FutureWeek: Story = createStory(today.plusWeeks(1).toString())
