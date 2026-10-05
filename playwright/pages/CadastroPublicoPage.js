// Page Object do cadastro aberto ao público (https://front.serverest.dev/cadastrarusuarios),
// acessado pelo link "Cadastre-se" da tela de login.
class CadastroPublicoPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.nome = page.getByTestId("nome");
    this.email = page.getByTestId("email");
    this.senha = page.getByTestId("password");
    this.administrador = page.getByTestId("checkbox");
    this.botaoCadastrar = page.getByTestId("cadastrar");
    this.alertas = page.getByRole("alert");
  }

  async visitar() {
    await this.page.goto("/cadastrarusuarios");
  }

  async cadastrar({ nome, email, senha, administrador = false }) {
    await this.nome.fill(nome);
    await this.email.fill(email);
    await this.senha.fill(senha);
    if (administrador) await this.administrador.check();
    await this.botaoCadastrar.click();
  }
}

module.exports = { CadastroPublicoPage };
