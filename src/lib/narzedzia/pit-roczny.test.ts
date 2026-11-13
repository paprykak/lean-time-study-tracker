// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (Decimal; art. 6, 22 ust. 2, 26, 27, 27f ustawy o PIT,
// art. 63 § 1 Ordynacji podatkowej).
import { describe, expect, it } from 'vitest';
import { dochodOsoby, doZlotego, limitKosztowPracy, opisPit, pitRoczny, podatekSkala, saldo, type DanePit, type Pit11 } from './pit-roczny';

// Płaca minimalna 2025 r. przez cały rok: 4666 zł × 12, składki 639,71 zł i zdrowotna 362,37 zł miesięcznie,
// zaliczka 153 zł miesięcznie (podstawa 3776 zł, PIT-2).
const minimalna: Pit11 = { przychodPraca: 55_992, kosztyPraca: 3000, skladki: 7676.52, zdrowotna: 4348.44, zaliczki: 1836 };
const dane = (x: Partial<DanePit> = {}): DanePit => ({ rok: 2025, ty: minimalna, sytuacja: 'inna', dzieci: [], czescUlgi: 100, ...x });
const caly = { od: 1, do: 12 };

describe('skala i zaokrąglenia', () => {
  it('skala z art. 27 ust. 1: kwota wolna 30 000 zł, próg 120 000 zł', () => {
    expect(podatekSkala(30_000)).toBe(0);
    expect(podatekSkala(30_001)).toBe(0.12);
    expect(podatekSkala(120_000)).toBe(10_800);
    expect(podatekSkala(126_435)).toBe(12_859.2);
    expect(podatekSkala(63_217.5)).toBe(3986.1);
  });
  it('art. 63 § 1 Ordynacji: od 50 groszy w górę', () => {
    expect([1837.49, 1837.5, 1837.8, 0].map(doZlotego)).toEqual([1837, 1838, 1838, 0]);
  });
  it('limit kosztów z umowy o pracę (art. 22 ust. 2)', () => {
    expect([limitKosztowPracy(), limitKosztowPracy(false, true), limitKosztowPracy(true), limitKosztowPracy(true, true)]).toEqual([3000, 3600, 4500, 5400]);
    expect(dochodOsoby({ przychodPraca: 100_000, kosztyPraca: 6000, skladki: 13_710, zaliczki: 0, kilkaUmowNaraz: true })).toMatchObject({ kosztyPraca: 4500, kosztyUciete: true, poOdliczeniach: 81_790 });
    expect(dochodOsoby({ przychodPraca: 1000, kosztyPraca: 3000, skladki: 0, zaliczki: 0 })).toMatchObject({ kosztyPraca: 1000, kosztyUciete: false, dochod: 0 });
  });
  it('umowa o pracę i zlecenie razem', () => {
    const r = pitRoczny(dane({ ty: { przychodPraca: 50_000, kosztyPraca: 3000, przychodZlecenie: 20_000, kosztyZlecenie: 4000, skladki: 6855, zaliczki: 3000 } }));
    expect(r.ty).toMatchObject({ podstawa: 56_145, podatek: 3137.4, nalezny: 3137, doZaplaty: 137, doZwrotu: 0 });
  });
});

describe('PIT-37 osobno', () => {
  it('płaca minimalna 2025 r.: podstawa 45 315 zł, podatek 1838 zł, dopłata 2 zł', () => {
    expect(pitRoczny(dane()).ty).toMatchObject({ podstawa: 45_315, podatek: 1837.8, nalezny: 1838, doZaplaty: 2, doZwrotu: 0 });
  });
  it('dwoje dzieci: podatek 0 zł, zwrot 1836 zł zaliczek i 386,28 zł ulgi', () => {
    const r = pitRoczny(dane({ dzieci: [caly, caly] })).ty;
    expect(r).toMatchObject({ nalezny: 0, doZwrotu: 2222.28, doZaplaty: 0 });
    expect(r.ulga).toMatchObject({ odliczenie: 1837.8, zwrot: 386.28 });
  });
  it('troje dzieci: zwrot 4222,32 zł', () => {
    expect(saldo(pitRoczny(dane({ dzieci: [caly, caly, caly] })).ty)).toBe(4222.32);
  });
  it('jedno dziecko, 52 225,60 zł dochodu: ulga 1112,04 zł; samotny rodzic: podatek 0 zł i zwrot całej ulgi', () => {
    const ty: Pit11 = { przychodPraca: 64_000, kosztyPraca: 3000, skladki: 8774.4, zaliczki: 4500 };
    expect(pitRoczny(dane({ ty, dzieci: [caly] })).ty).toMatchObject({ podstawa: 52_226, podatek: 2667.12, nalezny: 1555, doZwrotu: 2945 });
    expect(pitRoczny(dane({ ty, dzieci: [caly], sytuacja: 'samotny' })).ty).toMatchObject({ podatek: 0, nalezny: 0, doZwrotu: 5612.04 });
    // Bez wpisanego dziecka: zwykła skala.
    expect(pitRoczny(dane({ ty, sytuacja: 'samotny' })).ty.podatek).toBe(2667.12);
  });
});

