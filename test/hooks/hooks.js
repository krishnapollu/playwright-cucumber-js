const { chromium } = require("@playwright/test")
const { After, AfterAll, Before, BeforeAll } = require("@cucumber/cucumber");
const {fixture} = require('../fixtures/fixture');
const { Logger } = require('../utils/Logger');

let browser;

BeforeAll(async function() {
  browser = await chromium.launch({ headless: false })
})

Before(async function({pickle}) {
  this.context = await browser.newContext()
  fixture.page = await this.context.newPage()
  fixture.logger = Logger(pickle.name);
})

After(async function( {result, pickle}) {
  
  const img = await fixture.page.screenshot(`reports/ss/${pickle.name}.png`);
  await this.attach(
    img, "image/png"
);
  await fixture.page?.close()
  await this.context?.close()
})

AfterAll(async function() {
  await browser.close()
})
