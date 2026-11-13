import { describe, expect, it } from 'vitest';
import { URZADZENIA, co, ileMiesiecy, terminyUtb, urzadzenie } from './badania-utb';

const u = (id: string) => urzadzenie(id)!;

describe('UTB: terminy z załączników do rozporządzenia z 2018 r.', () => {
  it('wózek widłowy z siedziskiem: dozór pełny, badanie co rok, przegląd co 30 dni (zał. 1 lp. 38, zał. 2 lp. 33)', () => {
    expect([u('wozek-siedzisko').forma, u('wozek-siedzisko').badanieLat, u('wozek-siedzisko').przegladDni]).toEqual(['pelny', 1, 30]);
    expect(terminyUtb(u('wozek-siedzisko'), '2026-03-17', '2026-11-02', '2026-11-11')).toEqual({
      badanie: '2027-03',
      miesiecyDoBadania: 4,
      statusBadania: 'w-terminie',
      przeglad: '2026-12-02',
      dniDoPrzegladu: 21,
      statusPrzegladu: 'w-terminie',
    });
  });
  it('wózek prowadzony: dozór ograniczony, co 2 lata, przegląd co 60 dni', () => {
    expect(terminyUtb(u('wozek-prowadzony'), '2025-06-10', '2026-10-01', '2026-11-11')).toMatchObject({ badanie: '2027-06', przeglad: '2026-11-30', dniDoPrzegladu: 19, statusPrzegladu: 'w-terminie' });
    expect(terminyUtb(u('wozek-prowadzony'), null, '2026-09-20', '2026-11-11')).toMatchObject({ przeglad: '2026-11-19', statusPrzegladu: 'wkrotce' });
  });
  it('suwnica z napędem mechanicznym: badanie okresowe co 2 lata, przegląd co 30 dni', () => {
    expect([u('suwnica-mech').forma, u('suwnica-mech').badanieLat, u('suwnica-mech').przegladDni]).toEqual(['pelny', 2, 30]);
  });
  it('podest załadowczy: co 3 lata, przegląd co 180 dni', () => {
    expect([u('podest-zaladowczy').badanieLat, u('podest-zaladowczy').przegladDni]).toEqual([3, 180]);
  });
  it('statusy: badanie w bieżącym miesiącu pilne, w przeszłości po terminie; przegląd po terminie', () => {
    expect(terminyUtb(u('wozek-siedzisko'), '2025-11-30', null, '2026-11-11')).toMatchObject({ badanie: '2026-11', miesiecyDoBadania: 0, statusBadania: 'pilne', przeglad: null });
    expect(terminyUtb(u('wozek-siedzisko'), '2025-09-01', '2026-10-01', '2026-11-11')).toMatchObject({ statusBadania: 'po-terminie', statusPrzegladu: 'po-terminie', dniDoPrzegladu: -11 });
  });
  it('29 lutego: rok później koniec lutego (art. 112 KC), więc luty', () => {
    expect(terminyUtb(u('wozek-siedzisko'), '2028-02-29', null, '2028-03-01').badanie).toBe('2029-02');
  });
  it('dozór uproszczony: bez badań UDT, przegląd według zał. 2 albo instrukcji', () => {
    expect(terminyUtb(u('do-250'), '2025-01-01', '2026-01-01', '2026-11-11')).toMatchObject({ badanie: null, przeglad: null, statusBadania: null });
    expect(terminyUtb(u('wciagnik-reczny-maly'), null, '2026-10-01', '2026-11-11')).toMatchObject({ badanie: null, przeglad: '2026-12-30' });
  });
  it('spójność tabeli: unikalne id, dozór uproszczony bez badań, pozostałe z badaniem', () => {
    const ids = URZADZENIA.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const x of URZADZENIA) expect(x.forma === 'uproszczony').toBe(x.badanieLat === null);
    expect(co(1)).toBe('co rok');
    expect(co(3)).toBe('co 3 lata');
    expect(co(2)).toBe('co 2 lata');
    expect(co(5)).toBe('co 5 lat');
  });
  it('krótkie nazwy do listy wyboru: unikalne i najwyżej 25 znaków', () => {
    const krotkie = URZADZENIA.map((x) => x.krotko);
    expect(new Set(krotkie).size).toBe(krotkie.length);
    for (const k of krotkie) expect(k.length).toBeLessThanOrEqual(25);
  });
});

describe('ileMiesiecy', () => {
  it('odmiana', () => {
    expect([0, 1, 2, 5, 12, 22, -1, -14].map(ileMiesiecy)).toEqual([
      'w tym miesiącu', 'za 1 miesiąc', 'za 2 miesiące', 'za 5 miesięcy', 'za 12 miesięcy', 'za 22 miesiące', '1 miesiąc temu', '14 miesięcy temu',
    ]);
  });
});
