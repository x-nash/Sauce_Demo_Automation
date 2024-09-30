import {Given, When, Then} from '@wdio/cucumber-framework';
import Checkout from '../page_objects/checkout.page.js';

When(/^I enter checkout information$/, async() => {
	await Checkout.fill();
});

When(/^I click the continue button$/, async () => {
	await Checkout.clickContinue();
});

When(/^I click the finish button$/, async () => {
	await Checkout.clickFinish();
});

Then(/^I should see the correct total price displayed$/, async () => {
	await Checkout.verifyTotal();
})