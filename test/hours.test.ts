import { expect, test, type BrowserContext, type Locator } from "@playwright/test"
import { newBrowser } from "./helpers/App"

const userName = "herb"
const teamName = "DevResults"

const setup = async (context: BrowserContext) => {
  const herb = await newBrowser(context)
  await herb.createTeam(userName, teamName)
  return { herb }
}

const openTimeEntryEditor = async (
  herb: Awaited<ReturnType<typeof newBrowser>>,
  entryRow: Locator,
) => {
  const display = entryRow.locator("[tabindex='0']").first()

  for (const _attempt of [1, 2, 3]) {
    if (await display.isVisible()) {
      await display.click()
    } else {
      await entryRow.click()
    }

    if ((await getActiveComboboxValue(herb)).length > 0) {
      return
    }
  }

  await expect.poll(() => getActiveComboboxValue(herb), { timeout: 10_000 }).not.toEqual("")
}

const getActiveComboboxValue = async (herb: Awaited<ReturnType<typeof newBrowser>>) =>
  herb.page.evaluate(() => {
    const active = document.activeElement
    if (!(active instanceof HTMLTextAreaElement)) {
      return ""
    }

    if (active.getAttribute("role") !== "combobox") {
      return ""
    }

    return active.value
  })

const setTimeEntryValueAndBlur = async (
  herb: Awaited<ReturnType<typeof newBrowser>>,
  entryRow: Locator,
  value: string,
) => {
  for (const _attempt of [1, 2, 3]) {
    await openTimeEntryEditor(herb, entryRow)
    const committed = await herb.page.evaluate(nextValue => {
      const active = document.activeElement
      if (!(active instanceof HTMLTextAreaElement)) {
        return false
      }

      if (active.getAttribute("role") !== "combobox") {
        return false
      }

      active.value = nextValue
      active.dispatchEvent(new Event("input", { bubbles: true }))
      active.blur()
      return true
    }, value)

    if (committed) {
      return
    }
  }

  throw new Error("Unable to set time entry value")
}

test.describe.configure({ timeout: 45_000 })

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
  await timeEntry.fill("1h #out ")
  await timeEntry.press("Enter")
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")
  const nextTimeEntry = herb.firstTimeEntryInput()
  await nextTimeEntry.fill("2h #overhead ")
  await nextTimeEntry.press("Enter")

  // The second entry is created in the same day
  await expect(herb.hoursForDay(0)).toContainText("2:00")
  await expect(herb.hoursForDay(0)).toContainText("Overhead")
})

