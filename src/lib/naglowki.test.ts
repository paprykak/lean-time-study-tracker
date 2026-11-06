import { describe, expect, it } from 'vitest';
import { NAGLOWKI_BEZPIECZENSTWA, plikNaglowkow } from './naglowki.mjs';
import { trybBudowania } from './srodowisko.mjs';

// Nagłówki wymagane do oceny A w securityheaders.com (sekcja 3 promptu) i tryb podglądu bez indeksowania.
describe('nagłówki HTTP', () => {
  it('zawierają komplet nagłówków bezpieczeństwa', () => {
    expect(Object.keys(NAGLOWKI_BEZPIECZENSTWA).sort()).toEqual(
      ['Content-Security-Policy', 'Permissions-Policy', 'Referrer-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options'].sort(),
    );
    expect(NAGLOWKI_BEZPIECZENSTWA['Strict-Transport-Security']).toMatch(/max-age=(\d+)/);
    expect(Number(NAGLOWKI_BEZPIECZENSTWA['Strict-Transport-Security'].match(/max-age=(\d+)/)![1])).toBeGreaterThanOrEqual(31536000);
  });

  it('CSP w nagłówku blokuje osadzanie strony i nie ma unsafe-eval ani unsafe-inline', () => {
    const csp = NAGLOWKI_BEZPIECZENSTWA['Content-Security-Policy'];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toMatch(/unsafe-eval|unsafe-inline/);
    // script-src i default-src są w <meta> z hashami (Astro); w nagłówku zablokowałyby skrypty z hashami.
    expect(csp).not.toMatch(/script-src|default-src/);
  });

  it('produkcja: bez X-Robots-Tag dla całej strony; podgląd: noindex dla wszystkiego', () => {
    const blokOgolny = (tekst: string) => tekst.split('\n\n').find((b) => b.startsWith('/*\n'))!;
    expect(blokOgolny(plikNaglowkow({ podglad: false }))).not.toContain('X-Robots-Tag');
    expect(blokOgolny(plikNaglowkow({ podglad: true }))).toContain('X-Robots-Tag: noindex, nofollow');
  });

  it('strona wzorów i panel nigdy nie są indeksowane', () => {
    const plik = plikNaglowkow({ podglad: false });
    expect(plik).toMatch(/\/styleguide\n {2}X-Robots-Tag: noindex/);
    expect(plik).toMatch(/\/admin\/\*\n {2}X-Robots-Tag: noindex/);
  });
});

describe('tryb budowania', () => {
  it('main i build lokalny to produkcja, inne gałęzie w Cloudflare to podgląd', () => {
    expect(trybBudowania({})).toBe('produkcja');
    expect(trybBudowania({ WORKERS_CI_BRANCH: 'main' })).toBe('produkcja');
    expect(trybBudowania({ WORKERS_CI_BRANCH: 'f1-system-wizualny' })).toBe('podglad');
    expect(trybBudowania({ RH_PODGLAD: '1' })).toBe('podglad');
    // GitHub Actions buduje jak produkcja, żeby testy sprawdzały to, co trafi na rytmhali.pl.
    expect(trybBudowania({ GITHUB_REF_NAME: 'f1-system-wizualny' })).toBe('produkcja');
  });
});
