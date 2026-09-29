// Page Object da tela de login do ServeRest (https://front.serverest.dev/login).
// Os seletores usam data-testid, que o front expõe justamente para testes.
class LoginPage {
  visitar() {
    cy.visit("/login");
  }

  preencherEmail(email) {
    cy.get('[data-testid="email"]').clear().type(email);
  }

  preencherSenha(senha) {
    // log: false — a senha não aparece no log de comandos do Cypress.
    cy.get('[data-testid="senha"]').clear().type(senha, { log: false });
  }

  entrar() {
    cy.get('[data-testid="entrar"]').click();
  }

  logar(email, senha) {
    this.visitar();
    this.preencherEmail(email);
    this.preencherSenha(senha);
    this.entrar();
  }

  mensagemDeErro() {
    return cy.get('[role="alert"]');
  }
}

export default new LoginPage();
