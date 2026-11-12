// Posiłki profilaktyczne i napoje w pracy.
// Przepisy:
// - art. 232 Kodeksu pracy (t.j. Dz.U. 2026 poz. 1245): pracodawca zapewnia nieodpłatnie posiłki i napoje pracownikom
//   w warunkach szczególnie uciążliwych, jeśli to niezbędne ze względów profilaktycznych;
// - rozporządzenie Rady Ministrów z 28 maja 1996 r. w sprawie profilaktycznych posiłków i napojów (Dz.U. 1996 nr 60
//   poz. 279, bez tekstu jednolitego; jedyna zmiana Dz.U. 2019 poz. 1160, od 9 lipca 2019 r., nowe brzmienie § 2 ust. 2):
//   § 1 pkt 1 jedno danie gorące; § 2 ust. 1 ok. 1000 kcal; § 2 ust. 2 inna forma (produkty, bony, talony, kupony), gdy
//   ze względu na rodzaj pracy lub organizację nie da się wydać dania gorącego; § 3 ust. 1 pkt 1 wydatek powyżej
//   2000 kcal (8374 kJ) u mężczyzn i 1100 kcal (4605 kJ) u kobiet; pkt 2 powyżej 1500 kcal (6280 kJ) / 1000 kcal
//   (4187 kJ) w pomieszczeniach zamkniętych stale poniżej 10°C ze względów technologicznych lub z WBGT powyżej 25°C;
//   pkt 3 te same niższe progi na otwartej przestrzeni w okresie zimowym (1 listopada – 31 marca); pkt 4 pod ziemią;
//   § 3 ust. 2 usuwanie skutków klęsk żywiołowych i innych zdarzeń losowych; § 4 ust. 1 pkt 1–5 i ust. 2 napoje;
//   § 5 wykaz stanowisk ustala pracodawca ze związkami albo po opinii przedstawicieli pracowników; § 6 ust. 1 w dniach
//   wykonywania prac, ust. 2 w regulaminowych przerwach, w zasadzie po 3–4 godzinach pracy; § 8 bez ekwiwalentu
//   pieniężnego;
// - art. 21 ust. 1 pkt 11 i 11b ustawy o PIT (t.j. Dz.U. 2026 poz. 592): zwolnienie świadczeń rzeczowych BHP i bonów;
// - § 2 ust. 1 pkt 6 rozporządzenia o podstawie wymiaru składek (t.j. Dz.U. 2025 poz. 316): poza podstawą składek.
//
// Interpretacje (przepis czegoś nie rozstrzyga, więc wybieramy wariant bezpieczny dla pracownika):
// 1. „Powyżej” to nierówność ostra: wartość równa progowi go nie przekracza.
// 2. kJ w nawiasach rozporządzenia są zaokrągleniem kcal × 4,1868 (kaloria międzynarodowa: 2000 → 8373,6 → 8374,
//    1100 → 4605,48 → 4605, 1500 → 6280,2 → 6280, 1000 → 4186,8 → 4187). Przepis nie mówi, która liczba rozstrzyga,
//    więc próg jest przekroczony, gdy wydatek przekracza próg w kcal ALBO próg w kJ z nawiasu (po przeliczeniu
//    bez zaokrąglania). W praktyce liczy się niższa z dwóch wartości: u kobiet 4605 kJ (1099,9 kcal), więc 1100 kcal
//    już przekracza próg; u mężczyzn przy niższym progu 6280 kJ (1499,95 kcal), więc 1500 kcal też.
// 3. Okres zimowy: 1 listopada – 31 marca, obie daty włącznie (także 29 lutego); temperatura nie ma tu znaczenia.
// 4. Próg dotyczy całej zmiany; przepis nie przewiduje proporcji dla krótszej zmiany ani niepełnego etatu.
// 5. Praca częściowo na zewnątrz w okresie zimowym: przepis nie mówi, jaka część zmiany ma być na otwartej przestrzeni,
//    więc stosujemy niższy próg z pkt 3 i zaznaczamy to w wyniku.
// 6. W § 3 ust. 1 pkt 2 nie jest jasne, czy „ze względów technologicznych” dotyczy też WBGT; WBGT powyżej 25°C
//    w pomieszczeniu zamkniętym wystarcza bez względu na przyczynę.
// 7. W § 4 ust. 1 pkt 4 „powyżej” odnosimy do obu progów (zdanie jest skrócone przy 1000 kcal u kobiet).
// 8. Wydatku nie szacujemy: bez liczby wynik „zależy” podaje próg. Progi według płci wybiera osoba licząca; bez wyboru
//    i bez liczby podajemy oba progi, a z liczbą bez wyboru zwracamy błąd danych.
// 9. Napoje § 4 ust. 1 pkt 2 (WCI powyżej 1000) nie liczymy: zwykle nikt nie zna tego wskaźnika; tylko uwaga przy
//    chłodni. Pkt 5 (pogoda powyżej 28°C) liczymy, gdy osoba zaznaczy, że temperaturę powoduje pogoda.
// 10. Okno wydania posiłku (początek zmiany + 3 do 4 godzin) to zalecenie „w zasadzie” z § 6 ust. 2, liczone przez północ.
import { dataPoPolsku, poprawnaData } from './terminy';

