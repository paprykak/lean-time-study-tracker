import { describe, expect, it } from 'vitest';
import { wynagrodzenieUrlopowe } from './wynagrodzenie-urlopowe';

describe('wynagrodzenie za urlop (§ 7–9 rozporządzenia urlopowego)', () => {
  it('dodatki nocne i nadgodziny 1800 zł z 480 h, 40 h urlopu: 150 zł ponad pensję', () => {
    // 1800 / 480 = 3,75 zł za godzinę × 40 h = 150 zł
    expect(wynagrodzenieUrlopowe({ zmienneSuma: 1800, godzinyPrzepracowane: 480, godzinyUrlopu: 40, stala: 6000 })).toEqual({ zaGodzine: 3.75, zmiennaCzesc: 150, stala: 6000 });
  });
  it('stawka godzinowa: całe wynagrodzenie jako zmienne', () => {
    // 3 miesiące: 504 h × 32 zł + 900 zł dodatków = 17 028 zł; 33,79 zł za godzinę × 24 h
    expect(wynagrodzenieUrlopowe({ zmienneSuma: 17028, godzinyPrzepracowane: 504, godzinyUrlopu: 24 })).toMatchObject({ zaGodzine: 33.79, zmiennaCzesc: 810.86 });
  });
  it('błędy', () => {
    expect(() => wynagrodzenieUrlopowe({ zmienneSuma: 100, godzinyPrzepracowane: 0, godzinyUrlopu: 8 })).toThrow(RangeError);
    expect(() => wynagrodzenieUrlopowe({ zmienneSuma: 100, godzinyPrzepracowane: 10, godzinyUrlopu: 0 })).toThrow(RangeError);
  });
});
