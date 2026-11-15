// Co wolno na zwolnieniu lekarskim: czy dana czynność odbiera zasiłek chorobowy i wynagrodzenie chorobowe, za jaki okres,
// jak przebiega kontrola i do kiedy odwołać się od decyzji ZUS.
// Przepisy (teksty z API Sejmu, sprawdzone 2026-11-15; notatki badacza: raporty/l4/PRZEPISY.md):
// - ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854 (stan na 17 czerwca 2026 r.; późniejsza zmiana Dz.U. 2026 poz. 1123 dotyczy
//   tylko art. 32): art. 17 ust. 1–1c w brzmieniu od 13 kwietnia 2026 r. i ust. 1d–1e od 1 stycznia 2027 r. (art. 13 pkt 2
//   i art. 43 ustawy z 18 grudnia 2025 r., Dz.U. 2026 poz. 26, ogłoszonej 12 stycznia 2026 r.); dawne brzmienie art. 17
//   ust. 1 i 3 z t.j. Dz.U. 2025 poz. 501; przepisy przejściowe: art. 39 (postępowania w sprawie art. 17 ust. 1 wszczęte przed
//   13 kwietnia 2026 r.: przepisy dotychczasowe) i art. 42 (kontrole wszczęte przed tą datą: przepisy dotychczasowe);
//   art. 8 ust. 1 (182 albo 270 dni), art. 55 ust. 3 pkt 7 (wskazania lekarskie: chory powinien leżeć albo może chodzić),
//   art. 59 ust. 3 pkt 1, ust. 5d–5f, 6 i 13 (badanie u lekarza orzecznika, adres pobytu, zmiana adresu w 3 dni, utrata
//   ważności zaświadczenia, zwrot kosztów przejazdu), art. 61 ust. 1 (kto wypłaca zasiłki: płatnik z ponad 20 ubezpieczonymi
//   albo ZUS), art. 63 ust. 1 (wniosek do ZUS o ustalenie uprawnień), art. 66 ust. 2 (potrącenie albo ściągnięcie zasiłku
//   pobranego wskutek okoliczności z art. 17), art. 68–68e (kontrola: kto, upoważnienie, legitymacja, miejsce, obowiązki,
//   protokół, zastrzeżenia w 7 dni od otrzymania protokołu, rozstrzyga ZUS);
// - rozporządzenie MRPiPS z 8 kwietnia 2026 r. w sprawie wzoru upoważnienia i protokołu kontroli (Dz.U. 2026 poz. 503, od
//   13 kwietnia 2026 r.); rozporządzenie z 27 lipca 1999 r. (Dz.U. 1999 nr 65 poz. 743) straciło wtedy moc;
// - ustawa o systemie ubezpieczeń społecznych, t.j. Dz.U. 2026 poz. 1474: art. 83 ust. 1 pkt 4, ust. 2 i 5 (decyzja ZUS
//   i odwołanie przez jednostkę, która ją wydała);
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 92 § 1 i § 3 pkt 2 (wynagrodzenie chorobowe nie przysługuje, gdy nie ma
//   prawa do zasiłku), art. 291 § 1 (przedawnienie 3 lata);
// - KPC, t.j. Dz.U. 2026 poz. 468: art. 165 § 1, art. 476 § 1 pkt 1 i § 2, art. 477⁹ § 1, 3 i 5 (odwołanie w miesiąc od
//   doręczenia decyzji); Kodeks cywilny, t.j. Dz.U. 2026 poz. 795: art. 111 § 2, art. 112, art. 115.
//
// Interpretacje (opisane w „Jak liczymy”):
// - Brzmienie przepisu wybieramy według dnia czynności: przed 13 kwietnia 2026 r. dawne art. 17 ust. 1 (bez definicji), od
//   tego dnia ust. 1–1c, od 1 stycznia 2027 r. także ust. 1d–1e. Art. 39 ustawy zmieniającej mówi tylko o postępowaniach
//   wszczętych przed 13 kwietnia 2026 r.; o późniejszych postępowaniach w sprawie wcześniejszych zdarzeń milczy.
// - „Cały okres zwolnienia” to okres zwolnienia, w czasie którego była czynność (od–do wpisane w formularzu): ustawa nie mówi,
//   czy kolejne zwolnienia bez przerwy liczą się razem, więc liczymy tylko wpisane.
// - Ustawa nie wylicza „zwykłych czynności dnia codziennego”; zakupy, aptekę i sprawy domowe zaliczamy do nich w zwykłym
//   znaczeniu słów, ale zawsze z warunkiem z ust. 1b (nie utrudniają ani nie wydłużają leczenia). Wizyta u lekarza i badania
//   służą leczeniu. Sport, remont i impreza: ocena ZUS (art. 68 ust. 1e), bez werdyktu „wolno”.
// - Wskazanie „chory powinien leżeć” jest w zaświadczeniu (art. 55 ust. 3 pkt 7), ale żaden przepis nie mówi, czego przy nim
//   nie wolno; piszemy to wprost zamiast zgadywać.
// - Od 1 stycznia 2027 r. praca w tytule, z którego na żądanie nie wystawiono zwolnienia (ust. 1d): ustawa nie mówi wprost,
//   że nie jest wtedy pracą zarobkową z ust. 1a, choć taki jest sens ust. 1c–1d; werdykt z warunkiem i to zastrzeżenie.
// - Dawne brzmienie przy pracy na polecenie i jednej pilnej sprawie: przepis nie definiował pracy zarobkowej, więc
//   werdykt „ryzyko”, a nie „nie wolno” (oceniał ZUS albo płatnik z art. 61 ust. 1 pkt 1, art. 17 ust. 3 dawny).
// - Przepisy o kontroli wybieramy według dnia otrzymania protokołu (przybliżenie dnia wszczęcia kontroli z art. 42):
//   protokół sprzed 13 kwietnia 2026 r. to dawna kontrola (art. 68 ust. 1 dawny, § 1, 8–10 rozporządzenia z 1999 r.: uwagi
//   do protokołu bez terminu), bez terminu 7 dni z art. 68e ust. 4.
// - Odwołanie: miesiąc od doręczenia (art. 112 KC przez art. 165 § 1 KPC); gdy koniec wypada w sobotę albo dzień wolny,
//   pokazujemy dwie daty: „zdąż do” bez przesunięcia i ostatni dzień według art. 115 KC (DECYZJE.md, 2026-11-15).
// - Zastrzeżenia do protokołu: 7 dni od otrzymania, dnia otrzymania nie wliczamy (jak art. 111 § 2 KC); ustawa zasiłkowa
//   nie odsyła do KC i nie mówi o sobocie, więc podajemy tylko datę bez przesunięcia.
import { odmiana } from '../redakcja';
import { zaIle } from './choroba-zawodowa';
import { przesunZDniaWolnego } from './termin-odwolania';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajMiesiace, poprawnaData } from './terminy';

