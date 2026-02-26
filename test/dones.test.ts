import { expect, test, type BrowserContext } from "@playwright/test"
import { newBrowser } from "./helpers/App"

export const userName = "herb"
export const teamName = "DevResults"
const doneText = "Completed terabytes of coding and compiling"

const setup = async (context: BrowserContext) => {
  const herb = await newBrowser(context)
  await herb.createTeam(userName, teamName)
  return { herb }
}

test.describe.configure({ timeout: 45_000, retries: 2 })

test("creates a done", async ({ context }) => {
  const { herb } = await setup(context)
  await herb.createDone(doneText)
  const doneEntry = herb.firstDoneEntryInput()
  await expect(doneEntry).toContainText(doneText)
})

test("persists a done", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createDone(doneText)
  const doneEntry = herb.firstDoneEntryInput()
  await expect(doneEntry).toContainText(doneText)

  await herb.reload()

  const doneEntryAfterReload = herb.firstDoneEntryInput()
  await expect(doneEntryAfterReload).toContainText(doneText)
})

test("edits a done", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createDone(doneText)
  const doneEntry = herb.firstDoneEntryInput()
  await expect(doneEntry).toContainText(doneText)

  await doneEntry.click()
  await doneEntry.press("Control+A")
  await doneEntry.fill("Completed petabytes of coding and compiling")
  await doneEntry.press("Enter")

  await herb.reload()

  const doneEntryAfterReload = herb.firstDoneEntryInput()
  await expect(doneEntryAfterReload).toContainText("Completed petabytes of coding and compiling")
})

test("deletes a done", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createDone(doneText)

  const doneEntry = herb.firstDoneEntryInput()
  await expect(doneEntry).toContainText(doneText)
  await doneEntry.click()

  const deleteButton = herb.page.getByTitle("Delete")
  await deleteButton.click()

  const doneEntryAfterReload = herb.firstDoneEntryInput()
  await expect(doneEntryAfterReload).not.toContainText(doneText)
})

test("shows dones in team view", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createDone(doneText)

  await herb.pressButton("Dones")
  await expect(herb.page.locator("main")).toContainText(doneText)
})

test.skip("likes a done", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createDone(doneText)

  {
    // Herb goes to the team dones page
    await herb.navigateTo("Dones")

    // The done is visible and has no likes
    const done = herb.page.getByText(doneText).first()
    await expect(done).toBeVisible({ timeout: 30_000 })

    // They like the done
    const likeButton = herb.page.getByRole("button", { name: "Click to like" }).first()
    await expect(likeButton).toBeVisible({ timeout: 10_000 })
    await likeButton.click()

    // The done now has 1 like and herb can see that they liked it
    await expect(herb.page.getByTitle("you liked this").first()).toBeVisible()
  }
})
