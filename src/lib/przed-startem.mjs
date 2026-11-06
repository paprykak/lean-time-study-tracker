// Przed bramką publicznego startu produkcja publikuje tylko stronę „Wkrótce” (prompt, sekcje 8–9: „main publikuje tylko
// stronę Wkrótce i podgląd z noindex”). Szablony portalu budują się zawsze (błąd w nich zatrzymuje build), ale ich pliki
// usuwa z dist/ integracja w astro.config.mjs. Tu jest lista tego, co zostaje.

/**
 * Pliki i katalogi, które zostają w dist/ przed startem (ścieżki względem dist/, z ukośnikami). Polityka prywatności
 * i strony newslettera zostają, bo „Wkrótce” zbiera adresy na listę oczekujących (zgoda RODO linkuje do polityki,
 * a worker z F6 przekierowuje na strony potwierdzenia i wypisu).
 */
export const ZOSTAJE_PRZED_STARTEM = [
  'index.html', '404.html', '410.html', 'polityka-prywatnosci.html', 'regulamin-newslettera.html',
  'newsletter/potwierdz.html', 'newsletter/potwierdzono.html', 'newsletter/wypisano.html', 'newsletter/blad.html',
  'robots.txt', '_headers', 'sitemap-index.xml', 'sitemap-0.xml',
  'favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'eb64e6dd8e7866eb54da8648fc099141.txt',
  '_astro/', 'admin/', 'fonty/', 'marka/',
];

// Plik klucza IndexNow (/<klucz>.txt) zostaje, żeby dało się zgłosić stronę „Wkrótce” i politykę prywatności.

/** Czy plik zostaje w wyniku builda przed startem. */
export const zostaje = (sciezka) =>
  ZOSTAJE_PRZED_STARTEM.some((z) => (z.endsWith('/') ? sciezka.startsWith(z) : sciezka === z));
