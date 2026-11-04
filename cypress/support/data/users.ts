/** Usuários listados na tela de login do Sauce Demo. A senha vem de Cypress.env('webPassword'). */
export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

/** Identificadores (slug) usados nos atributos data-test dos botões de produto. */
export const PRODUCTS = {
  backpack: { slug: 'sauce-labs-backpack', name: 'Sauce Labs Backpack' },
  bikeLight: { slug: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light' },
  boltTShirt: { slug: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt' },
} as const;

export const CUSTOMER = {
  firstName: 'Ana',
  lastName: 'Souza',
  postalCode: '01001-000',
};
