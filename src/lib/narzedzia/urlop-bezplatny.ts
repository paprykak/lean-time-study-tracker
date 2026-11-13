// Urlop bezpłatny: skutki dla urlopu wypoczynkowego, stażu i ubezpieczeń.
// Kodeks pracy (tekst jednolity Dz.U. 2026 poz. 1245):
// - art. 174 § 2: okresu urlopu bezpłatnego nie wlicza się do okresu pracy, od którego zależą uprawnienia pracownicze;
//   § 3: przy urlopie dłuższym niż 3 miesiące strony mogą przewidzieć odwołanie z ważnych przyczyn;
// - art. 174^1 § 2: urlop bezpłatny do pracy u innego pracodawcy wlicza się do okresu pracy u dotychczasowego;
// - art. 186^5: okres urlopu wychowawczego, w dniu jego zakończenia, wlicza się do okresu zatrudnienia;
// - art. 155^2 § 1: pracownik powracający w ciągu roku po co najmniej 1 miesiącu urlopu bezpłatnego, wychowawczego,
//   nieusprawiedliwionej nieobecności (i in.): urlop jak u kolejnego pracodawcy, proporcjonalnie do okresu do końca roku
//   (art. 155^1 § 1 pkt 2 lit. a); § 2: gdy okres z § 1 pkt 1 i 3–6 (bez urlopu wychowawczego) przypada po nabyciu prawa
//   do urlopu w danym roku, wymiar pracownika powracającego w ciągu tego samego roku obniża się proporcjonalnie, chyba że
//   przed rozpoczęciem tego okresu wykorzystał urlop w przysługującym mu lub wyższym wymiarze;
// - art. 155^2a: kalendarzowy miesiąc pracy = 1/12 wymiaru, niepełny kalendarzowy miesiąc pracy w górę;
// - art. 155^3: niepełny dzień w górę, nie więcej niż wymiar z art. 154 § 1 i 2.
// Kodeks cywilny (Dz.U. 2026 poz. 795) przez art. 300 Kp: art. 112 (termin w miesiącach), art. 111 § 2 (termin w dniach).
//
// Przyjęte interpretacje (przepisy ich wprost nie rozstrzygają):
// 1. „Co najmniej 1 miesiąc”: liczymy od dnia po rozpoczęciu urlopu, więc miesiąc od 1 marca kończy się 1 kwietnia
//    (art. 112 Kc). Przy liczeniu pierwszego dnia urlopu kończyłby się 31 marca. Wybieramy wariant, w którym w przypadku
//    granicznym urlopu wypoczynkowego się nie obniża. Tak samo „dłuższy niż 3 miesiące” (art. 174 § 3).
// 2. Miesiące pracy w roku = miesiące kalendarzowe z co najmniej jednym dniem poza nieobecnością (niepełny w górę);
//    urlop = min(wymiar, ceil(wymiar × miesiące / 12)).
// 3. Prawo do urlopu uznajemy za nabyte 1 stycznia (art. 153 § 2). Rok rozpoczęcia (nieobecność od 2 stycznia albo
//    później): obniżenie z § 2 tylko przy powrocie w tym samym roku; bez powrotu wymiar się nie zmienia; urlop
//    wychowawczy bez obniżenia. Rok powrotu (albo rok zaczęty na urlopie i zakończony powrotem): proporcja z § 1.
// 4. Rok w całości na urlopie: przepisy nie mówią, ile urlopu przysługuje. Wynik główny 0 dni (ostrożnie), drugie
//    odczytanie: pełny wymiar (żaden paragraf art. 155^2 nie obejmuje roku bez powrotu).
// 5. „Chyba że…” z § 2: przepis nie mówi, czy wyjątek przywraca pełny wymiar, czy tylko chroni urlop już wykorzystany.
//    Wynik główny: obniżony wymiar, do wykorzystania max(0, obniżony − wykorzystany); drugie odczytanie: pełny wymiar.
// 6. Art. 174^1: art. 155^2 § 1 pkt 1 mówi o urlopie bezpłatnym bez wyjątku, a art. 174^1 § 2 o okresie pracy. Liczymy
//    obniżenie jak przy urlopie bezpłatnym; drugie odczytanie: pełny wymiar. Stażu nie przesuwamy (§ 2).
// 7. Staż: urlop bezpłatny przesuwa datę 10 lat o swoją długość, gdy zaczyna się przed nią. Urlop wychowawczy: gdy 10 lat
//    mija w czasie urlopu, liczymy je od dnia jego zakończenia (art. 186^5). Nieobecności nieusprawiedliwionej nie liczymy.
// 8. Art. 69 ust. 3 ustawy o świadczeniach (Dz.U. 2025 poz. 1461): 30 dni bez dnia rozpoczęcia (art. 111 § 2 Kc).
import { odmiana } from '../redakcja';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajMiesiace, poprawnaData } from './terminy';

