// Page Object do cadastro aberto ao público (https://front.serverest.dev/cadastrarusuarios),
// acessado pelo link "Cadastre-se" da tela de login.
class CadastroPublicoPage {
  visitar() {
    cy.visit("/cadastrarusuarios");
  }

  botaoCadastrar() {
    return cy.get('[data-testid="cadastrar"]');
  }

  cadastrar({ nome, email, senha, administrador = false }) {
    cy.get('[data-testid="nome"]').type(nome);
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="password"]').type(senha, { log: false });
    if (administrador) cy.get('[data-testid="checkbox"]').check();
    this.botaoCadastrar().click();
  }

  alertas() {
    return cy.get('[role="alert"]');
  }
}

export default new CadastroPublicoPage();
