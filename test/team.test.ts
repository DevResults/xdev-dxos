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

  test("shows invite button", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Team")

    // Should see an Invite button
    await expect(herb.page.getByRole("button", { name: "Invite" })).toBeVisible()
  })

  test("clicking invite opens invite dialog", async ({ context }) => {
    const { herb } = await setup(context)

    await herb.navigateTo("Team")

    // Click the Invite button
    await herb.pressButton("Invite")

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
    await herb.navigateTo("Clients")
    await expect(herb.page.getByText("Coming soon")).toBeVisible({ timeout: 10_000 })

    // Navigate to Projects (should show "Coming soon")
    await herb.navigateTo("Projects")
    await expect(herb.page.getByText("Coming soon")).toBeVisible()

    // Navigate back to Members
    await herb.navigateTo("Members")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible()
  })
})

test.describe("editing contacts", () => {
  test("can edit a contact by clicking their name", async ({ context }) => {
    const { herb } = await setup(context)

    // Navigate directly to the Members page via URL
    await herb.page.goto("/team/members")
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible({
      timeout: 10_000,
    })

    // Click on the contact's first name (which is "herb" from the setup)
    const contactNameButton = herb.page.locator(".Members").getByRole("button", { name: userName })
    await expect(contactNameButton).toBeVisible()
    await contactNameButton.click()

    // The edit dialog should open
    await expect(herb.page.getByRole("heading", { name: "Edit contact" })).toBeVisible({
      timeout: 10_000,
    })

    // Change the first name
    const firstNameInput = herb.page.getByLabel("First name")
    await expect(firstNameInput).toBeVisible()
    await firstNameInput.clear()
    await firstNameInput.fill("Herbert")

    // Save the changes
    await herb.pressButton("Save changes")

    // The dialog should close and we should be back on the members page
    await expect(herb.page.getByRole("heading", { name: "Edit contact" })).not.toBeVisible()
    await expect(herb.page.getByRole("heading", { name: "Members" })).toBeVisible()

    // Verify the grid shows the updated name
    const updatedNameButton = herb.page.locator(".Members").getByRole("button", { name: "Herbert" })
    await expect(updatedNameButton).toBeVisible({ timeout: 10_000 })
  })
})
