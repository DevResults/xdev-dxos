import { expect } from "@playwright/test"
import { type App } from "./helpers/App"
import { test } from "./helpers/fixtures"

const openAddContactForm = async (herb: App) => {
  await herb.page.goto("/team/members/add")
  const firstNameInput = herb.page.getByRole("textbox", { name: "First name" })
  await expect(firstNameInput).toBeVisible({ timeout: 30_000 })
  return firstNameInput
}

test.describe.configure({ timeout: 180_000 })

test("can add a contact and see it in the members list", async ({ app: herb }) => {
  const contactFirstNameInput = await openAddContactForm(herb)
  await contactFirstNameInput.fill("Zelda")
  const username = herb.page.getByRole("textbox", { name: "Username" })
  await username.fill("zelda")
  await username.press("Enter")
  await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible({
    timeout: 10_000,
  })
  await herb.page.keyboard.press("Escape")
  await expect(herb.page.getByRole("button", { name: "Add member" })).toBeVisible({
    timeout: 30_000,
  })

  // The contact appears in the list
  const contactNameButton = herb.page.getByRole("link", { name: "Zelda" })
  await expect(contactNameButton).toBeVisible()
})

test("can edit a contact's name", async ({ app: herb }) => {
  const contactFirstNameInput = await openAddContactForm(herb)
  await contactFirstNameInput.fill("Zelda")
  const username = herb.page.getByRole("textbox", { name: "Username" })
  await username.fill("zelda")
  await username.press("Enter")
  await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible({
    timeout: 10_000,
  })
  await herb.page.keyboard.press("Escape")
  await expect(herb.page.getByRole("button", { name: "Add member" })).toBeVisible({
    timeout: 30_000,
  })

  // Click on the added contact name
  await herb.page.getByRole("link", { name: "Zelda" }).click()
  await expect(herb.page.getByRole("heading", { name: "Zelda" })).toBeVisible({
    timeout: 10_000,
  })

  // Change the first name
  const firstNameInput = herb.page.getByLabel("First name")
  await expect(firstNameInput).toBeVisible()
  await firstNameInput.clear()
  await firstNameInput.fill("Herbert")

  // Save the changes
  await herb.page.getByRole("button", { name: "Done" }).click()
  await expect(herb.page).toHaveURL(/\/team\/members/)

  // Verify the grid shows the updated name
  const updatedNameButton = herb.page.getByRole("link", { name: "Herbert" })
  await expect(updatedNameButton).toBeVisible({ timeout: 30_000 })
})
