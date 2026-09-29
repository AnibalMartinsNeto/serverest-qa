// Page Object da home do administrador (https://front.serverest.dev/admin/home).
class HomeAdminPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.titulo = page.getByRole("heading", { name: /Bem Vindo/ });
    this.botaoLogout = page.getByTestId("logout");
  }
}

module.exports = { HomeAdminPage };
