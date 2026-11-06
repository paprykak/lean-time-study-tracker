import { defineConfig } from 'vitest/config';

// Testy jednostkowe czystej logiki (tokeny i kontrast, fonty, nagłówki, skrypty). Testy przeglądarkowe są w Playwright (tests/e2e).
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs', 'worker/**/*.test.mjs', 'marka/**/*.test.mjs'],
    environment: 'node',
  },
});
