
require('dotenv').config();
const { Given, When, Then, DataTable } = require('@cucumber/cucumber');
const { expect } = require("@playwright/test");
const { fixture } = require('../fixtures/fixture');
const { LoginPage } = require('../pageobjects/login.page');
const { HomePage } = require('../pageobjects/home.page');
const { CartPage } = require('../pageobjects/cart.page');
const { CheckoutPage } = require('../pageobjects/checkout.page');
const { ProductPage } = require('../pageobjects/product.page');

let loginPage;
let homePage;
let productPage;
let cartPage;
let checkoutPage;

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