import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

test("completing onboarding flow reaches the main app", async ({ context }) => {
  const app = await newBrowser(context)

  await app.enterFirstName("Jo")
  await app.pressButton("Continue")
  await app.pressButton("Create a team")
  await app.enterTeamName("DR")
  await app.pressButton("Continue")

  // We're on the main app (myweek page shows "Dones" heading)
  await expect(app.page.getByRole("heading", { name: "Dones" })).toBeVisible({ timeout: 30_000 })
})