export const KJ_NA_KCAL = 4.1868;
export const MAKS_KCAL = 20_000;

export type Miejsce = 'hala' | 'chlodnia' | 'goraco' | 'zewnatrz' | 'mieszane' | 'podZiemia';
export type Plec = 'mezczyzn' | 'kobiet';
export type Jednostka = 'kcal' | 'kJ';
export type Prog = { kcal: number; kJ: number };

export const MIEJSCA: Record<Miejsce, string> = {
  hala: 'Hala, pomieszczenie',
  chlodnia: 'Chłodnia, mroźnia',
  goraco: 'Gorące stanowisko (WBGT > 25°C)',
  zewnatrz: 'Na zewnątrz',
  mieszane: 'Częściowo na zewnątrz',
  podZiemia: 'Pod ziemią',
};

/** § 3 ust. 1 pkt 1 (ogólny) i pkt 2–3 oraz § 4 ust. 1 pkt 4 (obniżony). */
export const PROGI: Record<'ogolny' | 'obnizony', Record<Plec, Prog>> = {
  ogolny: { mezczyzn: { kcal: 2000, kJ: 8374 }, kobiet: { kcal: 1100, kJ: 4605 } },
  obnizony: { mezczyzn: { kcal: 1500, kJ: 6280 }, kobiet: { kcal: 1000, kJ: 4187 } },
};

export const kcalNaKJ = (kcal: number) => kcal * KJ_NA_KCAL;
export const kJNaKcal = (kJ: number) => kJ / KJ_NA_KCAL;

/** Czy wydatek przekracza próg w kcal albo w kJ z nawiasu (wariant bezpieczny, interpretacja 2). */
export function przekracza(wartosc: number, jednostka: Jednostka, prog: Prog): boolean {
  const kcal = jednostka === 'kcal' ? wartosc : kJNaKcal(wartosc);
  const kJ = jednostka === 'kJ' ? wartosc : kcalNaKJ(wartosc);
  return kcal > prog.kcal || kJ > prog.kJ;
}

/** Okres zimowy z § 3 ust. 1 pkt 3: od 1 listopada do 31 marca włącznie. */
export function okresZimowy(data: string): boolean {
  if (!poprawnaData(data)) throw new RangeError('Wpisz poprawną datę zmiany.');
  const m = Number(data.slice(5, 7));
  return m >= 11 || m <= 3;
}

/** Temperatura wpisana przez człowieka, także ujemna: „-5”, „−5”, „28,5”. NaN, gdy to nie liczba. */
export function wpisanaTemperatura(tekst: string): number {
  const t = tekst.trim().replace(/\s/g, '').replace('−', '-').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : Number.NaN;
}

/** Okno wydania posiłku: początek zmiany + 3 h do + 4 h (§ 6 ust. 2), przez północ. */
export function oknoPosilku(start: string): { od: string; do: string } {
  const m = /^(\d{2}):(\d{2})$/.exec(start);
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) throw new RangeError('Wpisz godzinę początku zmiany, np. 06:00.');
  const minuty = Number(m[1]) * 60 + Number(m[2]);
  const godz = (x: number) => {
    const y = x % (24 * 60);
    return `${String(Math.floor(y / 60)).padStart(2, '0')}:${String(y % 60).padStart(2, '0')}`;
  };
  return { od: godz(minuty + 180), do: godz(minuty + 240) };
}

export type PodstawaPosilku = 'p1' | 'p2' | 'p3' | 'p4' | 'kleska';
export type PodstawaNapojow = 'n1' | 'n3' | 'n4' | 'n5';

export interface Dane {
  data: string;
  miejsce: Miejsce;
  plec: Plec | null;
  /** null: nie znam wydatku. */
  wydatek: number | null;
  jednostka: Jednostka;
  kleska: boolean;
  temp?: number | null;
  tempZPogody?: boolean;
  start?: string | null;
}

export interface Wynik {
  status: 'nalezy' | 'nieNalezy' | 'zalezy';
  powody: PodstawaPosilku[];
  /** Punkt § 3 ust. 1, którego próg wydatku ma tu zastosowanie. */
  pkt: 1 | 2 | 3;
  progi: Record<Plec, Prog>;
  zima: boolean;
  przeliczenie: { kcal: number; kJ: number } | null;
  napoje: PodstawaNapojow[];
  okno: { od: string; do: string } | null;
}

