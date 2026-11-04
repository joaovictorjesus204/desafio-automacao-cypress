import { AuthResponse, Booking, BookingIdItem, CreateBookingResponse } from './types';

/**
 * Cliente fino da API Restful Booker.
 * Todas as chamadas usam failOnStatusCode: false para que o próprio teste
 * decida o que é sucesso ou falha (essencial nos cenários negativos).
 */
const baseUrl = (): string => Cypress.env('apiUrl') as string;

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export type AuthMode = { token: string } | { basic: true } | { none: true };

function authHeaders(auth: AuthMode): Record<string, string> {
  if ('token' in auth) return { Cookie: `token=${auth.token}` };
  if ('basic' in auth) {
    const credentials = `${Cypress.env('apiUser')}:${Cypress.env('apiPassword')}`;
    return { Authorization: `Basic ${btoa(credentials)}` };
  }
  return {};
}

export const BookingApi = {
  ping() {
    return cy.request({ method: 'GET', url: `${baseUrl()}/ping`, failOnStatusCode: false });
  },

  auth(username: unknown, password: unknown) {
    return cy.request<AuthResponse>({
      method: 'POST',
      url: `${baseUrl()}/auth`,
      headers: JSON_HEADERS,
      body: { username, password },
      failOnStatusCode: false,
    });
  },

  create(booking: Booking | object) {
    return cy.request<CreateBookingResponse>({
      method: 'POST',
      url: `${baseUrl()}/booking`,
      headers: JSON_HEADERS,
      body: booking,
      failOnStatusCode: false,
    });
  },

  get(id: number) {
    return cy.request<Booking>({
      method: 'GET',
      url: `${baseUrl()}/booking/${id}`,
      headers: { Accept: 'application/json' },
      failOnStatusCode: false,
    });
  },

  list(filters: Record<string, string> = {}) {
    return cy.request<BookingIdItem[]>({
      method: 'GET',
      url: `${baseUrl()}/booking`,
      qs: filters,
      headers: { Accept: 'application/json' },
      failOnStatusCode: false,
    });
  },

  update(id: number, booking: Booking | object, auth: AuthMode) {
    return cy.request<Booking>({
      method: 'PUT',
      url: `${baseUrl()}/booking/${id}`,
      headers: { ...JSON_HEADERS, ...authHeaders(auth) },
      body: booking,
      failOnStatusCode: false,
    });
  },

  partialUpdate(id: number, changes: Partial<Booking>, auth: AuthMode) {
    return cy.request<Booking>({
      method: 'PATCH',
      url: `${baseUrl()}/booking/${id}`,
      headers: { ...JSON_HEADERS, ...authHeaders(auth) },
      body: changes,
      failOnStatusCode: false,
    });
  },

  remove(id: number, auth: AuthMode) {
    return cy.request({
      method: 'DELETE',
      url: `${baseUrl()}/booking/${id}`,
      headers: { 'Content-Type': 'application/json', ...authHeaders(auth) },
      failOnStatusCode: false,
    });
  },
};
