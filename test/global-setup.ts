import { chromium } from "@playwright/test"

/**
 * Warms up Vite's dependency optimizer by loading the app in a browser.
 * This triggers dynamic imports and ensures all chunks are generated
 * before actual tests run.
 */
export default async function globalSetup() {
  // Skip warmup in CI (uses pre-built app) or Playwright UI mode
  if (process.env.CI ?? process.env.PLAYWRIGHT_UI === "1") return

  console.log("Warming up Vite dependency optimizer...")

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Navigate to the app and wait for it to fully load. This triggers Vite's on-demand dependency optimization
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" })

  // Reload to ensure everything is cached
  await page.reload({ waitUntil: "networkidle" })

  await browser.close()

  console.log("Warmup complete")
}
