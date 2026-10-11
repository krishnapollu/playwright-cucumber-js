# Logbook BDD compatibility check

A small, local Gherkin suite using [playwright-bdd](https://github.com/vitalets/playwright-bdd). It exercises Logbook with a passed scenario, scenario outline, deliberate failure, retry, skip, steps, tags, and attachment. It also checks the summary and debug CLI commands and the offline failure dialog. No test depends on a live site.

This folder lives inside the existing `playwright-cucumber-js` repository. Its original `npm test` uses the Cucumber.js runner; this compatibility check uses Playwright Test through `playwright-bdd` so Playwright reporters receive the events. It expects a sibling `pw-logbook` checkout with built `dist/` files.

```sh
cd logbook-compat
npm run build --prefix ../../pw-logbook
npm ci
npm test
```

`npm test` expects Playwright to exit 1 because one scenario deliberately fails, then verifies the recorded run and generated HTML. It exits 0 only when every assertion passes. The latest report is `.logbook/report/index.html`; `.logbook/` is ignored by Git.

Current BDD presentation limit: Logbook reports Playwright's generated `.features-gen` source path. Scenario outline rows display as `Example #1` and `Example #2`; their Gherkin outline name and concrete values remain in the recorded title path and steps.
