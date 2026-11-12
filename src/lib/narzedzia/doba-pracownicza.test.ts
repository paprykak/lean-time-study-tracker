// Oczekiwane wartości sprawdzone niezależnie w Pythonie (zbiory minut na datetime, bez kodu TS).
import { describe, expect, it } from 'vitest';
import { BladDnia, dobaPracownicza, etykietaDnia, opisWyniku, type Wiersz } from './doba-pracownicza';

const W: Wiersz = { od: '', do: '' };
const z = (od: string, do_: string): Wiersz => ({ od, do: do_ });
const tydzien = (...dni: Wiersz[]) => [...dni, ...Array(7 - dni.length).fill(W)] as Wiersz[];
const odp = (w: ReturnType<typeof dobaPracownicza>) => w.dni.map((d) => (d.stan ? [d.odpoczynek, d.stan] : null));

describe('dobaPracownicza', () => {
  it('pn 14:00–22:00, wt–pt 6:00–14:00: 8 h nadgodzin we wtorek, 8 h odpoczynku w dobie poniedziałku', () => {
    const r = dobaPracownicza('2026-11-16', tydzien(z('14:00', '22:00'), z('6:00', '14:00'), z('6:00', '14:00'), z('6:00', '14:00'), z('6:00', '14:00')));
    expect(r.nadgodziny).toBe(480);
    expect(r.dni.map((d) => d.nadgodziny)).toEqual([0, 480, 0, 0, 0, 0, 0]);
    expect(r.dni[1].wPoprzedniejDobie).toBe(480);
    expect([r.nocne, r.dzienne, r.wNiedzieleSwieta]).toEqual([0, 480, 0]);
    expect(odp(r)).toEqual([[480, 'naruszenie'], [960, 'ok'], [960, 'ok'], [960, 'ok'], [960, 'ok'], null, null]);
    expect(r.naruszenia).toBe(1);
    expect(r.dni[0].dzienTygodnia).toBe('poniedziałek');
  });

  it('ruchomy rozkład: 0 h nadgodzin z doby (bez niego 8 h), odpoczynek nadal naruszony', () => {
    const r = dobaPracownicza('2026-11-16', tydzien(z('14:00', '22:00'), z('6:00', '14:00')), { ruchomy: true });
    expect([r.nadgodziny, r.bezRuchomego, r.nocne, r.dni[1].nadgodziny]).toEqual([0, 480, 0, 0]);
    expect(r.dni[0].stan).toBe('naruszenie');
  });

  it('pn 8:00–16:00, wt 6:00–14:00: 2 h nadgodzin, odpoczynek 14 h', () => {
    const r = dobaPracownicza('2026-11-16', tydzien(z('8:00', '16:00'), z('6:00', '14:00')));
    expect(r.nadgodziny).toBe(120);
    expect(odp(r).slice(0, 2)).toEqual([[840, 'ok'], [960, 'ok']]);
  });

  it('pora nocna: wt 5:00–13:00 po pn 14:00–22:00 daje 1 h nocną przy 22:00, 2 h przy 23:00, 0 przy 21:00', () => {
    const t = tydzien(z('14:00', '22:00'), z('5:00', '13:00'));
    expect(dobaPracownicza('2026-11-16', t).nocne).toBe(60);
    expect(dobaPracownicza('2026-11-16', t, { poraNocnaOd: 23 * 60 }).nocne).toBe(120);
    expect(dobaPracownicza('2026-11-16', t, { poraNocnaOd: 21 * 60 }).nocne).toBe(0);
    expect(dobaPracownicza('2026-11-16', t).dni[0].odpoczynek).toBe(420);
  });

  it('dzień 7:00–19:00, potem noc 19:00–7:00 następnego dnia: noc zaczyna się po dobie, 0 h, odpoczynek 12 h', () => {
    const r = dobaPracownicza('2026-11-16', tydzien(z('7:00', '19:00'), z('19:00', '7:00')));
    expect(r.nadgodziny).toBe(0);
    expect(odp(r).slice(0, 2)).toEqual([[720, 'ok'], [720, 'ok']]);
    expect(r.ponad8).toEqual([0, 1]);
    expect(r.ponad12).toEqual([]);
  });

  it('noc 19:00–7:00, a następnego dnia 7:00–19:00: cała dzienna zmiana w dobie nocy, 12 h nadgodzin, odpoczynek 0', () => {
    const r = dobaPracownicza('2026-11-16', tydzien(z('19:00', '7:00'), z('7:00', '19:00')));
    expect(r.nadgodziny).toBe(720);
    expect(r.dni[1].nadgodziny).toBe(720);
    expect(r.dni[0]).toMatchObject({ odpoczynek: 0, stan: 'naruszenie' });
  });

  it('dwie noce 22:00–6:00: 0 h nadgodzin, odpoczynek 16 h', () => {
    const r = dobaPracownicza('2026-11-16', tydzien(z('22:00', '6:00'), z('22:00', '6:00')));
    expect(r.nadgodziny).toBe(0);
    expect(odp(r).slice(0, 2)).toEqual([[960, 'ok'], [960, 'ok']]);
  });

  it('krótka zmiana 6 h: zapas do 8 h zużywają najwcześniejsze minuty następnego dnia', () => {
    expect(dobaPracownicza('2026-11-16', tydzien(z('10:00', '16:00'), z('8:00', '16:00'))).nadgodziny).toBe(0);
    const r = dobaPracownicza('2026-11-16', tydzien(z('10:00', '16:00'), z('7:00', '15:00')));
    expect(r.nadgodziny).toBe(60);
    expect(r.dni[0].odpoczynek).toBe(900);
  });

  it('próg 11 h: dokładnie 11 h to jeszcze odpoczynek zgodny, 10 h 59 min to naruszenie', () => {
    const a = dobaPracownicza('2026-11-16', tydzien(z('14:00', '22:00'), z('9:00', '17:00')));
    expect([a.nadgodziny, a.dni[0].odpoczynek, a.dni[0].stan]).toEqual([300, 660, 'ok']);
    const b = dobaPracownicza('2026-11-16', tydzien(z('14:00', '22:00'), z('8:59', '16:59')));
    expect([b.nadgodziny, b.dni[0].odpoczynek, b.dni[0].stan]).toEqual([301, 659, 'naruszenie']);
  });

  it('święto 11 listopada i niedziela od 6:00', () => {
    const sw = dobaPracownicza('2026-11-10', tydzien(z('14:00', '22:00'), z('6:00', '14:00')));
    expect(sw.wNiedzieleSwieta).toBe(480);
    expect(opisWyniku(sw).uwagi.find((u) => u.startsWith('8 h nadgodzin przypada'))).toMatch(/dodatek wynosi 50% \(w porze nocnej 100%\)/);
    // Sobota 21.11 14:00–22:00, niedziela 22.11 5:00–13:00: niedziela liczy się od 6:00, więc 7 h; 1 h w porze nocnej.
    const n = dobaPracownicza('2026-11-21', tydzien(z('14:00', '22:00'), z('5:00', '13:00')));
    expect([n.nadgodziny, n.wNiedzieleSwieta, n.nocne]).toEqual([480, 420, 60]);
    expect(n.dni[1].dzienTygodnia).toBe('niedziela');
  });

  it('koniec roku i 29 lutego', () => {
    const r = dobaPracownicza('2026-12-28', [W, W, W, z('14:00', '22:00'), z('6:00', '14:00'), W, W]);
    expect(r.dni[4].data).toBe('2027-01-01');
    expect([r.nadgodziny, r.wNiedzieleSwieta, r.dni[4].nadgodziny]).toEqual([480, 480, 480]);
    const l = dobaPracownicza('2028-02-27', [W, W, z('14:00', '22:00'), z('6:00', '14:00'), W, W, W]);
    expect(l.dni[2].data).toBe('2028-02-29');
    expect([l.nadgodziny, l.dni[3].nadgodziny, l.dni[2].stan]).toEqual([480, 480, 'naruszenie']);
    expect(l.dni[6].data).toBe('2028-03-04');
  });

  it('ostatni dzień: przerwa poza znanymi dniami to „bez-danych”; zmiana ponad 12 h to „inne-zasady”', () => {
    const d = (zm: Wiersz) => dobaPracownicza('2026-11-16', [W, W, W, W, W, W, zm]).dni[6];
    expect(d(z('6:00', '14:00'))).toMatchObject({ odpoczynek: 600, stan: 'bez-danych' });
    expect(d(z('22:00', '6:00'))).toMatchObject({ odpoczynek: 0, stan: 'bez-danych' });
    expect(d(z('6:00', '19:00'))).toMatchObject({ odpoczynek: 300, stan: 'inne-zasady' });
    expect(d(z('6:00', '18:00'))).toMatchObject({ odpoczynek: 360, stan: 'bez-danych' });
    // Zmiana 14 h: art. 132 § 1 zastrzega art. 136 § 2 i 137, więc osobny stan, nie naruszenie.
    expect(d(z('6:00', '20:00'))).toMatchObject({ odpoczynek: 240, stan: 'inne-zasady' });
    expect(dobaPracownicza('2026-11-16', [W, W, W, W, W, W, z('6:00', '20:00')]).ponad12).toEqual([6]);
  });

  it('zmiana dłuższa niż 12 h: odpoczynek „inne-zasady”, nie naruszenie', () => {
    const r = dobaPracownicza('2026-11-16', tydzien(z('6:00', '22:00'), z('8:00', '16:00')));
    expect(r.dni[0]).toMatchObject({ odpoczynek: 480, stan: 'inne-zasady' });
    expect(r.naruszenia).toBe(0);
    expect(opisWyniku(r).wiersze[0].odpoczynek).toMatch(/^Praca dłuższa niż 12 h: .*art\. 136 § 2/);
    const doba = dobaPracownicza('2026-11-16', tydzien(z('8:00', '8:00')));
    expect([doba.dni[0].dlugosc, doba.dni[0].stan, doba.naruszenia]).toEqual([1440, 'inne-zasady', 0]);
  });

  it('zmiana 24 h (ta sama godzina) i błędne dane', () => {
    expect(dobaPracownicza('2026-11-16', tydzien(z('8:00', '8:00'))).dni[0].dlugosc).toBe(1440);
    expect(() => dobaPracownicza('2026-11-16', tydzien(z('8:00', '8:00'), z('6:00', '14:00')))).toThrow(RangeError);
    expect(() => dobaPracownicza('2026-11-16', tydzien(z('22:00', '8:00'), z('6:00', '14:00')))).toThrow(/wtorek 17\.11: zmiana zaczyna się/);
    expect(() => dobaPracownicza('2026-11-16', tydzien(z('25:00', '8:00')))).toThrow(/zły zapis/);
    expect(() => dobaPracownicza('2026-11-16', tydzien(z('8:00', '')))).toThrow(/obie godziny/);
    try {
      dobaPracownicza('2026-11-16', tydzien(W, W, z('8:00', '')));
    } catch (e) {
      expect(e).toBeInstanceOf(BladDnia);
      expect((e as BladDnia).dzien).toBe(2);
    }
    expect(() => dobaPracownicza('2026-02-30', tydzien(z('8:00', '16:00')))).toThrow(RangeError);
    expect(() => dobaPracownicza('2026-11-16', [W])).toThrow(RangeError);
    expect(() => dobaPracownicza('2026-11-16', tydzien(z('8:00', '16:00')), { poraNocnaOd: 20 * 60 })).toThrow(RangeError);
  });

  it('etykieta dnia', () => {
    expect(etykietaDnia('2026-11-16')).toBe('poniedziałek 16.11');
  });
});

