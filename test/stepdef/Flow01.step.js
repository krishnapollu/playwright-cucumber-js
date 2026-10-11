
require('dotenv').config();
const { test } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { fixture } = require('../fixtures/fixture');
const { LoginPage } = require('../pageobjects/login.page');
const { HomePage } = require('../pageobjects/home.page');
const { CartPage } = require('../pageobjects/cart.page');
const { CheckoutPage } = require('../pageobjects/checkout.page');
const { ProductPage } = require('../pageobjects/product.page');
const { Logger } = require('../utils/Logger');
const { Before, AfterStep, Given, When, Then } = createBdd();

let loginPage;
let homePage;
let productPage;
let cartPage;
let checkoutPage;

Before({ tags: '@saucedemo' }, async ({ page }) => {
    fixture.page = page;
    fixture.logger = Logger(test.info().title);
    const loginPage = new LoginPage();
    await loginPage.invokeApp();
    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
});

AfterStep({ tags: '@saucedemo' }, async ({ page }) => {
    await test.info().attach('step screenshot', { body: await page.screenshot(), contentType: 'image/png' });
});

When(`Sorting the page`, async () => {
    homePage = new HomePage();
    await homePage.sortItems('Price (low to high)');
});

Then(`Products should get sorted`, async () => {
    await homePage.verifyLowest('$7.99');
});

Given(`Product selected`, async () => {
    homePage = new HomePage();
    await homePage.selectItem('Sauce Labs Bolt T-Shirt');
});

When(`Added to cart`, async () => {
    productPage = new ProductPage();
    await productPage.addToCart();
});

Then(`Product should be visible in Cart page`, async () => {
    cartPage = new CartPage();
    await productPage.goBack();
    await homePage.gotoCart();
    await cartPage.verifyItemPresent('Sauce Labs Bolt T-Shirt');
});

Then(`User should be able to remove the product from Cart`, async () => {
    await cartPage.removeFromCart('Sauce Labs Bolt T-Shirt');
});

Then(`User should be able to cancel Checkout`, async () => {

    checkoutPage = new CheckoutPage();
    await cartPage.checkOut();
    await checkoutPage.cancelCheckOut();
    await cartPage.removeFromCart('Sauce Labs Bolt T-Shirt');
});

Then(`User should be able to Checkout`, async () => {

    checkoutPage = new CheckoutPage();
    await cartPage.checkOut();
        await checkoutPage.fillCheckOutInfo('firstname', 'lastname', '12345');
        await cartPage.verifyPaymentInfo();
        await cartPage.clickFinish();
});
