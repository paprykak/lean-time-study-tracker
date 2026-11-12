// Należności z podróży służbowej na obszarze kraju (delegacja krajowa): § 7–9 rozporządzenia Ministra Pracy i Polityki
// Społecznej z 29 stycznia 2013 r. (t.j. Dz.U. 2023 poz. 2190; według API Sejmu bez zmian po 2022 r.). U pracodawcy spoza
// sfery budżetowej warunki ustala układ, regulamin wynagradzania albo umowa o pracę, ale dieta za dobę nie może być
// niższa niż dieta krajowa z rozporządzenia (art. 77^5 § 3–4 Kp), a bez takich postanowień stosuje się rozporządzenie (§ 5).
//
// Czas podróży to rzeczywiste godziny od wyjazdu do powrotu (§ 7 ust. 2), więc zmiana czasu w nocy wydłuża albo skraca
// podróż o godzinę. Doby liczymy po 24 godziny od chwili wyjazdu. Posiłki odejmujemy od diety za dobę, w której je
// zapewniono (§ 7 ust. 4 mówi o diecie z ust. 1, czyli za dobę), i nie schodzimy poniżej zera; strona opisuje,
// że przepis nie rozstrzyga tego wprost.
import { doGrosza } from './dodatek-nocny';
import { dodajDni } from './terminy';

/** Dieta za dobę podróży krajowej od 1 stycznia 2023 r. (§ 7 ust. 1). */
export const DIETA = 45;
/** Udział posiłku w diecie (§ 7 ust. 4). */
export const POSILEK_PROCENT = { sniadanie: 25, obiad: 50, kolacja: 25 } as const;
/** Ryczałt za nocleg bez rachunku: 150% diety (§ 8 ust. 3), za nocleg co najmniej 6 godzin między 21 a 7 (§ 8 ust. 4). */
export const RYCZALT_NOCLEG_PROCENT = 150;
/** Limit zwrotu za dobę hotelową z rachunkiem: dwudziestokrotność diety (§ 8 ust. 1). */
export const LIMIT_HOTELU_KROTNOSC = 20;
/** Ryczałt na dojazdy komunikacją miejscową: 20% diety za każdą rozpoczętą dobę (§ 9 ust. 1). */
export const KOMUNIKACJA_PROCENT = 20;
/** Najdłuższa podróż, którą liczy kalkulator. */
export const MAKS_DOB = 31;

/**
 * Najwyższe stawki za 1 km przejazdu pojazdem niebędącym własnością pracodawcy (§ 3 ust. 3–4 rozporządzenia o podróżach;
 * § 2 rozporządzenia Ministra Infrastruktury z 25 marca 2002 r., Dz.U. 2002 poz. 271, w brzmieniu z Dz.U. 2023 poz. 5,
 * od 17 stycznia 2023 r.). Pracodawca ustala stawkę, nie wyższą niż te.
 */
export const STAWKI_KM = { 'auto-ponad-900': 1.15, 'auto-do-900': 0.89, motocykl: 0.69, motorower: 0.42 } as const;
export type Pojazd = keyof typeof STAWKI_KM;

export const RYCZALT_NOCLEG = doGrosza((DIETA * RYCZALT_NOCLEG_PROCENT) / 100);
export const LIMIT_HOTELU = DIETA * LIMIT_HOTELU_KROTNOSC;
export const RYCZALT_KOMUNIKACJA = doGrosza((DIETA * KOMUNIKACJA_PROCENT) / 100);

const MINUTA = 60_000;
const GODZINA = 60 * MINUTA;
const DOBA = 24 * GODZINA;

export type Posilek = keyof typeof POSILEK_PROCENT;
export type PosilkiDoby = Partial<Record<Posilek, boolean>>;

const STREFA = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Warsaw',
  hourCycle: 'h23',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

function czesci(chwila: number) {
  const p = Object.fromEntries(STREFA.formatToParts(chwila).map((x) => [x.type, x.value]));
  return { rok: +p.year, miesiac: +p.month, dzien: +p.day, godzina: +p.hour, minuta: +p.minute };
}

/** Przesunięcie czasu polskiego względem UTC w danej chwili (1 albo 2 godziny, w ms). */
function przesuniecie(chwila: number): number {
  const c = czesci(chwila);
  return Date.UTC(c.rok, c.miesiac - 1, c.dzien, c.godzina, c.minuta) - Math.floor(chwila / MINUTA) * MINUTA;
}

