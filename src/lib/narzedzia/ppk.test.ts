import { describe, expect, it } from 'vitest';
import { kalkulatorPpk, progDoplaty, progObnizenia } from './ppk';

// Wartości policzone ręcznie z zasad netto.ts (składki, zaliczka w pełnych złotych) i art. 26–32 ustawy o PPK.
describe('PPK (art. 26, 27, 31 i 32 ustawy o PPK)', () => {
  it('progi 2026: obniżenie do 5767,20 zł, dopłata od 1009,26 zł albo 252,32 zł wpłat w roku', () => {
    expect(progObnizenia(2026)).toBe(5767.2);
    expect(progDoplaty(2026, false)).toBe(1009.26);
    expect(progDoplaty(2026, true)).toBe(252.32);
  });
  it('6000 zł, 2% i 1,5%, cały rok: 131 zł mniej na rękę, 3010 zł na koncie po roku', () => {
    expect(kalkulatorPpk({ rok: 2026, brutto: 6000, pracownik: 2, pracownikDodatkowa: 0, pracodawcaDodatkowa: 0, miesiace: 12 })).toMatchObject({
      pracownikMiesiecznie: 120,
      pracodawcaMiesiecznie: 90,
      nettoBez: 4420.43,
      nettoZ: 4289.43,
      kosztMiesiecznie: 131,
      wplatyRocznie: 2520,
      doplata: 240,
      powitalna: 250,
      kosztRocznie: 1572,
      naKoncie: 3010,
    });
  });
  it('płaca minimalna i obniżona wpłata 0,5%', () => {
    expect(kalkulatorPpk({ rok: 2026, brutto: 4806, pracownik: 0.5, pracownikDodatkowa: 0, pracodawcaDodatkowa: 0, miesiace: 12 })).toMatchObject({
      pracownikMiesiecznie: 24.03,
      pracodawcaMiesiecznie: 72.09,
      nettoBez: 3605.85,
      nettoZ: 3573.82,
      kosztMiesiecznie: 32.03,
      wplatyRocznie: 1153.44,
      doplata: 240,
      naKoncie: 1643.44,
    });
  });
  it('2 miesiące: bez dopłaty rocznej i bez wpłaty powitalnej', () => {
    expect(kalkulatorPpk({ rok: 2026, brutto: 6000, pracownik: 2, pracownikDodatkowa: 0, pracodawcaDodatkowa: 0, miesiace: 2 })).toMatchObject({ doplata: 0, powitalna: 0, wplatyRocznie: 420 });
  });
  it('błędy', () => {
    expect(() => kalkulatorPpk({ rok: 2026, brutto: 6000, pracownik: 0.5, pracownikDodatkowa: 0, pracodawcaDodatkowa: 0, miesiace: 12 })).toThrow(RangeError);
    expect(() => kalkulatorPpk({ rok: 2026, brutto: 6000, pracownik: 2, pracownikDodatkowa: 3, pracodawcaDodatkowa: 0, miesiace: 12 })).toThrow(RangeError);
  });
});
