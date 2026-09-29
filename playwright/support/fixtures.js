// support/fixtures.js
// Estende o `test` do Playwright com os Page Objects e as credenciais,
// para as specs receberem tudo pronto por injeção.
const base = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { HomeAdminPage } = require("../pages/HomeAdminPage");

const API_URL = "https://serverest.dev";

const test = base.test.extend({
  credenciais: async ({}, use) => {
    const email = process.env.SERVEREST_EMAIL;
    const senha = process.env.SERVEREST_SENHA;
    if (!email || !senha) throw new Error("Defina SERVEREST_EMAIL e SERVEREST_SENHA no arquivo .env (veja .env.example).");
    await use({ email, senha });
  },
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  homeAdminPage: async ({ page }, use) => use(new HomeAdminPage(page)),
});

/**
 * Garante que o usuário administrador existe na API (a base pública pode
 * ser reiniciada). 201 = criado agora; 400 = e-mail já cadastrado.
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function garantirUsuarioAdmin(request, { email, senha }) {
  const resposta = await request.post(`${API_URL}/usuarios`, {
    data: { nome: "Anibal QA", email, password: senha, administrador: "true" },
  });
  base.expect([201, 400]).toContain(resposta.status());
}

module.exports = { test, expect: base.expect, garantirUsuarioAdmin };
