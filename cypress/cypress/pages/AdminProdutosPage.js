// Page Object das telas de produtos do administrador:
// cadastro (/admin/cadastrarprodutos) e lista (/admin/listarprodutos).
class AdminProdutosPage {
  visitarCadastro() {
    cy.visit("/admin/cadastrarprodutos");
  }

  visitarLista() {
    cy.visit("/admin/listarprodutos");
  }

  campoPreco() {
    return cy.get('[data-testid="preco"]');
  }

  botaoCadastrar() {
    // "cadastarProdutos" (sem o R) é o data-testid real do front.
    return cy.get('[data-testid="cadastarProdutos"]');
  }

  cadastrar({ nome, preco, descricao, quantidade }) {
    cy.get('[data-testid="nome"]').type(nome);
    this.campoPreco().type(String(preco));
    cy.get('[data-testid="descricao"]').type(descricao);
    cy.get('[data-testid="quantity"]').type(String(quantidade));
    this.botaoCadastrar().click();
  }

  alertas() {
    return cy.get('[role="alert"]');
  }

  /** Linha da tabela que contém o nome (único por produto). */
  linha(nome) {
    return cy.contains("tr", nome);
  }

  excluir(nome) {
    this.linha(nome).contains("button", "Excluir").click();
  }
}

export default new AdminProdutosPage();
