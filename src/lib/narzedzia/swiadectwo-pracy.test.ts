// Oczekiwane wartości policzone niezależnie w Pythonie (datetime, calendar, własna lista świąt z Wielkanocą; skrypt poza
// repozytorium, opis w raporcie pakietu): 20 000 losowych dat 2000–2040 i kwot bez rozbieżności. Przypadki:
// otrzymanie 30.10.2026 → wniosek do 13.11.2026 (piątek); 31.10.2026 → 14.11.2026 (sobota; po art. 115 KC 16.11.2026);
// 28.10.2026 → 11.11.2026 (święto; po przesunięciu 12.11.2026); odmowa 10.12.2026 → 24.12.2026 (Wigilia; 28.12.2026);
// wniosek 10.11.2026 → odpowiedź do 17.11.2026, pozew ostrożnie do 1.12.2026; ustanie 29.02.2024 → przedawnienie 28.02.2027;
// odszkodowanie 5200 zł → 7800 zł, 4806,01 zł → 7209,02 zł (1,5 × w groszach, połówka w górę).
import { describe, expect, it } from 'vitest';
import { bladSwiadectwa, granicaOdszkodowania, opisSwiadectwa, stanTerminu, terminySwiadectwa, type DaneSwiadectwa } from './swiadectwo-pracy';

const DZIS = '2026-11-14';
const sp = (t: string) => t.replace(/\s/g, ' ');
const dane = (x: Partial<DaneSwiadectwa>): DaneSwiadectwa => ({ ustanie: '2026-10-30', ...x });

describe('terminy świadectwa pracy', () => {
  it('wydanie w dniu ustania, wysyłka w 7 dni (art. 97 § 1)', () => {
    const t = terminySwiadectwa(dane({}));
    expect(t.wydanie).toBe('2026-10-30');
    expect(t.wysylka).toBe('2026-11-06');
  });
  it('kolejna umowa w 7 dni: bez terminu wydania (art. 97 § 1¹)', () => {
    const t = terminySwiadectwa(dane({ kolejnaUmowa: true }));
    expect(t.wydanie).toBeNull();
    expect(sp(opisSwiadectwa(dane({ kolejnaUmowa: true }), DZIS).pozycje[0].wartosc)).toContain('tylko na wniosek');
  });
  it('wniosek o sprostowanie 14 dni, bez przesunięcia jako termin główny', () => {
    expect(terminySwiadectwa(dane({ otrzymanie: '2026-10-30' })).sprostowanie).toEqual({ koniec: '2026-11-13', poPrzesunieciu: null, powod: null });
    expect(terminySwiadectwa(dane({ otrzymanie: '2026-10-31' })).sprostowanie).toEqual({ koniec: '2026-11-14', poPrzesunieciu: '2026-11-16', powod: 'sobota' });
    const s = terminySwiadectwa(dane({ ustanie: '2026-10-28', otrzymanie: '2026-10-28' })).sprostowanie!;
    expect(s.koniec).toBe('2026-11-11');
    expect(s.poPrzesunieciu).toBe('2026-11-12');
  });
  it('odpowiedź pracodawcy 7 dni (§ 7 ust. 1 rozporządzenia) i ostrożny pozew bez zawiadomienia', () => {
    const t = terminySwiadectwa(dane({ otrzymanie: '2026-10-31', wniosek: '2026-11-10' }));
    expect(t.odpowiedz!.koniec).toBe('2026-11-17');
    expect(t.pozewBezOdpowiedzi!.koniec).toBe('2026-12-01');
    expect(t.pozew).toBeNull();
  });
  it('pozew po odmowie 14 dni; Wigilia i święta tylko w dopisku', () => {
    const t = terminySwiadectwa(dane({ otrzymanie: '2026-10-31', wniosek: '2026-11-10', odmowa: '2026-12-10' }));
    expect(t.pozew).toEqual({ koniec: '2026-12-24', poPrzesunieciu: '2026-12-28', powod: 'Wigilia Bożego Narodzenia' });
    expect(t.pozewBezOdpowiedzi).toBeNull();
    const o = opisSwiadectwa(dane({ otrzymanie: '2026-10-31', wniosek: '2026-11-10', odmowa: '2026-12-10' }), DZIS);
    expect(sp(o.glowny)).toBe('24 grudnia 2026 r.');
    expect(sp(o.pozycje.find((p) => p.klucz === 'pozew')!.wartosc)).toContain('dzień wolny od pracy; czy termin przesuwa się na 28 grudnia 2026 r.');
  });
  it('przedawnienie pozwu o wydanie: 3 lata, 29 lutego → 28 lutego (art. 112 KC)', () => {
    expect(terminySwiadectwa(dane({ ustanie: '2024-02-29' })).przedawnienie).toBe('2027-02-28');
  });
});