export type Czynnosc = 'inna-praca' | 'polecenie' | 'incydentalna' | 'zakupy' | 'lekarz' | 'dom' | 'wyjazd' | 'wysilek';
export type Wskazanie = 'chodzic' | 'lezec';
export type Kontrola = 'nikt' | 'zus' | 'pracodawca';
/** Brzmienie art. 17 według dnia czynności. */
export type Brzmienie = 'dawne' | 'nowe' | 'od2027';
export type Werdykt = 'wolno' | 'warunek' | 'zalezy' | 'nie';
export type KlasaStatusu = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';

/** `krotko` na listę (telefon ucina długie opcje), `opis` pod polem; `praca`: czy to czynność zarobkowa (ust. 1a). */
export const CZYNNOSCI: Record<Czynnosc, { krotko: string; opis: string; praca: boolean }> = {
  'inna-praca': { krotko: 'Praca w innej firmie', opis: 'Inny pracodawca, zlecenie, dzieło albo własna firma.', praca: true },
  polecenie: { krotko: 'Praca dla pracodawcy', opis: 'Maile, telefony albo przyjście do firmy, bo prosi o to pracodawca.', praca: true },
  incydentalna: { krotko: 'Jedna pilna sprawa', opis: 'Jednorazowa czynność, której wymagają istotne okoliczności, np. podpis, którego nie da się przełożyć.', praca: false },
  zakupy: { krotko: 'Zakupy, apteka', opis: 'Zakupy spożywcze, apteka, poczta.', praca: false },
  lekarz: { krotko: 'Lekarz, badania', opis: 'Wizyta u lekarza, badania, zabiegi i rehabilitacja.', praca: false },
  dom: { krotko: 'Dziecko, sprawy domowe', opis: 'Opieka nad dzieckiem, gotowanie, zwykłe sprawy w domu.', praca: false },
  wyjazd: { krotko: 'Wyjazd z domu', opis: 'Pobyt u rodziny, na działce, na wyjeździe.', praca: false },
  wysilek: { krotko: 'Sport, remont, impreza', opis: 'Trening, cięższe prace w domu albo w ogrodzie, impreza.', praca: false },
};

export const WSKAZANIA: Record<Wskazanie, string> = {
  chodzic: 'Chory może chodzić',
  lezec: 'Chory powinien leżeć',
};

export const KONTROLE: Record<Kontrola, string> = {
  nikt: 'Nikt (jeszcze)',
  zus: 'ZUS',
  pracodawca: 'Pracodawca',
};

/** Pierwszy dzień nowego brzmienia art. 17 (art. 43 ustawy z 18 grudnia 2025 r.: 3 miesiące od ogłoszenia 12 stycznia 2026 r.). */
export const OD_NOWEGO = '2026-04-13';
/** Pierwszy dzień art. 17 ust. 1d–1e (art. 43 pkt 3 tej ustawy). */
export const OD_2027 = '2027-01-01';
/** Najdłuższy okres zasiłkowy (art. 8 ust. 1 ustawy zasiłkowej: 270 dni przy gruźlicy i w ciąży). */
export const MAKS_DNI_ZWOLNIENIA = 270;
export const DNI_ZASTRZEZEN = 7;
export const MIESIACE_ODWOLANIA = 1;
const NAJWCZESNIEJ = '2000-01-01';
const NAJPOZNIEJ = '2100-12-31';

export const brzmienie = (dzien: string): Brzmienie => (dzien < OD_NOWEGO ? 'dawne' : dzien < OD_2027 ? 'nowe' : 'od2027');

export const TYTUL_BRZMIENIA: Record<Brzmienie, string> = {
  dawne: 'Przepis w brzmieniu do 12 kwietnia 2026 r.',
  nowe: 'Przepisy od 13 kwietnia 2026 r.',
  od2027: 'Przepisy od 1 stycznia 2027 r.',
};

export const CYTAT_DAWNY =
  '„Ubezpieczony wykonujący w okresie orzeczonej niezdolności do pracy pracę zarobkową lub wykorzystujący zwolnienie od pracy w sposób niezgodny z celem tego zwolnienia traci prawo do zasiłku chorobowego za cały okres tego zwolnienia.” (art. 17 ust. 1 w brzmieniu do 12 kwietnia 2026 r.)';
export const CYTAT_1 =
  '„Ubezpieczony traci prawo do zasiłku chorobowego za cały okres zwolnienia od pracy, w przypadku gdy w okresie orzeczonej niezdolności do pracy: 1) wykonuje pracę zarobkową lub 2) podejmuje aktywność niezgodną z celem tego zwolnienia.” (art. 17 ust. 1)';
