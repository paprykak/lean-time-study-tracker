// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (minuta po minucie dla art. 7, okresy z godzin końca,
// okna 24 h od startu, datetime dla odpoczynku tygodniowego). Scenariusze A–K jak w skrypcie.
import { describe, expect, it } from 'vitest';
import { BladOkresu, czasJazdy, czasTrwania, godzina, minutyZGodziny, okresyZGodzin, opisJazdy, PRZYKLAD, tygodniowyNajpozniej, type DaneJazdy, type Pojazd, type Rodzaj } from './czas-jazdy';

const R: Record<string, Rodzaj> = { J: 'jazda', P: 'przerwa', W: 'praca', D: 'dyspozycja', O: 'odpoczynek' };
function dane(start: string, wiersze: [string, string][], reszta: Partial<DaneJazdy> = {}, pojazd: Pojazd = 'ciezarowy'): DaneJazdy {
  const s = minutyZGodziny(start);
  return { pojazd, start: s, okresy: okresyZGodzin(s, wiersze.map(([r, d]) => ({ rodzaj: R[r], do: minutyZGodziny(d) }))), ...reszta };
}
const kody = (d: DaneJazdy) => czasJazdy(d).naruszenia.map((n) => n.kod);

describe('pomocnicze', () => {
  it('czas trwania i godzina', () => {
    expect(czasTrwania(270)).toBe('4 h 30 min');
    expect(czasTrwania(45)).toBe('45 min');
    expect(czasTrwania(540)).toBe('9 h');
    expect(czasTrwania(0)).toBe('0 min');
    expect(godzina(1005)).toBe('16:45');
    expect(godzina(1440 + 150)).toBe('2:30 następnego dnia');
    expect(godzina(2 * 1440 + 180)).toBe('3:00 po 2 dniach');
  });
  it('godziny i okresy przez północ', () => {
    expect(minutyZGodziny('06:30')).toBe(390);
    expect(minutyZGodziny('6:30')).toBe(390);
    expect(minutyZGodziny('24:00')).toBeNaN();
    expect(minutyZGodziny('6.30')).toBeNaN();
    const o = okresyZGodzin(1320, [{ rodzaj: 'jazda', do: 165 }, { rodzaj: 'przerwa', do: 210 }]);
    expect(o).toEqual([{ rodzaj: 'jazda', od: 1320, do: 1605 }, { rodzaj: 'przerwa', od: 1605, do: 1650 }]);
    expect(() => okresyZGodzin(360, [{ rodzaj: 'jazda', do: 360 }])).toThrow(RangeError);
  });
});

