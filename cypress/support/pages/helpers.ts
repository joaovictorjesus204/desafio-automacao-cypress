/** Lê o texto de todos os elementos do seletor, na ordem em que aparecem na tela. */
export function readTexts(selector: string) {
  return cy
    .get(selector)
    .then(($els) => Cypress.$.makeArray($els).map((el) => (el as HTMLElement).innerText.trim()));
}

/** Converte "$29.99" (ou "Item total: $29.99") em número. */
export function toMoney(text: string): number {
  return Number.parseFloat(text.replace(/[^0-9.]/g, ''));
}

export function readPrices(selector: string) {
  return readTexts(selector).then((texts) => texts.map(toMoney));
}

export function readMoney(selector: string) {
  return cy.get(selector).invoke('text').then(toMoney);
}
