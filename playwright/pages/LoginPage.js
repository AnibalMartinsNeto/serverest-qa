// Page Object da tela de login do ServeRest (https://front.serverest.dev/login).
class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.email = page.getByTestId("email");
    this.senha = page.getByTestId("senha");
    this.botaoEntrar = page.getByTestId("entrar");
    this.mensagemDeErro = page.getByRole("alert");
  }

  async visitar() {
    await this.page.goto("/login");
  }

  async logar(email, senha) {
    await this.visitar();
    await this.email.fill(email);
    await this.senha.fill(senha);
    await this.botaoEntrar.click();
  }
}

module.exports = { LoginPage };
