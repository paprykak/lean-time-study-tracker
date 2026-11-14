import { describe, expect, it } from 'vitest';
import { odczytajSkladowanie, sprawdzSkladowanie } from './skladowanie';

// Oczekiwane wartości policzone niezależnie w Pythonie (decimal.Decimal): raporty/hala/RAPORT.md.
const s = (d: Parameters<typeof sprawdzSkladowanie>[0], klucz: string) => sprawdzSkladowanie(d).sprawdzenia.find((x) => x.klucz === klucz);

describe('obciążenie regału z tabliczki (§ 68 ust. 2 pkt 2)', () => {
  it('2 palety po 900 kg na poziomie 2000 kg: 1800 kg, zmieszczą się 2', () => {
    const r = sprawdzSkladowanie({ limitPoziomu: 2000, ladunki: 2, masa: 900 });
    expect(r).toMatchObject({ naPoziomie: 1800, ileZmiesci: 2, status: { rodzaj: 'w-terminie' } });
    expect(r.sprawdzenia[0].tekst).toContain('1800 kg z 2000 kg');
  });
  it('dokładnie na granicy jest w porządku; 3 po 700 kg to 100 kg za dużo', () => {
    expect(s({ limitPoziomu: 2000, ladunki: 2, masa: 1000 }, 'poziom')?.wynik).toBe('tak');
    expect(s({ limitPoziomu: 2000, ladunki: 3, masa: 700 }, 'poziom')).toMatchObject({ wynik: 'nie', tekst: expect.stringContaining('o 100 kg więcej niż 2000 kg') });
  });
  it('ułamki kilograma: 3 × 1000,001 kg przekracza 3000 kg o 0,003 kg', () => {
    expect(s({ limitPoziomu: 3000, ladunki: 3, masa: 1000.001 }, 'poziom')?.tekst).toContain('o 0,003 kg');
    expect(sprawdzSkladowanie({ limitPoziomu: 1500, ladunki: 2, masa: 812.5 })).toMatchObject({ naPoziomie: 1625, ileZmiesci: 1 });
  });
  it('sekcja: 4 poziomy po 2000 kg to 8000 kg; przy 7999 kg o 1 kg za dużo; 812,5 kg × 2 × 4 = 6500 kg', () => {
    expect(s({ ladunki: 2, masa: 1000, limitSekcji: 8000, poziomy: 4 }, 'sekcja')?.wynik).toBe('tak');
    expect(s({ ladunki: 2, masa: 1000, limitSekcji: 7999, poziomy: 4 }, 'sekcja')?.tekst).toBe('8000 kg na 4 poziomach: o 1 kg więcej niż 7999 kg z tabliczki.');
    expect(s({ ladunki: 2, masa: 812.5, limitSekcji: 6000, poziomy: 4 }, 'sekcja')?.tekst).toContain('6500 kg na 4 poziomach: o 500 kg');
    expect(s({ ladunki: 1, masa: 500, limitSekcji: 6000, poziomy: 1 }, 'sekcja')?.tekst).toContain('na 1 poziomie');
  });
});

describe('odległości (§ 4 ust. 1 pkt 8 i § 33 ust. 2 ppoż., § 77 BHP)', () => {
  it('materiały palne 0,5 m od urządzeń gorących i kabli; niepalne: nie dotyczy', () => {
    expect(s({ palne: true, odGoracych: 0.5 }, 'gorace')?.wynik).toBe('tak');
    expect(s({ palne: true, odGoracych: 0.499 }, 'gorace')?.wynik).toBe('nie');
    expect(sprawdzSkladowanie({ palne: false, odGoracych: 0.1 })).toMatchObject({ sprawdzenia: [{ wynik: 'nie-dotyczy' }], status: { rodzaj: 'brak' } });
  });
  it('gaśnica: dostęp 1 m, najwyżej 30 m', () => {
    expect(s({ dostepGasnicy: 1 }, 'dostep')?.wynik).toBe('tak');
    expect(s({ dostepGasnicy: 0.9 }, 'dostep')?.wynik).toBe('nie');
    expect(s({ doGasnicy: 30 }, 'gasnica')?.wynik).toBe('tak');
    expect(s({ doGasnicy: 30.01 }, 'gasnica')?.wynik).toBe('nie');
  });
  it.each([
    ['nn', 2],
    ['do15', 5],
    ['do30', 10],
    ['ponad30', 15],
  ] as const)('linia %s: %i m wystarcza, mniej nie, pod linią (0 m) nie', (linia, min) => {
    expect(s({ linia, odLinii: min }, 'linia')?.wynik).toBe('tak');
    expect(s({ linia, odLinii: min - 0.01 }, 'linia')?.wynik).toBe('nie');
    expect(s({ linia, odLinii: 0 }, 'linia')?.wynik).toBe('nie');
  });
  it('bez linii i bez danych: brak sprawdzeń', () => {
    expect(sprawdzSkladowanie({ linia: 'brak', odLinii: 1 })).toMatchObject({ sprawdzenia: [], naPoziomie: null, glowny: '—' });
  });
  it('jedno „nie” spośród kilku daje status niezgodny', () => {
    expect(sprawdzSkladowanie({ limitPoziomu: 2000, ladunki: 2, masa: 900, palne: true, odGoracych: 0.3, dostepGasnicy: 1.2 }).status).toEqual({ tekst: 'Niezgodne z przepisem', rodzaj: 'po-terminie' });
  });
});

