import { describe, expect, it } from 'vitest';
import { dopuszczalnyCzas, ekspozycja8h, godzinyIMinuty, ocenaHalasu } from './halas';

describe('ekspozycja na hałas odniesiona do 8 godzin', () => {
  it('8 h przy 85 dB to 85 dB; 4 h przy 88 dB to 85 dB', () => {
    expect(ekspozycja8h([{ poziom: 85, godziny: 8 }])).toBe(85);
    expect(ekspozycja8h([{ poziom: 88, godziny: 4 }])).toBe(85);
  });
  it('zmiana 12 h przy 85 dB: 86,8 dB', () => {
    expect(ekspozycja8h([{ poziom: 85, godziny: 12 }])).toBe(86.8);
  });
  it('kilka okresów: 2 h przy 95 dB i 6 h przy 80 dB', () => {
    // 10·lg((2/8)·10^9,5 + (6/8)·10^8) = 89,4 dB
    expect(ekspozycja8h([{ poziom: 95, godziny: 2 }, { poziom: 80, godziny: 6 }])).toBe(89.4);
  });
  it('dopuszczalny czas: 85 dB 8 h, 91 dB około 2 h, 100 dB około 15 minut', () => {
    expect(dopuszczalnyCzas(85)).toBe(8);
    expect(godzinyIMinuty(dopuszczalnyCzas(91))).toBe('2 h');
    expect(godzinyIMinuty(dopuszczalnyCzas(100))).toBe('15 min');
    expect(godzinyIMinuty(dopuszczalnyCzas(88))).toBe('4 h');
  });
});

describe('ocena według przepisów', () => {
  it('pracownik: próg działania 80 dB i NDN 85 dB', () => {
    expect(ocenaHalasu([{ poziom: 79, godziny: 8 }], 'dorosly')).toMatchObject({ powyzejProgu: false, osiagaNdn: false, przekroczone: false });
    expect(ocenaHalasu([{ poziom: 83, godziny: 8 }], 'dorosly')).toMatchObject({ powyzejProgu: true, osiagaNdn: false });
    expect(ocenaHalasu([{ poziom: 85, godziny: 8 }], 'dorosly')).toMatchObject({ osiagaNdn: true, przekroczone: false });
    expect(ocenaHalasu([{ poziom: 86, godziny: 8 }], 'dorosly').przekroczone).toBe(true);
    expect(ocenaHalasu([{ poziom: 80, godziny: 8 }], 'dorosly', 116).przekroczone).toBe(true);
  });
  it('młodociany 80 dB, kobieta w ciąży 65 dB', () => {
    expect(ocenaHalasu([{ poziom: 81, godziny: 8 }], 'mlodociany').przekroczone).toBe(true);
    expect(ocenaHalasu([{ poziom: 70, godziny: 8 }], 'ciaza').przekroczone).toBe(true);
    expect(ocenaHalasu([{ poziom: 64, godziny: 8 }], 'ciaza', undefined, 131).przekroczone).toBe(true);
  });
  it('błędy', () => {
    expect(() => ekspozycja8h([])).toThrow(RangeError);
    expect(() => ekspozycja8h([{ poziom: 200, godziny: 1 }])).toThrow(RangeError);
  });
});
