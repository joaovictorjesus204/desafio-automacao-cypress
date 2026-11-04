import { inventoryPage } from '../../support/pages/InventoryPage';
import { cartPage } from '../../support/pages/CartPage';
import { checkoutPage } from '../../support/pages/CheckoutPage';
import { CUSTOMER, PRODUCTS, USERS } from '../../support/data/users';

describe('Sauce Demo | Compra (checkout)', () => {
  beforeEach(() => {
    cy.loginAs(USERS.standard);
    inventoryPage.visit().isDisplayed();
  });

  it('UI-10 fluxo principal: login, carrinho, dados, resumo com valores corretos e confirmação', () => {
    const chosen = [PRODUCTS.backpack, PRODUCTS.bikeLight];

    chosen.forEach((product) => inventoryPage.addToCart(product.slug));
    inventoryPage.cartBadgeShouldBe(chosen.length).openCart();

    cartPage.isDisplayed().itemsShouldHaveLength(chosen.length);
    cartPage.itemNames().should('deep.equal', chosen.map((p) => p.name));
    cartPage.checkout();

    cy.location('pathname').should('eq', checkoutPage.stepOnePath);
    checkoutPage.fillCustomerInfo(CUSTOMER).continue();

    cy.location('pathname').should('eq', checkoutPage.stepTwoPath);
    checkoutPage.itemNames().should('deep.equal', chosen.map((p) => p.name));

    // Valores calculados a partir da tela, sem preço fixo no teste
    checkoutPage.itemPrices().then((prices) => {
      const expectedSubtotal = prices.reduce((sum, price) => sum + price, 0);

      checkoutPage.subtotalValue().should('be.closeTo', expectedSubtotal, 0.001);
      checkoutPage.taxValue().then((tax) => {
        expect(tax, 'imposto de 8% sobre o subtotal').to.be.closeTo(expectedSubtotal * 0.08, 0.01);
        checkoutPage.totalValue().should('be.closeTo', expectedSubtotal + tax, 0.001);
      });
    });

    checkoutPage.finish().orderShouldBeComplete();
    inventoryPage.cartBadgeShouldBe(0);
  });

  describe('Validação do formulário de dados do comprador', () => {
    beforeEach(() => {
      inventoryPage.addToCart(PRODUCTS.backpack.slug).openCart();
      cartPage.checkout();
    });

    const formErrors = [
      { cenario: 'nome em branco', info: { ...CUSTOMER, firstName: '' }, message: 'Error: First Name is required' },
      { cenario: 'sobrenome em branco', info: { ...CUSTOMER, lastName: '' }, message: 'Error: Last Name is required' },
      { cenario: 'CEP em branco', info: { ...CUSTOMER, postalCode: '' }, message: 'Error: Postal Code is required' },
      {
        cenario: 'todos os campos em branco',
        info: { firstName: '', lastName: '', postalCode: '' },
        message: 'Error: First Name is required',
      },
    ];

    formErrors.forEach(({ cenario, info, message }) => {
      it(`UI-11 não avança com ${cenario}`, () => {
        checkoutPage.fillCustomerInfo(info).continue();
        checkoutPage.error().should('be.visible').and('have.text', message);
        cy.location('pathname').should('eq', checkoutPage.stepOnePath);
      });
    });

    it('UI-12 cancelar nos dados do comprador volta ao carrinho sem perder itens', () => {
      checkoutPage.cancel();
      cartPage.isDisplayed().itemsShouldHaveLength(1);
    });
  });

  it('UI-13 cancelar no resumo volta ao catálogo e mantém o carrinho', () => {
    inventoryPage.addToCart(PRODUCTS.backpack.slug).openCart();
    cartPage.checkout();
    checkoutPage.fillCustomerInfo(CUSTOMER).continue().cancel();
    inventoryPage.isDisplayed().cartBadgeShouldBe(1);
  });
});
