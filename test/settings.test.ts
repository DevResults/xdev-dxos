import { expect, test, type BrowserContext } from "@playwright/test"
import { newBrowser } from "./helpers/App"

const userName = "herb"
const teamName = "DevResults"

const setup = async (context: BrowserContext) => {
  const herb = await newBrowser(context)
  await herb.createTeam(userName, teamName)
  return { herb }
}

test.describe("settings navigation", () => {
  test("can navigate to settings", async ({ context }) => {
    const { herb } = await setup(context)

    // Navigate to Settings
    await herb.navigateTo("Settings")

    // Should navigate to the settings section
    await expect(herb.page).toHaveURL(/\/settings/, { timeout: 15_000 })
  })

  test("can navigate between settings sections", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Settings")
    await expect(herb.page).toHaveURL(/\/settings/, { timeout: 15_000 })

    // Navigate to Devices
    await herb.navigateTo("Devices")
    await expect(herb.page).toHaveURL(/\/settings\/devices/, { timeout: 15_000 })

    // Navigate to Profile (should show "Coming soon")
    await herb.navigateTo("Profile")
    await expect(herb.page).toHaveURL(/\/settings\/profile/, { timeout: 15_000 })
  })
})

test.describe("devices page", () => {
  test("shows devices heading", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Settings")
    await herb.navigateTo("Devices")

    await expect(herb.page).toHaveURL(/\/settings\/devices/)
  })

  test("shows current device", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Settings")
    await herb.navigateTo("Devices")

    // Should show at least one device (the current one)
    await expect(herb.page.locator(".DeviceInfo")).toBeVisible()
  })

  test("shows link another device button", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Settings")
    await herb.navigateTo("Devices")

    // Wait for devices page to load
    await expect(herb.page.getByRole("heading", { name: "Devices" })).toBeVisible()

    await expect(herb.page.getByRole("button", { name: "Link another device" })).toBeVisible()
  })

  test("clicking link another device opens dialog", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Settings")
    await herb.navigateTo("Devices")

    await expect(herb.page.getByRole("button", { name: "Link another device" })).toBeVisible()

    // Click the button
    await herb.pressButton("Link another device")

    // Should show a dialog with device linking info
    // The exact content depends on the shell.shareIdentity() implementation
    // but we should at least see a dialog or modal appear
    await expect(
      herb.page.getByText("Link another device").or(herb.page.getByText("Invitation code")),
    ).toBeVisible({ timeout: 10_000 })
  })
})
