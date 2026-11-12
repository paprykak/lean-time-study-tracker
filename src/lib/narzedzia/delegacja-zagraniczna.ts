// Należności z podróży służbowej poza granicami kraju: § 12–17 rozporządzenia z 29 stycznia 2013 r. (t.j. Dz.U. 2023
// poz. 2190), stawki z załącznika (src/data/diety-zagraniczne.ts). Czas za granicą liczy się od przekroczenia granicy
// (start samolotu z ostatniego lotniska w kraju, wyjście statku z ostatniego portu) do powrotu (§ 12); czas w kraju
// rozlicza się jak podróż krajową (§ 21). Godziny wpisuje się w czasie polskim, a liczymy rzeczywiste godziny
// (chwilaWPolsce z delegacja.ts).
//
// Dieta: za każdą dobę cała, za niepełną do 8 godzin 1/3, ponad 8 do 12 godzin 1/2, ponad 12 godzin cała (§ 13 ust. 3).
// Posiłki: śniadanie 15%, obiad 30%, kolacja 30% diety, a przy całodziennym wyżywieniu 25% diety (§ 14 ust. 1–3);
// potrącenie liczymy w dobie, w której zapewniono posiłki, nie poniżej zera, a całodzienne wyżywienie w niepełnej
// dobie jako 25% diety za tę dobę (strona opisuje, że przepis tego nie rozstrzyga). Nocleg bez rachunku: ryczałt 25%
// limitu (§ 16 ust. 2). Dojazd z i do dworca albo lotniska: jedna dieta, w jedną stronę połowa (§ 17 ust. 1–2);
// komunikacja miejscowa: 10% diety za każdą rozpoczętą dobę (§ 17 ust. 3); ryczałty z § 17 nie przysługują przy
// podróży samochodem, motocyklem albo motorowerem (§ 17 ust. 4).
import { DIETY_ZAGRANICZNE, INNE_PANSTWA, type DietaZagraniczna } from '../../data/diety-zagraniczne';
import { chwilaWPolsce, MAKS_DOB, poPolsku, type Posilek, type PosilkiDoby } from './delegacja';
import { doGrosza } from './dodatek-nocny';
import { dniMiedzy } from './terminy';

export const POSILEK_ZAGRANICA = { sniadanie: 15, obiad: 30, kolacja: 30 } as const;
export const CALODZIENNE_WYZYWIENIE_PROCENT = 25;
export const RYCZALT_NOCLEG_ZAGRANICA_PROCENT = 25;
export const KOMUNIKACJA_ZAGRANICA_PROCENT = 10;

const GODZINA = 3_600_000;
const DOBA = 24 * GODZINA;

/** Stawki dla państwa z tabeli albo dla państw spoza tabeli (lp. 115). */
export function stawki(panstwo: string): DietaZagraniczna {
  return DIETY_ZAGRANICZNE.find((x) => x.panstwo === panstwo) ?? INNE_PANSTWA;
}

/** Część diety za kolejne doby za granicą (§ 13 ust. 3): 1, 1/2 albo 1/3. */
export function czesciDiety(start: number, koniec: number): number[] {
  const czas = koniec - start;
  if (!(czas > 0)) throw new RangeError('Powrót musi być po wyjeździe');
  if (czas > MAKS_DOB * DOBA) throw new RangeError(`Kalkulator liczy podróże do ${MAKS_DOB} dób`);
  const pelne = Math.floor(czas / DOBA);
  const reszta = czas - pelne * DOBA;
  const czesci = Array<number>(pelne).fill(1);
  if (reszta > 0) czesci.push(reszta <= 8 * GODZINA ? 1 / 3 : reszta <= 12 * GODZINA ? 1 / 2 : 1);
  return czesci;
}

export type Dojazd = 'brak' | 'oba' | 'jeden';

