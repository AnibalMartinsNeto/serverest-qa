// tests/login-navegador.js  [DEV-1]
// Login pelo FRONT, num Chromium real (módulo browser do k6): mede o tempo
// que o usuário espera do clique em "Entrar" até a home do admin aparecer,
// e coleta os Web Vitals (LCP, CLS) da página.
import { browser } from "k6/browser";
import { check } from "k6";
import { Trend } from "k6/metrics";
import { FRONT_URL, EMAIL, SENHA } from "../lib/config.js";
import { garantirUsuarioAdmin } from "../lib/usuario.js";

const tempoAteHome = new Trend("tempo_login_ate_home", true);

export const options = {
  scenarios: {
    navegador: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      options: { browser: { type: "chromium" } },
    },
  },
  thresholds: {
    checks: ["rate==1.0"],
    tempo_login_ate_home: ["p(95)<4000"],
    browser_web_vital_lcp: ["p(75)<2500"],
    browser_web_vital_cls: ["p(75)<0.1"],
  },
};

export function setup() {
  garantirUsuarioAdmin();
}

export default async function () {
  const page = await browser.newPage();
  try {
    await page.goto(`${FRONT_URL}/login`);
    await page.locator('[data-testid="email"]').fill(EMAIL);
    await page.locator('[data-testid="senha"]').fill(SENHA);

    const inicio = Date.now();
    await page.locator('[data-testid="entrar"]').click();
    await page.locator('[data-testid="logout"]').waitFor({ timeout: 15000 });
    tempoAteHome.add(Date.now() - inicio);

    const titulo = await page.locator("h1").textContent();
    check(page, {
      "navegador: abriu a home do admin": (p) => p.url().includes("/admin/home"),
    });
    check(titulo, { "navegador: título Bem Vindo": (t) => (t || "").includes("Bem Vindo") });
  } finally {
    await page.close();
  }
}
