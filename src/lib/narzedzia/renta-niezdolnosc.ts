// Renta z tytułu niezdolności do pracy: warunki stażu i okresu powstania niezdolności (ustawa o emeryturach i rentach
// z FUS, tekst jednolity Dz.U. 2025 poz. 1749; tekst ujednolicony Kancelarii Sejmu ze stanem na 16 października 2026 r.
// nie zmienia art. 5, 12, 57–58):
// - art. 57 ust. 1: niezdolność do pracy (art. 12, orzeka lekarz orzecznik ZUS), wymagany okres składkowy i nieskładkowy,
//   powstanie niezdolności w okresie ubezpieczenia albo okresach nieskładkowych z listy (zasiłek chorobowy, świadczenie
//   rehabilitacyjne, urlop wychowawczy…) albo nie później niż 18 miesięcy po ich ustaniu, brak prawa do emerytury z FUS
//   i niespełnianie warunków do niej;
// - art. 57 ust. 2: warunku 18 miesięcy nie stosuje się przy całkowitej niezdolności i stażu 20 lat (kobiety) albo 25 lat
//   (mężczyźni); art. 57a: przy wypadku w drodze do pracy lub z pracy staż nie jest wymagany;
// - art. 58 ust. 1: 1 rok przed ukończeniem 20 lat, 2 lata „w wieku powyżej 20 do 22 lat”, 3 lata „powyżej 22 do 25”,
//   4 lata „powyżej 25 do 30”, 5 lat „powyżej 30 lat”; ust. 2: 5 lat w ostatnich 10 latach przed wnioskiem albo przed
//   powstaniem niezdolności; ust. 3: zgłoszenie do ubezpieczenia przed 18 lat albo do 6 miesięcy po szkole i okresy bez
//   przerw dłuższych niż 6 miesięcy; ust. 4: bez warunku 10 lat przy całkowitej niezdolności i 25/30 latach okresów
//   składkowych;
// - art. 5 ust. 2: okresy nieskładkowe najwyżej w jednej trzeciej okresów składkowych;
// - art. 24 ust. 1: urodzonym po 1948 r. emerytura przysługuje po osiągnięciu 60/65 lat (wtedy renta z FUS nie przysługuje,
//   art. 57 ust. 1 pkt 4);
// - ustawa wypadkowa (Dz.U. 2025 poz. 1644), art. 17 ust. 1–2: renta z tytułu wypadku przy pracy lub choroby zawodowej
//   niezależnie od długości ubezpieczenia i daty powstania niezdolności, bez art. 57 ust. 1 pkt 4.
// Interpretacja: przepis nie mówi, czy „w wieku powyżej 22 do 25 lat” liczyć dokładnie (od dnia po 22. urodzinach),
// czy w pełnych latach (od 23. urodzin). Liczymy dokładnie, ale gdy przy liczeniu w pełnych latach wymagany okres
// byłby krótszy, a staż mieści się między nimi, pokazujemy „zależy” (wariant bezpieczny dla pracownika: nie odradzamy
// wniosku). W dniu 20., 22., 25. i 30. urodzin przyjmujemy niższy próg. Wpisany okres z ostatnich 10 lat bierzemy wprost.

import { odmiana } from '../redakcja';
import { lat, latBrak } from './emerytura-pomostowa';
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

