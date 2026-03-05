import { expect } from "@playwright/test"
import { test } from "./helpers/fixtures"

test.setTimeout(60_000)

test("can revoke a pending invitation from the members table", async ({ app }) => {
  await app.page.goto("/team/members/add")
  await app.page.getByRole("textbox", { name: "First name" }).fill("Ritika")
  await app.page.getByRole("textbox", { name: "Username" }).fill("ritika")
  await app.pressButton("Done")
  await app.page.getByRole("dialog").getByRole("button", { name: "Done" }).click()

  const contactRow = app.page.locator(".Members > div").filter({ hasText: "Ritika" })
  await expect(contactRow.getByRole("link", { name: "Revoke" })).toBeVisible()
  await contactRow.getByRole("link", { name: "Revoke" }).click()

  await expect(app.page.getByRole("button", { name: "Yes, revoke" })).toBeVisible()
  await app.pressButton("Yes, revoke")
  await expect(contactRow.getByText("Invitation revoked")).toBeVisible()
})