describe('czas jazdy (rozporządzenie 561/2006)', () => {
  it('A: przykład ze strony, bez naruszeń', () => {
    const d = dane(PRZYKLAD.start, PRZYKLAD.wiersze.map((w) => [Object.keys(R).find((k) => R[k] === w.rodzaj)!, w.do]), { jazdaTydzien: 32 * 60, jazdaPoprzedni: 40 * 60 });
    const r = czasJazdy(d);
    expect(r.naruszenia).toEqual([]);
    expect(r.jazda).toBe(525);
    expect(r.praca).toBe(585);
    expect(r.czasPracy).toBe(600);
    expect(r.jazdaOdPrzerwy).toBe(255);
    expect(godzina(r.przerwaNajpozniej!)).toBe('16:45');
    expect(r.przerwaDlugosc).toBe(45);
    expect(godzina(r.odpoczynekRegularny)).toBe('19:00');
    expect(godzina(r.odpoczynekSkrocony!)).toBe('21:00');
    expect(r.tydzien).toBe(2445);
    expect(r.dwaTygodnie).toBe(4845);
    expect(r.zostaloTydzien).toBe(555);
    const o = opisJazdy(r);
    expect(o.werdykt).toBe('Bez naruszeń');
    expect(o.przerwa).toBe('najpóźniej o 16:45: 45 min albo 15 min, a później 30 min');
    expect(o.dzien).toBe('8 h 45 min z 9 h, zostało 15 min; do 10 h zostało 1 h 15 min (10 h możesz jechać jeszcze 2 dni w tym tygodniu)');
    expect(o.odpoczynek).toBe('zacznij najpóźniej o 19:00 (11 h); skrócony (9 h): o 21:00');
    expect(o.tydzien).toBe('40 h 45 min z 56 h; w dwóch tygodniach 80 h 45 min z 90 h; zostało 9 h 15 min');
  });
  it('B: noc, 4 h 45 min bez przerwy i ponad 10 h pracy w porze nocnej', () => {
    const r = czasJazdy(dane('22:00', [['J', '02:45'], ['P', '03:30'], ['J', '07:00'], ['W', '09:00']]));
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['przerwa', 'noc']);
    expect(r.naruszenia[0].tekst).toContain('najpóźniej o 2:30 następnego dnia');
    expect(r.naruszenia[0].tekst).toContain('dłużej o 15 min');
    expect(r.czasPracy).toBe(630);
    expect(godzina(r.przerwaNajpozniej!)).toBe('10:00 następnego dnia');
    expect(godzina(r.odpoczynekRegularny)).toBe('11:00 następnego dnia');
    expect(godzina(r.odpoczynekSkrocony!)).toBe('13:00 następnego dnia');
  });
  it('C: 10 h 30 min jazdy; art. 21 tylko przy porze nocnej obejmującej pracę', () => {
    const w: [string, string][] = [['J', '09:30'], ['P', '10:15'], ['J', '14:45'], ['P', '15:30'], ['J', '17:00']];
    expect(kody(dane('05:00', w))).toEqual(['jazda-dzien', 'noc']);
    expect(kody(dane('05:00', w, { nocOd: 0 }))).toEqual(['jazda-dzien']);
    expect(kody(dane('05:00', w, { nocOd: 180 }))).toEqual(['jazda-dzien', 'noc']);
    expect(czasJazdy(dane('05:00', w)).czasPracy).toBe(645);
  });
  it('D: 9 h jazdy przy dwóch dniach po 10 h w tygodniu: bez naruszenia; 9 h 15 min: naruszenie', () => {
    const w: [string, string][] = [['J', '09:30'], ['P', '10:15'], ['J', '14:00'], ['P', '14:45'], ['J', '15:30']];
    const r = czasJazdy(dane('05:00', w, { dniPonad9: 2, nocOd: 0 }));
    expect(r.naruszenia).toEqual([]);
    expect(r.limitDzien).toBe(540);
    expect(godzina(r.przerwaNajpozniej!)).toBe('19:15');
    expect(opisJazdy(r).dzien).toBe('9 h z 9 h, zostało 0 min');
    expect(kody(dane('05:00', [...w.slice(0, 4), ['J', '15:45']], { dniPonad9: 2, nocOd: 0 }))).toEqual(['jazda-dzien']);
  });
  it('E: trzy skrócone już wykorzystane, praca do 19:30: odpoczynek za późno', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:30'], ['P', '11:15'], ['J', '15:45'], ['P', '16:30'], ['W', '19:30']], { skrocone: 3, nocOd: 0 }));
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['odpoczynek']);
    expect(r.naruszenia[0].tekst).toContain('najpóźniej o 19:00');
    expect(r.odpoczynekSkrocony).toBeNull();
    expect(opisJazdy(r).odpoczynek).toContain('skróconych już nie ma');
  });
  it('F: przerwa 3 h: odpoczynek dzielony, druga część 9 h do 21:00 mimo trzech skróconych', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:00'], ['P', '13:00']], { skrocone: 3 }));
    expect(r.dzielony).toBe(true);
    expect(godzina(r.odpoczynekSkrocony!)).toBe('21:00');
    expect(opisJazdy(r).odpoczynek).toContain('druga część dzielonego');
    expect(godzina(r.przerwaNajpozniej!)).toBe('17:30');
  });
  it('K: przerwy 30 + 15 w złej kolejności nie dzielą przerwy', () => {
    const r = czasJazdy(dane('06:00', [['J', '09:00'], ['P', '09:30'], ['J', '10:30'], ['P', '10:45'], ['J', '11:45']]));
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['przerwa']);
    expect(r.naruszenia[0].tekst).toContain('najpóźniej o 11:15');
    expect(r.naruszenia[0].tekst).toContain('dłużej o 30 min');
    expect(r.przerwaNajpozniej).toBeNull();
    expect(opisJazdy(r).przerwa).toBe('teraz: limit 4 h 30 min jazdy już przekroczony');
  });
  it('dokładnie 4 h 30 min, a potem przerwa 15 min: część 15 min, następna 30 min', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:30'], ['P', '10:45']]));
    expect(r.naruszenia).toEqual([]);
    expect(r.czesc15).toBe(true);
    expect(r.przerwaDlugosc).toBe(30);
    expect(godzina(r.przerwaNajpozniej!)).toBe('10:45');
    expect(opisJazdy(r).przerwa).toBe('najpóźniej o 10:45: 30 min (część 15 min już była)');
  });
  it('dyspozycja i przerwa poniżej 15 min nie są przerwą; sąsiednie przerwy się łączą', () => {
    expect(kody(dane('06:00', [['J', '09:00'], ['D', '10:00'], ['J', '11:45']]))).toEqual(['przerwa']);
    expect(kody(dane('06:00', [['J', '09:00'], ['P', '09:10'], ['J', '11:00']]))).toEqual(['przerwa']);
    expect(kody(dane('06:00', [['J', '10:00'], ['P', '10:20'], ['P', '10:45'], ['J', '12:00']]))).toEqual([]);
  });
  it('J: tydzień 57 h i dwa tygodnie 97 h', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:00'], ['P', '10:45'], ['J', '13:45']], { jazdaTydzien: 50 * 60, jazdaPoprzedni: 40 * 60 }));
    expect(r.tydzien).toBe(3420);
    expect(r.dwaTygodnie).toBe(5820);
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['jazda-tydzien', 'jazda-dwa-tygodnie']);
    expect(opisJazdy(r).werdykt).toBe('2 naruszenia');
  });
  it('I: dostawczy 2,5–3,5 t za granicą: bez art. 21 (art. 22 ustawy)', () => {
    const r = czasJazdy(dane('22:00', [['J', '02:30'], ['P', '03:15'], ['J', '07:00'], ['W', '09:00']], {}, 'bus-miedzynarodowy'));
    expect(r.naruszenia).toEqual([]);
    expect(r.czasPracy).toBe(630);
    expect(godzina(r.przerwaNajpozniej!)).toBe('9:45 następnego dnia');
  });
});

