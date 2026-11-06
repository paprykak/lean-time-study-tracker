// Tryb budowania. Jedno źródło prawdy dla konfiguracji Astro, szablonów, nagłówków i kontroli SEO.
//
// „produkcja” — build gałęzi main w Cloudflare (i każdy build lokalny oraz w GitHub Actions, żeby testy
//               sprawdzały dokładnie to, co trafi na rytmhali.pl).
// „podglad”   — build każdej innej gałęzi w Cloudflare Workers Builds (adres podglądu *.workers.dev):
//               każda strona dostaje noindex w <meta> i w nagłówku X-Robots-Tag, żeby kopia nie trafiła do wyszukiwarek.
//               Lokalnie można go wymusić: RH_PODGLAD=1 npm run build.

export const ADRES = 'https://rytmhali.pl';
export const GALAZ_PRODUKCYJNA = 'main';

/** @param {Record<string, string | undefined>} env */
export function trybBudowania(env = process.env) {
  if (env.RH_PODGLAD === '1') return 'podglad';
  const galaz = env.WORKERS_CI_BRANCH;
  if (galaz && galaz !== GALAZ_PRODUKCYJNA) return 'podglad';
  return 'produkcja';
}

export const TRYB = trybBudowania();
export const PODGLAD = TRYB === 'podglad';
