import {browser, $} from '@wdio/globals';
import { expect } from 'chai';

const checkoutTitle = "//span[@class='title']";
const firstname = "//input[@id='first-name']";
const lastname = "//input[@id='last-name']";
const zipcode = "//input[@id='postal-code']";
const contBtn = "//input[@id='continue']";
const finBtn = "//button[@id='finish']";
const itemPrice = '//div[@class="inventory_item_price"]';
const subLabel = "//div[@class='summary_subtotal_label']";
const taxLabel = "//div[@class='summary_tax_label']";
const totalLabel = "//div[@class='summary_total_label']";

var regex = /[+-]?\d+(\.\d+)?/;

class Checkout {

    //Function to fill user details during checkout
    async fill() {
        const displayed = await $(checkoutTitle).isDisplayed();
        expect(displayed).to.be.true;
        await browser.pause(1000);
        await $(firstname).setValue('test');
        await $(lastname).setValue('user');
        await $(zipcode).setValue(456321);
        await browser.pause(1000);
    }

    //Fucntion to click Continue button
    async clickContinue() {
        await $(contBtn).isClickable();
        await $(contBtn).click();
        await browser.pause(1000);
    }

    //Function to click Finish button
    async clickFinish() {
        if($(finBtn).isDisplayed({withinViewport: true}) == false) {
            await $(finBtn).scrollIntoView();
            await browser.pause(2000);
        }
        await $(finBtn).isClickable();
        await $(finBtn).click();
        await browser.pause(1000);
    }

    //Function to verify the total price (including tax) of all items in the cart
    async verifyTotal() {
        let subtotal = 0;
        for await (const item of $$(itemPrice)) {
            let val = await item.getText();
            var floats1 = val.match(regex).map(function(v) { return parseFloat(v); });
            subtotal = subtotal+floats1[0];
          }
        await $(totalLabel).scrollIntoView();
        const displayed = await $(subLabel).isDisplayed();
        expect(displayed).to.be.true;
        const expectedSubtotal = await $(subLabel).getText();
        expect(expectedSubtotal).to.contain(String(subtotal));
        const tax = await $(taxLabel).getText();
        var floats2 = tax.match(regex).map(function(v) { return parseFloat(v); });
        const total = subtotal+floats2[0];
        const expectedTotal = await $(totalLabel).getText();
        expect(expectedTotal).to.contain(String(total));
        await browser.pause(3000);
    }
}

export default new Checkout();