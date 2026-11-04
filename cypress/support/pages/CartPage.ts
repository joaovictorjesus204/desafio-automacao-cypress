import { readTexts } from './helpers';

class CartPage {
  readonly path = '/cart.html';
  private readonly item = '.cart_item';
  private readonly itemName = '.cart_item .inventory_item_name';
  private readonly checkoutButton = '[data-test="checkout"]';
  private readonly continueShoppingButton = '[data-test="continue-shopping"]';

  isDisplayed() {
    cy.location('pathname').should('eq', this.path);
    return this;
  }

  itemsShouldHaveLength(count: number) {
    cy.get(this.item).should('have.length', count);
    return this;
  }

  itemNames() {
    return readTexts(this.itemName);
  }

  checkout() {
    cy.get(this.checkoutButton).click();
    return this;
  }

  continueShopping() {
    cy.get(this.continueShoppingButton).click();
    return this;
  }
}

export const cartPage = new CartPage();
