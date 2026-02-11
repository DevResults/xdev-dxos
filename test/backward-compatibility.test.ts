import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

test("join route still supports direct invitation code links", async ({ context }) => {
  const app = await newBrowser(context)

  await app.page.goto("/auth/setup/join/ABCDEF12")
  await app.enterFirstName("rita")
  await app.pressButton("Continue")

  await expect(app.page.getByRole("heading", { name: "Join a team" })).toBeVisible()
  await expect(app.page.getByRole("textbox", { name: "Invitation code" })).toHaveValue("ABCDEF12")
})
