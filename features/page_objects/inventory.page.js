import {browser, $} from '@wdio/globals';

const url = "https://www.saucedemo.com/inventory.html";
const add1 = '/html[1]/body[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/div[2]/button[1]';
const badge = '//span[@class="shopping_cart_badge"]';
const title = "//span[@class='title']";
const dropdown = "//select[@class='product_sort_container']";
const itemName = "//div[@data-test='inventory-item-name']"; 
const itemPrice = "//div[@class='inventory_item_price']";

var flag, beforeFilterNames, afterFilterNames, beforeFilterPrice, afterFilterPrice, before, after;
var regex = /[+-]?\d+(\.\d+)?/;

class Inventory {

    //Function to verify landing page
    async isOpen() {
        await browser.url(url);
        await expect($(title)).toBeDisplayed();
        //await browser.pause(1000);
    }

    //Function to add an item to the cart
    async addToCart() {
        await $(add1).isClickable();
        await $(add1).click();
        await $(badge).waitForExist();
        await expect($(add1)).toHaveText('Remove');
        await browser.pause(1000);
    }

    //Function to add multiple items to the cart
    async addMultiple() {
        for(let i=1; i<=3; i++) {
            let elem = '/html[1]/body[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[' + i + ']/div[2]/div[2]/button[1]';
            if($(elem).isDisplayed({withinViewport: true}) == false){
                await $(elem).scrollIntoView();
                await browser.pause(1000);
            }
            await $(elem).isClickable();
            await $(elem).click();
            await expect($(elem)).toHaveText('Remove');
            await browser.pause(1000);
        }
    }

    //Function to select Name (A to Z) from the select box
    async alpha() {
        beforeFilterNames = [], before = [];
        beforeFilterNames = await $$(itemName).getElements();
        for(const x of beforeFilterNames) {
            var y = await x.getText();
            before.push(y);
        }
        before.sort();
        await $(dropdown).selectByAttribute('value', 'az');
        await browser.pause(1000);
    }

    //Function to select Name (Z to A) from the select box
    async reverseAlpha() {
        beforeFilterNames = [], before = [];
        beforeFilterNames = await $$(itemName).getElements();
        for(const x of beforeFilterNames) {
            var y = await x.getText();
            before.push(y);
        }
        before.sort();
        before.reverse();
        await $(dropdown).selectByAttribute('value', 'za');
        await browser.pause(1000);
    }

    //Function to select Price (low to high) from the select box
    async lowToHigh() {
        beforeFilterPrice = [], before = [];
        beforeFilterPrice = await $$(itemPrice).getElements();
        for(const x of beforeFilterPrice) {
            var y = await x.getText();
            var item = y.match(regex).map(function(v) { return parseFloat(v); });
            before.push(item[0]);
        }
        before.sort((a,b) => {
            return a-b;
        });
        await $(dropdown).waitForDisplayed();
        await $(dropdown).selectByAttribute('value', 'lohi');
        await browser.pause(1000);
    }

    //Function to select Price (high to low) from the select box
    async highToLow() {
        beforeFilterPrice = [], before = [];
        beforeFilterPrice = await $$(itemPrice).getElements();
        for(const x of beforeFilterPrice) {
            var y = await x.getText();
            var item = y.match(regex).map(function(v) { return parseFloat(v); });
            before.push(item[0]);
        }
        before.sort((a,b) => {
            return b-a;
        });
        await $(dropdown).waitForDisplayed();
        await $(dropdown).selectByAttribute('value', 'hilo');
        await browser.pause(1000);
    }

    //Function to verify sorting functionality according to selected option
    async verifySort(val) {
        if(val == 'za' || val == 'az') {
            afterFilterNames = [], after = [];
            afterFilterNames = await $$(itemName).getElements();
            for(const x of afterFilterNames) {
                var y = await x.getText();
                after.push(y);
            }
            if (JSON.stringify(before) == JSON.stringify(after)) {
                flag = true;
            }
            expect(flag).toBe(true);
            await browser.pause(1000);
        }

        else if(val == 'lohi' || val == 'hilo') {
            afterFilterPrice = [], after = [];
            flag = true;
            afterFilterPrice = await $$(itemPrice).getElements();
            for(const x of afterFilterPrice) {
                var y = await x.getText();
                var item = y.match(regex).map(function(v) { return parseFloat(v); });
                after.push(item[0]);
            }
            for(var i=0, j=0; i<before.length; i++, j++) {
                if(before[i] !== after[j]) {
                    flag = false;
                    break;
                }
            }
            expect(flag).toBe(true);
            await browser.pause(1000);
        }
    }
}

export default new Inventory();