describe('odszkodowanie z art. 99 § 2', () => {
  it('1,5 miesięcznej kwoty, grosze połówką w górę', () => {
    expect(granicaOdszkodowania(5200)).toBe(7800);
    expect(granicaOdszkodowania(4806.01)).toBe(7209.02);
    expect(granicaOdszkodowania(0.01)).toBe(0.02);
  });
  it('bez pensji: opis zamiast kwoty', () => {
    expect(terminySwiadectwa(dane({})).odszkodowanie).toBeNull();
    expect(sp(opisSwiadectwa(dane({ wynagrodzenie: 5200 }), DZIS).pozycje.find((p) => p.klucz === 'odszkodowanie')!.wartosc)).toContain('najwyżej 7800,00 zł');
  });
});

describe('status i termin główny', () => {
  it('stan terminu', () => {
    expect(stanTerminu('2026-11-14', DZIS)).toEqual({ tekst: 'dziś ostatni dzień', klasa: 'pilne' });
    expect(stanTerminu('2026-11-13', DZIS)).toEqual({ tekst: 'termin minął 1 dzień temu', klasa: 'po-terminie' });
    expect(stanTerminu('2026-11-20', DZIS).klasa).toBe('wkrotce');
    expect(stanTerminu('2026-12-20', DZIS)).toEqual({ tekst: 'zostało 36 dni', klasa: 'w-terminie' });
  });
  it('najbliższy termin pracownika: wniosek o sprostowanie', () => {
    const o = opisSwiadectwa(dane({ otrzymanie: '2026-11-05' }), DZIS);
    expect(sp(o.glowny)).toBe('19 listopada 2026 r.');
    expect(o.status).toBe('Zostało 5 dni');
    expect(o.statusKlasa).toBe('wkrotce');
  });
  it('po złożeniu wniosku liczy się pozew (wariant ostrożny)', () => {
    const o = opisSwiadectwa(dane({ otrzymanie: '2026-10-31', wniosek: '2026-11-10' }), DZIS);
    expect(sp(o.glowny)).toBe('1 grudnia 2026 r.');
    expect(o.glownyOpis).toContain('ostrożnie');
  });
  it('bez dat świadectwa: termin wydania', () => {
    const o = opisSwiadectwa(dane({ ustanie: '2026-11-30' }), DZIS);
    expect(o.status).toBe('Do ustania stosunku pracy: 16 dni');
    expect(opisSwiadectwa(dane({}), DZIS).statusKlasa).toBe('po-terminie');
  });
});

describe('błędne dane', () => {
  it('daty w złej kolejności i puste pola', () => {
    expect(bladSwiadectwa(dane({ ustanie: '' }))?.pole).toBe('ustanie');
    expect(bladSwiadectwa(dane({ ustanie: '1999-12-31' }))?.pole).toBe('ustanie');
    expect(bladSwiadectwa(dane({ otrzymanie: '2026-10-29' }))?.pole).toBe('otrzymanie');
    expect(bladSwiadectwa(dane({ otrzymanie: '2026-11-05', wniosek: '2026-11-04' }))?.pole).toBe('wniosek');
    expect(bladSwiadectwa(dane({ wniosek: '2026-11-05', odmowa: '2026-11-04' }))?.pole).toBe('odmowa');
    expect(bladSwiadectwa(dane({ otrzymanie: '2026-02-30' }))?.pole).toBe('otrzymanie');
    expect(bladSwiadectwa(dane({ wynagrodzenie: Number.NaN }))?.pole).toBe('wynagrodzenie');
    expect(bladSwiadectwa(dane({ wynagrodzenie: 0 }))?.pole).toBe('wynagrodzenie');
    expect(bladSwiadectwa(dane({ otrzymanie: '', wniosek: '', odmowa: '' }))).toBeNull();
    expect(() => opisSwiadectwa(dane({ ustanie: 'x' }), DZIS)).toThrow(RangeError);
  });
});
