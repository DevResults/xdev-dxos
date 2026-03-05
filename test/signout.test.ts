import { expect } from "@playwright/test"
import { test } from "./helpers/fixtures"

test("signing out redirects to the first-use flow and allows creating a new team", async ({
  app,
}) => {
  // We start authenticated on the myweek page
  await expect(app.page).toHaveURL(/myweek/)

  // Sign out
  await app.signOut()

  // After signing out, we should land on either:
  // - /auth/begin (if client.reset() fully cleared IndexedDB — no identity)
  // - /auth/setup (if identity persists but spaceKey was cleared from localStorage)
  // Both are valid — the key thing is we're NOT stuck on a blank screen.
  await expect(app.page).toHaveURL(/auth\/(begin|setup)/, { timeout: 30_000 })

  // If we're on /auth/begin, enter a name first to get to /auth/setup
  if (app.page.url().includes("/auth/begin")) {
    await app.enterFirstName("NewUser")
    await app.pressButton("Continue")
  }

  // Now we should be on the setup page — create a new team
  await expect(app.page.getByRole("link", { name: "Create a team" })).toBeVisible({
    timeout: 15_000,
  })
  await app.pressButton("Create a team")
  await app.enterTeamName("NewTeam")
  await app.pressButton("Continue")

  // Should land on the main app
  await expect(app.page.getByRole("heading", { name: "Dones" })).toBeVisible({ timeout: 30_000 })
})
