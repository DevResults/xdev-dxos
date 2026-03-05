import { expect } from "@playwright/test"
import { test } from "./helpers/fixtures"

test.describe("my week navigation", () => {
  test("can navigate to previous week", async ({ app: herb }) => {
    const currentDateText = await herb.page.locator("h2").first().textContent()
    await herb.page.getByTitle("Previous week").click()
    const previousDateText = await herb.page.locator("h2").first().textContent()
    expect(previousDateText).not.toBe(currentDateText)
  })

  test("can navigate to next week", async ({ app: herb }) => {
    await herb.page.getByTitle("Previous week").click()
    const previousDateText = await herb.page.locator("h2").first().textContent()
    await herb.page.getByTitle("Next week").click()
    const currentDateText = await herb.page.locator("h2").first().textContent()
    expect(currentDateText).not.toBe(previousDateText)
  })
})
