// Page Object da loja vista pelo usuário comum: vitrine (/home) e
// lista de compras (/minhaListaDeProdutos).
class LojaPage {
  visitar() {
    cy.visit("/home");
  }

  pesquisar(termo) {
    cy.get('[data-testid="pesquisar"]').type(termo);
    cy.get('[data-testid="botaoPesquisar"]').click();
  }

  cards() {
    return cy.get(".card");
  }

  card(nomeProduto) {
    return cy.contains(".card", nomeProduto);
  }

  /** Clica em "Adicionar a lista"; o front leva para a lista de compras. */
  adicionarNaLista(nomeProduto) {
    this.card(nomeProduto).find('[data-testid="adicionarNaLista"]').click();
    cy.url().should("include", "minhaListaDeProdutos");
  }

  itensDaLista() {
    return cy.get('[data-testid="shopping-cart-product-name"]');
  }

  totalDoItem() {
    return cy.get('[data-testid="shopping-cart-product-quantity"]');
  }

  botaoAumentar() {
    return cy.get('[data-testid="product-increase-quantity"]');
  }

  botaoLimparLista() {
    return cy.get('[data-testid="limparLista"]');
  }

  mensagemListaVazia() {
    return cy.get('[data-testid="shopping-cart-empty-message"]');
  }
}

export default new LojaPage();
