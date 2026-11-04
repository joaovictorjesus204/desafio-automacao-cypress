import { BookingApi } from '../../../support/api/bookingApi';

describe('API Restful Booker | Autenticação', () => {
  it('API-01 healthcheck: /ping responde que a API está no ar', () => {
    BookingApi.ping().its('status').should('eq', 201);
  });

  it('API-02 gera token com credenciais válidas', () => {
    BookingApi.auth(Cypress.env('apiUser'), Cypress.env('apiPassword')).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.token).to.be.a('string').and.have.length.greaterThan(5);
      expect(response.body).not.to.have.property('reason');
    });
  });

  it('API-03 gera um token diferente a cada autenticação', () => {
    cy.getAuthToken().then((first) => {
      cy.getAuthToken().should('not.eq', first);
    });
  });

  // A API responde 200 mesmo com credencial inválida (deveria ser 401).
  // O teste valida o que importa para a segurança: nenhum token é emitido.
  const invalidCredentials = [
    { cenario: 'senha incorreta', username: 'admin', password: 'senha-errada' },
    { cenario: 'usuário inexistente', username: 'nao-existe', password: 'password123' },
    { cenario: 'campos vazios', username: '', password: '' },
  ];

  invalidCredentials.forEach(({ cenario, username, password }) => {
    it(`API-04 não emite token com ${cenario}`, () => {
      BookingApi.auth(username, password).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.reason).to.eq('Bad credentials');
        expect(response.body).not.to.have.property('token');
      });
    });
  });
});
