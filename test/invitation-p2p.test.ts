import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

test.describe("P2P invitation flow", () => {
  // P2P connections need more time for signaling and swarm handshake
  test.setTimeout(60_000)

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
    console.log("Join URL:", joinUrl)

    // Extract the invitation code from the URL
    const invitationCode = joinUrl.split("/").pop()!
    expect(invitationCode.length).toBeGreaterThan(8)

    // ---- Ritika joins using the invitation link ----

    const ritika = await newBrowser(context)

    // Navigate to the join URL
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

    // The invitation code should be pre-filled in the input
    const invitationInput = ritika.page.getByRole("textbox", { name: "Invitation code" })
    await expect(invitationInput).toBeVisible()
    await expect(invitationInput).toHaveValue(invitationCode)

    // Click "Join team" — this should now work (not silently fail)
    await ritika.pressButton("Join team")

    // Should show "Connecting..." status (invitation is no longer prematurely cancelled)
    await expect(
      ritika.page.getByText("Connecting...").or(ritika.page.getByText("Verification code")),
    ).toBeVisible({ timeout: 30_000 })
  })
})
