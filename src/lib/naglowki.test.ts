import { describe, expect, it } from 'vitest';
import { NAGLOWKI_BEZPIECZENSTWA, plikNaglowkow } from './naglowki.mjs';

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

describe('panel /admin', () => {
  it('ma własną CSP: skrypt tylko z unpkg.com, połączenia tylko z GitHubem, bez eval', async () => {
    const { CSP_PANELU } = await import('./naglowki.mjs');
    const dyrektywa = (nazwa: string) => CSP_PANELU.split('; ').find((d) => d.startsWith(`${nazwa} `));
    expect(dyrektywa('default-src')).toBe("default-src 'none'");
    expect(dyrektywa('script-src')).toBe("script-src 'self' https://unpkg.com 'wasm-unsafe-eval'");
    expect(CSP_PANELU).not.toMatch(/'unsafe-eval'|script-src[^;]*'unsafe-inline'/);
    expect(dyrektywa('connect-src')).toContain('https://api.github.com');
    expect(dyrektywa('frame-ancestors')).toBe("frame-ancestors 'none'");
    expect(plikNaglowkow({ podglad: false })).toContain(`  Content-Security-Policy: ${CSP_PANELU}`);
  });
});
