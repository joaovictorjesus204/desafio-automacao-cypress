/**
 * Extra opcional: JSONPlaceholder (API fake, sem autenticação e sem persistência).
 * Serve para mostrar que o mesmo padrão de teste de API se aplica a outro serviço.
 */
const url = (path: string) => `${Cypress.env('jsonPlaceholderUrl')}${path}`;

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

describe('API JSONPlaceholder | Extra', () => {
  it('EXT-01 lista 100 posts com o contrato esperado', () => {
    cy.request<Post[]>(url('/posts')).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(100);
      response.body.forEach((post) => {
        expect(post).to.have.all.keys('userId', 'id', 'title', 'body');
      });
    });
  });

  it('EXT-02 consulta um post por id', () => {
    cy.request<Post>(url('/posts/1')).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body.userId).to.eq(1);
    });
  });

  it('EXT-03 criação simulada devolve 201 com os dados enviados', () => {
    const payload = { userId: 1, title: 'POC Cypress', body: 'Teste de criação' };

    cy.request<Post>({ method: 'POST', url: url('/posts'), body: payload }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.include(payload);
      expect(response.body.id).to.be.a('number');
    });
  });

  it('EXT-04 post inexistente retorna 404', () => {
    cy.request({ url: url('/posts/0'), failOnStatusCode: false }).its('status').should('eq', 404);
  });
});
