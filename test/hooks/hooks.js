const { chromium } = require("@playwright/test")
const { After, AfterAll, Before, BeforeAll, AfterStep } = require("@cucumber/cucumber");
const { fixture } = require('../fixtures/fixture');
const { Logger } = require('../utils/Logger');
const { LoginPage } = require('../pageobjects/login.page');
const { HomePage } = require('../pageobjects/home.page');
require('dotenv').config();

let browser;

BeforeAll(async function () {
  browser = await chromium.launch()
})

Before(async function ({ pickle }) {
  this.context = await browser.newContext()
  fixture.page = await this.context.newPage()
  fixture.logger = Logger(pickle.name);

  const loginPage = new LoginPage();
  loginPage.invokeApp();
  await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);

})

AfterStep(async function({pickleStep}){
  const img = await fixture.page.screenshot(`./reports/ss/${pickleStep.text}.png`);
  await this.attach(
    img, "image/png"
  );

});

After(async function ({ result, pickle }) {

  // const img = await fixture.page.screenshot(`./reports/ss/${pickle.name}.png`);
  // await this.attach(
  //   img, "image/png"
  // );

  const homePage = new HomePage();
  await homePage.logout();

  await fixture.page?.close()
  await this.context?.close()
})

AfterAll(async function () {
  await browser.close()
})
