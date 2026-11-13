// Praca na wysokości: czy to praca na wysokości, jakie zabezpieczenia, praca szczególnie niebezpieczna, szkolenie,
// badania lekarskie oraz zakazy dla młodocianych i kobiet w ciąży.
//
// Przepisy (stan na 13.11.2026):
// - Rozporządzenie w sprawie ogólnych przepisów BHP, t.j. Dz.U. 2003 poz. 1650 ze zm. (Dz.U. 2007 poz. 330: nowe § 50,
//   § 81 i § 110 ust. 1 pkt 3; 2021 poz. 2088: załącznik nr 2 o ŚOI; 2026 poz. 927 dodaje tylko § 30a od 11.01.2027;
//   tekst HTML jednolity w API jest sprzed 2007 r., więc cytujemy brzmienie po zmianach):
//   § 80 (prace z rozdziału 6, w tym część E „Prace na wysokości”, są szczególnie niebezpieczne; wykaz u pracodawcy),
//   § 81 (nadzór, środki zabezpieczające, instruktaż, dostęp tylko dla upoważnionych),
//   § 105 (od 1,0 m nad podłogą lub ziemią; wyjątki: osłona ścianami do 1,5 m ze wszystkich stron albo inne stałe
//   konstrukcje chroniące przed upadkiem), § 106 (balustrada powyżej 1,0 m: poręcz 1,1 m, krawężnik 0,15 m, poprzeczka;
//   gdy niemożliwa, inne skuteczne środki; rampy przeładunkowe bez wymogu balustrady), § 107 (bez wychylania się),
//   § 108 (do 2 m: stabilne drabiny i pomosty, informacja o obciążeniu), § 109 (rusztowania powyżej 2 m),
//   § 110 (powyżej 2 m na słupach, konstrukcjach, drabinach i klamrach, przy ustawianiu rusztowań: szelki z linką
//   i hełm; ust. 2: to samo na pomostach i podwyższeniach, gdy praca wymaga wychylenia lub wymuszonej pozycji),
//   załącznik nr 2 § 1 (ŚOI, gdy ochrona zbiorowa nie wystarcza).
// - Rozporządzenie w sprawie minimalnych wymagań BHP przy użytkowaniu maszyn, Dz.U. 2002 poz. 1596, zm. 2003 poz. 1745:
//   § 8a ust. 1 pkt 2 (pierwszeństwo ochrony zbiorowej), ust. 2 (pogoda), § 8b ust. 1 (drabina jako stanowisko pracy
//   tylko przy niskim ryzyku i krótkotrwałej pracy).
// - Rozporządzenie w sprawie szkolenia BHP, t.j. Dz.U. 2024 poz. 1327 (zmiana 2025 poz. 1640 tylko § 12): § 11 ust. 1
//   (instruktaż stanowiskowy przed dopuszczeniem), § 15 ust. 1 (stanowiska z pracami szczególnie niebezpiecznymi: nie
//   rzadziej niż raz w roku).
// - Rozporządzenie o badaniach lekarskich, t.j. Dz.U. 2023 poz. 607 (zmiany 2026 poz. 456 i 726 bez zmian w załączniku
//   nr 1): załącznik nr 1, część V lp. 5 „Praca na wysokości” (zakres i częstotliwość według wieku). Podziału na „do 3 m”
//   i „powyżej 3 m” w obowiązującym tekście nie ma.
// - Rozporządzenie w sprawie prac wzbronionych młodocianym, Dz.U. 2023 poz. 1240: załącznik nr 1 cz. III pkt 11 („prace
//   na wysokości powyżej 3 m”), załącznik nr 2 cz. III pkt 9 lit. d (powyżej 16 lat w przygotowaniu zawodowym: do 2 godzin
//   na dobę, przy pełnym zabezpieczeniu), § 3–4.
// - Rozporządzenie w sprawie prac wzbronionych kobietom w ciąży i karmiącym, Dz.U. 2017 poz. 796: załącznik cz. VIII
//   ust. 2 (praca na wysokości poza stałymi podwyższeniami z pełnym zabezpieczeniem oraz drabiny i klamry).
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 176, 204, 207 § 2¹, 210 § 1–3, 211 pkt 4.
// - Rozporządzenie o pracach wymagających szczególnej sprawności psychofizycznej, Dz.U. 1996 poz. 287: pkt 2
//   (podnośniki i platformy hydrauliczne).
//
// Interpretacje (przepis nie rozstrzyga; opis na stronie w „Jak liczymy”):
// 1. Wysokość to wysokość powierzchni, na której stoisz, nad podłogą lub ziemią (§ 105 mówi o „powierzchni”). Porównujemy
//    w centymetrach: 1,0 m to już praca na wysokości (§ 105 „co najmniej”), ale balustrada jest wymagana dopiero powyżej
//    1,0 m (§ 106 „powyżej”); 2,0 m mieści się w § 108 („do 2 m”), wymagania § 109–110 od 2,01 m; młodociani: zakaz
//    od 3,01 m („powyżej 3 m”).
// 2. Balustrada albo inna stała osłona wyłącza pracę z definicji (§ 105 ust. 2 pkt 2, dosłownie). Gdy praca wymaga
//    wychylania się poza nią albo wymuszonej pozycji, osłona nie chroni: wtedy traktujemy pracę jak pracę na wysokości
//    i stosujemy § 110 ust. 2 (wariant bezpieczny). Na drabinie, klamrach, rusztowaniu i podnośniku wyjątku nie
//    stosujemy (sprzęt do tymczasowej pracy na wysokości, nie stała powierzchnia z osłoną; wariant bezpieczny).
// 3. § 110 ust. 2 odsyła do podwyższeń „o których mowa w § 108”; stosujemy go do pomostów i podwyższeń na każdej
//    wysokości od 1,0 m (wariant bezpieczny).
// 4. Kobieta w ciąży: wyjątek dotyczy tylko stałych podwyższeń z pełnym zabezpieczeniem bez ŚOI, więc rusztowanie,
//    podnośnik, rampa bez balustrady i otwarta krawędź są zakazane od 1,0 m, a drabiny i klamry na każdej wysokości.
// 5. Młodociani: zakaz powyżej 3 m bez wyjątku dla balustrad (przepis go nie przewiduje).
// 6. Badania: rozporządzenie nie definiuje pracy na wysokości; wiersz o badaniach pokazujemy, gdy praca spełnia § 105.

