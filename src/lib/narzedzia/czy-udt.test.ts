import { describe, expect, it } from 'vitest';
import { czyUdt, KONSERWATOR, polaRodzaju, RODZAJE, tylkoPola, type DaneMaszyny } from './czy-udt';
import { OBSLUGA } from './uprawnienia-udt';

// Oczekiwane gałęzie, kategorie i lata sprawdzone niezależnie w Pythonie (osobna implementacja drzewa z badania, R0–R3, R6).
type Przypadek = [string, DaneMaszyny, string, string | null, number | null];
const P: Przypadek[] = [
  ['paleciak elektryczny (jazda i unoszenie)', { rodzaj: 'paleciak', jazdaSilnikowa: true, podnoszenieMechaniczne: true }, 'wymagane', 'o-wozki', 10],
  ['paleciak z jazdą elektryczną i ręczną pompą', { rodzaj: 'paleciak', jazdaSilnikowa: true, podnoszenieMechaniczne: false }, 'wozek-bez-podnoszenia', null, null],
  ['ręczny paleciak', { rodzaj: 'paleciak', jazdaSilnikowa: false, podnoszenieMechaniczne: false }, 'nie-utd', null, null],
  ['wózek pchany z elektrycznym podnoszeniem', { rodzaj: 'paleciak', jazdaSilnikowa: false, podnoszenieMechaniczne: true }, 'wymagane', 'o-wozki', 10],
  ['ciągnik', { rodzaj: 'ciagnik' }, 'wozek-bez-podnoszenia', null, null],
  ['wózek widłowy', { rodzaj: 'wozek-widlowy' }, 'wymagane', 'o-wozki', 10],
  ['reach truck', { rodzaj: 'reach-truck' }, 'wymagane', 'o-wozki', 10],
  ['wózek z podnoszonym operatorem', { rodzaj: 'wozek-kompletacyjny' }, 'wymagane', 'o-wozki-wysiegnik', 5],
  ['ładowarka teleskopowa', { rodzaj: 'ladowarka-teleskopowa' }, 'wymagane', 'o-wozki-wysiegnik', 5],
  ['wciągnik jednofazowy 500 kg', { rodzaj: 'wciagnik', naped: 'jednofazowy', udzwigKg: 500 }, 'jednofazowy', null, null],
  ['wciągnik jednofazowy 1000 kg', { rodzaj: 'wciagnik', naped: 'jednofazowy', udzwigKg: 1000 }, 'jednofazowy', null, null],
  ['wciągnik jednofazowy 1001 kg', { rodzaj: 'wciagnik', naped: 'jednofazowy', udzwigKg: 1001, przeznaczenie: 'ogolne' }, 'wymagane', 'o-wciagniki-ogolne', 10],
  ['wciągnik trójfazowy 1000 kg', { rodzaj: 'wciagnik', naped: 'mechaniczny', udzwigKg: 1000, przeznaczenie: 'ogolne' }, 'wymagane', 'o-wciagniki-ogolne', 10],
  ['wciągnik trójfazowy 250 kg', { rodzaj: 'wciagnik', naped: 'mechaniczny', udzwigKg: 250 }, 'do-250', null, null],
  ['wciągnik trójfazowy 251 kg', { rodzaj: 'wciagnik', naped: 'mechaniczny', udzwigKg: 251, przeznaczenie: 'ogolne' }, 'wymagane', 'o-wciagniki-ogolne', 10],
  ['wciągnik 200 kg przemieszczający osoby', { rodzaj: 'wciagnik', naped: 'mechaniczny', udzwigKg: 200, przemieszczaOsoby: true, przeznaczenie: 'ogolne' }, 'wymagane', 'o-wciagniki-ogolne', 10],
  ['wciągnik ręczny 5000 kg', { rodzaj: 'wciagnik', naped: 'reczny', udzwigKg: 5000 }, 'reczny', null, null],
  ['wciągnik, przeznaczenie nie wiem', { rodzaj: 'wciagnik', naped: 'mechaniczny', udzwigKg: 2000, przeznaczenie: 'nie-wiem' }, 'wymagane', 'o-wciagniki-specjalne', 5],
  ['suwnica ogólnego przeznaczenia', { rodzaj: 'suwnica', naped: 'mechaniczny', udzwigKg: 5000, przeznaczenie: 'ogolne' }, 'wymagane', 'o-suwnice-ogolne', 10],
  ['suwnica specjalnego przeznaczenia', { rodzaj: 'suwnica', naped: 'mechaniczny', udzwigKg: 5000, przeznaczenie: 'specjalne' }, 'wymagane', 'o-suwnice-specjalne', 5],
  ['suwnica jednofazowa 1000 kg', { rodzaj: 'suwnica', naped: 'jednofazowy', udzwigKg: 1000 }, 'jednofazowy', null, null],
  ['żuraw stacjonarny', { rodzaj: 'zuraw', naped: 'mechaniczny', udzwigKg: 500, typZurawia: 'stacjonarny' }, 'wymagane', 'o-zurawie-stacjonarne', 10],
  ['żuraw przewoźny (HDS)', { rodzaj: 'zuraw', naped: 'mechaniczny', udzwigKg: 3000, typZurawia: 'przewozny' }, 'wymagane', 'o-zurawie-przewozne', 10],
  ['żuraw samojezdny', { rodzaj: 'zuraw', naped: 'mechaniczny', udzwigKg: 30000, typZurawia: 'samojezdny' }, 'wymagane', 'o-zurawie-samojezdne', 5],
  ['żuraw wieżowy', { rodzaj: 'zuraw', naped: 'mechaniczny', udzwigKg: 5000, typZurawia: 'wiezowy' }, 'wymagane', 'o-zurawie-wiezowe', 5],
  ['układnica 250 kg', { rodzaj: 'ukladnica', naped: 'mechaniczny', udzwigKg: 250 }, 'do-250', null, null],
  ['układnica 251 kg', { rodzaj: 'ukladnica', naped: 'mechaniczny', udzwigKg: 251 }, 'wymagane', 'o-ukladnice', 10],
  ['układnica jednofazowa 1000 kg (bez wyjątku jednofazowego)', { rodzaj: 'ukladnica', naped: 'jednofazowy', udzwigKg: 1000 }, 'wymagane', 'o-ukladnice', 10],
  ['układnica 200 kg z kabiną operatora', { rodzaj: 'ukladnica', naped: 'mechaniczny', udzwigKg: 200, przemieszczaOsoby: true }, 'wymagane', 'o-ukladnice', 10],
  ['wyciąg towarowy 250 kg', { rodzaj: 'wyciag', naped: 'mechaniczny', udzwigKg: 250 }, 'do-250', null, null],
  ['wyciąg towarowy 251 kg', { rodzaj: 'wyciag', naped: 'mechaniczny', udzwigKg: 251 }, 'wymagane', 'o-wyciagi', 10],
  ['wyciąg ręczny', { rodzaj: 'wyciag', naped: 'reczny', udzwigKg: 500 }, 'reczny', null, null],
  ['podest przejezdny', { rodzaj: 'podest', naped: 'mechaniczny', typPodestu: 'przejezdny' }, 'wymagane', 'o-podesty-przejezdne', 5],
  ['podest stacjonarny', { rodzaj: 'podest', naped: 'mechaniczny', typPodestu: 'stacjonarny' }, 'wymagane', 'o-podesty-stacjonarne', 10],
  ['podest wiszący', { rodzaj: 'podest', naped: 'mechaniczny', typPodestu: 'wiszacy' }, 'wymagane', 'o-podesty-wiszace', 10],
  ['podest masztowy', { rodzaj: 'podest', naped: 'mechaniczny', typPodestu: 'masztowy' }, 'wymagane', 'o-podesty-masztowe', 10],
  ['podest załadowczy', { rodzaj: 'podest', naped: 'mechaniczny', typPodestu: 'zaladowczy' }, 'bez-obslugi', null, null],
  ['podest ręczny', { rodzaj: 'podest', naped: 'reczny', typPodestu: 'przejezdny' }, 'reczny', null, null],
  ['stół podnośny', { rodzaj: 'dzwignik', typDzwignika: 'staly' }, 'bez-obslugi', null, null],
  ['dźwignik przenośny ręczny', { rodzaj: 'dzwignik', typDzwignika: 'przenosny-reczny' }, 'nie-utd', null, null],
  ['dźwignik pojazdu', { rodzaj: 'dzwignik', typDzwignika: 'pojazd' }, 'nie-utd', null, null],
  ['dźwignik stołu technologicznego', { rodzaj: 'dzwignik', typDzwignika: 'stol-technologiczny' }, 'nie-utd', null, null],
  ['dźwig osobowy', { rodzaj: 'dzwig', typDzwigu: 'osobowy' }, 'bez-obslugi', null, null],
  ['dźwig towarowy', { rodzaj: 'dzwig', typDzwigu: 'towarowy' }, 'bez-obslugi', null, null],
  ['dźwig towarowy mały', { rodzaj: 'dzwig', typDzwigu: 'towarowy-maly' }, 'bez-obslugi', null, null],
  ['dźwig towarowo-osobowy sterowany z przystanków', { rodzaj: 'dzwig', typDzwigu: 'towarowo-osobowy-zewn' }, 'bez-obslugi', null, null],
  ['dźwig towarowo-osobowy ze sterowaniem wewnętrznym', { rodzaj: 'dzwig', typDzwigu: 'towarowo-osobowy-wewn' }, 'wymagane', 'o-dzwigi-towarowo-osobowe', 10],
  ['dźwig szpitalny', { rodzaj: 'dzwig', typDzwigu: 'szpitalny' }, 'wymagane', 'o-dzwigi-towarowo-osobowe', 10],
  ['dźwig budowlany', { rodzaj: 'dzwig', typDzwigu: 'budowlany' }, 'wymagane', 'o-dzwigi-budowlane', 10],
];

