import { loginPage } from '../../support/pages/LoginPage';
import { inventoryPage } from '../../support/pages/InventoryPage';
import { menu } from '../../support/pages/Menu';
import { USERS } from '../../support/data/users';

describe('Sauce Demo | Logout', () => {
  beforeEach(() => {
    cy.loginAs(USERS.standard);
    inventoryPage.visit().isDisplayed();
  });

  it('UI-40 logout volta para a tela de login e encerra a sessão', () => {
    menu.logout();
    cy.location('pathname').should('eq', '/');
    loginPage.isDisplayed();
    cy.getCookie('session-username').should('be.null');
  });

  it('UI-41 após o logout não é possível voltar para a área logada', () => {
    menu.logout();
    cy.visit('/inventory.html', { failOnStatusCode: false });
    cy.location('pathname').should('eq', '/');
    loginPage.error().should('contain.text', 'when you are logged in');
  });
});
