// Tryby budowania. Jedno źródło prawdy dla konfiguracji Astro, szablonów, nagłówków i kontroli SEO.
//
// „produkcja” — build gałęzi main w Cloudflare (i każdy build lokalny bez zmiennych poniżej).
//               Przed bramką publicznego startu (START = false) publikuje tylko stronę „Wkrótce” oraz 404 i 410;
//               pozostałe strony portalu usuwa z wyniku integracja w astro.config.mjs (src/lib/przed-startem.mjs).
// „podglad”   — build każdej innej gałęzi w Cloudflare Workers Builds (adres podglądu *.workers.dev): cały portal
//               i wszystkie treści (także szkice i fikcyjne), każda strona z noindex. Lokalnie: RH_PODGLAD=1.
// build testowy (RH_TESTOWE=1) — cały portal ze wszystkimi treściami, ale z zachowaniem produkcji (indeksowanie,
//               adresy kanoniczne, mapa strony), żeby testy E2E, axe, Lighthouse i kontrola SEO sprawdzały szablony
//               na treści. Tylko npm run check i GitHub Actions; nigdy wdrożenie (Cloudflare: błąd builda).

export const ADRES = 'https://rytmhali.pl';
export const GALAZ_PRODUKCYJNA = 'main';

/** Bramka publicznego startu (prompt, sekcja 5: 12 artykułów w 4 działach i strony zaufania). Zmiana w F8, na „wdrażaj”. */
export const START = true;

/**
 * Formularze, które działają na produkcji (F6). Zapis na newsletter wymaga konta Brevo (zmienne i sekret w Cloudflare),
 * kontakt wymaga Email Routing i wiązania POCZTA. Do tego czasu produkcja pokazuje zamiast formularza informację,
 * że ruszy wkrótce, bo formularz bez konfiguracji kończy się stroną błędu (DECYZJE.md, F8). Włączasz w tym samym
 * commicie, w którym konfiguracja trafia do wrangler.jsonc.
 */
export const FORMULARZE = { newsletter: false, kontakt: false };

/**
 * Czy pokazać formularz. Podgląd i build testowy pokazują go zawsze (próby na podglądzie, testy E2E formularzy).
 * @param {'newsletter' | 'kontakt'} rodzaj
 * @param {Record<string, string | undefined>} env
 * @param {Record<string, boolean>} formularze
 */
export function formularzAktywny(rodzaj, env = process.env, formularze = FORMULARZE) {
  return Boolean(formularze[rodzaj]) || trybBudowania(env) === 'podglad' || buildTestowy(env);
}

/** @param {Record<string, string | undefined>} env */
export function trybBudowania(env = process.env) {
  if (env.RH_PODGLAD === '1') return 'podglad';
  const galaz = env.WORKERS_CI_BRANCH;
  if (galaz && galaz !== GALAZ_PRODUKCYJNA) return 'podglad';
  return 'produkcja';
}

/** @param {Record<string, string | undefined>} env */
export function buildTestowy(env = process.env) {
  const testowy = env.RH_TESTOWE === '1';
  if (testowy && env.WORKERS_CI_BRANCH) throw new Error('RH_TESTOWE=1 służy tylko do testów i nie może trafić do builda w Cloudflare');
  return testowy;
}

/**
 * Co budujemy w danym środowisku.
 * @param {Record<string, string | undefined>} env
 * @param {boolean} start
 */
export function zakres(env = process.env, start = START) {
  const podglad = trybBudowania(env) === 'podglad';
  const testowe = buildTestowy(env);
  return {
    /** Pełny portal (wszystkie szablony); przed startem na produkcji tylko „Wkrótce”. */
    portal: podglad || testowe || start,
    /** Wszystkie treści: szkice, wpisy testowe i fikcyjne treści z src/content/testowe. */
    wszystkieTresci: podglad || testowe,
  };
}

export const TRYB = trybBudowania();
export const PODGLAD = TRYB === 'podglad';
export const TESTOWE = buildTestowy();
const ZAKRES = zakres();
export const PORTAL = ZAKRES.portal;
export const WSZYSTKIE_TRESCI = ZAKRES.wszystkieTresci;
