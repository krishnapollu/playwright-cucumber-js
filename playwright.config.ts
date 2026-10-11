import { defineConfig } from '@playwright/test';
import { cucumberReporter, defineBddConfig } from 'playwright-bdd';

export default defineConfig({
  testDir: defineBddConfig({ features: 'test/features/*.feature', steps: 'test/stepdef/*.step.js' }),
  workers: 2,
  retries: 1,
  reporter: [
    ['list'],
    cucumberReporter('html', { outputFile: 'reports/cucumber-report.html' }),
    ['allure-playwright', { resultsDir: 'allure-results' }],
    ['playwright-logbook', { title: 'playwright-cucumber', captureDetails: true }],
  ],
  use: { screenshot: 'only-on-failure', trace: 'on-first-retry' },
});
