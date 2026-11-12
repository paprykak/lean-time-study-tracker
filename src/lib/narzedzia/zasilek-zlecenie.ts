// Zasiłek chorobowy zleceniobiorcy (ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854; zmiany Dz.U. 2026 poz. 26 i 1123
// nie dotyczą art. 3, 11, 48–50 i 61):
// - kto ma chorobowe: zleceniobiorca podlega mu dobrowolnie, na wniosek, gdy ma obowiązkowo emerytalne i rentowe ze
//   zlecenia (art. 11 ust. 2 ustawy o systemie ubezpieczeń społecznych, t.j. Dz.U. 2026 poz. 199); uczeń lub student do
//   26 lat nie ma ubezpieczeń ze zlecenia (art. 6 ust. 4); przy etacie u innego pracodawcy z pensją co najmniej minimalną
//   emerytalne i rentowe ze zlecenia są dobrowolne (art. 9 ust. 1 i 1a), więc chorobowego ze zlecenia nie ma (art. 11
//   ust. 2 wymaga obowiązkowych); zlecenie u własnego pracodawcy to „pracownik” (art. 8 ust. 2a): liczy się jak etat;
// - podstawa: przeciętny miesięczny przychód z 12 miesięcy kalendarzowych przed miesiącem, w którym powstała niezdolność
//   (art. 48 ust. 1), przy krótszym ubezpieczeniu z pełnych miesięcy (art. 48 ust. 2 i art. 36 ust. 2); „przychód” to
//   podstawa składki chorobowej minus 13,71% (art. 3 pkt 4); gdy niezdolność powstała przed upływem pełnego miesiąca
//   ubezpieczenia: kwota przychodu z umowy za ten miesiąc minus 13,71% (art. 49 ust. 1 pkt 2); bez minimalnej podstawy
//   (art. 45 dotyczy pracy w pełnym wymiarze, art. 48 ust. 2 do niego nie odsyła);
// - wysokość: 80% podstawy, 100% w ciąży, przy badaniach dawcy i po wypadku w drodze do pracy lub z pracy (art. 11 ust. 1–2),
//   za każdy dzień, także wolny (ust. 4), dzienna stawka 1/30 podstawy (art. 36 ust. 3 przez art. 48 ust. 2);
// - okres zasiłkowy 182 dni, 270 przy gruźlicy i w ciąży (art. 8 ust. 1); okres wyczekiwania 90 dni (art. 4 ust. 1 pkt 2);
// - wypłaca płatnik zgłaszający do ubezpieczenia chorobowego ponad 20 osób, a pozostałym ZUS (art. 61 ust. 1);
// - wypadek przy pracy lub choroba zawodowa: zasiłek z ubezpieczenia wypadkowego 100% od pierwszego dnia (art. 8–9 ustawy
//   wypadkowej, t.j. Dz.U. 2025 poz. 1644); zleceniobiorca z chorobowym — podstawa jak wyżej (art. 9 ust. 3 pkt 2), bez
//   chorobowego — z podstawy składki wypadkowej minus 11,26% (art. 9 ust. 3 pkt 3, interpretacja niżej);
// - podatek: ZUS pobiera zaliczkę 12% od zasiłku (art. 34 ust. 1 i 3 ustawy o PIT), do pełnych złotych (art. 63 § 1
//   Ordynacji podatkowej); gdy wypłaca zleceniodawca, pobór zaliczki może wyglądać inaczej.
// - art. 9 ust. 3 pkt 2 ustawy wypadkowej stosujemy do zleceniobiorców z chorobowym, pkt 3 (11,26%) do tych bez niego
//   (interpretacja; pkt 2 wymienia osoby z art. 11 ust. 2 ustawy o systemie).
// Interpretacje: podstawę i stawkę dzienną zaokrąglamy do grosza, zasiłek = stawka dzienna × dni; przychód wpisuje
// użytkownik jako średnią z pełnych miesięcy (bez miesięcy wyłączonych z art. 50: zasiłek przez ponad połowę miesiąca).
import { doGrosza } from './dodatek-nocny';

