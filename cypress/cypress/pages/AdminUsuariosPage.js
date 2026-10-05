// Page Object das telas de usuários do administrador:
// cadastro (/admin/cadastrarusuarios) e lista (/admin/listarusuarios).
class AdminUsuariosPage {
  visitarCadastro() {
    cy.visit("/admin/cadastrarusuarios");
  }

  visitarLista() {
    cy.visit("/admin/listarusuarios");
  }

  botaoCadastrar() {
    return cy.get('[data-testid="cadastrarUsuario"]');
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

  /** Linha da tabela que contém o e-mail (único por usuário). */
  linha(email) {
    return cy.contains("tr", email);
  }

  excluir(email) {
    this.linha(email).contains("button", "Excluir").click();
  }
}

export default new AdminUsuariosPage();
