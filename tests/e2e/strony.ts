// Lista stron do testów E2E i Lighthouse. Testy działają na buildzie testowym (RH_TESTOWE=1, npm run check):
// cały portal z fikcyjnymi kampaniami z src/content/testowe i projektami stron stałych, z zachowaniem produkcji
// (indeksowanie, kanoniczne).
// Każdy nowy szablon dopisuje tu swój adres. Adresy narzędzi idą z rejestru (src/data/narzedzia.ts), więc nowe
// narzędzie nie wymaga zmian w tym pliku; stała z adresem jest potrzebna tylko wtedy, gdy importuje ją test narzędzia.
import { NARZEDZIA, adresNarzedzia } from '../../src/data/narzedzia';

const NARZEDZIA_ADRESY = NARZEDZIA.map((n) => adresNarzedzia(n.slug));
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
export const NARZEDZIE_WOLNE = '/narzedzia/wolne-na-dziecko';
export const NARZEDZIE_PLACA = '/narzedzia/placa-minimalna';
export const NARZEDZIE_NETTO = '/narzedzia/brutto-netto';
export const NARZEDZIE_UMOWY = '/narzedzia/umowa-na-czas-okreslony';
export const NARZEDZIE_ZLECENIE = '/narzedzia/zlecenie-netto';
export const NARZEDZIE_NIEDZIELA = '/narzedzia/praca-w-niedziele';
export const NARZEDZIE_PRZESTOJ = '/narzedzia/wynagrodzenie-za-przestoj';
export const NARZEDZIE_URLOPOWE = '/narzedzia/wynagrodzenie-za-urlop';
export const NARZEDZIE_KOSZT = '/narzedzia/koszt-pracodawcy';
export const NARZEDZIE_OPIEKUNCZY = '/narzedzia/zasilek-opiekunczy';
export const NARZEDZIE_MACIERZYNSKI = '/narzedzia/zasilek-macierzynski';
export const NARZEDZIE_SANITARNE = '/narzedzia/normy-sanitarne';
export const NARZEDZIE_STAWKA = '/narzedzia/stawka-godzinowa';
export const NARZEDZIE_AGENCJA = '/narzedzia/limit-pracy-tymczasowej';
export const NARZEDZIE_WOLNE_DNI = '/narzedzia/dni-wolne-od-pracy';
export const NARZEDZIE_BEZROBOTNY = '/narzedzia/zasilek-dla-bezrobotnych';
export const NARZEDZIE_STAZ = '/narzedzia/staz-pracy';
export const NARZEDZIE_OCHRONA = '/narzedzia/ochrona-przedemerytalna';
export const NARZEDZIE_WYPADEK = '/narzedzia/odszkodowanie-za-wypadek-przy-pracy';
export const NARZEDZIE_WYPLATA = '/narzedzia/termin-wyplaty-wynagrodzenia';
export const NARZEDZIE_ODWOLANIE = '/narzedzia/odwolanie-do-sadu-pracy';
export const NARZEDZIE_OJCOWSKI = '/narzedzia/urlop-ojcowski';
export const NARZEDZIE_PPK = '/narzedzia/kalkulator-ppk';
export const NARZEDZIE_WYCHOWAWCZY = '/narzedzia/urlop-wychowawczy';
export const NARZEDZIE_WYPLATA_DODATKI = '/narzedzia/wyplata-z-nadgodzinami';
export const NARZEDZIE_OKOLICZNOSCIOWY = '/narzedzia/urlop-okolicznosciowy';
export const NARZEDZIE_REHABILITACYJNE = '/narzedzia/swiadczenie-rehabilitacyjne';
export const NARZEDZIE_PROBNY = '/narzedzia/okres-probny';
export const NARZEDZIE_KARA = '/narzedzia/kara-porzadkowa';
export const NARZEDZIE_ZAKAZ = '/narzedzia/zakaz-konkurencji';
export const NARZEDZIE_DELEGACJA = '/narzedzia/delegacja-krajowa';
export const NARZEDZIE_ODSZKODOWANIE = '/narzedzia/odszkodowanie-za-zwolnienie';
export const NARZEDZIE_POSMIERTNA = '/narzedzia/odprawa-posmiertna';
export const NARZEDZIE_ZAGRANICZNA = '/narzedzia/delegacja-zagraniczna';
export const NARZEDZIE_L4_OCHRONA = '/narzedzia/zwolnienie-na-l4';
export const NARZEDZIE_URLOP_AGENCJA = '/narzedzia/urlop-w-agencji-pracy';
export const NARZEDZIE_HALAS = '/narzedzia/halas-w-pracy';
export const NARZEDZIE_DRGANIA = '/narzedzia/drgania-w-pracy';
export const NARZEDZIE_POMIESZCZENIE = '/narzedzia/powierzchnia-na-pracownika';
export const NARZEDZIE_DYZUR = '/narzedzia/dyzur-w-pracy';
export const NARZEDZIE_L4_PO = '/narzedzia/l4-po-zwolnieniu';
export const NARZEDZIE_ROBOCZE = '/narzedzia/dni-robocze';
export const NARZEDZIE_MLODOCIANY = '/narzedzia/pracownik-mlodociany';
export const NARZEDZIE_PRZEDAWNIENIE = '/narzedzia/przedawnienie-wynagrodzenia';
export const NARZEDZIE_GRUPOWE = '/narzedzia/zwolnienia-grupowe';
export const NARZEDZIE_NIEPELNOSPRAWNY = '/narzedzia/pracownik-niepelnosprawny';
export const NARZEDZIE_LOJALKA = '/narzedzia/zwrot-kosztow-szkolenia';
export const NARZEDZIE_OKRES_ZASILKOWY = '/narzedzia/okres-zasilkowy';
export const NARZEDZIE_TRZEZWOSC = '/narzedzia/kontrola-trzezwosci';
export const NARZEDZIE_CIAZA = '/narzedzia/praca-w-ciazy';
export const NARZEDZIE_RODZIC = '/narzedzia/rodzic-w-pracy';
export const STRONY = [
  '/', '/narzedzia', ...NARZEDZIA_ADRESY, '/szukaj', '/o-nas', '/kontakt', '/polityka-prywatnosci', '/regulamin-newslettera', '/stopka-redakcyjna', '/reklama', '/newsletter', '/newsletter/potwierdz', '/newsletter/blad', '/kontakt/wyslano', '/styleguide', '/404', '/410', '/podglad/o-nas',
] as const;
export const INDEKSOWANE = [
  '/', '/narzedzia', ...NARZEDZIA_ADRESY, '/o-nas', '/zasady-redakcyjne', '/kontakt', '/reklama',
] as const;
export const NIEINDEKSOWANE = ['/styleguide', '/404', '/410', '/podglad/o-nas', '/szukaj', '/newsletter/potwierdz', '/newsletter/blad', '/kontakt/wyslano', '/kontakt/blad'] as const;
