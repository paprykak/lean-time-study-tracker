import { describe, expect, it } from 'vitest';
import { dopuszczalnyCzasDrgan, ekspozycjaA8, ocenaDrgan } from './drgania';

describe('ekspozycja dzienna na drgania A(8)', () => {
  it('8 h przy 2,8 m/s² to 2,8; 2 h przy 5 m/s² to 2,5', () => {
    expect(ekspozycjaA8([{ a: 2.8, godziny: 8 }])).toBe(2.8);
    expect(ekspozycjaA8([{ a: 5, godziny: 2 }])).toBe(2.5);
  });
  it('kilka okresów: 1 h przy 6 m/s² i 3 h przy 3 m/s²', () => {
    // √((36·1 + 9·3) / 8) = √7,875 = 2,81
    expect(ekspozycjaA8([{ a: 6, godziny: 1 }, { a: 3, godziny: 3 }])).toBe(2.81);
  });
  it('dopuszczalny czas: przy 5,6 m/s² 2 godziny do 2,8 m/s²', () => {
    expect(dopuszczalnyCzasDrgan(5.6, 2.8)).toBe(2);
  });
});

describe('ocena według przepisów', () => {
  it('miejscowe: próg działania 2,5 i NDN 2,8 m/s²', () => {
    expect(ocenaDrgan([{ a: 2.4, godziny: 8 }], 'miejscowe', 'dorosly')).toMatchObject({ powyzejProgu: false, przekroczone: false });
    expect(ocenaDrgan([{ a: 2.6, godziny: 8 }], 'miejscowe', 'dorosly')).toMatchObject({ powyzejProgu: true, przekroczone: false });
    expect(ocenaDrgan([{ a: 3, godziny: 8 }], 'miejscowe', 'dorosly').przekroczone).toBe(true);
  });
  it('krótka ekspozycja do 30 minut: 11,2 m/s²', () => {
    expect(ocenaDrgan([{ a: 12, godziny: 0.25 }], 'miejscowe', 'dorosly')).toMatchObject({ a8: 2.12, przekroczoneKrotkie: true, przekroczone: true });
  });
  it('ogólne: 0,8 m/s²; młodociany 0,19; w ciąży każda praca wzbroniona', () => {
    expect(ocenaDrgan([{ a: 0.9, godziny: 8 }], 'ogolne', 'dorosly').przekroczone).toBe(true);
    expect(ocenaDrgan([{ a: 0.3, godziny: 8 }], 'ogolne', 'mlodociany').przekroczone).toBe(true);
    expect(ocenaDrgan([{ a: 0.1, godziny: 1 }], 'ogolne', 'ciaza')).toMatchObject({ wzbronione: true, przekroczone: true });
    expect(ocenaDrgan([{ a: 1.2, godziny: 8 }], 'miejscowe', 'ciaza').przekroczone).toBe(true);
  });
});