import { liczba } from './format';

export type Miejsce = 'pomost' | 'drabina' | 'rusztowanie' | 'podnosnik' | 'konstrukcja' | 'rampa';
export type Oslona = 'sciany' | 'balustrada' | 'brak';
export type Osoba = 'dorosly' | 'mlodociany' | 'ciaza';

export const MIEJSCA: readonly Miejsce[] = ['pomost', 'drabina', 'rusztowanie', 'podnosnik', 'konstrukcja', 'rampa'];
export const OSLONY: readonly Oslona[] = ['sciany', 'balustrada', 'brak'];
export const OSOBY: readonly Osoba[] = ['dorosly', 'mlodociany', 'ciaza'];

/** Miejsca, na których osłona powierzchni (§ 105 ust. 2) ma sens; na drabinie i klamrach jej nie ma. */
export const maOslone = (m: Miejsce) => m !== 'drabina';

export interface DanePracy {
  /** Wysokość powierzchni, na której stoisz, nad podłogą lub ziemią (m). */
  wysokosc: number;
  miejsce: Miejsce;
  oslona: Oslona;
  /** Praca wymaga wychylania się poza balustradę lub obrys albo wymuszonej pozycji ciała. */
  wychylanie: boolean;
  osoba: Osoba;
}

export const MAKS_WYSOKOSC = 300;

export type Zabezpieczenie = 'brak-wymogu' | 'balustrada' | 'balustrada-1m' | 'rampa' | 'stabilne' | 'rusztowanie' | 'szelki';

export interface WynikPracy {
  cm: number;
  /** Praca na wysokości w rozumieniu § 105. */
  naWysokosci: boolean;
  /** Powód, gdy nie: za nisko albo osłona z § 105 ust. 2. */
  wylaczenie: 'nisko' | 'sciany' | 'balustrada' | null;
  zabezpieczenie: Zabezpieczenie;
  /** Czy na otwartej powierzchni brakuje balustrady wymaganej w § 106. */
  brakBalustrady: boolean;
  mlodociany: 'nie-dotyczy' | 'dozwolone' | 'wzbronione';
  ciaza: 'nie-dotyczy' | 'dozwolone' | 'wzbronione';
}

