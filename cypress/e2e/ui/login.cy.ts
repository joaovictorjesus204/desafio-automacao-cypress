import { loginPage } from '../../support/pages/LoginPage';
import { inventoryPage } from '../../support/pages/InventoryPage';
import { USERS } from '../../support/data/users';

const PASSWORD = (): string => Cypress.env('webPassword') as string;

describe('Sauce Demo | Login', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('UI-01 login com usuário padrão leva ao catálogo', () => {
    loginPage.login(USERS.standard, PASSWORD());
    inventoryPage.isDisplayed();
    cy.getCookie('session-username').should('have.property', 'value', USERS.standard);
  });

  const failures = [
    {
      cenario: 'usuário em branco',
      username: '',
      password: 'secret_sauce',
      message: 'Epic sadface: Username is required',
    },
    {
      cenario: 'senha em branco',
      username: USERS.standard,
      password: '',
      message: 'Epic sadface: Password is required',
    },
    {
      cenario: 'senha incorreta',
      username: USERS.standard,
      password: 'senha-errada',
      message: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      cenario: 'usuário inexistente',
      username: 'usuario_inexistente',
      password: 'secret_sauce',
      message: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      cenario: 'usuário bloqueado (locked_out_user)',
      username: USERS.lockedOut,
      password: 'secret_sauce',
      message: 'Sorry, this user has been locked out',
    },
  ];

  failures.forEach(({ cenario, username, password, message }) => {
    it(`UI-02 login falha com ${cenario}`, () => {
      loginPage.login(username, password);
      loginPage.error().should('be.visible').and('contain.text', message);
      cy.location('pathname').should('eq', '/');
      cy.get('.inventory_list').should('not.exist');
    });
  });

  it('UI-03 página protegida sem login redireciona para o login com aviso', () => {
    cy.visit('/inventory.html', { failOnStatusCode: false });
    cy.location('pathname').should('eq', '/');
    loginPage.error().should('contain.text', 'when you are logged in');
  });
});
