const { expect } = require("@playwright/test");
const { fixture } = require('../fixtures/fixture');

exports.HomePage = class Home {

    constructor() {
        // fixture.page = page;
    }

    async selectItem(str) {
        await fixture.page.locator('//div[@class="inventory_item_name" and contains(.,"'+str+'")]').click();
    }

    async sortItems(order){
        await fixture.page.locator('.product_sort_container').selectOption(order);
    }

    async gotoCart(){
        await fixture.page.locator('//div[@id="shopping_cart_container"]/a').click();
    }
    
    async logout(){
       await fixture.page.locator('//button[contains(.,"Open Menu")]').click();
       await fixture.page.locator('#logout_sidebar_link').click();
    }

    async verifyLowest(amount){
        await expect(fixture.page.locator('(//div[@class="inventory_item_price"])[1]')).toHaveText(amount);
    }
} 