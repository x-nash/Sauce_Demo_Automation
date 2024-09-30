const confirmUrl = "https://www.saucedemo.com/checkout-complete.html";
const loginUrl = "https://www.saucedemo.com/"
const message = "//h2[@class='complete-header']";
const menu = "//button[@id='react-burger-menu-btn']";
const logoutButton = "//a[@id='logout_sidebar_link']";

class Confirmation {

    async displayMessage() {
        await browser.url(confirmUrl);
        await browser.pause(1000);
        await expect($(message)).toHaveText("Thank you for your order!");
    }

    async openMenu() {
        await $(menu).isClickable();
        await $(menu).click();
        await browser.pause(1000);
    }

    async selectLogout() {
        await $(logoutButton).isClickable();
        await $(logoutButton).click();
        await browser.pause(1000);
    }

    async verifyLogout() {
        await browser.url(loginUrl);
        await browser.pause(1000);
    }
}

export default new Confirmation();