import{Given, When, Then} from '@wdio/cucumber-framework';
import Inventory from '../page_objects/inventory.page.js';

Then(/^I should see the inventory page$/, async () => {
	await Inventory.isOpen();
});

When(/^I add an item to the cart$/, async () => {
	await Inventory.addToCart();
});

When(/^I add multiple items to the cart$/, async () => {
	await Inventory.addMultiple();
})

When(/^I click on Name - Z to A from the dropdown$/, async () => {
	await Inventory.reverseAlpha();
});

Then(/^I should see the products in reverse alphabetical order of names$/, async () => {
	await Inventory.verifySort('za');
});

When(/^I click on Name - A to Z from the dropdown$/, async () => {
	await Inventory.alpha();
});

Then(/^I should see the products in alphabetical order of names$/, async () => {
	await Inventory.verifySort('az');
});

When(/^I click on Price - low to high from the dropdown$/, async () => {
	await Inventory.lowToHigh();
});

Then(/^I should see the products in lower to higher order of price$/, async() => {
	await Inventory.verifySort('lohi');
});

When(/^I click on Price - high to low from the dropdown$/, async () => {
	await Inventory.highToLow();
});

Then(/^I should see the products in higher to lower order of price$/, async () => {
	await Inventory.verifySort('hilo');
});