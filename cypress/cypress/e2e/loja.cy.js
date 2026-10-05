import LojaPage from "../pages/LojaPage";

describe("Loja - lista de compras @compras", () => {
  let produto;

  beforeEach(() => {
    cy.logarComoUsuarioComum();
    cy.produtoCadastrado().then((p) => (produto = p));
  });

  it("deve encontrar o produto pela pesquisa", () => {
    LojaPage.visitar();

    LojaPage.pesquisar(produto.nome);

    LojaPage.cards().should("have.length", 1);
    LojaPage.cards().first().should("contain.text", produto.nome).and("contain.text", `$ ${produto.preco}`);
  });

  it("deve adicionar produto à lista e aumentar a quantidade", () => {
    LojaPage.visitar();
    LojaPage.pesquisar(produto.nome);

    LojaPage.adicionarNaLista(produto.nome);
    LojaPage.itensDaLista().should("have.length", 1).and("contain.text", produto.nome);
    LojaPage.totalDoItem().should("have.text", "Total: 1");

    LojaPage.botaoAumentar().click();
    LojaPage.totalDoItem().should("have.text", "Total: 2");
  });

  it("deve esvaziar a lista de compras", () => {
    LojaPage.visitar();
    LojaPage.pesquisar(produto.nome);
    LojaPage.adicionarNaLista(produto.nome);

    LojaPage.botaoLimparLista().click();

    LojaPage.itensDaLista().should("have.length", 0);
    LojaPage.mensagemListaVazia().should("have.text", "Seu carrinho está vazio");
  });
});
