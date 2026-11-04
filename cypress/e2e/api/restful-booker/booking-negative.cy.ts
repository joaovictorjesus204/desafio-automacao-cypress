import { BookingApi } from '../../../support/api/bookingApi';
import { buildBooking } from '../../../support/api/bookingFactory';
import { expectBookingEquals } from '../../../support/api/assertions';
import { Booking } from '../../../support/api/types';

/** Id muito acima do volume real do ambiente: garante "reserva inexistente" sem depender de dados alheios. */
const NON_EXISTENT_ID = 987654321;

describe('API Restful Booker | Cenários negativos', () => {
  let token: string;
  let bookingId: number;
  let booking: Booking;

  beforeEach(() => {
    cy.getAuthToken().then((value) => {
      token = value;
    });
    booking = buildBooking();
    BookingApi.create(booking).then((response) => {
      expect(response.status).to.eq(200);
      bookingId = response.body.bookingid;
    });
  });

  afterEach(() => {
    BookingApi.remove(bookingId, { token });
  });

  describe('Segurança: operações protegidas sem autorização', () => {
    it('API-20 PUT sem token é recusado (403) e a reserva não muda', () => {
      BookingApi.update(bookingId, buildBooking(), { none: true }).its('status').should('eq', 403);
      BookingApi.get(bookingId).its('body').then((body) => expectBookingEquals(body, booking));
    });

    it('API-21 PUT com token inválido é recusado (403)', () => {
      BookingApi.update(bookingId, buildBooking(), { token: 'token-invalido' }).its('status').should('eq', 403);
    });

    it('API-22 PATCH sem token é recusado (403) e a reserva não muda', () => {
      BookingApi.partialUpdate(bookingId, { firstname: 'Hacker' }, { none: true }).its('status').should('eq', 403);
      BookingApi.get(bookingId).its('body').its('firstname').should('eq', booking.firstname);
    });

    it('API-23 DELETE sem token é recusado (403) e a reserva continua existindo', () => {
      BookingApi.remove(bookingId, { none: true }).its('status').should('eq', 403);
      BookingApi.get(bookingId).its('status').should('eq', 200);
    });

    it('API-24 DELETE com token inválido é recusado (403)', () => {
      BookingApi.remove(bookingId, { token: 'token-invalido' }).its('status').should('eq', 403);
      BookingApi.get(bookingId).its('status').should('eq', 200);
    });
  });

  describe('Recursos inexistentes', () => {
    it('API-25 GET de reserva inexistente retorna 404', () => {
      BookingApi.get(NON_EXISTENT_ID).its('status').should('eq', 404);
    });

    it('API-26 PUT em reserva inexistente não é aceito', () => {
      // A API responde 405; o correto seria 404. O teste garante que não há sucesso.
      BookingApi.update(NON_EXISTENT_ID, buildBooking(), { token }).its('status').should('be.oneOf', [404, 405]);
    });

    it('API-27 DELETE de reserva já excluída não é aceito', () => {
      BookingApi.remove(bookingId, { token }).its('status').should('eq', 201);
      BookingApi.remove(bookingId, { token }).its('status').should('be.oneOf', [404, 405]);
    });
  });

  describe('Validação de dados', () => {
    it('API-28 criar reserva sem campos obrigatórios não é aceito', () => {
      const { firstname, ...withoutFirstname } = buildBooking();
      expect(firstname).to.be.a('string');
      // A API devolve 500 (erro interno) quando o esperado seria 400. Registrado como defeito no README.
      BookingApi.create(withoutFirstname).its('status').should('be.oneOf', [400, 500]);
    });

    it('API-29 criar reserva com corpo vazio não é aceito', () => {
      BookingApi.create({}).its('status').should('be.oneOf', [400, 500]);
    });

    it('API-30 PUT com corpo incompleto não é aceito e a reserva não muda', () => {
      BookingApi.update(bookingId, { firstname: 'SoNome' }, { token }).its('status').should('be.oneOf', [400, 500]);
      BookingApi.get(bookingId).its('body').then((body) => expectBookingEquals(body, booking));
    });
  });
});
