# ServeRest – Testes de desempenho com k6

Login do [ServeRest](https://front.serverest.dev) medido de dois jeitos. Os dois scripts levam a chave da demanda `[DEV-1]` no cabeçalho, então aparecem na busca por demanda do painel.

| Script | Como | O que mede |
|---|---|---|
| `tests/login.js` | API (`POST /login`) | status, mensagem e token do login válido; 401 na senha inválida; p95 do tempo de resposta < 1,5 s |
| `tests/login-navegador.js` | Chromium real (módulo browser do k6) no front público | tempo do clique em "Entrar" até a home do admin (< 4 s); Web Vitals (LCP < 2,5 s, CLS < 0,1) |

## Instalação

```bash
winget install GrafanaLabs.k6
```

Crie o arquivo `.env` (fica fora do Git) a partir do `.env.example`:

```
SERVEREST_EMAIL=seu-email@exemplo.com
SERVEREST_SENHA=sua-senha
SERVEREST_API_URL=http://localhost:3000
```

O k6 não lê `.env` sozinho: `lib/config.js` abre o arquivo e interpreta as linhas. Variáveis passadas com `-e` têm prioridade.

### Qual API é usada

Ordem de prioridade: `-e API_URL=...`, depois `SERVEREST_API_URL` do `.env`, depois o ServeRest público.

Use a **API local** (`docker compose up -d` na raiz do `serverest-qa`). O servidor público limita as requisições somando todos os usuários e devolve 429 quando há carga. Por isso, **teste de carga (`-e VUS=...`) contra o servidor público é bloqueado** pelo próprio script: a documentação do ServeRest pede carga só em ambiente local.

## Executando

| Comando | O que faz |
|---|---|
| `npm test` | Login pela API, smoke (1 usuário virtual, 3 iterações) |
| `npm run test:browser` | Login pelo navegador |
| `npm run test:all` | Os dois |
| `k6 run -e VUS=5 -e DURACAO=30s tests/login.js` | Carga leve no login da API (só com a API local) |

Antes da execução, o `setup()` garante que o usuário administrador existe (`POST /usuarios`: 201 criado, 400 já existia), porque a base pode ser reiniciada.

## Estrutura

```
tests/login.js            # login pela API: checks + thresholds
tests/login-navegador.js  # login pelo navegador: tempo até a home + Web Vitals
lib/config.js             # lê o .env e define API_URL, FRONT_URL, e-mail e senha
lib/usuario.js            # garante o usuário admin no setup()
```