describe('opisWyniku', () => {
  it('przykład startowy: teksty wyniku i tabeli', () => {
    const r = dobaPracownicza('2026-11-16', [z('14:00', '22:00'), z('6:00', '14:00'), W, W, W, W, z('6:00', '14:00')]);
    const o = opisWyniku(r);
    expect(o.glowna).toBe('8 h');
    expect(o.dodatki).toBe('W porze nocnej 0 h (dodatek 100%), w pozostałych godzinach 8 h (dodatek 50%). Dni: wtorek 17.11.');
    expect(o.odpoczynek).toBe('za krótki w 1 dobie');
    expect(o.wiersze[0]).toEqual({ dzien: 'pn 16.11', praca: '14:00–22:00', wPoprzedniej: '', nadgodziny: '—', odpoczynek: '8 h, za krótki', stan: 'naruszenie' });
    expect(o.wiersze[1]).toMatchObject({ wPoprzedniej: 'w poprzedniej dobie 8 h', nadgodziny: '8 h', odpoczynek: '16 h', stan: 'ok' });
    expect(o.wiersze[2]).toMatchObject({ praca: 'wolne', stan: 'wolne' });
    expect(o.wiersze[6].odpoczynek).toBe('co najmniej 10 h, bez danych o następnym dniu');
    expect(opisWyniku(dobaPracownicza('2026-11-16', [W, W, W, W, W, W, z('22:00', '6:00')])).wiersze[6].odpoczynek).toBe('bez danych o następnym dniu');
    expect(opisWyniku(dobaPracownicza('2026-11-16', [W, W, W, W, W, W, W])).odpoczynek).toBe('brak zmian do sprawdzenia');
    expect(o.uwagi).toHaveLength(2);
    expect(o.uwagi[0]).toMatch(/^Odpoczynek krótszy niż 11 h: poniedziałek 16\.11\./);
  });
  it('ruchomy rozkład i zmiana 13 h', () => {
    const o = opisWyniku(dobaPracownicza('2026-11-16', tydzien(z('6:00', '19:00'), z('5:00', '13:00')), { ruchomy: true }));
    expect(o.glowna).toBe('0 h');
    expect(o.uwagi.some((u) => u.includes('Bez ruchomego rozkładu wyszłoby 1 h.'))).toBe(true);
    expect(o.odpoczynek).toBe('co najmniej 11 h w każdej sprawdzonej dobie; po zmianie dłuższej niż 12 h inne zasady (art. 136 § 2)');
    expect(o.uwagi.some((u) => u.startsWith('Zmiana dłuższa niż 12 h: poniedziałek 16.11.'))).toBe(true);
  });
});