export function ocen(d: Dane): Wynik {
  const zima = okresZimowy(d.data);
  if (!(d.miejsce in MIEJSCA)) throw new RangeError('Wybierz miejsce pracy.');
  let przeliczenie: Wynik['przeliczenie'] = null;
  if (d.wydatek !== null) {
    const kcal = d.jednostka === 'kcal' ? d.wydatek : kJNaKcal(d.wydatek);
    if (!Number.isFinite(d.wydatek) || d.wydatek < 0 || kcal > MAKS_KCAL)
      throw new RangeError(`Wpisz wydatek energetyczny na zmianę jako liczbę do ${MAKS_KCAL.toLocaleString('pl-PL')} kcal albo zostaw puste.`);
    if (!d.plec) throw new RangeError('Wybierz, dla kogo liczyć progi: kobiet czy mężczyzn.');
    przeliczenie = { kcal, kJ: d.jednostka === 'kJ' ? d.wydatek : kcalNaKJ(d.wydatek) };
  }
  if (d.temp != null && !(Number.isFinite(d.temp) && d.temp >= -60 && d.temp <= 60))
    throw new RangeError('Wpisz temperaturę w °C, np. 8 albo -5, albo zostaw puste.');
  const okno = d.start ? oknoPosilku(d.start) : null;

  let pkt: Wynik['pkt'] = 1;
  if (d.miejsce === 'chlodnia' || d.miejsce === 'goraco') pkt = 2;
  else if ((d.miejsce === 'zewnatrz' || d.miejsce === 'mieszane') && zima) pkt = 3;
  const progi = pkt === 1 ? PROGI.ogolny : PROGI.obnizony;

  const powody: PodstawaPosilku[] = [];
  if (d.wydatek !== null && d.plec && przekracza(d.wydatek, d.jednostka, progi[d.plec])) powody.push(`p${pkt}`);
  if (d.miejsce === 'podZiemia') powody.push('p4');
  if (d.kleska) powody.push('kleska');
  const status = powody.length ? 'nalezy' : d.wydatek === null ? 'zalezy' : 'nieNalezy';

  const napoje: PodstawaNapojow[] = [];
  if (d.miejsce === 'goraco') napoje.push('n1');
  if ((d.miejsce === 'zewnatrz' || d.miejsce === 'mieszane') && d.temp != null && (d.temp < 10 || d.temp > 25)) napoje.push('n3');
  if (d.wydatek !== null && d.plec && przekracza(d.wydatek, d.jednostka, PROGI.obnizony[d.plec])) napoje.push('n4');
  if (d.tempZPogody && d.temp != null && d.temp > 28) napoje.push('n5');

  return { status, powody, pkt, progi, zima, przeliczenie, napoje, okno };
}

// Teksty wyniku: wspólne dla HTML z serwera i skryptu w przeglądarce (skrypt przepuszcza je przez typografia()).

const L1 = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 1 });
const l = (x: number) => L1.format(x);
const prog = (p: Prog) => `${l(p.kcal)} kcal (${l(p.kJ)} kJ)`;
const progiObu = (p: Record<Plec, Prog>, plec: Plec | null) =>
  plec ? prog(p[plec]) : `${prog(p.mezczyzn)} u mężczyzn albo ${prog(p.kobiet)} u kobiet`;

const WARUNEK: Record<Miejsce, string> = {
  hala: 'praca z wysiłkiem fizycznym',
  chlodnia: 'praca w chłodni lub mroźni, gdzie stale jest poniżej 10°C',
  goraco: 'praca w pomieszczeniu zamkniętym z WBGT powyżej 25°C',
  zewnatrz: 'praca na otwartej przestrzeni w okresie zimowym (od 1 listopada do 31 marca)',
  mieszane: 'praca na otwartej przestrzeni w okresie zimowym (od 1 listopada do 31 marca)',
  podZiemia: 'praca z wysiłkiem fizycznym',
};

export interface Teksty {
  naglowek: string;
  status: { tekst: string; rodzaj: 'w-terminie' | 'wkrotce' | 'po-terminie' };
  podstawa: string;
  przeliczenie: string;
  zima: string;
  kiedy: string;
  napoje: string;
  uwagi: string[];
}

