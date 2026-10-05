import CadastroPublicoPage from "../pages/CadastroPublicoPage";
import { novoUsuario } from "../support/dados";

describe("Cadastro público de usuário @usuarios", () => {
  it("deve cadastrar usuário comum e levar para a loja", () => {
    const usuario = novoUsuario();
    cy.aoFinal(() => cy.apiBuscarUsuarioPorEmail(usuario.email).then((u) => cy.apiExcluirUsuario(u?._id)));
    CadastroPublicoPage.visitar();

    CadastroPublicoPage.cadastrar(usuario);

    // O alerta "Cadastro realizado com sucesso" some no redirecionamento (rápido com a
    // API local): validar o RESULTADO, que é estável, e não a mensagem passageira.
    cy.url().should("match", /\/home$/);
    cy.contains("h1", "Serverest Store").should("be.visible");
    cy.apiBuscarUsuarioPorEmail(usuario.email).should("deep.include", { nome: usuario.nome, administrador: "false" });
  });

  it("deve exigir nome, e-mail e senha", () => {
    CadastroPublicoPage.visitar();

    CadastroPublicoPage.botaoCadastrar().click();

    CadastroPublicoPage.alertas().should("have.length", 3);
    ["Nome é obrigatório", "Email é obrigatório", "Password é obrigatório"].forEach((msg) =>
      CadastroPublicoPage.alertas().should("contain.text", msg),
    );
    cy.url().should("match", /\/cadastrarusuarios$/);
  });

  it("não deve aceitar e-mail já cadastrado", () => {
    cy.garantirAdmin().then((admin) => {
      CadastroPublicoPage.visitar();

      CadastroPublicoPage.cadastrar({ ...novoUsuario(), email: admin.email });

      CadastroPublicoPage.alertas().should("contain.text", "Este email já está sendo usado");
    });
  });
});
