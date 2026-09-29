// lib/usuario.js
import http from "k6/http";
import { check } from "k6";
import { API_URL, EMAIL, SENHA } from "./config.js";

/**
 * Garante que o usuário administrador existe (a base pública pode ser
 * reiniciada). Usado no setup(), que roda UMA vez antes da carga.
 * 201 = criado agora; 400 = e-mail já cadastrado.
 */
export function garantirUsuarioAdmin() {
  const res = http.post(
    `${API_URL}/usuarios`,
    JSON.stringify({ nome: "Anibal QA", email: EMAIL, password: SENHA, administrador: "true" }),
    { headers: { "Content-Type": "application/json" }, tags: { name: "setup: garantir usuário" } },
  );
  check(res, { "setup: usuário existe (201 ou 400)": (r) => r.status === 201 || r.status === 400 });
}
