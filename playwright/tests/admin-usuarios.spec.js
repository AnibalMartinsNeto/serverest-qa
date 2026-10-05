const { test, expect } = require("../support/fixtures");
const { novoUsuario } = require("../support/dados");

test.describe("Administração de usuários @usuarios", () => {
  test("admin deve cadastrar outro administrador e vê-lo na lista", async ({ paginaAdmin, api, limpeza, adminUsuariosPage }) => {
    const usuario = novoUsuario({ administrador: true });
    limpeza(async () => api.excluirUsuario((await api.buscarUsuarioPorEmail(usuario.email))?._id));
    await adminUsuariosPage.visitarCadastro();

    await adminUsuariosPage.cadastrar(usuario);

    await expect(paginaAdmin).toHaveURL(/\/admin\/listarusuarios$/);
    await expect(adminUsuariosPage.linha(usuario.email).getByRole("cell")).toContainText([usuario.nome, usuario.email]);
    await expect(adminUsuariosPage.linha(usuario.email).getByRole("cell").nth(3)).toHaveText("true");
  });

  test("admin deve excluir usuário pela lista", async ({ paginaAdmin, api, limpeza, adminUsuariosPage }) => {
    const usuario = novoUsuario();
    const id = await api.garantirUsuario(usuario);
    limpeza(() => api.excluirUsuario(id));
    await adminUsuariosPage.visitarLista();
    await expect(adminUsuariosPage.linha(usuario.email)).toBeVisible();

    await adminUsuariosPage.excluir(usuario.email);

    await expect(adminUsuariosPage.linha(usuario.email)).toHaveCount(0);
    expect(await api.buscarUsuarioPorEmail(usuario.email)).toBeUndefined();
  });

  test("não deve cadastrar sem os campos obrigatórios", async ({ paginaAdmin, adminUsuariosPage }) => {
    await adminUsuariosPage.visitarCadastro();

    await adminUsuariosPage.botaoCadastrar.click();

    await expect(adminUsuariosPage.alertas).toContainText([
      "Nome é obrigatório",
      "Email é obrigatório",
      "Password é obrigatório",
    ]);
    await expect(paginaAdmin).toHaveURL(/\/admin\/cadastrarusuarios$/);
  });

  // Segurança: a senha nunca deveria voltar da API nem aparecer na tela.
  // HOJE FALHA: a lista exibe a senha em texto puro (coluna "Senha").
  test("lista de usuários não deve exibir a senha dos usuários", async ({ paginaAdmin, api, limpeza, adminUsuariosPage }) => {
    const usuario = { ...novoUsuario(), senha: "SenhaSecreta#2026" };
    const id = await api.garantirUsuario(usuario);
    limpeza(() => api.excluirUsuario(id));
    await adminUsuariosPage.visitarLista();
    await expect(adminUsuariosPage.linha(usuario.email)).toBeVisible();

    await expect(adminUsuariosPage.linha(usuario.email)).not.toContainText(usuario.senha);
  });
});
