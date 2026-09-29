# ServeRest QA

Automação de testes do [ServeRest](https://serverest.dev), uma loja virtual pública feita para estudo de testes, com três ferramentas:

| Pasta | Ferramenta | Tipo de teste | O que cobre hoje |
|---|---|---|---|
| [`cypress/`](cypress) | Cypress | E2E no navegador | Login válido (home do admin) e senha inválida |
| [`playwright/`](playwright) | Playwright | E2E multi-navegador | Login válido (home do admin) e senha inválida |
| [`k6/`](k6) | k6 | Desempenho | Login pela API (tempo de resposta, carga) e pelo navegador (tempo até a home, Web Vitals) |

- Front: https://front.serverest.dev
- API: https://serverest.dev ([documentação Swagger](https://serverest.dev))

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/): `winget install GrafanaLabs.k6`

## Credenciais

Cada projeto lê e-mail e senha de um arquivo **fora do Git**. Copie o modelo e preencha:

| Projeto | Copie | Para |
|---|---|---|
| cypress | `cypress.env.example.json` | `cypress.env.json` |
| playwright | `.env.example` | `.env` |
| k6 | `.env.example` | `.env` |

Se o usuário não existir na API, os testes o criam antes de rodar (`POST /usuarios`), porque a base pública pode ser reiniciada.

## Executando

```bash
cd cypress && npm install && npm test
cd playwright && npm install && npx playwright install chromium && npm test
cd k6 && npm test                 # login pela API
cd k6 && npm run test:browser     # login pelo navegador
```

Cada pasta tem um README com os detalhes do projeto.

## Padrões usados

- **Page Object Model** nos projetos de front (`LoginPage`, `HomeAdminPage`).
- Seletores `data-testid`, expostos pelo próprio front do ServeRest para automação.
- Preparação de dados pela API antes do teste de interface, para evitar falsos negativos.
