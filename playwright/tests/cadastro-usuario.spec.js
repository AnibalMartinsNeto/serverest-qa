const { test, expect } = require("../support/fixtures");
const { novoUsuario } = require("../support/dados");

test.describe("Cadastro público de usuário @usuarios", () => {
  test("deve cadastrar usuário comum e levar para a loja", async ({ page, api, limpeza, cadastroPublicoPage }) => {
    const usuario = novoUsuario();
    limpeza(async () => api.excluirUsuario((await api.buscarUsuarioPorEmail(usuario.email))?._id));
    await cadastroPublicoPage.visitar();

    await cadastroPublicoPage.cadastrar(usuario);

    // O alerta "Cadastro realizado com sucesso" some no redirecionamento (rápido com a
    // API local): validar o RESULTADO, que é estável, e não a mensagem passageira.
    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByRole("heading", { name: "Serverest Store" })).toBeVisible();
    const salvo = await api.buscarUsuarioPorEmail(usuario.email);
    expect(salvo).toMatchObject({ nome: usuario.nome, administrador: "false" });
  });

  test("deve exigir nome, e-mail e senha", async ({ page, cadastroPublicoPage }) => {
    await cadastroPublicoPage.visitar();

    await cadastroPublicoPage.botaoCadastrar.click();

    await expect(cadastroPublicoPage.alertas).toHaveCount(3);
    await expect(cadastroPublicoPage.alertas).toContainText([
      "Nome é obrigatório",
      "Email é obrigatório",
      "Password é obrigatório",
    ]);
    await expect(page).toHaveURL(/\/cadastrarusuarios$/);
  });

  test("não deve aceitar e-mail já cadastrado", async ({ admin, cadastroPublicoPage }) => {
    await cadastroPublicoPage.visitar();

    await cadastroPublicoPage.cadastrar({ ...novoUsuario(), email: admin.email });

    await expect(cadastroPublicoPage.alertas).toContainText("Este email já está sendo usado");
  });
});
