// L4 wstecz i zawiadomienie pracodawcy. Oczekiwane daty, dni tygodnia i dni wolne z niezależnego rachunku w Pythonie
// (raporty/luki/rachunek_l4.py: datetime, własny kalendarz świąt z Wielkanocą, Wigilia wolna od 2025 r.).
import { describe, expect, it } from 'vitest';
import { dataZDniem, granice, opisL4, polozenie, terminZawiadomienia } from './l4-wstecz';

describe('granice z § 7 rozporządzenia o zaświadczeniach lekarskich', () => {
  it.each([
    // badanie, najwcześniej (−3 dni), bez warunków (+1), z warunkiem (+4)
    ['2026-11-13', '2026-11-10', '2026-11-14', '2026-11-17'],
    ['2028-03-01', '2028-02-27', '2028-03-02', '2028-03-05'], // przez 29 lutego w roku przestępnym
    ['2024-03-01', '2024-02-27', '2024-03-02', '2024-03-05'],
    ['2027-01-02', '2026-12-30', '2027-01-03', '2027-01-06'], // przez koniec roku
    ['2026-12-31', '2026-12-28', '2027-01-01', '2027-01-04'],
  ])('badanie %s: od %s, zwykle do %s, z warunkiem do %s', (b, od, zwykle, warunek) => {
    expect(granice(b)).toEqual({ najwczesniej: od, najpozniejZwykle: zwykle, najpozniejWarunek: warunek });
  });

  it.each([
    ['2026-11-13', '2026-11-09', 'przed-granica', -4],
    ['2026-11-13', '2026-11-10', 'wstecz', -3],
    ['2026-11-13', '2026-11-12', 'wstecz', -1],
    ['2026-11-13', '2026-11-13', 'zwykle', 0],
    ['2026-11-13', '2026-11-14', 'zwykle', 1],
    ['2026-11-13', '2026-11-15', 'pozniej-warunek', 2],
    ['2026-11-13', '2026-11-17', 'pozniej-warunek', 4],
    ['2026-11-13', '2026-11-18', 'za-pozno', 5],
    ['2026-12-31', '2027-01-04', 'pozniej-warunek', 4],
  ])('badanie %s, nieobecność od %s: %s (%i)', (b, p, pol, r) => {
    expect(polozenie(b, p)).toEqual({ polozenie: pol, roznica: r });
  });

  it('błędne daty', () => {
    expect(() => granice('2026-02-30')).toThrow(RangeError);
    expect(() => polozenie('2026-11-13', '')).toThrow(RangeError);
  });
});

describe('zawiadomienie pracodawcy (§ 2 ust. 2: najpóźniej w drugim dniu nieobecności)', () => {
  it.each([
    ['2026-11-10', '2026-11-11', 'środa, 11 listopada 2026 r.'],
    ['2026-11-13', '2026-11-14', 'sobota, 14 listopada 2026 r.'],
    ['2026-12-31', '2027-01-01', 'piątek, 1 stycznia 2027 r.'],
    ['2028-02-28', '2028-02-29', 'wtorek, 29 lutego 2028 r.'],
  ])('nieobecność od %s: zawiadom do %s', (p, t, tekst) => {
    expect(terminZawiadomienia(p)).toBe(t);
    expect(dataZDniem(t)).toBe(tekst);
  });
});

