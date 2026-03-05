import { existsSync, rmSync } from "node:fs"
import { join } from "node:path"
import { chromium, devices, test as setup } from "@playwright/test"
import { App } from "./helpers/App"

const SEED_DIR = join(import.meta.dirname, ".browser-state", "seed")

/** Creates a pre-authenticated browser profile so tests can skip onboarding. */
setup("create authenticated browser state", async () => {
  if (existsSync(SEED_DIR)) {
    rmSync(SEED_DIR, { recursive: true })
  }

  const context = await chromium.launchPersistentContext(SEED_DIR, {
    ...devices["Desktop Chrome"],
    permissions: ["clipboard-read", "clipboard-write"],
    baseURL: "http://localhost:3001",
  })

  const page = context.pages()[0] ?? (await context.newPage())
  const app = new App(page)
  await app.start()
  await app.createTeam("herb", "DevResults")

  await context.close()
})
