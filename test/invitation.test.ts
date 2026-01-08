import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

// Note: These tests cover client-side validation of invitation codes.
// The actual P2P invitation flow tests are skipped pending resolution of DXOS connection issues.

test.describe("invitation flow (P2P)", () => {
  test.skip("invited member can see shared content", async () => {
    // TODO: Re-enable when DXOS P2P connections are working
    // This test requires two browser contexts to connect via the signal server
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
