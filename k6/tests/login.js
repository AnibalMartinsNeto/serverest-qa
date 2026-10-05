// tests/login.js  [DEV-1]
// Login pela API do ServeRest (POST /login): sucesso e senha inválida.
//
// Padrão: SMOKE (1 usuário virtual, 3 iterações). Para carga leve:
//   k6 run -e VUS=5 -e DURACAO=30s tests/login.js
// A API é pública e compartilhada: mantenha a carga baixa.
import http from "k6/http";
import { check, group, sleep } from "k6";
import { API_PUBLICA, API_URL, EMAIL, SENHA } from "../lib/config.js";
import { garantirUsuarioAdmin } from "../lib/usuario.js";

const carga = __ENV.VUS ? { vus: Number(__ENV.VUS), duration: __ENV.DURACAO || "30s" } : { vus: 1, iterations: 3 };

// O ServeRest PEDE que teste de carga rode só na API local (docker compose up -d):
// no servidor público o limite é somado entre todos os usuários, e a carga
// derruba o estudo de outras pessoas (é o 429 "comportamento de teste de carga").
if (__ENV.VUS && API_URL === API_PUBLICA) {
  throw new Error("Teste de carga só na API local: defina SERVEREST_API_URL=http://localhost:3000 no .env.");
}

export const options = {
  ...carga,
  thresholds: {
    // Só o login com sucesso conta para o tempo de resposta.
    "http_req_duration{name:POST /login (válido)}": ["p(95)<1500"],
    checks: ["rate>0.99"],
  },
};

export function setup() {
  garantirUsuarioAdmin();
}

function login(senha, nome) {
  return http.post(`${API_URL}/login`, JSON.stringify({ email: EMAIL, password: senha }), {
    headers: { "Content-Type": "application/json" },
    tags: { name: nome },
    // 401 é o esperado na senha inválida: não conta como erro HTTP.
    responseCallback: http.expectedStatuses(200, 401),
  });
}

export default function () {
  group("Login válido", () => {
    const res = login(SENHA, "POST /login (válido)");
    check(res, {
      "login: status 200": (r) => r.status === 200,
      "login: mensagem de sucesso": (r) => r.json("message") === "Login realizado com sucesso",
      "login: devolve token Bearer": (r) => String(r.json("authorization") || "").startsWith("Bearer "),
    });
  });

  group("Senha inválida", () => {
    const res = login("senha-errada", "POST /login (inválido)");
    check(res, {
      "senha inválida: status 401": (r) => r.status === 401,
      "senha inválida: mensagem de erro": (r) => r.json("message") === "Email e/ou senha inválidos",
    });
  });

  sleep(1);
}
