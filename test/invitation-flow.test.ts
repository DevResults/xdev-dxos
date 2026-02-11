import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

test("can add a contact and open contact-specific invite dialog", async ({ context }) => {
  const app = await newBrowser(context)
  await app.createTeam("herb", "DevResults")

  await app.page.goto("/team/members")
  await app.pressButton("Add contact")

  await app.page.getByRole("textbox", { name: "First name" }).fill("Ritika")
  await app.page.getByRole("textbox", { name: "Username" }).fill("ritika")
  await app.pressButton("Add contact")

  await expect(app.page.getByRole("heading", { name: "Invite member" })).toBeVisible()
  await expect(app.page.getByRole("button", { name: "Copy link" })).toBeVisible()
})
