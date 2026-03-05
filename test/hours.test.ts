import { expect } from "@playwright/test"
import { test } from "./helpers/fixtures"

test.describe.configure({ timeout: 45_000 })

test("persists a time entry across page reload", async ({ app: herb }) => {
  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // Reload the page
  await herb.reload()

  // The entry is still there
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("persists edits across page reload", async ({ app: herb }) => {
  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")

  // Edit the entry
  const firstEntryRow = herb.hoursForDay(0).getByRole("listitem").first()
  const display = firstEntryRow.locator("[tabindex='0']").first()
  await display.click()

  // Change the text via the active combobox
  await herb.page.evaluate(() => {
    const active = document.activeElement
    if (active instanceof HTMLTextAreaElement && active.getAttribute("role") === "combobox") {
      active.value = "90min #out updated"
      active.dispatchEvent(new Event("input", { bubbles: true }))
      active.blur()
    }
  })

  await expect(firstEntryRow).toContainText("updated", { timeout: 30_000 })

  // Reload the page
  await herb.reload()

  // The modified entry is still there
  await expect(herb.hoursForDay(0)).toContainText("updated")
})