/** Wysokość w centymetrach; RangeError, gdy spoza zakresu albo z więcej niż dwoma miejscami po przecinku. */
export function centymetry(m: number): number {
  if (!(Number.isFinite(m) && m >= 0 && m <= MAKS_WYSOKOSC)) throw new RangeError('Wysokość spoza zakresu');
  const cm = Math.round(m * 100);
  if (Math.abs(cm - m * 100) > 1e-6) throw new RangeError('Najwyżej dwa miejsca po przecinku');
  return cm;
}

export function sprawdzPrace(d: DanePracy): WynikPracy {
  const cm = centymetry(d.wysokosc);
  const oslona = maOslone(d.miejsce) ? d.oslona : 'brak';
  // § 105 ust. 2: osłona ścianami albo stałą konstrukcją wyłącza pracę z definicji, chyba że praca wymaga wychylania się
  // poza nią (interpretacja 2). Podnośnik i rusztowanie nie są stałą osłoną powierzchni w hali: wyłączenie tylko dla
  // ścian i stałych balustrad pomostów, konstrukcji i ramp.
  const stala = d.miejsce === 'pomost' || d.miejsce === 'konstrukcja' || d.miejsce === 'rampa';
  let wylaczenie: WynikPracy['wylaczenie'] = null;
  if (cm < 100) wylaczenie = 'nisko';
  else if (!d.wychylanie && oslona === 'sciany') wylaczenie = 'sciany';
  else if (!d.wychylanie && oslona === 'balustrada' && stala) wylaczenie = 'balustrada';
  const naWysokosci = wylaczenie === null;

  let zabezpieczenie: Zabezpieczenie = 'brak-wymogu';
  if (cm >= 100) {
    if (d.miejsce === 'drabina') zabezpieczenie = cm > 200 || d.wychylanie ? 'szelki' : 'stabilne';
    else if (d.miejsce === 'konstrukcja' && cm > 200) zabezpieczenie = 'szelki';
    else if (d.wychylanie) zabezpieczenie = 'szelki';
    else if (d.miejsce === 'rusztowanie' && cm > 200) zabezpieczenie = 'rusztowanie';
    else if (d.miejsce === 'rampa') zabezpieczenie = 'rampa';
    else if (oslona === 'sciany') zabezpieczenie = 'brak-wymogu';
    else zabezpieczenie = cm > 100 ? 'balustrada' : 'balustrada-1m';
  }
  const brakBalustrady = cm > 100 && d.miejsce !== 'drabina' && d.miejsce !== 'rampa' && oslona === 'brak';

  const mlodociany = d.osoba !== 'mlodociany' ? 'nie-dotyczy' : cm > 300 ? 'wzbronione' : 'dozwolone';
  let ciaza: WynikPracy['ciaza'] = 'nie-dotyczy';
  if (d.osoba === 'ciaza') {
    // Cz. VIII ust. 2: drabiny i klamry zawsze; praca na wysokości poza stałymi podwyższeniami z pełnym zabezpieczeniem.
    const pelne = stala && (oslona === 'sciany' || oslona === 'balustrada') && !d.wychylanie;
    ciaza = d.miejsce === 'drabina' || (cm >= 100 && !pelne) ? 'wzbronione' : 'dozwolone';
  }
  return { cm, naWysokosci, wylaczenie, zabezpieczenie, brakBalustrady, mlodociany, ciaza };
}

// ——— Teksty wyniku (wspólne dla HTML z serwera i skryptu w przeglądarce) ———

export interface Wiersz {
  dt: string;
  dd: string;
  opis: string;
}
export interface TekstyPracy {
  glowny: string;
  podstawa: string;
  wiersze: Wiersz[];
  uwagi: string[];
}

const OGOLNE = 'ogólnych przepisów BHP';
const metry = (cm: number) => `${liczba(cm / 100)} m`;

