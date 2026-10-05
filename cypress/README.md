# ServeRest – Testes E2E com Cypress

Automação do front do [ServeRest](https://front.serverest.dev), uma loja virtual pública feita para estudo de testes (API em [serverest.dev](https://serverest.dev)). Cobre os mesmos cenários da suíte Playwright: login, cadastro público, administração de usuários e de produtos e a lista de compras da loja (17 testes).

## Instalação

```bash
npm install
```

Crie o arquivo `cypress.env.json` (fica fora do Git) a partir do modelo `cypress.env.example.json`:

```json
{
  "SERVEREST_EMAIL": "seu-email@exemplo.com",
  "SERVEREST_SENHA": "sua-senha",
  "SERVEREST_API_URL": "http://localhost:3000"
}
```

### API local

O ServeRest público limita as requisições somando todos os usuários do mundo, e quando alguém faz teste de carga nele até o login devolve 429. Por isso os testes usam a API **local**:

```bash
docker compose up -d     # na raiz do serverest-qa (o iniciar.bat do painel-pro já sobe)
```

Com `SERVEREST_API_URL` definido, o `cy.intercept` redireciona para a API local todas as chamadas que o front faz a `https://serverest.dev`. O front é o mesmo, mas os dados ficam só na sua máquina. Sem essa variável, os testes usam o servidor público.

## Executando

| Comando | O que faz |
|---|---|
| `npm run cy:open` | Modo interativo |
| `npm test` | Todos os specs, headless (Electron) |
| `npm run test:login` | Só o login |
| `npm run test:chrome` | Todos os specs no Chrome |
| `npm run test:edge` | Todos os specs no Edge |

## Estrutura

```
cypress/
├── e2e/
│   ├── login.cy.js              # [DEV-1] login válido e senha inválida
│   ├── cadastro-usuario.cy.js   # cadastro público: sucesso, obrigatórios, e-mail repetido
│   ├── admin-usuarios.cy.js     # admin: cadastrar, excluir, obrigatórios, senha exposta (*)
│   ├── admin-produtos.cy.js     # admin: cadastrar, excluir, obrigatórios, nome repetido, centavos
│   └── loja.cy.js               # pesquisa, adicionar/aumentar e esvaziar a lista de compras
├── pages/                       # Page Objects (um por tela)
└── support/
    ├── api.js                   # cy.apiLogin, cy.apiGarantirUsuario, cy.apiCriarProduto...
    ├── commands.js              # cenários (cy.logarComoAdmin, cy.produtoCadastrado...), limpeza e intercept
    └── dados.js                 # massa única por teste (nome/e-mail/produto)
```

**Massa de teste:** o cenário é montado pela API (mais rápido e estável que pela tela) e apagado no fim. `cy.aoFinal(...)` registra a limpeza, que roda num `afterEach` mesmo quando o teste falha.

**(\*) Falha de propósito:** "lista de usuários não deve exibir a senha dos usuários" falha porque o ServeRest mostra as senhas em texto puro na lista de usuários. É um defeito real da aplicação, deixado para a triagem no painel.
