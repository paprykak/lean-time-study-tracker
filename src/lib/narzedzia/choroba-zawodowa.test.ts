import { describe, expect, it } from 'vitest';
import { BladDanych, GRUPY, WYKAZ, SPOZA_WYKAZU, koniecOkresu, numerPozycji, pozycja, sprawdzChorobe, tekstyChoroby, zaIle, type DaneChoroby } from './choroba-zawodowa';

// Oczekiwane daty policzone niezależnie w Pythonie (datetime, calendar): scratchpad/budowa/choroba_oczekiwane.py.
const DZIS = '2026-11-13';
const zak = (choroba: string, koniec: string, objawy?: string): DaneChoroby => ({ choroba, narazenie: 'koniec-nie-pracuje', koniec, objawy });

describe('wykaz chorób zawodowych (t.j. Dz.U. 2026 poz. 1297)', () => {
  it('78 wierszy wykazu i zatrucia rozbite na ostre i przewlekłe, identyfikatory unikalne', () => {
    expect(WYKAZ).toHaveLength(79);
    expect(new Set(WYKAZ.map((p) => p.id)).size).toBe(79);
    expect(Object.keys(GRUPY)).toHaveLength(13);
    for (const p of WYKAZ) {
      if (p.grupa) expect(GRUPY[p.grupa], p.id).toBeDefined();
      expect(p.krotko.length, p.id).toBeLessThanOrEqual(21);
    }
  });
  it('typowe dla hali: cieśń 20.1 (1 rok), słuch 21 (2 lata, 45 dB), wibracje 22.2 (3 lata), nadkłykieć 19.5', () => {
    expect(pozycja('20.1')).toMatchObject({ nazwa: 'zespół cieśni w obrębie nadgarstka', okres: '1 rok', czas: { miesiace: 12 } });
    expect(pozycja('21')?.nazwa).toContain('co najmniej 45 dB');
    expect(pozycja('21')?.nazwa).not.toContain('Obustronny');
    expect(pozycja('21')?.czas).toEqual({ miesiace: 24 });
    expect(pozycja('22.2')?.czas).toEqual({ miesiace: 36 });
    expect(pozycja('19.5')?.nazwa).toBe('przewlekłe zapalenie nadkłykcia kości ramiennej');
    expect(pozycja('6a')?.okres).toBe('1 rok');
  });
  it('kręgosłupa nie ma w wykazie', () => {
    expect(WYKAZ.some((p) => /kręgosłup|dyskopat|przepuklin/i.test(p.nazwa))).toBe(false);
    expect(sprawdzChorobe({ choroba: SPOZA_WYKAZU.id, narazenie: 'trwa' }, DZIS).stan).toBe('spoza-wykazu');
  });
  it('numer pozycji po polsku', () => {
    expect(numerPozycji('20.1')).toBe('poz. 20 pkt 1');
    expect(numerPozycji('6a')).toBe('poz. 6a');
  });
});

describe('koniec okresu (od dnia po zakończeniu narażenia)', () => {
  it.each([
    ['20.1', '2026-03-15', '2027-03-15'],
    ['21', '2024-02-29', '2026-02-28'],
    ['22.2', '2025-12-31', '2028-12-31'],
    ['2', '2026-12-30', '2027-01-02'],
    ['8', '2026-02-28', '2026-03-01'],
    ['16.2', '2026-01-31', '2026-02-28'],
    ['18.6', '2025-12-31', '2026-02-28'],
    ['16.5', '2016-02-29', '2026-02-28'],
    ['23.1', '2024-02-29', '2029-02-28'],
    ['9', '2026-11-10', '2026-11-17'],
    ['1-ostre', '2026-12-31', '2027-01-03'],
  ])('%s, koniec %s → %s', (id, koniec, oczekiwany) => {
    expect(koniecOkresu(koniec, pozycja(id)!.czas!)).toBe(oczekiwany);
  });
});

describe('sprawdzenie', () => {
  it('termin z liczbą dni do końca', () => {
    expect(sprawdzChorobe(zak('20.1', '2026-03-15'), DZIS)).toMatchObject({ stan: 'termin', termin: '2027-03-15', dniDoTerminu: 122 });
    expect(sprawdzChorobe(zak('9', '2026-11-10'), DZIS)).toMatchObject({ stan: 'termin', dniDoTerminu: 4 });
  });
  it('termin minął, objawy na granicy i dzień po', () => {
    expect(sprawdzChorobe(zak('21', '2024-02-29'), DZIS).stan).toBe('termin-minal');
    expect(sprawdzChorobe(zak('21', '2024-02-29', '2026-02-28'), DZIS).stan).toBe('objawy-w-okresie');
    expect(sprawdzChorobe(zak('21', '2024-02-29', '2026-03-01'), DZIS).stan).toBe('objawy-po-okresie');
    expect(sprawdzChorobe(zak('21', '2024-02-29', '2020-01-01'), DZIS).stan).toBe('objawy-w-okresie');
  });
  it('dziś to ostatni dzień okresu', () => {
    expect(sprawdzChorobe(zak('20.1', '2025-11-13'), DZIS)).toMatchObject({ stan: 'termin', dniDoTerminu: 0 });
    expect(sprawdzChorobe(zak('20.1', '2025-11-12'), DZIS)).toMatchObject({ stan: 'termin-minal', dniDoTerminu: -1 });
  });
  it('bez okresu w liczbach: pylice, nowotwory, zatrucia przewlekłe', () => {
    for (const id of ['3.1', '17.1', '1-przewlekle', '26']) expect(sprawdzChorobe(zak(id, '2020-01-01'), DZIS).stan).toBe('bez-daty');
    // Daty nic tu nie zmieniają, więc puste pole nie jest błędem.
    expect(sprawdzChorobe(zak('3.1', ''), DZIS).stan).toBe('bez-daty');
  });
  it('praca w narażeniu trwa: bez dat', () => {
    expect(sprawdzChorobe({ choroba: '20.1', narazenie: 'trwa', koniec: 'zła' }, DZIS).stan).toBe('w-narazeniu');
  });
  it('błędne dane', () => {
    expect(() => sprawdzChorobe(zak('20.1', ''), DZIS)).toThrow(BladDanych);
    expect(() => sprawdzChorobe(zak('20.1', '2026-02-30'), DZIS)).toThrow(BladDanych);
    expect(() => sprawdzChorobe(zak('20.1', '2026-11-14'), DZIS)).toThrow(/później niż dziś/);
    expect(() => sprawdzChorobe(zak('20.1', '2026-01-01', '2026-11-14'), DZIS)).toThrow(BladDanych);
    expect(() => sprawdzChorobe(zak('20.1', '1949-12-31'), DZIS)).toThrow(BladDanych);
    expect(() => sprawdzChorobe(zak('99', '2026-01-01'), DZIS)).toThrow(RangeError);
    expect(() => sprawdzChorobe(zak('20.1', '2026-01-01', 'x'), DZIS)).toThrow(expect.objectContaining({ pole: 'objawy' }));
    expect(() => sprawdzChorobe(zak('20.1', 'x'), DZIS)).toThrow(expect.objectContaining({ pole: 'koniec' }));
  });
});

