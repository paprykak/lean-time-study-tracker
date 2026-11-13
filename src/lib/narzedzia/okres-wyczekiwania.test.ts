import { describe, expect, it } from 'vitest';
import { okresWyczekiwania } from './okres-wyczekiwania';

// Daty sprawdzone niezależnie w Pythonie (datetime).
describe('okres wyczekiwania (art. 4 ustawy zasiłkowej)', () => {
  it('umowa o pracę od 1 marca 2026 r.: prawo od 31 marca; zlecenie: od 30 maja', () => {
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01' })).toMatchObject({ brakuje: 30, prawoOd: '2026-03-31', ostatniBezPrawa: '2026-03-30' });
    expect(okresWyczekiwania({ rodzaj: 'dobrowolne', start: '2026-03-01' })).toMatchObject({ brakuje: 90, prawoOd: '2026-05-30' });
  });
  it('L4 od 10 marca: 21 dni bez zasiłku, płatne od 31 marca (art. 9 ust. 3)', () => {
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', l4Od: '2026-03-10' }).l4).toEqual({ bezPlatnosci: 21, platneOd: '2026-03-31' });
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', l4Od: '2026-04-10' }).l4).toEqual({ bezPlatnosci: 0, platneOd: '2026-04-10' });
  });
  it('przerwa 29 i 30 dni łączy okresy, 31 dni nie (art. 4 ust. 2)', () => {
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', poprzednie: [{ od: '2025-01-01', do: '2026-01-30' }] })).toMatchObject({ wliczone: 395, brakuje: 0, prawoOd: '2026-03-01' });
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-02', poprzednie: [{ od: '2026-01-10', do: '2026-01-30' }] })).toMatchObject({ wliczone: 21, brakuje: 9, prawoOd: '2026-03-11' });
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-03', poprzednie: [{ od: '2026-01-10', do: '2026-01-30' }] })).toMatchObject({ wliczone: 0, prawoOd: '2026-04-02' });
  });
  it('przerwa przez urlop wychowawczy lub bezpłatny nie przerywa ciągłości', () => {
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-03', poprzednie: [{ od: '2025-03-01', do: '2026-01-30', przerwaUsprawiedliwiona: true }] })).toMatchObject({ wliczone: 336, brakuje: 0 });
  });
  it('zlecenie: dwa wcześniejsze okresy (także obowiązkowe) sumują się do 90 dni', () => {
    const poprzednie = [{ od: '2025-12-01', do: '2026-01-31' }, { od: '2025-10-01', do: '2025-11-15' }];
    expect(okresWyczekiwania({ rodzaj: 'dobrowolne', start: '2026-03-01', poprzednie })).toMatchObject({ wliczone: 108, wliczonychOkresow: 2, brakuje: 0 });
  });
  it('absolwent: ubezpieczenie do 90 dni po ukończeniu szkoły, od pierwszego dnia', () => {
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-12-15', ukonczenieSzkoly: '2026-09-16' })).toMatchObject({ wyjatek: 'absolwent', brakuje: 0, ostatniBezPrawa: null });
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-12-16', ukonczenieSzkoly: '2026-09-16' })).toMatchObject({ wyjatek: null, prawoOd: '2027-01-15' });
  });
  it('wypadek w drodze, wypadek przy pracy, 10 lat (tylko obowiązkowe)', () => {
    expect(okresWyczekiwania({ rodzaj: 'dobrowolne', start: '2026-03-01', wypadekWDrodze: true })).toMatchObject({ wyjatek: 'wypadek-w-drodze', brakuje: 0 });
    expect(okresWyczekiwania({ rodzaj: 'dobrowolne', start: '2026-03-01', wypadekPrzyPracy: true })).toMatchObject({ wyjatek: 'wypadek-przy-pracy', brakuje: 0 });
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', dziesiecLat: true })).toMatchObject({ wyjatek: 'dziesiec-lat', brakuje: 0 });
    expect(okresWyczekiwania({ rodzaj: 'dobrowolne', start: '2026-03-01', dziesiecLat: true })).toMatchObject({ wyjatek: null, brakuje: 90 });
  });
  it('przez koniec roku i luty przestępny', () => {
    expect(okresWyczekiwania({ rodzaj: 'dobrowolne', start: '2027-12-15' }).prawoOd).toBe('2028-03-14');
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2028-02-01' }).prawoOd).toBe('2028-03-02');
    // Przerwa przez 29 lutego 2028 r.: od 30.01 do 29.02 to 31 dni (nie wlicza się), od 31.01 to 30 dni (wlicza się).
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2028-03-01', poprzednie: [{ od: '2027-12-01', do: '2028-01-29' }] })).toMatchObject({ wliczone: 0, prawoOd: '2028-03-31' });
    expect(okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2028-03-01', poprzednie: [{ od: '2027-12-01', do: '2028-01-30' }] })).toMatchObject({ wliczone: 61, brakuje: 0, prawoOd: '2028-03-01' });
  });
  it('błędne dane', () => {
    expect(() => okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', poprzednie: [{ od: '2026-02-10', do: '2026-02-01' }] })).toThrow(RangeError);
    expect(() => okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', poprzednie: [{ od: '2026-02-10', do: '2026-03-05' }] })).toThrow(RangeError);
    expect(() => okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', poprzednie: [{ od: '2026-01-01', do: '2026-01-20' }, { od: '2026-01-15', do: '2026-02-01' }] })).toThrow(RangeError);
    expect(() => okresWyczekiwania({ rodzaj: 'obowiazkowe', start: '2026-03-01', l4Od: '2026-02-20' })).toThrow(RangeError);
  });
});
