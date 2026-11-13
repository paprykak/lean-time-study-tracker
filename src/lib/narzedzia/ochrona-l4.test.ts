import { describe, expect, it } from 'vitest';
import { ochronaNaL4 } from './ochrona-l4';

describe('ochrona na długim L4 (art. 41 i 53 § 1 pkt 1 Kp)', () => {
  it('staż poniżej 6 miesięcy: 3 miesiące niezdolności (lit. a)', () => {
    expect(ochronaNaL4({ poczatek: '2026-01-01', szescMiesiecy: false, przyczyna: 'choroba', rehabilitacyjne: false })).toEqual({
      ciaza: false,
      litera: 'a',
      ostatniDzien: '2026-03-31',
      odKiedy: '2026-04-01',
    });
  });
  it('3 miesiące od końca miesiąca (konwencja terminy.ts, Python): od 30 listopada do 28 lutego', () => {
    expect(ochronaNaL4({ poczatek: '2026-11-30', szescMiesiecy: false, przyczyna: 'choroba', rehabilitacyjne: false })).toMatchObject({ ostatniDzien: '2027-02-28', odKiedy: '2027-03-01' });
    expect(ochronaNaL4({ poczatek: '2027-11-30', szescMiesiecy: false, przyczyna: 'choroba', rehabilitacyjne: false })).toMatchObject({ ostatniDzien: '2028-02-29' });
  });
  it('staż od 6 miesięcy: 182 dni okresu zasiłkowego (lit. b)', () => {
    expect(ochronaNaL4({ poczatek: '2026-01-01', szescMiesiecy: true, przyczyna: 'choroba', rehabilitacyjne: false })).toMatchObject({
      litera: 'b',
      dniZasilku: 182,
      koniecZasilku: '2026-07-01',
      odKiedy: '2026-07-02',
    });
  });
  it('ze świadczeniem rehabilitacyjnym: plus 3 miesiące', () => {
    expect(ochronaNaL4({ poczatek: '2026-01-01', szescMiesiecy: true, przyczyna: 'choroba', rehabilitacyjne: true })).toMatchObject({
      koniecZasilku: '2026-07-01',
      ostatniDzien: '2026-10-01',
      odKiedy: '2026-10-02',
    });
  });
  it('gruźlica: 270 dni; wypadek przy pracy: lit. b także przy krótkim stażu', () => {
    expect(ochronaNaL4({ poczatek: '2026-01-01', szescMiesiecy: true, przyczyna: 'gruzlica', rehabilitacyjne: false })).toMatchObject({ dniZasilku: 270, koniecZasilku: '2026-09-27' });
    expect(ochronaNaL4({ poczatek: '2026-01-01', szescMiesiecy: false, przyczyna: 'wypadek', rehabilitacyjne: false })).toMatchObject({ litera: 'b', koniecZasilku: '2026-07-01' });
  });
  it('ciąża: art. 177', () => {
    expect(ochronaNaL4({ poczatek: '2026-01-01', szescMiesiecy: true, przyczyna: 'ciaza', rehabilitacyjne: false })).toEqual({ ciaza: true });
  });
});
