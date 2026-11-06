import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// Obraz Playwrighta w CI musi mieć tę samą wersję co @playwright/test, inaczej przeglądarki się nie znajdą.
describe('CI', () => {
  it('tag obrazu Playwrighta w workflow zgadza się z wersją @playwright/test', () => {
    const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
    const workflow = readFileSync(new URL('../../.github/workflows/kontrola.yml', import.meta.url), 'utf8');
    const wersja = pkg.devDependencies['@playwright/test'].replace(/^[\^~]/, '');
    expect(workflow).toContain(`mcr.microsoft.com/playwright:v${wersja}-`);
  });
});