export interface DaneDelegacjiZagranicznej {
  panstwo: string;
  /** Przekroczenie granicy w drodze za granicę i w drodze powrotnej, w czasie polskim. */
  wyjazd: { data: string; godzina: string };
  powrot: { data: string; godzina: string };
  posilki?: PosilkiDoby[];
  noclegiRyczalt?: number;
  dojazd?: Dojazd;
  komunikacja?: boolean;
}

export function delegacjaZagraniczna(d: DaneDelegacjiZagranicznej) {
  const s = stawki(d.panstwo);
  const start = chwilaWPolsce(d.wyjazd.data, d.wyjazd.godzina);
  const koniec = chwilaWPolsce(d.powrot.data, d.powrot.godzina);
  const czesci = czesciDiety(start, koniec);
  let dietaPrzed = 0;
  let dieta = 0;
  czesci.forEach((czesc, i) => {
    const zaDobe = s.dieta * czesc;
    const p = d.posilki?.[i] ?? {};
    const posilki = (Object.keys(POSILEK_ZAGRANICA) as Posilek[]).filter((k) => p[k]);
    const naleznosc =
      posilki.length === 3
        ? (zaDobe * CALODZIENNE_WYZYWIENIE_PROCENT) / 100
        : Math.max(0, zaDobe - posilki.reduce((suma, k) => suma + (s.dieta * POSILEK_ZAGRANICA[k]) / 100, 0));
    dietaPrzed += zaDobe;
    dieta += naleznosc;
  });
  const noce = dniMiedzy(poPolsku(start).data, poPolsku(koniec).data);
  const noclegi = d.noclegiRyczalt ?? 0;
  if (!(Number.isInteger(noclegi) && noclegi >= 0)) throw new RangeError('Liczba noclegów musi być całkowita');
  if (noclegi > noce) throw new RangeError('Za dużo noclegów');
  const rozpoczeteDoby = Math.ceil((koniec - start) / DOBA);
  const dojazd = d.dojazd === 'oba' ? s.dieta : d.dojazd === 'jeden' ? s.dieta / 2 : 0;
  const komunikacja = d.komunikacja ? (rozpoczeteDoby * s.dieta * KOMUNIKACJA_ZAGRANICA_PROCENT) / 100 : 0;
  const ryczaltNoclegi = (noclegi * s.nocleg * RYCZALT_NOCLEG_ZAGRANICA_PROCENT) / 100;
  return {
    stawki: s,
    czas: koniec - start,
    /** Liczba diet przed potrąceniem, np. 2 i 1/3. */
    liczbaDiet: czesci.reduce((a, b) => a + b, 0),
    dietaPrzedPotraceniem: doGrosza(dietaPrzed),
    potracenie: doGrosza(dietaPrzed - dieta),
    dieta: doGrosza(dieta),
    noce,
    ryczaltNoclegi: doGrosza(ryczaltNoclegi),
    rozpoczeteDoby,
    dojazd: doGrosza(dojazd),
    komunikacja: doGrosza(komunikacja),
    razem: doGrosza(dieta + ryczaltNoclegi + dojazd + komunikacja),
  };
}

const KWOTA = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/** „114,33 EUR”. */
export const wWalucie = (x: number, waluta: string) => `${KWOTA.format(x)} ${waluta}`;

/** „1 dieta”, „1/3 diety”, „2 i 1/3 diety”, „5 diet”. */
export function ileDietZagranicznych(n: number): string {
  const cale = Math.floor(n + 1e-9);
  const reszta = n - cale;
  const ulamek = Math.abs(reszta - 1 / 3) < 1e-9 ? '1/3' : Math.abs(reszta - 1 / 2) < 1e-9 ? '1/2' : '';
  if (ulamek) return cale ? `${cale} i ${ulamek} diety` : `${ulamek} diety`;
  const n10 = cale % 10;
  const n100 = cale % 100;
  return `${cale} ${cale === 1 ? 'dieta' : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? 'diety' : 'diet'}`;
}
