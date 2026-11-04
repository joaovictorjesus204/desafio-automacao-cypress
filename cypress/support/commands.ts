import { BookingApi } from './api/bookingApi';
import { loginPage } from './pages/LoginPage';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Faz login no Sauce Demo pela interface e guarda a sessão com cy.session.
       * O login pela tela é testado nos specs de login; nos demais ele é só pré-condição.
       */
      loginAs(username: string): Chainable<void>;

      /** Gera um token novo no Restful Booker com as credenciais de Cypress.env. */
      getAuthToken(): Chainable<string>;
    }
  }
}

Cypress.Commands.add('loginAs', (username: string) => {
  cy.session(
    ['sauce-demo', username],
    () => {
      loginPage.visit().login(username, Cypress.env('webPassword') as string);
      // performance_glitch_user demora alguns segundos no login de propósito
      cy.location('pathname', { timeout: 20000 }).should('eq', '/inventory.html');
    },
    {
      validate() {
        cy.getCookie('session-username').should('have.property', 'value', username);
      },
      cacheAcrossSpecs: true,
    },
  );
});

Cypress.Commands.add('getAuthToken', () => {
  return BookingApi.auth(Cypress.env('apiUser'), Cypress.env('apiPassword')).then((response) => {
    expect(response.status, 'status do /auth').to.eq(200);
    expect(response.body.token, 'token').to.be.a('string').and.not.be.empty;
    return response.body.token as string;
  });
});

export {};
