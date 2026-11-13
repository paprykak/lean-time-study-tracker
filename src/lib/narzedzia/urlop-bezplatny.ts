// Urlop bezpłatny: skutki dla urlopu wypoczynkowego, stażu i ubezpieczeń.
// Kodeks pracy (tekst jednolity Dz.U. 2026 poz. 1245):
// - art. 174 § 2: okresu urlopu bezpłatnego nie wlicza się do okresu pracy, od którego zależą uprawnienia pracownicze;
//   § 3: przy urlopie dłuższym niż 3 miesiące strony mogą przewidzieć odwołanie z ważnych przyczyn;
// - art. 174^1 § 2: urlop bezpłatny do pracy u innego pracodawcy wlicza się do okresu pracy u dotychczasowego;
// - art. 186^5: urlop wychowawczy w dniu jego zakończenia wlicza się do okresu zatrudnienia;
// - art. 155^2 § 1: powrót w ciągu roku po co najmniej 1 miesiącu urlopu bezpłatnego, wychowawczego, nieusprawiedliwionej
//   nieobecności (i in.): urlop jak u kolejnego pracodawcy, proporcjonalnie do okresu do końca roku (art. 155^1 § 1 pkt 2);
//   § 2: gdy okres z § 1 pkt 1 i 3–6 (bez urlopu wychowawczego) przypada po nabyciu prawa do urlopu w danym roku, wymiar
//   obniża się proporcjonalnie, chyba że przed rozpoczęciem tego okresu wykorzystano urlop w przysługującym lub wyższym wymiarze;
// - art. 155^2a: kalendarzowy miesiąc pracy = 1/12 wymiaru, niepełny kalendarzowy miesiąc pracy w górę;
// - art. 155^3: niepełny dzień w górę, nie więcej niż wymiar z art. 154 § 1 i 2.
// Kodeks cywilny (Dz.U. 2026 poz. 795) przez art. 300 Kp: art. 112 (termin w miesiącach), art. 111 § 2 (termin w dniach).
//
// Przyjęte interpretacje (przepisy ich wprost nie rozstrzygają):
// 1. „Co najmniej 1 miesiąc” liczymy od daty do daty (art. 112 Kc): okres od dnia D trwa miesiąc, gdy obejmuje dni do dnia
//    poprzedzającego datę D w następnym miesiącu; gdy takiej daty nie ma (np. 31 stycznia), do ostatniego dnia następnego
//    miesiąca (wariant, w którym w przypadkach granicznych urlopu wypoczynkowego się nie obniża). Tak samo „dłuższy niż
//    3 miesiące” z art. 174 § 3.
// 2. Za każdy rok objęty nieobecnością: miesiące pracy = miesiące kalendarzowe z co najmniej jednym dniem poza nieobecnością
//    (niepełny miesiąc pracy w górę), urlop = min(wymiar, ceil(wymiar × miesiące / 12)). W roku powrotu to proporcja do okresu
//    pozostałego do końca roku (§ 1), w roku rozpoczęcia obniżenie z § 2. Rok w całości na urlopie: 0 miesięcy, 0 dni.
// 3. Prawo do urlopu w danym roku uznajemy za nabyte 1 stycznia (art. 153 § 2: „w każdym następnym roku kalendarzowym”);
//    nieobecność od 1 stycznia nie „przypada po nabyciu prawa”, więc liczymy wtedy proporcję z § 1.
// 4. Wyjątek z § 2 („chyba że…”): gdy urlop wykorzystany przed nieobecnością jest co najmniej równy obniżonemu wymiarowi,
//    wymiaru za rok rozpoczęcia nie obniżamy (brzmienie: „ulega proporcjonalnemu obniżeniu, chyba że”).
// 5. Urlop wychowawczy: w roku rozpoczęcia (po 1 stycznia) bez obniżenia (§ 2 nie obejmuje pkt 2); w latach następnych
//    proporcja z § 1.
// 6. Art. 174^1: okres wlicza się do okresu pracy u dotychczasowego pracodawcy (§ 2), więc urlopu wypoczynkowego nie
//    obniżamy i stażu nie przesuwamy. Czy art. 155^2 § 1 pkt 1 obejmuje też ten urlop, przepis wprost nie mówi.
// 7. Staż: przesuwamy datę 10 lat o liczbę dni kalendarzowych urlopu bezpłatnego, gdy urlop zaczyna się przed tą datą.
//    Dla nieobecności nieusprawiedliwionej art. 174 § 2 nie ma zastosowania; stażu nie liczymy.
// 8. Prawo do świadczeń zdrowotnych (art. 69 ust. 3 ustawy o świadczeniach, Dz.U. 2025 poz. 1461): „po upływie 30 dni od
//    dnia rozpoczęcia urlopu”; dnia rozpoczęcia nie liczymy (art. 111 § 2 Kc), więc ostatni dzień z prawem = początek + 30.
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