/** Czy tekst to godzina GG:MM. */
export const poprawnaGodzina = (g: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(g);

/**
 * Chwila (ms od 1970 r., UTC) dla daty i godziny w Polsce. Godzina z nocy zmiany czasu, która nie istnieje (marzec),
 * przechodzi o godzinę dalej; godzina, która powtarza się w październiku, oznacza jej drugie wystąpienie.
 */
export function chwilaWPolsce(data: string, godzina: string): number {
  const [r, m, d] = data.split('-').map(Number);
  const [h, min] = godzina.split(':').map(Number);
  const sciana = Date.UTC(r, m - 1, d, h, min);
  const proba = sciana - przesuniecie(sciana - GODZINA);
  return sciana - przesuniecie(proba);
}

/** Data (RRRR-MM-DD) i godzina (G:MM) chwili w Polsce. */
export function poPolsku(chwila: number): { data: string; godzina: string } {
  const c = czesci(chwila);
  const dwa = (x: number) => String(x).padStart(2, '0');
  return { data: `${c.rok}-${dwa(c.miesiac)}-${dwa(c.dzien)}`, godzina: `${c.godzina}:${dwa(c.minuta)}` };
}

/** „1 doba, 12 godz. 30 min”, „9 godz.”, „3 doby”. */
export function czasPodrozy(ms: number): string {
  const minuty = Math.round(ms / MINUTA);
  const doby = Math.floor(minuty / 1440);
  const godziny = Math.floor((minuty % 1440) / 60);
  const reszta = minuty % 60;
  const slowo = odmiana(doby, 'doba', 'doby', 'dób');
  const godzinyIMinuty = [godziny ? `${godziny} godz.` : '', reszta ? `${reszta} min` : ''].filter(Boolean).join(' ');
  return [doby ? `${doby} ${slowo}` : '', godzinyIMinuty].filter(Boolean).join(', ') || '0 min';
}

/** Ile nocy (21:00–7:00 czasu polskiego) obejmuje podróż: w ogóle i na co najmniej 6 godzin (warunek ryczałtu, § 8 ust. 4). */
export function noceWPodrozy(start: number, koniec: number): { wszystkie: number; doRyczaltu: number } {
  let wszystkie = 0;
  let doRyczaltu = 0;
  const ostatnia = poPolsku(koniec).data;
  for (let data = dodajDni(poPolsku(start).data, -1); data <= ostatnia; data = dodajDni(data, 1)) {
    const od = chwilaWPolsce(data, '21:00');
    const do_ = chwilaWPolsce(dodajDni(data, 1), '07:00');
    const wspolne = Math.min(koniec, do_) - Math.max(start, od);
    if (wspolne > 0) wszystkie++;
    if (wspolne >= 6 * GODZINA) doRyczaltu++;
  }
  return { wszystkie, doRyczaltu };
}

export interface DobaDelegacji {
  nr: number;
  od: number;
  do: number;
  /** Jaka część diety przysługuje za tę dobę (§ 7 ust. 2). */
  procent: 0 | 50 | 100;
  dieta: number;
  /** Potrącenie za zapewnione posiłki, nie większe niż dieta za dobę. */
  potracenie: number;
  naleznosc: number;
}

/** Podział podróży na doby z częścią diety według § 7 ust. 2. */
export function dobyPodrozy(start: number, koniec: number): Omit<DobaDelegacji, 'dieta' | 'potracenie' | 'naleznosc'>[] {
  const czas = koniec - start;
  if (!(czas > 0)) throw new RangeError('Powrót musi być po wyjeździe');
  if (czas > MAKS_DOB * DOBA) throw new RangeError(`Kalkulator liczy podróże do ${MAKS_DOB} dób`);
  if (czas <= DOBA) {
    const procent = czas < 8 * GODZINA ? 0 : czas <= 12 * GODZINA ? 50 : 100;
    return [{ nr: 1, od: start, do: koniec, procent }];
  }
  const pelne = Math.floor(czas / DOBA);
  const doby: Omit<DobaDelegacji, 'dieta' | 'potracenie' | 'naleznosc'>[] = [];
  for (let i = 0; i < pelne; i++) doby.push({ nr: i + 1, od: start + i * DOBA, do: start + (i + 1) * DOBA, procent: 100 });
  const reszta = czas - pelne * DOBA;
  if (reszta > 0) doby.push({ nr: pelne + 1, od: start + pelne * DOBA, do: koniec, procent: reszta <= 8 * GODZINA ? 50 : 100 });
  return doby;
}

export interface DaneDelegacji {
  wyjazd: { data: string; godzina: string };
  powrot: { data: string; godzina: string };
  /** Bezpłatne posiłki w kolejnych dobach (indeks 0 = doba 1). */
  posilki?: PosilkiDoby[];
  /** Noclegi bez rachunku i bez zapewnionego bezpłatnego noclegu (ryczałt). */
  noclegiRyczalt?: number;
  /** Czy pracownik ponosi koszty dojazdów komunikacją miejscową (§ 9 ust. 2). */
  komunikacja?: boolean;
  /** Przejazd własnym pojazdem za zgodą pracodawcy (§ 3 ust. 3): rodzaj pojazdu i kilometry. */
  pojazd?: Pojazd;
  kilometry?: number;
}

export function delegacja(d: DaneDelegacji) {
  const start = chwilaWPolsce(d.wyjazd.data, d.wyjazd.godzina);
  const koniec = chwilaWPolsce(d.powrot.data, d.powrot.godzina);
  const doby: DobaDelegacji[] = dobyPodrozy(start, koniec).map((x, i) => {
    const dieta = (DIETA * x.procent) / 100;
    const p = d.posilki?.[i] ?? {};
    const zaPosilki = (Object.keys(POSILEK_PROCENT) as Posilek[]).reduce((s, k) => s + (p[k] ? (DIETA * POSILEK_PROCENT[k]) / 100 : 0), 0);
    const naleznosc = Math.max(0, dieta - zaPosilki);
    return { ...x, dieta, potracenie: dieta - naleznosc, naleznosc };
  });
  const czas = koniec - start;
  const noce = noceWPodrozy(start, koniec);
  const noclegi = d.noclegiRyczalt ?? 0;
  if (!(Number.isInteger(noclegi) && noclegi >= 0)) throw new RangeError('Liczba noclegów musi być całkowita');
  if (noclegi > noce.doRyczaltu) throw new RangeError('Za dużo noclegów do ryczałtu');
  const rozpoczeteDoby = Math.ceil(czas / DOBA);
  const suma = (k: 'dieta' | 'potracenie' | 'naleznosc') => doGrosza(doby.reduce((s, x) => s + x[k], 0));
  const dieta = suma('naleznosc');
  const ryczaltNoclegi = doGrosza(noclegi * RYCZALT_NOCLEG);
  const komunikacja = d.komunikacja ? doGrosza(rozpoczeteDoby * RYCZALT_KOMUNIKACJA) : 0;
  const kilometry = d.pojazd ? (d.kilometry ?? 0) : 0;
  if (!(kilometry >= 0 && kilometry <= 100_000)) throw new RangeError('Kilometry: od 0 do 100 000');
  const kilometrowka = d.pojazd ? doGrosza(kilometry * STAWKI_KM[d.pojazd]) : 0;
  return {
    start,
    koniec,
    czas,
    doby,
    /** Liczba diet przed potrąceniem za posiłki, np. 1,5. */
    liczbaDiet: doby.reduce((s, x) => s + x.procent, 0) / 100,
    dietaPrzedPotraceniem: suma('dieta'),
    potracenie: suma('potracenie'),
    dieta,
    noce,
    ryczaltNoclegi,
    rozpoczeteDoby,
    komunikacja,
    /** Zwrot za przejazd własnym pojazdem według najwyższej stawki. */
    kilometrowka,
    razem: doGrosza(dieta + ryczaltNoclegi + komunikacja + kilometrowka),
  };
}

const DZIEN_MIESIAC = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', timeZone: 'UTC' });
/** „12 listopada, 6:00” dla chwili w Polsce. */
export function opisChwili(chwila: number): string {
  const p = poPolsku(chwila);
  return `${DZIEN_MIESIAC.format(new Date(`${p.data}T00:00:00Z`))}, ${p.godzina}`;
}

const odmiana = (n: number, jeden: string, kilka: string, wiele: string) =>
  n === 1 ? jeden : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? kilka : wiele;

/** „1 dieta”, „1,5 diety”, „2 diety”, „5 diet”. */
export const ileDiet = (n: number) =>
  `${String(n).replace('.', ',')} ${Number.isInteger(n) ? odmiana(n, 'dieta', 'diety', 'diet') : 'diety'}`;

/** „1 nocleg”, „2 noclegi”, „5 noclegów”. */
export const ileNoclegow = (n: number) => `${n} ${odmiana(n, 'nocleg', 'noclegi', 'noclegów')}`;
