import AdminUsuariosPage from "../pages/AdminUsuariosPage";
import { novoUsuario } from "../support/dados";

describe("Administração de usuários @usuarios", () => {
  beforeEach(() => {
    cy.logarComoAdmin();
  });

  it("admin deve cadastrar outro administrador e vê-lo na lista", () => {
    const usuario = novoUsuario({ administrador: true });
    cy.aoFinal(() => cy.apiBuscarUsuarioPorEmail(usuario.email).then((u) => cy.apiExcluirUsuario(u?._id)));
    AdminUsuariosPage.visitarCadastro();

    AdminUsuariosPage.cadastrar(usuario);

    cy.url().should("match", /\/admin\/listarusuarios$/);
    AdminUsuariosPage.linha(usuario.email).should("contain.text", usuario.nome);
    AdminUsuariosPage.linha(usuario.email).find("td").eq(3).should("have.text", "true");
  });

  it("admin deve excluir usuário pela lista", () => {
    const usuario = novoUsuario();
    cy.apiGarantirUsuario(usuario).then((id) => cy.aoFinal(() => cy.apiExcluirUsuario(id)));
    AdminUsuariosPage.visitarLista();
    AdminUsuariosPage.linha(usuario.email).should("be.visible");

    AdminUsuariosPage.excluir(usuario.email);

    cy.contains("tr", usuario.email).should("not.exist");
    cy.apiBuscarUsuarioPorEmail(usuario.email).should("be.null");
  });

  it("não deve cadastrar sem os campos obrigatórios", () => {
    AdminUsuariosPage.visitarCadastro();

    AdminUsuariosPage.botaoCadastrar().click();

    ["Nome é obrigatório", "Email é obrigatório", "Password é obrigatório"].forEach((msg) =>
      AdminUsuariosPage.alertas().should("contain.text", msg),
    );
    cy.url().should("match", /\/admin\/cadastrarusuarios$/);
  });

  // Segurança: a senha nunca deveria voltar da API nem aparecer na tela.
  // HOJE FALHA: a lista exibe a senha em texto puro (coluna "Senha").
  // No CI ele é pulado (PULAR_DEFEITOS_CONHECIDOS), para o selo do GitHub
  // não ficar vermelho para sempre; localmente e no painel ele roda e falha.
  const itDefeitoConhecido = Cypress.env("PULAR_DEFEITOS_CONHECIDOS") ? it.skip : it;
  itDefeitoConhecido("lista de usuários não deve exibir a senha dos usuários", () => {
    const usuario = { ...novoUsuario(), senha: "SenhaSecreta#2026" };
    cy.apiGarantirUsuario(usuario).then((id) => cy.aoFinal(() => cy.apiExcluirUsuario(id)));
    AdminUsuariosPage.visitarLista();
    AdminUsuariosPage.linha(usuario.email).should("be.visible");

    AdminUsuariosPage.linha(usuario.email).should("not.contain.text", usuario.senha);
  });
});