describe('czy potrzebne zaświadczenie UDT (zał. 3 tab. 1 do rozp. z 2019 r., § 1 rozp. z 2012 r., § 4 rozp. bhp o wózkach)', () => {
  it.each(P)('%s', (_, dane, galaz, id, lata) => {
    const w = czyUdt(dane);
    expect(w.galaz).toBe(galaz);
    expect(w.potrzebne).toBe(galaz === 'wymagane');
    expect(w.kategoria?.id ?? null).toBe(id);
    expect(w.kategoria?.lata ?? null).toBe(lata);
    expect(w.powod).toMatch(/\(.*(§|zał\.|uwagi).*\)/);
    if (!w.potrzebne) expect(w.zamiast).toBeTruthy();
  });

  it('kategorie pochodzą z OBSLUGA (ten sam obiekt)', () => {
    expect(OBSLUGA).toContain(czyUdt({ rodzaj: 'wozek-widlowy' }).kategoria);
  });

  it('wózek bez mechanicznego podnoszenia: § 4 ust. 2 rozp. bhp, 18 lat, szkolenie albo prawo jazdy', () => {
    const w = czyUdt({ rodzaj: 'ciagnik' });
    expect(w.zamiast).toContain('§ 4 ust. 2');
    expect(w.zamiast).toContain('18 lat');
    expect(w.zamiast).toContain('prawo jazdy');
  });

  it('uwagi: reach truck, „nie wiem”, jednofazowy przy poz. 4–11, osoby przy 250 kg', () => {
    expect(czyUdt({ rodzaj: 'reach-truck' }).uwagi[0]).toContain('wysięgnik');
    expect(czyUdt({ rodzaj: 'suwnica', naped: 'mechaniczny', udzwigKg: 2000, przeznaczenie: 'nie-wiem' }).uwagi.join(' ')).toContain('specjalnego przeznaczenia');
    expect(czyUdt({ rodzaj: 'ukladnica', naped: 'jednofazowy', udzwigKg: 1000 }).uwagi[0]).toContain('tylko wciągników');
    expect(czyUdt({ rodzaj: 'wciagnik', naped: 'jednofazowy', udzwigKg: 1001, przeznaczenie: 'ogolne' }).uwagi[0]).toContain('do 1000 kg');
    expect(czyUdt({ rodzaj: 'wciagnik', naped: 'mechaniczny', udzwigKg: 200, przemieszczaOsoby: true, przeznaczenie: 'ogolne' }).uwagi[0]).toContain('przemieszczają osoby');
  });

  it('konserwacja: jeden rodzaj z tab. nr 2 (§ 4 ust. 3), także gdy obsługa nie wymaga zaświadczenia', () => {
    // [dane, id, lata] sprawdzone w Pythonie (słownik tab. nr 2).
    const K: [DaneMaszyny, string, number][] = [
      [{ rodzaj: 'wciagnik', naped: 'reczny', przeznaczenie: 'ogolne' }, 'k-wciagniki-ogolne', 10],
      [{ rodzaj: 'wciagnik', naped: 'reczny', przeznaczenie: 'nie-wiem' }, 'k-wciagniki-specjalne', 10],
      [{ rodzaj: 'suwnica', naped: 'jednofazowy', udzwigKg: 500, przeznaczenie: 'ogolne' }, 'k-suwnice-ogolne', 5],
      [{ rodzaj: 'suwnica', naped: 'reczny', przeznaczenie: 'specjalne' }, 'k-suwnice-specjalne', 5],
      [{ rodzaj: 'zuraw', naped: 'reczny', typZurawia: 'stacjonarny' }, 'k-zurawie-stacjonarne', 10],
      [{ rodzaj: 'zuraw', naped: 'reczny', typZurawia: 'przewozny' }, 'k-zurawie-samojezdne', 5],
      [{ rodzaj: 'zuraw', naped: 'reczny', typZurawia: 'samojezdny' }, 'k-zurawie-samojezdne', 5],
      [{ rodzaj: 'zuraw', naped: 'reczny', typZurawia: 'wiezowy' }, 'k-zurawie-wiezowe', 5],
      [{ rodzaj: 'podest', typPodestu: 'zaladowczy' }, 'k-podesty-pz', 5],
      [{ rodzaj: 'podest', naped: 'reczny', typPodestu: 'przejezdny' }, 'k-podesty-pz', 5],
      [{ rodzaj: 'podest', naped: 'reczny', typPodestu: 'stacjonarny' }, 'k-podesty-swm', 5],
      [{ rodzaj: 'podest', naped: 'reczny', typPodestu: 'wiszacy' }, 'k-podesty-swm', 5],
      [{ rodzaj: 'podest', naped: 'reczny', typPodestu: 'masztowy' }, 'k-podesty-swm', 5],
      [{ rodzaj: 'dzwig', typDzwigu: 'towarowy', napedDzwigu: 'elektryczny' }, 'k-dzwigi-elektryczne', 5],
      [{ rodzaj: 'dzwig', typDzwigu: 'osobowy', napedDzwigu: 'hydrauliczny' }, 'k-dzwigi-hydrauliczne', 5],
      [{ rodzaj: 'dzwignik', typDzwignika: 'staly' }, 'k-dzwigniki', 10],
      [{ rodzaj: 'ukladnica', naped: 'mechaniczny', udzwigKg: 100 }, 'k-ukladnice', 10],
      [{ rodzaj: 'wyciag', naped: 'reczny' }, 'k-wyciagi', 10],
    ];
    for (const [dane, id, lata] of K) {
      const k = czyUdt(dane).konserwacja;
      expect([dane, k?.id, k?.lata]).toEqual([dane, id, lata]);
    }
    expect(KONSERWATOR.find((k) => k.id === 'k-zurawie-wiezowe')?.nazwa).toBe('Żurawie wieżowe, szybkomontujące, szynowe i stacjonarne');
  });

  it('pola ukryte dla rodzaju nie zmieniają wyniku (napęd „ręczny” z wciągnika przy dźwigu)', () => {
    expect(czyUdt({ rodzaj: 'dzwig', typDzwigu: 'budowlany', naped: 'reczny' })).toMatchObject({ potrzebne: true, galaz: 'wymagane' });
    expect(czyUdt({ rodzaj: 'dzwig', typDzwigu: 'towarowo-osobowy-wewn', naped: 'reczny', udzwigKg: 100 }).kategoria?.id).toBe('o-dzwigi-towarowo-osobowe');
    expect(czyUdt({ rodzaj: 'wozek-widlowy', naped: 'reczny', przemieszczaOsoby: true, udzwigKg: 2000 }).kategoria?.id).toBe('o-wozki');
    expect(czyUdt({ rodzaj: 'ciagnik', podnoszenieMechaniczne: true }).galaz).toBe('wozek-bez-podnoszenia');
    expect(tylkoPola({ rodzaj: 'dzwig', typDzwigu: 'osobowy', naped: 'reczny', udzwigKg: 5 })).toEqual({ rodzaj: 'dzwig', typDzwigu: 'osobowy' });
    expect(polaRodzaju({ rodzaj: 'paleciak', podnoszenieMechaniczne: false })).toEqual(['jazda', 'podnoszenie']);
    expect(polaRodzaju({ rodzaj: 'paleciak', podnoszenieMechaniczne: true })).toEqual(['jazda', 'podnoszenie', 'udzwig']);
  });

  it('wózki: § 4 ust. 1 pkt 2 w uwagach; do 250 kg obowiązek tylko z rozporządzenia bhp; pchany do 250 kg niejasny', () => {
    expect(czyUdt({ rodzaj: 'wozek-widlowy', udzwigKg: 1600 }).uwagi.join(' ')).toContain('książką operatora maszyn roboczych');
    const lekki = czyUdt({ rodzaj: 'wozek-widlowy', udzwigKg: 250 });
    expect(lekki).toMatchObject({ potrzebne: true, galaz: 'wymagane' });
    expect(lekki.uwagi.join(' ')).toContain('wymóg z ustawy nie działa');
    expect(czyUdt({ rodzaj: 'wozek-widlowy', udzwigKg: 251 }).uwagi.join(' ')).not.toContain('wymóg z ustawy nie działa');
    const pchany = czyUdt({ rodzaj: 'paleciak', jazdaSilnikowa: false, podnoszenieMechaniczne: true, udzwigKg: 200 });
    expect(pchany.potrzebne).toBe(true);
    expect(pchany.uwagi.join(' ')).toContain('„wózek z napędem silnikowym”');
    expect(czyUdt({ rodzaj: 'paleciak', jazdaSilnikowa: true, podnoszenieMechaniczne: true, udzwigKg: 200 }).uwagi.join(' ')).not.toContain('„wózek z napędem silnikowym”');
    expect(() => czyUdt({ rodzaj: 'reach-truck', udzwigKg: -5 })).toThrow(RangeError);
  });

  it('§ 4 ust. 2: program opracowany lub zatwierdzony przez UDT, pkt 3 i przepis przejściowy z 2019 r.', () => {
    const z = czyUdt({ rodzaj: 'ciagnik' }).zamiast!;
    expect(z).toContain('opracowanego lub zatwierdzonego przez UDT');
    expect(z).toContain('§ 4 ust. 2 pkt 1–3');
    expect(z).toContain('Dz.U. 2019 poz. 1948');
    expect(z).toContain('art. 237³ § 2');
  });

  it('dźwig szpitalny: uwaga o zakresie dopisku', () => {
    expect(czyUdt({ rodzaj: 'dzwig', typDzwigu: 'szpitalny' }).uwagi[0]).toContain('nieposiadających kontroli obciążenia kabiny');
  });

  it('błędny udźwig: RangeError', () => {
    expect(() => czyUdt({ rodzaj: 'wciagnik', naped: 'mechaniczny', udzwigKg: 0 })).toThrow(RangeError);
    expect(() => czyUdt({ rodzaj: 'wyciag', naped: 'mechaniczny', udzwigKg: Number.NaN })).toThrow(RangeError);
    expect(() => czyUdt({ rodzaj: 'suwnica', naped: 'jednofazowy' })).toThrow(RangeError);
    // napęd ręczny rozstrzyga bez udźwigu
    expect(czyUdt({ rodzaj: 'wciagnik', naped: 'reczny' }).galaz).toBe('reczny');
  });

  it('nieznany rodzaj: RangeError', () => {
    expect(() => czyUdt({ rodzaj: 'koparka' as never })).toThrow(RangeError);
  });

  it('każdy rodzaj z listy daje wynik z ustawieniami domyślnymi i udźwigiem', () => {
    for (const r of RODZAJE) expect(() => czyUdt({ rodzaj: r.id, udzwigKg: 1000 })).not.toThrow();
  });
});