describe('odczyt formularza', () => {
  const puste = { limitPoziomu: '', ladunki: '', masa: '', limitSekcji: '', poziomy: '', odGoracych: '', dostepGasnicy: '', doGasnicy: '', odLinii: '' };
  it('poprawne dane; odległość 0 m wolno wpisać; odległość od linii pomijana bez linii', () => {
    expect(odczytajSkladowanie({ ...puste, limitPoziomu: '2 000', ladunki: '2', masa: '812,5', odGoracych: '0', odLinii: '3' }, true, 'brak')).toEqual({
      dane: { palne: true, linia: 'brak', limitPoziomu: 2000, ladunki: 2, masa: 812.5, odGoracych: 0 },
      blad: null,
    });
    expect(odczytajSkladowanie({ ...puste, odLinii: '0' }, true, 'nn').dane).toMatchObject({ odLinii: 0 });
  });
  it('błędy: ułamek ładunków, masa 0, brak pary, limit bez ładunków', () => {
    expect(odczytajSkladowanie({ ...puste, ladunki: '1,5', masa: '100' }, true, 'brak').blad?.pole).toBe('ladunki');
    expect(odczytajSkladowanie({ ...puste, ladunki: '0', masa: '100' }, true, 'brak').blad?.pole).toBe('ladunki');
    expect(odczytajSkladowanie({ ...puste, ladunki: '2', masa: '0' }, true, 'brak').blad?.pole).toBe('masa');
    expect(odczytajSkladowanie({ ...puste, ladunki: '2' }, true, 'brak').blad?.pole).toBe('masa');
    expect(odczytajSkladowanie({ ...puste, ladunki: '2', masa: '100', poziomy: '3' }, true, 'brak').blad?.pole).toBe('limitSekcji');
    expect(odczytajSkladowanie({ ...puste, limitPoziomu: '2000' }, true, 'brak').blad?.pole).toBe('ladunki');
    expect(odczytajSkladowanie({ ...puste, doGasnicy: 'dużo' }, true, 'brak').blad?.pole).toBe('doGasnicy');
  });
});

describe('ile ładunków zmieści się na poziomie', () => {
  it('odmiana i ładunek cięższy niż limit', () => {
    expect(sprawdzSkladowanie({ limitPoziomu: 2000, ladunki: 1, masa: 900 }).zmiesciOpis).toBe('Na poziomie zmieszczą się najwyżej 2 takie ładunki.');
    expect(sprawdzSkladowanie({ limitPoziomu: 1000, ladunki: 1, masa: 900 }).zmiesciOpis).toBe('Na poziomie zmieści się najwyżej 1 taki ładunek.');
    expect(sprawdzSkladowanie({ limitPoziomu: 5000, ladunki: 1, masa: 200 }).zmiesciOpis).toBe('Na poziomie zmieści się najwyżej 25 takich ładunków.');
    expect(sprawdzSkladowanie({ limitPoziomu: 500, ladunki: 1, masa: 900 })).toMatchObject({ ileZmiesci: 0, zmiesciOpis: 'Jeden taki ładunek jest cięższy niż dopuszczalne obciążenie poziomu.' });
    expect(sprawdzSkladowanie({ limitPoziomu: 2200, ladunki: 1, masa: 100 }).zmiesciOpis).toBe('Na poziomie zmieszczą się najwyżej 22 takie ładunki.');
    expect(sprawdzSkladowanie({ limitPoziomu: 1200, ladunki: 1, masa: 100 }).zmiesciOpis).toBe('Na poziomie zmieści się najwyżej 12 takich ładunków.');
    expect(sprawdzSkladowanie({ ladunki: 1, masa: 900 }).zmiesciOpis).toBe('');
  });
});