export const CYTAT_1A =
  '„Pracą zarobkową, o której mowa w ust. 1 pkt 1, jest każda czynność mająca charakter zarobkowy, niezależnie od stosunku prawnego będącego podstawą jej wykonania, z wyłączeniem czynności incydentalnych, których podjęcia w okresie zwolnienia od pracy wymagają istotne okoliczności. Istotną okolicznością nie może być polecenie pracodawcy.” (art. 17 ust. 1a)';
export const CYTAT_1B =
  '„Aktywnością niezgodną z celem zwolnienia od pracy, o której mowa w ust. 1 pkt 2, są wszelkie działania utrudniające lub wydłużające proces leczenia lub rekonwalescencję, z wyłączeniem zwykłych czynności dnia codziennego lub czynności incydentalnych, których podjęcia w okresie zwolnienia od pracy wymagają istotne okoliczności.” (art. 17 ust. 1b)';
export const CYTAT_1C =
  '„W przypadku spełniania warunków podlegania ubezpieczeniom społecznym z co najmniej dwóch tytułów do tych ubezpieczeń niezdolność do pracy z powodu choroby dotyczy każdego z tych tytułów, dla których odrębnie wystawia się zwolnienie od pracy.” (art. 17 ust. 1c)';
export const CYTAT_1D =
  '„Jeżeli jednak praca zarobkowa w ramach określonego tytułu może być wykonywana z uwagi na rodzaj tej pracy, na żądanie ubezpieczonego można nie wystawić zwolnienia od pracy z tego tytułu.” (art. 17 ust. 1d, od 1 stycznia 2027 r.)';
export const CYTAT_1E =
  '„W przypadku, o którym mowa w ust. 1d, ubezpieczony jest obowiązany poinformować płatnika składek, o którym mowa w art. 61 ust. 1 pkt 1, o okresie, na który zostało mu wystawione zwolnienie od pracy z innego tytułu.” (art. 17 ust. 1e, od 1 stycznia 2027 r.)';

export interface DaneL4 {
  czynnosc: Czynnosc;
  wskazanie: Wskazanie;
  kontrola: Kontrola;
  /** Pierwszy i ostatni dzień zwolnienia, w czasie którego była czynność. */
  od: string;
  do: string;
  /** Dzień czynności. */
  dzien: string;
  /** Dzień otrzymania protokołu kontroli (opcjonalnie). */
  protokol?: string;
  /** Dzień doręczenia decyzji ZUS (opcjonalnie). */
  decyzja?: string;
}

const puste = (x?: string) => x === undefined || x === '';

export function bladL4(d: DaneL4, dzis: string): { pole: keyof DaneL4; tekst: string } | null {
  for (const [pole, nazwa] of [['od', 'pierwszego dnia zwolnienia'], ['do', 'ostatniego dnia zwolnienia'], ['dzien', 'dnia czynności']] as const) {
    if (!poprawnaData(d[pole] ?? '')) return { pole, tekst: `Wpisz pełną datę ${nazwa}.` };
    if (d[pole] < NAJWCZESNIEJ || d[pole] > NAJPOZNIEJ) return { pole, tekst: 'Wpisz datę od 1 stycznia 2000 r. do 31 grudnia 2100 r.' };
  }
  if (d.do < d.od) return { pole: 'do', tekst: 'Ostatni dzień zwolnienia nie może być wcześniejszy niż pierwszy.' };
  if (dniMiedzy(d.od, d.do) + 1 > MAKS_DNI_ZWOLNIENIA)
    return { pole: 'do', tekst: `Zwolnienie dłuższe niż ${MAKS_DNI_ZWOLNIENIA} dni? Sprawdź daty: zasiłek chorobowy przysługuje najwyżej ${MAKS_DNI_ZWOLNIENIA} dni (art. 8 ustawy zasiłkowej).` };
  if (d.dzien < d.od || d.dzien > d.do) return { pole: 'dzien', tekst: 'Dzień czynności musi przypadać w czasie zwolnienia: art. 17 dotyczy tylko okresu orzeczonej niezdolności do pracy.' };
  for (const [pole, nazwa] of [['protokol', 'otrzymania protokołu'], ['decyzja', 'doręczenia decyzji']] as const) {
    const v = d[pole];
    if (puste(v)) continue;
    if (!poprawnaData(v!)) return { pole, tekst: `Wpisz pełną datę ${nazwa} albo wyczyść pole.` };
    if (v! < d.dzien) return { pole, tekst: `Dzień ${nazwa} nie może być wcześniejszy niż dzień czynności.` };
    if (v! > dzis) return { pole, tekst: `Dzień ${nazwa} nie może być późniejszy niż dziś.` };
  }
  return null;
}

/** Ostatni dzień na zastrzeżenia do protokołu: 7 dni od otrzymania, bez dnia otrzymania (art. 68e ust. 4). */
export const terminZastrzezen = (protokol: string) => dodajDni(protokol, DNI_ZASTRZEZEN);

/** Odwołanie od decyzji ZUS: miesiąc od doręczenia (art. 477⁹ § 1 KPC, art. 112 KC) i dzień po przesunięciu z art. 115 KC. */
export function terminOdwolania(decyzja: string) {
  const koniec = dodajMiesiace(decyzja, MIESIACE_ODWOLANIA);
  const p = przesunZDniaWolnego(koniec);
  return { koniec, poPrzesunieciu: p.koniec === koniec ? null : p.koniec, powod: p.przesuniecie[0]?.powod ?? null };
}

