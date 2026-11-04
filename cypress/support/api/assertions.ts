import { Booking } from './types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Validação de contrato leve, sem dependência extra: tipos e formato de cada campo. */
export function expectBookingContract(body: unknown): void {
  expect(body, 'corpo da reserva').to.be.an('object');
  const booking = body as Booking;
  expect(booking.firstname, 'firstname').to.be.a('string');
  expect(booking.lastname, 'lastname').to.be.a('string');
  expect(booking.totalprice, 'totalprice').to.be.a('number');
  expect(booking.depositpaid, 'depositpaid').to.be.a('boolean');
  expect(booking.bookingdates, 'bookingdates').to.be.an('object');
  expect(booking.bookingdates.checkin, 'checkin').to.match(ISO_DATE);
  expect(booking.bookingdates.checkout, 'checkout').to.match(ISO_DATE);
}

/** Compara a reserva retornada com a enviada, campo a campo. */
export function expectBookingEquals(actual: Booking, expected: Booking): void {
  expect(actual.firstname).to.eq(expected.firstname);
  expect(actual.lastname).to.eq(expected.lastname);
  expect(actual.totalprice).to.eq(expected.totalprice);
  expect(actual.depositpaid).to.eq(expected.depositpaid);
  expect(actual.bookingdates).to.deep.eq(expected.bookingdates);
  if (expected.additionalneeds !== undefined) {
    expect(actual.additionalneeds).to.eq(expected.additionalneeds);
  }
}
