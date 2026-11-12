import { describe, expect, it } from 'vitest';
import { ekwiwalentWlasne, kosztPran, sprawdzOdziez, tekstyWyniku, type DaneOdziezy } from './odziez-robocza';

// Wyniki reguł i rachunków sprawdzone niezależnie w Pythonie (osobna implementacja reguł z notatek, fractions i Decimal
// z zaokrągleniem ROUND_HALF_UP).
const D: DaneOdziezy = { umowa: 'praca', rodzaj: 'odziez', warunki: ['brud'], teraz: 'daje', pranie: 'firma', ekwWlasne: true, ekwPranie: true };
const s = (zmiany: Partial<DaneOdziezy>) => sprawdzOdziez({ ...D, ...zmiany });
const ZWOLNIONY = { pit: 'zwolniony', skladki: 'bez' };

describe('sprawdzenie odzieży roboczej (art. 237⁶–237¹⁰ Kp)', () => {
  it('umowa o pracę, odzież się brudzi: firma daje, własne za zgodą, pranie firma lub Ty, bez PIT i ZUS', () => {
    expect(s({})).toEqual({ obowiazek: 'tak', kto: 'pracodawca', wlasne: 'za-zgoda', pranie: 'firma-lub-ty', podatki: ZWOLNIONY, uwagi: [] });
  });
  it('obsługa maszyn: własne niedozwolone (art. 237⁷ § 3), alarm przy pracy we własnych', () => {
    expect(s({ warunki: ['brud', 'maszyny'], teraz: 'wlasna' })).toMatchObject({ obowiazek: 'tak', wlasne: 'nie', uwagi: ['wlasne-niedozwolone'] });
  });
  it('same maszyny albo samo intensywne brudzenie też są podstawą obowiązku (wariant bezpieczny)', () => {
    expect(s({ warunki: ['maszyny'] })).toMatchObject({ obowiazek: 'tak', wlasne: 'nie' });
    expect(s({ warunki: ['intensywne'] })).toEqual({ obowiazek: 'tak', kto: 'pracodawca', wlasne: 'nie', pranie: 'firma-lub-ty', podatki: ZWOLNIONY, uwagi: [] });
  });
  it('bez warunków (biuro): nie wymaga; pranie nie dotyczy, chyba że firma i tak daje odzież', () => {
    expect(s({ warunki: [], teraz: 'nic' })).toEqual({ obowiazek: 'nie-wymaga', kto: 'pracodawca', wlasne: 'nie-dotyczy', pranie: 'nie-dotyczy', podatki: null, uwagi: [] });
    expect(s({ warunki: [], teraz: 'daje' })).toMatchObject({ obowiazek: 'nie-wymaga', pranie: 'firma-lub-ty', podatki: ZWOLNIONY });
  });
  it('skażenie: pranie tylko przez firmę (art. 237¹⁰ § 2), alarm przy praniu w domu, brak karty podatkowej', () => {
    expect(s({ warunki: ['skazenie'], pranie: 'ja' })).toEqual({ obowiazek: 'tak', kto: 'pracodawca', wlasne: 'nie', pranie: 'tylko-firma', podatki: null, uwagi: ['pranie-skazonej'] });
  });
  it('brak ekwiwalentu za własne (§ 4) i za pranie (art. 237⁹ § 3)', () => {
    expect(s({ warunki: ['wymogi'], teraz: 'wlasna', ekwWlasne: false }).uwagi).toEqual(['brak-ekw-wlasne']);
    expect(s({ pranie: 'ja', ekwPranie: false }).uwagi).toEqual(['pranie-bez-ekw']);
    expect(s({ teraz: 'wlasna', pranie: 'ja' }).uwagi).toEqual(['wlasna-pranie']);
  });
  it('ŚOI: firma daje, własne nie, pranie firma; brak ŚOI blokuje dopuszczenie do pracy (art. 237⁹ § 1)', () => {
    expect(s({ rodzaj: 'soi', warunki: ['maszyny'], teraz: 'wlasna' })).toEqual({ obowiazek: 'tak', kto: 'pracodawca', wlasne: 'nie', pranie: 'firma', podatki: null, uwagi: ['wlasne-niedozwolone'] });
    expect(s({ rodzaj: 'soi', warunki: [], teraz: 'nic', pranie: 'ja' }).uwagi).toEqual(['brak-odziezy']);
  });
  it('agencja: daje pracodawca użytkownik (art. 9 ust. 2a), płatnik ekwiwalentu nierozstrzygnięty', () => {
    expect(s({ umowa: 'tymczasowa', teraz: 'nic', pranie: 'ja' })).toMatchObject({ obowiazek: 'tak', kto: 'pracodawca-uzytkownik', uwagi: ['brak-odziezy', 'agencja-ekwiwalent'] });
  });
  it('zlecenie: przepis nie rozstrzyga (art. 304 § 1, 304⁴), Kp nie przewiduje ekwiwalentów, ZUS bez składek', () => {
    expect(s({ umowa: 'zlecenie' })).toEqual({ obowiazek: 'nie-rozstrzyga', kto: 'pracodawca', wlasne: 'brak-przepisu', pranie: 'brak-przepisu', podatki: { pit: 'nie-rozstrzyga', skladki: 'bez' }, uwagi: [] });
    expect(s({ umowa: 'zlecenie', warunki: [] })).toMatchObject({ obowiazek: 'nie-wymaga', podatki: null });
    expect(s({ umowa: 'zlecenie', rodzaj: 'soi', warunki: ['maszyny'], teraz: 'nic', pranie: 'ja' })).toMatchObject({ obowiazek: 'nie-rozstrzyga', wlasne: 'nie', pranie: 'brak-przepisu', podatki: null, uwagi: [] });
    expect(s({ umowa: 'zlecenie', warunki: ['skazenie'], pranie: 'ja' }).uwagi).toEqual([]);
  });
  it('błędne dane: RangeError', () => {
    expect(() => s({ umowa: '' as never })).toThrow(RangeError);
    expect(() => s({ warunki: ['upal' as never] })).toThrow(RangeError);
    expect(() => s({ teraz: undefined as never })).toThrow(RangeError);
  });
  it('teksty: forma „Ci/Cię”, podstawa prawna przy każdym wierszu', () => {
    const t = tekstyWyniku({ ...D, teraz: 'nic' }, s({ teraz: 'nic' }));
    expect(t.glowny).toBe('Firma musi dać odzież i obuwie');
    expect(t.uwagi[0]).toContain('dopuścić Cię do pracy');
    for (const w of t.wiersze) expect(w.opis).toMatch(/art\.|§/);
    const z = tekstyWyniku({ ...D, umowa: 'zlecenie' }, s({ umowa: 'zlecenie' }));
    expect(z.glowny).toBe('Przepis nie rozstrzyga wprost');
  });
});