describe('teksty wyniku', () => {
  const DZIS = '2026-11-13';
  it('3 dni wstecz: tak, jeśli badanie potwierdzi; termin zawiadomienia w święto z uwagą', () => {
    const o = opisL4('2026-11-13', '2026-11-10', 'inny', '2026-11-10');
    expect(o.werdykt).toBe('Tak, jeśli badanie to potwierdzi');
    expect(o.opis).toContain('3 dni przed wizytą');
    expect(o.odKiedy).toBe('wtorek, 10 listopada 2026 r. (3 dni przed wizytą)');
    expect(o.zawiadomEtykieta).toBe('Zawiadom pracodawcę');
    expect(o.zawiadom).toBe('niezwłocznie, najpóźniej 11 listopada 2026 r. (środa, drugi dzień nieobecności)');
    expect(o.uwagi.join(' ')).toContain('Narodowe Święto Niepodległości');
  });
  it('4 dni wstecz: dzień poza zwolnieniem, u psychiatry wyjątek bez granicy', () => {
    const o = opisL4('2026-11-13', '2026-11-09', 'inny', DZIS);
    expect(o.werdykt).toBe('Nie, tak daleko L4 nie sięga');
    expect(o.opis).toContain('Dzień 9 listopada 2026 r. zostanie bez zwolnienia lekarskiego');
    expect(opisL4('2026-11-13', '2026-11-07', 'inny', DZIS).opis).toContain('Okres od 7 listopada 2026 r. do 9 listopada 2026 r. (3 dni) zostanie');
    const psych = opisL4('2026-11-13', '2026-11-01', 'psychiatra', DZIS);
    expect(psych.werdykt).toBe('Tylko w jednej sytuacji');
    expect(psych.opis).toContain('12 dni przed wizytą');
    expect(psych.opis).toContain('§ 7 ust. 4');
    expect(psych.odKiedy).toContain('psychiatra w jednej sytuacji wcześniej');
  });
  it('dzień badania i następny bez warunków; 2.–4. dzień z warunkiem; 5. za późno', () => {
    expect(opisL4('2026-11-13', '2026-11-13', 'inny', DZIS).werdykt).toBe('Tak');
    expect(opisL4('2026-11-13', '2026-11-14', 'inny', DZIS).opis).toContain('w dniu następującym po dniu badania');
    expect(opisL4('2026-11-13', '2026-11-16', 'inny', DZIS).werdykt).toBe('Tylko w dwóch sytuacjach');
    const za = opisL4('2026-11-13', '2026-11-18', 'inny', DZIS);
    expect(za.werdykt).toBe('Nie, to za daleko od wizyty');
    expect(za.opis).toBe('To 5 dni po dniu wizyty, a zwolnienie może zacząć się najpóźniej 4. dnia po dniu badania (§ 7 ust. 2). Na zwolnienie od tej daty wizyta musiałaby się odbyć najwcześniej 17 listopada 2026 r. (dzień przed początkiem), a przy dniach wolnych zaraz po wizycie albo w trakcie wcześniejszego L4 najwcześniej 14 listopada 2026 r. (4 dni przed początkiem).');
  });
  it('nieobecność dopiero będzie: termin i uprzedzenie z § 2 ust. 1', () => {
    const o = opisL4('2026-11-13', '2026-11-16', 'inny', '2026-11-13');
    expect(o.zawiadomEtykieta).toBe('Zawiadom pracodawcę');
    expect(o.zawiadom).toBe('niezwłocznie, najpóźniej 17 listopada 2026 r. (wtorek); gdy przyczynę znasz z góry, uprzedź przed 16 listopada 2026 r. (§ 2 ust. 1)');
  });
  it('termin minął: zawiadom od razu, § 2 ust. 3; bez uwagi o dniu wolnym', () => {
    const o = opisL4('2026-11-13', '2026-11-10', 'inny', '2026-11-13');
    expect(o.zawiadomEtykieta).toBe('Termin zawiadomienia minął');
    expect(o.zawiadom).toContain('§ 2 ust. 3');
    expect(o.uwagi).toEqual([]);
  });
  it('termin dziś to jeszcze nie spóźnienie', () => {
    expect(opisL4('2026-11-13', '2026-11-12', 'inny', '2026-11-13').zawiadomEtykieta).toBe('Zawiadom pracodawcę');
  });
  it('drugi dzień w sobotę albo w Boże Narodzenie: uwaga o dniu wolnym', () => {
    expect(opisL4('2026-11-13', '2026-11-13', 'inny', '2026-11-13').uwagi.join(' ')).toContain('14 listopada 2026 r. to sobota');
    expect(opisL4('2026-12-23', '2026-12-24', 'inny', '2026-12-23').uwagi.join(' ')).toContain('25 grudnia 2026 r. to');
    expect(opisL4('2026-11-13', '2026-11-17', 'inny', '2026-11-13').uwagi).toEqual([]);
  });
  it('nigdzie podwójnej kropki po dacie', () => {
    for (const [b, pocz, lek, dz] of [
      ['2026-11-13', '2026-11-20', 'inny', DZIS], ['2026-11-13', '2026-11-01', 'psychiatra', DZIS], ['2026-11-13', '2026-11-09', 'inny', DZIS],
      ['2026-11-13', '2026-11-10', 'inny', '2026-11-13'], ['2026-11-13', '2026-11-16', 'inny', '2026-11-13'], ['2026-11-13', '2026-11-13', 'inny', '2026-11-13'],
    ] as const) {
      const o = opisL4(b, pocz, lek, dz);
      expect([o.opis, o.odKiedy, o.doKiedy, o.zawiadom, ...o.uwagi].join(' | ')).not.toMatch(/r\.\./);
    }
  });
});
