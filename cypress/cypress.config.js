const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Front do ServeRest (loja virtual para estudo de testes).
    baseUrl: "https://front.serverest.dev",
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      // API usada para preparar dados (ex.: garantir que o usuário existe).
      apiUrl: "https://serverest.dev",
    },
    // E-mail e senha ficam em cypress.env.json (fora do Git):
    //   { "SERVEREST_EMAIL": "...", "SERVEREST_SENHA": "..." }
    // Modelo em cypress.env.example.json.
  },
});