test("creates two time entries (using tab key)", async ({ context }) => {
  const { herb } = await setup(context)

  const timeEntry = herb.firstTimeEntryInput()
  await timeEntry.fill("1h #out ")
  await timeEntry.press("Tab")

  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  const nextDayInput = herb.hoursForDay(1).getByRole("combobox").first()
  await expect(nextDayInput).toBeFocused()
  await nextDayInput.fill("2h #overhead ")
  await nextDayInput.press("Tab")

  // The second entry is created in the next day
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

  // Try to create an invalid time entry with no duration
  await herb.createTimeEntry("#out")

  // The input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The input is still focused
  await expect(input).toBeFocused()

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("No duration found")

  // The entry wasn't created
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("accepts a time entry once mistakes have been corrected", async ({ context }) => {
  const { herb } = await setup(context)

  // Try to create an invalid time entry with no duration
  const input = herb.firstTimeEntryInput()
  await input.click()
  await herb.page.keyboard.type("#out ")
  await herb.page.keyboard.press("Enter")

  // The input is invalid
  await expect(input).toHaveAttribute("aria-invalid", "true")
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("No duration found")

  // The entry wasn't created
  await expect(herb.hoursForDay(0)).not.toContainText("Out")

  // Correct the mistake
  await herb.page.keyboard.type(" 1h")
  await herb.page.keyboard.press("Enter")

  // The error is no longer visible
  await expect(errorMessage).not.toBeVisible()

  // The entry was created
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("entries are committed on blur", async ({ context }) => {
  // We need this since we're using focus/blur to control whether it's editable or not
  const { herb } = await setup(context)

  const input = herb.firstTimeEntryInput()
  await input.fill("90min #out ")
  await input.evaluate(element => {
    ;(element as HTMLTextAreaElement).blur()
  })

  // The entry is committed
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("edits a time entry", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // Click the first entry row to open its editor.
  const firstEntryRow = herb.hoursForDay(0).getByRole("listitem").first()

  // Change the text
  await setTimeEntryValueAndBlur(herb, firstEntryRow, "90min #out updated")

  // The entry is updated
  await expect(firstEntryRow).toContainText("updated", { timeout: 30_000 })
})

test("deletes a time entry by clearing its text", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // Edit the entry
  const timeEntry = herb.firstTimeEntry()
  await timeEntry.click()

  // Remove the text
  await herb.page.keyboard.press("Delete")
  await herb.page.keyboard.press("Enter")

  // The time entry is gone
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("cancels an edit using the escape key", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  const timeEntry = herb.firstTimeEntry()
  await expect(timeEntry).toContainText("1:30")
  await expect(timeEntry).toContainText("Out")

  // Click to edit
  await timeEntry.click()

  // Change the text
  await herb.page.keyboard.type("2h #overhead")
  await herb.page.keyboard.press("Escape")

  // The entry is unchanged
  await expect(timeEntry).toContainText("1:30")
  await expect(timeEntry).toContainText("Out")
})

test("uses keyboard to navigate time entries", async ({ context }) => {
  const { herb } = await setup(context)

  // Create a few time entries
  await herb.createTimeEntry(`
    1h #out doctor
    1h #out dentist
    1h #out car repair
    1h #out measles
    1h #out mumps
    1h #out polio
    `)

  // Open the "doctor" entry for keyboard interaction.
  const day = herb.hoursForDay(0)
  const doctorRow = day.getByRole("listitem").nth(0)
  await openTimeEntryEditor(herb, doctorRow)
  await expect(day.getByRole("combobox").first()).toBeVisible()

  // Arrow navigation at caret boundaries should keep the editor surface available.
  await herb.page.keyboard.press("End")
  await herb.page.keyboard.press("ArrowDown")
  await expect(day.getByRole("combobox").first()).toBeVisible()

  await herb.page.keyboard.press("Home")
  await herb.page.keyboard.press("ArrowUp")
  await expect(day.getByRole("combobox").first()).toBeVisible()
})

test("deletes a time entry", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")

  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // Delete the entry
  const deleteButton = herb.firstTimeEntry().getByTitle("Delete")
  await deleteButton.click()

  // The time entry is gone
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("persists a time entry", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // Reload the page
  await herb.reload()

  // The entry is still there
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("persists edits", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // Edit the entry
  const firstEntryRow = herb.hoursForDay(0).getByRole("listitem").first()
  await setTimeEntryValueAndBlur(herb, firstEntryRow, "90min #out updated")
  await expect(firstEntryRow).toContainText("updated", { timeout: 30_000 })

  // Reload the page
  await herb.reload()

  // The modified entry is still there
  await expect(herb.hoursForDay(0)).toContainText("updated")
})

test("persists deletion", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("90min #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")

  // Delete the entry
  const deleteButton = herb.firstTimeEntry().getByTitle("Delete")
  await deleteButton.click()
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")

  // Reload the page
  await herb.reload()

  // The entry is still gone
  await expect(herb.hoursForDay(0)).not.toContainText("1:30")
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("autocompletes a project", async ({ context }) => {
  const { herb } = await setup(context)

  const timeEntry = herb.firstTimeEntryInput()

  //  No autocomplete menu is visible
  await expect(timeEntry).toHaveAttribute("aria-expanded", "false")

  await timeEntry.click()
  await herb.page.keyboard.type("1h #bus")

  // The autocomplete menu is visible
  await expect(timeEntry).toHaveAttribute("aria-expanded", "true")

  // Find the autocomplete menu using aria properties
  const autocompleteId = await timeEntry.getAttribute("aria-controls")
  const autocompleteMenu = herb.page.locator(`#${autocompleteId}`)
  await expect(autocompleteMenu).toBeVisible()

  // Confirm the expected options are present
  const options = await autocompleteMenu.locator("[role=option]").all()
  const optionsText = await Promise.all(options.map(async option => option.textContent()))
  expect(optionsText).toEqual([
    "Business:Contracts",
    "Business:Marketing",
    "Business:Outreach",
    "Business:Proposals",
  ])

  // A matching option is present in the autocomplete results
  await expect(
    autocompleteMenu.getByRole("option").filter({ hasText: "Business:Marketing" }),
  ).toBeVisible()
})

test("opens client autocomplete for partial client code", async ({ context }) => {
  const { herb } = await setup(context)

  const timeEntry = herb.firstTimeEntryInput()

  await timeEntry.click()
  await herb.page.keyboard.type("1h @chem")
  await expect(timeEntry).toHaveAttribute("aria-expanded", "true")
})

// Validation error tests

test("rejects a time entry containing multiple durations", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h 2h #out")

  // The input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("More than one duration was found")

  // The entry wasn't created
  await expect(herb.hoursForDay(0)).not.toContainText("Out")
})

test("rejects a time entry without a project code", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h")

  // The input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("You need to include a project code")
})

test("rejects a time entry with multiple project codes", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h #out #overhead")

  // The input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("An entry can only have one project code")
})

test("rejects a time entry with an unknown project code", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h #nonexistent")

  // The input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText('There is no project with code "nonexistent"')
})

test("rejects a time entry with multiple client codes", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h #out @chemonics @aba")

  // The input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("An entry can only include one @client code")
})

test("rejects a time entry with an unknown client code", async ({ context }) => {
  const { herb } = await setup(context)

  const input = herb.firstTimeEntryInput()
  await input.click()
  await input.fill("1h #out @unknownclient")
  await input.press("Enter")

  // The input is invalid
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("Client code not found")
})

test("rejects a time entry when project requires a client but none provided", async ({
  context,
}) => {
  const { herb } = await setup(context)

  // Business:Contracts requires a client
  await herb.createTimeEntry("1h #Business:Contracts")

  // The input is invalid
  const input = herb.firstTimeEntryInput()
  await expect(input).toHaveAttribute("aria-invalid", "true")

  // The error message is displayed
  const errorMessageId = await input.getAttribute("aria-errormessage")
  const errorMessage = herb.page.locator(`#${errorMessageId}`)
  await expect(errorMessage).toContainText("you need to specify a client")
})

test("accepts a time entry when project requires a client and client is provided", async ({
  context,
}) => {
  const { herb } = await setup(context)

  // Business:Contracts requires a client - provide one
  await herb.createTimeEntry("1h #Business:Contracts @chemonics")

  // The entry was created
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Business:Contracts")
})

// Duration format tests

test("parses HH:MM duration format", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1:30 #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses :MM duration format (minutes only)", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry(":45 #out")
  await expect(herb.hoursForDay(0)).toContainText("0:45")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses decimal hours format", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1.5 #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses decimal hours format with leading dot", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry(".25 #out")
  await expect(herb.hoursForDay(0)).toContainText("0:15")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses hour abbreviation format", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("2hr #out")
  await expect(herb.hoursForDay(0)).toContainText("2:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses minute abbreviation format", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("45min #out")
  await expect(herb.hoursForDay(0)).toContainText("0:45")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses combined hour and minute format", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h30m #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses duration case-insensitively", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1HR30MIN #out")
  await expect(herb.hoursForDay(0)).toContainText("1:30")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

// Project code tests

test("parses project code with subcode", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h #Feature:API")
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Feature:API")
})

test("parses project code case-insensitively", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h #OUT")
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")
})

test("parses project code with spaces in subcode using dash", async ({ context }) => {
  const { herb } = await setup(context)

  // Project X has a space, should be matched via dash
  await herb.createTimeEntry("1h #Feature:Project-X")
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Feature:Project-X")
})

// Description tests

test("captures description text", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h #out doctor appointment")
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Out")
  await expect(herb.hoursForDay(0)).toContainText("doctor appointment")
})

test("captures description with client and project", async ({ context }) => {
  const { herb } = await setup(context)

  await herb.createTimeEntry("1h #Support:Ongoing @chemonics fixing login issue")
  await expect(herb.hoursForDay(0)).toContainText("1:00")
  await expect(herb.hoursForDay(0)).toContainText("Support:Ongoing")
  await expect(herb.hoursForDay(0)).toContainText("fixing login issue")
})
