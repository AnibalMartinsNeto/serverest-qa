// Page Object das telas de produtos do administrador:
// cadastro (/admin/cadastrarprodutos) e lista (/admin/listarprodutos).
class AdminProdutosPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.nome = page.getByTestId("nome");
    this.preco = page.getByTestId("preco");
    this.descricao = page.getByTestId("descricao");
    this.quantidade = page.getByTestId("quantity");
    // "cadastarProdutos" (sem o R) é o data-testid real do front.
    this.botaoCadastrar = page.getByTestId("cadastarProdutos");
    this.alertas = page.getByRole("alert");
    this.tituloLista = page.getByRole("heading", { name: "Lista dos Produtos" });
  }

  async visitarCadastro() {
    await this.page.goto("/admin/cadastrarprodutos");
  }

  async visitarLista() {
    await this.page.goto("/admin/listarprodutos");
  }

  async cadastrar({ nome, preco, descricao, quantidade }) {
    await this.nome.fill(nome);
    await this.preco.fill(String(preco));
    await this.descricao.fill(descricao);
    await this.quantidade.fill(String(quantidade));
    await this.botaoCadastrar.click();
  }

  /** Linha da tabela que contém o nome (único por produto). */
  linha(nome) {
    return this.page.getByRole("row").filter({ hasText: nome });
  }

  async excluir(nome) {
    await this.linha(nome).getByRole("button", { name: "Excluir" }).click();
  }
}

module.exports = { AdminProdutosPage };
