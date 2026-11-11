// Lista stron do testów E2E i Lighthouse. Testy działają na buildzie testowym (RH_TESTOWE=1, npm run check):
// cały portal z fikcyjnymi treściami z src/content/testowe, z zachowaniem produkcji (indeksowanie, kanoniczne).
// Każdy nowy szablon dopisuje tu swój adres.
export const ARTYKUL = '/testowy-mikroprzestoje';
export const NARZEDZIE = '/narzedzia/dodatek-za-prace-w-nocy';
export const NARZEDZIE_BHP = '/narzedzia/szkolenie-okresowe-bhp';
export const NARZEDZIE_UDT = '/narzedzia/waznosc-uprawnien-udt';
export const NARZEDZIE_KG = '/narzedzia/ile-kg-wolno-dzwigac';
export const NARZEDZIE_TEMP = '/narzedzia/temperatura-w-pracy';
export const NARZEDZIE_WYMIAR = '/narzedzia/wymiar-czasu-pracy';
export const NARZEDZIE_NADGODZINY = '/narzedzia/kalkulator-nadgodzin';
export const NARZEDZIE_URLOP = '/narzedzia/kalkulator-urlopu';
export const NARZEDZIE_GRAFIK = '/narzedzia/kontrola-grafiku';
export const NARZEDZIE_WYPOWIEDZENIE = '/narzedzia/okres-wypowiedzenia';
export const NARZEDZIE_PRZERWY = '/narzedzia/przerwy-w-pracy';
export const NARZEDZIE_BADANIA_UDT = '/narzedzia/badania-udt';
export const NARZEDZIE_EKWIWALENT = '/narzedzia/ekwiwalent-za-urlop';
export const NARZEDZIE_L4 = '/narzedzia/kalkulator-l4';
export const NARZEDZIE_ODPRAWA = '/narzedzia/kalkulator-odprawy';
export const STRONY = [
  '/', ARTYKUL, '/narzedzia', NARZEDZIE, NARZEDZIE_BHP, NARZEDZIE_UDT, NARZEDZIE_KG, NARZEDZIE_TEMP, NARZEDZIE_WYMIAR, NARZEDZIE_NADGODZINY, NARZEDZIE_URLOP, NARZEDZIE_GRAFIK, NARZEDZIE_WYPOWIEDZENIE, NARZEDZIE_PRZERWY, NARZEDZIE_BADANIA_UDT, NARZEDZIE_EKWIWALENT, NARZEDZIE_L4, NARZEDZIE_ODPRAWA, '/dzial/produkcja', '/dzial/produkcja/2', '/temat/oee', '/autor/redakcja', '/do-pobrania', '/do-pobrania/testowy-karta-obserwacji',
  '/szukaj', '/o-nas', '/kontakt', '/polityka-prywatnosci', '/regulamin-newslettera', '/stopka-redakcyjna', '/reklama', '/newsletter', '/newsletter/potwierdz', '/newsletter/blad', '/kontakt/wyslano', '/styleguide', '/404', '/410',
] as const;
export const INDEKSOWANE = ['/', ARTYKUL, '/narzedzia', NARZEDZIE, NARZEDZIE_BHP, NARZEDZIE_UDT, NARZEDZIE_KG, NARZEDZIE_TEMP, NARZEDZIE_WYMIAR, NARZEDZIE_NADGODZINY, NARZEDZIE_URLOP, NARZEDZIE_GRAFIK, NARZEDZIE_WYPOWIEDZENIE, NARZEDZIE_PRZERWY, NARZEDZIE_BADANIA_UDT, NARZEDZIE_EKWIWALENT, NARZEDZIE_L4, NARZEDZIE_ODPRAWA, '/dzial/produkcja', '/temat/oee', '/do-pobrania'] as const;
export const NIEINDEKSOWANE = ['/styleguide', '/404', '/410', '/szukaj', '/newsletter/potwierdz', '/newsletter/blad', '/kontakt/wyslano', '/kontakt/blad'] as const;
