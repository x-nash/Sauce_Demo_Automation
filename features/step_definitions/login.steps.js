import{Given, When, Then} from '@wdio/cucumber-framework';
import LoginPage from '../page_objects/login.page.js';

Given(/^I am on the Sauce Demo login page$/, () => {
	LoginPage.open();
});

When(/^I enter (\w+) and (.*)$/, async (user, pass) => {
	await LoginPage.login(user, pass);
});

When(/^I click the login button$/, async() => {
	await LoginPage.clickbtn();
});
