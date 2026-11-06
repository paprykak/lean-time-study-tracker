// Stałe modelu treści, wspólne dla schematów kolekcji (src/content.config.ts), panelu, komponentów i testów.

export const FORMATY = ['Poradnik', 'Analiza', 'Wywiad', 'Raport', 'Wzór do pobrania', 'Komentarz'] as const;
export type Format = (typeof FORMATY)[number];

export const LICENCJE = ['CC0 1.0', 'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'Unsplash', 'Pexels', 'Własne redakcji', 'Partner (zgoda)'] as const;

/** Miejsca reklam w szablonach (F5). Format kreacji wynika z miejsca (src/lib/reklamy.ts). */
export const MIEJSCA_REKLAM = ['glowna-gora', 'glowna-bok', 'artykul-tresc', 'artykul-bok', 'dzial-gora'] as const;

/** Adresy artykułów są płaskie (/<slug>), więc slug nie może zająć adresu żadnej trasy serwisu. */
export const ZAREZERWOWANE = [
  'dzial', 'temat', 'autor', 'do-pobrania', 'pobierz', 'szukaj', 'newsletter', 'reklama', 'o-nas', 'kontakt',
  'zasady-redakcyjne', 'polityka-korekt', 'oznaczanie-reklam', 'jak-uzywamy-ai', 'polityka-prywatnosci',
  'styleguide', 'podglad', 'admin', 'api', 'okladki', 'marka', 'fonty', 'obrazy', 'rss', '404', '410', 'index',
] as const;

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
