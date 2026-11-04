class LoginPage {
  private readonly username = '[data-test="username"]';
  private readonly password = '[data-test="password"]';
  private readonly submitButton = '[data-test="login-button"]';
  private readonly errorMessage = '[data-test="error"]';

  visit() {
    cy.visit('/');
    return this;
  }

  fill(username: string, password: string) {
    if (username) cy.get(this.username).clear().type(username);
    if (password) cy.get(this.password).clear().type(password, { log: false });
    return this;
  }

  submit() {
    cy.get(this.submitButton).click();
    return this;
  }

  login(username: string, password: string) {
    return this.fill(username, password).submit();
  }

  error() {
    return cy.get(this.errorMessage);
  }

  isDisplayed() {
    cy.get(this.submitButton).should('be.visible');
    return this;
  }
}

export const loginPage = new LoginPage();
