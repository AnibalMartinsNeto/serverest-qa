// cypress/support/commands.js
// Cenários prontos (admin, usuário comum logado, produto cadastrado), a
// limpeza automática da massa de teste e o redirecionamento para a API local.
import { apiUrl } from "./api";
import { novoProduto, novoUsuario } from "./dados";

const API_PUBLICA = "https://serverest.dev";

// O front público chama sempre https://serverest.dev. Com SERVEREST_API_URL
// (ex.: http://localhost:3000, a API do compose.yaml) cada chamada é
// INTERCEPTADA e mandada para a API local: mesmo front, sem o limite de
// requisições do servidor público e com dados só nossos.
beforeEach(() => {
  if (apiUrl() !== API_PUBLICA) {
    cy.intercept({ url: `${API_PUBLICA}/**` }, (req) => {
      req.url = req.url.replace(API_PUBLICA, apiUrl());
    });
  }
});

// ---------------------------------------------------------------- limpeza

// Limpeza no fim do próprio teste não roda quando uma asserção falha, e a
// massa ficaria para trás. O afterEach roda SEMPRE, até após uma falha.
const limpezas = [];

/** Registra uma limpeza para depois do teste. Uso: cy.aoFinal(() => cy.apiExcluirUsuario(id)). */
Cypress.Commands.add("aoFinal", (tarefa) => {
  limpezas.push(tarefa);
});

afterEach(() => {
  limpezas.splice(0).reverse().forEach((tarefa) => tarefa());
});

// --------------------------------------------------------------- cenários

/** Administrador do cypress.env.json, garantido na API, com token. */
Cypress.Commands.add("garantirAdmin", () => {
  const email = Cypress.env("SERVEREST_EMAIL");
  const senha = Cypress.env("SERVEREST_SENHA");
  if (!email || !senha) throw new Error("Defina SERVEREST_EMAIL e SERVEREST_SENHA no cypress.env.json (veja cypress.env.example.json).");
  const admin = { nome: "Anibal QA", email, senha, administrador: true };
  return cy
    .apiGarantirUsuario(admin)
    .then(() => cy.apiLogin(email, senha))
    .then((token) => ({ ...admin, token }));
});

/**
 * Abre o front já autenticado: grava no localStorage o que o login da tela
 * gravaria. cy.on vale só para o teste atual (é removido no fim dele).
 */
Cypress.Commands.add("autenticar", ({ token, nome, email }) => {
  cy.on("window:before:load", (win) => {
    win.localStorage.setItem("serverest/userToken", token);
    win.localStorage.setItem("serverest/userNome", nome);
    win.localStorage.setItem("serverest/userEmail", email);
  });
});

/** Admin logado (sem passar pela tela de login). Devolve o admin com token. */
Cypress.Commands.add("logarComoAdmin", () =>
  cy.garantirAdmin().then((admin) => {
    cy.autenticar(admin);
    return cy.wrap(admin, { log: false });
  }),
);

/** Usuário comum novo, logado na página; apagado no fim do teste. */
Cypress.Commands.add("logarComoUsuarioComum", () => {
  const usuario = novoUsuario();
  return cy.apiGarantirUsuario(usuario).then((id) => {
    cy.aoFinal(() => cy.apiExcluirUsuario(id));
    return cy.apiLogin(usuario.email, usuario.senha).then((token) => {
      cy.autenticar({ ...usuario, token });
      return cy.wrap(usuario, { log: false });
    });
  });
});

/** Produto novo cadastrado pela API; apagado no fim do teste (se ainda existir). */
Cypress.Commands.add("produtoCadastrado", () => {
  const produto = novoProduto();
  return cy.garantirAdmin().then((admin) =>
    cy.apiCriarProduto(admin.token, produto).then((id) => {
      cy.aoFinal(() => cy.apiExcluirProduto(admin.token, id));
      return cy.wrap(produto, { log: false });
    }),
  );
});
