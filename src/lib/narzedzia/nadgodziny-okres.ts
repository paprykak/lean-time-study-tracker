// Nadgodziny średniotygodniowe w okresie rozliczeniowym i limit przeciętnie 48 godzin w tygodniu
// (Kodeks pracy, t.j. Dz.U. 2026 poz. 1245):
// - art. 129 § 1: najwyżej 8 godzin na dobę i przeciętnie 40 godzin w przeciętnie pięciodniowym tygodniu w okresie
//   rozliczeniowym do 4 miesięcy; § 2: okres można przedłużyć najwyżej do 12 miesięcy;
// - art. 130 § 1 i 2: wymiar okresu (40 h za tydzień, 8 h za pozostały dzień pon–pt, minus 8 h za święto poza niedzielą),
//   liczy go `wymiarOkresu` z czas-pracy.ts; § 3: wymiar obniża się o godziny usprawiedliwionej nieobecności, które
//   pracownik miał przepracować według rozkładu (urlop, L4);
// - art. 151 § 1: nadgodziny to praca ponad normy czasu pracy albo ponad przedłużony dobowy wymiar; § 3: 150 h w roku
//   kalendarzowym przy szczególnych potrzebach pracodawcy, § 4: inna liczba w układzie, regulaminie albo umowie;
//   § 5: przy niepełnym etacie umowa ustala liczbę godzin ponad wymiar etatu, po której przysługuje dodatek;
// - art. 151¹ § 2: dodatek 100% za każdą nadgodzinę z przekroczenia przeciętnej tygodniowej normy, chyba że przekroczenie
//   wynika z nadgodzin, za które dodatek już przysługuje (dlatego odejmujemy nadgodziny dobowe);
// - art. 131 § 1: tygodniowy czas pracy z nadgodzinami przeciętnie najwyżej 48 h w okresie; § 2: nie dotyczy
//   zarządzających zakładem pracy;
// - art. 128 § 3 pkt 2: tydzień to 7 kolejnych dni od pierwszego dnia okresu;
// - art. 151² § 1–3: czas wolny zamiast dodatku: na wniosek w tym samym wymiarze, bez wniosku o połowę więcej i najpóźniej
//   do końca okresu; wtedy dodatek nie przysługuje.
//
// Przyjęte interpretacje (decyzje redakcji):
// - Nadgodziny dobowe wpisuje użytkownik (już policzone: ponad 8 h albo ponad zaplanowany dłuższy dzień). Nadgodziny
//   średniotygodniowe: N = max(0, przepracowane − dobowe − wymiar po obniżeniu z art. 130 § 3).
// - Niepełny etat: godziny ponad wymiar etatu do wymiaru pełnego etatu to godziny ponadwymiarowe (art. 151 § 5; limitu
//   z umowy nie znamy, więc podajemy tylko liczbę godzin), a ponad wymiar pełnego etatu to nadgodziny średniotygodniowe.
//   Nieobecność z grafiku obniża wymiar etatu i, o te same godziny, próg pełnego etatu. Przepis tego wprost nie mówi;
//   to wariant korzystny dla pracownika (niższy próg nadgodzin).
// - Limit 48 h: liczba tygodni = dni kalendarzowe okresu / 7. Średnia według brzmienia art. 131 § 1: przepracowane / tygodnie.
//   Kodeks nie mówi, jak liczyć średnią przy urlopie i L4; dyrektywa 2003/88/WE (art. 16 lit. b) każe okresy płatnego
//   urlopu i zwolnień chorobowych nie włączać do średniej (komunikat Komisji 2017/C 165/01: brak pracy w tym czasie nie
//   może równoważyć tygodni z przekroczeniem), więc liczymy też średnią bez tygodni nieobecności:
//   przepracowane / (tygodnie − nieobecność / (40 h × etat)); tydzień nieobecności = tygodniowa norma etatu.
//   Przy pracy średnio ponad 40 h ten wariant jest surowszy niż dopisanie nieobecności jako godzin pracy.
//   Gdy nieobecność obejmuje cały wymiar, tygodni pracy nie ma (święta obniżają wymiar, a nie liczbę dni).
//   Limit dochowany, gdy oba warianty ≤ 48 (dokładnie 48 to jeszcze w limicie).
// - Liczby okrągłe do 0,01 h (godziny) i do grosza (kwota).
import { dniWMiesiacu, opisWymiaru, wymiarOkresu, type WymiarOkresu } from './czas-pracy';
import { doGrosza } from './dodatek-nocny';
import { godz, liczba, zl } from './format';
import { dataPoPolsku } from './terminy';
import { odmiana } from '../redakcja';

