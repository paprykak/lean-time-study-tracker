// Adresy usunięte z serwisu na stałe (2026-11-12: Rytm Hali to już tylko narzędzia i przepisy; artykuły, materiały,
// działy, tematy i strony autorów przeszły do archiwum/, archiwum/README.md). Worker odpowiada na nie 410 z treścią
// strony /410 albo 301, gdy istnieje naprawdę pasujące narzędzie. Cloudflare uruchamia worker dla tych adresów
// tylko wtedy, gdy są w assets.run_worker_first w wrangler.jsonc: test worker/usuniete.test.mjs pilnuje zgodności.

/** Dokładne adresy: 410 albo przekierowanie 301 na adres w serwisie. */
export const ADRESY = {
  // Artykuły (opublikowane 2026-11-07 i 2026-11-09). Grafik zmian: narzędzie sprawdza ten sam grafik z Kodeksem pracy.
  '/grafik-zmian-wypadki': { 301: '/narzedzia/kontrola-grafiku' },
  '/inwentaryzacja-ciagla': 410,
  '/kompletacja-droga': 410,
  '/krzywa-uczenia': 410,
  '/oee-85-procent': 410,
  '/prognozowanie-popytu': 410,
  '/smed-przezbrojenia': 410,
  '/wycieki-sprezonego-powietrza': 410,
  // Kanał RSS artykułów i lista materiałów do pobrania.
  '/rss.xml': 410,
  '/do-pobrania': 410,
};

/** Całe gałęzie adresów: wszystko pod prefiksem odpowiada 410 (działy z kanałami RSS i stronicowaniem, tematy, autorzy, materiały, pliki, okładki). */
export const PREFIKSY = ['/dzial/', '/temat/', '/autor/', '/do-pobrania/', '/pobierz/', '/okladki/'];

/** Wzorce dla assets.run_worker_first (kolejność: dokładne adresy, potem gałęzie). */
export const wzorce = () => [...Object.keys(ADRESY), ...PREFIKSY.map((p) => `${p}*`)];

/**
 * Co zrobić z adresem: null (zwykła strona), 410 albo { 301: cel }. Ignoruje końcowy ukośnik i rozszerzenie .html.
 * @param {string} sciezka
 */
export function usuniety(sciezka) {
  const s = sciezka.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  if (Object.hasOwn(ADRESY, s)) return ADRESY[s];
  return PREFIKSY.some((p) => s.startsWith(p)) ? 410 : null;
}

/**
 * Odpowiedź dla usuniętego adresu: 301 z zachowaniem zapytania albo 410 z treścią /410 (strona z noindex).
 * @param {Request} zadanie
 * @param {{ ASSETS: { fetch: (r: Request | string) => Promise<Response> } }} env
 * @param {410 | { 301: string }} decyzja
 */
export async function odpowiedzUsunietego(zadanie, env, decyzja) {
  const url = new URL(zadanie.url);
  if (decyzja !== 410) {
    return new Response(null, { status: 301, headers: { Location: `${url.origin}${decyzja[301]}${url.search}`, 'Cache-Control': 'public, max-age=86400' } });
  }
  const strona = await env.ASSETS.fetch(new Request(new URL('/410', url.origin), { method: 'GET' }));
  const naglowki = new Headers(strona.headers);
  naglowki.set('Content-Type', 'text/html; charset=utf-8');
  naglowki.set('Cache-Control', 'public, max-age=3600');
  naglowki.set('X-Robots-Tag', 'noindex');
  return new Response(zadanie.method === 'HEAD' ? null : strona.body, { status: 410, headers: naglowki });
}
