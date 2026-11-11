import { describe, expect, it } from 'vitest';
import { dzienMiesiaca, minuty, minutyNocneZmiany, swieta, wielkanoc, wymiarMiesiaca } from './czas-pracy';

describe('wielkanoc', () => {
  it.each([
    [2019, '2019-04-21'],
    [2022, '2022-04-17'],
    [2024, '2024-03-31'],
    [2025, '2025-04-20'],
    [2026, '2026-04-05'],
    [2027, '2027-03-28'],
    [2038, '2038-04-25'],
  ])('%i: %s', (rok, data) => expect(wielkanoc(rok)).toBe(data));
});

describe('swieta', () => {
  it('2026: 14 dni z art. 1 pkt 1 ustawy, z Bożym Ciałem 60 dni po Wielkanocy', () => {
    const s = swieta(2026);
    expect(s).toHaveLength(14);
    expect(s.find((x) => x.nazwa === 'Boże Ciało')?.data).toBe('2026-06-04');
    expect(s.find((x) => x.nazwa === 'Zielone Świątki')?.data).toBe('2026-05-24');
  });
  it('Wigilia od 2025 r. (Dz.U. 2024 poz. 1965), wcześniej nie', () => {
    expect(swieta(2024).some((x) => x.data === '2024-12-24')).toBe(false);
    expect(swieta(2025).some((x) => x.data === '2025-12-24')).toBe(true);
  });
});

describe('wymiarMiesiaca (art. 130 Kp)', () => {
  it('objaśnienie urzędowe (ZPE): wrzesień 2022 = 176 h, październik 2022 = 168 h', () => {
    expect(wymiarMiesiaca(2022, 9).godziny).toBe(176);
    expect(wymiarMiesiaca(2022, 10).godziny).toBe(168);
  });
  it('2026 miesiąc po miesiącu i razem 2008 h', () => {
    const g = Array.from({ length: 12 }, (_, i) => wymiarMiesiaca(2026, i + 1).godziny);
    expect(g).toEqual([160, 160, 176, 168, 160, 168, 184, 160, 176, 176, 160, 160]);
    expect(g.reduce((a, b) => a + b)).toBe(2008);
  });
  it('święto w sobotę obniża wymiar (art. 130 § 2), w niedzielę nie', () => {
    // 1 listopada 2025 to sobota, 11 listopada wtorek: 20 dni pon.–pt. minus 2 święta.
    const l = wymiarMiesiaca(2025, 11);
    expect(l.dniPonPt).toBe(20);
    expect(l.swietaObnizajace.map((s) => s.data)).toEqual(['2025-11-01', '2025-11-11']);
    expect(l.godziny).toBe(144);
    // 3 maja 2026 to niedziela: maj ma 21 dni pon.–pt. i jedno obniżające święto (1 maja).
    expect(wymiarMiesiaca(2026, 5).godziny).toBe(160);
  });
  it('grudzień 2025 z Wigilią, 25 i 26 grudnia', () => expect(wymiarMiesiaca(2025, 12).godziny).toBe(160));
  it('zły miesiąc to błąd', () => expect(() => wymiarMiesiaca(2026, 13)).toThrow(RangeError));
});

describe('minutyNocneZmiany (art. 151^7 § 1 Kp)', () => {
  const m = (s: string) => minuty(s) as number;
  it.each([
    ['18:00', '06:00', '22:00', 8 * 60],
    ['18:00', '06:00', '21:00', 8 * 60],
    ['19:00', '07:00', '23:00', 8 * 60],
    ['14:00', '22:00', '22:00', 0],
    ['14:00', '22:00', '21:00', 60],
    ['22:00', '06:00', '22:00', 8 * 60],
    ['06:00', '14:00', '23:00', 60],
    ['06:00', '18:00', '22:00', 0],
    ['00:00', '08:00', '22:00', 6 * 60],
    ['07:00', '07:00', '23:00', 8 * 60],
  ])('%s–%s, pora od %s: %i min', (od, do_, pora, wynik) => expect(minutyNocneZmiany(m(od), m(do_), m(pora))).toBe(wynik));
  it('pora nocna musi zaczynać się między 21:00 a 23:00', () => {
    expect(() => minutyNocneZmiany(m('18:00'), m('06:00'), m('20:00'))).toThrow(RangeError);
    expect(() => minutyNocneZmiany(m('18:00'), m('06:00'), m('23:30'))).toThrow(RangeError);
  });
});

describe('pomocnicze', () => {
  it('minuty', () => {
    expect(minuty('7:05')).toBe(425);
    expect(minuty('24:00')).toBeNull();
    expect(minuty('abc')).toBeNull();
  });
  it('dzienMiesiaca', () => expect(dzienMiesiaca('2026-11-11')).toBe('11 listopada'));
});

describe('opisWymiaru', () => {
  it('z jednym świętem i bez świąt', async () => {
    const { opisWymiaru } = await import('./czas-pracy');
    expect(opisWymiaru(wymiarMiesiaca(2026, 11))).toBe('21 dni od poniedziałku do piątku, minus święto: 11 listopada');
    expect(opisWymiaru(wymiarMiesiaca(2026, 2))).toBe('20 dni od poniedziałku do piątku, bez świąt obniżających wymiar');
    expect(opisWymiaru(wymiarMiesiaca(2025, 11))).toBe('20 dni od poniedziałku do piątku, minus święta: 1 listopada, 11 listopada');
  });
});

describe('wymiarOkresu i pomocnicze', async () => {
  const { wymiarOkresu, swietaWSobote, godzinyIMinuty } = await import('./czas-pracy');
  it('rok 2027: 2008 h, 251 dni pracy; sierpień 2026 = 160 h (przykład biznes.gov.pl)', () => {
    expect(wymiarOkresu(2027, 1, 12).godziny).toBe(2008);
    expect(wymiarOkresu(2027, 1, 12).godziny / 8).toBe(251);
    expect(wymiarOkresu(2026, 8, 1).godziny).toBe(160);
  });
  it('okres przez przełom roku: listopad 2026 – styczeń 2027', () => {
    const w = wymiarOkresu(2026, 11, 3);
    expect(w.miesiace.map((m) => `${m.rok}-${m.miesiac}`)).toEqual(['2026-11', '2026-12', '2027-1']);
    expect(w.godziny).toBe(160 + 160 + 152);
  });
  it('święta w sobotę w 2027 r.: 1 maja i 25 grudnia', () => {
    expect(swietaWSobote(2027).map((s) => s.data)).toEqual(['2027-05-01', '2027-12-25']);
  });
  it('godziny i minuty', () => {
    expect(godzinyIMinuty(160)).toBe('160 h');
    expect(godzinyIMinuty(160 / 3)).toBe('53 h 20 min');
    expect(() => wymiarOkresu(2026, 1, 13)).toThrow(RangeError);
  });
});