const ZABEZPIECZENIA: Record<Zabezpieczenie, [string, string]> = {
  'brak-wymogu': ['Bez szczególnych wymagań', ''],
  balustrada: [
    'Balustrada: poręcz 1,1 m, krawężnik 0,15 m',
    `Na powierzchniach powyżej 1,0 m, na których przebywają pracownicy albo którymi się przechodzi, powinny być balustrady: poręcz ochronna na wysokości co najmniej 1,1 m, krawężnik co najmniej 0,15 m, a między nimi w połowie wysokości poprzeczka albo wypełnienie. Gdy balustrada jest niemożliwa, stosuje się inne skuteczne środki ochrony przed upadkiem (§ 106 ust. 1–2 ${OGOLNE}). Praca nie może zmuszać do wychylania się poza poręcz (§ 107).`,
  ],
  'balustrada-1m': [
    'Środki zabezpieczające',
    `Dokładnie 1,0 m to już praca na wysokości (§ 105 ust. 1 ${OGOLNE}: „co najmniej 1,0 m”), ale balustradę z § 106 przepis wymaga dopiero powyżej 1,0 m. Przy pracy szczególnie niebezpiecznej pracodawca i tak zapewnia odpowiednie środki zabezpieczające (§ 81 ust. 1 pkt 2).`,
  ],
  rampa: [
    'Rampa: bez wymogu balustrady',
    `Wymóg balustrady nie dotyczy ramp przeładunkowych (§ 106 ust. 3 ${OGOLNE}). Praca na rampie od 1,0 m pozostaje pracą na wysokości, a pracodawca zapewnia odpowiednie środki zabezpieczające (§ 81 ust. 1 pkt 2).`,
  ],
  stabilne: [
    'Stabilna drabina, bez szelek',
    `Do 2 m, bez wychylania się poza obrys i bez wymuszonej pozycji, drabina, klamry i pomost mają być stabilne, zabezpieczone przed przesunięciem i wytrzymałe na obciążenie (§ 108 pkt 1 ${OGOLNE}). Drabina może być stanowiskiem pracy tylko wtedy, gdy bezpieczniejszy sprzęt nie jest uzasadniony z powodu niskiego ryzyka i krótkiej pracy albo okoliczności, których pracodawca nie może zmienić; przez cały czas musisz móc bezpiecznie trzymać się drabiny (§ 8b ust. 1 i 3 rozporządzenia o użytkowaniu maszyn).`,
  ],
  rusztowanie: [
    'Rusztowanie po odbiorze technicznym',
    `Na rusztowaniach powyżej 2 m pracodawca zapewnia bezpieczne wejście i dojście, stabilność i wytrzymałość rusztowania, a przed użyciem odbiór techniczny (§ 109 ust. 1 ${OGOLNE}). Przy ustawianiu i rozbiórce rusztowania obowiązują szelki z linką i hełm (§ 110 ust. 1).`,
  ],
  szelki: [
    'Szelki z linką i hełm',
    `Przed pracą sprawdza się stan konstrukcji i punktów mocowania linek; pracownicy używają sprzętu chroniącego przed upadkiem, np. szelek bezpieczeństwa z linką przymocowaną do stałych elementów konstrukcji, oraz hełmów ochronnych (§ 110 ust. 1 ${OGOLNE}). Dotyczy to pracy powyżej 2 m na drabinach, klamrach, słupach i konstrukcjach, a na pomostach i podwyższeniach także niżej, gdy praca wymaga wychylania się albo wymuszonej pozycji (§ 110 ust. 2).`,
  ],
};

const MIEJSCE_NAZWA: Record<Miejsce, string> = {
  pomost: 'na pomoście lub antresoli',
  drabina: 'na drabinie lub klamrach',
  rusztowanie: 'na rusztowaniu',
  podnosnik: 'na podnośniku lub platformie',
  konstrukcja: 'na dachu, słupie lub konstrukcji',
  rampa: 'na rampie przeładunkowej',
};

