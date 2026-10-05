// Page Object das telas de usuários do administrador:
// cadastro (/admin/cadastrarusuarios) e lista (/admin/listarusuarios).
class AdminUsuariosPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.nome = page.getByTestId("nome");
    this.email = page.getByTestId("email");
    this.senha = page.getByTestId("password");
    this.administrador = page.getByTestId("checkbox");
    this.botaoCadastrar = page.getByTestId("cadastrarUsuario");
    this.alertas = page.getByRole("alert");
    this.tituloLista = page.getByRole("heading", { name: "Lista dos usuários" });
  }

  async visitarCadastro() {
    await this.page.goto("/admin/cadastrarusuarios");
  }

  async visitarLista() {
    await this.page.goto("/admin/listarusuarios");
  }

  async cadastrar({ nome, email, senha, administrador = false }) {
    await this.nome.fill(nome);
    await this.email.fill(email);
    await this.senha.fill(senha);
    if (administrador) await this.administrador.check();
    await this.botaoCadastrar.click();
  }

  /** Linha da tabela que contém o e-mail (único por usuário). */
  linha(email) {
    return this.page.getByRole("row").filter({ hasText: email });
  }

  async excluir(email) {
    await this.linha(email).getByRole("button", { name: "Excluir" }).click();
  }
}

module.exports = { AdminUsuariosPage };
