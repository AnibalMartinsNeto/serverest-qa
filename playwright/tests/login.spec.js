const { test, expect, garantirUsuarioAdmin } = require("../support/fixtures");

test.describe("Login - ServeRest [DEV-1]", () => {
  test.beforeEach(async ({ request, credenciais }) => {
    await garantirUsuarioAdmin(request, credenciais);
  });

  test("deve logar como administrador e abrir a home do admin", async ({ page, loginPage, homeAdminPage, credenciais }) => {
    await loginPage.logar(credenciais.email, credenciais.senha);

    await expect(page).toHaveURL(/\/admin\/home/);
    await expect(homeAdminPage.titulo).toBeVisible();
    await expect(homeAdminPage.botaoLogout).toBeVisible();
  });

  test("deve exibir erro ao logar com senha inválida", async ({ page, loginPage, credenciais }) => {
    await loginPage.logar(credenciais.email, "senha-errada");

    await expect(loginPage.mensagemDeErro).toContainText("Email e/ou senha inválidos");
    await expect(page).toHaveURL(/\/login/);
  });
});