export const OKRESY = [1, 2, 3, 4, 6, 12] as const;
export const ETATY = [
  ['1', 'pełny etat'],
  ['7/8', '7/8 etatu'],
  ['3/4', '3/4 etatu'],
  ['1/2', '1/2 etatu'],
  ['1/4', '1/4 etatu'],
] as const;
/** „3/4” → 0,75; „1” → 1. */
export function ulamekEtatu(zapis: string): number {
  const [l, m] = zapis.split('/').map(Number);
  const e = m ? l / m : l;
  if (!Number.isFinite(e) || e <= 0 || e > 1) throw new RangeError(`Zły etat: ${zapis}`);
  return e;
}

export const LIMIT_TYGODNIOWY = 48;
export const LIMIT_ROCZNY = 150;

export interface DaneOkresu {
  rok: number;
  /** Pierwszy miesiąc okresu, 1–12. */
  miesiac: number;
  /** Długość okresu w miesiącach: 1, 2, 3, 4, 6 albo 12. */
  miesiecy: number;
  /** Ułamek etatu, np. 0,5. */
  etat: number;
  /** Godziny przepracowane w okresie łącznie z nadgodzinami. */
  przepracowane: number;
  /** W tym nadgodziny dobowe (już policzone). */
  dobowe: number;
  /** Godziny usprawiedliwionej nieobecności, które były do przepracowania według grafiku. */
  nieobecnosc: number;
  /** Stawka za godzinę, zł (opcjonalnie). */
  stawka?: number;
}

export interface WynikOkresu {
  /** RRRR-MM-DD: pierwszy i ostatni dzień okresu. */
  od: string;
  do: string;
  dni: number;
  tygodnie: number;
  wymiar: WymiarOkresu;
  /** Wymiar pełnego etatu (art. 130 § 1 i 2). */
  wymiarPelny: number;
  /** Wymiar etatu pracownika. */
  wymiarEtatu: number;
  /** Wymiar etatu po obniżeniu o nieobecność (art. 130 § 3). */
  wymiarPoObnizeniu: number;
  /** Próg nadgodzin średniotygodniowych: wymiar pełnego etatu minus nieobecność. */
  progNadgodzin: number;
  dobowe: number;
  /** Godziny ponad wymiar etatu do progu pełnego etatu (tylko niepełny etat, art. 151 § 5). */
  ponadwymiarowe: number;
  /** Nadgodziny średniotygodniowe, dodatek 100% (art. 151¹ § 2). */
  sredniotygodniowe: number;
  /** Ile godzin brakuje do wymiaru po obniżeniu (bez nadgodzin dobowych). */
  brakuje: number;
  /** Dodatek 100% za nadgodziny średniotygodniowe, zł; null bez stawki. */
  dodatek: number | null;
  /** Średni tygodniowy czas pracy według brzmienia art. 131 § 1. */
  sredniaKp: number;
  /** Średnia z tygodni bez nieobecności (dyrektywa 2003/88/WE, art. 16 lit. b); null, gdy cały okres to nieobecność. */
  sredniaBezNieobecnosci: number | null;
  /** Oba warianty średniej najwyżej 48 h. */
  limitDochowany: boolean;
  /** 48 h × tygodnie bez nieobecności − przepracowane, nie mniej niż 0. */
  doLimitu: number;
}

const doSetnej = (x: number) => Math.round(Number((x * 100).toPrecision(12))) / 100;
const iso = (rok: number, miesiac: number, dzien: number) => new Date(Date.UTC(rok, miesiac - 1, dzien)).toISOString().slice(0, 10);

