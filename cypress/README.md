# ServeRest – Testes E2E com Cypress

Automação do front do [ServeRest](https://front.serverest.dev), uma loja virtual pública feita para estudo de testes (API em [serverest.dev](https://serverest.dev)).

## Instalação

```bash
npm install
```

Crie o arquivo `cypress.env.json` (fica fora do Git) a partir do modelo `cypress.env.example.json`:

```json
{
  "SERVEREST_EMAIL": "seu-email@exemplo.com",
  "SERVEREST_SENHA": "sua-senha"
}
```

## Executando

| Comando | O que faz |
|---|---|
| `npm run cy:open` | Modo interativo |
| `npm test` | Suíte de login, headless |
| `npm run test:chrome` | Suíte de login no Chrome |
| `npm run test:all` | Todos os specs |

## Estrutura

```
cypress/
├── e2e/login.cy.js          # login válido (home do admin) e senha inválida
├── pages/                   # Page Objects
│   ├── LoginPage.js
│   └── HomeAdminPage.js
└── support/commands.js      # cy.garantirUsuarioAdmin: cria o usuário via API se não existir
```

Antes dos testes, `cy.garantirUsuarioAdmin` chama `POST /usuarios` na API. A base pública pode ser reiniciada, e assim o teste não falha por falta de dados. A resposta 201 indica que o usuário foi criado e 400 que já existia.
