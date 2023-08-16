
require('dotenv').config();
const { Given, When, Then, DataTable } = require('@cucumber/cucumber');
const { expect } =require("@playwright/test");
const { fixture } = require('../fixtures/fixture');
const { LoginPage } = require('../pageobjects/login.page');
const { HomePage } = require('../pageobjects/home.page');
// import { CartPage } from '../pageobjects/cart.page';
// import { CheckoutPage } from '../pageobjects/checkout.page';
// import { ProductPage } from '../pageobjects/product.page';

let loginPage;
let homePage;

Given(`Login to Application`, async () => {
    
    loginPage = new LoginPage();
    loginPage.invokeApp();
    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
});

When(`Sorting the page`, async () => {
    homePage = new HomePage();
    await homePage.sortItems('Price (low to high)');
});

Then(`Products should get sorted`, async () => {
    await homePage.verifyLowest('$7.99');
});