import { defineConfig, devices } from '@playwright/test';

// Testy E2E na zbudowanej stronie (astro preview). Trzy środowiska: komputer, Android (Pixel 7) i iPhone (WebKit).
// WebKit lokalnie wymaga bibliotek systemowych; bez nich: BEZ_WEBKIT=1 npm run check (iPhone sprawdza GitHub Actions).
// Kontrola produkcji po wdrożeniu: BASE_URL=https://rytmhali.pl npx playwright test (bez lokalnego serwera).
const PORT = 4322;
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // Testy głównie czekają (przerwa 400 ms we wzorcu błędów, nawigacja „Wstecz”), a nie liczą: przy 4 rdzeniach 4 wątki
  // skróciły E2E z 12,8 do 7,2 min bez niestabilnych testów (2026-11-14). Domyślne 50% rdzeni marnowało połowę maszyny.
  workers: '100%',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: BASE_URL ?? `http://localhost:${PORT}`,
    locale: 'pl-PL',
    timezoneId: 'Europe/Warsaw',
    trace: 'off',
  },
  projects: [
    { name: 'komputer', use: { ...devices['Desktop Chrome'] } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    ...(process.env.BEZ_WEBKIT ? [] : [{ name: 'iphone', use: { ...devices['iPhone 14'] } }]),
  ],
  webServer: BASE_URL
    ? undefined
    : {
        command: `npx astro preview --port ${PORT} --ignore-lock`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