export type RodzajNieobecnosci = 'bezplatny' | 'inny-pracodawca' | 'wychowawczy' | 'nieobecnosc';
export const RODZAJE: Record<RodzajNieobecnosci, string> = {
  bezplatny: 'Urlop bezpłatny',
  'inny-pracodawca': 'Do pracy u innego pracodawcy',
  wychowawczy: 'Urlop wychowawczy',
  nieobecnosc: 'Nieobecność nieusprawiedliwiona',
};
/** Najdłuższy okres, który liczymy (lata). */
export const MAKS_LAT = 6;

export interface DaneUrlopuBezplatnego {
  od: string;
  do: string;
  rodzaj: RodzajNieobecnosci;
  /** Roczny wymiar urlopu wypoczynkowego (dni, art. 154 § 1 i 2). */
  wymiar: number;
  /** Urlop wykorzystany w roku rozpoczęcia przed nieobecnością (dni). */
  wykorzystanePrzed?: number;
  /** Data 10 lat stażu, gdyby nie było urlopu bezpłatnego (opcjonalnie). */
  data10Lat?: string;
}

export type PodstawaRoku = 'bez-zmian' | 'obnizenie' | 'brak-powrotu' | 'wychowawczy' | 'powrot' | 'caly-rok';
export type PowodOdczytania = 'wyjatek' | 'art-174-1' | 'caly-rok';

export interface RokUrlopu {
  rok: number;
  miesiacePracy: number;
  /** Wymiar proporcjonalny do miesięcy pracy (art. 155^2a, 155^3). */
  proporcja: number;
  dni: number;
  podstawa: PodstawaRoku;
  /** Wymiar przy drugim odczytaniu przepisu albo null, gdy go nie ma. */
  drugieOdczytanie: { dni: number; powod: PowodOdczytania } | null;
}

/** Dzień, który urlop musi objąć, żeby trwał co najmniej `n` miesięcy liczonych od dnia po rozpoczęciu (art. 112 Kc). */
export const koniecMiesiecy = (od: string, n: number) => dodajMiesiace(od, n);

/** Miesiące kalendarzowe roku, w których jest choć jeden dzień poza okresem [od, do]. */
export function miesiacePracy(rok: number, od: string, do_: string): number {
  let n = 0;
  for (let m = 1; m <= 12; m++) {
    const pierwszy = `${rok}-${String(m).padStart(2, '0')}-01`;
    const ostatni = dodajDni(dodajMiesiace(pierwszy, 1), -1);
    if (pierwszy < od || ostatni > do_) n++;
  }
  return n;
}

