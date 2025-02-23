import { expect as _expect, type Page } from "@playwright/test"
import { type App } from "./App"

export const expect = (app: App) => {
  return _expect.extend({
    async toSeeContact(page: Page, name: string) {
      const members = await app.contacts()
      try {
        await _expect(members).toContainText(name)
        return {
          message: () => "contact is visible",
          pass: true,
        }
      } catch {
        return {
          message: () => `contact is not visible`,
          pass: false,
        }
      }
    },
    async toBeLoggedIn(page: Page, name: string) {
      const header = await app.header()
      try {
        await _expect(header).toContainText(name)
        return {
          message: () => "user is logged in",
          pass: true,
        }
      } catch {
        return {
          message: () => `user is not logged in`,
          pass: false,
        }
      }
    },
    async toBeLoggedOut() {
      const header = await app.header()
      try {
        await _expect(header).toBeHidden()
        return {
          message: () => "user is not logged in",
          pass: true,
        }
      } catch {
        return {
          message: () => `user is logged in`,
          pass: false,
        }
      }
    },
  })
}
