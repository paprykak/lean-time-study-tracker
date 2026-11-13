// Renta z tytułu niezdolności do pracy: warunki stażu i okresu powstania niezdolności (ustawa o emeryturach i rentach
// z FUS, tekst jednolity Dz.U. 2025 poz. 1749; tekst ujednolicony Kancelarii Sejmu ze stanem na 16 października 2026 r.
// nie zmienia art. 5, 6, 7, 12, 24, 27–28, 57–58; art. 13 ust. 6 i art. 14 ust. 1 zmieniają się od 1 stycznia 2027 r.,
// Dz.U. 2026 poz. 26, ale orzeka nadal lekarz orzecznik ZUS):
// - art. 57 ust. 1: niezdolność do pracy (art. 12), wymagany okres składkowy i nieskładkowy, powstanie niezdolności
//   w okresach ubezpieczeń emerytalnego i rentowych albo okresach z listy (m.in. wynagrodzenie i zasiłek za czas choroby,
//   świadczenie rehabilitacyjne, świadczenie pielęgnacyjne) albo nie później niż 18 miesięcy od ich ustania, brak prawa
//   do emerytury z FUS i niespełnianie warunków do niej (ocenia ZUS przy decyzji, więc sprawdzamy wiek w dniu
//   powstania niezdolności i dziś);
// - art. 57 ust. 2: warunku 18 miesięcy nie stosuje się przy całkowitej niezdolności i stażu 20 lat (kobiety) albo 25 lat
//   (mężczyźni); art. 57a: przy wypadku w drodze do pracy lub z pracy staż nie jest wymagany;
// - art. 58 ust. 1: 1 rok przed ukończeniem 20 lat, 2 lata „w wieku powyżej 20 do 22 lat”, 3 lata „powyżej 22 do 25”,
//   4 lata „powyżej 25 do 30”, 5 lat „powyżej 30 lat”; ust. 2: 5 lat w ostatnich 10 latach przed wnioskiem albo przed
//   powstaniem niezdolności; ust. 3: zgłoszenie do ubezpieczenia przed 18 lat albo do 6 miesięcy po szkole i okresy bez
//   przerw dłuższych niż 6 miesięcy; ust. 4: bez warunku 10 lat przy całkowitej niezdolności i 25/30 latach okresów
//   składkowych (bez nieskładkowych);
// - art. 5 ust. 2: okresy nieskładkowe najwyżej w jednej trzeciej okresów składkowych;
// - art. 24 ust. 1: urodzonym po 1948 r. emerytura przysługuje po osiągnięciu 60/65 lat; art. 27–28: urodzonym przed
//   1949 r. w tym wieku przy stażu co najmniej 15/20 lat (wtedy renta z FUS nie przysługuje, art. 57 ust. 1 pkt 4);
// - ustawa wypadkowa (Dz.U. 2025 poz. 1644), art. 17 ust. 1–2: renta z tytułu wypadku przy pracy lub choroby zawodowej
//   niezależnie od długości ubezpieczenia wypadkowego i daty powstania niezdolności, bez art. 57 ust. 1 pkt 4; art. 21:
//   wyłączenia (umyślne lub rażąco niedbałe naruszenie przepisów, nietrzeźwość); art. 18: co najmniej 80% albo 60%.
// Interpretacja: przepis nie mówi, czy „w wieku powyżej 22 do 25 lat” liczyć dokładnie (od dnia po 22. urodzinach),
// czy w pełnych latach (od 23. urodzin). Wymagany staż pokazujemy dla liczenia dokładnego, ale gdy przy liczeniu
// w pełnych latach wystarczy krótszy, a staż mieści się między nimi, pokazujemy „zależy” (wariant bezpieczny dla
// pracownika: nie odradzamy wniosku). W dniu 20. urodzin wymagamy 2 lat (to już nie „przed ukończeniem 20 lat”), a w dniu
// 22., 25. i 30. urodzin krótszego okresu z niższego przedziału wieku. Lata wpisane z ułamkiem zaokrąglamy do setnych
// przed porównaniem, a braki podajemy w miesiącach w górę. Okres z ostatnich 10 lat bierzemy wprost, a w wyniku przypominamy,
// że i w nim nieskładkowe liczą się najwyżej do 1/3 składkowych (art. 5 ust. 2 dotyczy całego ustalania prawa do renty).