export function urlopBezplatny(d: DaneUrlopuBezplatnego) {
  if (!poprawnaData(d.od) || !poprawnaData(d.do)) throw new RangeError('Niepoprawna data');
  if (d.do < d.od) throw new RangeError('Koniec przed początkiem');
  if (d.do >= dodajMiesiace(d.od, MAKS_LAT * 12)) throw new RangeError(`Okres dłuższy niż ${MAKS_LAT} lat`);
  if (!Number.isInteger(d.wymiar) || d.wymiar < 1 || d.wymiar > 26) throw new RangeError('Wymiar od 1 do 26 dni');
  const wykorzystane = d.wykorzystanePrzed ?? 0;
  if (!Number.isInteger(wykorzystane) || wykorzystane < 0 || wykorzystane > d.wymiar) throw new RangeError('Wykorzystany urlop od 0 do wymiaru');
  if (d.data10Lat !== undefined && !poprawnaData(d.data10Lat)) throw new RangeError('Niepoprawna data 10 lat');

  const dni = dniMiedzy(d.od, d.do) + 1;
  // Wariant 1 z nagłówka: miesiąc liczony od dnia po rozpoczęciu urlopu.
  const coNajmniejMiesiac = d.do >= koniecMiesiecy(d.od, 1);
  const rokOd = Number(d.od.slice(0, 4));
  const rokDo = Number(d.do.slice(0, 4));
  const rokPowrotu = Number(dodajDni(d.do, 1).slice(0, 4));
  const poNabyciu = d.od.slice(5) !== '01-01';
  const w = d.wymiar;

  const lata: RokUrlopu[] = [];
  for (let rok = rokOd; rok <= rokDo; rok++) {
    const mies = miesiacePracy(rok, d.od, d.do);
    const proporcja = Math.min(w, Math.ceil((w * mies) / 12));
    let dniRoku = w;
    let podstawa: PodstawaRoku;
    let drugie: RokUrlopu['drugieOdczytanie'] = null;
    if (!coNajmniejMiesiac) podstawa = 'bez-zmian';
    else if (rok === rokOd && poNabyciu) {
      if (d.rodzaj === 'wychowawczy') podstawa = 'wychowawczy';
      else if (rokPowrotu !== rok) podstawa = 'brak-powrotu';
      else {
        podstawa = 'obnizenie';
        dniRoku = proporcja;
        if (proporcja < w && d.rodzaj === 'inny-pracodawca') drugie = { dni: w, powod: 'art-174-1' };
        else if (proporcja < w && wykorzystane >= proporcja) drugie = { dni: w, powod: 'wyjatek' };
      }
    } else if (rok === rokPowrotu) {
      podstawa = 'powrot';
      dniRoku = proporcja;
      if (proporcja < w && d.rodzaj === 'inny-pracodawca') drugie = { dni: w, powod: 'art-174-1' };
    } else {
      podstawa = 'caly-rok';
      dniRoku = 0;
      drugie = { dni: w, powod: 'caly-rok' };
    }
    lata.push({ rok, miesiacePracy: mies, proporcja, dni: dniRoku, podstawa, drugieOdczytanie: drugie });
  }

  // „Zostało” tylko przy obniżeniu w roku rozpoczęcia (wtedy liczy się urlop wykorzystany przed nieobecnością).
  const pierwszy = lata[0];
  const zostalo =
    pierwszy.podstawa === 'obnizenie'
      ? { dni: Math.max(0, pierwszy.dni - wykorzystane), drugieOdczytanie: pierwszy.drugieOdczytanie ? pierwszy.drugieOdczytanie.dni - wykorzystane : null }
      : null;

  // Staż (art. 174 § 2; art. 174^1 § 2; art. 186^5).
  let nowaData10Lat: string | null = null;
  if (d.data10Lat) {
    if (d.rodzaj === 'bezplatny' && d.od < d.data10Lat) nowaData10Lat = dodajDni(d.data10Lat, dni);
    else if (d.rodzaj === 'wychowawczy' && d.od < d.data10Lat && d.data10Lat <= d.do) nowaData10Lat = d.do;
    else nowaData10Lat = d.data10Lat;
  }

  const ostatniDzienSwiadczen = dodajDni(d.od, 30);
  return {
    dni,
    coNajmniejMiesiac,
    lata,
    zostalo,
    dluzszyNiz3Miesiace: d.do > koniecMiesiecy(d.od, 3),
    /** Dni, których nie wlicza się do okresu pracy (art. 174 § 2). */
    nieWliczaSieDoStazu: d.rodzaj === 'bezplatny' ? dni : 0,
    /** O ile dni przesuwa się podana data 10 lat stażu. */
    przesuniecie10Lat: d.data10Lat && nowaData10Lat ? dniMiedzy(d.data10Lat, nowaData10Lat) : 0,
    nowaData10Lat,
    /** Ostatni dzień prawa do świadczeń zdrowotnych z art. 69 ust. 3 albo null, gdy urlop nie trwa dłużej. */
    swiadczeniaZdrowotneDo: d.rodzaj === 'bezplatny' && d.do > ostatniDzienSwiadczen ? ostatniDzienSwiadczen : null,
  };
}

const dniTekst = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);
const dniDopelniacz = (n: number) => odmiana(n, ['dnia', 'dni', 'dni']);

/**
 * Teksty wyniku (te same na serwerze i w przeglądarce). Indeksy artykułów jako „^2”; przed pokazaniem przepuść je
 * przez `indeksyUnicode` z format.ts, a w przeglądarce także przez typografię.
 */
