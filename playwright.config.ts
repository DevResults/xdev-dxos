import process from "node:process"
import { defineConfig, devices } from "@playwright/test"

const isPlaywrightUI = process.env.PLAYWRIGHT_UI === "1"

/** https://playwright.dev/docs/test-configuration */
export default defineConfig({
  testDir: "./test",
  testMatch: "*.test.ts",

  /* tests fail if they take longer than this */
  timeout: 45_000,

  /* abort if we get several test failures (probably server isn't running or something) */
  maxFailures: 5,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests */
  workers: 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "list",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3001",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        permissions: ["clipboard-read", "clipboard-write"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          firefoxUserPrefs: {
            "dom.events.asyncClipboard.readText": true,
            "dom.events.testing.asyncClipboard": true,
          },
        },
        permissions: [],
      },
    },
    { name: "webkit", use: { ...devices["Desktop Safari"], permissions: [] } },
    {
      name: "edge",
      use: { ...devices["Desktop Edge"], permissions: ["clipboard-read", "clipboard-write"] },
    },
  ],

  webServer:
    isPlaywrightUI ?
      []
    : [
        {
          command: "pnpm react-router dev --port 3001",
          url: "http://localhost:3001",
          reuseExistingServer: false,
        },
      ],
})