export function warunkiRenty(dane: DaneRenty) {
  // Choroba zawodowa: te same zasady co wypadek przy pracy (art. 17 ustawy wypadkowej).
  const d = dane.przyczyna === 'zawodowa' ? { ...dane, przyczyna: 'praca' as const } : dane;
  if (![d.skladkowe, d.nieskladkowe, d.ostatnie10].every((x) => x >= 0)) throw new RangeError('Okresy nie mogą być ujemne');
  if (d.powstanie < d.urodzenie) throw new RangeError('Niezdolność przed urodzeniem');
  const wiek = wiekWDniu(d.urodzenie, d.powstanie);
  const wiekEmerytalny = d.plec === 'k' ? 60 : 65;
  const { dokladnie, pelneLata } = wymaganyOkres(d.urodzenie, d.powstanie);
  const staz = r3(d.skladkowe + Math.min(d.nieskladkowe, d.skladkowe / 3));
  const calkowita = d.stopien === 'calkowita';
  // Art. 57 ust. 2 i art. 58 ust. 4: progi zwalniające z warunku 18 miesięcy i z warunku 10 lat.
  const bez18 = calkowita && staz >= (d.plec === 'k' ? 20 : 25);
  const bez10 = calkowita && d.skladkowe >= (d.plec === 'k' ? 25 : 30);
  const okres: 'niewymagany' | 'spelniony' | 'zwolniony' | 'niespelniony' = d.przyczyna === 'praca' ? 'niewymagany' : d.ubezpieczenie !== 'pozniej' ? 'spelniony' : bez18 ? 'zwolniony' : 'niespelniony';
  const potrzeba10 = dokladnie === 5 && !bez10;
  const okStaz = (wymagany: number) => staz >= wymagany && (wymagany < 5 || !potrzeba10 || d.ostatnie10 >= 5);
  const stazNiewymagany = d.przyczyna !== 'choroba';
  let stan: StanRenty;
  if (d.przyczyna === 'praca') stan = 'bez-stazu';
  else if (d.urodzenie > '1948-12-31' && wiek >= wiekEmerytalny) stan = 'emerytura';
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
    brakStazu: stazNiewymagany ? 0 : r3(Math.max(0, dokladnie - staz)),
    brak10: potrzeba10 && !stazNiewymagany ? r3(Math.max(0, 5 - d.ostatnie10)) : 0,
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

const ORZECZENIE = 'O niezdolności do pracy i jej stopniu decyduje lekarz orzecznik ZUS (art. 12 i 14).';

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
    o.opis = 'renta z ubezpieczenia wypadkowego przysługuje bez względu na długość ubezpieczenia i datę powstania niezdolności (art. 17 ust. 2 ustawy wypadkowej)';
    o.uwagi.push('Renta wypadkowa wynosi co najmniej 80% podstawy przy całkowitej i 60% przy częściowej niezdolności (art. 18 ustawy wypadkowej).');
  } else if (r.stan === 'emerytura') {
    o.stan = 'Emerytura zamiast renty';
    o.opis = `po ${r.wiekEmerytalny}. urodzinach przysługuje emerytura, a renta z tytułu niezdolności do pracy nie przysługuje osobie, która spełnia warunki do emerytury (art. 57 ust. 1 pkt 4 i art. 24)`;
  } else if (r.stan === 'spelnia') {
    o.stan = 'Warunki stażu spełnione';
    o.opis = d.przyczyna === 'droga' ? 'przy wypadku w drodze do pracy lub z pracy staż nie jest wymagany (art. 57a)' : 'masz wymagany okres składkowy i nieskładkowy dla wieku, w którym powstała niezdolność (art. 58)';
  } else if (r.stan === 'zalezy') {
    o.stan = 'Zależy od liczenia wieku';
    o.opis = `przy liczeniu wieku w pełnych latach wystarczy ${lat(r.wymaganyPelneLata)}, a przy dokładnym od dnia po urodzinach potrzeba ${latBrak(r.wymagany)}; przepis tego nie rozstrzyga, decyduje ZUS`;
  } else {
    o.stan = 'Warunki niespełnione';
    const braki: string[] = [];
    if (r.okres === 'niespelniony') braki.push('niezdolność powstała ponad 18 miesięcy po końcu ubezpieczenia (art. 57 ust. 1 pkt 3)');
    if (r.brakStazu > 0) braki.push(`brakuje ${latBrak(r.brakStazu)} okresów składkowych i nieskładkowych`);
    if (r.brak10 > 0) braki.push(`w ostatnich 10 latach brakuje ${latBrak(r.brak10)} (art. 58 ust. 2)`);
    o.opis = braki.join('; ');
    if (r.brakStazu > 0 || r.brak10 > 0) {
      o.uwagi.push('Staż uważa się też za spełniony, gdy zgłoszono Cię do ubezpieczenia przed 18. urodzinami albo w ciągu 6 miesięcy po ukończeniu szkoły ponadpodstawowej, ponadgimnazjalnej lub wyższej i do dnia powstania niezdolności okresy składkowe i nieskładkowe trwały bez przerw dłuższych niż 6 miesięcy (art. 58 ust. 3).');
    }
  }
  if (r.stan !== 'bez-stazu' && r.stan !== 'emerytura') o.uwagi.push('Renta z FUS nie przysługuje, gdy masz prawo do emerytury z FUS albo spełniasz warunki do niej (art. 57 ust. 1 pkt 4).');
  o.uwagi.push(ORZECZENIE);
  return o;
}