export function tekstyWyniku(d: DaneUrlopuBezplatnego) {
  const r = urlopBezplatny(d);
  const wyk = d.wykorzystanePrzed ?? 0;
  const lata = r.lata.map((x) => {
    const opis: Record<PodstawaRoku, string> = {
      'bez-zmian': r.coNajmniejMiesiac ? 'bez zmian' : 'bez zmian, nieobecność krótsza niż miesiąc',
      obnizenie: `praca w ${x.miesiacePracy} z 12 miesięcy, obniżenie z art. 155^2 § 2`,
      'brak-powrotu': 'bez obniżenia: brak powrotu w tym samym roku (art. 155^2 § 2)',
      wychowawczy: 'bez obniżenia: art. 155^2 § 2 nie obejmuje urlopu wychowawczego',
      powrot: `praca w ${x.miesiacePracy} z 12 miesięcy, do końca roku (art. 155^2 § 1)`,
      'caly-rok': 'cały rok na urlopie; przepisy nie mówią, ile urlopu przysługuje, przyjmujemy 0 dni',
    };
    const wiersze = [{ etykieta: `Urlop wypoczynkowy za ${x.rok}`, wartosc: `${dniTekst(x.dni)}, ${opis[x.podstawa]}` }];
    const o = x.drugieOdczytanie;
    if (o) {
      const powod: Record<PowodOdczytania, string> = {
        wyjatek: 'przy odczytaniu, że wyjątek „chyba że” przywraca pełny wymiar',
        'art-174-1': 'przy odczytaniu, że art. 155^2 nie obejmuje urlopu z art. 174^1',
        'caly-rok': 'przy odczytaniu, że żaden paragraf art. 155^2 nie obejmuje roku bez powrotu',
      };
      wiersze.push({ etykieta: `Drugie odczytanie za ${x.rok}`, wartosc: `${dniTekst(o.dni)}, ${powod[o.powod]}` });
    }
    return wiersze;
  });
  const pierwszy = r.lata[0];
  const glowna = dniTekst(pierwszy.dni);
  const opis = r.coNajmniejMiesiac
    ? `Urlop wypoczynkowy za ${pierwszy.rok}; nieobecność ${dniTekst(r.dni)}, co najmniej miesiąc`
    : `Nieobecność ${dniTekst(r.dni)}, krócej niż miesiąc: wymiar się nie zmienia (art. 155^2 § 1)`;

  const pozycje: { etykieta: string; wartosc: string }[] = [];
  if (r.zostalo && wyk > 0) {
    pozycje.push({ etykieta: `Zostało do wykorzystania za ${pierwszy.rok}`, wartosc: `${dniTekst(r.zostalo.dni)} po odjęciu ${dniDopelniacz(wyk)} wykorzystanego urlopu` });
    if (r.zostalo.drugieOdczytanie !== null)
      pozycje.push({ etykieta: 'Zostało przy drugim odczytaniu', wartosc: dniTekst(r.zostalo.drugieOdczytanie) });
  }
  const staz: Record<RodzajNieobecnosci, string> = {
    bezplatny: `${dniTekst(r.nieWliczaSieDoStazu)} nie wlicza się do okresu pracy, od którego zależą uprawnienia (art. 174 § 2)`,
    'inny-pracodawca': 'wlicza się do okresu pracy u dotychczasowego pracodawcy (art. 174^1 § 2)',
    wychowawczy: 'wlicza się w dniu zakończenia urlopu (art. 186^5)',
    nieobecnosc: 'art. 174 § 2 dotyczy urlopu bezpłatnego; tej nieobecności nie liczymy',
  };
  pozycje.push({ etykieta: 'Staż pracy', wartosc: staz[d.rodzaj] });
  if (d.data10Lat && r.nowaData10Lat) {
    let wartosc: string;
    if (d.rodzaj === 'nieobecnosc') wartosc = 'nie liczymy';
    else if (d.rodzaj === 'wychowawczy' && r.przesuniecie10Lat)
      wartosc = `${dataPoPolsku(r.nowaData10Lat)}: 10 lat mija w czasie urlopu, liczymy je od dnia jego zakończenia`;
    else if (r.przesuniecie10Lat) wartosc = `${dataPoPolsku(r.nowaData10Lat)}, później o ${dniTekst(r.przesuniecie10Lat)}`;
    else wartosc = `bez zmian: ${dataPoPolsku(r.nowaData10Lat)}`;
    pozycje.push({ etykieta: '10 lat stażu (26 dni urlopu)', wartosc });
  }
  if (d.rodzaj === 'bezplatny')
    pozycje.push({
      etykieta: 'Odwołanie z urlopu',
      wartosc: r.dluzszyNiz3Miesiace
        ? 'Kodeks przewiduje je przy urlopie dłuższym niż 3 miesiące, jeśli strony to przewidziały (art. 174 § 3)'
        : 'art. 174 § 3 dotyczy tylko urlopu dłuższego niż 3 miesiące',
    });

  const zasilekBezplatny =
    'Za niezdolność do pracy w czasie urlopu bezpłatnego zasiłek chorobowy nie przysługuje, a tych dni nie wlicza się do okresu zasiłkowego (art. 12 ust. 2 pkt 1 i ust. 3 ustawy zasiłkowej).';
  const ubezpieczenia: Record<RodzajNieobecnosci, string[]> = {
    bezplatny: [
      zasilekBezplatny,
      'Do 30 dni ubezpieczenia chorobowego, po których przysługuje zasiłek, wlicza się okresy sprzed przerwy spowodowanej urlopem bezpłatnym (art. 4 ust. 1–2 ustawy zasiłkowej).',
      r.swiadczeniaZdrowotneDo
        ? `Prawo do świadczeń z ubezpieczenia zdrowotnego tracisz po upływie 30 dni od rozpoczęcia urlopu, czyli po ${dataPoPolsku(r.swiadczeniaZdrowotneDo)} (art. 69 ust. 3 ustawy o świadczeniach opieki zdrowotnej). Możesz ubezpieczyć się dobrowolnie na pisemny wniosek złożony w NFZ, jeśli mieszkasz w Polsce (art. 68 ust. 1).`
        : 'Urlop nie trwa dłużej niż 30 dni od dnia rozpoczęcia, po których traci się prawo do świadczeń z ubezpieczenia zdrowotnego (art. 69 ust. 3 ustawy o świadczeniach opieki zdrowotnej).',
      'Zwykłego urlopu bezpłatnego nie ma w wykazie okresów nieskładkowych; są tam urlopy bezpłatne na opiekę nad małymi dziećmi i urlop bezpłatny małżonków pracowników placówek za granicą (art. 7 pkt 5 i 8 ustawy o emeryturach i rentach z FUS).',
    ],
    'inny-pracodawca': [
      'Jako pracownik innego pracodawcy podlegasz obowiązkowo ubezpieczeniu zdrowotnemu (art. 66 ust. 1 pkt 1 lit. a ustawy o świadczeniach opieki zdrowotnej).',
      'Ustawa zasiłkowa wyłącza zasiłek za niezdolność do pracy „w czasie urlopu bezpłatnego” (art. 12 ust. 2 pkt 1) i nie ma osobnego przepisu o urlopie z art. 174^1 Kodeksu pracy.',
    ],
    wychowawczy: [
      'Za niezdolność do pracy w czasie urlopu wychowawczego zasiłek chorobowy nie przysługuje, a tych dni nie wlicza się do okresu zasiłkowego (art. 12 ust. 2 pkt 2 i ust. 3 ustawy zasiłkowej).',
      'Do 30 dni ubezpieczenia chorobowego, po których przysługuje zasiłek, wlicza się okresy sprzed przerwy spowodowanej urlopem wychowawczym (art. 4 ust. 1–2 ustawy zasiłkowej).',
      'Ubezpieczeniu zdrowotnemu podlegasz z tytułu urlopu wychowawczego, jeśli nie masz innego tytułu (art. 66 ust. 1 pkt 32 ustawy o świadczeniach opieki zdrowotnej).',
      'Ubezpieczeniom emerytalnemu i rentowym podlegasz obowiązkowo z tytułu urlopu wychowawczego, jeśli nie masz ustalonego prawa do emerytury lub renty ani innego tytułu do ubezpieczeń (art. 6 ust. 1 pkt 19 i art. 9 ust. 6 ustawy o systemie ubezpieczeń społecznych).',
    ],
    nieobecnosc: [
      'Przepisy o zasiłku chorobowym i prawie do świadczeń zdrowotnych, z których liczymy (art. 4 i 12 ustawy zasiłkowej, art. 66–69 ustawy o świadczeniach opieki zdrowotnej), nie mówią o nieobecności nieusprawiedliwionej.',
    ],
  };
  const ochrona =
    d.rodzaj === 'nieobecnosc'
      ? 'Art. 41 Kodeksu pracy chroni przed wypowiedzeniem w czasie urlopu i innej usprawiedliwionej nieobecności; nieobecności nieusprawiedliwionej nie obejmuje.'
      : '„Pracodawca nie może wypowiedzieć umowy o pracę w czasie urlopu pracownika, a także w czasie innej usprawiedliwionej nieobecności pracownika w pracy, jeżeli nie upłynął jeszcze okres uprawniający do rozwiązania umowy o pracę bez wypowiedzenia” (art. 41 Kodeksu pracy).';
  return { wynik: r, glowna, opis, lata: lata.flat(), pozycje, ubezpieczenia: ubezpieczenia[d.rodzaj], ochrona };
}
