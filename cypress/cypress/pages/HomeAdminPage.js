// Page Object da home do administrador (https://front.serverest.dev/admin/home).
class HomeAdminPage {
  titulo() {
    return cy.contains("h1", "Bem Vindo");
  }

  botaoLogout() {
    return cy.get('[data-testid="logout"]');
  }
}

export default new HomeAdminPage();
