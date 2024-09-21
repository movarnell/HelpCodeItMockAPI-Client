import { devices } from '@playwright/test';
import path from 'path';
import globalSetup from './global-setup.js';

const config = {
  // Specify the directory where the tests are located
  testDir: './tests',

  // Set global timeout for all tests
  timeout: 30000,

  // Configure the browser to be used
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: 'storageState.json',
  },
  // Setup project with login credentials
  project: {
    name: 'helpmockit',
    testMatch: '**/*.spec.js',
    retries: 2,
    reporter: [
      ['list'],
      ['json', { outputFile: 'test-results.json' }],
      ['html', { open: 'never' }],
    ],
    login: {
      username: 'admin',
      password: 'Mov@72758',
    },
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Configure reporter
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
    ['html', { open: 'never' }],
  ],

  // Configure retries for flaky tests
  retries: 2,

  // Update testMatch to include only JavaScript files
  testMatch: '**/*.spec.js',

  // Add webServer configuration if you're running a local dev server
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },

  globalSetup: './global-setup.js', // Ensure this is a string path to your setup file
};

export default config;