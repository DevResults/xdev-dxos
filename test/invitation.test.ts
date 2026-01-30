import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

test.describe("P2P invitation flow", () => {
  // P2P connections need more time for signaling, swarm handshake, and auth
  test.setTimeout(120_000)

  test("invited member can join via invitation link", async ({ context }) => {
    // ---- Herb creates a team and generates an invitation ----

    const herb = await newBrowser(context)
    await herb.createTeam("herb", "DevResults")

    // Navigate to team and open invite dialog
    await herb.page.goto("/team/members", { waitUntil: "domcontentloaded" })
    // Wait for the page to fully render (DXOS needs time to initialize space data)
    await expect(herb.page.getByRole("button", { name: "Invite" })).toBeVisible({ timeout: 30_000 })
    await herb.page.getByRole("button", { name: "Invite" }).click()
    await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible({
      timeout: 15_000,
    })

    // Wait for the invitation link to appear and copy it
    const copyLinkButton = herb.page.getByRole("button", { name: "Copy link" })
    await expect(copyLinkButton).toBeVisible({ timeout: 15_000 })
    await copyLinkButton.click()
    const joinUrl = await herb.getClipboard()

    // Extract the invitation code from the URL
    const invitationCode = joinUrl.split("/").pop()!
    expect(invitationCode.length).toBeGreaterThan(8)

    // ---- Ritika joins using the invitation link ----

    const ritika = await newBrowser(context)
    await ritika.page.goto(joinUrl)

    // She should be redirected to auth/begin since she has no identity
    await expect(ritika.page.getByRole("textbox")).toBeVisible({ timeout: 10_000 })

    // Enter her name
    await ritika.enterFirstName("ritika")
    await ritika.pressButton("Continue")

    // She should land on the join page with the invitation code pre-filled
    await expect(ritika.page.getByRole("heading", { name: "Join a team" })).toBeVisible({
      timeout: 10_000,
    })
    const invitationInput = ritika.page.getByRole("textbox", { name: "Invitation code" })
    await expect(invitationInput).toHaveValue(invitationCode)

    // Click "Join team"
    await ritika.pressButton("Join team")

    // Should show "Connecting..." status
    await expect(
      ritika.page.getByText("Connecting...").or(ritika.page.getByText("Verification code")),
    ).toBeVisible({ timeout: 30_000 })

    // ---- Herb copies the verification code from his dialog ----

    const herbAuthCode = herb.page
      .locator("text=Verification code")
      .locator("..")
      .locator("pre span")
    await expect(herbAuthCode).toBeVisible({ timeout: 30_000 })
    const authCode = await herbAuthCode.textContent()
    expect(authCode).toBeTruthy()

    // ---- Ritika enters the verification code ----

    const authInput = ritika.page.getByRole("textbox", { name: "Verification code" })
    await expect(authInput).toBeVisible({ timeout: 30_000 })
    await expect(authInput).toBeEnabled()
    await authInput.fill(authCode!)

    await ritika.pressButton("Verify")

    // Should show "Joined! Redirecting..." then navigate to the app
    await expect(ritika.page.getByText("Joined! Redirecting...")).toBeVisible({ timeout: 30_000 })

    // Should land on the app (private layout shows "Dones" in the nav)
    await expect(ritika.page.getByRole("link", { name: "Dones" })).toBeVisible({ timeout: 30_000 })
  })
})