import { odmiana } from '../redakcja';
import { lat, latBrak, miesiecyBrak } from './emerytura-pomostowa';
import { dodajLata } from './terminy';

export type Plec = 'k' | 'm';
export type Przyczyna = 'choroba' | 'praca' | 'zawodowa' | 'droga';
export type Stopien = 'calkowita' | 'czesciowa';
export type Ubezpieczenie = 'w-trakcie' | 'do-18' | 'pozniej';

export interface DaneRenty {
  plec: Plec;
  urodzenie: string;
  /** Dzień powstania niezdolności do pracy. */
  powstanie: string;
  przyczyna: Przyczyna;
  stopien: Stopien;
  skladkowe: number;
  nieskladkowe: number;
  /** Okresy składkowe i nieskładkowe w ostatnich 10 latach przed wnioskiem albo przed powstaniem niezdolności. */
  ostatnie10: number;
  ubezpieczenie: Ubezpieczenie;
  /** Dzień sprawdzenia (wniosku): po 60/65 latach renta z FUS nie przysługuje. */
  dzis: string;
}

/** Wiek w pełnych latach w danym dniu (urodziny 29 lutego: 28 lutego w roku nieprzestępnym). */
export function wiekWDniu(urodzenie: string, data: string): number {
  let n = Math.max(0, Number(data.slice(0, 4)) - Number(urodzenie.slice(0, 4)) - 1);
  while (dodajLata(urodzenie, n + 1) <= data) n++;
  return n;
}

/** Wymagany okres z art. 58 ust. 1: dokładnie według dni urodzin i przy liczeniu wieku w pełnych latach. */
export function wymaganyOkres(urodzenie: string, powstanie: string) {
  const u = (n: number) => dodajLata(urodzenie, n);
  const dokladnie = powstanie < u(20) ? 1 : powstanie <= u(22) ? 2 : powstanie <= u(25) ? 3 : powstanie <= u(30) ? 4 : 5;
  const pelneLata = powstanie < u(20) ? 1 : powstanie < u(23) ? 2 : powstanie < u(26) ? 3 : powstanie < u(31) ? 4 : 5;
  return { dokladnie, pelneLata };
}

export type StanRenty = 'spelnia' | 'zalezy' | 'brak' | 'emerytura' | 'bez-stazu';

const r3 = (x: number) => Math.round(x * 1000) / 1000;

const r2 = (x: number) => Math.round(x * 100) / 100;

