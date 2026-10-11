import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

export default defineConfig({
  testDir: defineBddConfig({ features: 'features/*.feature', steps: 'steps/*.ts' }),
  workers: 1,
  retries: 1,
  reporter: [['list'], ['playwright-logbook', { title: 'BDD compatibility', captureDetails: true }]],
});
