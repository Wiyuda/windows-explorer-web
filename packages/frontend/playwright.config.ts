import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'bun --cwd ../backend run start',
      url: 'http://localhost:3000/api/v1/nodes/tree',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'bun run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    }
  ],
});
