import 'cypress-mochawesome-reporter/register';
import './commands';

// Ignora apenas erros conhecidos de terceiros/navegador que não pertencem à aplicação.
// Qualquer outro erro de JavaScript da página continua falhando o teste.
Cypress.on('uncaught:exception', (err) => {
  if (/ResizeObserver loop|backtrace/i.test(err.message)) return false;
  return undefined;
});

beforeEach(() => {
  // Telemetria de terceiros do Sauce Demo: não faz parte do escopo e só gera ruído e lentidão.
  cy.intercept({ hostname: /backtrace\.io$/ }, { statusCode: 204 });
});