export function warunkiRenty(dane: DaneRenty) {
  // Choroba zawodowa: te same zasady co wypadek przy pracy (art. 17 ustawy wypadkowej). Lata do setnych.
  const d = { ...dane, przyczyna: dane.przyczyna === 'zawodowa' ? ('praca' as const) : dane.przyczyna, skladkowe: r2(dane.skladkowe), nieskladkowe: r2(dane.nieskladkowe), ostatnie10: r2(dane.ostatnie10) };
  if (![d.skladkowe, d.nieskladkowe, d.ostatnie10].every((x) => x >= 0)) throw new RangeError('Okresy nie mogą być ujemne');
  if (d.powstanie < d.urodzenie) throw new RangeError('Niezdolność przed urodzeniem');
  const wiek = wiekWDniu(d.urodzenie, d.powstanie);
  const wiekEmerytalny = d.plec === 'k' ? 60 : 65;
  const { dokladnie, pelneLata } = wymaganyOkres(d.urodzenie, d.powstanie);
  const staz = r3(d.skladkowe + Math.min(d.nieskladkowe, d.skladkowe / 3));
  const calkowita = d.stopien === 'calkowita';
  // Art. 57 ust. 1 pkt 4 z art. 24 (po 1948 r.: sam wiek) albo art. 27–28 (przed 1949 r.: wiek i 15/20 lat stażu);
  // ZUS ocenia to przy decyzji, więc liczy się też wiek dziś.
  const wiekDzis = d.dzis > d.powstanie ? wiekWDniu(d.urodzenie, d.dzis) : wiek;
  const wiekEmerytalnyOsiagniety =
    wiekDzis >= wiekEmerytalny && (d.urodzenie > '1948-12-31' || staz >= (d.plec === 'k' ? 15 : 20));
  // Art. 57 ust. 2 i art. 58 ust. 4: progi zwalniające z warunku 18 miesięcy i z warunku 10 lat.
  const bez18 = calkowita && staz >= (d.plec === 'k' ? 20 : 25);
  const bez10 = calkowita && d.skladkowe >= (d.plec === 'k' ? 25 : 30);
  const okres: 'niewymagany' | 'spelniony' | 'zwolniony' | 'niespelniony' = d.przyczyna === 'praca' ? 'niewymagany' : d.ubezpieczenie !== 'pozniej' ? 'spelniony' : bez18 ? 'zwolniony' : 'niespelniony';
  const potrzeba10 = dokladnie === 5 && !bez10;
  const okStaz = (wymagany: number) => staz >= wymagany && (wymagany < 5 || !potrzeba10 || d.ostatnie10 >= 5);
  const stazNiewymagany = d.przyczyna !== 'choroba';
  let stan: StanRenty;
  if (d.przyczyna === 'praca') stan = 'bez-stazu';
  else if (wiekEmerytalnyOsiagniety) stan = 'emerytura';
  else if (okres === 'niespelniony') stan = 'brak';
  else if (stazNiewymagany || okStaz(dokladnie)) stan = 'spelnia';
  else if (pelneLata < dokladnie && okStaz(pelneLata)) stan = 'zalezy';
  else stan = 'brak';
  return {
    stan,
    wiek,
    wiekEmerytalny,
    wymagany: dokladnie,
    wymaganyPelneLata: pelneLata,
    staz,
    potrzeba10,
    okres,
    stazNiewymagany,
    brakStazu: stazNiewymagany ? 0 : Math.max(0, Math.ceil(r3((dokladnie - staz) * 12))),
    brak10: potrzeba10 && !stazNiewymagany ? Math.max(0, Math.ceil(r3((5 - d.ostatnie10) * 12))) : 0,
    przedRokiem1949: d.urodzenie <= '1948-12-31',
  };
}

export interface OpisRenty {
  stan: string;
  opis: string;
  wiek: string;
  wymagany: string;
  staz: string;
  okres: string;
  uwagi: string[];
}

