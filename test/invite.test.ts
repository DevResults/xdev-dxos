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
  test.setTimeout(120_000)

  // Note: This test requires SIGNAL=1 for peer-to-peer connections to work
  test("invited member can see shared content", async ({ context }) => {
    // User 1 creates a team and adds some content
    const herb = await setupUser1(context)

    // User 1 navigates to Team page
    await herb.navigateTo("Team")

    // Wait for the members page to fully load
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible()
    await expect(herb.page.getByRole("main").getByText(userName1)).toBeVisible({ timeout: 10_000 })

    // Click the Invite button
    await herb.page.waitForTimeout(500)
    await herb.pressButton("Invite")

    // Wait for navigation to the invite route
    await herb.page.waitForURL(/\/team\/members\/invite/)

    // The invite member dialog opens
    await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible({
      timeout: 30_000,
    })

    // Wait for invitation code to be generated
    const copyLinkButton = herb.page.getByRole("button", { name: /copy link/i })
    await expect(copyLinkButton).toBeVisible({ timeout: 10_000 })

    // User 1 copies the invitation link
    await herb.page.locator("[title='Copy link']").click({ force: true })

    // Get the invitation URL from clipboard
    const invitationUrl = await herb.getClipboard()
    expect(invitationUrl).toBeTruthy()
    expect(invitationUrl).toContain("/auth/setup/join/")

    // Wait for the auth code to appear
    await expect(herb.page.getByText("Verification code")).toBeVisible({ timeout: 15_000 })

    // Copy the auth code
    await herb.page.locator("[title='Copy code']").click({ force: true })
    const authCode = await herb.getClipboard()
    expect(authCode).toBeTruthy()
    expect(authCode).toHaveLength(6)

    // Capture User 1's console messages
    const user1Console: string[] = []
    herb.page.on("console", msg => {
      if (msg.text().includes("[InvitePage]")) {
        user1Console.push(msg.text())
      }
    })

    // User 2 opens a NEW browser (simulating a different person)
    const browser2 = await context.browser()!.newContext()
    const page2 = await browser2.newPage()

    // Capture User 2's console messages
    const user2Console: string[] = []
    page2.on("console", msg => {
      if (msg.text().includes("[JoinPage]") || msg.text().includes("Mesh")) {
        user2Console.push(msg.text())
      }
    })

    // User 2 pastes the invitation URL
    await page2.goto(invitationUrl)

    // User 2 is prompted to enter their name
    await expect(page2.getByRole("textbox")).toBeVisible()
    await page2.getByRole("textbox").fill(userName2)
    await page2.getByRole("button", { name: "Continue" }).click()

    // User 2 sees the join form with the invitation code pre-filled
    await expect(page2.getByRole("button", { name: "Join team" })).toBeVisible({ timeout: 10_000 })

    // Take screenshots before clicking join
    await page2.screenshot({ path: "test-results/user2-before-join.png" })
    await herb.page.screenshot({ path: "test-results/user1-before-join.png" })

    await page2.getByRole("button", { name: "Join team" }).click()

    // Wait and check status
    await page2.waitForTimeout(3000)
    await page2.screenshot({ path: "test-results/user2-after-join.png" })
    await herb.page.screenshot({ path: "test-results/user1-after-join.png" })

    // Log console messages
    console.log("=== User 1 Console ===")
    for (const msg of user1Console) {
      console.log(msg)
    }

    console.log("=== User 2 Console ===")
    for (const msg of user2Console) {
      console.log(msg)
    }

    // Wait for the connection to establish and show the verification code prompt
    await expect(page2.getByText("Enter the verification code")).toBeVisible({
      timeout: 30_000,
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
