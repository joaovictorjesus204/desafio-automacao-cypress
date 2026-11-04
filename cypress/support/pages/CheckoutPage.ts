import { readMoney, readPrices, readTexts } from './helpers';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

class CheckoutPage {
  readonly stepOnePath = '/checkout-step-one.html';
  readonly stepTwoPath = '/checkout-step-two.html';
  readonly completePath = '/checkout-complete.html';

  private readonly firstName = '[data-test="firstName"]';
  private readonly lastName = '[data-test="lastName"]';
  private readonly postalCode = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly cancelButton = '[data-test="cancel"]';
  private readonly finishButton = '[data-test="finish"]';
  private readonly errorMessage = '[data-test="error"]';

  private readonly itemName = '.cart_item .inventory_item_name';
  private readonly itemPrice = '.cart_item .inventory_item_price';
  private readonly subtotal = '.summary_subtotal_label';
  private readonly tax = '.summary_tax_label';
  private readonly total = '.summary_total_label';
  private readonly completeHeader = '.complete-header';

  /** Preenche só os campos informados; string vazia deixa o campo em branco de propósito. */
  fillCustomerInfo(info: CustomerInfo) {
    if (info.firstName) cy.get(this.firstName).type(info.firstName);
    if (info.lastName) cy.get(this.lastName).type(info.lastName);
    if (info.postalCode) cy.get(this.postalCode).type(info.postalCode);
    return this;
  }

  continue() {
    cy.get(this.continueButton).click();
    return this;
  }

  cancel() {
    cy.get(this.cancelButton).click();
    return this;
  }

  finish() {
    cy.get(this.finishButton).click();
    return this;
  }

  error() {
    return cy.get(this.errorMessage);
  }

  itemNames() {
    return readTexts(this.itemName);
  }

  itemPrices() {
    return readPrices(this.itemPrice);
  }

  subtotalValue() {
    return readMoney(this.subtotal);
  }

  taxValue() {
    return readMoney(this.tax);
  }

  totalValue() {
    return readMoney(this.total);
  }

  orderShouldBeComplete() {
    cy.location('pathname').should('eq', this.completePath);
    cy.get(this.completeHeader).should('have.text', 'Thank you for your order!');
    return this;
  }
}

export const checkoutPage = new CheckoutPage();
