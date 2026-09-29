// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// Carrega o .env (fora do Git) com SERVEREST_EMAIL e SERVEREST_SENHA.
// process.loadEnvFile é nativo do Node (20.12+): não precisa de dotenv.
try {
  process.loadEnvFile();
} catch {
  // Sem .env: as variáveis podem vir do próprio ambiente (ex.: CI).
}

const viewport = { width: 1280, height: 720 };

// Um projeto por navegador. Os scripts do package.json sempre passam
// --project=..., senão o Playwright rodaria a suíte em todos eles.
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "https://front.serverest.dev",
    viewport,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    // O front do ServeRest usa data-testid, o atributo padrão do getByTestId.
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport } },
    { name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport } },
    { name: "msedge", use: { ...devices["Desktop Edge"], channel: "msedge", viewport } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport } },
  ],
});
