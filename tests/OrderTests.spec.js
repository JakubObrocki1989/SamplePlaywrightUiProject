import { RegisterUserFactory} from '../src/factories/RegisterUserFactory.js';
import { CreditCardDetailsFactory } from '../src/factories/CreditCardDetailsFactory.js'
import { CheckoutCustomerAddress } from '../src/models/CheckoutCustomerAddress.js'

const { test, expect } = require('./BaseTests.js');

test('Place order and register while chekout', async ({ page, homePage, productsPage, cartPage, checkoutModalPage, checkoutPage, 
    loginSignUpPage, signupPage, accountCreatedPage, paymentPage, paymentDonePage, accountDeletedPage }) => {
    const registerUserFactory = new RegisterUserFactory()
    const user = registerUserFactory.getRegularRegisterUser()
    const creditCardDetailsFactory = new CreditCardDetailsFactory()
    const creditCardDetail = creditCardDetailsFactory.getRandomCreditCardDetails()
    let address = new CheckoutCustomerAddress() 
    await page.goto('/')
    expect(await homePage.isMenuOptionVisible("Products")).toBe(true)
    await homePage.clickMenuOption("Products")
    await productsPage.addProduct(2)
    await productsPage.addProduct(4)
    await homePage.clickMenuOption("Cart")   
    expect(await cartPage.getCartProductListSize()).toBe(2)
    await cartPage.proceedToCheckOut()
    await checkoutModalPage.clickRegisterLoginLink()
    await loginSignUpPage.fillSignup(user.getUsername(), user.getEmail())
    await loginSignUpPage.clickSignup()
    expect(await signupPage.isHeaderVisible()).toBe(true)
    expect(await signupPage.getHeaderText()).toBe("ENTER ACCOUNT INFORMATION")
    await signupPage.fillSignupDetails(user)
    expect(await accountCreatedPage.isHeaderVisible()).toBe(true)
    expect(await accountCreatedPage.getHeaderText()).toBe("ACCOUNT CREATED!")
    await accountCreatedPage.clickContinueButton()
    expect(await homePage.isMenuOptionVisible("Logged in as " + user.getUsername())).toBe(true)
    await homePage.clickMenuOption("Cart")
    expect(await cartPage.getCartProductListSize()).toBe(2)
    await cartPage.proceedToCheckOut()
    await checkoutPage.typeDescription()    
    address = await checkoutPage.getDeliveryAddress()
    expect.soft(address.getGenderFirstLastName()).toBe(user.getGender() + "." + " " + user.getFirstName() + " " + user.getLastName())
    expect.soft(address.getCompany()).toBe(user.getCompany())
    expect.soft(address.getAddress()).toBe(user.getAddress())
    expect.soft(address.getAddress2()).toBe(user.getAddress2())
    expect.soft(address.getCityStatePostalCode()).toBe(user.getCity() + " " + user.getState() + " " + user.getZipCode())
    expect.soft(address.getCountry()).toBe(user.getCountry())
    expect.soft(address.getMobile()).toBe(user.getMobile())
    await checkoutPage.placeOrder()
    await paymentPage.fillCardDetails(creditCardDetail)
    await paymentPage.placeOrder()
    expect(await paymentDonePage.getOrderPlacedText()).toBe("Congratulations! Your order has been confirmed!")
    await homePage.clickMenuOption("Delete Account")
    expect(await accountDeletedPage.isHeaderVisible()).toBe(true)
    expect(await accountDeletedPage.getHeaderText()).toBe("ACCOUNT DELETED!")
    await accountDeletedPage.clickContinueButton()
});


