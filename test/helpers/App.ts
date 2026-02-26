import {
  expect,
  type BrowserContext,
  type Browser,
  type ConsoleMessage,
  type Locator,
  type Page,
} from "@playwright/test"
import { expect as customExpect } from "./expect"

const pause = async (t = 0) =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, t)
  })

export const newBrowser = async (context: BrowserContext) => {
  const page = await context.newPage()
  return new App(page).start()
}

export const newIsolatedBrowser = async (browser: Browser) => {
  const isolatedContext = await browser.newContext()
  const page = await isolatedContext.newPage()
  return new App(page).start()
}

export class App {
  // eslint-disable-next-line @typescript-eslint/parameter-properties -- Node's strip-only mode doesn't support parameter properties
  readonly page: Page
  userName?: string
  teamName?: string

  constructor(page: Page) {
    this.page = page
  }

  // GENERAL

  log(message: ConsoleMessage) {
    const text: string = message
      .text()
      .replaceAll(/(color: #([\dA-F]{6}))|(color: inherit)|%c/g, "")
    // Filter out noise warnings from Vite/Node module externalization
    if (
      text.includes("Lit is in dev mode") ||
      text.includes("has been externalized for browser compatibility") ||
      text.includes("React DevTools") ||
      text.includes("Files in the public directory") ||
      text.includes("[vite] connect")
    ) {
      return
    }

    console.log(text)
  }

  async start() {
    await this.page.goto("/")

    const debug = process.env.DEBUG
    if (debug) {
      // Feed browser logs to test output
      this.page.on("console", message => {
        this.log(message)
      })

      // Enable debug logging
      await this.page.evaluate(`window.localStorage.setItem('debug', '${debug}')`)
      // Reload so these take effect
      await pause(500)
      await this.page.reload()
    }

    return this
  }

  async reload() {
    await pause(500)
    await this.page.reload({ waitUntil: "domcontentloaded" })
    return this
  }

  async close() {
    await this.page.context().close()
  }

  get expect() {
    return customExpect(this)(this.page)
  }

  async pressButton(name: string) {
    const button = this.page.getByRole("button", { name })
    const link = this.page.getByRole("link", { name })

    if (name === "Done") {
      await expect(button.first()).toBeVisible()
      await button.first().click()
      return
    }

    const buttonLike = button.or(link)
    await expect(buttonLike).toBeVisible()
    await buttonLike.click()
  }

  async navigateTo(name: string) {
    const nav = this.page.locator("nav")
    await nav.getByRole("link", { name }).click()
  }

  async pressEnter(locator: Locator) {
    await locator.press("Enter")
  }

  async enterFirstName(firstName: string) {
    const textbox = this.page.getByRole("textbox")
    await expect(textbox).toBeVisible()
    await textbox.fill(firstName)
    this.userName = firstName
    return textbox
  }

  async enterInvitationDeviceCode(invitationDeviceCode: string) {
    const textbox = this.page.getByRole("textbox")
    await expect(textbox).toBeVisible()
    await textbox.fill(invitationDeviceCode)
    return textbox
  }

  async enterTeamName(teamName: string) {
    const textbox = this.page.getByRole("textbox")
    await expect(textbox).toBeVisible()
    await textbox.fill(teamName)
    this.teamName = teamName
    return textbox
  }

  async getClipboard() {
    return this.page.evaluate<string>("navigator.clipboard.readText()")
  }

  async sidebar() {
    return this.page.locator("aside")
  }

  async header() {
    return this.page.locator("header")
  }

  // AUTH

  async createTeam(userName: string, teamName: string) {
    await this.enterFirstName(userName)
    await this.pressButton("Continue")
    await this.pressButton("Create a team")
    await this.enterTeamName(teamName)
    await this.pressButton("Continue")
    // Wait for the myweek page to fully load (shows h3 "Dones" in the MyWeek component)
    await expect(this.page.getByRole("heading", { name: "Dones" })).toBeVisible({ timeout: 30_000 })
  }

  async linkDevice(userName: string, invitationDeviceCode: string) {
    await this.enterFirstName(userName)
    await this.pressButton("Continue")
    await this.pressButton("Link this device")
    await this.enterInvitationDeviceCode(invitationDeviceCode)
    await this.pressButton("Join team")
    // Wait for the myweek page to fully load (shows h3 "Dones" in the MyWeek component)
    await expect(this.page.getByRole("heading", { name: "Dones" })).toBeVisible({ timeout: 30_000 })
  }

  async signOut() {
    await this.navigateTo("Sign out")
    await this.pressButton("Yes, sign out")
  }

  async getContactRow(userName: string) {
    await this.navigateTo("Team")
    const contactRow = this.page.locator(".Members > div").filter({ hasText: userName })
    await expect(contactRow).toBeVisible()
    return contactRow
  }

  async revoke(userName: string) {
    const contactRow = await this.getContactRow(userName)
    const revokeButtonLink = contactRow.getByRole("link", { name: "Revoke" })
    await expect(revokeButtonLink).toBeVisible()
    await revokeButtonLink.click()
    await this.pressButton("Yes")
  }

  async deleteContact(userName: string) {
    const contactRow = await this.getContactRow(userName)
    const deleteButtonLink = contactRow.getByTitle("Remove member from team")
    await expect(deleteButtonLink).toBeVisible()
    await deleteButtonLink.click()
    await this.pressButton("Yes")
  }

  async createDeviceInvitation() {
    await this.navigateTo("Settings")
    await this.navigateTo("Devices")
    await this.pressButton("Link another device")
    await this.pressButton("Copy code")
    await pause(100)
    await this.page.keyboard.press("Escape")
    const invitationCode: string = await this.getClipboard()
    return invitationCode
  }

  async contacts() {
    await this.navigateTo("Team")
    return this.page.locator(".Members")
  }

  async devices() {
    await this.navigateTo("Settings")
    await this.navigateTo("Devices")
    return this.page.locator(".DeviceInfo")
  }

  // DONES

  donesArea() {
    return this.page.locator("h3:has-text('Dones') + div").first()
  }

  firstDoneEntryInput() {
    // Finds the first textarea after the "Dones" heading
    return this.donesArea().locator("textarea").first()
  }

  async createDone(doneText: string) {
    const doneEntry = this.firstDoneEntryInput()
    await doneEntry.click()
    await doneEntry.fill(doneText)
    await doneEntry.press("Tab")
  }

  // HOURS

  hoursArea() {
    return this.page.locator("div:has(h3:has-text('Hours')) ~ div ul")
  }

  hoursForDay(index: number) {
    return this.hoursArea().nth(index)
  }

  firstTimeEntryInput() {
    // Locates the first textarea after the "Hours" heading
    return this.hoursForDay(0).getByRole("combobox").first()
  }

  firstTimeEntry() {
    // Locates the first list item after the "Hours" heading
    return this.hoursForDay(0).getByRole("listitem").first()
  }

  async createTimeEntry(timeEntryText: string) {
    const timeEntry = this.firstTimeEntryInput()
    await timeEntry.fill(timeEntryText)
    await this.page.keyboard.press("Space") // Clear autocomplete
    await this.page.keyboard.press("Enter")
  }
}
