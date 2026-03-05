import { expect } from "@playwright/test"
import { test } from "./helpers/fixtures"

test("can navigate to settings and between sections", async ({ app: herb }) => {
  await herb.navigateTo("Settings")
  await expect(herb.page).toHaveURL(/\/settings/, { timeout: 15_000 })

  await herb.navigateTo("Devices")
  await expect(herb.page).toHaveURL(/\/settings\/devices/, { timeout: 15_000 })

  await herb.navigateTo("Profile")
  await expect(herb.page).toHaveURL(/\/settings\/profile/, { timeout: 15_000 })
})

test("shows current device on devices page", async ({ app: herb }) => {
  await herb.navigateTo("Settings")
  await herb.navigateTo("Devices")
  await expect(herb.page.locator(".DeviceInfo")).toBeVisible()
})
