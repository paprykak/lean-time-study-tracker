import { describe, expect, it } from 'vitest';
import { odszkodowanieZaZwolnienie, zaCzasBezPracy, type DaneOdszkodowania } from './odszkodowanie-zwolnienie';

// 2026 r.: 251 dni pracy, współczynnik 251/12; 6000 zł → 6000 · 12 / 251 = 286,85 zł za dzień pracy.
const licz = (d: Partial<DaneOdszkodowania>) => odszkodowanieZaZwolnienie({ sytuacja: 'wypowiedzenie', pensja: 6000, rok: 2026, ...d });

describe('wypowiedzenie niezgodne z prawem (art. 47¹ Kp)', () => {
  it('od okresu wypowiedzenia (nie mniej niż 2 tygodnie) do 3 miesięcy', () => {
    expect(licz({ okres: '1m' })).toMatchObject({ od: 6000, do: 18000, polowaWprost: true, zaDzien: 286.85 });
    expect(licz({ okres: '2t' })).toMatchObject({ od: 3000, do: 18000, polowaWprost: false });
    expect(licz({ okres: '3m' })).toMatchObject({ od: 18000, do: 18000 });
  });
  it('umowa na czas określony: do końca umowy, najwyżej 3 miesiące', () => {
    expect(licz({ okres: '1m', okreslona: true, dniPracy: 10 })).toMatchObject({ od: 6000, do: 18000, doKoncaUmowy: 2868.53 });
    expect(licz({ okres: '1m', okreslona: true, dniPracy: 100 }).doKoncaUmowy).toBe(18000);
  });
});

describe('dyscyplinarka, odejście z winy pracodawcy, roszczenie pracodawcy (art. 58, 55 § 1¹, 61²)', () => {
  it('wynagrodzenie za okres wypowiedzenia', () => {
    expect(licz({ sytuacja: 'dyscyplinarka', okres: '3m' })).toMatchObject({ od: 18000, do: 18000 });
    expect(licz({ sytuacja: 'z-winy-pracodawcy', okres: '2t' })).toMatchObject({ od: 3000, polowaWprost: true });
    expect(licz({ sytuacja: 'od-pracownika', okres: '1m' })).toMatchObject({ od: 6000, do: 6000 });
  });
  it('czas określony: do końca umowy, nie więcej niż za okres wypowiedzenia', () => {
    expect(licz({ sytuacja: 'dyscyplinarka', okres: '3m', okreslona: true, dniPracy: 10 }).od).toBe(2868.53);
    expect(licz({ sytuacja: 'dyscyplinarka', okres: '2t', okreslona: true, dniPracy: 30 }).od).toBe(3000);
  });
});

describe('za dni pracy (§ 2a rozporządzenia z 1996 r.)', () => {
  it('dyscyplinarka w okresie wypowiedzenia (art. 60) i okres próbny (art. 50 § 1)', () => {
    expect(licz({ sytuacja: 'w-wypowiedzeniu', dniPracy: 15 }).od).toBe(4302.79);
    expect(licz({ sytuacja: 'probny', dniPracy: 5 }).od).toBe(1434.26);
  });
  it('wynagrodzenie za czas bez pracy po przywróceniu', () => {
    expect(zaCzasBezPracy('wypowiedzenie', '3m')).toContain('1 miesiąc');
    expect(zaCzasBezPracy('wypowiedzenie', '1m')).toContain('2 miesiące');
    expect(zaCzasBezPracy('dyscyplinarka', '1m')).toContain('od 1 do 3');
    expect(zaCzasBezPracy('probny', '1m')).toBeNull();
  });
  it('błędy', () => {
    expect(() => licz({ pensja: 0 })).toThrow(RangeError);
    expect(() => licz({ sytuacja: 'probny' })).toThrow(RangeError);
    expect(() => licz({ okreslona: true })).toThrow(RangeError);
  });
});
