import { inventoryPage } from '../../support/pages/InventoryPage';
import { cartPage } from '../../support/pages/CartPage';
import { checkoutPage } from '../../support/pages/CheckoutPage';
import { CUSTOMER, PRODUCTS, USERS } from '../../support/data/users';

describe('Sauce Demo | Usuários com comportamento especial', () => {
  it('UI-30 performance_glitch_user conclui a compra apesar da lentidão', () => {
    // A lentidão é absorvida pelo timeout maior no login (comando loginAs) e pelo
    // defaultCommandTimeout de 10s. Nenhum cy.wait fixo é usado.
    cy.loginAs(USERS.performanceGlitch);
    inventoryPage.visit().isDisplayed();

    inventoryPage.addToCart(PRODUCTS.backpack.slug).cartBadgeShouldBe(1).openCart();
    cartPage.itemsShouldHaveLength(1).checkout();
    checkoutPage.fillCustomerInfo(CUSTOMER).continue().finish().orderShouldBeComplete();
  });

  it('UI-31 problem_user: catálogo exibe a mesma imagem para todos os produtos (defeito conhecido)', () => {
    // Referência: com o usuário padrão cada produto tem a sua própria imagem.
    cy.loginAs(USERS.standard);
    inventoryPage.visit();
    inventoryPage.imageSources().then((standardSources) => {
      expect(new Set(standardSources).size, 'imagens distintas (standard_user)').to.eq(standardSources.length);
    });

    // Com problem_user todas as imagens são iguais. Se este teste falhar, o defeito foi corrigido
    // e o teste deve passar a validar o comportamento correto.
    cy.loginAs(USERS.problem);
    inventoryPage.visit().isDisplayed();
    inventoryPage.imageSources().then((problemSources) => {
      expect(new Set(problemSources).size, 'imagens distintas (problem_user)').to.eq(1);
    });
  });
});