export const ODLICZENIE_CHOROBOWE = 13.71;
export const ODLICZENIE_WYPADKOWE = 11.26;
export const ZALICZKA_PIT = 12;

export type Status = 'zlecenie-chorobowe' | 'zlecenie-bez-chorobowego' | 'student' | 'etat-gdzie-indziej' | 'u-pracodawcy';
export type Przyczyna = 'choroba' | 'ciaza' | 'wypadek-w-drodze' | 'dawca' | 'wypadek-przy-pracy';

export const PRZYCZYNY: Record<Przyczyna, { nazwa: string; procent: number; podstawa: string; dni: number }> = {
  choroba: { nazwa: 'Choroba', procent: 80, podstawa: 'art. 11 ust. 1 ustawy zasiłkowej', dni: 182 },
  ciaza: { nazwa: 'Choroba w ciąży', procent: 100, podstawa: 'art. 11 ust. 2 pkt 1 ustawy zasiłkowej', dni: 270 },
  'wypadek-w-drodze': { nazwa: 'Wypadek w drodze do pracy', procent: 100, podstawa: 'art. 11 ust. 2 pkt 3 ustawy zasiłkowej', dni: 182 },
  dawca: { nazwa: 'Badania lub zabieg dawcy', procent: 100, podstawa: 'art. 11 ust. 2 pkt 2 ustawy zasiłkowej', dni: 182 },
  'wypadek-przy-pracy': { nazwa: 'Wypadek przy pracy', procent: 100, podstawa: 'art. 9 ust. 1 ustawy wypadkowej', dni: 182 },
};

export interface DaneZasilku {
  status: Status;
  przyczyna: Przyczyna;
  /** Przeciętny miesięczny przychód brutto ze zlecenia (podstawa składek), zł. */
  przychod: number;
  /** Dni L4 (kalendarzowe). */
  dni: number;
}

export function zasilekZlecenie(d: DaneZasilku) {
  const p = PRZYCZYNY[d.przyczyna];
  if (!p) throw new RangeError('Nieznana przyczyna');
  if (!(d.przychod > 0 && d.przychod < 1_000_000)) throw new RangeError('Przychód musi być dodatni');
  if (!(Number.isInteger(d.dni) && d.dni >= 1 && d.dni <= 270)) throw new RangeError('Dni L4 od 1 do 270');
  const wypadek = d.przyczyna === 'wypadek-przy-pracy';
  // Kto w ogóle ma zasiłek z tego tytułu.
  let przysluguje = d.status === 'zlecenie-chorobowe' || (wypadek && d.status === 'zlecenie-bez-chorobowego');
  const odliczenie = wypadek && d.status === 'zlecenie-bez-chorobowego' ? ODLICZENIE_WYPADKOWE : ODLICZENIE_CHOROBOWE;
  if (d.status === 'student' || d.status === 'etat-gdzie-indziej' || d.status === 'u-pracodawcy') przysluguje = false;
  const podstawa = doGrosza(d.przychod * (1 - odliczenie / 100));
  const zaDzien = doGrosza((podstawa * p.procent) / 100 / 30);
  const brutto = doGrosza(zaDzien * d.dni);
  const zaliczka = Math.round(Number(((brutto * ZALICZKA_PIT) / 100).toPrecision(12)));
  return {
    przysluguje,
    odliczenie,
    podstawa,
    procent: p.procent,
    zaDzien,
    brutto: przysluguje ? brutto : 0,
    zaliczka: przysluguje ? zaliczka : 0,
    netto: przysluguje ? doGrosza(brutto - zaliczka) : 0,
    okresZasilkowy: p.dni,
    bezWyczekiwania: wypadek || d.przyczyna === 'wypadek-w-drodze',
  };
}
