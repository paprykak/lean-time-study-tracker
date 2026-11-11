// Lista stron do testów E2E i Lighthouse. Testy działają na buildzie testowym (RH_TESTOWE=1, npm run check):
// cały portal z fikcyjnymi treściami z src/content/testowe, z zachowaniem produkcji (indeksowanie, kanoniczne).
// Każdy nowy szablon dopisuje tu swój adres.
export const ARTYKUL = '/testowy-mikroprzestoje';
export const NARZEDZIE = '/narzedzia/dodatek-za-prace-w-nocy';
export const STRONY = [
  '/', ARTYKUL, '/narzedzia', NARZEDZIE, '/dzial/produkcja', '/dzial/produkcja/2', '/temat/oee', '/autor/redakcja', '/do-pobrania', '/do-pobrania/testowy-karta-obserwacji',
  '/szukaj', '/o-nas', '/kontakt', '/polityka-prywatnosci', '/regulamin-newslettera', '/stopka-redakcyjna', '/reklama', '/newsletter', '/newsletter/potwierdz', '/newsletter/blad', '/kontakt/wyslano', '/styleguide', '/404', '/410',
] as const;
export const INDEKSOWANE = ['/', ARTYKUL, '/narzedzia', NARZEDZIE, '/dzial/produkcja', '/temat/oee', '/do-pobrania'] as const;
export const NIEINDEKSOWANE = ['/styleguide', '/404', '/410', '/szukaj', '/newsletter/potwierdz', '/newsletter/blad', '/kontakt/wyslano', '/kontakt/blad'] as const;
