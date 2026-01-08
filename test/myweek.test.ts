import { expect, test, type BrowserContext } from "@playwright/test"
import { newBrowser } from "./helpers/App"

const userName = "herb"
const teamName = "DevResults"

const setup = async (context: BrowserContext) => {
  const herb = await newBrowser(context)
  await herb.createTeam(userName, teamName)
  return { herb }
}

test.describe("my week page", () => {
  test("shows Hours and Dones sections", async ({ context }) => {
    const { herb } = await setup(context)

    // The myweek page is the default landing page after team creation
    await expect(herb.page.getByRole("heading", { name: "Hours" })).toBeVisible()
    await expect(herb.page.getByRole("heading", { name: "Dones" })).toBeVisible()
  })

  test("shows days of the week", async ({ context }) => {
    const { herb } = await setup(context)

    // Should show Mon-Fri by default (weekends hidden)
    await expect(herb.page.getByText("mon", { exact: false })).toBeVisible()
    await expect(herb.page.getByText("tue", { exact: false })).toBeVisible()
    await expect(herb.page.getByText("wed", { exact: false })).toBeVisible()
    await expect(herb.page.getByText("thu", { exact: false })).toBeVisible()
    await expect(herb.page.getByText("fri", { exact: false })).toBeVisible()
  })

  test("can toggle weekend visibility", async ({ context }) => {
    const { herb } = await setup(context)

    // Weekends are hidden by default
    const saturdayCount = await herb.page.getByText("sat", { exact: false }).count()
    expect(saturdayCount).toBe(0)

    // Check the "Show weekends" checkbox
    await herb.page.getByRole("checkbox", { name: "Show weekends" }).check()

    // Now weekend days should be visible
    await expect(herb.page.getByText("sat", { exact: false })).toBeVisible()
    await expect(herb.page.getByText("sun", { exact: false })).toBeVisible()
  })

  test("can create time entries and dones from myweek", async ({ context }) => {
    const { herb } = await setup(context)

    // Create a time entry
    await herb.createTimeEntry("1h #out")
    await expect(herb.page.locator("main")).toContainText("1:00")
    await expect(herb.page.locator("main")).toContainText("Out")

    // Create a done
    await herb.createDone("Completed task A")
    await expect(herb.page.locator("main")).toContainText("Completed task A")
  })

  test("shows weekly total", async ({ context }) => {
    const { herb } = await setup(context)

    // Create time entries
    await herb.createTimeEntry("2h #out")

    // The weekly total should show 2:00
    // The stopwatch icon is next to the total in the Hours header
    await expect(herb.page.locator("main")).toContainText("2:00")
  })

  test("can navigate to previous week", async ({ context }) => {
    const { herb } = await setup(context)

    // Get the current week's first date shown
    const currentDateText = await herb.page.locator("h2").first().textContent()

    // Click the previous week button (left arrow)
    await herb.page.getByTitle("Previous week").click()

    // The dates should have changed
    const previousDateText = await herb.page.locator("h2").first().textContent()
    expect(previousDateText).not.toBe(currentDateText)
  })

  test("can navigate to next week", async ({ context }) => {
    const { herb } = await setup(context)

    // Go to previous week first so we can go forward
    await herb.page.getByTitle("Previous week").click()

    // Get the previous week's first date
    const previousDateText = await herb.page.locator("h2").first().textContent()

    // Click the next week button (right arrow)
    await herb.page.getByTitle("Next week").click()

    // The dates should have changed back
    const currentDateText = await herb.page.locator("h2").first().textContent()
    expect(currentDateText).not.toBe(previousDateText)
  })
})
