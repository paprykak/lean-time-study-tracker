import { describe, expect, it } from 'vitest';
import { etatyTekst, etatyWTysiecznych, funduszNaRok, obowiazek, odpisNaEtat, opisFunduszu, procentTekst, type RodzajOdpisu } from './fundusz-socjalny';

// Oczekiwane kwoty z niezależnego rachunku w Pythonie (raporty/zfss/rachunek.py: Decimal, kwoty GUS przepisane
// z M.P. 2025 poz. 148 i M.P. 2026 poz. 232; do grosza od połówki w górę, 75% w górę do grosza).
const sp = (t: string) => t.replace(/\s/g, ' ');

describe('odpis na jeden etat (art. 5 ust. 2–5a ustawy o ZFŚS)', () => {
  const OCZEKIWANE: Record<number, Record<RodzajOdpisu, [number, number]>> = {
    2025: {
      zwykly: [2723.4, 2723.39625],
      szczegolne: [3631.2, 3631.195],
      mlodociany1: [363.12, 363.1195],
      mlodociany2: [435.74, 435.7434],
      mlodociany3: [508.37, 508.3673],
      niepelnosprawny: [453.9, 453.899375],
      emeryt: [453.9, 453.899375],
      zlobek: [544.68, 544.67925],
    },
    2026: {
      zwykly: [2943.23, 2943.225],
      szczegolne: [3924.3, 3924.3],
      mlodociany1: [392.43, 392.43],
      mlodociany2: [470.92, 470.916],
      mlodociany3: [549.4, 549.402],
      niepelnosprawny: [490.54, 490.5375],
      emeryt: [490.54, 490.5375],
      zlobek: [588.65, 588.645],
    },
  };
  for (const [rok, rodzaje] of Object.entries(OCZEKIWANE)) {
    for (const [rodzaj, [kwota, dokladnie]] of Object.entries(rodzaje)) {
      it(`${rok}, ${rodzaj}: ${kwota} zł`, () => {
        const o = odpisNaEtat(Number(rok), rodzaj as RodzajOdpisu);
        expect(o.kwota).toBe(kwota);
        expect(o.dokladnie).toBeCloseTo(dokladnie, 9);
      });
    }
  }
  it('wartość w pełnych groszach jest rozpoznana (2026: 50% = 3924,30 zł, 5% = 392,43 zł)', () => {
    expect(odpisNaEtat(2026, 'szczegolne').wGroszach).toBe(true);
    expect(odpisNaEtat(2026, 'mlodociany1').wGroszach).toBe(true);
    expect(odpisNaEtat(2026, 'zwykly').wGroszach).toBe(false);
  });
  it('rok bez obwieszczenia GUS: błąd zamiast cichej starej kwoty', () => {
    expect(() => odpisNaEtat(2030)).toThrow(RangeError);
  });
});

describe('odpis na rok i kwota do 31 maja (art. 5 ust. 1, art. 6 ust. 2)', () => {
  const PRZYPADKI: [number, string, number, number][] = [
    [2026, '1', 2943.23, 2207.42],
    [2026, '19,999', 58861.56, 44146.17],
    [2026, '20', 58864.5, 44148.38],
    [2026, '35', 103012.88, 77259.66],
    [2026, '49,5', 145689.64, 109267.23],
    [2026, '50', 147161.25, 110370.94],
    [2026, '50,001', 147164.19, 110373.15],
    [2026, '120', 353187, 264890.25],
    [2026, '12,875', 37894.02, 28420.52],
    [2026, '1000000', 2943225000, 2207418750],
    [2025, '1', 2723.4, 2042.55],
    [2025, '19,999', 54465.2, 40848.91],
    [2025, '35', 95318.87, 71489.16],
    [2025, '49,5', 134808.11, 101106.09],
    [2025, '50,001', 136172.54, 102129.41],
    [2025, '12,875', 35063.73, 26297.8],
  ];
  it.each(PRZYPADKI)('%i, %s etatu: %d zł, do 31 maja %d zł', (rok, etaty, kwota, maj) => {
    expect(funduszNaRok(rok, etatyWTysiecznych(etaty)!)).toEqual({ kwota, do31Maja: maj });
  });
  it('błędna liczba etatów', () => {
    expect(() => funduszNaRok(2026, 0)).toThrow(RangeError);
    expect(() => funduszNaRok(2026, 1.5)).toThrow(RangeError);
  });
});

describe('liczba etatów wpisana przez człowieka', () => {
  it('przecinek, kropka, spacje, do trzech miejsc po przecinku', () => {
    expect(etatyWTysiecznych('49,5')).toBe(49_500);
    expect(etatyWTysiecznych(' 49.5 ')).toBe(49_500);
    expect(etatyWTysiecznych('1 200')).toBe(1_200_000);
    expect(etatyWTysiecznych('12,875')).toBe(12_875);
    expect(etatyWTysiecznych('0,001')).toBe(1);
  });
  it('błędy: zero, ujemne, tekst, cztery miejsca po przecinku, ponad milion', () => {
    for (const t of ['0', '0,000', '-5', 'abc', '', '12,8755', '1000000,001', '1e3', '5,']) expect(etatyWTysiecznych(t), t).toBeNull();
  });
  it('odmiana: 1 etat, 22 etaty, 12 etatów, 50 etatów, 49,5 etatu, 10 000 etatów', () => {
    expect(etatyTekst(1000)).toBe('1 etat');
    expect(etatyTekst(22_000)).toBe('22 etaty');
    expect(etatyTekst(12_000)).toBe('12 etatów');
    expect(etatyTekst(50_000)).toBe('50 etatów');
    expect(etatyTekst(49_500)).toBe('49,5 etatu');
    expect(sp(etatyTekst(10_000_000))).toBe('10 000 etatów');
    expect(procentTekst(3750)).toBe('37,5%');
    expect(procentTekst(625)).toBe('6,25%');
  });
});