describe('ustawa o czasie pracy kierowców', () => {
  it('G: linia do 50 km: 7 h 30 min jazdy, 20 min przerw w trakcie, potrzeba 30 min', () => {
    const r = czasJazdy(dane('06:00', [['J', '09:00'], ['P', '09:10'], ['J', '12:00'], ['P', '12:20'], ['J', '14:00']], { jazdaTydzien: 50 * 60 }, 'linia-50'));
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['przerwa-linia']);
    expect(r.przerwyLinia).toEqual({ wymagane: 30, wykorzystane: 20 });
    expect(r.limitDzien).toBe(600);
    expect(godzina(r.odpoczynekRegularny)).toBe('19:00');
    expect(r.odpoczynekSkrocony).toBeNull();
    expect(r.zostaloTydzien).toBe(60 * 60 - 50 * 60 - 450);
    expect(opisJazdy(r).przerwa).toBe('łącznie 30 min w trakcie jazdy, wykorzystano 20 min, brakuje 10 min');
  });
  it('linia do 50 km: przerwa po ostatniej jeździe się nie liczy; ponad 8 h: 45 min', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:00'], ['P', '10:30'], ['J', '14:30'], ['P', '15:30']], {}, 'linia-50'));
    expect(r.przerwyLinia).toEqual({ wymagane: 30, wykorzystane: 30 });
    expect(r.naruszenia).toEqual([]);
    const r2 = czasJazdy(dane('06:00', [['J', '10:00'], ['P', '10:30'], ['J', '14:45'], ['P', '15:30']], {}, 'linia-50'));
    expect(r2.przerwyLinia).toEqual({ wymagane: 45, wykorzystane: 30 });
  });
  it('H: dostawczy do 3,5 t w kraju: 7 h pracy bez przerwy 15 min, odpoczynek 11 h w dobie', () => {
    const r = czasJazdy(dane('07:00', [['J', '11:00'], ['W', '14:00']], { jazdaTydzien: 50 * 60 }, 'do-35t'));
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['przerwa-15']);
    expect(r.rozporzadzenie).toBe(false);
    expect(godzina(r.odpoczynekRegularny)).toBe('20:00');
    expect(r.tydzien).toBeNull();
    const o = opisJazdy(r);
    expect(o.tydzien).toBe('nie dotyczy');
    expect(o.odpoczynek).toBe('zacznij najpóźniej o 20:00 (11 h w dobie, art. 14 ust. 1 ustawy)');
  });
  it('błędne dane', () => {
    expect(() => czasJazdy({ pojazd: 'ciezarowy', start: 1440, okresy: [] })).toThrow(RangeError);
    expect(() => czasJazdy({ pojazd: 'ciezarowy', start: 360, okresy: [{ rodzaj: 'jazda', od: 300, do: 400 }] })).toThrow(RangeError);
    expect(() => czasJazdy({ pojazd: 'ciezarowy', start: 360, okresy: [], dniPonad9: 3 })).toThrow(RangeError);
    expect(() => czasJazdy({ pojazd: 'ciezarowy', start: 360, okresy: [], nocOd: 240 })).toThrow(RangeError);
  });
});

