// lib/config.js
// Configuração compartilhada pelos scripts k6 do ServeRest.

export const FRONT_URL = (__ENV.FRONT_URL || "https://front.serverest.dev").replace(/\/$/, "");

// O k6 não lê .env sozinho: este trecho abre o arquivo e interpreta as
// linhas CHAVE=valor. Variáveis passadas com -e (ou do ambiente) têm
// prioridade, e em CI o .env pode nem existir.
function lerEnv() {
  try {
    return Object.fromEntries(
      open("../.env")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
    );
  } catch {
    return {};
  }
}

const arquivo = lerEnv();
// API: -e API_URL > SERVEREST_API_URL do .env (a local, do compose.yaml) > a pública.
export const API_PUBLICA = "https://serverest.dev";
export const API_URL = (__ENV.API_URL || arquivo.SERVEREST_API_URL || API_PUBLICA).replace(/\/$/, "");
export const EMAIL = __ENV.SERVEREST_EMAIL || arquivo.SERVEREST_EMAIL;
export const SENHA = __ENV.SERVEREST_SENHA || arquivo.SERVEREST_SENHA;

if (!EMAIL || !SENHA) {
  throw new Error("Defina SERVEREST_EMAIL e SERVEREST_SENHA no arquivo .env (veja .env.example).");
}
