// Staż pracy z okresów zatrudnienia: umowy o pracę oraz od 2026 r. zlecenia, umowy agencyjne i działalność
// (art. 302^1 § 1–7 Kp, dodany ustawą z 26 września 2025 r., Dz.U. 2025 poz. 1423). Okresy, które się nakładają,
// liczymy raz (art. 302^1 § 10: wlicza się okres najkorzystniejszy, więc przy samej długości stażu to suma bez
// powtórzeń). Przepisy nie mówią, jak sumować okresy z przerwami: każdy ciągły okres liczymy w pełnych miesiącach
// kalendarzowych (art. 112 KC, konwencja z terminy.ts: od 31 sierpnia 6 miesięcy mija z końcem 28 lutego), a pozostałe
// dni sumujemy i zamieniamy na miesiące po 30 dni (art. 114 KC).
import { SZKOLY, type Szkola } from './urlop';
import { dniMiedzy, dodajDni, koniecOkresu, pelneMiesiace } from './terminy';

export type RodzajOkresu = 'umowa' | 'zlecenie' | 'dzialalnosc';

export const RODZAJE: Record<RodzajOkresu, string> = {
  umowa: 'Umowa o pracę',
  zlecenie: 'Zlecenie albo umowa agencyjna',
  dzialalnosc: 'Działalność gospodarcza',
};

export interface Okres {
  od: string;
  do: string;
  rodzaj: RodzajOkresu;
}

export interface Staz {
  lata: number;
  miesiace: number;
  dni: number;
}

/** Ciągłe okresy bez powtórzeń: nakładające się i stykające się okresy łączymy. */
export function polacz(okresy: { od: string; do: string }[]): { od: string; do: string }[] {
  const lista = [...okresy].sort((a, b) => a.od.localeCompare(b.od));
  const wynik: { od: string; do: string }[] = [];
  for (const o of lista) {
    if (o.do < o.od) throw new RangeError('Koniec okresu przed początkiem');
    const ostatni = wynik[wynik.length - 1];
    if (ostatni && o.od <= dodajDni(ostatni.do, 1)) {
      if (o.do > ostatni.do) ostatni.do = o.do;
    } else wynik.push({ ...o });
  }
  return wynik;
}

/** Pełne miesiące kalendarzowe i pozostałe dni jednego ciągłego okresu (oba dni włącznie). */
export function miesiaceIDni(od: string, do_: string): { miesiace: number; dni: number } {
  const m = pelneMiesiace(od, do_);
  return { miesiace: m, dni: dniMiedzy(koniecOkresu(od, m), do_) };
}

/** Suma okresów bez powtórzeń w latach, miesiącach i dniach (30 dni = miesiąc, 12 miesięcy = rok). */
export function staz(okresy: { od: string; do: string }[]): Staz {
  let miesiace = 0;
  let dni = 0;
  for (const o of polacz(okresy)) {
    const x = miesiaceIDni(o.od, o.do);
    miesiace += x.miesiace;
    dni += x.dni;
  }
  miesiace += Math.floor(dni / 30);
  dni %= 30;
  return { lata: Math.floor(miesiace / 12), miesiace: miesiace % 12, dni };
}

const naDni = (s: Staz) => (s.lata * 12 + s.miesiace) * 30 + s.dni;
const zDni = (n: number): Staz => ({ lata: Math.floor(n / 360), miesiace: Math.floor((n % 360) / 30), dni: n % 30 });

export interface WynikStazu {
  razem: Staz;
  umowy: Staz;
  /** Staż z wykształceniem do wymiaru urlopu (art. 155 § 1), bez okresów nauki w czasie pracy. */
  doUrlopu: Staz;
  dniUrlopu: 20 | 26;
  /** Ile brakuje do 10 lat stażu urlopowego; null przy 26 dniach. */
  brakuje: Staz | null;
}

export function obliczStaz(okresy: Okres[], szkola: Szkola): WynikStazu {
  if (okresy.length === 0) throw new RangeError('Podaj co najmniej jeden okres');
  const razem = staz(okresy);
  const umowy = staz(okresy.filter((o) => o.rodzaj === 'umowa'));
  const doUrlopu = zDni(naDni(razem) + SZKOLY[szkola].lata * 360);
  const dziesiec = 10 * 360;
  const dniUrlopu = naDni(doUrlopu) >= dziesiec ? 26 : 20;
  return { razem, umowy, doUrlopu, dniUrlopu, brakuje: dniUrlopu === 26 ? null : zDni(dziesiec - naDni(doUrlopu)) };
}

/** „11 lat, 2 miesiące i 12 dni”. */
export function opisStazu(s: Staz): string {
  const odm = (n: number, jeden: string, kilka: string, wiele: string) =>
    `${n} ${n === 1 ? jeden : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? kilka : wiele}`;
  const czesci = [odm(s.lata, 'rok', 'lata', 'lat'), odm(s.miesiace, 'miesiąc', 'miesiące', 'miesięcy'), odm(s.dni, 'dzień', 'dni', 'dni')];
  return `${czesci[0]}, ${czesci[1]} i ${czesci[2]}`;
}