export type PodstawaRoku = 'bez-zmian' | 'proporcja' | 'wykorzystany' | 'wychowawczy' | 'inny-pracodawca';

export interface RokUrlopu {
  rok: number;
  miesiacePracy: number;
  /** Wymiar proporcjonalny do miesięcy pracy (art. 155^2a, 155^3). */
  proporcja: number;
  dni: number;
  podstawa: PodstawaRoku;
}

/** Ostatni dzień okresu `n` miesięcy liczonego od dnia `od` włącznie (art. 112 Kc, wariant opisany w nagłówku). */
export function koniecMiesiecy(od: string, n: number): string {
  const k = dodajMiesiace(od, n);
  return k.slice(8) === od.slice(8) ? dodajDni(k, -1) : k;
}

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
  const coNajmniejMiesiac = d.do >= koniecMiesiecy(d.od, 1);
  const rokOd = Number(d.od.slice(0, 4));
  const rokDo = Number(d.do.slice(0, 4));
  const poNabyciu = d.od.slice(5) !== '01-01';

  const lata: RokUrlopu[] = [];
  for (let rok = rokOd; rok <= rokDo; rok++) {
    const mies = miesiacePracy(rok, d.od, d.do);
    const proporcja = Math.min(d.wymiar, Math.ceil((d.wymiar * mies) / 12));
    let wynik: { dni: number; podstawa: PodstawaRoku };
    if (!coNajmniejMiesiac) wynik = { dni: d.wymiar, podstawa: 'bez-zmian' };
    else if (d.rodzaj === 'inny-pracodawca') wynik = { dni: d.wymiar, podstawa: 'inny-pracodawca' };
    else if (rok === rokOd && poNabyciu && d.rodzaj === 'wychowawczy') wynik = { dni: d.wymiar, podstawa: 'wychowawczy' };
    else if (rok === rokOd && poNabyciu && wykorzystane >= proporcja && proporcja < d.wymiar) wynik = { dni: d.wymiar, podstawa: 'wykorzystany' };
    else wynik = { dni: proporcja, podstawa: proporcja < d.wymiar ? 'proporcja' : 'bez-zmian' };
    lata.push({ rok, miesiacePracy: mies, proporcja, ...wynik });
  }

  // Staż (art. 174 § 2; art. 174^1 § 2; art. 186^5).
  const nieWliczaSie = d.rodzaj === 'bezplatny' ? dni : 0;
  let nowaData10Lat: string | null = null;
  if (d.data10Lat) nowaData10Lat = d.rodzaj === 'bezplatny' && d.od < d.data10Lat ? dodajDni(d.data10Lat, dni) : d.data10Lat;

  const ostatniDzienSwiadczen = dodajDni(d.od, 30);
  return {
    dni,
    coNajmniejMiesiac,
    lata,
    /** Urlop wypoczynkowy w roku rozpoczęcia po odjęciu wykorzystanego przed nieobecnością. */
    doWykorzystaniaWRokuRozpoczecia: Math.max(0, lata[0].dni - wykorzystane),
    dluzszyNiz3Miesiace: d.do > koniecMiesiecy(d.od, 3),
    /** Dni, których nie wlicza się do okresu pracy (art. 174 § 2). */
    nieWliczaSieDoStazu: nieWliczaSie,
    /** O ile dni przesuwa się podana data 10 lat stażu. */
    przesuniecie10Lat: d.data10Lat && nowaData10Lat ? dniMiedzy(d.data10Lat, nowaData10Lat) : 0,
    nowaData10Lat,
    /** Ostatni dzień prawa do świadczeń zdrowotnych z art. 69 ust. 3 (urlop bezpłatny) albo null, gdy urlop jest krótszy. */
    swiadczeniaZdrowotneDo: d.rodzaj === 'bezplatny' && d.do > ostatniDzienSwiadczen ? ostatniDzienSwiadczen : null,
  };
}

