require('dotenv').config();
const { fixture } = require('../fixtures/fixture');

exports.LoginPage = class Login {

    constructor() {
        // this.page = page;
        // this.testInfo = scenario;
        // this.ru = new ReportUtil(this.page, this.testInfo);
        // this.logger = Logger(scenario);
    }

    async invokeApp() {
        fixture.logger.info(`Invoking URL ${process.env.APP_URL} ...`);
        await fixture.page.goto(process.env.APP_URL);
    }

    async doLogin(user, pwd) {

        fixture.logger.info(`Logging in...`)
        await fixture.page.locator('#user-name').fill(user);
        await fixture.page.locator('#password').fill(pwd);
        await fixture.page.locator('#login-button').click();
        fixture.logger.info(`Taking screenshot...`)
    }
};