import LoginPage from "../pages/LoginPage";
import HomeAdminPage from "../pages/HomeAdminPage";

describe("Login - ServeRest [DEV-1]", () => {
  let admin;

  beforeEach(() => {
    cy.garantirAdmin().then((a) => (admin = a));
  });

  it("deve logar como administrador e abrir a home do admin", () => {
    LoginPage.logar(admin.email, admin.senha);

    cy.url().should("include", "/admin/home");
    HomeAdminPage.titulo().should("be.visible");
    HomeAdminPage.botaoLogout().should("be.visible");
  });

  it("deve exibir erro ao logar com senha inválida", () => {
    LoginPage.logar(admin.email, "senha-errada");

    LoginPage.mensagemDeErro().should("contain.text", "Email e/ou senha inválidos");
    cy.url().should("include", "/login");
  });
});
