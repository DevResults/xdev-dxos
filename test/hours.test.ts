import { expect, test, type BrowserContext } from "@playwright/test"
import { newBrowser } from "./helpers/App"

const userName = "herb"
const teamName = "DevResults"

const setup = async (context: BrowserContext) => {
  const herb = await newBrowser(context)
  await herb.createTeam(userName, teamName)
  return { herb }
}

test("creates a time entry", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("creates two time entries (using enter key)", async ({ context }) => {
  const { herb } = await setup(context)

  const timeEntry = herb.firstTimeEntryInput()
  await timeEntry.click()
  await herb.page.keyboard.type("1h #out ")
  await herb.page.keyboard.press("Enter")
  await herb.page.keyboard.type("2h #overhead ")
  await herb.page.keyboard.press("Enter")

  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // the second entry is created in the same day
  await expect(herb.hoursForDay(0)).toContainText("2:00")
  await expect(herb.hoursForDay(0)).toContainText("Overhead")
})

test("creates two time entries (using tab key)", async ({ context }) => {
  const { herb } = await setup(context)

  const timeEntry = herb.firstTimeEntryInput()
  await timeEntry.click()
  await herb.page.keyboard.type("1h #out ")
  await herb.page.keyboard.press("Tab")
  await herb.page.keyboard.type("2h #overhead ")
  await herb.page.keyboard.press("Tab")

  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // the second entry is created in the next day
  await expect(herb.hoursForDay(1)).toContainText("2:00")
  await expect(herb.hoursForDay(1)).toContainText("Overhead")
})

test("creates two time entries at once", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry(`
    1h #out
    2h #overhead`)

  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")
  await expect(herb.hoursForDay(0)).toContainText("2:00")
  await expect(herb.hoursForDay(0)).toContainText("Overhead")
})