describe('kto musi tworzyć fundusz (art. 3 ust. 1, 1c, 2 i 3)', () => {
  it('50 etatów to już „co najmniej 50”; 49,999 nie', () => {
    expect(obowiazek(50_000, 'brak', 'firma')).toBe('prog50');
    expect(obowiazek(49_999, 'brak', 'firma')).toBe('dobrowolny');
    expect(obowiazek(49_999, 'jest', 'firma')).toBe('dobrowolny');
  });
  it('20–49 etatów: obowiązek tylko na wniosek zakładowej organizacji związkowej', () => {
    expect(obowiazek(20_000, 'wniosek', 'firma')).toBe('wniosek');
    expect(obowiazek(49_999, 'wniosek', 'firma')).toBe('wniosek');
    expect(obowiazek(19_999, 'wniosek', 'firma')).toBe('dobrowolny');
    expect(obowiazek(35_000, 'jest', 'firma')).toBe('dobrowolny');
  });
  it('jednostka budżetowa bez względu na liczbę', () => {
    expect(obowiazek(1000, 'brak', 'budzetowa')).toBe('budzetowa');
    expect(obowiazek(80_000, 'brak', 'budzetowa')).toBe('budzetowa');
  });
});

describe('teksty wyniku', () => {
  it('50 etatów w 2026 r.: musi, odpis 2943,23 zł, fundusz 147 161,25 zł, terminy', () => {
    const o = opisFunduszu(2026, 50_000, 'brak', 'firma');
    expect(o.werdykt).toBe('Musi tworzyć fundusz');
    expect(o.opis).toContain('art. 3 ust. 1 ');
    expect(sp(o.odpis)).toBe('2943,23 zł');
    expect(sp(o.odpisOpis)).toContain('37,5% z 7848,60 zł, przeciętnego wynagrodzenia z drugiego półrocza 2025 r., dokładnie 2943,225 zł');
    expect(o.funduszEtykieta).toBe('Odpis na 2026 r., 50 etatów');
    expect(sp(o.fundusz)).toBe('147 161,25 zł');
    expect(sp(o.terminy)).toContain('co najmniej 110 370,94 zł do 31 maja, całość do 30 września 2026 r.');
    expect(o.urlopowe).toContain('nie zamiast funduszu');
    expect(o.uwagi.join(' ')).toContain('art. 4 ust. 1–2');
    expect(o.uwagi.join(' ')).toContain('art. 8 ust. 3');
  });
  it('35 etatów bez wniosku związku: nie musi, świadczenie urlopowe najwyżej 2943,22 zł, związek może złożyć wniosek', () => {
    const o = opisFunduszu(2026, 35_000, 'jest', 'firma');
    expect(o.werdykt).toBe('Nie musi tworzyć funduszu');
    expect(o.funduszEtykieta).toBe('Fundusz najwyżej, 35 etatów');
    expect(sp(o.urlopowe)).toContain('najwyżej 2943,22 zł na pełny etat');
    expect(o.terminy).toContain('art. 6 ust. 2a');
    expect(o.uwagi.join(' ')).toContain('może złożyć wniosek');
    expect(o.uwagi.join(' ')).toContain('art. 3 ust. 3a–3b');
    expect(o.uwagi.join(' ')).not.toContain('art. 8 ust. 3');
  });
  it('35 etatów z wnioskiem: musi (art. 3 ust. 1c), z możliwością wyłączenia w układzie albo regulaminie', () => {
    const o = opisFunduszu(2026, 35_000, 'wniosek', 'firma');
    expect(o.werdykt).toBe('Musi tworzyć fundusz');
    expect(o.opis).toContain('art. 3 ust. 1c');
    expect(o.uwagi.join(' ')).toContain('art. 4 ust. 1–2');
  });
  it('12 etatów z „wnioskiem”: wniosek nie działa poniżej 20 etatów', () => {
    const o = opisFunduszu(2026, 12_000, 'wniosek', 'firma');
    expect(o.werdykt).toBe('Nie musi tworzyć funduszu');
    expect(o.uwagi.join(' ')).toContain('Poniżej 20 etatów');
  });
  it('25 etatów bez związku: wniosek składa tylko organizacja związkowa', () => {
    expect(opisFunduszu(2026, 25_000, 'brak', 'firma').uwagi.join(' ')).toContain('Wniosku nie składa pojedynczy pracownik');
  });
  it('jednostka budżetowa: musi, bez zdania o wyłączeniu w układzie (art. 4 odsyła do art. 3 ust. 1 i 1c)', () => {
    const o = opisFunduszu(2026, 8_000, 'brak', 'budzetowa');
    expect(o.werdykt).toBe('Musi tworzyć fundusz');
    expect(o.opis).toContain('art. 3 ust. 2');
    expect(o.uwagi.join(' ')).not.toContain('art. 4 ust. 1–2');
    expect(o.funduszEtykieta).toBe('Odpis na 2026 r., 8 etatów');
  });
  it('2025: podstawa z drugiego półrocza 2024 r., 49,5 etatu', () => {
    const o = opisFunduszu(2025, 49_500, 'brak', 'firma');
    expect(sp(o.odpisOpis)).toContain('37,5% z 7262,39 zł, przeciętnego wynagrodzenia z drugiego półrocza 2024 r., dokładnie 2723,39625 zł');
    expect(o.funduszEtykieta).toBe('Fundusz najwyżej, 49,5 etatu');
    expect(sp(o.fundusz)).toBe('134 808,11 zł');
    expect(sp(o.urlopowe)).toContain('2723,39 zł');
  });
});
