# ServeRest – Testes E2E com Playwright

Automação do front do [ServeRest](https://front.serverest.dev), uma loja virtual pública feita para estudo de testes (API em [serverest.dev](https://serverest.dev)).

## Instalação

```bash
npm install
npx playwright install chromium
```

Crie o arquivo `.env` (fica fora do Git) a partir do modelo `.env.example`:

```
SERVEREST_EMAIL=seu-email@exemplo.com
SERVEREST_SENHA=sua-senha
```

O `playwright.config.js` carrega esse arquivo com `process.loadEnvFile()`, nativo do Node, sem biblioteca extra.

## Executando

| Comando | O que faz |
|---|---|
| `npm test` | Suíte de login no Chromium |
| `npm run test:chrome` | Suíte de login no Google Chrome instalado |
| `npm run test:all` | Todos os specs |
| `npm run pw:ui` | Modo interativo (UI Mode) |
| `npm run report` | Relatório HTML da última execução |

## Estrutura

```
tests/login.spec.js        # login válido (home do admin) e senha inválida
pages/                     # Page Objects (LoginPage, HomeAdminPage)
support/fixtures.js        # test.extend com Page Objects e credenciais + garantirUsuarioAdmin (API)
playwright.config.js       # baseURL, projetos por navegador, screenshot/trace em falha
```

Antes de cada teste, `garantirUsuarioAdmin` chama `POST /usuarios` na API. A base pública pode ser reiniciada, e assim o teste não falha por falta de dados. A resposta 201 indica que o usuário foi criado e 400 que já existia.
