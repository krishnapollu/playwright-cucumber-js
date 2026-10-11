# Playwright Cucumber suite

The existing Sauce Demo features run through Playwright Test and `playwright-bdd`, so the Cucumber HTML report and Playwright Logbook report are generated from the same scenarios. Set `APP_URL`, `USER_ID`, and `USER_PWD` in `.env` before running the live suite.

```sh
npm install
npx playwright install chromium
npm test
```

Open `reports/cucumber-report.html` or `.logbook/report/index.html` after the run. The suite also writes `allure-results/`. `npm run test:logbook` runs a local, deterministic Gherkin check of Logbook's passed, failed, flaky, and skipped outcomes, attempts, steps, attachments, summary/debug CLI, and offline report. It expects one deliberate Playwright failure but exits 0 when the Logbook checks pass.

Logbook records Playwright's generated `.features-gen` source path for these scenarios. Scenario outline rows display as `Example #1` and `Example #2`; the outline name and values remain in recorded title paths and steps.
