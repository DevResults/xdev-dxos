import { expect, test, type BrowserContext } from "@playwright/test"
import { newBrowser } from "./helpers/App"

const userName1 = "herb"
const userName2 = "alice"
const teamName = "DevResults"
const doneText = "Shipped the new feature"

/**
 * Sets up User 1 (herb) with a new team and some content.
 */
const setupUser1 = async (context: BrowserContext) => {
  const herb = await newBrowser(context)
  await herb.createTeam(userName1, teamName)
  await herb.createDone(doneText)
  return herb
}

test.describe("invitation flow", () => {
  // Increase timeout for invitation tests since they involve peer-to-peer connection
  test.setTimeout(60_000)

  test("invited member can see shared content", async ({ context }) => {
    // User 1 creates a team and adds some content
    const herb = await setupUser1(context)

    // User 1 navigates to Team page and clicks Invite
    await herb.navigateTo("Team")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible()
    await herb.pressButton("Invite")

    // The invite member dialog opens (our custom UI, not DXOS shell)
    await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible()

    // User 1 copies the invitation link
    await herb.page.getByRole("button", { name: /copy link/i }).click()

    // Get the invitation URL from clipboard
    const invitationUrl = await herb.getClipboard()
    expect(invitationUrl).toBeTruthy()
    expect(invitationUrl).toContain("/auth/setup/join/")

    // Wait for the auth code to appear - it shows after the invitation is ready
    await expect(herb.page.getByText("Verification code")).toBeVisible()

    // Copy the auth code
    await herb.page.getByRole("button", { name: /copy code/i }).click()
    const authCode = await herb.getClipboard()
    expect(authCode).toBeTruthy()
    expect(authCode).toHaveLength(6) // Auth codes are 6 digits

    // User 2 opens a NEW browser (simulating a different person)
    const browser2 = await context.browser()!.newContext()
    const page2 = await browser2.newPage()

    // User 2 pastes the invitation URL
    await page2.goto(invitationUrl)

    // User 2 is prompted to enter their name
    await expect(page2.getByRole("textbox")).toBeVisible()
    await page2.getByRole("textbox").fill(userName2)
    await page2.getByRole("button", { name: "Continue" }).click()

    // User 2 sees the join form and clicks "Join team"
    await expect(page2.getByRole("button", { name: "Join team" })).toBeVisible()
    await page2.getByRole("button", { name: "Join team" }).click()

    // Wait for the connection to establish and show the verification code prompt
    // This is our custom UI, not the DXOS shell iframe
    await expect(page2.getByText("Enter the verification code")).toBeVisible({
      timeout: 20_000,
    })

    // User 2 enters the auth code
    const authInput = page2.getByRole("textbox", { name: /verification code/i })
    await authInput.fill(authCode)
    await page2.getByRole("button", { name: "Verify" }).click()

    // Wait for connection to complete - User 2 should see the Dones page
    await expect(page2.getByRole("heading", { name: "Dones" })).toBeVisible({
      timeout: 30_000,
    })

    // User 2 navigates to the team Dones page
    await page2.getByRole("link", { name: "Dones" }).click()

    // User 2 should see the done created by User 1
    await expect(page2.locator("main")).toContainText(doneText)

    // Cleanup
    await browser2.close()
  })
})
