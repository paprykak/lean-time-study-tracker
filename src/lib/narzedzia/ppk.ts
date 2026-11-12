// PPK: ile odkładasz, ile dopłaca pracodawca i państwo (ustawa o pracowniczych planach kapitałowych, t.j. Dz.U. 2026
// poz. 192; zmiana Dz.U. 2026 poz. 989 dotyczy tylko art. 8). Wpłata pracodawcy 1,5% plus dodatkowa do 2,5% (art. 26),
// pracownika 2% albo od 0,5% przy wynagrodzeniu do 1,2-krotności płacy minimalnej, plus dodatkowa do 2% (art. 27).
// Wpłata powitalna 250 zł po 3 pełnych miesiącach uczestnictwa i 3 miesiącach wpłat (art. 31), dopłata roczna 240 zł, gdy
// wpłaty w roku sięgną wpłat podstawowych od 6-krotności płacy minimalnej, a przy obniżonej wpłacie 25% tej kwoty (art. 32).
// Koszt dla pracownika: jego wpłata plus wyższa zaliczka na PIT od wpłaty pracodawcy (netto.ts).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { doGrosza } from './dodatek-nocny';
import { netto } from './netto';

export const PPK = {
  pracownik: 2,
  pracownikMin: 0.5,
  pracownikDodatkowaMax: 2,
  pracodawca: 1.5,
  pracodawcaDodatkowaMax: 2.5,
  powitalna: 250,
  doplataRoczna: 240,
} as const;

const placa = (rok: number) => {
  const p = PLACA_MINIMALNA[rok];
  if (!p) throw new RangeError(`Brak płacy minimalnej na ${rok} r.`);
  return p.miesiecznie;
};

/** Do tej kwoty miesięcznego wynagrodzenia wolno obniżyć wpłatę podstawową pracownika (art. 27 ust. 2). */
export const progObnizenia = (rok: number) => doGrosza(1.2 * placa(rok));

/** Minimalna suma wpłat w roku, od której przysługuje dopłata roczna (art. 32 ust. 2 i 3). */
export const progDoplaty = (rok: number, obnizona: boolean) => doGrosza(((PPK.pracownik + PPK.pracodawca) / 100) * 6 * placa(rok) * (obnizona ? 0.25 : 1));

export interface DanePpk {
  rok: number;
  brutto: number;
  /** Wpłata podstawowa pracownika: 2 albo od 0,5 (przy niskim wynagrodzeniu). */
  pracownik: number;
  pracownikDodatkowa: number;
  pracodawcaDodatkowa: number;
  /** Miesiące wpłat w roku. */
  miesiace: number;
  pit2?: boolean;
}

export function kalkulatorPpk(d: DanePpk) {
  if (!(d.pracownik >= PPK.pracownikMin && d.pracownik <= PPK.pracownik)) throw new RangeError('Wpłata podstawowa: od 0,5% do 2%');
  if (d.pracownik < PPK.pracownik && d.brutto > progObnizenia(d.rok)) throw new RangeError('Obniżona wpłata tylko do 1,2-krotności płacy minimalnej');
  if (!(d.pracownikDodatkowa >= 0 && d.pracownikDodatkowa <= PPK.pracownikDodatkowaMax)) throw new RangeError('Wpłata dodatkowa pracownika: do 2%');
  if (!(d.pracodawcaDodatkowa >= 0 && d.pracodawcaDodatkowa <= PPK.pracodawcaDodatkowaMax)) throw new RangeError('Wpłata dodatkowa pracodawcy: do 2,5%');
  if (!(Number.isInteger(d.miesiace) && d.miesiace >= 1 && d.miesiace <= 12)) throw new RangeError('Miesiące: od 1 do 12');
  const bez = netto({ brutto: d.brutto, pit2: d.pit2 });
  const z = netto({ brutto: d.brutto, pit2: d.pit2, ppk: { pracownik: d.pracownik + d.pracownikDodatkowa, pracodawca: PPK.pracodawca + d.pracodawcaDodatkowa } });
  const kosztMiesiecznie = doGrosza(bez.netto - z.netto);
  const wplatyMiesiecznie = doGrosza(z.ppkPracownik + z.ppkPracodawca);
  const wplatyRocznie = doGrosza(wplatyMiesiecznie * d.miesiace);
  const doplata = wplatyRocznie >= progDoplaty(d.rok, d.pracownik < PPK.pracownik) ? PPK.doplataRoczna : 0;
  const powitalna = d.miesiace >= 3 ? PPK.powitalna : 0;
  const kosztRocznie = doGrosza(kosztMiesiecznie * d.miesiace);
  const naKoncie = doGrosza(wplatyRocznie + doplata + powitalna);
  return {
    pracownikMiesiecznie: z.ppkPracownik,
    pracodawcaMiesiecznie: z.ppkPracodawca,
    nettoBez: bez.netto,
    nettoZ: z.netto,
    kosztMiesiecznie,
    wplatyRocznie,
    doplata,
    powitalna,
    kosztRocznie,
    naKoncie,
    /** Ile złotych trafia na konto PPK za każdą złotówkę mniej na rękę (bez wyników inwestycji). */
    mnoznik: kosztRocznie > 0 ? naKoncie / kosztRocznie : 0,
  };
}
