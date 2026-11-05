# Desafio de Automação | Cypress + TypeScript 

[![Testes](https://github.com/joaovictorjesus204/desafio-automacao-cypress/actions/workflows/cypress.yml/badge.svg)](https://github.com/joaovictorjesus204/desafio-automacao-cypress/actions/workflows/cypress.yml)

POC de automação que cobre, no mesmo repositório:

- **API**: [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) (autenticação e CRUD de reservas) e, como extra, [JSONPlaceholder](https://jsonplaceholder.typicode.com/).
- **Front-end**: [Sauce Demo](https://www.saucedemo.com/) (login, catálogo, carrinho, checkout, usuários especiais e logout).

**52 testes** no total: 29 de API e 23 de front-end.

Autor: João Victor de Jesus

---

## 1. Como instalar e rodar

Pré-requisitos: **Node.js 20 ou superior** (LTS) e Git.

```bash
git clone <url-deste-repositorio>
cd desafio-automacao-cypress
npm install
npm test
```

Não é preciso nenhum passo extra: URLs e credenciais públicas dos ambientes de demonstração já vêm com valores padrão no `cypress.config.ts`.

| Comando | O que faz |
|---|---|
| `npm test` | Roda todos os testes em modo headless (Electron) e gera o relatório |
| `npm run test:api` | Roda só os testes de API |
| `npm run test:ui` | Roda só os testes de front-end |
| `npm run test:chrome` | Roda tudo no Google Chrome (precisa ter o Chrome instalado) |
| `npm run cy:open` | Abre a interface do Cypress para rodar e depurar teste a teste |
| `npm run typecheck` | Verifica os tipos do TypeScript sem rodar os testes |

### Relatório

Depois de `npm test`, abra **`cypress/reports/index.html`** no navegador. É um relatório HTML (mochawesome) com gráfico de aprovados/reprovados, tempo de cada teste e print da tela embutido em caso de falha, pensado para quem não é desenvolvedor.

No GitHub, cada execução do workflow **Testes Cypress** (aba *Actions*) publica esse mesmo relatório como artefato `relatorio-cypress`.

### Sobrescrever configurações (opcional)

Qualquer valor de `env` do `cypress.config.ts` pode ser trocado por variável de ambiente com prefixo `CYPRESS_`, sem alterar código:

```bash
CYPRESS_apiPassword=outraSenha npm run test:api
```

---

## 2. Estrutura do projeto

```
cypress/
  e2e/
    api/
      restful-booker/   auth, ciclo de vida da reserva, cenários negativos
      jsonplaceholder/  extra opcional
    ui/                 login, checkout, catálogo/carrinho, outros usuários, logout
  support/
    api/                cliente da API, fábrica de dados, tipos e validações de contrato
    pages/              Page Objects do Sauce Demo
    data/               usuários, produtos e dados do comprador
    commands.ts         cy.loginAs() e cy.getAuthToken()
    e2e.ts              configuração global (relatório, exceções, intercepts)
.github/workflows/      execução automática no GitHub Actions
cypress.config.ts       timeouts, retries, relatório e variáveis
```

Cada teste tem um **ID** (API-xx, UI-xx, EXT-xx) que aparece no relatório e na tabela abaixo, para rastrear cenário, prioridade e resultado.

---

## 3. Tabela de cobertura

Prioridade: **P1** = crítico para o negócio ou segurança; **P2** = importante; **P3** = desejável.

### 3.1 API Restful Booker

| ID | Cenário | Prioridade | Automatizado | Observação |
|---|---|---|---|---|
| API-01 | Healthcheck `/ping` | P2 | Sim | Usado também como sinal rápido de ambiente fora do ar |
| API-02 | Gerar token com credenciais válidas | P1 | Sim | |
| API-03 | Cada autenticação gera um token novo | P3 | Sim | |
| API-04 | Não emitir token com senha errada, usuário inexistente ou campos vazios | P1 | Sim | Data-driven (3 casos). A API responde 200 em vez de 401; o teste valida que nenhum token é emitido |
| API-10 | Ciclo completo: criar, consultar, atualizar, excluir e confirmar 404 | P1 | Sim | Fluxo ponta a ponta exigido no escopo |
| API-11 | Criar reserva: id gerado, dados e contrato | P1 | Sim | |
| API-12 | Consultar reserva por id com validação de contrato | P1 | Sim | |
| API-13 | Listagem filtrada por nome encontra a reserva criada | P2 | Sim | Não valida contagem total, pois o ambiente é compartilhado |
| API-14 | Atualização total (PUT) com token | P1 | Sim | |
| API-15 | Atualização parcial (PATCH) mantém os demais campos | P1 | Sim | |
| API-16 | PUT com autenticação Basic (forma alternativa documentada) | P2 | Sim | |
| API-17 | Excluir com token | P1 | Sim | A API responde 201 em vez de 200/204 |
| API-20 | PUT sem token: 403 e reserva intacta | P1 | Sim | Segurança |
| API-21 | PUT com token inválido: 403 | P1 | Sim | Segurança |
| API-22 | PATCH sem token: 403 e reserva intacta | P1 | Sim | Segurança |
| API-23 | DELETE sem token: 403 e reserva continua existindo | P1 | Sim | Segurança |
| API-24 | DELETE com token inválido: 403 | P1 | Sim | Segurança |
| API-25 | GET de reserva inexistente: 404 | P2 | Sim | |
| API-26 | PUT em reserva inexistente não é aceito | P2 | Sim | API responde 405 em vez de 404 |
| API-27 | DELETE de reserva já excluída não é aceito | P2 | Sim | API responde 405 em vez de 404 |
| API-28 | Criar reserva sem campo obrigatório não é aceito | P2 | Sim | API responde 500 em vez de 400 (defeito registrado) |
| API-29 | Criar reserva com corpo vazio não é aceito | P2 | Sim | Idem |
| API-30 | PUT com corpo incompleto não é aceito e não altera a reserva | P2 | Sim | |
| - | Tipos inválidos (ex.: `totalprice` texto, datas fora do formato) | P2 | Não | A API não define regra para isso; aceitar ou recusar seria uma suposição. Precisaria de alinhamento com o time sobre o comportamento esperado |
| - | Check-out anterior ao check-in | P2 | Não | Mesmo motivo: regra de negócio não documentada |
| - | Expiração do token | P3 | Não | A documentação não informa tempo de expiração e os dados são reiniciados periodicamente; não há como testar de forma determinística |
| - | Tempo de resposta (SLA) | P3 | Não | Servidor gratuito no Heroku com "cold start"; medir desempenho aqui geraria falsos alarmes |
| - | Formato XML / URL-encoded (`Accept: application/xml`) | P3 | Não | Suportado pela API, mas fora do uso principal; priorizei JSON |

### 3.2 API JSONPlaceholder (extra)

| ID | Cenário | Prioridade | Automatizado |
|---|---|---|---|
| EXT-01 | Listar 100 posts com contrato | P3 | Sim |
| EXT-02 | Consultar post por id | P3 | Sim |
| EXT-03 | Criação simulada devolve 201 | P3 | Sim |
| EXT-04 | Post inexistente: 404 | P3 | Sim |

### 3.3 Front-end Sauce Demo

| ID | Cenário | Prioridade | Automatizado | Observação |
|---|---|---|---|---|
| UI-01 | Login com `standard_user` | P1 | Sim | |
| UI-02 | Falhas de login: usuário em branco, senha em branco, senha errada, usuário inexistente, `locked_out_user` | P1 | Sim | Data-driven (5 casos), valida mensagem exata |
| UI-03 | Acessar página interna sem login | P1 | Sim | Segurança |
| UI-10 | **Fluxo principal de compra**: login, 2 itens, carrinho, dados, resumo, confirmação | P1 | Sim | Valida subtotal, imposto de 8% e total calculados a partir da tela |
| UI-11 | Formulário do comprador: nome, sobrenome, CEP e todos em branco | P1 | Sim | Data-driven (4 casos) |
| UI-12 | Cancelar nos dados do comprador mantém o carrinho | P2 | Sim | |
| UI-13 | Cancelar no resumo volta ao catálogo e mantém o carrinho | P2 | Sim | |
| UI-20 | Adicionar e remover itens atualiza o contador | P1 | Sim | |
| UI-21 | Carrinho persiste ao navegar e ao recarregar a página | P2 | Sim | |
| UI-22 | Ordenação por nome Z a A | P2 | Sim | Compara com a lista ordenada pelo próprio teste, sem lista fixa |
| UI-23 | Ordenação por preço crescente | P2 | Sim | |
| UI-24 | Ordenação por preço decrescente | P2 | Sim | |
| UI-30 | `performance_glitch_user` conclui a compra | P1 | Sim | Usuário diferente do `standard_user`, exigido no escopo |
| UI-31 | `problem_user` exibe a mesma imagem para todos os produtos | P2 | Sim | Teste de caracterização de defeito conhecido (ver Limitações) |
| UI-40 | Logout encerra a sessão e volta ao login | P1 | Sim | |
| UI-41 | Após logout não é possível voltar à área logada | P1 | Sim | Segurança |
| - | `problem_user`: demais falhas no carrinho e no checkout | P2 | Não | Comportamento propositalmente instável; priorizei um defeito determinístico (imagens) |
| - | `error_user`: falhas ao interagir com carrinho e checkout | P2 | Não | Mesmo motivo; ficaria como próximo passo com testes de caracterização |
| - | `visual_user`: diferenças visuais | P3 | Não | Exige teste de regressão visual (comparação de imagens), fora do escopo desta POC |
| - | Ordenação A a Z (padrão) | P3 | Não | Coberta indiretamente: é o estado inicial e o inverso de UI-22 |
| - | Página de detalhe do produto | P3 | Não | Fora do escopo mínimo; baixo risco comparado ao checkout |
| - | Menu "Reset App State", "About" e links de redes sociais | P3 | Não | Baixo valor de negócio; links externos não são da aplicação |
| - | Responsividade (mobile) | P3 | Não | Exigiria matriz de viewports; candidato a próximo passo |

---

## 4. Decisões técnicas

| Decisão | Justificativa |
|---|---|
| **API e front-end no mesmo projeto, separados por pasta** (`e2e/api`, `e2e/ui`) | Atende o enunciado e permite rodar cada parte isolada (`test:api`, `test:ui`), útil em pipeline |
| **Cliente de API próprio** (`support/api/bookingApi.ts`) | Centraliza URL, cabeçalhos e autenticação. Os testes ficam legíveis ("criar, atualizar, excluir") e uma mudança na API é corrigida em um só lugar |
| **`failOnStatusCode: false` em todas as chamadas** | Quem decide o que é sucesso é o teste. Sem isso os cenários negativos não seriam testáveis |
| **Dados gerados com Faker e nomes únicos** | O ambiente é público: nomes fixos colidiriam com dados de outras pessoas. Cada execução cria dados próprios e rastreáveis |
| **Cada teste cria e apaga os próprios dados** (`afterEach`) | Testes independentes, que rodam em qualquer ordem e não deixam lixo no ambiente compartilhado |
| **Token novo a cada teste** | O ambiente reinicia dados periodicamente; reaproveitar token entre testes aumentaria falhas intermitentes |
| **Validação de contrato sem biblioteca extra** | Checagem de tipo e formato de cada campo é suficiente para a POC e evita dependência a mais. Com mais tempo, JSON Schema (ver Próximos passos) |
| **Page Objects** (`support/pages`) | Seletores e ações em um só lugar; métodos encadeáveis deixam o teste parecido com o roteiro manual |
| **Seletores `data-test` primeiro, classes CSS como alternativa** | `data-test` existe para automação e não muda com o layout. Onde a página não oferece `data-test` estável (contador do carrinho, valores do resumo), uso a classe semântica do componente. Nunca XPath ou posição |
| **`cy.session` no login** (`cy.loginAs`) | O login pela tela é testado nos specs de login. Nos demais é só pré-condição: a sessão fica em cache e os testes ficam mais rápidos sem perder isolamento |
| **Sem `cy.wait(<tempo>)`** | Esperas fixas deixam o teste lento e instável. Uso as esperas automáticas do Cypress (asserções com retry) e timeout maior só onde há motivo (login do `performance_glitch_user`) |
| **Testes orientados a dados** (`forEach` sobre tabelas de casos) | Um cenário por caso no relatório, sem duplicar código |
| **Valores do checkout calculados a partir da tela** | Se o preço de um produto mudar, o teste continua válido; ele verifica a regra (soma, 8% de imposto, total), não um número fixo |
| **`retries: 2` só no modo `run`** | Mitiga instabilidade de ambientes públicos (Heroku). No modo interativo fica 0 para não esconder problemas durante o desenvolvimento |
| **Credenciais em `env` com valores padrão** | O enunciado exige `npm test` sem passos extras. São credenciais públicas de demonstração e podem ser sobrescritas por variável `CYPRESS_*` (padrão para segredos reais em CI) |
| **Relatório mochawesome (HTML)** | Legível por quem não é desenvolvedor, com gráfico e prints embutidos em um arquivo só |
| **GitHub Actions** | Prova de que o projeto roda do zero em máquina limpa (`npm install` + `npm test`) e guarda o relatório de cada execução |
| **TypeScript em modo `strict`** | Tipagem de requisições e respostas da API pega erros antes da execução e serve de documentação |

---

## 5. Limitações encontradas e como lidei com elas

| Limitação | Como lidei |
|---|---|
| **Restful Booker é público e compartilhado**: outras pessoas criam e apagam reservas, e os dados são reiniciados de tempos em tempos | Dados únicos por teste, validação só do que o próprio teste criou, nada de contar registros totais, limpeza no `afterEach` e retries no modo CI |
| **Heroku pode demorar no primeiro acesso** ("cold start") | `requestTimeout`/`responseTimeout` de 30s e healthcheck (`/ping`) como primeiro teste |
| **Status HTTP fora do padrão REST** no Restful Booker: login inválido devolve 200, exclusão devolve 201, recurso inexistente devolve 405 e corpo inválido devolve 500 | Os testes validam o comportamento real e o efeito que importa (ex.: nenhum token emitido; reserva não alterada). Onde o código correto seria outro, aceito os dois (`be.oneOf`) e registro o desvio como defeito nesta tabela e em comentário no teste |
| **Regras de validação de dados não documentadas** (tipos, datas) | Não automatizei para não codificar suposições como regra. Ficaram listadas na cobertura como pendentes de alinhamento |
| **Usuários do Sauce Demo com defeitos propositais** | `performance_glitch_user` foi usado no fluxo completo (comportamento previsível). Para `problem_user` escolhi um defeito determinístico e escrevi um teste de caracterização: se o defeito for corrigido, o teste falha e avisa que precisa ser atualizado |
| **`visual_user` exige comparação visual** | Fora do escopo; indicado em Próximos passos |
| **Sauce Demo responde 404 ao abrir uma página interna direto pela URL** (ex.: `/inventory.html`), embora a aplicação carregue normalmente | Visitas diretas usam `failOnStatusCode: false` e a validação é feita pelo conteúdo da tela, não pelo status HTTP |
| **Telemetria de terceiros no Sauce Demo** | Interceptada no `e2e.ts` para não gerar ruído nem lentidão. Erros de JavaScript da própria aplicação continuam falhando o teste |

### Defeitos encontrados (Restful Booker)

1. `POST /auth` com credencial inválida responde **200** com `{"reason":"Bad credentials"}`; o esperado seria **401**.
2. `DELETE /booking/{id}` responde **201 Created**; o esperado seria **200** ou **204**.
3. `PUT` e `DELETE` em reserva inexistente respondem **405**; o esperado seria **404**.
4. `POST /booking` sem campos obrigatórios responde **500**; o esperado seria **400** com mensagem de validação.

---

## 6. O que faria a seguir com mais tempo

1. **Validação de contrato com JSON Schema** (ex.: Ajv) para todas as respostas da API.
2. **Testes de caracterização para `error_user` e o restante do `problem_user`**, com tags para separar "defeitos conhecidos" da suíte de regressão.
3. **Regressão visual** para o `visual_user` (ex.: Percy ou `cypress-image-diff`).
4. **Tags e suítes** (`@smoke`, `@regression`) com `@cypress/grep`, para rodar só o essencial em cada commit e a suíte completa à noite.
5. **Execução paralela e em vários navegadores** (Chrome, Firefox, Edge) no CI, e matriz de viewports para mobile.
6. **ESLint + Prettier** com regras do plugin do Cypress e hook de pre-commit.
7. **Testes de acessibilidade** com `cypress-axe` nas telas principais.
8. **Publicar o relatório no GitHub Pages** a cada execução, com histórico.