test('Register and checkout', async ({ page, homePage, productsPage, cartPage, checkoutPage, loginSignUpPage, signupPage, accountCreatedPage, paymentPage, paymentDonePage, accountDeletedPage }) => {
    const registerUserFactory = new RegisterUserFactory()
    const user = registerUserFactory.getRegularRegisterUser()
    const creditCardDetailsFactory = new CreditCardDetailsFactory()
    const creditCardDetail = creditCardDetailsFactory.getRandomCreditCardDetails()
    let address = new CheckoutCustomerAddress() 
    await page.goto('/')
    expect(await homePage.isMenuOptionVisible("Signup / Login")).toBe(true)
    await homePage.clickMenuOption("Signup / Login")
    expect(await loginSignUpPage.isHeaderVisible()).toBe(true)
    await loginSignUpPage.fillSignup(user.getUsername(), user.getEmail())
    await loginSignUpPage.clickSignup()
    expect(await signupPage.isHeaderVisible()).toBe(true)
    expect(await signupPage.getHeaderText()).toBe("ENTER ACCOUNT INFORMATION")
    await signupPage.fillSignupDetails(user)
    expect(await accountCreatedPage.isHeaderVisible()).toBe(true)
    expect(await accountCreatedPage.getHeaderText()).toBe("ACCOUNT CREATED!")
    await accountCreatedPage.clickContinueButton()
    expect(await homePage.isMenuOptionVisible("Logged in as " + user.getUsername())).toBe(true)
    await productsPage.addProduct(2)
    await productsPage.addProduct(4)
    await homePage.clickMenuOption("Cart")   
    expect(await cartPage.getCartProductListSize()).toBe(2)
    await cartPage.proceedToCheckOut()
    await checkoutPage.typeDescription()    
    address = await checkoutPage.getDeliveryAddress()
    expect.soft(address.getGenderFirstLastName()).toBe(user.getGender() + "." + " " + user.getFirstName() + " " + user.getLastName())
    expect.soft(address.getCompany()).toBe(user.getCompany())
    expect.soft(address.getAddress()).toBe(user.getAddress())
    expect.soft(address.getAddress2()).toBe(user.getAddress2())
    expect.soft(address.getCityStatePostalCode()).toBe(user.getCity() + " " + user.getState() + " " + user.getZipCode())
    expect.soft(address.getCountry()).toBe(user.getCountry())
    expect.soft(address.getMobile()).toBe(user.getMobile())
    await checkoutPage.placeOrder()
    await paymentPage.fillCardDetails(creditCardDetail)
    await paymentPage.placeOrder()
    expect(await paymentDonePage.getOrderPlacedText()).toBe("Congratulations! Your order has been confirmed!")
    await homePage.clickMenuOption("Delete Account")
    expect(await accountDeletedPage.isHeaderVisible()).toBe(true)
    expect(await accountDeletedPage.getHeaderText()).toBe("ACCOUNT DELETED!")
    await accountDeletedPage.clickContinueButton()
});

test('Remove products from cart', async ({ page, homePage, productsPage, cartPage }) => {
    await page.goto('/')
    expect(await homePage.isMenuOptionVisible("Products")).toBe(true)
    await homePage.clickMenuOption("Products")
    await productsPage.addProduct(2)
    await productsPage.addProduct(4)
    await homePage.clickMenuOption("Cart")   
    expect(await cartPage.getCartProductListSize()).toBe(2)
    await cartPage.deleteProduct()
    expect(await cartPage.getCartProductListSize()).toBe(1)
    await cartPage.deleteProduct()
    expect(await cartPage.getCartProductListSize()).toBe(0)
});

test('Check billing address', async ({ page, homePage, productsPage, cartPage, checkoutPage, loginSignUpPage, signupPage, accountCreatedPage, paymentPage, paymentDonePage, accountDeletedPage }) => {
    const registerUserFactory = new RegisterUserFactory()
    const user = registerUserFactory.getRegularRegisterUser()
    const creditCardDetailsFactory = new CreditCardDetailsFactory()
    const creditCardDetail = creditCardDetailsFactory.getRandomCreditCardDetails()
    let deliveryAddress = new CheckoutCustomerAddress()
    let billingAddress = new CheckoutCustomerAddress() 
    await page.goto('/')
    expect(await homePage.isMenuOptionVisible("Signup / Login")).toBe(true)
    await homePage.clickMenuOption("Signup / Login")
    expect(await loginSignUpPage.isHeaderVisible()).toBe(true)
    await loginSignUpPage.fillSignup(user.getUsername(), user.getEmail())
    await loginSignUpPage.clickSignup()
    expect(await signupPage.isHeaderVisible()).toBe(true)
    expect(await signupPage.getHeaderText()).toBe("ENTER ACCOUNT INFORMATION")
    await signupPage.fillSignupDetails(user)
    expect(await accountCreatedPage.isHeaderVisible()).toBe(true)
    expect(await accountCreatedPage.getHeaderText()).toBe("ACCOUNT CREATED!")
    await accountCreatedPage.clickContinueButton()
    expect(await homePage.isMenuOptionVisible("Logged in as " + user.getUsername())).toBe(true)
    await productsPage.addProduct(2)
    await productsPage.addProduct(4)
    await homePage.clickMenuOption("Cart")   
    expect(await cartPage.getCartProductListSize()).toBe(2)
    await cartPage.proceedToCheckOut()
    await checkoutPage.typeDescription()    
    deliveryAddress = await checkoutPage.getDeliveryAddress()
    billingAddress = await checkoutPage.getBillingAddress()
    expect.soft(deliveryAddress.getGenderFirstLastName()).toBe(user.getGender() + "." + " " + user.getFirstName() + " " + user.getLastName())
    expect.soft(deliveryAddress.getCompany()).toBe(user.getCompany())
    expect.soft(deliveryAddress.getAddress()).toBe(user.getAddress())
    expect.soft(deliveryAddress.getAddress2()).toBe(user.getAddress2())
    expect.soft(deliveryAddress.getCityStatePostalCode()).toBe(user.getCity() + " " + user.getState() + " " + user.getZipCode())
    expect.soft(deliveryAddress.getCountry()).toBe(user.getCountry())
    expect.soft(deliveryAddress.getMobile()).toBe(user.getMobile())
    expect.soft(billingAddress.getGenderFirstLastName()).toBe(user.getGender() + "." + " " + user.getFirstName() + " " + user.getLastName())
    expect.soft(billingAddress.getCompany()).toBe(user.getCompany())
    expect.soft(billingAddress.getAddress()).toBe(user.getAddress())
    expect.soft(billingAddress.getAddress2()).toBe(user.getAddress2())
    expect.soft(billingAddress.getCityStatePostalCode()).toBe(user.getCity() + " " + user.getState() + " " + user.getZipCode())
    expect.soft(billingAddress.getCountry()).toBe(user.getCountry())
    expect.soft(billingAddress.getMobile()).toBe(user.getMobile())
    await checkoutPage.placeOrder()
    await paymentPage.fillCardDetails(creditCardDetail)
    await paymentPage.placeOrder()
    expect(await paymentDonePage.getOrderPlacedText()).toBe("Congratulations! Your order has been confirmed!")
    await homePage.clickMenuOption("Delete Account")
    expect(await accountDeletedPage.isHeaderVisible()).toBe(true)
    expect(await accountDeletedPage.getHeaderText()).toBe("ACCOUNT DELETED!")
    await accountDeletedPage.clickContinueButton()
});

