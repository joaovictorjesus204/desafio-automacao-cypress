import { readTexts, readPrices } from './helpers';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

class InventoryPage {
  readonly path = '/inventory.html';
  private readonly title = '.title';
  private readonly item = '.inventory_item';
  private readonly itemName = '.inventory_item_name';
  private readonly itemPrice = '.inventory_item_price';
  private readonly itemImage = '.inventory_item img';
  private readonly sortSelect = '.product_sort_container';
  private readonly cartBadge = '.shopping_cart_badge';
  private readonly cartLink = '.shopping_cart_link';

  visit() {
    // O Sauce Demo é uma SPA: ao abrir uma página interna direto pela URL, o servidor
    // responde 404 mas entrega a aplicação normalmente. Por isso o status é ignorado aqui.
    cy.visit(this.path, { failOnStatusCode: false });
    return this;
  }

  isDisplayed() {
    cy.location('pathname').should('eq', this.path);
    cy.get(this.title).should('have.text', 'Products');
    cy.get(this.item).should('have.length.greaterThan', 0);
    return this;
  }

  addToCart(slug: string) {
    cy.get(`[data-test="add-to-cart-${slug}"]`).click();
    cy.get(`[data-test="remove-${slug}"]`).should('be.visible');
    return this;
  }

  removeFromCart(slug: string) {
    cy.get(`[data-test="remove-${slug}"]`).click();
    cy.get(`[data-test="add-to-cart-${slug}"]`).should('be.visible');
    return this;
  }

  sortBy(option: SortOption) {
    cy.get(this.sortSelect).select(option);
    return this;
  }

  cartBadgeShouldBe(count: number) {
    if (count === 0) cy.get(this.cartBadge).should('not.exist');
    else cy.get(this.cartBadge).should('have.text', String(count));
    return this;
  }

  openCart() {
    cy.get(this.cartLink).click();
    return this;
  }

  itemNames() {
    return readTexts(this.itemName);
  }

  itemPrices() {
    return readPrices(this.itemPrice);
  }

  imageSources() {
    return cy
      .get(this.itemImage)
      .then(($imgs) => Cypress.$.makeArray($imgs).map((img) => img.getAttribute('src') ?? ''));
  }
}

export const inventoryPage = new InventoryPage();
