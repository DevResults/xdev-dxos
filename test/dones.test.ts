import { expect } from "@playwright/test"
import { test } from "./helpers/fixtures"

const doneText = "Completed terabytes of coding and compiling"

test.describe.configure({ timeout: 45_000, retries: 2 })

test("persists a done across page reload", async ({ app: herb }) => {
  await herb.createDone(doneText)
  const doneEntry = herb.firstDoneEntryInput()
  await expect(doneEntry).toContainText(doneText)

  await herb.reload()

  const doneEntryAfterReload = herb.firstDoneEntryInput()
  await expect(doneEntryAfterReload).toContainText(doneText)
})

test("shows dones in team view", async ({ app: herb }) => {
  await herb.createDone(doneText)

  await herb.pressButton("Dones")
  await expect(herb.page.locator("main")).toContainText(doneText)
})
