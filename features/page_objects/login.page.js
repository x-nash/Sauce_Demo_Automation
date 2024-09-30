import {browser} from '@wdio/globals';

const loginUrl = "https://www.saucedemo.com/"
const button = "//input[@id='login-button']";
const username = "//input[@id='user-name']";
const password = "//input[@id='password']";

class LoginPage {

    open () {
        browser.maximizeWindow();
        browser.url(loginUrl);
        browser.pause(2000);
    }

    async login(user, pass) {
        await $(username).setValue(user);
        await $(password).setValue(pass);
        await browser.pause(1000);
    }

    async clickbtn() {
        await $(button).isClickable();
        await $(button).click();
        await browser.pause(1000);
    }
}

export default new LoginPage();