// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (Decimal, art. 27f ustawy o PIT).
import { describe, expect, it } from 'vitest';
import { LATA_PIT, kwotaMiesiaca, limitDochoduDziecka, opisUlgi, ulgaNaDzieci, type DaneUlgi } from './ulga-na-dzieci';

const baza: DaneUlgi = { dzieci: [], sytuacja: 'inna', dochod: 30_000, czesc: 100, podatek: 10_000, skladki: 0 };
const caly = { od: 1, do: 12 };

describe('ulga na dzieci (art. 27f ustawy o PIT)', () => {
  it('kwoty miesięczne: 92,67 zł na 1. i 2., 166,67 zł na 3., 225 zł na 4. i kolejne', () => {
    expect([0, 1, 2, 3, 4, 5].map(kwotaMiesiaca)).toEqual([0, 92.67, 185.34, 352.01, 577.01, 802.01]);
  });
  it('rok: 1112,04 zł na jedno, 2224,08 zł na dwoje, 4224,12 zł na troje, 9624,12 zł na pięcioro', () => {
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly] }).przysluguje).toBe(1112.04);
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly, caly] }).przysluguje).toBe(2224.08);
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly, caly, caly] }).przysluguje).toBe(4224.12);
    expect(ulgaNaDzieci({ ...baza, dzieci: Array(5).fill(caly), podatek: 100_000 }).przysluguje).toBe(9624.12);
  });
  it('dzieci w części roku: kwota zależy od liczby dzieci w miesiącu; połowa dla jednego rodzica', () => {
    const dzieci = [caly, { od: 6, do: 12 }, { od: 10, do: 12 }];
    const r = ulgaNaDzieci({ ...baza, dzieci });
    expect(r.miesiace).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3]);
    expect(r.przysluguje).toBe(2260.74);
    expect(ulgaNaDzieci({ ...baza, dzieci, czesc: 50 }).przysluguje).toBe(1130.37);
  });
  it('jedno dziecko: limit 56 000 zł „nie przekroczyły”, więc 56 000 zł mieści się, 56 000,01 zł już nie', () => {
    expect(ulgaNaDzieci({ ...baza, dzieci: [{ od: 3, do: 8 }], dochod: 56_000 }).przysluguje).toBe(556.02);
    const ponad = ulgaNaDzieci({ ...baza, dzieci: [{ od: 3, do: 8 }], dochod: 56_000.01 });
    expect(ponad).toMatchObject({ ponadLimit: true, przysluguje: 0, limit: 56_000 });
  });
  it('limit 112 000 zł w małżeństwie przez cały rok i u samotnego rodzica; ślub w trakcie roku jak bez małżeństwa', () => {
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly], sytuacja: 'malzenstwo', dochod: 112_000 }).przysluguje).toBe(1112.04);
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly], sytuacja: 'samotny', dochod: 100_000 }).przysluguje).toBe(1112.04);
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly], sytuacja: 'slub', dochod: 60_000 }).ponadLimit).toBe(true);
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly], sytuacja: 'malzenstwo', dochod: 112_000.01 }).przysluguje).toBe(0);
  });
  it('bez limitu: dziecko z orzeczeniem, dwoje dzieci choćby w jednym miesiącu', () => {
    expect(ulgaNaDzieci({ ...baza, dzieci: [caly], dochod: 200_000, orzeczenie: true }).przysluguje).toBe(1112.04);
    const r = ulgaNaDzieci({ ...baza, dzieci: [{ od: 1, do: 6 }, { od: 6, do: 12 }], dochod: 200_000 });
    expect(r.limit).toBeNull();
    expect(r.przysluguje).toBe(doGr(11 * 92.67 + 185.34));
  });
  it('ulga ponad podatek: zwrot do wysokości składek, reszta przepada', () => {
    const r = ulgaNaDzieci({ ...baza, dzieci: [caly, caly], podatek: 1837.8, skladki: 12_024.96 });
    expect(r).toMatchObject({ odliczenie: 1837.8, zwrot: 386.28, przepada: 0 });
    const s = ulgaNaDzieci({ ...baza, dzieci: [caly, caly, caly], podatek: 0, skladki: 1000 });
    expect(s).toMatchObject({ odliczenie: 0, zwrot: 1000, przepada: 3224.12 });
  });
  it('limit dochodów pełnoletniego uczącego się dziecka: 12 × renta socjalna z grudnia', () => {
    expect(limitDochoduDziecka(2025)).toBe(22_546.92);
    expect(limitDochoduDziecka(2026)).toBe(23_741.88);
    expect(limitDochoduDziecka(2020)).toBeNull();
  });
  it('lata do wyboru obejmują poprzedni rok (zeznanie składa się w roku następnym)', () => {
    const rok = new Date().getUTCFullYear();
    expect(LATA_PIT, `dopisz rentę socjalną z grudnia ${rok - 1} r. do RENTA_SOCJALNA_GRUDZIEN i sprawdź przepisy PIT na ${rok - 1} r.`).toContain(rok - 1);
  });
  it('błędne dane', () => {
    expect(() => ulgaNaDzieci({ ...baza, dzieci: [{ od: 7, do: 3 }] })).toThrow(RangeError);
    expect(() => ulgaNaDzieci({ ...baza, dzieci: [{ od: 0, do: 3 }] })).toThrow(RangeError);
    expect(() => ulgaNaDzieci({ ...baza, czesc: 120 })).toThrow(RangeError);
    expect(() => ulgaNaDzieci({ ...baza, dochod: -1 })).toThrow(RangeError);
  });
  it('opis: miesiące z odmianą, brak ulgi ponad limit, zwrot', () => {
    expect(opisUlgi({ ...baza, dzieci: [{ od: 3, do: 8 }] }, 2025).opis).toBe('za 6 miesięcy z ulgą');
    expect(opisUlgi({ ...baza, dzieci: [{ od: 12, do: 12 }], czesc: 50 }, 2025).opis).toBe('za 1 miesiąc z ulgą, Twoja część 50%');
    expect(opisUlgi({ ...baza, dzieci: [caly], dochod: 60_000 }, 2025).opis).toMatch(/^bez ulgi/);
    expect(opisUlgi({ ...baza, dzieci: [caly, caly], podatek: 0, skladki: 5000 }, 2026).uwagi.join(' ')).toMatch(/23\s741,88/);
    expect(opisUlgi(baza, 2025).opis).toBe('dodaj dziecko, na które przysługuje ulga');
    const osobno = opisUlgi({ ...baza, dzieci: [{ od: 1, do: 3 }, { od: 10, do: 12 }], dochod: 60_000 }, 2025);
    expect(osobno.uwagi[0]).toContain('nie były z Tobą w tym samym miesiącu');
    expect(opisUlgi({ ...baza, dzieci: [caly], podatek: 0 }, 2025).uwagi.join(' ')).toContain('Wpisz składki');
  });
});

function doGr(x: number) {
  return Math.round(x * 100) / 100;
}
