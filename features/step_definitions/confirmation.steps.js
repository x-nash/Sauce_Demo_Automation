import {Given, When, Then} from '@wdio/cucumber-framework';
import Confirmation from '../page_objects/confirmation.page.js';

Then(/^I should see a confirmation message$/, async () => {
	await Confirmation.displayMessage();
	await browser.pause(1000);
});

When(/^I click the menu button$/, async () => {
	await Confirmation.openMenu();
});

When(/^click the logout button$/, async () => {
	await Confirmation.selectLogout();
});

Then(/^I should be logged out and see the login page$/, async () => {
	await Confirmation.verifyLogout();
});
