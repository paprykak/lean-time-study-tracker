// Nagłówki HTTP serwisu (plik dist/_headers dla Cloudflare Workers Assets), generowane przy każdym buildzie.
//
// CSP działa w dwóch warstwach, które przeglądarka egzekwuje jednocześnie (zasób musi spełnić obie):
// 1. <meta http-equiv="content-security-policy"> z Astro (security.csp w astro.config.mjs): default-src, script-src
//    i style-src z hashami każdego skryptu i stylu na stronie. Bez 'unsafe-inline' i bez 'unsafe-eval'.
// 2. Nagłówek poniżej: dyrektywy, których nie wolno dać w <meta> (frame-ancestors), i te, które mają chronić
//    także pliki spoza Astro (np. panel /admin). Nie ma tu script-src ani default-src, żeby nie blokować hashy z warstwy 1.

export const CSP_NAGLOWEK = ["base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'", 'upgrade-insecure-requests'].join('; ');

// Panel /admin (Sveltia CMS z unpkg.com, API GitHuba): własna polityka według dokumentacji Sveltia
// (https://sveltiacms.app/en/docs/security). Przeglądarka egzekwuje ją razem z ogólną (obie muszą przepuścić zasób).
// 'wasm-unsafe-eval' pozwala tylko na WebAssembly (konwersja zdjęć do WebP w Safari i zdjęć HEIC z telefonu),
// nie na eval(). 'unsafe-inline' tylko w style-src: panel ustawia style elementów skryptem.
export const CSP_PANELU = [
  "default-src 'none'",
  "script-src 'self' https://unpkg.com 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' https://cdn.jsdelivr.net",
  "img-src 'self' blob: data: https://*.githubusercontent.com",
  "media-src 'self' blob:",
  "frame-src blob:",
  "connect-src 'self' blob: data: https://unpkg.com https://api.github.com https://www.githubstatus.com",
  "manifest-src 'self' blob:",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export const NAGLOWKI_BEZPIECZENSTWA = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': CSP_NAGLOWEK,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
};

/**
 * @param {{ podglad: boolean }} opcje
 * @returns {string} zawartość pliku _headers
 */
export function plikNaglowkow({ podglad }) {
  const blok = (sciezka, naglowki) => [sciezka, ...Object.entries(naglowki).map(([k, v]) => `  ${k}: ${v}`)].join('\n');
  const ogolne = { ...NAGLOWKI_BEZPIECZENSTWA, ...(podglad ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}) };
  return (
    [
      '# Plik generowany przy buildzie (src/lib/naglowki.mjs). Nie edytuj w dist/.',
      blok('/*', ogolne),
      // Pliki z hashem w nazwie (skrypty, style, fonty, obrazy z astro:assets) zmieniają adres przy każdej zmianie,
      // więc mogą leżeć w pamięci podręcznej rok.
      blok('/_astro/*', { 'Cache-Control': 'public, max-age=31536000, immutable' }),
      blok('/obrazy/*', { 'Cache-Control': 'public, max-age=604800' }),
      blok('/marka/*', { 'Cache-Control': 'public, max-age=604800' }),
      blok('/styleguide', { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-cache' }),
      blok('/szukaj', { 'X-Robots-Tag': 'noindex, follow' }),
      blok('/admin/*', { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-cache', 'Content-Security-Policy': CSP_PANELU }),
    ].join('\n\n') + '\n'
  );
}
