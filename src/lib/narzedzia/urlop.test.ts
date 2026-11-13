import { describe, expect, it } from 'vitest';
import { urlop, type DaneUrlopu } from './urlop';

const baza: DaneUrlopu = { stazMiesiecy: 0, szkola: 'brak', etat: [1, 1], sytuacja: 'caly-rok' };
const u = (z: Partial<DaneUrlopu>) => urlop({ ...baza, ...z });

describe('wymiar urlopu (art. 154–155 Kp)', () => {
  it('20 dni do 10 lat, 26 dni od 10 lat stażu ze szkołą', () => {
    expect(u({ stazMiesiecy: 9 * 12 + 11 }).wymiarPodstawowy).toBe(20);
    expect(u({ stazMiesiecy: 120 }).wymiarPodstawowy).toBe(26);
    expect(u({ stazMiesiecy: 2 * 12, szkola: 'wyzsza' }).wymiarPodstawowy).toBe(26);
    expect(u({ stazMiesiecy: 5 * 12, szkola: 'liceum' }).doDziesieciuLat).toBe(12);
  });
  it('niepełny etat proporcjonalnie, w górę do pełnego dnia (przykłady gov.pl i biznes.gov.pl)', () => {
    expect(u({ etat: [1, 4] }).wymiarRoczny).toBe(5);
    expect(u({ stazMiesiecy: 120, etat: [1, 3] }).wymiarRoczny).toBe(9);
    expect(u({ stazMiesiecy: 120, etat: [1, 2] })).toMatchObject({ wymiarRoczny: 13, godziny: 104 });
  });
  it('część roku: 1/12 za każdy miesiąc, w górę do pełnego dnia (art. 155^1, 155^3)', () => {
    expect(u({ sytuacja: 'czesc-roku', miesiaceWRoku: 7 }).dni).toBe(12);
    expect(u({ stazMiesiecy: 120, sytuacja: 'czesc-roku', miesiaceWRoku: 3 }).dni).toBe(7);
    expect(u({ sytuacja: 'czesc-roku', miesiaceWRoku: 12 }).dni).toBe(20);
    // Odejście 14 marca, nowa umowa od 15 marca do końca roku: marzec zaokrągla dotychczasowy pracodawca (art. 155^2a § 3),
    // więc u nowego 9 miesięcy: ceil(20 · 9 / 12) = 15 dni (a nie 17 przy 10 miesiącach).
    expect(u({ stazMiesiecy: 3 * 12, sytuacja: 'czesc-roku', miesiaceWRoku: 9 }).dni).toBe(15);
    expect(u({ stazMiesiecy: 3 * 12, sytuacja: 'czesc-roku', miesiaceWRoku: 10 }).dni).toBe(17);
    // 1/4 etatu, 1 miesiąc: ceil(5 · 1 / 12) = 1 dzień.
    expect(u({ etat: [1, 4], sytuacja: 'czesc-roku', miesiaceWRoku: 1 }).dni).toBe(1);
  });
  it('pierwsza praca: 1/12 po każdym pełnym miesiącu (art. 153 § 1)', () => {
    const w = u({ sytuacja: 'pierwsza-praca', miesiaceWRoku: 3 });
    expect(w.dni).toBe(5);
    expect(w.godziny).toBe(40);
    expect(w.zaMiesiac).toBeCloseTo(20 / 12);
  });
  it('błędy', () => {
    expect(() => u({ etat: [3, 2] })).toThrow(RangeError);
    expect(() => u({ stazMiesiecy: -1 })).toThrow(RangeError);
  });
});
