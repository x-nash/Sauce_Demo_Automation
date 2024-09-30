import{Given, When, Then} from '@wdio/cucumber-framework';
import Cart from '../page_objects/cart.page.js';

When(/^I navigate to the cart$/, async () => {
	await Cart.open();
});

Then(/^I should see the added item in the cart$/, async () => {
	await Cart.itemDisplayed();
});

Then(/^I should see the items in the cart$/, async () => {
	await Cart.itemsDisplayed();
});

When(/^I proceed to checkout$/, async () => {
	await Cart.clickBtn();
});

When(/^I remove the item from the cart$/, async () => {
    await Cart.removeItem();
})

Then(/^the cart should not have the removed item$/, async () => {
	await Cart.verifyRemove();
});


