# ServeRest – Testes de desempenho com k6

Login do [ServeRest](https://front.serverest.dev) medido de dois jeitos:

| Script | Como | O que mede |
|---|---|---|
| `tests/login.js` | API (`POST https://serverest.dev/login`) | status, mensagem e token do login válido; 401 na senha inválida; p95 do tempo de resposta |
| `tests/login-navegador.js` | Chromium real (módulo browser do k6) | tempo do clique em "Entrar" até a home do admin; Web Vitals (LCP, CLS) |

## Instalação

```bash
winget install GrafanaLabs.k6
```

Crie o arquivo `.env` (fica fora do Git) a partir do `.env.example`:

```
SERVEREST_EMAIL=seu-email@exemplo.com
SERVEREST_SENHA=sua-senha
```

O k6 não lê `.env` sozinho; `lib/config.js` abre o arquivo e interpreta as linhas. Variáveis passadas com `-e` têm prioridade.

## Executando

| Comando | O que faz |
|---|---|
| `npm test` | Login pela API, smoke (1 usuário virtual, 3 iterações) |
| `npm run test:browser` | Login pelo navegador |
| `npm run test:all` | Os dois |
| `k6 run -e VUS=5 -e DURACAO=30s tests/login.js` | Carga leve no login da API |

> A API do ServeRest é pública e compartilhada. Mantenha a carga baixa.

Antes da execução, o `setup()` garante que o usuário administrador existe (`POST /usuarios`: 201 criado, 400 já existia), porque a base pública pode ser reiniciada.
