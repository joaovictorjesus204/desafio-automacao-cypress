class Menu {
  private readonly openButton = '#react-burger-menu-btn';
  private readonly logoutLink = '#logout_sidebar_link';

  logout() {
    cy.get(this.openButton).click();
    cy.get(this.logoutLink).should('be.visible').click();
  }
}

export const menu = new Menu();