// Od 1 stycznia 2027 r. art. 14 ust. 1 mówi tylko o formie orzeczenia, a kto orzeka, mówi art. 85a ustawy o systemie
// ubezpieczeń społecznych (Dz.U. 2026 poz. 26, art. 12 pkt 3 i art. 1 pkt 9): o niezdolności do pracy lekarz orzecznik.
const ORZECZENIE = 'O niezdolności do pracy i jej stopniu orzeka lekarz orzecznik ZUS (art. 14 ustawy o FUS; od 1 stycznia 2027 r. art. 85a ustawy o systemie ubezpieczeń społecznych).';
const ART_58_3 =
  'Staż uważa się też za spełniony, gdy zgłoszono Cię do ubezpieczenia przed 18. urodzinami albo w ciągu 6 miesięcy po ukończeniu szkoły ponadpodstawowej, ponadgimnazjalnej lub wyższej i do dnia powstania niezdolności okresy składkowe i nieskładkowe trwały bez przerw dłuższych niż 6 miesięcy (art. 58 ust. 3).';

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisRenty(d: DaneRenty): OpisRenty {
  const r = warunkiRenty(d);
  const o: OpisRenty = {
    stan: '',
    opis: '',
    wiek: odmiana(r.wiek, ['rok', 'lata', 'lat']),
    wymagany: r.stazNiewymagany ? 'nie jest wymagany' : `${lat(r.wymagany)}${r.potrzeba10 ? ', w tym 5 lat w ostatnich 10 latach' : ''}`,
    staz: `${lat(r.staz)}${d.nieskladkowe > d.skladkowe / 3 ? ' (nieskładkowe do 1/3 składkowych)' : ''}`,
    okres: { niewymagany: 'nie jest wymagany', spelniony: 'tak', zwolniony: 'nie, ale nie jest wymagany (art. 57 ust. 2)', niespelniony: 'nie' }[r.okres],
    uwagi: [],
  };
  if (r.stan === 'bez-stazu') {
    o.stan = 'Staż nie jest wymagany';
    o.opis = 'długość ubezpieczenia wypadkowego i data powstania niezdolności nie mają znaczenia (art. 17 ust. 2 ustawy wypadkowej); potrzebne jest uznanie zdarzenia za wypadek przy pracy w protokole albo karcie wypadku albo stwierdzenie choroby zawodowej';
    o.uwagi.push(
      'Świadczenia wypadkowe nie przysługują, gdy wyłączną przyczyną wypadku było udowodnione umyślne albo rażąco niedbałe naruszenie przepisów o ochronie życia i zdrowia albo gdy osoba nietrzeźwa lub pod wpływem środków odurzających w znacznym stopniu przyczyniła się do wypadku (art. 21 ust. 1–2 ustawy wypadkowej).',
      'Renta wypadkowa wynosi co najmniej 80% podstawy przy całkowitej i 60% przy częściowej niezdolności, z zastrzeżeniem art. 18 ust. 2 ustawy wypadkowej, i przysługuje też osobie z prawem do emerytury (art. 17 ust. 1).',
    );
  } else if (r.stan === 'emerytura') {
    o.stan = 'Emerytura zamiast renty';
    o.opis = `od dnia ${r.wiekEmerytalny}. urodzin przysługuje emerytura${r.przedRokiem1949 ? ' (przy Twoim stażu, art. 27–28)' : ''}, a renta z FUS z tytułu niezdolności do pracy nie przysługuje osobie, która spełnia warunki do emerytury (art. 57 ust. 1 pkt 4); wyjątek to renta po wypadku przy pracy albo przy chorobie zawodowej (art. 17 ust. 1 ustawy wypadkowej)`;
  } else if (r.stan === 'spelnia') {
    o.stan = 'Warunki stażu spełnione';
    o.opis = d.przyczyna === 'droga' ? 'przy wypadku w drodze do pracy lub z pracy staż nie jest wymagany (art. 57a), ale obowiązuje termin z art. 57 ust. 1 pkt 3' : 'masz wymagany okres składkowy i nieskładkowy dla wieku, w którym powstała niezdolność (art. 58)';
  } else if (r.stan === 'zalezy') {
    o.stan = 'Zależy od liczenia wieku';
    o.opis = `przy liczeniu wieku w pełnych latach potrzeba ${latBrak(r.wymaganyPelneLata)}, a przy liczeniu od dnia po urodzinach ${latBrak(r.wymagany)}; przepis tego nie rozstrzyga, decyduje ZUS, a w sporze sąd`;
    o.uwagi.push(ART_58_3);
  } else {
    o.stan = 'Warunki niespełnione';
    const braki: string[] = [];
    if (r.okres === 'niespelniony') braki.push('niezdolność powstała ponad 18 miesięcy po końcu ubezpieczenia (art. 57 ust. 1 pkt 3)');
    if (r.brakStazu > 0) braki.push(`brakuje ${miesiecyBrak(r.brakStazu)} okresów składkowych i nieskładkowych`);
    if (r.brak10 > 0) braki.push(`w ostatnich 10 latach brakuje ${miesiecyBrak(r.brak10)} (art. 58 ust. 2)`);
    o.opis = braki.join('; ');
    if (r.brakStazu > 0 || r.brak10 > 0) o.uwagi.push(ART_58_3);
  }
  if (r.potrzeba10 && (r.stan === 'spelnia' || r.stan === 'zalezy'))
    o.uwagi.push('W ostatnich 10 latach okresy nieskładkowe też liczą się najwyżej do 1/3 składkowych z tych lat (art. 5 ust. 2): kalkulator bierze wpisaną sumę wprost, ZUS może policzyć mniej.');
  if (r.stan !== 'bez-stazu' && r.stan !== 'emerytura') {
    o.uwagi.push(`Renta z FUS nie przysługuje, gdy w dniu decyzji masz prawo do emerytury z FUS albo spełniasz warunki do niej, na przykład od dnia ${r.wiekEmerytalny}. urodzin (art. 57 ust. 1 pkt 4).`);
  }
  o.uwagi.push(ORZECZENIE);
  return o;
}
