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

    // Capture console messages to get the auth code when invitation is created
    let authCode: string | undefined
    herb.page.on("console", msg => {
      const text = msg.text()
      // DXOS logs invitation info as JSON: {"invitationCode":"...","authCode":"XXXXXX"}
      const match = /"authCode":"(\d{6})"/.exec(text)
      if (match) {
        authCode = match[1]
        console.log("Captured auth code from console:", authCode)
      }
    })

    // User 1 navigates to Team page and clicks Invite
    await herb.navigateTo("Team")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible()
    await herb.pressButton("Invite")

    // The DXOS shell opens showing "Space membership"
    const shell1 = herb.page.frameLocator('[data-testid="dxos-shell"]')
    await expect(shell1.getByText("Space membership")).toBeVisible()

    // User 1 opens the dropdown to select invitation type
    await shell1.getByTestId("spaces-panel.create-invitation.more").click()

    // User 1 selects "single-use" from the dropdown
    await shell1.getByText("Create single-use invitation").click()

    // User 1 clicks the "Create single-use invitation" button
    await shell1.getByRole("button", { name: /Create single-use invitation/ }).click()

    // The invitation is created - now click "View QR code" to see it
    await expect(shell1.getByText("View QR code")).toBeVisible()
    await shell1.getByText("View QR code").click()

    // Take screenshot of the QR code dialog
    await herb.page.waitForTimeout(500)
    await herb.page.screenshot({ path: "test-results/qr-code-dialog.png" })

    // User 1 copies the invitation link
    await shell1.getByRole("button", { name: /copy/i }).first().click()

    // Get the invitation URL from clipboard
    const clipboardUrl = await herb.getClipboard()
    expect(clipboardUrl).toBeTruthy()

    // Convert DXOS URL format (?spaceInvitationCode=X) to app format (/auth/setup/join/X)
    const url = new URL(clipboardUrl)
    const invitationCode = url.searchParams.get("spaceInvitationCode")
    expect(invitationCode).toBeTruthy()
    const invitationUrl = `${url.origin}/auth/setup/join/${invitationCode}`

    // The auth code should have been logged by now
    console.log("Auth code for invitation:", authCode)
    expect(authCode).toBeTruthy()

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

    // The DXOS shell opens on User 2's side showing "Joining space"
    const shell2 = page2.frameLocator('[data-testid="dxos-shell"]')
    await expect(shell2.getByText("Joining space")).toBeVisible()

    // BUG: The peer-to-peer connection gets stuck at "Connecting..." forever
    // The expected flow is:
    // 1. User 2 sees "Connecting..." while WebRTC peer connection establishes
    // 2. Once connected, User 2 sees "Enter the verification code" prompt
    // 3. User 2 enters the auth code from User 1
    // 4. Connection completes and User 2 sees the app
    //
    // What actually happens: Step 2 never occurs - stuck at "Connecting..."

    // Wait for the "Enter the verification code" prompt - this times out due to the bug
    await expect(shell2.getByText(/Enter the verification code/)).toBeVisible({
      timeout: 20_000,
    })

    // The following steps won't be reached due to the bug above
    // User 2 enters the auth code
    const authInput = shell2.getByRole("textbox")
    await authInput.fill(authCode!)
    await shell2.getByRole("button", { name: "Next" }).click()

    // Wait for connection to complete
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
