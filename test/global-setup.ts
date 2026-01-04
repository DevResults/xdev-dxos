import { chromium, type FullConfig } from "@playwright/test"

/**
 * Warms up Vite's dependency optimizer by loading the app in a browser.
 * This triggers dynamic imports and ensures all chunks are generated
 * before actual tests run.
 */
export default async function globalSetup(config: FullConfig) {
  // Skip warmup in CI (uses pre-built app) or Playwright UI mode
  if (process.env.CI || process.env.PLAYWRIGHT_UI === "1") {
    return
  }

  console.log("Warming up Vite dependency cache...")

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Navigate to the app and wait for it to fully load
    // This triggers Vite's on-demand dependency optimization
    await page.goto("http://localhost:3001", { waitUntil: "networkidle" })

    // Wait a bit for any async initialization
    await page.waitForTimeout(2000)

    // Reload to ensure everything is cached
    await page.reload({ waitUntil: "networkidle" })
    await page.waitForTimeout(1000)
  } catch (error) {
    console.log("Warmup encountered an error (this may be normal on first run):", error)
    // Try once more after a delay
    await page.waitForTimeout(3000)
    try {
      await page.goto("http://localhost:3001", { waitUntil: "networkidle" })
      await page.waitForTimeout(2000)
    } catch {
      // Ignore - the actual tests will report any real issues
    }
  } finally {
    await browser.close()
  }

  console.log("Warmup complete")
}
