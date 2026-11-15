import { describe, expect, it } from 'vitest';
import { karaPorzadkowa, limitKarPienieznych, opisKary } from './kara-porzadkowa';

const sp = (t: string) => t.replace(/\s/g, ' ');

describe('kara porządkowa (art. 108–113 Kp)', () => {
  it('naruszenie 2 listopada 2026 r., wiadomość 4 listopada: kara do 18 listopada, sprzeciw 7 dni', () => {
    const r = karaPorzadkowa({ naruszenie: '2026-11-02', wiadomosc: '2026-11-04', ukaranie: '2026-11-12' });
    expect(r).toMatchObject({ do2tygodni: '2026-11-18', do3miesiecy: '2027-02-02', ostatniDzienKary: '2026-11-18', wTerminie: true, zatarcie: '2027-11-12' });
    expect(r.sprzeciw).toMatchObject({ zdazDo: '2026-11-19', wedlugArt115: '2026-11-19', rozne: false });
  });
  it('kara po 2 tygodniach od wiadomości: po terminie', () => {
    expect(karaPorzadkowa({ naruszenie: '2026-11-02', wiadomosc: '2026-11-04', ukaranie: '2026-11-20' }).wTerminie).toBe(false);
  });
  it('sprzeciw z końcem w sobotę: zdąż do soboty, według art. 115 KC poniedziałek', () => {
    const d = { naruszenie: '2026-11-02', wiadomosc: '2026-11-04', ukaranie: '2026-11-07' };
    expect(karaPorzadkowa(d).sprzeciw).toMatchObject({ zdazDo: '2026-11-14', wedlugArt115: '2026-11-16', rozne: true });
    const o = opisKary(d);
    expect(o.etykieta).toBe('Sprzeciw do pracodawcy: zdąż do');
    expect(sp(o.sprzeciw)).toBe('14 listopada 2026 r.');
    expect(sp(o.art115!)).toBe('16 listopada 2026 r.');
    expect(sp(o.zdanie)).toMatch(/^14 listopada 2026 r\. to sobota: .*art\. 115 Kodeksu cywilnego/);
    const bez = opisKary({ ...d, ukaranie: '2026-11-12' });
    expect(bez.etykieta).toBe('Sprzeciw do pracodawcy najpóźniej');
    expect(bez.art115).toBeNull();
    expect(bez.zdanie).toBe('');
    expect(bez.bezPrzesuniecia).toContain('art. 115 Kodeksu cywilnego');
  });
  it('3 miesiące od naruszenia wcześniej niż 2 tygodnie od wiadomości', () => {
    const r = karaPorzadkowa({ naruszenie: '2026-08-10', wiadomosc: '2026-11-04', ukaranie: '2026-11-12' });
    expect(r).toMatchObject({ do3miesiecy: '2026-11-10', ostatniDzienKary: '2026-11-10', wTerminie: false });
  });
  it('terminy pracodawcy bez przesunięcia z niedzieli (art. 115 KC tylko dla sprzeciwu)', () => {
    // 30.11.2026 + 3 miesiące = 28.02.2027 (niedziela): kara 1.03.2027 jest już po terminie.
    const r = karaPorzadkowa({ naruszenie: '2026-11-30', wiadomosc: '2027-02-20', ukaranie: '2027-03-01' });
    expect(r).toMatchObject({ do3miesiecy: '2027-02-28', wTerminie: false, wOknieArt115: true });
    expect(r.sprzeciw.zdazDo).toBe('2027-03-08');
    expect(opisKary({ naruszenie: '2026-11-30', wiadomosc: '2027-02-20', ukaranie: '2027-03-01' })).toMatchObject({ statusKlasa: 'pilne', status: 'Kara po terminie z art. 109 § 1, chyba że sąd uzna przesunięcie z art. 115 KC' });
    // 2.03.2027 jest już po dniu z art. 115 KC (1.03.2027): po terminie bez zastrzeżeń.
    expect(karaPorzadkowa({ naruszenie: '2026-11-30', wiadomosc: '2027-02-20', ukaranie: '2027-03-02' }).wOknieArt115).toBe(false);
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

// Audyt jakości 4 (B-13): sobota przed 1.01.2017 r. i Wigilia (wolna od 2025 r.) na przykładzie sprzeciwu.
describe('audyt jakosc4: sprzeciw przy progach art. 115 KC', () => {
  it.each([
    ['2016-12-17', '2016-12-24', '2016-12-24', false],
    ['2016-10-29', '2016-11-05', '2016-11-05', false],
    ['2024-12-17', '2024-12-24', '2024-12-24', false],
    ['2025-12-17', '2025-12-24', '2025-12-29', true],
    ['2026-12-17', '2026-12-24', '2026-12-28', true],
  ])('ukaranie %s: zdąż do %s, według art. 115 KC %s', (ukaranie, zdazDo, wedlugArt115, rozne) => {
    expect(karaPorzadkowa({ naruszenie: ukaranie, wiadomosc: ukaranie, ukaranie }).sprzeciw).toMatchObject({ zdazDo, wedlugArt115, rozne });
  });
});

// Linijka praktyczna pod datą sprzeciwu (pakiet „terminy3”, daty z raporty/terminy3/linijka.py).
describe('terminy3: sprzeciw w dzień wolny', () => {
  const sp = (t: string) => t.replace(/\s/g, ' ');
  it('sprzeciw do niedzieli 13 grudnia 2026 r.: złóż w piątek 11 grudnia', () => {
    const o = opisKary({ naruszenie: '2026-12-01', wiadomosc: '2026-12-02', ukaranie: '2026-12-06' });
    expect(sp(o.sprzeciw)).toBe('13 grudnia 2026 r.');
    expect(sp(o.praktycznie)).toBe(
      'To niedziela. Pismo do pracodawcy złóż najpóźniej w ostatnim dniu roboczym przed tą datą, czyli w piątek 11 grudnia 2026 r.: liczy się dzień, w którym do niego dotrze (art. 61 § 1 Kodeksu cywilnego).',
    );
  });
  it('sprzeciw w święto 3 maja 2027 r. (poniedziałek): piątek 30 kwietnia; w dzień roboczy bez linijki', () => {
    expect(sp(opisKary({ naruszenie: '2027-04-20', wiadomosc: '2027-04-21', ukaranie: '2027-04-26' }).praktycznie)).toContain('(Święto Narodowe Trzeciego Maja)');
    expect(sp(opisKary({ naruszenie: '2027-04-20', wiadomosc: '2027-04-21', ukaranie: '2027-04-26' }).praktycznie)).toContain('czyli w piątek 30 kwietnia 2027 r.:');
    expect(opisKary({ naruszenie: '2026-11-01', wiadomosc: '2026-11-02', ukaranie: '2026-11-03' }).praktycznie).toBe('');
  });
});