export function nadgodzinyOkresu(d: DaneOkresu): WynikOkresu {
  if (!Number.isInteger(d.rok) || d.rok < 2000 || d.rok > 2100) throw new RangeError('Rok spoza zakresu');
  if (!Number.isInteger(d.miesiac) || d.miesiac < 1 || d.miesiac > 12) throw new RangeError('Miesiąc spoza zakresu');
  if (!(OKRESY as readonly number[]).includes(d.miesiecy)) throw new RangeError('Okres rozliczeniowy: 1, 2, 3, 4, 6 albo 12 miesięcy');
  if (!(d.etat > 0 && d.etat <= 1)) throw new RangeError('Etat od 0 do 1');
  for (const [nazwa, x] of [['przepracowane', d.przepracowane], ['dobowe', d.dobowe], ['nieobecność', d.nieobecnosc]] as const) {
    if (!Number.isFinite(x) || x < 0) throw new RangeError(`Godziny (${nazwa}): liczba nieujemna`);
  }
  if (d.stawka !== undefined && (!Number.isFinite(d.stawka) || d.stawka < 0)) throw new RangeError('Stawka: liczba nieujemna');
  if (d.dobowe > d.przepracowane) throw new RangeError('Nadgodziny dobowe nie mogą przekraczać przepracowanych godzin');

  const wymiar = wymiarOkresu(d.rok, d.miesiac, d.miesiecy);
  const ostatni = wymiar.miesiace[wymiar.miesiace.length - 1];
  const dni = wymiar.miesiace.reduce((s, m) => s + dniWMiesiacu(m.rok, m.miesiac), 0);
  if (d.przepracowane > 24 * dni) throw new RangeError(`W okresie jest ${dni} dni, czyli najwyżej ${24 * dni} godzin`);

  const wymiarPelny = wymiar.godziny;
  const wymiarEtatu = doSetnej(wymiarPelny * d.etat);
  if (d.nieobecnosc > wymiarEtatu) throw new RangeError('Nieobecność większa niż wymiar czasu pracy');
  const wymiarPoObnizeniu = doSetnej(wymiarEtatu - d.nieobecnosc);
  const progNadgodzin = doSetnej(wymiarPelny - d.nieobecnosc);

  const bezDobowych = d.przepracowane - d.dobowe;
  const ponadwymiarowe = doSetnej(Math.max(0, Math.min(bezDobowych, progNadgodzin) - wymiarPoObnizeniu));
  const sredniotygodniowe = doSetnej(Math.max(0, bezDobowych - progNadgodzin));
  const brakuje = doSetnej(Math.max(0, wymiarPoObnizeniu - bezDobowych));

  const tygodnie = dni / 7;
  // Tygodnie bez nieobecności: tydzień nieobecności to 40 h × etat z grafiku (nieobecność ≤ wymiar etatu, więc ≥ 0).
  const tygodniePracy = d.nieobecnosc >= wymiarEtatu ? 0 : Math.max(0, tygodnie - d.nieobecnosc / (40 * d.etat));
  // Porównanie bez dzielenia (dokładnie 48 h mieści się w limicie).
  const limitKp = d.przepracowane * 7 <= LIMIT_TYGODNIOWY * dni + 1e-9;
  const limitBez = d.przepracowane <= LIMIT_TYGODNIOWY * tygodniePracy + 1e-9;
  const limitDochowany = limitKp && limitBez;

  return {
    od: iso(d.rok, d.miesiac, 1),
    do: iso(ostatni.rok, ostatni.miesiac, dniWMiesiacu(ostatni.rok, ostatni.miesiac)),
    dni,
    tygodnie,
    wymiar,
    wymiarPelny,
    wymiarEtatu,
    wymiarPoObnizeniu,
    progNadgodzin,
    dobowe: d.dobowe,
    ponadwymiarowe,
    sredniotygodniowe,
    brakuje,
    dodatek: d.stawka === undefined ? null : doGrosza(sredniotygodniowe * d.stawka),
    sredniaKp: doSetnej((d.przepracowane * 7) / dni),
    sredniaBezNieobecnosci: tygodniePracy > 1e-9 ? doSetnej(d.przepracowane / tygodniePracy) : null,
    limitDochowany,
    doLimitu: doSetnej(Math.max(0, LIMIT_TYGODNIOWY * tygodniePracy - d.przepracowane)),
  };
}