export interface OpisL4 {
  werdykt: string;
  werdyktKlasa: KlasaStatusu;
  przepis: string;
  werdyktOpis: string;
  /** Warunki i wskazówki do werdyktu. */
  warunki: string[];
  /** Nagłówek i cytaty przepisów w brzmieniu z dnia czynności. */
  brzmienieTytul: string;
  cytaty: string[];
  skutek: string;
  kontrola: string[];
  zastrzezenia: string;
  zastrzezeniaStatus: string | null;
  zastrzezeniaKlasa: KlasaStatusu | null;
  odwolanie: string;
  odwolanieStatus: string | null;
  odwolanieKlasa: KlasaStatusu | null;
  /** Uwagi o przepisach przejściowych (puste, gdy nie dotyczą). */
  uwagi: string[];
}

const dni = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);
const wielka = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** „zostało 5 dni”, „to dziś”, „3 dni temu” i klasa statusu (jak w innych narzędziach terminowych). */
export function stanTerminu(koniec: string, dzis: string): { tekst: string; klasa: KlasaStatusu } {
  const r = dniMiedzy(dzis, koniec);
  if (r < 0) return { tekst: `Termin minął ${dni(-r)} temu`, klasa: 'po-terminie' };
  if (r === 0) return { tekst: 'Dziś ostatni dzień', klasa: 'pilne' };
  return { tekst: wielka(zaIle(r)), klasa: r <= 3 ? 'pilne' : r <= 7 ? 'wkrotce' : 'w-terminie' };
}

/** „sobota”, „niedziela” albo „Boże Narodzenie, dzień wolny od pracy”. */
const NAZWA_WOLNEGO = (powod: string | null) => (powod === 'sobota' || powod === 'niedziela' ? powod : `${powod}, dzień wolny od pracy`);

const KLASA: Record<Werdykt, KlasaStatusu> = { wolno: 'w-terminie', warunek: 'wkrotce', zalezy: 'pilne', nie: 'po-terminie' };

const BEZ_DEFINICJI = 'Do 12 kwietnia 2026 r. ustawa nie definiowała pracy zarobkowej ani wykorzystywania zwolnienia niezgodnie z celem.';
const LEZEC =
  'Masz wskazanie „chory powinien leżeć” (art. 55 ust. 3 pkt 7 ustawy zasiłkowej). Żaden przepis nie wylicza, czego przy nim nie wolno; w razie wątpliwości ZUS może zapytać lekarza, który wystawił zwolnienie (art. 68 ust. 1e).';
const ADRES =
  'Zmianę adresu pobytu w czasie zwolnienia zgłaszasz pracodawcy (płatnikowi składek) i ZUS najpóźniej w 3 dni; inaczej zawiadomienie o badaniu wysłane na stary adres uznaje się za doręczone (art. 59 ust. 5e–5f ustawy zasiłkowej).';
const BADANIE =
  'Jeśli przez wyjazd uniemożliwisz badanie u lekarza orzecznika ZUS, zwolnienie traci ważność od dnia po wyznaczonym terminie, a ZUS wydaje decyzję o braku prawa do zasiłku (art. 59 ust. 6 i 10).';

interface Ocena {
  werdykt: Werdykt;
  etykieta: string;
  przepis: string;
  opis: string;
  warunki: string[];
}

