import type { Meta, StoryObj } from "@storybook/react"
import { getCurrentYear } from "lib/getCurrentYear"
import { reactRouterParameters } from "storybook-addon-remix-react-router"
import { YearNav } from "../YearNav"

const meta: Meta<typeof YearNav> = {
  title: "Components/YearNav",
  component: YearNav,
  decorators: [
    Story => (
      <>
        <div className="m-auto flex max-w-xl justify-end border p-3">
          <Story />
        </div>
      </>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof YearNav>

const currentYear = getCurrentYear()

const createStory = ({
  year,
  minYear = Number.NEGATIVE_INFINITY,
  maxYear = Number.POSITIVE_INFINITY,
}: {
  year: number
  minYear?: number
  maxYear?: number
}): Story => ({
  args: { minYear, maxYear },
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { year: year.toString() },
      },
      routing: {
        path: "/hours/:year",
        handle() {},
      },
    }),
  },
})

export const NoLimits: Story = createStory({
  year: currentYear + 99,
})

export const AtMinLimit: Story = createStory({
  year: currentYear,
  minYear: currentYear,
})

export const AtMaxLimit: Story = createStory({
  year: currentYear,
  maxYear: currentYear,
})

// Should redirect to current year
export const BeforeLimits: Story = createStory({
  year: currentYear - 7,
  minYear: currentYear,
})

// Should redirect to current year
export const AfterLimits: Story = createStory({
  year: currentYear + 7,
  maxYear: currentYear,
})
