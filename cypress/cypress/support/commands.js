// cypress/support/commands.js
// Comandos customizados reutilizáveis entre as specs.

// Garante que o usuário administrador existe na API do ServeRest antes do
// teste. A base pública pode ser reiniciada; sem isto, o login falharia
// por falta de dados, e não por defeito no sistema.
// 201 = criado agora; 400 = "Este email já está sendo usado" (já existia).
Cypress.Commands.add("garantirUsuarioAdmin", (email, senha) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/usuarios`,
    body: { nome: "Anibal QA", email, password: senha, administrador: "true" },
    failOnStatusCode: false,
    log: false,
  })
    .its("status")
    .should("be.oneOf", [201, 400]);
});
