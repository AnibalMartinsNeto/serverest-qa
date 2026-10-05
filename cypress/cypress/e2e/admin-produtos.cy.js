import AdminProdutosPage from "../pages/AdminProdutosPage";
import { novoProduto } from "../support/dados";

describe("Administração de produtos @produtos", () => {
  let admin;

  beforeEach(() => {
    cy.logarComoAdmin().then((a) => (admin = a));
  });

  it("admin deve cadastrar produto e vê-lo na lista", () => {
    const produto = novoProduto();
    cy.aoFinal(() => cy.apiBuscarProdutoPorNome(produto.nome).then((p) => cy.apiExcluirProduto(admin.token, p?._id)));
    AdminProdutosPage.visitarCadastro();

    AdminProdutosPage.cadastrar(produto);

    cy.url().should("match", /\/admin\/listarprodutos$/);
    AdminProdutosPage.linha(produto.nome)
      .should("contain.text", String(produto.preco))
      .and("contain.text", produto.descricao)
      .and("contain.text", String(produto.quantidade));
  });

  it("não deve cadastrar sem os campos obrigatórios", () => {
    AdminProdutosPage.visitarCadastro();

    AdminProdutosPage.botaoCadastrar().click();

    ["Nome é obrigatório", "Preco é obrigatório", "Descricao é obrigatório", "Quantidade é obrigatório"].forEach((msg) =>
      AdminProdutosPage.alertas().should("contain.text", msg),
    );
    cy.url().should("match", /\/admin\/cadastrarprodutos$/);
  });

  it("não deve aceitar produto com nome repetido", () => {
    cy.produtoCadastrado().then((existente) => {
      AdminProdutosPage.visitarCadastro();

      AdminProdutosPage.cadastrar({ ...novoProduto(), nome: existente.nome });

      AdminProdutosPage.alertas().should("contain.text", "Já existe produto com esse nome");
    });
  });

  it("admin deve excluir produto pela lista", () => {
    cy.produtoCadastrado().then((produto) => {
      AdminProdutosPage.visitarLista();
      AdminProdutosPage.linha(produto.nome).should("be.visible");

      AdminProdutosPage.excluir(produto.nome);

      cy.contains("tr", produto.nome).should("not.exist");
      cy.apiBuscarProdutoPorNome(produto.nome).should("be.null");
    });
  });

  // Regra de negócio: o preço é um número INTEIRO (a API responde
  // "preco deve ser um inteiro"). O front barra centavos com a validação
  // nativa do navegador, sem nem chamar a API.
  it("não deve aceitar preço com centavos", () => {
    AdminProdutosPage.visitarCadastro();

    AdminProdutosPage.cadastrar({ ...novoProduto(), preco: "10.50" });

    cy.url().should("match", /\/admin\/cadastrarprodutos$/);
    AdminProdutosPage.campoPreco().should(($campo) => expect($campo[0].validity.stepMismatch).to.equal(true));
  });
});