describe('rachunki (przepis nie podaje stawki)', () => {
  it('koszt prań: 8 × 3,50 zł = 28,00 zł, rok 336,00 zł; 7 × 2,99 zł = 20,93 zł, rok 251,16 zł', () => {
    expect(kosztPran(8, 3.5)).toEqual({ miesiac: 28, rok: 336 });
    expect(kosztPran(7, 2.99)).toEqual({ miesiac: 20.93, rok: 251.16 });
  });
  it('granice: 0 prań to 0 zł, 62 × 100 zł = 6200 zł, rok 74 400 zł', () => {
    expect(kosztPran(0, 5)).toEqual({ miesiac: 0, rok: 0 });
    expect(kosztPran(62, 100)).toEqual({ miesiac: 6200, rok: 74400 });
  });
  it('koszt prań: błędne dane', () => {
    for (const n of [63, -1, 2.5, Number.NaN]) expect(() => kosztPran(n, 3)).toThrow(RangeError);
    for (const k of [0.005, 100.01, -1, Number.NaN]) expect(() => kosztPran(8, k)).toThrow(RangeError);
  });
  it('ekwiwalent za własne: 120/12 + 200/24 = 18,33 zł, rok 220,00 zł z dokładnej sumy (nie 219,96)', () => {
    expect(ekwiwalentWlasne([{ cena: 120, miesiace: 12 }, { cena: 200, miesiace: 24 }])).toEqual({ miesiac: 18.33, rok: 220 });
  });
  it('ekwiwalent: 100/3 = 33,33 zł, rok 400 zł; 0,01/2 = 0,01 zł (połówka w górę), rok 0,06 zł', () => {
    expect(ekwiwalentWlasne([{ cena: 100, miesiace: 3 }])).toEqual({ miesiac: 33.33, rok: 400 });
    expect(ekwiwalentWlasne([{ cena: 0.01, miesiace: 2 }])).toEqual({ miesiac: 0.01, rok: 0.06 });
  });
  it('ekwiwalent: granice i kilka rzeczy', () => {
    expect(ekwiwalentWlasne(Array.from({ length: 5 }, () => ({ cena: 5000, miesiace: 1 })))).toEqual({ miesiac: 25000, rok: 300000 });
    expect(ekwiwalentWlasne([{ cena: 59.99, miesiace: 7 }, { cena: 0.05, miesiace: 6 }, { cena: 1, miesiace: 60 }])).toEqual({ miesiac: 8.6, rok: 103.14 });
  });
  it('ekwiwalent: błędne dane', () => {
    expect(() => ekwiwalentWlasne([])).toThrow(RangeError);
    for (const m of [0, 61, 1.5]) expect(() => ekwiwalentWlasne([{ cena: 100, miesiace: m }])).toThrow(RangeError);
    for (const c of [0, -10, 5000.01, 1.005]) expect(() => ekwiwalentWlasne([{ cena: c, miesiace: 12 }])).toThrow(RangeError);
  });
});