export function opisz(w: Wynik, d: Pick<Dane, 'data' | 'miejsce' | 'plec' | 'start'>): Teksty {
  const pktOpis = `§ 3 ust. 1 pkt ${w.pkt}`;
  const warunek = w.pkt === 1 ? WARUNEK.hala : WARUNEK[d.miejsce];
  const prze = (p: PodstawaPosilku) =>
    p === 'p4'
      ? '§ 3 ust. 1 pkt 4: praca pod ziemią, bez progu wydatku'
      : p === 'kleska'
        ? '§ 3 ust. 2: usuwanie skutków klęski żywiołowej lub innego zdarzenia losowego, bez progu wydatku'
        : `${pktOpis}: ${warunek} i wydatek powyżej ${progiObu(w.progi, d.plec)}`;
  let naglowek: string;
  let status: Teksty['status'];
  let podstawa: string;
  if (w.status === 'nalezy') {
    naglowek = 'należy się';
    status = { tekst: 'Pracodawca zapewnia posiłek za darmo', rodzaj: 'w-terminie' };
    podstawa = `Podstawa: ${w.powody.map(prze).join('; ')}.`;
  } else if (w.status === 'nieNalezy') {
    naglowek = 'nie należy się';
    status = { tekst: 'Wydatek nie przekracza progu', rodzaj: 'po-terminie' };
    podstawa = `Próg z ${pktOpis} (${warunek}) to ${progiObu(w.progi, d.plec)}; wydatek musi go przekroczyć.`;
  } else {
    naglowek = 'zależy od wydatku';
    status = { tekst: 'Sprawdź wydatek energetyczny ze zmiany', rodzaj: 'wkrotce' };
    podstawa = `Posiłek należy się, jeśli wydatek na zmianę przekracza ${progiObu(w.progi, d.plec)} (${pktOpis}: ${warunek}).`;
  }
  const przeliczenie = w.przeliczenie ? `${l(w.przeliczenie.kcal)} kcal = ${l(w.przeliczenie.kJ)} kJ (1 kcal = 4,1868 kJ)` : 'nie podano wydatku';
  const kiedy = `w regulaminowej przerwie, w zasadzie po 3–4 godzinach pracy${
    w.okno ? `, przy zmianie od ${d.start} orientacyjnie ${w.okno.od}–${w.okno.do}` : ''
  } (§ 6 ust. 2); tylko w dniu wykonywania tych prac (§ 6 ust. 1)`;
  const NAPOJE: Record<PodstawaNapojow, string> = {
    n1: '§ 4 ust. 1 pkt 1: WBGT powyżej 25°C, napoje wzbogacone w sole mineralne i witaminy (§ 4 ust. 2)',
    n3: '§ 4 ust. 1 pkt 3: praca na otwartej przestrzeni przy temperaturze poniżej 10°C lub powyżej 25°C',
    n4: `§ 4 ust. 1 pkt 4: wydatek powyżej ${progiObu(PROGI.obnizony, d.plec)}`,
    n5: '§ 4 ust. 1 pkt 5: temperatura z powodu pogody powyżej 28°C',
  };
  let napoje = w.napoje.length
    ? `należą się, przez całą zmianę (§ 6 ust. 3). Podstawa: ${w.napoje.map((n) => NAPOJE[n]).join('; ')}.`
    : 'z podanych danych nie wynikają (§ 4 ust. 1).';
  if (!w.przeliczenie && !w.napoje.includes('n4'))
    napoje += ` Należą się też przy wydatku powyżej ${progiObu(PROGI.obnizony, d.plec)} (§ 4 ust. 1 pkt 4).`;
  if (d.miejsce === 'chlodnia') napoje += ' W mikroklimacie zimnym ze wskaźnikiem WCI powyżej 1000 napoje też się należą (§ 4 ust. 1 pkt 2); tego wskaźnika nie liczymy.';
  const uwagi: string[] = [];
  if (d.miejsce === 'mieszane' && w.zima)
    uwagi.push('Przepis nie mówi, jaką część zmiany trzeba pracować na zewnątrz, więc pokazujemy niższy próg z § 3 ust. 1 pkt 3.');
  if ((d.miejsce === 'zewnatrz' || d.miejsce === 'mieszane') && !w.zima)
    uwagi.push('Poza okresem zimowym (od 1 listopada do 31 marca) praca na zewnątrz ma ogólny próg z § 3 ust. 1 pkt 1.');
  return { naglowek, status, podstawa, przeliczenie, zima: sezonZimowy(d.data), kiedy, napoje, uwagi };
}

/** Okres zimowy z § 3 ust. 1 pkt 3 dla daty: „tak, od 1 listopada 2026 r. do 31 marca 2027 r.” albo „nie…”. */
export function sezonZimowy(data: string): string {
  if (!okresZimowy(data)) return 'nie (okres zimowy trwa od 1 listopada do 31 marca)';
  const r = Number(data.slice(0, 4));
  const poczatek = Number(data.slice(5, 7)) >= 11 ? r : r - 1;
  return `tak, od ${dataPoPolsku(`${poczatek}-11-01`)} do ${dataPoPolsku(`${poczatek + 1}-03-31`)}`;
}