const dniTekst = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);

/** Teksty wyniku (te same na serwerze i w przeglądarce; przeglądarka przepuszcza je jeszcze przez typografię). */
export function tekstyWyniku(d: DaneUrlopuBezplatnego) {
  const r = urlopBezplatny(d);
  const wyk = d.wykorzystanePrzed ?? 0;
  const lata = r.lata.map((x) => {
    const opis: Record<PodstawaRoku, string> = {
      proporcja: `praca w ${x.miesiacePracy} z 12 miesięcy`,
      'bez-zmian': r.coNajmniejMiesiac ? `praca w ${x.miesiacePracy} z 12 miesięcy, bez zmian` : 'bez zmian',
      wykorzystany: `bez obniżenia do ${x.proporcja}: wcześniej wykorzystano ${dniTekst(wyk)}`,
      wychowawczy: 'bez obniżenia w roku rozpoczęcia urlopu wychowawczego',
      'inny-pracodawca': 'bez obniżenia (art. 174^1 § 2)',
    };
    return { etykieta: `Urlop wypoczynkowy za ${x.rok}`, wartosc: `${dniTekst(x.dni)} (${opis[x.podstawa]})` };
  });
  const pierwszy = r.lata[0];
  const glowna = dniTekst(pierwszy.dni);
  const opis = r.coNajmniejMiesiac
    ? `Urlop wypoczynkowy za ${pierwszy.rok}; nieobecność ${dniTekst(r.dni)}, co najmniej miesiąc`
    : `Nieobecność ${dniTekst(r.dni)}, krócej niż miesiąc: wymiar się nie zmienia (art. 155^2 § 1)`;

  const pozycje: { etykieta: string; wartosc: string }[] = [];
  if (wyk > 0) pozycje.push({ etykieta: `Zostało do wykorzystania za ${pierwszy.rok}`, wartosc: `${dniTekst(r.doWykorzystaniaWRokuRozpoczecia)} po odjęciu ${dniTekst(wyk)}` });
  const staz: Record<RodzajNieobecnosci, string> = {
    bezplatny: `${dniTekst(r.nieWliczaSieDoStazu)} nie wlicza się (art. 174 § 2)`,
    'inny-pracodawca': 'wlicza się u dotychczasowego pracodawcy (art. 174^1 § 2)',
    wychowawczy: 'wlicza się w dniu zakończenia urlopu (art. 186^5)',
    nieobecnosc: 'art. 174 § 2 dotyczy urlopu bezpłatnego; tej nieobecności nie liczymy',
  };
  pozycje.push({ etykieta: 'Staż pracy', wartosc: staz[d.rodzaj] });
  if (d.data10Lat && r.nowaData10Lat) {
    pozycje.push({
      etykieta: '10 lat stażu (26 dni urlopu)',
      wartosc:
        d.rodzaj === 'nieobecnosc'
          ? 'nie liczymy'
          : r.przesuniecie10Lat
            ? `${dataPoPolsku(r.nowaData10Lat)}, później o ${dniTekst(r.przesuniecie10Lat)}`
            : `bez zmian: ${dataPoPolsku(r.nowaData10Lat)}`,
    });
  }
  if (d.rodzaj === 'bezplatny')
    pozycje.push({
      etykieta: 'Odwołanie z urlopu',
      wartosc: r.dluzszyNiz3Miesiace
        ? 'możliwe z ważnych przyczyn, jeśli strony przewidziały to przy udzielaniu urlopu (art. 174 § 3)'
        : 'art. 174 § 3 dotyczy tylko urlopu dłuższego niż 3 miesiące',
    });

  const ubezpieczenia: Record<RodzajNieobecnosci, string[]> = {
    bezplatny: [
      'Za niezdolność do pracy w czasie urlopu bezpłatnego zasiłek chorobowy nie przysługuje, a tych dni nie wlicza się do okresu zasiłkowego (art. 12 ust. 2 pkt 1 i ust. 3 ustawy zasiłkowej).',
      'Do 30 dni ubezpieczenia chorobowego, po których przysługuje zasiłek, wlicza się okresy sprzed przerwy spowodowanej urlopem bezpłatnym (art. 4 ust. 1–2 ustawy zasiłkowej).',
      r.swiadczeniaZdrowotneDo
        ? `Prawo do świadczeń z ubezpieczenia zdrowotnego tracisz po upływie 30 dni od rozpoczęcia urlopu, czyli po ${dataPoPolsku(r.swiadczeniaZdrowotneDo)} (art. 69 ust. 3 ustawy o świadczeniach opieki zdrowotnej). Możesz ubezpieczyć się dobrowolnie na wniosek złożony w NFZ (art. 68 ust. 1).`
        : 'Urlop kończy się przed upływem 30 dni od jego rozpoczęcia, po którym traci się prawo do świadczeń z ubezpieczenia zdrowotnego (art. 69 ust. 3 ustawy o świadczeniach opieki zdrowotnej).',
      'Zwykłego urlopu bezpłatnego nie ma w wykazie okresów nieskładkowych; są tam urlopy bezpłatne na opiekę nad małymi dziećmi (art. 7 pkt 5 ustawy o emeryturach i rentach z FUS).',
    ],
    'inny-pracodawca': [
      'Jako pracownik innego pracodawcy podlegasz obowiązkowo ubezpieczeniu zdrowotnemu (art. 66 ust. 1 pkt 1 lit. a ustawy o świadczeniach opieki zdrowotnej).',
      'Ustawa zasiłkowa wyłącza zasiłek za niezdolność do pracy „w czasie urlopu bezpłatnego” (art. 12 ust. 2 pkt 1) i nie ma osobnego przepisu o urlopie z art. 174^1 Kodeksu pracy.',
    ],
    wychowawczy: [
      'Za niezdolność do pracy w czasie urlopu wychowawczego zasiłek chorobowy nie przysługuje, a tych dni nie wlicza się do okresu zasiłkowego (art. 12 ust. 2 pkt 2 i ust. 3 ustawy zasiłkowej).',
      'Do 30 dni ubezpieczenia chorobowego, po których przysługuje zasiłek, wlicza się okresy sprzed przerwy spowodowanej urlopem wychowawczym (art. 4 ust. 1–2 ustawy zasiłkowej).',
      'Ubezpieczeniu zdrowotnemu podlegasz z tytułu urlopu wychowawczego, jeśli nie masz innego tytułu (art. 66 ust. 1 pkt 32 ustawy o świadczeniach opieki zdrowotnej).',
      'Urlop wychowawczy przed nabyciem prawa do emerytury lub renty to okres nieskładkowy: do 3 lat na każde dziecko w wieku do 4 lat, łącznie do 6 lat (art. 7 pkt 5 lit. a ustawy o emeryturach i rentach z FUS).',
    ],
    nieobecnosc: [
      'Przepisy o zasiłku chorobowym i prawie do świadczeń zdrowotnych, z których liczymy (art. 4 i 12 ustawy zasiłkowej, art. 66–69 ustawy o świadczeniach opieki zdrowotnej), nie mówią o nieobecności nieusprawiedliwionej.',
    ],
  };
  return { wynik: r, glowna, opis, lata, pozycje, ubezpieczenia: ubezpieczenia[d.rodzaj] };
}
