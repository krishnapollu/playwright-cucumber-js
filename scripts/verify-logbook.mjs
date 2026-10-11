import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const runId = `bdd-${randomUUID()}`;
const result = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '--grep', '@logbook-check'], {
  env: { ...process.env, LOGBOOK_RUN_ID: runId },
  stdio: 'inherit',
});
assert.equal(result.status, 1, 'the deliberate failure should keep Playwright exit code 1');

const run = JSON.parse(await readFile(`.logbook/runs/${runId}.json`, 'utf8'));
assert.deepEqual(run.summary, { total: 6, passed: 3, failed: 1, flaky: 1, skipped: 1 });
assert.equal(run.complete, true);
assert.equal(run.tests.length, 6);
assert.ok(run.tests.every((item) => item.tags.includes('@logbook-check')));

const passed = run.tests.find((item) => item.title === 'Passed scenario with an attachment');
assert.equal(passed.outcome, 'expected');
assert.equal(passed.status, 'passed');
assert.ok(passed.attempts[0].steps.some((step) => step.title.includes('I save the item')));
assert.ok(passed.attempts[0].attachments.some((attachment) => attachment.name === 'confirmation'));
assert.equal(run.tests.filter((item) => item.titlePath.includes('Scenario outline examples retain their names')).length, 2);

const failed = run.tests.find((item) => item.title === 'A failed assertion retains its error');
assert.equal(failed.outcome, 'unexpected');
assert.match(failed.firstError.message, /This assertion must fail/);
const flaky = run.tests.find((item) => item.title === 'A retry becomes flaky');
assert.equal(flaky.outcome, 'flaky');
assert.deepEqual(flaky.attempts.map((attempt) => attempt.retry), [0, 1]);
const skipped = run.tests.find((item) => item.title === 'A skipped case stays skipped');
assert.equal(skipped.outcome, 'skipped');

const cli = 'node_modules/playwright-logbook/dist/cli/bin.js';
const summary = spawnSync(process.execPath, [cli, 'summary', '--run', runId, '--format', 'json'], { encoding: 'utf8' });
assert.equal(summary.status, 0, summary.stderr);
assert.deepEqual(JSON.parse(summary.stdout).summary, run.summary);
const debug = spawnSync(process.execPath, [cli, 'debug', '--run', runId, '--test', failed.testId, '--format', 'json'], { encoding: 'utf8' });
assert.equal(debug.status, 0, debug.stderr);
assert.equal(JSON.parse(debug.stdout).testId, failed.testId);

const html = await readFile('.logbook/report/index.html', 'utf8');
assert.match(html, /playwright-cucumber/);
assert.match(html, /A failed assertion retains its error/);
assert.ok(!html.includes(resolve('.')));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const networkRequests = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('file:')) networkRequests.push(request.url());
  });
  await page.goto(`file://${resolve('.logbook/report/index.html')}`);
  await page.getByText('A failed assertion retains its error').last().click();
  assert.match(page.url(), /#test=/);
  assert.match(await page.locator('body').innerText(), /2 attempts/);
  await page.getByRole('tab', { name: /Steps/ }).click();
  assert.match(await page.locator('body').innerText(), /Given a local page with a Save button/);
  await page.getByRole('tab', { name: /Attachments/ }).click();
  assert.match(await page.locator('body').innerText(), /error-context/);
  assert.deepEqual(networkRequests, []);
} finally {
  await browser.close();
}
console.log(`Verified BDD run ${runId}: 3 passed, 1 failed, 1 flaky, 1 skipped; report generated.`);
