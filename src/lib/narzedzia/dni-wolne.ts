// Dni wolne od pracy, długie weekendy i okazje urlopowe dla pracy od poniedziałku do piątku. Święta z ustawy
// o dniach wolnych od pracy (czas-pracy.ts). Święto w sobotę obniża wymiar czasu pracy o 8 godzin (art. 130 § 2 Kp),
// więc pracownik dostaje za nie inny dzień wolny w okresie rozliczeniowym; jego termin nie wynika z kalendarza,
// dlatego nie wliczamy go do długich weekendów. Urlop liczymy w dniach roboczych (pon.–pt. bez świąt).
import { dzienMiesiaca, swieta, type Swieto } from './czas-pracy';
import { dniMiedzy, dodajDni } from './terminy';

/** 0 = niedziela, 6 = sobota. */
export const dzienTygodnia = (data: string) => new Date(`${data}T00:00:00Z`).getUTCDay();
const weekend = (data: string) => dzienTygodnia(data) % 6 === 0;

export interface DlugiWeekend {
  od: string;
  do: string;
  dni: number;
  swieta: Swieto[];
}

export interface Okazja {
  urlopOd: string;
  urlopDo: string;
  dniUrlopu: number;
  wolneOd: string;
  wolneDo: string;
  dniWolnego: number;
}

interface Blok {
  wolny: boolean;
  od: string;
  do: string;
}

/** Bloki kolejnych dni wolnych i roboczych od 1 grudnia roku poprzedniego do 31 stycznia następnego. */
function bloki(rok: number): { lista: Blok[]; swieto: Map<string, Swieto> } {
  const swieto = new Map([...swieta(rok - 1), ...swieta(rok), ...swieta(rok + 1)].map((s) => [s.data, s]));
  const lista: Blok[] = [];
  for (let d = `${rok - 1}-12-01`; d <= `${rok + 1}-01-31`; d = dodajDni(d, 1)) {
    const wolny = weekend(d) || swieto.has(d);
    const ostatni = lista[lista.length - 1];
    if (ostatni && ostatni.wolny === wolny) ostatni.do = d;
    else lista.push({ wolny, od: d, do: d });
  }
  return { lista, swieto };
}

const swietaWOkresie = (swieto: Map<string, Swieto>, od: string, do_: string) => [...swieto.values()].filter((s) => s.data >= od && s.data <= do_);

/** Co najmniej 3 dni wolne z rzędu bez urlopu, w tym święto z danego roku. */
export function dlugieWeekendy(rok: number): DlugiWeekend[] {
  const { lista, swieto } = bloki(rok);
  return lista
    .filter((b) => b.wolny)
    .map((b) => ({ od: b.od, do: b.do, dni: dniMiedzy(b.od, b.do) + 1, swieta: swietaWOkresie(swieto, b.od, b.do) }))
    .filter((b) => b.dni >= 3 && b.swieta.some((s) => s.data.startsWith(`${rok}-`)));
}

/**
 * Urlop na dni robocze między blokami wolnego: od 1 do `maxUrlopu` dni, urlop zaczyna się w danym roku, w okresie
 * jest święto w dzień roboczy i każdy dzień urlopu daje co najmniej 2 dni wolnego.
 */
export function okazje(rok: number, maxUrlopu = 5): Okazja[] {
  const { lista, swieto } = bloki(rok);
  const wynik: Okazja[] = [];
  lista.forEach((start, i) => {
    if (!start.wolny) return;
    let urlop = 0;
    for (let j = i + 2; j < lista.length; j += 2) {
      urlop += dniMiedzy(lista[j - 1].od, lista[j - 1].do) + 1;
      if (urlop > maxUrlopu) break;
      const okazja: Okazja = {
        urlopOd: lista[i + 1].od,
        urlopDo: lista[j - 1].do,
        dniUrlopu: urlop,
        wolneOd: start.od,
        wolneDo: lista[j].do,
        dniWolnego: dniMiedzy(start.od, lista[j].do) + 1,
      };
      const swietoRobocze = swietaWOkresie(swieto, okazja.wolneOd, okazja.wolneDo).some((s) => !weekend(s.data));
      if (swietoRobocze && okazja.urlopOd.startsWith(`${rok}-`) && okazja.dniWolnego >= 2 * urlop) wynik.push(okazja);
    }
  });
  return wynik.sort((a, b) => a.urlopOd.localeCompare(b.urlopOd) || a.dniUrlopu - b.dniUrlopu);
}

/** Podział świąt roku według dnia tygodnia. */
export function podsumowanieRoku(rok: number) {
  const lista = swieta(rok);
  return {
    swieta: lista,
    wDniRobocze: lista.filter((s) => !weekend(s.data)),
    wSobote: lista.filter((s) => dzienTygodnia(s.data) === 6),
    wNiedziele: lista.filter((s) => dzienTygodnia(s.data) === 0),
  };
}

/** Największa liczba dni wolnego; przy remisie mniej dni urlopu, potem wcześniejszy termin. */
export const najlepsza = (lista: Okazja[]): Okazja | null =>
  lista.reduce<Okazja | null>((a, b) => (!a || b.dniWolnego > a.dniWolnego || (b.dniWolnego === a.dniWolnego && b.dniUrlopu < a.dniUrlopu) ? b : a), null);

/** „4–8 stycznia”, „30 października – 1 listopada”, „24 grudnia 2027 r. – 2 stycznia 2028 r.”. */
export function zakres(od: string, do_: string): string {
  if (od === do_) return dzienMiesiaca(od);
  const [r1, m1, d1] = od.split('-');
  const [r2, m2] = do_.split('-');
  if (r1 !== r2) return `${dzienMiesiaca(od)} ${r1} r. – ${dzienMiesiaca(do_)} ${r2} r.`;
  if (m1 !== m2) return `${dzienMiesiaca(od)} – ${dzienMiesiaca(do_)}`;
  return `${Number(d1)}–${dzienMiesiaca(do_)}`;
}