describe('PIT-37 wspólnie z małżonkiem (art. 6 ust. 2)', () => {
  const ty: Pit11 = { przychodPraca: 150_000, kosztyPraca: 3000, skladki: 20_565, zdrowotna: 11_648.66, zaliczki: 17_000 };
  const malzonek: Pit11 = { przychodPraca: 0, kosztyPraca: 0, skladki: 0, zaliczki: 0 };
  it('jedno źródło dochodu: wspólnie 9028 zł zwrotu zamiast 4141 zł; ulga na jedno dziecko ponad limit 112 000 zł', () => {
    const r = pitRoczny(dane({ ty, malzonek, sytuacja: 'malzenstwo', dzieci: [caly] }));
    expect(r.ty).toMatchObject({ podstawa: 126_435, podatek: 12_859.2, nalezny: 12_859, doZwrotu: 4141 });
    expect(r.ty.ulga.ponadLimit).toBe(true);
    expect(r.wspolnie).toMatchObject({ podstawa: 126_435, podatek: 7972.2, nalezny: 7972, doZwrotu: 9028 });
    expect(r.zyskWspolnego).toBe(4887);
  });
  it('bez danych małżonka nie liczymy wspólnego; poza małżeństwem dane małżonka pomijamy', () => {
    expect(pitRoczny(dane({ ty, sytuacja: 'malzenstwo' })).wspolnie).toBeNull();
    expect(pitRoczny(dane({ ty, malzonek, sytuacja: 'inna' })).wspolnie).toBeNull();
    expect(pitRoczny(dane({ ty, malzonek, sytuacja: 'slub' })).wspolnie).not.toBeNull();
  });
  it('opis: porównanie i wynik wspólny', () => {
    const o = opisPit(dane({ ty, malzonek, sytuacja: 'malzenstwo' }), true);
    expect(o.wynik).toBe('Zwrot 9028,00 zł');
    expect(o.porownanie).toContain('Rozliczenie wspólne daje rodzinie 4887,00 zł więcej.');
    expect(opisPit(dane({ ty, sytuacja: 'malzenstwo' }), true).porownanie).toMatch(/^Wpisz dane małżonka/);
  });
});

describe('poprawki po weryfikacji', () => {
  const os = (przychod: number): Pit11 => ({ przychodPraca: przychod, kosztyPraca: 0, skladki: 0, zdrowotna: 1000, zaliczki: 0 });
  it('ślub w trakcie roku: każdy rodzic liczy swój limit 56 000 zł, wspólne niezależne od kolejności', () => {
    const r1 = pitRoczny(dane({ ty: os(40_000), malzonek: os(100_000), sytuacja: 'slub', dzieci: [caly], czescUlgi: 0 }));
    expect(r1.malzonek!.ulga.ponadLimit).toBe(true);
    const r2 = pitRoczny(dane({ ty: os(100_000), malzonek: os(40_000), sytuacja: 'slub', dzieci: [caly], czescUlgi: 0 }));
    expect(r2.malzonek!.ulga.przysluguje).toBe(1112.04);
    expect(r1.wspolnie!.ulga.przysluguje).toBe(1112.04);
    expect(r2.wspolnie!.ulga.przysluguje).toBe(1112.04);
    expect(saldo(r1.wspolnie!)).toBe(saldo(r2.wspolnie!));
  });
  it('koszty autorskie 50% bez limitu 3000 zł', () => {
    const r = dochodOsoby({ przychodPraca: 60_000, kosztyPraca: 27_996, skladki: 0, zaliczki: 0, kosztySzczegolne: true });
    expect(r).toMatchObject({ kosztyPraca: 27_996, kosztyUciete: false });
  });
  it('uwaga o 32% tylko, gdy stawka 32% rzeczywiście działa', () => {
    const ty: Pit11 = { przychodPraca: 150_000, kosztyPraca: 3000, skladki: 20_565, zaliczki: 17_000 };
    const malzonek = os(0);
    expect(opisPit(dane({ ty, malzonek, sytuacja: 'malzenstwo' }), true).uwagi.join(' ')).not.toContain('32%');
    expect(opisPit(dane({ ty, malzonek, sytuacja: 'malzenstwo' }), false).uwagi.join(' ')).toContain('32%');
  });
  it('porównanie: suma osobno jako dopłata, nie liczba ujemna', () => {
    const o = opisPit(dane({ malzonek: os(0), sytuacja: 'malzenstwo' }), false);
    expect(o.porownanie).toMatch(/razem dopłata 2,00\szł/);
  });
  it('małżeństwo bez danych małżonka i jedno dziecko: ostrzeżenie o limicie', () => {
    expect(opisPit(dane({ sytuacja: 'malzenstwo', dzieci: [caly] }), false).porownanie).toContain('przyjęliśmy jego dochód 0 zł');
  });
});

describe('błędne dane', () => {
  it('ujemne kwoty', () => {
    expect(() => pitRoczny(dane({ ty: { ...minimalna, zaliczki: -1 } }))).toThrow(RangeError);
    expect(() => podatekSkala(-1)).toThrow(RangeError);
  });
  it('opis dopłaty z terminem', () => {
    expect(opisPit(dane(), false)).toMatchObject({ wynik: 'Dopłata 2,00 zł', opis: 'do zapłaty do 30 kwietnia 2026 r.' });
  });
});
