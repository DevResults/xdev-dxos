import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { chromium, devices, expect, test as base } from "@playwright/test"
import { App, newBrowser } from "./App"

const SEED_DIR = join(import.meta.dirname, "..", ".browser-state", "seed")

/**
 * Custom test fixture that provides a pre-authenticated `app` instance.
 * On Chromium, uses a copy of the seed browser profile (fast).
 * On other browsers, falls back to creating a team from scratch.
 */
export const test = base.extend<{ app: App }>({
  app: async ({ browserName, context }, use) => {
    if (browserName === "chromium" && existsSync(SEED_DIR)) {
      const tempDir = mkdtempSync(join(tmpdir(), "xdev-pw-"))
      cpSync(SEED_DIR, tempDir, { recursive: true })

      const seededContext = await chromium.launchPersistentContext(tempDir, {
        ...devices["Desktop Chrome"],
        permissions: ["clipboard-read", "clipboard-write"],
        baseURL: "http://localhost:3001",
      })

      const page = seededContext.pages()[0] ?? (await seededContext.newPage())
      const app = new App(page)
      app.userName = "herb"
      app.teamName = "DevResults"
      await app.start()
      // Wait for the myweek page to fully render with DXOS data loaded
      await expect(page.getByRole("heading", { name: "Dones" })).toBeVisible({ timeout: 30_000 })
      // Ensure the done entry textarea is available (DXOS reactive layer is initialized)
      await expect(page.locator("textarea.done-entry").first()).toBeVisible({ timeout: 10_000 })

      await use(app)

      await seededContext.close()
      rmSync(tempDir, { recursive: true, force: true })
    } else {
      const app = await newBrowser(context)
      await app.createTeam("herb", "DevResults")
      await use(app)
    }
  },
})

export { expect } from "@playwright/test"
