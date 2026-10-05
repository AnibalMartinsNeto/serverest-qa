const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Front do ServeRest (loja virtual para estudo de testes).
    baseUrl: "https://front.serverest.dev",
    viewportWidth: 1280,
    viewportHeight: 720,
    // Mesmos limites do Playwright: 10s para cada asserção/comando.
    defaultCommandTimeout: 10000,
    // E-mail, senha e SERVEREST_API_URL ficam em cypress.env.json (fora do Git).
    // Modelo em cypress.env.example.json. Sem SERVEREST_API_URL, usa o ServeRest público.
  },
});
