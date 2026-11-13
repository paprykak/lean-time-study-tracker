import { describe, expect, it } from 'vitest';
import { najnizszaKwota, nowePrzepisy, opisMobbingu, regula } from './mobbing';

// Oczekiwane wartości z niezależnego rachunku w Pythonie (płaca minimalna 4666/4806/4950 zł, mnożniki 1/3/1/6 od
// 5.11.2026, wcześniej 1; przedawnienie 3 lata, 29 lutego → 28 lutego).
describe('najniższa kwota (art. 18³d, 18³e, 94³ Kp)', () => {
  it('nowe przepisy od 5 listopada 2026 r.', () => {
    expect(nowePrzepisy('2026-11-04')).toBe(false);
    expect(nowePrzepisy('2026-11-05')).toBe(true);
    expect(najnizszaKwota('mobbing', '2026-11-10', 2026)).toBe(28836);
    expect(najnizszaKwota('mobbing', '2026-11-10', 2027)).toBe(29700);
    expect(najnizszaKwota('wielokrotna', '2026-11-05', 2026)).toBe(14418);
    expect(najnizszaKwota('odwet', '2026-12-01', 2027)).toBe(4950);
    expect(regula('mobbing', '2026-11-05')).toMatchObject({ mnoznik: 6, rodzaj: 'zadośćuczynienie' });
  });
  it('dawne przepisy: jedna płaca minimalna jako odszkodowanie', () => {
    expect(najnizszaKwota('mobbing', '2026-11-04', 2026)).toBe(4806);
    expect(najnizszaKwota('wielokrotna', '2026-11-04', 2026)).toBe(4806);
    expect(najnizszaKwota('dyskryminacja', '2025-03-01', 2025)).toBe(4666);
    expect(regula('mobbing', '2026-11-04')).toMatchObject({ mnoznik: 1, rodzaj: 'odszkodowanie' });
  });
  it('rok bez płacy minimalnej', () => {
    expect(najnizszaKwota('mobbing', '2026-11-10', 2028)).toBeNull();
    expect(opisMobbingu('mobbing', '2026-11-10', 2028, '2026-11-13').kwota).toBe('—');
  });
});

describe('opis wyniku i przedawnienie (art. 291 § 1 Kp)', () => {
  it('mobbing po zmianie: 6 × płaca minimalna, kwota z następnego roku, termin', () => {
    const o = opisMobbingu('mobbing', '2026-11-10', 2026, '2026-11-13');
    expect(o.kwota).toMatch(/^28\s836,00\szł$/);
    expect(o.przepisy).toBe('art. 94³ § 11 Kodeksu pracy');
    expect(o.przedawnienie).toBe('10 listopada 2029 r.');
    expect(o.status).toBe('Zostało: 1093 dni');
    expect(o.uwagi.join(' ')).toMatch(/29\s700,00\szł/);
  });
  it('29 lutego, ostatni dzień i po terminie', () => {
    expect(opisMobbingu('dyskryminacja', '2024-02-29', 2026, '2026-11-13').przedawnienie).toBe('28 lutego 2027 r.');
    const ostatni = opisMobbingu('dyskryminacja', '2023-11-13', 2026, '2026-11-13');
    expect(ostatni.status).toBe('To ostatni dzień');
    expect(ostatni.statusKlasa).toBe('pilne');
    expect(opisMobbingu('dyskryminacja', '2023-11-12', 2026, '2026-11-13')).toMatchObject({ status: 'Termin minął', statusKlasa: 'po-terminie' });
  });
  it('dawny mobbing: odszkodowanie i zadośćuczynienie przy rozstroju zdrowia', () => {
    const o = opisMobbingu('mobbing', '2026-10-01', 2026, '2026-11-13');
    expect(o.opis).toContain('odszkodowanie');
    expect(o.uwagi.join(' ')).toContain('rozstrój zdrowia');
    expect(o.uwagi.join(' ')).toContain('art. 3 ustawy z 19 czerwca 2026 r.');
  });
  it('ciężar dowodu według sprawy', () => {
    expect(opisMobbingu('dyskryminacja', '2026-11-10', 2026, '2026-11-13').dowod).toContain('18³f');
    expect(opisMobbingu('dyskryminacja', '2026-10-10', 2026, '2026-11-13').dowod).toContain('18³b § 1');
    expect(opisMobbingu('mobbing', '2026-11-10', 2026, '2026-11-13').dowod).toContain('art. 6 Kodeksu cywilnego');
  });
});