/** Werdykt dla czynności i brzmienia przepisu (bez dat i kontroli). */
export function ocena(czynnosc: Czynnosc, b: Brzmienie, wskazanie: Wskazanie): Ocena {
  const dawne = b === 'dawne';
  const lezec = wskazanie === 'lezec' && ['zakupy', 'dom', 'wyjazd', 'wysilek'].includes(czynnosc) ? [LEZEC] : [];
  const P_DAWNY = 'art. 17 ust. 1 ustawy zasiłkowej (do 12.04.2026 r.)';
  switch (czynnosc) {
    case 'inna-praca':
      if (dawne)
        return {
          werdykt: 'nie',
          etykieta: 'Nie wolno',
          przepis: P_DAWNY,
          opis: 'Kto w czasie zwolnienia wykonuje pracę zarobkową, traci zasiłek chorobowy za cały okres tego zwolnienia. Przepis nie robił wyjątku dla pracy u innego pracodawcy, na zleceniu ani we własnej firmie.',
          warunki: [BEZ_DEFINICJI],
        };
      if (b === 'nowe')
        return {
          werdykt: 'nie',
          etykieta: 'Nie wolno',
          przepis: 'art. 17 ust. 1a i 1c ustawy zasiłkowej',
          opis: 'Praca zarobkowa to każda czynność o charakterze zarobkowym, niezależnie od umowy, na której ją wykonujesz: także praca u innego pracodawcy, zlecenie i własna firma. Przy kilku tytułach ubezpieczenia niezdolność do pracy dotyczy każdego z nich, a zwolnienie wystawia się odrębnie dla każdego tytułu.',
          warunki: [
            'Wyjątek to tylko czynność incydentalna, której wymagają istotne okoliczności (art. 17 ust. 1a).',
            'Od 1 stycznia 2027 r. lekarz może na Twoje żądanie nie wystawić zwolnienia z tytułu, w którym pracę da się wykonywać ze względu na jej rodzaj (art. 17 ust. 1d).',
          ],
        };
      return {
        werdykt: 'warunek',
        etykieta: 'Tylko bez zwolnienia z tej pracy',
        przepis: 'art. 17 ust. 1a, 1c i 1d ustawy zasiłkowej',
        opis: 'Praca zarobkowa w czasie zwolnienia odbiera zasiłek. Od 1 stycznia 2027 r. lekarz może na Twoje żądanie nie wystawić zwolnienia z tytułu, w którym pracę da się wykonywać ze względu na jej rodzaj, np. lekką pracę obok tej, której nie możesz wykonywać.',
        warunki: [
          'Niezdolność do pracy dotyczy każdego tytułu ubezpieczenia, a zwolnienie wystawia się odrębnie dla każdego (art. 17 ust. 1c). Jeśli masz zwolnienie także z tej drugiej pracy, praca w niej odbiera zasiłek.',
          'Wyjątek dotyczy tylko pracy, która jest osobnym tytułem ubezpieczeń społecznych, np. druga umowa o pracę, zlecenie albo własna firma. Praca bez takiego tytułu, np. na umowie o dzieło, nadal jest pracą zarobkową (art. 17 ust. 1a).',
          'Bez zwolnienia z jednego tytułu informujesz płatnika składek, który sam wypłaca zasiłki (zgłasza ponad 20 osób), o okresie zwolnienia z innego tytułu (art. 17 ust. 1e, art. 61 ust. 1 pkt 1).',
          'Ustawa nie mówi wprost, że praca w tytule bez zwolnienia nie jest wtedy pracą zarobkową z art. 17 ust. 1a; taki jest sens ust. 1c i 1d.',
        ],
      };
    case 'polecenie':
      if (dawne)
        return {
          werdykt: 'zalezy',
          etykieta: 'Ryzyko utraty zasiłku',
          przepis: P_DAWNY,
          opis: 'Praca zarobkowa w czasie zwolnienia, także dla własnego pracodawcy, odbierała zasiłek chorobowy za cały okres tego zwolnienia. Przepis nie przewidywał wyjątku dla drobnych czynności ani dla pracy na polecenie. Czy pojedynczy mail albo telefon był pracą zarobkową, oceniał ZUS albo pracodawca, który sam wypłacał zasiłek, a w sporze sąd.',
          warunki: [BEZ_DEFINICJI],
        };
      return {
        werdykt: 'nie',
        etykieta: 'Nie wolno, także na polecenie',
        przepis: 'art. 17 ust. 1a ustawy zasiłkowej',
        opis: 'Wyjątek dla czynności incydentalnych działa tylko wtedy, gdy wymagają ich istotne okoliczności, a istotną okolicznością nie może być polecenie pracodawcy. Gdy pracodawca prosi o maile, telefony albo przyjście do firmy, nie możesz powołać się na ten wyjątek.',
        warunki: ['Zdanie o poleceniu pracodawcy obowiązuje od 13 kwietnia 2026 r.; wcześniej ustawa w ogóle nie definiowała pracy zarobkowej.'],
      };
    case 'incydentalna':
      if (dawne)
        return {
          werdykt: 'zalezy',
          etykieta: 'Ryzyko utraty zasiłku',
          przepis: P_DAWNY,
          opis: 'Dawny przepis mówił tylko o wykonywaniu pracy zarobkowej i o wykorzystywaniu zwolnienia niezgodnie z celem, bez wyjątku dla jednorazowych czynności. Czy pojedyncza czynność odbierała zasiłek, oceniał ZUS albo pracodawca, który sam wypłacał zasiłek, a w sporze sąd (art. 17 ust. 3 i art. 68 w dawnym brzmieniu).',
          warunki: [BEZ_DEFINICJI],
        };
      return {
        werdykt: 'warunek',
        etykieta: 'Wolno, jeśli to wyjątek',
        przepis: 'art. 17 ust. 1a i 1b ustawy zasiłkowej',
        opis: 'Ustawa wyłącza czynności incydentalne, których podjęcia w czasie zwolnienia wymagają istotne okoliczności, zarówno z pracy zarobkowej, jak i z aktywności niezgodnej z celem zwolnienia.',
        warunki: [
          'Czynność jest incydentalna, a nie zwykłą pracą w czasie zwolnienia.',
          'Wymagają jej istotne okoliczności; polecenie pracodawcy nią nie jest (art. 17 ust. 1a zdanie drugie).',
          'Ustawa nie wyjaśnia, co jest czynnością incydentalną ani istotną okolicznością: ocenia to ZUS, a w sporze sąd.',
        ],
      };
    case 'lekarz':
      return {
        werdykt: 'wolno',
        etykieta: 'Wolno',
        przepis: dawne ? P_DAWNY : 'art. 17 ust. 1b ustawy zasiłkowej',
        opis: dawne
          ? 'Wizyta u lekarza, badania i rehabilitacja służą leczeniu, czyli celowi zwolnienia.'
          : 'Wizyta u lekarza, badania i rehabilitacja służą leczeniu, więc nie są działaniem, które utrudnia albo wydłuża leczenie.',
        warunki: ['Gdy ZUS wezwie Cię na badanie do lekarza orzecznika, stawiasz się w wyznaczonym terminie albo dostarczasz wyniki badań (art. 59 ust. 5–6).'],
      };
    case 'zakupy':
    case 'dom':
      return {
        werdykt: 'warunek',
        etykieta: dawne ? 'Zwykle wolno' : 'Wolno, jeśli nie szkodzi leczeniu',
        przepis: dawne ? P_DAWNY : 'art. 17 ust. 1b ustawy zasiłkowej',
        opis: dawne
          ? 'Dawny przepis zakazywał wykorzystywania zwolnienia w sposób niezgodny z jego celem, bez listy czynności. Zwykłe codzienne sprawy, które nie szkodzą leczeniu, nie przeczą celowi zwolnienia.'
          : 'Zwykłe czynności dnia codziennego nie są aktywnością niezgodną z celem zwolnienia. Ustawa ich nie wylicza; zakupy, apteka i zwykłe sprawy domowe należą do nich w zwykłym znaczeniu słów.',
        warunki: [
          dawne ? 'Granica: zachowanie nie może przeczyć celowi zwolnienia, czyli leczeniu.' : 'Granica: działanie nie może utrudniać ani wydłużać leczenia albo rekonwalescencji (art. 17 ust. 1b).',
          ...(dawne ? [BEZ_DEFINICJI] : []),
          ...lezec,
        ],
      };
    case 'wyjazd':
      return {
        werdykt: 'warunek',
        etykieta: 'Wolno, z warunkami',
        przepis: dawne ? P_DAWNY : 'art. 17 ust. 1b i art. 59 ustawy zasiłkowej',
        opis: 'Ustawa nie zakazuje wyjazdu w czasie zwolnienia. Wyjazd nie może jednak utrudniać ani wydłużać leczenia, a Ty masz obowiązek umożliwić kontrolę (art. 68d pkt 1) i podać aktualny adres pobytu (art. 59 ust. 5d–5e).',
        warunki: [
          ADRES,
          BADANIE,
          dawne ? 'Granica: wyjazd nie może przeczyć celowi zwolnienia, czyli leczeniu (art. 17 ust. 1 w dawnym brzmieniu).' : 'Granica: wyjazd nie może utrudniać ani wydłużać leczenia albo rekonwalescencji (art. 17 ust. 1b).',
          ...lezec,
        ],
      };
    case 'wysilek':
      return {
        werdykt: 'zalezy',
        etykieta: 'Ryzyko utraty zasiłku',
        przepis: dawne ? P_DAWNY : 'art. 17 ust. 1b i art. 68 ust. 1e ustawy zasiłkowej',
        opis: dawne
          ? 'Wykorzystywanie zwolnienia w sposób niezgodny z celem odbierało zasiłek za cały okres zwolnienia. Czy wysiłek był niezgodny z celem, oceniał ZUS albo pracodawca, który sam wypłacał zasiłek; wątpliwości rozstrzygał ZUS, w razie potrzeby z opinią lekarza leczącego (§ 10 rozporządzenia z 27 lipca 1999 r.).'
          : 'Aktywność niezgodna z celem zwolnienia to wszelkie działania utrudniające lub wydłużające leczenie albo rekonwalescencję. Czy dany wysiłek do nich należy, rozstrzyga ZUS, w razie potrzeby z opinią lekarza, który wystawił zwolnienie, albo lekarza orzecznika.',
        warunki: [
          'Bezpieczniej zapytać lekarza, który wystawił zwolnienie, czy ten wysiłek nie zaszkodzi leczeniu.',
          ...(dawne ? [BEZ_DEFINICJI] : []),
          ...lezec,
        ],
      };
  }
}

