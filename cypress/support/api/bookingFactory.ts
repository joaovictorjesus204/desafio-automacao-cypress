import { faker } from '@faker-js/faker';
import { Booking } from './types';

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

/** Só letras, para evitar nomes como "O'Kon" e facilitar o filtro por nome na API. */
const lettersOnly = (value: string): string => value.replace(/[^A-Za-z]/g, '');

/**
 * Gera uma reserva válida e única a cada chamada.
 * O sufixo aleatório no nome garante que a reserva seja identificável
 * mesmo com outros usuários criando registros no mesmo ambiente.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const checkin = faker.date.soon({ days: 60 });
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + faker.number.int({ min: 1, max: 10 }));

  return {
    firstname: `${lettersOnly(faker.person.firstName())}${faker.string.alpha({ length: 6, casing: 'lower' })}`,
    lastname: `Qa${lettersOnly(faker.person.lastName())}`,
    totalprice: faker.number.int({ min: 100, max: 5000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: toIsoDate(checkin),
      checkout: toIsoDate(checkout),
    },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Late checkout', 'Airport transfer', 'Extra pillow']),
    ...overrides,
  };
}