describe('odmiana dni', () => {
  it.each([
    [1, 'został 1 dzień'],
    [2, 'zostały 2 dni'],
    [5, 'zostało 5 dni'],
    [12, 'zostało 12 dni'],
    [22, 'zostały 22 dni'],
    [0, 'to dziś'],
    [-1, '1 dzień temu'],
    [-258, '258 dni temu'],
  ])('%i → %s', (n, tekst) => expect(zaIle(n)).toBe(tekst));
});

describe('teksty wyniku', () => {
  const t = (d: DaneChoroby) => tekstyChoroby(d, sprawdzChorobe(d, DZIS), DZIS);
  it('termin: data, były pracownik zgłasza sam, odwołania 14 dni, kwota odszkodowania', () => {
    const x = t(zak('20.1', '2026-03-15'));
    expect(x.glowny).toBe('Objawy do 15 marca 2027 r.');
    expect(x.podstawa).toContain('zostały 122 dni');
    expect(x.wiersze[0]).toMatchObject({ dt: 'W wykazie', dd: 'Poz. 20 pkt 1' });
    expect(x.wiersze[0].opis).toContain('Przewlekłe choroby obwodowego układu nerwowego');
    expect(x.wiersze.find((w) => w.dt === 'Kto zgłasza')?.dd).toBe('Możesz zgłosić samodzielnie');
    expect(x.wiersze.map((w) => w.dd)).toContain('14 dni na wniosek');
    expect(x.wiersze.find((w) => w.dt === 'Po stwierdzeniu')?.opis).toContain('1781,00 zł');
    expect(x.uwagi.join(' ')).toContain('ocenia lekarz');
  });
  it('pracownik zatrudniony zgłasza przez lekarza; w narażeniu: przeniesienie i dodatek', () => {
    const x = t({ choroba: '21', narazenie: 'trwa' });
    expect(x.glowny).toBe('Jest w wykazie: poz. 21');
    expect(x.wiersze.find((w) => w.dt === 'Kto zgłasza')?.dd).toBe('Ty, przez lekarza medycyny pracy');
    expect(x.wiersze.map((w) => w.dd)).toContain('Przeniesienie do innej pracy');
    expect(x.uwagi.join(' ')).toContain('45 dB');
    expect(t({ choroba: '20.1', narazenie: 'koniec-pracuje', koniec: '2026-01-01' }).wiersze.find((w) => w.dt === 'Kto zgłasza')?.dd).toBe('Ty, przez lekarza medycyny pracy');
  });
  it('okres minął, objawy po okresie, bez daty, spoza wykazu', () => {
    expect(t(zak('20.1', '2025-01-10')).glowny).toBe('Okres minął 10 stycznia 2026 r.');
    expect(t(zak('20.1', '2025-01-10', '2026-02-01')).glowny).toBe('Objawy po okresie z wykazu');
    expect(t(zak('20.1', '2025-01-10', '2026-01-10')).glowny).toBe('Objawy w okresie z wykazu');
    expect(t(zak('20.1', '2025-01-10', '2025-01-10')).glowny).toBe('Objawy w czasie pracy w narażeniu');
    expect(t(zak('3.1', '2025-01-10')).glowny).toBe('Okres: nie można określić');
    expect(t(zak('1-przewlekle', '2025-01-10')).glowny).toBe('Okres: w zależności od rodzaju substancji');
    expect(t(zak('17.1', '2025-01-10')).glowny).toBe('Okres: indywidualnie');
    expect(t({ choroba: SPOZA_WYKAZU.id, narazenie: 'trwa' }).glowny).toBe('Nie ma w wykazie');
  });
  it('bez formy męskiej i bez porad typu „musisz”', () => {
    const wszystko = [zak('20.1', '2026-03-15'), { choroba: '21', narazenie: 'trwa' as const }, zak('3.1', '2020-01-01')]
      .map((d) => JSON.stringify(t(d)))
      .join(' ');
    expect(wszystko).not.toMatch(/łeś\b|wałeś|powinieneś/);
  });
});