test('Invoice should be downloaded', async ({ page, homePage, productsPage, cartPage, checkoutPage, loginSignUpPage, signupPage, accountCreatedPage, accountDeletedPage, paymentPage, paymentDonePage }) => {
    const registerUserFactory = new RegisterUserFactory()
    const user = registerUserFactory.getRegularRegisterUser()
    const creditCardDetailsFactory = new CreditCardDetailsFactory()
    const creditCardDetail = creditCardDetailsFactory.getRandomCreditCardDetails()
    let address = new CheckoutCustomerAddress() 
    await page.goto('/')
    expect(await homePage.isMenuOptionVisible("Signup / Login")).toBe(true)
    await homePage.clickMenuOption("Signup / Login")
    expect(await loginSignUpPage.isHeaderVisible()).toBe(true)
    await loginSignUpPage.fillSignup(user.getUsername(), user.getEmail())
    await loginSignUpPage.clickSignup()
    expect(await signupPage.isHeaderVisible()).toBe(true)
    expect(await signupPage.getHeaderText()).toBe("ENTER ACCOUNT INFORMATION")
    await signupPage.fillSignupDetails(user)
    expect(await accountCreatedPage.isHeaderVisible()).toBe(true)
    expect(await accountCreatedPage.getHeaderText()).toBe("ACCOUNT CREATED!")
    await accountCreatedPage.clickContinueButton()
    expect(await homePage.isMenuOptionVisible("Logged in as " + user.getUsername())).toBe(true)
    await productsPage.addProduct(2)
    await productsPage.addProduct(4)
    await homePage.clickMenuOption("Cart")   
    expect(await cartPage.getCartProductListSize()).toBe(2)
    await cartPage.proceedToCheckOut()
    await checkoutPage.typeDescription()    
    address = await checkoutPage.getDeliveryAddress()
    expect.soft(address.getGenderFirstLastName()).toBe(user.getGender() + "." + " " + user.getFirstName() + " " + user.getLastName())
    expect.soft(address.getCompany()).toBe(user.getCompany())
    expect.soft(address.getAddress()).toBe(user.getAddress())
    expect.soft(address.getAddress2()).toBe(user.getAddress2())
    expect.soft(address.getCityStatePostalCode()).toBe(user.getCity() + " " + user.getState() + " " + user.getZipCode())
    expect.soft(address.getCountry()).toBe(user.getCountry())
    expect.soft(address.getMobile()).toBe(user.getMobile())
    await checkoutPage.placeOrder()
    await paymentPage.fillCardDetails(creditCardDetail)
    await paymentPage.placeOrder()
    await paymentPage.downloadInvoice()
    expect(await paymentDonePage.getOrderPlacedText()).toBe("Congratulations! Your order has been confirmed!")
    await homePage.clickMenuOption("Delete Account")
    expect(await accountDeletedPage.isHeaderVisible()).toBe(true)
    expect(await accountDeletedPage.getHeaderText()).toBe("ACCOUNT DELETED!")
    await accountDeletedPage.clickContinueButton()
});