/** Cytaty przepisów w brzmieniu z dnia czynności, właściwe dla czynności. */
export function cytaty(czynnosc: Czynnosc, b: Brzmienie): string[] {
  if (b === 'dawne') return [CYTAT_DAWNY];
  const praca = CZYNNOSCI[czynnosc].praca;
  const lista = [CYTAT_1, ...(czynnosc === 'incydentalna' ? [CYTAT_1A, CYTAT_1B] : praca ? [CYTAT_1A] : [CYTAT_1B])];
  if (czynnosc === 'inna-praca') {
    lista.push(CYTAT_1C);
    if (b === 'od2027') lista.push(CYTAT_1D, CYTAT_1E);
  }
  return lista;
}

const okresZwolnienia = (od: string, do_: string) => {
  const n = dniMiedzy(od, do_) + 1;
  return od === do_ ? `${dataPoPolsku(od)} (1 dzień)` : `od ${dataPoPolsku(od)} do ${dataPoPolsku(do_)} (${dni(n)})`;
};

const DAWNA_KONTROLA =
  'kontrolowali wtedy ZUS i pracodawca, który sam wypłacał zasiłki, bo zgłaszał ponad 20 osób; kontrolujący miał imienne upoważnienie, protokół przedkładano Ci do uwag bez terminu w przepisach, a wątpliwości rozstrzygał ZUS, w razie potrzeby z opinią lekarza leczącego, i w razie sporu wydawał decyzję (art. 68 ust. 1 ustawy zasiłkowej w dawnym brzmieniu, § 1 ust. 1 i § 8–10 rozporządzenia z 27 lipca 1999 r.)';

/**
 * Jak przebiega kontrola (art. 59 i 68–68e w brzmieniu od 13 kwietnia 2026 r.). `dawnaKontrola`: protokół sprzed
 * 13 kwietnia 2026 r., czyli kontrola według dawnych przepisów (art. 42 ustawy zmieniającej).
 */
