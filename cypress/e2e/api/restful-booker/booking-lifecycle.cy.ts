import { BookingApi } from '../../../support/api/bookingApi';
import { buildBooking } from '../../../support/api/bookingFactory';
import { expectBookingContract, expectBookingEquals } from '../../../support/api/assertions';
import { Booking } from '../../../support/api/types';

/**
 * Ambiente público e compartilhado: cada teste cria a própria reserva com dados únicos,
 * valida só o que ele mesmo criou e apaga tudo no final (afterEach), mesmo se falhar.
 */
describe('API Restful Booker | Ciclo de vida da reserva', () => {
  let token: string;
  let createdIds: number[] = [];

  const createBooking = (booking: Booking = buildBooking()) =>
    BookingApi.create(booking).then((response) => {
      expect(response.status, 'status da criação').to.eq(200);
      createdIds.push(response.body.bookingid);
      return response.body.bookingid;
    });

  beforeEach(() => {
    cy.getAuthToken().then((value) => {
      token = value;
    });
  });

  afterEach(() => {
    createdIds.forEach((id) => BookingApi.remove(id, { token }));
    createdIds = [];
  });

  it('API-10 ciclo completo: criar, consultar, atualizar, excluir e confirmar exclusão', () => {
    const original = buildBooking();
    const updated = buildBooking();

    createBooking(original).then((id) => {
      BookingApi.get(id).then((response) => {
        expect(response.status).to.eq(200);
        expectBookingEquals(response.body, original);
      });

      BookingApi.update(id, updated, { token }).then((response) => {
        expect(response.status).to.eq(200);
        expectBookingEquals(response.body, updated);
      });

      BookingApi.get(id).its('body').then((body) => expectBookingEquals(body, updated));

      BookingApi.remove(id, { token }).its('status').should('eq', 201);
      BookingApi.get(id).its('status').should('eq', 404);
    });
  });

  it('API-11 criar reserva devolve id e os mesmos dados enviados, no contrato esperado', () => {
    const booking = buildBooking();

    BookingApi.create(booking).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.bookingid).to.be.a('number').and.be.greaterThan(0);
      expectBookingContract(response.body.booking);
      expectBookingEquals(response.body.booking, booking);
      createdIds.push(response.body.bookingid);
    });
  });

  it('API-12 consultar por id devolve a reserva no contrato esperado', () => {
    const booking = buildBooking();

    createBooking(booking).then((id) => {
      BookingApi.get(id).then((response) => {
        expect(response.status).to.eq(200);
        expectBookingContract(response.body);
        expectBookingEquals(response.body, booking);
      });
    });
  });

  it('API-13 listagem filtrada por nome encontra a reserva criada', () => {
    const booking = buildBooking();

    createBooking(booking).then((id) => {
      BookingApi.list({ firstname: booking.firstname, lastname: booking.lastname }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        const ids = response.body.map((item) => item.bookingid);
        expect(ids).to.include(id);
      });
    });
  });

  it('API-14 atualização total (PUT) com token troca todos os campos', () => {
    const changes = buildBooking({ depositpaid: true, additionalneeds: 'Dinner' });

    createBooking().then((id) => {
      BookingApi.update(id, changes, { token }).then((response) => {
        expect(response.status).to.eq(200);
        expectBookingEquals(response.body, changes);
      });
    });
  });

  it('API-15 atualização parcial (PATCH) altera só os campos enviados', () => {
    const booking = buildBooking();
    const changes = { firstname: 'Patched', totalprice: 999 };

    createBooking(booking).then((id) => {
      BookingApi.partialUpdate(id, changes, { token }).then((response) => {
        expect(response.status).to.eq(200);
        expectBookingEquals(response.body, { ...booking, ...changes });
      });
    });
  });

  it('API-16 autenticação alternativa: PUT com Basic Auth também é aceito', () => {
    const changes = buildBooking();

    createBooking().then((id) => {
      BookingApi.update(id, changes, { basic: true }).then((response) => {
        expect(response.status).to.eq(200);
        expectBookingEquals(response.body, changes);
      });
    });
  });

  it('API-17 excluir com token remove a reserva', () => {
    createBooking().then((id) => {
      // A API responde 201 Created na exclusão (o esperado seria 200/204); documentado no README.
      BookingApi.remove(id, { token }).its('status').should('eq', 201);
      BookingApi.get(id).its('status').should('eq', 404);
    });
  });
});