describe('odpoczynek tygodniowy', () => {
  it('sześć okresów 24 h od końca poprzedniego', () => {
    expect(tygodniowyNajpozniej('2026-11-08', 18 * 60)).toEqual({ data: '2026-11-14', minuty: 1080, tekst: '14 listopada 2026 r. o 18:00' });
    expect(tygodniowyNajpozniej('2026-12-28', 23 * 60 + 30).data).toBe('2027-01-03');
  });
  it('teksty: poprzedni skrócony, linia, do 3,5 t', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:00']]));
    expect(opisJazdy(r, { data: '2026-11-08', minuty: 1080, poprzedniSkrocony: true }).uwagi[0]).toContain('14 listopada 2026 r. o 18:00: regularny, co najmniej 45 h');
    const l = czasJazdy(dane('06:00', [['J', '10:00']], {}, 'linia-50'));
    expect(opisJazdy(l, { data: '2026-11-08', minuty: 1080 }).uwagi[0]).toContain('co najmniej 35 h');
  });
});

describe('odpoczynek wpisany na końcu i przypadki brzegowe', () => {
  const rano: [string, string][] = [['J', '10:30'], ['P', '11:15'], ['J', '15:45']];
  it('odpoczynek od 15:45 do 22:00: w 24 h tylko 6 h 15 min', () => {
    const r = czasJazdy(dane('06:00', [...rano, ['O', '22:00']]));
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['odpoczynek']);
    expect(r.naruszenia[0].tekst).toContain('mieści się 6 h 15 min, a potrzeba co najmniej 9 h');
    expect(r.koniec).toBe(945);
  });
  it('odpoczynek do 7:00 następnego dnia: regularny, przerwa nie dotyczy', () => {
    const r = czasJazdy(dane('06:00', [...rano, ['O', '07:00']]));
    expect(r.naruszenia).toEqual([]);
    expect(r.odpoczynekW24).toBe(855);
    const o = opisJazdy(r);
    expect(o.odpoczynek).toBe('od 15:45: 14 h 15 min w 24 h od początku pracy (regularny)');
    expect(o.przerwa).toBe('nie dotyczy: od 15:45 odpoczynek dobowy');
  });
  it('przerwa na końcu od 9 h to odpoczynek (skrócony), nie część dzielonego', () => {
    const r = czasJazdy(dane('06:00', [...rano, ['P', '01:00']]));
    expect(r.naruszenia).toEqual([]);
    expect(r.dzielony).toBe(false);
    expect(r.odpoczynekOd).toBe(945);
    expect(opisJazdy(r).odpoczynek).toContain('(skrócony)');
  });
  it('3 h przerwy, a potem 9 h odpoczynku: druga część dzielonego mimo trzech skróconych', () => {
    const r = czasJazdy(dane('06:00', [['J', '09:00'], ['P', '12:00'], ['J', '16:00'], ['O', '01:00']], { skrocone: 3 }));
    expect(r.naruszenia).toEqual([]);
    expect(opisJazdy(r).odpoczynek).toContain('druga część dzielonego');
  });
  it('odpoczynek nie na końcu: błąd z numerem wiersza', () => {
    try {
      okresyZGodzin(360, [{ rodzaj: 'odpoczynek', do: 600 }, { rodzaj: 'jazda', do: 660 }]);
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(BladOkresu);
      expect((e as BladOkresu).wiersz).toBe(1);
    }
  });
  it('linia do 50 km: przerwy w czasie pracy (art. 31b ust. 4), 10 h 30 min przy pracy nocą', () => {
    const w: [string, string][] = [['J', '08:30'], ['P', '08:50'], ['J', '12:00'], ['P', '12:25'], ['J', '14:30']];
    const r = czasJazdy(dane('04:00', w, {}, 'linia-50'));
    expect(r.jazda).toBe(585);
    expect(r.czasPracy).toBe(630);
    expect(r.naruszenia.map((n) => n.kod)).toEqual(['noc']);
    expect(kody(dane('04:00', w, { nocOd: 0 }, 'linia-50'))).toEqual([]);
  });
  it('dokładnie 56 h i 90 h: bez naruszenia, zostało 0; minuta więcej: dwa naruszenia', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:00']], { jazdaTydzien: 52 * 60, jazdaPoprzedni: 34 * 60 }));
    expect(r.naruszenia).toEqual([]);
    expect(r.zostaloTydzien).toBe(0);
    expect(kody(dane('06:00', [['J', '10:01']], { jazdaTydzien: 52 * 60, jazdaPoprzedni: 34 * 60 }))).toEqual(['jazda-tydzien', 'jazda-dwa-tygodnie']);
    expect(czasJazdy(dane('06:00', [['J', '10:00']], { jazdaTydzien: 0 })).tydzien).toBe(240);
  });
  it('4 h 30 min, dyspozycja i minuta jazdy: naruszenie o 11:30', () => {
    const r = czasJazdy(dane('06:00', [['J', '10:30'], ['D', '11:30'], ['J', '11:31']]));
    expect(r.naruszenia.map((n) => n.tekst)).toEqual(['Przerwa należała się najpóźniej o 11:30, po 4 h 30 min jazdy; jazda dłużej o 1 min (art. 7 rozporządzenia 561/2006).']);
  });
  it('przerwa 44 min to tylko część 15 min; 14 + 31 min nie zamyka przerwy', () => {
    const r = czasJazdy(dane('06:00', [['J', '09:00'], ['P', '09:44'], ['J', '11:14']]));
    expect(r.naruszenia).toEqual([]);
    expect(r.przerwaDlugosc).toBe(30);
    expect(godzina(r.przerwaNajpozniej!)).toBe('11:14');
    const r2 = czasJazdy(dane('06:00', [['J', '09:00'], ['P', '09:14'], ['J', '09:30'], ['P', '10:01'], ['J', '11:16']]));
    expect(r2.naruszenia[0].tekst).toContain('najpóźniej o 11:15');
  });
  it('noc: dokładnie 10 h pracy bez naruszenia, 10 h 1 min z naruszeniem', () => {
    const w: [string, string][] = [['J', '02:30'], ['P', '03:15'], ['J', '07:00']];
    expect(czasJazdy(dane('22:00', [...w, ['W', '08:30']])).naruszenia).toEqual([]);
    expect(kody(dane('22:00', [...w, ['W', '08:31']]))).toEqual(['noc']);
  });
  it('do 3,5 t: 5 h 59 min pracy bez przerwy w porządku, 6 h już nie', () => {
    expect(kody(dane('07:00', [['J', '12:59']], {}, 'do-35t'))).toEqual([]);
    expect(kody(dane('07:00', [['J', '13:00']], {}, 'do-35t'))).toEqual(['przerwa-15']);
  });
  it('odmiana: 7 naruszeń', () => {
    const r = czasJazdy(dane('22:00', [['J', '03:00'], ['P', '03:45'], ['J', '09:00'], ['W', '12:00']], { dniPonad9: 2, skrocone: 3, jazdaTydzien: 56 * 60, jazdaPoprzedni: 40 * 60 }));
    expect(opisJazdy(r).werdykt).toBe('7 naruszeń');
  });
});
