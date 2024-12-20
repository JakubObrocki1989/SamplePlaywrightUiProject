export class CheckoutModalPage {
    constructor(page) {
        this.page = page
        this.continueOnCartButton = this.page.locator('div[class="modal-footer"] button')
        this.registerLoginLink = this.page.locator('div[class="modal-body"] p a')
    }

    clickRegisterLoginLink = async () => {
        await this.registerLoginLink.waitFor()
        await this.registerLoginLink.click()
    }
}