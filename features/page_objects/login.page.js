import {browser} from '@wdio/globals';
import { expect } from 'chai';

const loginUrl = "https://www.saucedemo.com/"
const button = "//input[@id='login-button']";
const username = "//input[@id='user-name']";
const password = "//input[@id='password']";

class LoginPage {

    //Function to verify login page
    async open () {
        browser.maximizeWindow();
        browser.url(loginUrl);
        browser.pause(2000);
    }

    //Function to fill username and password 
    async login(user, pass) {
        await $(username).setValue(user);
        const userValue = await $(username).getValue()
        expect(userValue).to.equal(user);
        await $(password).setValue(pass);
        const passValue = await $(password).getValue()
        expect(passValue).to.equal(pass);
        await browser.pause(1000);
    }

    //Function to click login button
    async clickbtn() {
        await $(button).isClickable();
        await $(button).click();
        await browser.pause(1000);
    }
}

export default new LoginPage();