test("rejects a time entry containing no duration", async ({ context }) => {
  const { herb } = await setup(context)

  // try to create an invalid time entry with no duration
  await herb.createTimeEntry("#out")

  // the input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // the input is still focused
  await expect(input).toBeFocused()

  // the error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("No duration found")

  // the entry wasn't created
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("accepts a time entry once mistakes have been corrected", async ({ context }) => {
  const { herb } = await setup(context)

  // try to create an invalid time entry with no duration
  const input = herb.firstTimeEntryInput()
  await input.click()
  await herb.page.keyboard.type("#out ")
  await herb.page.keyboard.press("Enter")

  // the input is invalid
  await expect(input).toHaveAttribute("aria-invalid", "true")
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("No duration found")

  // the entry wasn't created
  await expect(herb.hoursForDay(0)).not.toContainText("Out")

  // correct the mistake
  await herb.page.keyboard.type(" 1h")
  await herb.page.keyboard.press("Enter")

  // the error is no longer visible
  await expect(errorMessage).not.toBeVisible()

  // the entry was created
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("entries are committed on blur", async ({ context }) => {
  // we need this since we're using focus/blur to control whether it's editable or not
  const { herb } = await setup(context)

  const input = herb.firstTimeEntryInput()
  await input.click()
  await herb.page.keyboard.type("90min #out ")

  // click away from the input
  await herb.page.locator("header").click()

  // the entry is committed
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("edits a time entry", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  const timeEntry = herb.firstTimeEntry()
  await expect(timeEntry).toContainText("1:30")
  await expect(timeEntry).toContainText("Out")

  // click to edit
  await timeEntry.click()

  // change the text
  await herb.page.keyboard.type("2h #overhead ")
  await herb.page.keyboard.press("Enter")

  // the entry is updated
  await expect(timeEntry).toContainText("2:00")
  await expect(timeEntry).toContainText("Overhead")

  // the previous entry is gone
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("deletes a time entry by clearing its text", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // edit the entry
  const timeEntry = herb.firstTimeEntry()
  await timeEntry.click()

  // remove the text
  await herb.page.keyboard.press("Delete")
  await herb.page.keyboard.press("Enter")

  // the time entry is gone
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("cancels an edit using the escape key", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  const timeEntry = herb.firstTimeEntry()
  await expect(timeEntry).toContainText("1:30")
  await expect(timeEntry).toContainText("Out")

  // click to edit
  await timeEntry.click()

  // change the text
  await herb.page.keyboard.type("2h #overhead")
  await herb.page.keyboard.press("Escape")

  // the entry is unchanged
  await expect(timeEntry).toContainText("1:30")
  await expect(timeEntry).toContainText("Out")
})

test("uses keyboard to navigate time entries", async ({ context }) => {
  const { herb } = await setup(context)

  // create a few time entries
  await herb.createTimeEntry(`
    1h #out doctor
    1h #out dentist
    1h #out car repair
    1h #out measles
    1h #out mumps
    1h #out polio
    `)

  // focus the first entry
  const firstEntry = herb.firstTimeEntry()
  await firstEntry.click()
  await expect(herb.page.locator(":focus")).toContainText("doctor")

  // use the down arrow key
  await herb.page.keyboard.press("End")
  await herb.page.keyboard.press("ArrowDown")
  await expect(herb.page.locator(":focus")).toContainText("dentist")
  await herb.page.keyboard.press("End")
  await herb.page.keyboard.press("ArrowDown")
  await expect(herb.page.locator(":focus")).toContainText("car repair")

  // use the up arrow key
  await herb.page.keyboard.press("Home")
  await herb.page.keyboard.press("ArrowUp")
  await expect(herb.page.locator(":focus")).toContainText("dentist")
  await herb.page.keyboard.press("Home")
  await herb.page.keyboard.press("ArrowUp")
  await expect(herb.page.locator(":focus")).toContainText("doctor")

  // use the tab key
  await herb.page.keyboard.press("Tab")
  await expect(herb.page.locator(":focus")).toContainText("dentist")
  await herb.page.keyboard.press("Tab")
  await expect(herb.page.locator(":focus")).toContainText("car repair")

  // use the shift+tab key
  await herb.page.keyboard.press("Shift+Tab")
  await expect(herb.page.locator(":focus")).toContainText("dentist")
  await herb.page.keyboard.press("Shift+Tab")
  await expect(herb.page.locator(":focus")).toContainText("doctor")
})

test("deletes a time entry", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // delete the entry
  const deleteButton = herb.firstTimeEntry().getByTitle("Delete")
  await deleteButton.click()

  // the time entry is gone
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("persists a time entry", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // reload the page
  await herb.reload()

  // the entry is still there
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("persists edits", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // edit the entry
  const timeEntry = herb.firstTimeEntry()
  await timeEntry.click()
  await herb.page.keyboard.type("2h #overhead ")
  await herb.page.keyboard.press("Enter")
  await expect(timeEntry).toContainText("2:00")
  await expect(timeEntry).toContainText("Overhead")

  // reload the page
  await herb.reload()

  // the modified entry is still there
  await expect(herb.hoursForDay(0)).toContainText("2:00")
  await expect(herb.hoursForDay(0)).toContainText("Overhead")
})

test("persists deletion", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // delete the entry
  const deleteButton = herb.firstTimeEntry().getByTitle("Delete")
  await deleteButton.click()
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")

  // reload the page
  await herb.reload()

  // the entry is still gone
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("autocompletes a project", async ({ context }) => {
  const { herb } = await setup(context)

  const timeEntry = herb.firstTimeEntryInput()

  //  no autocomplete menu is visible
  await expect(timeEntry).toHaveAttribute("aria-expanded", "false")

  await timeEntry.click()
  await herb.page.keyboard.type("1h #bus")

  // the autocomplete menu is visible
  await expect(timeEntry).toHaveAttribute("aria-expanded", "true")

  // find the autocomplete menu using aria properties
  const autocompleteId = await timeEntry.getAttribute("aria-controls")
  const autocompleteMenu = herb.page.locator(`#${autocompleteId}`)
  await expect(autocompleteMenu).toBeVisible()

  // confirm the expected options are present
  const options = await autocompleteMenu.locator("[role=option]").all()
  const optionsText = await Promise.all(options.map(async option => option.textContent()))
  expect(optionsText).toEqual([
    "Business:Contracts",
    "Business:Marketing",
    "Business:Outreach",
    "Business:Proposals",
  ])

  // select an option
  await options[1].click()

  // the menu is hidden
  await expect(autocompleteMenu).not.toBeVisible()
  await expect(timeEntry).toHaveAttribute("aria-expanded", "false")

  // the option is selected
  await expect(timeEntry).toContainText("#Business:Marketing")
})

test("autocompletes a client", async ({ context }) => {
  const { herb } = await setup(context)

  const timeEntry = herb.firstTimeEntryInput()

  await timeEntry.click()
  await herb.page.keyboard.type("1h @chem")

  // select the first option
  await herb.page.keyboard.press("ArrowDown")
  await herb.page.keyboard.press("Enter")

  // the option is selected
  await expect(timeEntry).toContainText("@chemonics")
})
