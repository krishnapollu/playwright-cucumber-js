const { expect } = require("@playwright/test");
const { fixture } = require('../fixtures/fixture');

exports.CheckoutPage = class Checkout {

    constructor() {
    }

    async fillCheckOutInfo(fname, lname, zip){

        await fixture.page.locator('#first-name').fill(fname);
        await fixture.page.locator('#last-name').fill(lname);
        await fixture.page.locator('#postal-code').fill(zip);
        await fixture.page.locator('//input[@value="CONTINUE"]').click();
    }

    async cancelCheckOut(){
        await fixture.page.locator('//a[contains(.,"CANCEL")]').click();
    }
};