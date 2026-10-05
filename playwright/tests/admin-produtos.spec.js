const { test, expect } = require("../support/fixtures");
const { novoProduto } = require("../support/dados");

test.describe("Administração de produtos @produtos", () => {
  test("admin deve cadastrar produto e vê-lo na lista", async ({ paginaAdmin, api, admin, limpeza, adminProdutosPage }) => {
    const produto = novoProduto();
    limpeza(async () => api.excluirProduto(admin.token, (await api.buscarProdutoPorNome(produto.nome))?._id));
    await adminProdutosPage.visitarCadastro();

    await adminProdutosPage.cadastrar(produto);

    await expect(paginaAdmin).toHaveURL(/\/admin\/listarprodutos$/);
    await expect(adminProdutosPage.linha(produto.nome).getByRole("cell")).toContainText([
      produto.nome,
      String(produto.preco),
      produto.descricao,
      String(produto.quantidade),
    ]);
  });

  test("não deve cadastrar sem os campos obrigatórios", async ({ paginaAdmin, adminProdutosPage }) => {
    await adminProdutosPage.visitarCadastro();

    await adminProdutosPage.botaoCadastrar.click();

    await expect(adminProdutosPage.alertas).toContainText([
      "Nome é obrigatório",
      "Preco é obrigatório",
      "Descricao é obrigatório",
      "Quantidade é obrigatório",
    ]);
    await expect(paginaAdmin).toHaveURL(/\/admin\/cadastrarprodutos$/);
  });

  test("não deve aceitar produto com nome repetido", async ({ paginaAdmin, produtoCadastrado, adminProdutosPage }) => {
    await adminProdutosPage.visitarCadastro();

    await adminProdutosPage.cadastrar({ ...novoProduto(), nome: produtoCadastrado.nome });

    await expect(adminProdutosPage.alertas).toContainText("Já existe produto com esse nome");
  });

  test("admin deve excluir produto pela lista", async ({ paginaAdmin, api, produtoCadastrado, adminProdutosPage }) => {
    await adminProdutosPage.visitarLista();
    await expect(adminProdutosPage.linha(produtoCadastrado.nome)).toBeVisible();

    await adminProdutosPage.excluir(produtoCadastrado.nome);

    await expect(adminProdutosPage.linha(produtoCadastrado.nome)).toHaveCount(0);
    expect(await api.buscarProdutoPorNome(produtoCadastrado.nome)).toBeUndefined();
  });

  // Regra de negócio: o preço é um número INTEIRO (a API responde
  // "preco deve ser um inteiro"). O front barra centavos com a validação
  // nativa do navegador, sem nem chamar a API.
  test("não deve aceitar preço com centavos", async ({ paginaAdmin, adminProdutosPage }) => {
    await adminProdutosPage.visitarCadastro();

    await adminProdutosPage.cadastrar({ ...novoProduto(), preco: "10.50" });

    await expect(paginaAdmin).toHaveURL(/\/admin\/cadastrarprodutos$/);
    expect(await adminProdutosPage.preco.evaluate((campo) => campo.validity.stepMismatch)).toBe(true);
  });
});
