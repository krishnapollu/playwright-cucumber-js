const { expect } = require("@playwright/test");
const { fixture } = require('../fixtures/fixture');

exports.ProductPage = class Product {

    constructor() {
    }

    async addToCart(){
        await fixture.page.locator('//button[contains(.,"ADD TO CART")]').click();
    }

    async goBack(){
        await fixture.page.locator('//button[@class="inventory_details_back_button"]').click();
    }
};
    