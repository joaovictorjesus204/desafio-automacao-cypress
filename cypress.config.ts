import { defineConfig } from 'cypress';

export default defineConfig({
  // Relatório HTML legível por quem não é desenvolvedor (cypress/reports/index.html)
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Relatório de Testes | Desafio Cypress',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  // Ambientes públicos e compartilhados: 2 novas tentativas só no modo CI/headless
  retries: { runMode: 2, openMode: 0 },

  // Heroku (Restful Booker) pode demorar no primeiro acesso; performance_glitch_user é lento de propósito
  defaultCommandTimeout: 10000,
  requestTimeout: 30000,
  responseTimeout: 30000,

  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1366,
  viewportHeight: 768,

  // Valores padrão. Qualquer um pode ser sobrescrito por variável de ambiente CYPRESS_<nome>
  // (ex.: CYPRESS_apiPassword=xxx npm test). São credenciais públicas de ambientes de demonstração.
  env: {
    apiUrl: 'https://restful-booker.herokuapp.com',
    apiUser: 'admin',
    apiPassword: 'password123',
    jsonPlaceholderUrl: 'https://jsonplaceholder.typicode.com',
    webPassword: 'secret_sauce',
  },

  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
