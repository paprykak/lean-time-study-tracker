import { describe, expect, it } from 'vitest';
import { MAKS_ZMNIEJSZENIA, PROGI_PRZYCHODU, dorabianie, okresNaDzien, okresyProgow, opisDorabiania, progiNaDzien } from './dorabianie';

describe('dorabianie do emerytury i renty (art. 103–104 ustawy o emeryturach i rentach z FUS)', () => {
  it('listopad 2026 r.: progi 6463,20 i 12 003,10 zł (M.P. 2026 poz. 839)', () => {
    expect(progiNaDzien('2026-11-12')).toMatchObject({ p70: 6463.2, p130: 12003.1, mozeNieaktualne: false });
    expect(progiNaDzien('2026-12-01')?.mozeNieaktualne).toBe(true);
    expect(progiNaDzien('2025-11-30')).toBeNull();
  });
  it('do 70% bez zmian, z zapasem do progu; dokładnie 70% też bez zmian', () => {
    expect(dorabianie({ swiadczenie: 'renta-czesciowa', przychod: 5000, data: '2026-11-12' })).toMatchObject({ stan: 'bez-zmian', zapas: 1463.2 });
    expect(dorabianie({ swiadczenie: 'renta-czesciowa', przychod: 6463.2, data: '2026-11-12' }).stan).toBe('bez-zmian');
  });
  it('powyżej 70%: zmniejszenie o przekroczenie, najwyżej o kwotę maksymalną', () => {
    expect(dorabianie({ swiadczenie: 'renta-calkowita', przychod: 6800, data: '2026-11-12' })).toMatchObject({ stan: 'zmniejszenie', zmniejszenie: 336.8 });
    expect(dorabianie({ swiadczenie: 'renta-czesciowa', przychod: 9000, data: '2026-11-12' }).zmniejszenie).toBe(742.1);
    expect(dorabianie({ swiadczenie: 'renta-rodzinna', przychod: 9000, data: '2026-11-12' }).zmniejszenie).toBe(841.05);
    expect(dorabianie({ swiadczenie: 'emerytura', przychod: 9000, data: '2026-02-15' })).toMatchObject({ zmniejszenie: 939.61, progi: { p70: 6140.2 } });
  });
  it('powyżej 130%: zawieszenie; dokładnie 130% jeszcze zmniejszenie', () => {
    expect(dorabianie({ swiadczenie: 'renta-calkowita', przychod: 12003.1, data: '2026-11-12' }).stan).toBe('zmniejszenie');
    expect(dorabianie({ swiadczenie: 'renta-calkowita', przychod: 12003.11, data: '2026-11-12' }).stan).toBe('zawieszenie');
  });
  it('emerytura w wieku 60/65 lat: bez limitu', () => {
    expect(dorabianie({ swiadczenie: 'emerytura', przychod: 20000, data: '2026-11-12', wiekEmerytalny: true }).stan).toBe('bez-limitu');
  });
  it('okresy do listy wyboru: od najnowszego, przełom roku, dzień przed pierwszym okresem', () => {
    expect(okresyProgow().map((o) => o.nazwa)).toEqual(['wrzesień–listopad 2026', 'czerwiec–sierpień 2026', 'marzec–maj 2026', 'grudzień 2025–luty 2026']);
    expect(okresNaDzien('2026-08-31')).toBe('2026-06-01');
    expect(okresNaDzien('2026-12-15')).toBe('2026-09-01');
    expect(okresNaDzien('2025-01-01')).toBe('2025-12-01');
  });
  it('kwoty maksymalnych zmniejszeń z roku waloryzacji najnowszych kwot przychodu (pilnuje aktualizacji od 1 marca)', () => {
    const [r, m] = PROGI_PRZYCHODU[PROGI_PRZYCHODU.length - 1].od.split('-').map(Number);
    expect(MAKS_ZMNIEJSZENIA[MAKS_ZMNIEJSZENIA.length - 1].od >= `${m >= 3 ? r : r - 1}-03-01`).toBe(true);
  });
  it('teksty wyniku: zapas do zawieszenia, przekroczenie równe kwocie maksymalnej, uwagi o art. 103a i 24a', () => {
    const dzis = '2026-11-12';
    expect(opisDorabiania('renta-calkowita', 6800, '2026-09-01', dzis)).toMatchObject({ stan: 'Zmniejszenie o 336,80 zł', zapas: '5203,10 zł' });
    expect(opisDorabiania('renta-calkowita', 12003.1, '2026-09-01', dzis).zapas).toBe('0,00 zł');
    expect(opisDorabiania('renta-calkowita', 7452.61, '2026-09-01', dzis).opis).toBe('o tyle przychód przekracza próg 70%');
    expect(opisDorabiania('renta-calkowita', 7452.62, '2026-09-01', dzis).opis).toMatch(/najwyżej o tę kwotę/);
    expect(opisDorabiania('renta-calkowita', 7452.62, '2026-09-01', dzis).stan).toBe('Zmniejszenie o 989,41 zł');
    expect(opisDorabiania('emerytura', 5000, '2026-09-01', dzis).uwagi.join(' ')).toMatch(/art\. 103a/);
    expect(opisDorabiania('renta-czesciowa', 5000, '2026-09-01', dzis).uwagi.join(' ')).toMatch(/art\. 24a/);
    expect(opisDorabiania('emerytura-wiek', 50000, '2026-09-01', dzis)).toMatchObject({ stan: 'Bez limitu', zapas: 'nie dotyczy' });
    expect(opisDorabiania('renta-rodzinna', 12003.11, '2026-09-01', dzis)).toMatchObject({ stan: 'Zawieszenie', zapas: 'próg przekroczony' });
    expect(opisDorabiania('renta-rodzinna', 1000, '2026-09-01', '2026-12-05').uwagi.join(' ')).toMatch(/nowszego komunikatu/);
  });
  it('błąd przy ujemnym przychodzie', () => {
    expect(() => dorabianie({ swiadczenie: 'emerytura', przychod: -1, data: '2026-11-12' })).toThrow(RangeError);
  });
});
