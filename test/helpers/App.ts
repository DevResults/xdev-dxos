import {
  expect,
  type BrowserContext,
  type ConsoleMessage,
  type Locator,
  type Page,
} from "@playwright/test"
import { expect as customExpect } from "./expect"

const pause = async (t = 0) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), t)
  })

export const newBrowser = async (context: BrowserContext) => {
  const browser = await context.browser()!.newContext()
  const page = await browser.newPage()
  return new App(page).start()
}

export class App {
  userName?: string
  teamName?: string

  constructor(readonly page: Page) {
    this.page = page
  }

  // GENERAL

  log(msg: ConsoleMessage) {
    const text: string = msg.text().replaceAll(/(color: #([\dA-F]{6}))|(color: inherit)|%c/g, "")
    // Filter out noise warnings from Vite/Node module externalization
    if (
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
      // feed browser logs to test output
      this.page.on("console", msg => this.log(msg))

      // enable debug logging
      await this.page.evaluate(`window.localStorage.setItem('debug', '${debug}')`)
      // reload so these take effect
      await pause(500)
      await this.page.reload()
    }

    return this
  }

  async reload() {
    await pause(1000) // give storage etc. time to finish
    await this.page.reload()
    return this
  }

  get expect() {
    return customExpect(this)(this.page)
  }

  async pressButton(name: string) {
    const button = this.page.getByRole("button", { name })
    const link = this.page.getByRole("link", { name })
    // https://playwright.dev/docs/locators#matching-one-of-the-two-alternative-locators
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
    await this.pressButton("Create")
    await this.enterTeamName(teamName)
    await this.pressButton("Continue")
    await this.page.getByRole("heading", { name: "Dones" }).isVisible()
  }

  async linkDevice(userName: string, invitationDeviceCode: string) {
    await this.enterFirstName(userName)
    await this.pressButton("Continue")
    await this.pressButton("Link this device")
    await this.enterInvitationDeviceCode(invitationDeviceCode)
    await this.pressButton("Join team")
    await this.page.getByRole("heading", { name: "Dones" }).isVisible()
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
    // finds the first textarea after the "Dones" heading
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
    // locates the first textarea after the "Hours" heading
    return this.hoursForDay(0).getByRole("combobox").first()
  }

  firstTimeEntry() {
    // locates the first list item after the "Hours" heading
    return this.hoursForDay(0).getByRole("listitem").first()
  }

  async createTimeEntry(timeEntryText: string) {
    const timeEntry = this.firstTimeEntryInput()
    await timeEntry.fill(timeEntryText)
    await this.page.keyboard.press("Space") // clear autocomplete
    await this.page.keyboard.press("Enter")
  }
}