export function opisKontroli(k: Kontrola, b: Brzmienie, dawnaKontrola = false): string[] {
  if (dawnaKontrola)
    return [`Protokół jest sprzed 13 kwietnia 2026 r., więc kontrolę kończy się według dawnych przepisów (art. 42 ustawy z 18 grudnia 2025 r., Dz.U. 2026 poz. 26): ${DAWNA_KONTROLA}.`];
  const kto =
    k === 'pracodawca'
      ? 'Każdy pracodawca może kontrolować, gdy płaci Ci wynagrodzenie chorobowe (art. 68 ust. 1d ustawy zasiłkowej). Zasiłek kontroluje pracodawca, który sam go wypłaca, bo zgłasza do ubezpieczenia chorobowego ponad 20 osób (art. 68 ust. 1a, art. 61 ust. 1 pkt 1). ZUS może skontrolować także wtedy, gdy zasiłek wypłaca pracodawca, z urzędu albo na jego wniosek (art. 68 ust. 1b).'
      : 'ZUS kontroluje, czy zwolnienie jest wykorzystywane zgodnie z celem, także wtedy, gdy zasiłek wypłaca pracodawca, z urzędu albo na jego wniosek (art. 68 ust. 1 i 1b ustawy zasiłkowej). Pracodawca może kontrolować, gdy płaci Ci wynagrodzenie chorobowe (art. 68 ust. 1d), a także wtedy, gdy sam wypłaca zasiłek (art. 68 ust. 1a).';
  const legitymacja =
    k === 'pracodawca'
      ? 'Kontrolujący okazuje upoważnienie i legitymację pracowniczą (art. 68c ust. 3 pkt 1); w upoważnieniu od pracodawcy może być wpisany numer legitymacji albo dokumentu tożsamości (art. 68b ust. 3 pkt 4 lit. b).'
      : 'Kontrolujący okazuje upoważnienie i legitymację: służbową, gdy kontroluje ZUS, a pracowniczą, gdy pracodawca (art. 68b ust. 2–3, art. 68c ust. 3 pkt 1).';
  const lista = [
    kto,
    `${legitymacja} Kontrola odbywa się w miejscu zamieszkania, pobytu, pracy albo prowadzenia działalności, a w innym miejscu tylko wtedy, gdy wymaga tego jej cel (art. 68c ust. 1).`,
    'Masz obowiązek umożliwić kontrolę oraz udzielać informacji i wyjaśnień w jej zakresie (art. 68d). Kontrola ma być proporcjonalna, z poszanowaniem prywatności i bez ryzyka dla zdrowia (art. 68a ust. 4), a kontrolujący musi pouczyć Cię o prawie do zastrzeżeń (art. 68c ust. 3 pkt 2).',
    'Ustalenia trafiają do protokołu w dwóch egzemplarzach, jeden dostajesz (art. 68e ust. 2). Wątpliwości, czy zwolnienie było wykorzystywane niezgodnie z celem, rozstrzyga ZUS, w razie potrzeby z opinią lekarza, który je wystawił, albo lekarza orzecznika (art. 68 ust. 1e).',
  ];
  if (k !== 'pracodawca')
    lista.push('ZUS może też skierować Cię na badanie do lekarza orzecznika; zwraca koszty przejazdu do ceny najtańszej komunikacji publicznej (art. 59 ust. 3 pkt 1 i ust. 13).');
  if (b === 'dawne')
    lista.push(`Opis dotyczy przepisów o kontroli od 13 kwietnia 2026 r. Kontrolę wszczętą przed tym dniem kończy się według dawnych przepisów (art. 42 ustawy z 18 grudnia 2025 r., Dz.U. 2026 poz. 26): ${DAWNA_KONTROLA}.`);
  return lista;
}

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. Rzuca RangeError przy błędnych danych. */
export function opisL4(d: DaneL4, dzis: string): OpisL4 {
  const blad = bladL4(d, dzis);
  if (blad) throw new RangeError(blad.tekst);
  const b = brzmienie(d.dzien);
  const o = ocena(d.czynnosc, b, d.wskazanie);
  const dawnaKontrola = !puste(d.protokol) && d.protokol! < OD_NOWEGO;
  const praca = CZYNNOSCI[d.czynnosc].praca;
  const okres = okresZwolnienia(d.od, d.do);
  const utrata = `prawo do zasiłku chorobowego za cały okres zwolnienia, ${okres}, a za dni, za które pracodawca płaci wynagrodzenie chorobowe, także do tego wynagrodzenia (art. 17 ust. 1 ustawy zasiłkowej, art. 92 § 3 pkt 2 Kodeksu pracy). Wypłacony już zasiłek podlega potrąceniu z bieżących świadczeń albo ściągnięciu (art. 66 ust. 2 ustawy zasiłkowej).`;
  const czym = b === 'dawne' ? (praca ? 'pracę zarobkową' : 'wykorzystywanie zwolnienia niezgodnie z celem') : praca ? 'pracę zarobkową' : 'aktywność niezgodną z celem zwolnienia';
  let skutek: string;
  if (o.werdykt === 'nie') skutek = `Gdy ZUS to ustali, tracisz ${utrata}`;
  else if (o.werdykt === 'wolno') skutek = `Ta czynność nie odbiera zasiłku. Utratę za cały okres zwolnienia, ${okres}, powoduje tylko praca zarobkowa albo aktywność niezgodna z celem zwolnienia (art. 17 ust. 1 ustawy zasiłkowej).`;
  else if (d.czynnosc === 'incydentalna' && b !== 'dawne') skutek = `Jeśli ZUS uzna, że to nie był wyjątek, tracisz ${utrata}`;
  else skutek = `Jeśli ZUS uzna to za ${czym}, tracisz ${utrata}`;

  let zastrzezenia: string;
  let zastrzezeniaStatus: string | null = null;
  let zastrzezeniaKlasa: KlasaStatusu | null = null;
  if (puste(d.protokol)) {
    zastrzezenia = `Po kontroli dostajesz protokół. Zastrzeżenia składasz w ${DNI_ZASTRZEZEN} dni od otrzymania protokołu albo aneksu do niego, wskazując dowody; rozpatruje je ZUS i odpowiada na piśmie (art. 68e ust. 4–5 ustawy zasiłkowej). Do aneksu sporządzonego po rozpatrzeniu zastrzeżeń nie składa się kolejnych (ust. 6). Wpisz dzień otrzymania protokołu, a policzymy datę.`;
  } else if (dawnaKontrola) {
    zastrzezenia = `Protokół jest sprzed 13 kwietnia 2026 r.: termin ${DNI_ZASTRZEZEN} dni z art. 68e ust. 4 nie dotyczy kontroli wszczętej przed tym dniem (art. 42 ustawy z 18 grudnia 2025 r.). Dawne rozporządzenie dawało prawo do uwag do protokołu, bez terminu (§ 9 rozporządzenia z 27 lipca 1999 r.).`;
  } else {
    const t = terminZastrzezen(d.protokol!);
    const s = stanTerminu(t, dzis);
    zastrzezeniaStatus = s.tekst;
    zastrzezeniaKlasa = s.klasa;
    const wolny = przesunZDniaWolnego(t).przesuniecie[0]?.powod ?? null;
    const sobota = wolny ? ` ${wielka(dataPoPolsku(t))} to ${NAZWA_WOLNEGO(wolny)}; ustawa nie mówi, czy termin przesuwa się wtedy na następny dzień roboczy, więc podajemy datę bez przesunięcia.` : '';
    zastrzezenia = `Najpóźniej ${dataPoPolsku(t)}: ${DNI_ZASTRZEZEN} dni od otrzymania protokołu (albo aneksu do niego), wskazując dowody; rozpatruje je ZUS i odpowiada na piśmie (art. 68e ust. 4–5 ustawy zasiłkowej). Do aneksu sporządzonego po rozpatrzeniu zastrzeżeń nie składa się kolejnych (ust. 6).${sobota}`;
  }

  const gdzie =
    'Odwołanie wnosisz na piśmie do oddziału ZUS, który wydał decyzję, albo ustnie do protokołu w tym oddziale (art. 83 ust. 2 i 5 ustawy o systemie ubezpieczeń społecznych, art. 477⁹ § 1 KPC); możesz je też złożyć do protokołu w sądzie (art. 477⁹ § 5 KPC).';
  const spoznione = 'Sąd odrzuci spóźnione odwołanie, chyba że spóźnienie nie jest nadmierne i nastąpiło z przyczyn od Ciebie niezależnych (art. 477⁹ § 3 KPC).';
  let odwolanie: string;
  let odwolanieStatus: string | null = null;
  let odwolanieKlasa: KlasaStatusu | null = null;
  if (puste(d.decyzja)) {
    odwolanie = `Gdy ZUS ustali utratę zasiłku, wydaje decyzję (art. 83 ust. 1 pkt 4 ustawy o systemie ubezpieczeń społecznych); protokół kontroli jest podstawą tego postępowania (art. 68e ust. 7 ustawy zasiłkowej). Na odwołanie do sądu masz miesiąc od doręczenia decyzji. ${gdzie} Wpisz dzień doręczenia decyzji, a policzymy datę.`;
  } else {
    const t = terminOdwolania(d.decyzja!);
    // Gdy data bez przesunięcia już minęła, a przesunięta jeszcze nie, liczy się tylko ta druga (art. 115 KC).
    const tylkoPrzesuniety = t.poPrzesunieciu !== null && t.koniec < dzis && t.poPrzesunieciu >= dzis;
    const s = stanTerminu(tylkoPrzesuniety ? t.poPrzesunieciu! : t.koniec, dzis);
    odwolanieStatus = s.tekst;
    odwolanieKlasa = s.klasa;
    const art115 = 'według art. 115 Kodeksu cywilnego (przez art. 165 § 1 KPC)';
    if (tylkoPrzesuniety)
      odwolanie = `Miesiąc od doręczenia decyzji minął ${dataPoPolsku(t.koniec)}, ale ten dzień to ${NAZWA_WOLNEGO(t.powod)}, więc ${art115} termin upływa ${dataPoPolsku(t.poPrzesunieciu!)} Nie zwlekaj: to ostatni dzień. ${gdzie} ${spoznione}`;
    else {
      const przesuniecie = t.poPrzesunieciu
        ? ` ${wielka(dataPoPolsku(t.koniec))} to ${NAZWA_WOLNEGO(t.powod)}: ${art115} ostatni dzień to ${dataPoPolsku(t.poPrzesunieciu)}, ale bezpieczniej zdążyć do ${dataPoPolsku(t.koniec)}`
        : '';
      odwolanie = `Zdąż do ${dataPoPolsku(t.koniec)}: miesiąc od doręczenia decyzji.${przesuniecie} ${gdzie} ${spoznione}`;
    }
  }

  const uwagi: string[] = [
    'Gdy zasiłek wypłaca pracodawca i uważasz, że naruszył Twoje prawa, możesz złożyć do ZUS wniosek o ustalenie uprawnień do zasiłku (art. 63 ust. 1 ustawy zasiłkowej). Spór o wynagrodzenie chorobowe to sprawa z pracodawcą w sądzie pracy (art. 476 § 1 pkt 1 KPC); roszczenie przedawnia się po 3 latach od dnia, w którym stało się wymagalne (art. 291 § 1 Kodeksu pracy).',
  ];
  if (b === 'dawne')
    uwagi.push(
      'Czynność była przed 13 kwietnia 2026 r., więc pokazujemy dawne brzmienie art. 17. Do postępowań w tej sprawie wszczętych przed tym dniem stosuje się dawne przepisy (art. 39 ustawy z 18 grudnia 2025 r.); o postępowaniach wszczętych później ustawa nie mówi.',
    );

  return {
    werdykt: o.etykieta,
    werdyktKlasa: KLASA[o.werdykt],
    przepis: o.przepis,
    werdyktOpis: o.opis,
    warunki: o.warunki,
    brzmienieTytul: TYTUL_BRZMIENIA[b],
    cytaty: cytaty(d.czynnosc, b),
    skutek,
    kontrola: opisKontroli(d.kontrola, b, dawnaKontrola),
    zastrzezenia,
    zastrzezeniaStatus,
    zastrzezeniaKlasa,
    odwolanie,
    odwolanieStatus,
    odwolanieKlasa,
    uwagi,
  };
}

/** Werdykt, kontrola i cytaty bez dat (przy błędzie daty): brzmienie z dnia czynności, jeśli jest poprawny, inaczej z dziś. */
export function werdyktBezDat(czynnosc: Czynnosc, wskazanie: Wskazanie, kontrola: Kontrola, dzien: string, dzis: string) {
  const b = brzmienie(poprawnaData(dzien) ? dzien : dzis);
  const o = ocena(czynnosc, b, wskazanie);
  return {
    werdykt: o.etykieta,
    werdyktKlasa: KLASA[o.werdykt],
    przepis: o.przepis,
    werdyktOpis: o.opis,
    warunki: o.warunki,
    brzmienieTytul: TYTUL_BRZMIENIA[b],
    cytaty: cytaty(czynnosc, b),
    kontrola: opisKontroli(kontrola, b),
  };
}
