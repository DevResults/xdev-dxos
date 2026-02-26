import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

test("can add a contact and open contact-specific invite dialog", async ({ context }) => {
  const app = await newBrowser(context)
  await app.createTeam("herb", "DevResults")

  await app.page.goto("/team/members/add")
  await expect(app.page.getByRole("textbox", { name: "First name" })).toBeVisible({
    timeout: 30_000,
  })

  await app.page.getByRole("textbox", { name: "First name" }).fill("Ritika")
  const username = app.page.getByRole("textbox", { name: "Username" })
  await username.fill("ritika")
  await username.press("Enter")

  await expect(app.page.getByRole("heading", { name: "Invite member" })).toBeVisible()
  await expect(app.page.getByRole("button", { name: "Copy link" })).toBeVisible()
})
