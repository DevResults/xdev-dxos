import { expect, test, type BrowserContext } from "@playwright/test"
import { newBrowser } from "./helpers/App"

const userName = "herb"
const teamName = "DevResults"

const setup = async (context: BrowserContext) => {
  const herb = await newBrowser(context)
  await herb.createTeam(userName, teamName)
  return { herb }
}

test.describe("team members page", () => {
  test("displays the current user as a member", async ({ context }) => {
    const { herb } = await setup(context)

    // Navigate to the Team page
    await herb.navigateTo("Team")

    // Should see the Members heading
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible()

    // Should see the current user's name in the main content area (Members list)
    await expect(herb.page.getByRole("main").getByText(userName)).toBeVisible()

    // Current user should be marked as "You"
    await expect(herb.page.getByRole("main").getByText("You")).toBeVisible()
  })

  test("shows current user as admin", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Team")

    // The user who created the team should be an admin
    await expect(herb.page.getByText("Admin")).toBeVisible()
  })

  test("shows add contact button", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Team")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible({
      timeout: 10_000,
    })

    await expect(herb.page.getByRole("button", { name: "Add contact" })).toBeVisible()
  })

  test("clicking invite opens invite dialog", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Team")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible({
      timeout: 10_000,
    })
    await herb.pressButton("Add contact")
    await herb.page.getByRole("textbox", { name: "First name" }).fill("Ritika")
    const username = herb.page.getByRole("textbox", { name: "Username" })
    await username.fill("ritika")
    await username.press("Enter")
    await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible({
      timeout: 10_000,
    })
    await herb.page.keyboard.press("Escape")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible({
      timeout: 10_000,
    })

    // Re-open the invite dialog for this contact.
    await herb.pressButton("View")

    // Should navigate to the invite page/dialog
    await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible({
      timeout: 10_000,
    })
  })
})

test.describe("team navigation", () => {
  test("can navigate between team sections", async ({ context }) => {
    const { herb } = await setup(context)

    // Navigate to Team page (Members is the default)
    await herb.navigateTo("Team")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible({
      timeout: 10_000,
    })

    // Navigate to Clients (should show "Coming soon")
    await herb.page.goto("/team/clients")
    await expect(herb.page).toHaveURL(/\/team\/clients/)

    // Navigate to Projects (should show "Coming soon")
    await herb.page.goto("/team/projects")
    await expect(herb.page).toHaveURL(/\/team\/projects/)

    // Navigate back to Members
    await herb.page.goto("/team/members")
    await expect(herb.page).toHaveURL(/\/team\/members/)
  })
})

test.describe("editing contacts", () => {
  test("can edit a contact by clicking their name", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Team")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible({
      timeout: 10_000,
    })
    await herb.pressButton("Add contact")
    await herb.page.getByRole("textbox", { name: "First name" }).fill("Ritika")
    const username = herb.page.getByRole("textbox", { name: "Username" })
    await username.fill("ritika")
    await username.press("Enter")
    await expect(herb.page.getByRole("heading", { name: "Invite member" })).toBeVisible({
      timeout: 10_000,
    })
    await herb.page.keyboard.press("Escape")

    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible({
      timeout: 10_000,
    })

    // Click on the added contact name.
    const contactNameButton = herb.page.getByRole("link", { name: "Ritika" })
    await expect(contactNameButton).toBeVisible()
    await contactNameButton.click()

    // The edit form should open.
    await expect(herb.page.getByRole("heading", { name: "Ritika" })).toBeVisible({
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

    // The dialog should close and we should be back on the members page
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible()

    // Verify the grid shows the updated name
    const updatedNameButton = herb.page.getByRole("link", { name: "Herbert" })
    await expect(updatedNameButton).toBeVisible({ timeout: 30_000 })
  })
})