test.describe("join team invitation code validation", () => {
  const navigateToJoinTeam = async (app: Awaited<ReturnType<typeof newBrowser>>) => {
    // Complete user name step
    await app.enterFirstName("Herb")
    await app.pressButton("Continue")
    await app.pressButton("Join a team")

    // Wait for the join form to appear
    await expect(app.page.getByRole("heading", { name: "Join a team" })).toBeVisible()
  }

  test("rejects empty invitation code", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToJoinTeam(app)

    // Try to submit without entering a code
    await app.pressButton("Join team")

    // The error message is displayed
    await expect(app.page.getByText("Code must be at least 8 characters.")).toBeVisible()

    // We're still on the join page
    await expect(app.page.getByRole("heading", { name: "Join a team" })).toBeVisible()
  })

  test("rejects code shorter than 8 characters", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToJoinTeam(app)

    // Enter a code that's too short
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("abc1234")
    await app.pressButton("Join team")

    // The error message is displayed
    await expect(app.page.getByText("Code must be at least 8 characters.")).toBeVisible()
  })

  test("rejects code with special characters", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToJoinTeam(app)

    // Enter a code with special characters
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("abc12345!")
    await app.pressButton("Join team")

    // The error message is displayed
    await expect(
      app.page.getByText("An invitation code can only have letters and numbers."),
    ).toBeVisible()
  })

  test("rejects code with spaces", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToJoinTeam(app)

    // Enter a code with spaces
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("abc 12345")
    await app.pressButton("Join team")

    // The error message is displayed
    await expect(
      app.page.getByText("An invitation code can only have letters and numbers."),
    ).toBeVisible()
  })

  test("trims whitespace from code", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToJoinTeam(app)

    // Enter a valid code with leading/trailing whitespace
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("  abc12345  ")
    await app.pressButton("Join team")

    // No validation error (code is trimmed to valid 8+ chars)
    await expect(app.page.getByText("Code must be at least 8 characters.")).not.toBeVisible()
    await expect(
      app.page.getByText("An invitation code can only have letters and numbers."),
    ).not.toBeVisible()
  })

  test("accepts valid 8 character code", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToJoinTeam(app)

    // Enter a valid 8 character alphanumeric code
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("abc12345")
    await app.pressButton("Join team")

    // No validation error
    await expect(app.page.getByText("Code must be at least 8 characters.")).not.toBeVisible()
    await expect(
      app.page.getByText("An invitation code can only have letters and numbers."),
    ).not.toBeVisible()
  })
})

test.describe("link device invitation code validation", () => {
  const navigateToLinkDevice = async (app: Awaited<ReturnType<typeof newBrowser>>) => {
    // Complete user name step
    await app.enterFirstName("Herb")
    await app.pressButton("Continue")
    await app.pressButton("Link this device")

    // Wait for the link form to appear
    await expect(app.page.getByRole("heading", { name: "Link a device" })).toBeVisible()
  }

  test("rejects empty invitation code", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToLinkDevice(app)

    // Try to submit without entering a code
    await app.pressButton("Join team")

    // The error message is displayed
    await expect(app.page.getByText("Code must be at least 8 characters.")).toBeVisible()

    // We're still on the link page
    await expect(app.page.getByRole("heading", { name: "Link a device" })).toBeVisible()
  })

  test("rejects code shorter than 8 characters", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToLinkDevice(app)

    // Enter a code that's too short
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("abc1234")
    await app.pressButton("Join team")

    // The error message is displayed
    await expect(app.page.getByText("Code must be at least 8 characters.")).toBeVisible()
  })

  test("rejects code with special characters", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToLinkDevice(app)

    // Enter a code with special characters
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("abc12345@#")
    await app.pressButton("Join team")

    // The error message is displayed
    await expect(
      app.page.getByText("An invitation code can only have letters and numbers."),
    ).toBeVisible()
  })

  test("accepts valid alphanumeric code", async ({ context }) => {
    const app = await newBrowser(context)
    await navigateToLinkDevice(app)

    // Enter a valid alphanumeric code
    const textbox = app.page.getByRole("textbox", { name: "Invitation code" })
    await textbox.fill("ABCD1234xyz")
    await app.pressButton("Join team")

    // No validation error
    await expect(app.page.getByText("Code must be at least 8 characters.")).not.toBeVisible()
    await expect(
      app.page.getByText("An invitation code can only have letters and numbers."),
    ).not.toBeVisible()
  })
})
