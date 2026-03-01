const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Run tests sequentially to avoid conflicts
  reporter: "html",
  use: {
    trace: "on-first-retry",
    headless: false, // Show browser for extension testing
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome", // Use installed Chrome
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
});