/** „21 dni od poniedziałku do piątku, minus święto: 11 listopada” dla całego okresu. */
export const opisWymiaruOkresu = (w: WymiarOkresu) => opisWymiaru({ ...w, rok: w.miesiace[0].rok, miesiac: w.miesiace[0].miesiac });

/** „14 godzin”, „1 godzina”, „14,5 godziny” (ułamek: dopełniacz liczby pojedynczej). */
export const godzinySlownie = (x: number) =>
  Number.isInteger(x) ? odmiana(x, ['godzina', 'godziny', 'godzin']) : `${liczba(x)} godziny`;

/** Teksty wyniku, te same na serwerze (wartości startowe) i w przeglądarce. Klucze to atrybuty data-w na stronie. */
export function tekstyWyniku(r: WynikOkresu, etat: number, nieobecnosc: number) {
  const okres = r.od.slice(0, 7) === r.do.slice(0, 7) ? `${r.od.slice(8).replace(/^0/, '')}–${dataPoPolsku(r.do)}` : `${dataPoPolsku(r.od)} – ${dataPoPolsku(r.do)}`;
  const uwagi: string[] = [];
  if (!r.limitDochowany) {
    uwagi.push('Średnio ponad 48 godzin w tygodniu: tygodniowy czas pracy z nadgodzinami nie może przekraczać przeciętnie 48 godzin w okresie rozliczeniowym (art. 131 § 1 Kodeksu pracy). Nie dotyczy to pracowników zarządzających zakładem pracy (art. 131 § 2).');
  }
  if (etat < 1 && r.ponadwymiarowe > 0) {
    uwagi.push('Godziny ponadwymiarowe: dodatek za nie przysługuje po przekroczeniu liczby godzin ustalonej w Twojej umowie (art. 151 § 5 Kodeksu pracy). Tej liczby nie znamy, więc podajemy tylko godziny.');
  }
  return {
    glowna: godzinySlownie(r.sredniotygodniowe),
    opis: r.brakuje > 0
      ? `brakuje ${godz(r.brakuje)} do wymiaru: nadgodzin średniotygodniowych nie ma`
      : `nadgodzin średniotygodniowych w okresie ${okres}`,
    wymiar: `${godz(r.wymiarPelny)} (${opisWymiaruOkresu(r.wymiar)})`,
    etat: godz(r.wymiarEtatu),
    obnizony: nieobecnosc > 0 ? `${godz(r.wymiarPoObnizeniu)} (minus ${godz(nieobecnosc)} nieobecności)` : `${godz(r.wymiarPoObnizeniu)} (bez nieobecności)`,
    dobowe: godz(r.dobowe),
    ponadwymiarowe: godz(r.ponadwymiarowe),
    sredniotygodniowe: godz(r.sredniotygodniowe),
    dodatek: r.dodatek === null ? 'wpisz stawkę' : zl(r.dodatek),
    srednia: `${godz(r.sredniaKp)} (${r.dni} dni to ${Number.isInteger(r.tygodnie) ? odmiana(r.tygodnie, ['tydzień', 'tygodnie', 'tygodni']) : `${liczba(doSetnej(r.tygodnie))} tygodnia`})`,
    neutralna: r.sredniaBezNieobecnosci === null ? 'cały okres to nieobecność' : godz(r.sredniaBezNieobecnosci),
    limit: r.limitDochowany ? `dochowany; do limitu zostało ${godz(r.doLimitu)}` : 'przekroczony',
    stan: r.limitDochowany ? 'ok' : 'blad',
    uwaga: uwagi.join(' '),
  };
}
