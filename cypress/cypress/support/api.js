// cypress/support/api.js
// Comandos da API do ServeRest usados para PREPARAR e LIMPAR os dados dos
// testes. Montar o cenário pela API (e não pela tela) deixa cada teste
// rápido e focado só no comportamento que ele valida.
//
// Atenção: em Cypress, se o .then() devolve undefined, o comando seguinte
// recebe o "assunto" anterior. Por isso as buscas devolvem null quando
// não encontram nada.

const API_PUBLICA = "https://serverest.dev";

/** API usada pelos testes: a local (SERVEREST_API_URL) ou a pública. */
export const apiUrl = () => (Cypress.env("SERVEREST_API_URL") || API_PUBLICA).replace(/\/$/, "");

function chamar(method, caminho, { token, body } = {}) {
  return cy
    .request({
      method,
      url: `${apiUrl()}${caminho}`,
      body,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
      log: false, // não mostra senha/token no log de comandos
    })
    .then((resposta) => {
      if (resposta.status === 429) {
        throw new Error(
          "O ServeRest respondeu 429 (limite de requisições). No servidor público o limite é somado entre todos " +
            'os usuários; rode a API local: docker compose up -d (na raiz do serverest-qa) e "SERVEREST_API_URL": ' +
            '"http://localhost:3000" no cypress.env.json.',
        );
      }
      return resposta;
    });
}

/** Faz login e devolve o token ("Bearer ..."). */
Cypress.Commands.add("apiLogin", (email, senha) =>
  chamar("POST", "/login", { body: { email, password: senha } }).then((r) => {
    if (r.status !== 200) throw new Error(`Login na API falhou (${r.status}): ${r.body.message}`);
    return r.body.authorization;
  }),
);

Cypress.Commands.add("apiBuscarUsuarioPorEmail", (email) =>
  chamar("GET", `/usuarios?email=${encodeURIComponent(email)}`).then((r) => r.body.usuarios?.[0] ?? null),
);

/** Cria o usuário; 400 ("email já usado") também é aceito. Devolve o _id. */
Cypress.Commands.add("apiGarantirUsuario", ({ nome, email, senha, administrador }) =>
  chamar("POST", "/usuarios", { body: { nome, email, password: senha, administrador: String(administrador) } })
    .then((r) => {
      if (![201, 400].includes(r.status)) throw new Error(`Não foi possível criar o usuário ${email} (${r.status})`);
    })
    .then(() => cy.apiBuscarUsuarioPorEmail(email))
    .then((usuario) => usuario?._id ?? null),
);

Cypress.Commands.add("apiExcluirUsuario", (id) => {
  if (id) chamar("DELETE", `/usuarios/${id}`);
});

/** Cadastra o produto (exige token de administrador) e devolve o _id. */
Cypress.Commands.add("apiCriarProduto", (token, { nome, preco, descricao, quantidade }) =>
  chamar("POST", "/produtos", { token, body: { nome, preco, descricao, quantidade } }).then((r) => {
    if (r.status !== 201) throw new Error(`Não foi possível criar o produto ${nome} (${r.status}): ${JSON.stringify(r.body)}`);
    return r.body._id;
  }),
);

Cypress.Commands.add("apiBuscarProdutoPorNome", (nome) =>
  chamar("GET", `/produtos?nome=${encodeURIComponent(nome)}`).then((r) => r.body.produtos?.[0] ?? null),
);

Cypress.Commands.add("apiExcluirProduto", (token, id) => {
  if (id) chamar("DELETE", `/produtos/${id}`, { token });
});
