import { inventoryPage } from '../../support/pages/InventoryPage';
import { cartPage } from '../../support/pages/CartPage';
import { PRODUCTS, USERS } from '../../support/data/users';

describe('Sauce Demo | Catálogo e carrinho', () => {
  beforeEach(() => {
    cy.loginAs(USERS.standard);
    inventoryPage.visit().isDisplayed();
  });

  it('UI-20 adicionar e remover itens atualiza o contador do carrinho', () => {
    inventoryPage
      .cartBadgeShouldBe(0)
      .addToCart(PRODUCTS.backpack.slug)
      .cartBadgeShouldBe(1)
      .addToCart(PRODUCTS.boltTShirt.slug)
      .cartBadgeShouldBe(2)
      .removeFromCart(PRODUCTS.backpack.slug)
      .cartBadgeShouldBe(1);

    inventoryPage.openCart();
    cartPage.itemNames().should('deep.equal', [PRODUCTS.boltTShirt.name]);
  });

  it('UI-21 carrinho mantém os itens ao voltar para o catálogo', () => {
    inventoryPage.addToCart(PRODUCTS.bikeLight.slug).openCart();
    cartPage.itemsShouldHaveLength(1).continueShopping();
    inventoryPage.isDisplayed().cartBadgeShouldBe(1);
    cy.reload();
    inventoryPage.cartBadgeShouldBe(1);
  });

  it('UI-22 ordenação por nome Z a A', () => {
    inventoryPage.sortBy('za');
    inventoryPage.itemNames().then((names) => {
      const expected = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).to.deep.equal(expected);
    });
  });

  it('UI-23 ordenação por preço do menor para o maior', () => {
    inventoryPage.sortBy('lohi');
    inventoryPage.itemPrices().then((prices) => {
      expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
    });
  });

  it('UI-24 ordenação por preço do maior para o menor', () => {
    inventoryPage.sortBy('hilo');
    inventoryPage.itemPrices().then((prices) => {
      expect(prices).to.deep.equal([...prices].sort((a, b) => b - a));
    });
  });
});
