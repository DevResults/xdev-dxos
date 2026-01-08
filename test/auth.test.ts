import { expect, test } from "@playwright/test"
import { newBrowser } from "./helpers/App"

test.describe("user name validation", () => {
  test("rejects empty name", async ({ context }) => {
    const app = await newBrowser(context)

    // Try to continue without entering a name
    await app.pressButton("Continue")

    // The error message is displayed
    await expect(app.page.getByText("Name must be at least 2 characters.")).toBeVisible()

    // We're still on the begin page
    await expect(app.page.getByRole("heading", { name: "Welcome to XDev" })).toBeVisible()
  })

  test("rejects single character name", async ({ context }) => {
    const app = await newBrowser(context)

    await app.enterFirstName("A")
    await app.pressButton("Continue")

    // The error message is displayed
    await expect(app.page.getByText("Name must be at least 2 characters.")).toBeVisible()

    // We're still on the begin page
    await expect(app.page.getByRole("heading", { name: "Welcome to XDev" })).toBeVisible()
  })

  test("accepts two character name", async ({ context }) => {
    const app = await newBrowser(context)

    await app.enterFirstName("Jo")
    await app.pressButton("Continue")

    // No error message
    await expect(app.page.getByText("Name must be at least 2 characters.")).not.toBeVisible()

    // We're on the setup page (Create a team is a link, not a button)
    await expect(app.page.getByRole("link", { name: "Create a team" })).toBeVisible({
      timeout: 10_000,
    })
  })
})

test.describe("team name validation", () => {
  test("rejects empty team name", async ({ context }) => {
    const app = await newBrowser(context)

    // Complete user name step
    await app.enterFirstName("Herb")
    await app.pressButton("Continue")
    await app.pressButton("Create a team")

    // Wait for the team name form to appear
    await expect(app.page.getByRole("heading", { name: "Create a team" })).toBeVisible()

    // Clear the default team name and try to continue
    const textbox = app.page.getByRole("textbox")
    await textbox.clear()
    await app.pressButton("Continue")

    // The error message is displayed
    await expect(app.page.getByText("Team name must be at least 2 characters.")).toBeVisible()

    // We're still on the team name page
    await expect(app.page.getByRole("heading", { name: "Create a team" })).toBeVisible()
  })

  test("rejects single character team name", async ({ context }) => {
    const app = await newBrowser(context)

    // Complete user name step
    await app.enterFirstName("Herb")
    await app.pressButton("Continue")
    await app.pressButton("Create a team")

    // Wait for the team name form to appear
    await expect(app.page.getByRole("heading", { name: "Create a team" })).toBeVisible()

    // Clear and enter a single character
    const textbox = app.page.getByRole("textbox")
    await textbox.clear()
    await textbox.fill("X")
    await app.pressButton("Continue")

    // The error message is displayed
    await expect(app.page.getByText("Team name must be at least 2 characters.")).toBeVisible()

    // We're still on the team name page
    await expect(app.page.getByRole("heading", { name: "Create a team" })).toBeVisible()
  })

  test("accepts two character team name", async ({ context }) => {
    const app = await newBrowser(context)

    // Complete user name step
    await app.enterFirstName("Herb")
    await app.pressButton("Continue")
    await app.pressButton("Create a team")

    // Wait for the team name form to appear
    await expect(app.page.getByRole("heading", { name: "Create a team" })).toBeVisible()

    // Clear and enter two characters
    const textbox = app.page.getByRole("textbox")
    await textbox.clear()
    await textbox.fill("DR")
    await app.pressButton("Continue")

    // No error message
    await expect(app.page.getByText("Team name must be at least 2 characters.")).not.toBeVisible()

    // We're on the main app (myweek page shows "Dones" heading)
    await expect(app.page.getByRole("heading", { name: "Dones" })).toBeVisible({ timeout: 30_000 })
  })
})
