// Wypłata w miesiącu z nadgodzinami i dodatkiem nocnym: brutto i na rękę. Składa gotowe obliczenia: nadgodziny
// (art. 151^1 Kp, stawka z pensji przez wymiar miesiąca, nadgodziny.ts), dodatek nocny (art. 151^8 § 1, z płacy
// minimalnej, dodatek-nocny.ts) i netto z umowy o pracę (netto.ts, z opcjonalnym PPK).
import { dodatekNocny } from './dodatek-nocny';
import { doGrosza } from './dodatek-nocny';
import { nadgodziny } from './nadgodziny';
import { netto } from './netto';

export interface DaneWyplaty {
  rok: number;
  miesiac: number;
  pensja: number;
  godziny50: number;
  godziny100: number;
  godzinyNocne: number;
  procentNocny?: number;
  pit2?: boolean;
  ppk?: boolean;
}

export function wyplataZDodatkami(d: DaneWyplaty) {
  const n = nadgodziny({ wynagrodzenie: { rodzaj: 'miesieczna', kwota: d.pensja, rok: d.rok, miesiac: d.miesiac }, godziny50: d.godziny50, godziny100: d.godziny100 });
  const noc = dodatekNocny({ rok: d.rok, miesiac: d.miesiac, godziny: d.godzinyNocne, procent: d.procentNocny });
  const brutto = doGrosza(d.pensja + n.razem + noc.kwota);
  const ppk = d.ppk ? { pracownik: 2, pracodawca: 1.5 } : undefined;
  const bez = netto({ brutto: d.pensja, pit2: d.pit2, ppk });
  const z = netto({ brutto, pit2: d.pit2, ppk });
  return {
    stawka: n.stawka,
    wymiar: n.wymiar,
    zaNadgodziny: n.razem,
    dodatek50: n.dodatek50,
    dodatek100: n.dodatek100,
    normalneZaNadgodziny: n.normalne,
    dodatekNocny: noc.kwota,
    nocnyZaGodzine: noc.zaGodzine,
    brutto,
    netto: z.netto,
    nettoSamaPensja: bez.netto,
    dodatkiNaReke: doGrosza(z.netto - bez.netto),
    progPrzekroczony: z.progPrzekroczony,
    /** Miesiąc, w którym przy takiej wypłacie co miesiąc dochód od początku roku przekroczy 120 000 zł (netto.ts). */
    miesiacProgu: z.miesiacProgu,
  };
}
