// Page Object da loja vista pelo usuário comum: vitrine (/home) e
// lista de compras (/minhaListaDeProdutos).
class LojaPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.campoPesquisa = page.getByTestId("pesquisar");
    this.botaoPesquisar = page.getByTestId("botaoPesquisar");
    this.cards = page.locator(".card");
    this.itensDaLista = page.getByTestId("shopping-cart-product-name");
    this.totalDoItem = page.getByTestId("shopping-cart-product-quantity");
    this.botaoAumentar = page.getByTestId("product-increase-quantity");
    this.botaoDiminuir = page.getByTestId("product-decrease-quantity");
    this.botaoLimparLista = page.getByTestId("limparLista");
    this.mensagemListaVazia = page.getByTestId("shopping-cart-empty-message");
  }

  async visitar() {
    await this.page.goto("/home");
  }

  async pesquisar(termo) {
    await this.campoPesquisa.fill(termo);
    await this.botaoPesquisar.click();
  }

  card(nomeProduto) {
    return this.cards.filter({ hasText: nomeProduto });
  }

  /** Clica em "Adicionar a lista"; o front leva para a lista de compras. */
  async adicionarNaLista(nomeProduto) {
    await this.card(nomeProduto).getByTestId("adicionarNaLista").click();
    await this.page.waitForURL(/minhaListaDeProdutos/);
  }
}

module.exports = { LojaPage };
