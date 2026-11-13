import { describe, expect, it } from 'vitest';
import { karaPorzadkowa, limitKarPienieznych } from './kara-porzadkowa';

describe('kara porządkowa (art. 108–113 Kp)', () => {
  it('naruszenie 2 listopada 2026 r., wiadomość 4 listopada: kara do 18 listopada, sprzeciw 7 dni', () => {
    const r = karaPorzadkowa({ naruszenie: '2026-11-02', wiadomosc: '2026-11-04', ukaranie: '2026-11-12' });
    expect(r).toMatchObject({ do2tygodni: '2026-11-18', do3miesiecy: '2027-02-02', ostatniDzienKary: '2026-11-18', wTerminie: true, zatarcie: '2027-11-12' });
    expect(r.sprzeciw.koniec).toBe('2026-11-19');
  });
  it('kara po 2 tygodniach od wiadomości: po terminie', () => {
    expect(karaPorzadkowa({ naruszenie: '2026-11-02', wiadomosc: '2026-11-04', ukaranie: '2026-11-20' }).wTerminie).toBe(false);
  });
  it('sprzeciw z końcem w sobotę przechodzi na poniedziałek', () => {
    expect(karaPorzadkowa({ naruszenie: '2026-11-02', wiadomosc: '2026-11-04', ukaranie: '2026-11-07' }).sprzeciw.koniec).toBe('2026-11-16');
  });
  it('3 miesiące od naruszenia wcześniej niż 2 tygodnie od wiadomości', () => {
    const r = karaPorzadkowa({ naruszenie: '2026-08-10', wiadomosc: '2026-11-04', ukaranie: '2026-11-12' });
    expect(r).toMatchObject({ do3miesiecy: '2026-11-10', ostatniDzienKary: '2026-11-10', wTerminie: false });
  });
  it('terminy pracodawcy bez przesunięcia z niedzieli (art. 115 KC tylko dla sprzeciwu)', () => {
    // 30.11.2026 + 3 miesiące = 28.02.2027 (niedziela): kara 1.03.2027 jest już po terminie.
    const r = karaPorzadkowa({ naruszenie: '2026-11-30', wiadomosc: '2027-02-20', ukaranie: '2027-03-01' });
    expect(r).toMatchObject({ do3miesiecy: '2027-02-28', wTerminie: false });
    expect(r.sprzeciw.koniec).toBe('2027-03-08');
    // 2 tygodnie od wiadomości z soboty 14.11.2026 kończą się w sobotę 28.11.2026.
    expect(karaPorzadkowa({ naruszenie: '2026-11-10', wiadomosc: '2026-11-14', ukaranie: '2026-11-20' }).do2tygodni).toBe('2026-11-28');
  });
  it('zatarcie po roku od ukarania 29 lutego: 28 lutego (art. 112 KC)', () => {
    expect(karaPorzadkowa({ naruszenie: '2028-02-20', wiadomosc: '2028-02-25', ukaranie: '2028-02-29' }).zatarcie).toBe('2029-02-28');
  });
  it('limit kar pieniężnych: 1/10 wypłaty', () => {
    expect(limitKarPienieznych(4420.43)).toBe(442.04);
  });
  it('błędy', () => {
    expect(() => karaPorzadkowa({ naruszenie: '2026-11-05', wiadomosc: '2026-11-04', ukaranie: '2026-11-12' })).toThrow(RangeError);
  });
});
