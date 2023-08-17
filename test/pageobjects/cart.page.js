const { expect } = require("@playwright/test");
const { fixture } = require('../fixtures/fixture');

exports.CartPage = class Cart {

    constructor() {
    }

    async removeFromCart(str){
        await fixture.page.locator('//div[contains(.,"'+str+'")]/../following-sibling::div[@class="item_pricebar"]/button').click();
    }
    
    async verifyItemPresent(str){
        await expect(fixture.page.locator('//div[@class="cart_item_label" and contains(.,"'+str+'")]')).toBeVisible();
    }

    async continueShopping(){
        await fixture.page.locator('//a[contains(.,"Continue Shopping")').click();
    }

    async checkOut(){
        await fixture.page.locator('//a[contains(.,"CHECKOUT")]').click();
    }

    async verifyPaymentInfo(){
        await expect(fixture.page.locator('.summary_info')).toBeVisible();
    }

    async clickFinish(){
        await fixture.page.locator('//a[contains(.,"FINISH")]').click();
        await expect(fixture.page.locator('#checkout_complete_container')).toBeVisible();
    }

    async gotoAllItems(){
        
            await fixture.page.locator('//button[contains(.,"Open Menu")]').click();
            await fixture.page.locator('#inventory_sidebar_link').click();
         
    }
};