export function tekstyPracy(d: DanePracy, w: WynikPracy): TekstyPracy {
  const h = metry(w.cm);
  const gdzie = MIEJSCE_NAZWA[d.miejsce];
  let glowny: string;
  let podstawa: string;
  if (w.naWysokosci) {
    glowny = 'To praca na wysokości';
    podstawa = `Praca ${gdzie} ${h} nad podłogą lub ziemią: pracą na wysokości jest praca na powierzchni co najmniej 1,0 m nad poziomem podłogi lub ziemi (§ 105 ust. 1 ${OGOLNE}).`;
    if (d.wychylanie && d.oslona !== 'brak' && maOslone(d.miejsce))
      podstawa += ' Osłona nie wyłącza tej pracy, bo praca wymaga wychylania się poza nią albo wymuszonej pozycji (nasz wariant bezpieczny, opisany niżej).';
  } else if (w.wylaczenie === 'nisko') {
    glowny = 'To nie jest praca na wysokości';
    podstawa = `Powierzchnia jest ${h} nad podłogą lub ziemią, a praca na wysokości zaczyna się od 1,0 m (§ 105 ust. 1 ${OGOLNE}).`;
  } else {
    glowny = 'To nie jest praca na wysokości';
    podstawa =
      w.wylaczenie === 'sciany'
        ? `Do pracy na wysokości nie zalicza się pracy na powierzchni osłoniętej ze wszystkich stron do wysokości co najmniej 1,5 m pełnymi ścianami lub ścianami z oknami, bez względu na wysokość (§ 105 ust. 2 pkt 1 ${OGOLNE}).`
        : `Do pracy na wysokości nie zalicza się pracy na powierzchni wyposażonej w stałe konstrukcje lub urządzenia chroniące przed upadkiem, np. balustradę, bez względu na wysokość (§ 105 ust. 2 pkt 2 ${OGOLNE}).`;
  }

  const wiersze: Wiersz[] = [];
  wiersze.push(
    w.naWysokosci
      ? {
          dt: 'Praca szczególnie niebezpieczna',
          dd: 'Tak',
          opis: `Prace na wysokości są pracami szczególnie niebezpiecznymi (§ 80 ust. 1 i § 105 ${OGOLNE}). Pracodawca zapewnia bezpośredni nadzór wyznaczonej osoby, odpowiednie środki zabezpieczające i instruktaż z imiennym podziałem pracy, kolejnością zadań i wymaganiami BHP, a do miejsca pracy dopuszcza tylko osoby upoważnione i poinstruowane (§ 81). Drugiej osoby do asekuracji przepis przy tej pracy nie wymaga.`,
        }
      : {
          dt: 'Praca szczególnie niebezpieczna',
          dd: 'Nie z tego powodu',
          opis: `Pracodawca może jednak uznać za szczególnie niebezpieczną inną pracę o zwiększonym zagrożeniu i wpisać ją do swojego wykazu (§ 80 ${OGOLNE}).`,
        },
  );
  if (w.cm >= 100 && (w.naWysokosci || w.zabezpieczenie !== 'brak-wymogu')) {
    const [dd, opis] = ZABEZPIECZENIA[w.zabezpieczenie];
    if (opis) wiersze.push({ dt: 'Zabezpieczenie', dd, opis });
  }
  if (w.naWysokosci) {
    wiersze.push({
      dt: 'Szkolenie BHP',
      dd: 'Nie rzadziej niż raz w roku',
      opis: 'Na stanowiskach robotniczych z pracami szczególnie niebezpiecznymi szkolenie okresowe jest nie rzadziej niż raz w roku (§ 15 ust. 1 rozporządzenia w sprawie szkolenia BHP), a przed dopuszczeniem do pracy odbywasz instruktaż stanowiskowy zakończony sprawdzianem (§ 11 ust. 1 i 6).',
    });
    wiersze.push({
      dt: 'Badania lekarskie',
      dd: 'Równowaga, słuch, wzrok, cukier',
      opis: 'Badanie ze szczególnym zwróceniem uwagi na narząd równowagi, badanie słuchu (akumetryczne), wzrok (ostrość, barwy, widzenie przestrzenne, pole widzenia) i poziom glukozy we krwi. Badania okresowe: do 25. roku życia co 3 lata, od 25. do 50. co 2–3 lata, powyżej 50. co 1–2 lata (załącznik nr 1, cz. V lp. 5 rozporządzenia o badaniach lekarskich).',
    });
  }
  if (w.mlodociany === 'wzbronione')
    wiersze.push({
      dt: 'Młodociani',
      dd: 'Wzbronione powyżej 3 m',
      opis: 'Prace na wysokości powyżej 3 m są wzbronione młodocianym (załącznik nr 1 cz. III pkt 11 rozporządzenia o pracach wzbronionych młodocianym), także na pomoście z balustradą: przepis nie robi wyjątku. Osoba powyżej 16 lat może je wykonywać tylko w przygotowaniu zawodowym, do 2 godzin na dobę, przy pełnym zabezpieczeniu przed upadkiem i pod stałym nadzorem (załącznik nr 2 cz. III pkt 9 lit. d, § 3–4).',
    });
  else if (w.mlodociany === 'dozwolone')
    wiersze.push({
      dt: 'Młodociani',
      dd: 'Nie wzbronione do 3 m',
      opis: `Wykaz prac wzbronionych młodocianym obejmuje prace na wysokości powyżej 3 m (załącznik nr 1 cz. III pkt 11).${w.naWysokosci ? ' Niżej to nadal praca szczególnie niebezpieczna, z nadzorem i zabezpieczeniami.' : ''}`,
    });
  if (w.ciaza === 'wzbronione')
    wiersze.push({
      dt: 'W ciąży',
      dd: 'Nie wolno',
      opis: `Kobiecie w ciąży nie wolno pracować na wysokości poza stałymi galeriami, pomostami, podestami i innymi stałymi podwyższeniami z pełnym zabezpieczeniem przed upadkiem, bez potrzeby używania środków ochrony indywidualnej, ani wchodzić i schodzić po drabinach i klamrach${d.miejsce === 'drabina' && w.cm < 100 ? ', także poniżej 1 m' : ''} (załącznik cz. VIII ust. 2 rozporządzenia o pracach wzbronionych kobietom w ciąży, art. 176 Kodeksu pracy). Zakaz nie dotyczy kobiet karmiących.`,
    });
  else if (w.ciaza === 'dozwolone' && w.cm < 100)
    wiersze.push({
      dt: 'W ciąży',
      dd: 'Nie wzbronione poniżej 1 m',
      opis: 'Praca na wysokości zaczyna się od 1,0 m (§ 105 ust. 1 ogólnych przepisów BHP). Wchodzenie i schodzenie po drabinach i klamrach jest kobietom w ciąży zakazane na każdej wysokości (załącznik cz. VIII ust. 2 rozporządzenia o pracach wzbronionych kobietom w ciąży).',
    });
  else if (w.ciaza === 'dozwolone')
    wiersze.push({
      dt: 'W ciąży',
      dd: 'Dozwolone przy pełnym zabezpieczeniu',
      opis: 'Zakaz nie obejmuje stałych galerii, pomostów, podestów i podwyższeń z pełnym zabezpieczeniem przed upadkiem, bez potrzeby używania środków ochrony indywidualnej; drabiny i klamry są zakazane zawsze (załącznik cz. VIII ust. 2 rozporządzenia o pracach wzbronionych kobietom w ciąży).',
    });

  const uwagi: string[] = [];
  if (w.brakBalustrady)
    uwagi.push(`Otwarta krawędź powyżej 1,0 m: powinna być balustrada albo, gdy to niemożliwe, inne skuteczne środki ochrony przed upadkiem (§ 106 ${OGOLNE}). Środki ochrony indywidualnej, np. szelki, stosuje się, gdy organizacja pracy i ochrona zbiorowa nie wystarczają (załącznik nr 2 § 1).`);
  if (w.naWysokosci || w.cm >= 100)
    uwagi.push('Gdy warunki pracy nie odpowiadają przepisom BHP i stwarzają bezpośrednie zagrożenie dla zdrowia lub życia, masz prawo powstrzymać się od pracy, zawiadamiając niezwłocznie przełożonego; zachowujesz wynagrodzenie i nie możesz ponieść z tego powodu konsekwencji (art. 210 § 1, 2¹ i 3 Kodeksu pracy). Sprzęt ochronny daje pracodawca bez opłat (art. 207 § 2¹), a Ty używasz go zgodnie z przeznaczeniem (art. 211 pkt 4).');
  if (d.miejsce === 'podnosnik' && w.cm >= 100)
    uwagi.push('Obsługa podnośników i platform hydraulicznych to praca wymagająca szczególnej sprawności psychofizycznej (pkt 2 załącznika do rozporządzenia z 28 maja 1996 r.). Czy potrzebne jest też zaświadczenie kwalifikacyjne UDT, zależy od rodzaju urządzenia.');
  if ((d.miejsce === 'rusztowanie' || d.miejsce === 'konstrukcja' || d.miejsce === 'drabina') && w.cm >= 100)
    uwagi.push('Tymczasową pracę na wysokości wykonuje się tylko wtedy, gdy warunki pogodowe nie zagrażają bezpieczeństwu i zdrowiu pracowników (§ 8a ust. 2 rozporządzenia o użytkowaniu maszyn).');
  return { glowny, podstawa, wiersze, uwagi };
}
