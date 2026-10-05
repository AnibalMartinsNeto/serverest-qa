# ServeRest QA

Automação de testes do [ServeRest](https://serverest.dev), uma loja virtual pública feita para estudo de testes, com três ferramentas:

| Pasta | Ferramenta | Tipo de teste | O que cobre hoje |
|---|---|---|---|
| [`cypress/`](cypress) | Cypress | E2E no navegador | Login, cadastro público, administração de usuários e produtos, lista de compras da loja (17 testes) |
| [`playwright/`](playwright) | Playwright | E2E multi-navegador | Os mesmos 17 cenários do Cypress, em Chromium, Chrome, Edge, Firefox e WebKit |
| [`k6/`](k6) | k6 | Desempenho | Login pela API (tempo de resposta, carga) e pelo navegador (tempo até a home, Web Vitals) |

- Front: https://front.serverest.dev
- API: https://serverest.dev ([documentação Swagger](https://serverest.dev))

Os testes rodam sozinhos (`npm test` em cada pasta) ou pelo [painel-pro](https://github.com/AnibalMartinsNeto/painel-pro), que executa, guarda o histórico, faz a triagem das falhas com IA e publica os bugs no Jira.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20.12+ (o Playwright lê o `.env` com `process.loadEnvFile`)
- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/): `winget install GrafanaLabs.k6`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), para a API local

## API local (recomendado)

O ServeRest público limita as requisições **somando todos os usuários**. Quando alguém faz teste de carga nele, até o login devolve 429 ("comportamento equivalente a teste de carga"). Por isso os testes usam a API do ServeRest **local**, em Docker (`compose.yaml`, porta 3000):

```bash
docker compose up -d
```

Para parar, use `docker compose down`. Isso também apaga os dados, e a base volta ao estado inicial. O `iniciar.bat` do painel-pro já sobe a API local.

Com `SERVEREST_API_URL=http://localhost:3000` na configuração de cada projeto:

- o **Cypress** e o **Playwright** continuam abrindo o front público (só arquivos estáticos, sem limite) e **interceptam** as chamadas a `serverest.dev`, mandando para a API local (`cy.intercept` / `page.route`);
- o **k6** usa a API local. Teste de carga (`-e VUS=...`) contra o servidor público é **bloqueado** pelo próprio script, porque a documentação do ServeRest pede carga só em ambiente local.

Sem essa variável, tudo usa o ServeRest público.

## Credenciais e configuração

Cada projeto lê e-mail, senha e `SERVEREST_API_URL` de um arquivo **fora do Git**. Copie o modelo e preencha:

| Projeto | Copie | Para |
|---|---|---|
| cypress | `cypress.env.example.json` | `cypress.env.json` |
| playwright | `.env.example` | `.env` |
| k6 | `.env.example` | `.env` |

Se o usuário administrador não existir na API, os testes o criam antes de rodar (`POST /usuarios`), porque a base pode ser reiniciada.

## Executando

```bash
cd cypress && npm install && npm test
cd playwright && npm install && npx playwright install chromium && npm test
cd k6 && npm test                 # login pela API
cd k6 && npm run test:browser     # login pelo navegador
```

Cada pasta tem um README com os comandos e os detalhes do projeto.

## Rastreabilidade com o Jira

Os testes ligados a uma demanda levam a chave no nome, por exemplo `describe("Login - ServeRest [DEV-1]")`. Buscando `DEV-1` na tela Jira do painel, aparecem os specs que a citam, prontos para executar.

## Falha conhecida

"Lista de usuários não deve exibir a senha dos usuários" (Cypress e Playwright) **falha de propósito**. A tela do administrador mostra a senha de todos os usuários em texto puro, um defeito real de segurança do ServeRest. O teste fica vermelho até o defeito ser corrigido.

## Padrões usados

- **Page Object Model** nos projetos de front: uma classe por tela (login, home do admin, cadastro público, usuários, produtos, loja).
- Seletores `data-testid`, expostos pelo próprio front do ServeRest para automação.
- **Cenário pela API, verificação pela tela:** usuários e produtos são criados com `POST` antes do teste. A tela só é usada para o que o teste valida.
- **Massa única e limpeza garantida:** nomes e e-mails com sufixo único, e o que o teste criou é apagado no fim, mesmo quando ele falha.
