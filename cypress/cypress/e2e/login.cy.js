import LoginPage from "../pages/LoginPage";
import HomeAdminPage from "../pages/HomeAdminPage";

describe("Login - ServeRest", () => {
  const email = Cypress.env("SERVEREST_EMAIL");
  const senha = Cypress.env("SERVEREST_SENHA");

  before(() => {
    expect(email, "SERVEREST_EMAIL definido em cypress.env.json").to.be.a("string").and.not.be.empty;
    cy.garantirUsuarioAdmin(email, senha);
  });

  it("deve logar como administrador e abrir a home do admin", () => {
    LoginPage.logar(email, senha);

    cy.url().should("include", "/admin/home");
    HomeAdminPage.titulo().should("be.visible");
    HomeAdminPage.botaoLogout().should("be.visible");
  });

  it("deve exibir erro ao logar com senha inválida", () => {
    LoginPage.logar(email, "senha-errada");

    LoginPage.mensagemDeErro().should("contain.text", "Email e/ou senha inválidos");
    cy.url().should("include", "/login");
  });
});
