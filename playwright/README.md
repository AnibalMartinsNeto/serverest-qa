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
SERVEREST_API_URL=http://localhost:3000
```

O `playwright.config.js` carrega esse arquivo com `process.loadEnvFile()`, nativo do Node, sem biblioteca extra.

`SERVEREST_API_URL` aponta para a API local (`docker compose up -d` na raiz do `serverest-qa`). O teste abre o front público e **intercepta** as chamadas a `serverest.dev`, mandando para a API local (`page.route` em `support/fixtures.js`). Sem essa linha, tudo usa o ServeRest público, que pode responder 429 quando outras pessoas fazem carga nele.

## Executando

| Comando | O que faz |
|---|---|
| `npm test` | Suíte completa no Chromium |
| `npm run test:login` | Só o login |
| `npm run test:chrome` | Suíte completa no Google Chrome instalado |
| `npm run test:all` | Suíte completa no Chromium, Chrome e Edge |
| `npm run pw:ui` | Modo interativo (UI Mode) |
| `npm run report` | Relatório HTML da última execução |

Para rodar só um módulo, filtre pela tag do título: `npx playwright test --grep @produtos`.

## Cobertura

| Spec | Módulo | Cenários |
|---|---|---|
| `login.spec.js` | login [DEV-1] | login de admin; senha inválida |
| `cadastro-usuario.spec.js` | @usuarios | cadastro público leva à loja; campos obrigatórios; e-mail repetido |
| `admin-usuarios.spec.js` | @usuarios | admin cadastra admin; exclui pela lista; obrigatórios; **senha não pode aparecer na lista** |
| `admin-produtos.spec.js` | @produtos | cadastra e lista; obrigatórios; nome repetido; exclui; preço só inteiro |
| `loja.spec.js` | @compras | pesquisa; adiciona à lista e aumenta a quantidade; limpa a lista |

**Falha conhecida:** `lista de usuários não deve exibir a senha dos usuários` falha de propósito. A tela do admin mostra a senha de todos os usuários em texto puro, um defeito real de segurança do ServeRest. O teste fica vermelho até o defeito ser corrigido.

## Estrutura

```
tests/                  # specs por módulo (tag @modulo no describe)
pages/                  # Page Objects: Login, HomeAdmin, CadastroPublico, AdminUsuarios, AdminProdutos, Loja
support/fixtures.js     # test.extend: Page Objects, API, admin logado, usuário comum, produto, limpeza
support/api.js          # cliente da API: prepara e apaga a massa de teste
support/dados.js        # geradores de usuário e produto com nome e e-mail únicos
playwright.config.js    # baseURL, projetos por navegador, screenshot/trace em falha
```

## Decisões de projeto

- **Cenário pela API, verificação pela tela.** Usuários e produtos são criados com `POST` antes do teste, e a tela só é usada para o que o teste valida. Fica rápido e não depende de outras telas.
- **Login sem a tela de login.** As fixtures `paginaAdmin` e `usuarioComum` gravam o token no `localStorage`, como o front faria. Só o `login.spec.js` passa pelo formulário.
- **Massa única e limpeza garantida.** Nomes e e-mails levam um sufixo único, e a fixture `limpeza` apaga o que o teste criou **mesmo se ele falhar**.
- **Validar o resultado, não a mensagem passageira.** O alerta de sucesso do cadastro some no redirecionamento; o teste confere a URL, a loja e o usuário na API.
