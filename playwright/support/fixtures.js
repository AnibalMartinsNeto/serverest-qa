// support/fixtures.js
// Estende o `test` do Playwright com Page Objects, credenciais, cliente da
// API e cenários prontos (admin logado, usuário comum, produto cadastrado).
// Cada fixture cria o que precisa ANTES do teste e apaga DEPOIS dele
// (o código após `use(...)` é a limpeza), mesmo quando o teste falha.
const base = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { HomeAdminPage } = require("../pages/HomeAdminPage");
const { CadastroPublicoPage } = require("../pages/CadastroPublicoPage");
const { AdminUsuariosPage } = require("../pages/AdminUsuariosPage");
const { AdminProdutosPage } = require("../pages/AdminProdutosPage");
const { LojaPage } = require("../pages/LojaPage");
const { ApiServeRest } = require("./api");
const { novoUsuario, novoProduto } = require("./dados");

// O front público chama sempre https://serverest.dev. Com SERVEREST_API_URL
// (ex.: http://localhost:3000, a API do compose.yaml) o teste INTERCEPTA essas
// chamadas e as manda para a API local: mesmo front, sem o limite de
// requisições do servidor público e com dados só nossos.
const API_PUBLICA = "https://serverest.dev";
const API_URL = (process.env.SERVEREST_API_URL || API_PUBLICA).replace(/\/$/, "");

/** Abre o front já autenticado: grava no localStorage o que o login da tela gravaria. */
async function autenticar(page, { token, nome, email }) {
  await page.addInitScript(
    ([t, n, e]) => {
      localStorage.setItem("serverest/userToken", t);
      localStorage.setItem("serverest/userNome", n);
      localStorage.setItem("serverest/userEmail", e);
    },
    [token, nome, email],
  );
}

const test = base.test.extend({
  page: async ({ page }, use) => {
    if (API_URL !== API_PUBLICA) {
      await page.route(`${API_PUBLICA}/**`, async (route) => {
        const url = route.request().url().replace(API_PUBLICA, API_URL);
        await route.fulfill({ response: await route.fetch({ url }) });
      });
    }
    await use(page);
  },

  credenciais: async ({}, use) => {
    const email = process.env.SERVEREST_EMAIL;
    const senha = process.env.SERVEREST_SENHA;
    if (!email || !senha) throw new Error("Defina SERVEREST_EMAIL e SERVEREST_SENHA no arquivo .env (veja .env.example).");
    await use({ email, senha });
  },

  api: async ({ request }, use) => use(new ApiServeRest(request, API_URL)),

  /**
   * Registra uma limpeza para rodar DEPOIS do teste, mesmo se ele falhar.
   * Uso: limpeza(() => api.excluirUsuario(id)). Limpeza no fim do próprio
   * teste não roda quando uma asserção falha, e a massa ficaria para trás.
   */
  limpeza: async ({}, use) => {
    const tarefas = [];
    await use((tarefa) => tarefas.push(tarefa));
    for (const tarefa of tarefas.reverse()) await tarefa().catch(() => {});
  },

  /** Administrador do .env, garantido na API, com token. */
  admin: async ({ api, credenciais }, use) => {
    const usuario = { nome: "Anibal QA", email: credenciais.email, senha: credenciais.senha, administrador: true };
    await api.garantirUsuario(usuario);
    await use({ ...usuario, token: await api.login(usuario.email, usuario.senha) });
  },

  /** Página já logada como administrador (sem passar pela tela de login). */
  paginaAdmin: async ({ page, admin }, use) => {
    await autenticar(page, admin);
    await use(page);
  },

  /** Usuário comum novo, logado na página; apagado no fim do teste. */
  usuarioComum: async ({ page, api }, use) => {
    const usuario = novoUsuario();
    const id = await api.garantirUsuario(usuario);
    await autenticar(page, { ...usuario, token: await api.login(usuario.email, usuario.senha) });
    await use(usuario);
    await api.excluirUsuario(id);
  },

  /** Produto novo cadastrado pela API; apagado no fim do teste (se ainda existir). */
  produtoCadastrado: async ({ api, admin }, use) => {
    const produto = novoProduto();
    const id = await api.criarProduto(admin.token, produto);
    await use(produto);
    await api.excluirProduto(admin.token, id);
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  homeAdminPage: async ({ page }, use) => use(new HomeAdminPage(page)),
  cadastroPublicoPage: async ({ page }, use) => use(new CadastroPublicoPage(page)),
  adminUsuariosPage: async ({ page }, use) => use(new AdminUsuariosPage(page)),
  adminProdutosPage: async ({ page }, use) => use(new AdminProdutosPage(page)),
  lojaPage: async ({ page }, use) => use(new LojaPage(page)),
});

/**
 * Garante que o usuário administrador existe na API (a base pode ser
 * reiniciada). 201 = criado agora; 400 = e-mail já cadastrado.
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function garantirUsuarioAdmin(request, { email, senha }) {
  await new ApiServeRest(request, API_URL).garantirUsuario({ nome: "Anibal QA", email, senha, administrador: true });
}

module.exports = { test, expect: base.expect, garantirUsuarioAdmin, API_URL };
