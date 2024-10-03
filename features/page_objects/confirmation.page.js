import { expect } from "chai";
import { browser, $ } from '@wdio/globals';

const confirmUrl = "https://www.saucedemo.com/checkout-complete.html";
const loginUrl = "https://www.saucedemo.com/"
const message = "//h2[@class='complete-header']";
const menu = "//button[@id='react-burger-menu-btn']";
const logoutButton = "//a[@id='logout_sidebar_link']";

class Confirmation {

    //Function to verify confirmation page
    async displayMessage() {
        await browser.url(confirmUrl);
        await browser.pause(1000);
        const expectedString = await $(message).getText();
        expect(expectedString).to.equal("Thank you for your order!");
    }

    //Function to open the menu 
    async openMenu() {
        await $(menu).isClickable();
        await $(menu).click();
        await browser.pause(1000);
    }

    //Function to click on logout option from the menu
    async selectLogout() {
        await $(logoutButton).isClickable();
        await $(logoutButton).click();
        await browser.pause(1000);
    }

    //Function to verify logout
    async verifyLogout() {
        await browser.url(loginUrl);
        await browser.pause(1000);
    }
}

export default new Confirmation();