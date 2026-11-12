import { describe, expect, it } from 'vitest';
import { pracaWCiazy } from './praca-w-ciazy';

describe('praca w ciąży (Dz.U. 2017 poz. 796, art. 178 Kp)', () => {
  it('monitor 400 minut: 7 przerw po 10 minut; 8 godzin to jeszcze dozwolone, więcej nie', () => {
    expect(pracaWCiazy({ monitorMin: 400, stanieMin: 0 })).toMatchObject({ monitor: { przekroczone: false, przerw: 7, minutPrzerw: 70 }, naruszenia: [] });
    expect(pracaWCiazy({ monitorMin: 480, stanieMin: 0 }).monitor.przekroczone).toBe(false);
    expect(pracaWCiazy({ monitorMin: 481, stanieMin: 0 }).naruszenia).toEqual(['monitor']);
  });
  it('stanie 3 godziny: 11 przerw po 15 minut; ponad 3 godziny to przekroczenie', () => {
    expect(pracaWCiazy({ monitorMin: 0, stanieMin: 180 }).stanie).toEqual({ przekroczone: false, przerw: 11, minutPrzerw: 165 });
    expect(pracaWCiazy({ monitorMin: 0, stanieMin: 240 }).naruszenia).toEqual(['stanie']);
  });
  it('noc, nadgodziny i dźwiganie ponad 3 kg: naruszenia', () => {
    expect(pracaWCiazy({ monitorMin: 0, stanieMin: 0, nocna: true, nadgodziny: true, dzwiganie: true }).naruszenia).toEqual(['nocna', 'nadgodziny', 'dzwiganie']);
  });
  it('błędny czas', () => {
    expect(() => pracaWCiazy({ monitorMin: -1, stanieMin: 0 })).toThrow(RangeError);
  });
});
