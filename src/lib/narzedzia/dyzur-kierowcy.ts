// Wynagrodzenie kierowcy za czas, który nie jest czasem pracy: dyżur, przerwy w jeździe, jazda w załodze bez prowadzenia
// i przerwa w przerywanym czasie pracy (ustawa o czasie pracy kierowców, t.j. Dz.U. 2026 poz. 477, sprawdzone 2026-11-13).
// - art. 9 ust. 1 i 5: dyżur (gotowość poza normalnymi godzinami pracy w zakładzie albo w miejscu wyznaczonym przez
//   pracodawcę) poza domem: czas wolny w wymiarze równym dyżurowi, a gdy nie można go udzielić, wynagrodzenie
//   z osobistego zaszeregowania (stawka godzinowa albo miesięczna), a bez wyodrębnionej stawki 60% wynagrodzenia;
//   dyżur w domu: bez czasu wolnego i wynagrodzenia;
// - art. 9 ust. 2, 3 i 6: przerwy na odpoczynek z art. 13 i czas nieprowadzenia pojazdu w załodze dwóch lub więcej
//   kierowców to czas dyżuru z wynagrodzeniem według przepisów u pracodawcy, nie niższym niż połowa wynagrodzenia z ust. 5;
// - art. 27 ust. 1 i 3: przerwy w jeździe z art. 7 rozporządzenia (WE) nr 561/2006 to czas dyżuru z art. 9 ust. 6, a ich
//   15 minut wlicza się do czasu pracy, gdy dobowy wymiar czasu pracy to co najmniej 6 godzin;
// - art. 10 ust. 2: okresy pozostawania do dyspozycji poza rozkładem czasu pracy to czas dyżuru;
// - art. 16 ust. 1–2: przerwa w przerywanym czasie pracy (jedna w dobie, do 5 h, przy przewozach regularnych do 6 h):
//   połowa wynagrodzenia z art. 9 ust. 5.
//
// Interpretacje (opisane w „Jak liczymy”):
// 1. Godzina przy stawce miesięcznej: ustawa nie mówi, jak ją przeliczyć, a § 4a rozporządzenia z 29 maja 1996 r. dotyczy
//    dyżuru z Kodeksu pracy. Stosujemy ten sam sposób: stawka miesięczna przez godziny do przepracowania w danym miesiącu
//    (wymiar z art. 130 Kp), bo daje stawkę z miesiąca, w którym był dyżur.
// 2. Dyspozycja poza rozkładem (art. 10 ust. 2): przepis mówi tylko „czas dyżuru”, bez wskazania ust. 5 albo 6; liczymy
//    jak dyżur z ust. 5 (pełna stawka), czyli wariant korzystniejszy dla kierowcy.
// 3. Wynagrodzenie z ust. 6 i art. 16 ust. 2 to minimum: przepisy u pracodawcy mogą dawać więcej.
// 4. Wariantu „60% wynagrodzenia” bez wyodrębnionej stawki nie liczymy: ustawa nie mówi, jak ustalić to wynagrodzenie.
import { wymiarMiesiaca } from './czas-pracy';
import { doGrosza } from './dodatek-nocny';
import { zl } from './format';

export type Stawka = 'godzinowa' | 'miesieczna';

export interface DaneDyzuruKierowcy {
  rodzaj: Stawka;
  /** Stawka godzinowa albo miesięczna z osobistego zaszeregowania (zł). */
  stawka: number;
  rok: number;
  miesiac: number;
  /** Dyżur poza domem bez pracy i dyspozycja poza rozkładem, za które nie udzielono czasu wolnego (h). */
  dyzur: number;
  /** Przerwy w jeździe z art. 7 rozporządzenia ponad 15 min wliczane do czasu pracy (h). */
  przerwy: number;
  /** Czas w załodze bez prowadzenia pojazdu (h). */
  zaloga: number;
  /** Przerwa w przerywanym czasie pracy (h). */
  przerywany: number;
}

export interface WynikDyzuruKierowcy {
  wymiar: number | null;
  zaGodzine: number;
  /** Połowa stawki za godzinę (art. 9 ust. 6 i art. 16 ust. 2). */
  polowa: number;
  kwotaDyzur: number;
  kwotaPrzerwy: number;
  kwotaZaloga: number;
  kwotaPrzerywany: number;
  razem: number;
}

export function dyzurKierowcy(d: DaneDyzuruKierowcy): WynikDyzuruKierowcy {
  if (!(d.stawka > 0 && d.stawka < 1_000_000)) throw new RangeError('Podaj stawkę');
  for (const g of [d.dyzur, d.przerwy, d.zaloga, d.przerywany]) if (!(g >= 0 && g <= 744)) throw new RangeError('Godziny od 0 do 744');
  const wymiar = d.rodzaj === 'miesieczna' ? wymiarMiesiaca(d.rok, d.miesiac).godziny : null;
  const zaGodzine = d.rodzaj === 'godzinowa' ? d.stawka : d.stawka / wymiar!;
  const polowa = zaGodzine / 2;
  const kwotaDyzur = doGrosza(zaGodzine * d.dyzur);
  const kwotaPrzerwy = doGrosza(polowa * d.przerwy);
  const kwotaZaloga = doGrosza(polowa * d.zaloga);
  const kwotaPrzerywany = doGrosza(polowa * d.przerywany);
  return {
    wymiar,
    zaGodzine: doGrosza(zaGodzine),
    polowa: doGrosza(polowa),
    kwotaDyzur,
    kwotaPrzerwy,
    kwotaZaloga,
    kwotaPrzerywany,
    razem: doGrosza(kwotaDyzur + kwotaPrzerwy + kwotaZaloga + kwotaPrzerywany),
  };
}

export interface OpisDyzuruKierowcy {
  razem: string;
  godzina: string;
  dyzur: string;
  przerwy: string;
  zaloga: string;
  przerywany: string;
}

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisDyzuruKierowcy(r: WynikDyzuruKierowcy, d: DaneDyzuruKierowcy): OpisDyzuruKierowcy {
  const h = (x: number) => `${String(x).replace('.', ',')} h`;
  const linia = (godz: number, kwota: number, stawka: number, przepis: string) => (godz > 0 ? `${zl(kwota)} (${h(godz)} × ${zl(stawka)}; ${przepis})` : '—');
  return {
    razem: zl(r.razem),
    godzina: `${zl(r.zaGodzine)}${r.wymiar !== null ? ` (pensja przez ${r.wymiar} h do przepracowania w miesiącu)` : ''}; połowa: ${zl(r.polowa)}`,
    dyzur: d.dyzur > 0 ? `${linia(d.dyzur, r.kwotaDyzur, r.zaGodzine, 'art. 9 ust. 5')} albo ${h(d.dyzur)} czasu wolnego` : '—',
    przerwy: linia(d.przerwy, r.kwotaPrzerwy, r.polowa, 'co najmniej, art. 27 ust. 1 i art. 9 ust. 6'),
    zaloga: linia(d.zaloga, r.kwotaZaloga, r.polowa, 'co najmniej, art. 9 ust. 3 i 6'),
    przerywany: linia(d.przerywany, r.kwotaPrzerywany, r.polowa, 'art. 16 ust. 2'),
  };
}

/** Przykład startowy: pensja 6000 zł, 4 h dyżuru, 10 h przerw ponad 15 min, 6 h w załodze. */
export const PRZYKLAD = { rodzaj: 'miesieczna' as Stawka, stawka: '6000', dyzur: '4', przerwy: '10', zaloga: '6', przerywany: '0' };
