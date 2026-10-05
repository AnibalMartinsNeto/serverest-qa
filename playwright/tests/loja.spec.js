const { test, expect } = require("../support/fixtures");

test.describe("Loja - lista de compras @compras", () => {
  test("deve encontrar o produto pela pesquisa", async ({ usuarioComum, produtoCadastrado, lojaPage }) => {
    await lojaPage.visitar();

    await lojaPage.pesquisar(produtoCadastrado.nome);

    await expect(lojaPage.cards).toHaveCount(1);
    await expect(lojaPage.cards.first()).toContainText(produtoCadastrado.nome);
    await expect(lojaPage.cards.first()).toContainText(`$ ${produtoCadastrado.preco}`);
  });

  test("deve adicionar produto à lista e aumentar a quantidade", async ({ usuarioComum, produtoCadastrado, lojaPage }) => {
    await lojaPage.visitar();
    await lojaPage.pesquisar(produtoCadastrado.nome);

    await lojaPage.adicionarNaLista(produtoCadastrado.nome);
    await expect(lojaPage.itensDaLista).toHaveCount(1);
    await expect(lojaPage.itensDaLista).toContainText(produtoCadastrado.nome);
    await expect(lojaPage.totalDoItem).toHaveText("Total: 1");

    await lojaPage.botaoAumentar.click();
    await expect(lojaPage.totalDoItem).toHaveText("Total: 2");
  });

  test("deve esvaziar a lista de compras", async ({ usuarioComum, produtoCadastrado, lojaPage }) => {
    await lojaPage.visitar();
    await lojaPage.pesquisar(produtoCadastrado.nome);
    await lojaPage.adicionarNaLista(produtoCadastrado.nome);

    await lojaPage.botaoLimparLista.click();

    await expect(lojaPage.itensDaLista).toHaveCount(0);
    await expect(lojaPage.mensagemListaVazia).toHaveText("Seu carrinho está vazio");
  });
});
