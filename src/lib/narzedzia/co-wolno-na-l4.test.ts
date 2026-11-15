// Oczekiwane daty policzone niezależnie w Pythonie (scratchpad l4_model.py: miesiąc według art. 112 KC przez calendar,
// art. 115 KC z własną listą świąt i Wielkanocą z algorytmu Meeusa, 7 dni przez timedelta), nie kodem narzędzia.
import { describe, expect, it } from 'vitest';
import {
  CYTAT_1,
  CYTAT_1A,
  CYTAT_1B,
  CYTAT_1C,
  CYTAT_1D,
  CYTAT_1E,
  CYTAT_DAWNY,
  CZYNNOSCI,
  bladL4,
  brzmienie,
  cytaty,
  ocena,
  opisL4,
  stanTerminu,
  stanTerminuPracownika,
  terminOdwolania,
  terminZastrzezen,
  werdyktBezDat,
  type Czynnosc,
  type DaneL4,
} from './co-wolno-na-l4';
import { NARZEDZIA } from '../../data/narzedzia';
import { terminPracownika } from './terminy';

const DZIS = '2026-11-15';
const baza: DaneL4 = { czynnosc: 'polecenie', wskazanie: 'chodzic', kontrola: 'nikt', od: '2026-11-03', do: '2026-11-16', dzien: '2026-11-10' };

describe('brzmienie art. 17 według dnia czynności', () => {
  it.each([
    ['2000-01-01', 'dawne'],
    ['2026-04-12', 'dawne'],
    ['2026-04-13', 'nowe'],
    ['2026-12-31', 'nowe'],
    ['2027-01-01', 'od2027'],
  ])('%s → %s', (d, b) => expect(brzmienie(d)).toBe(b));
});

describe('terminy', () => {
  it.each([
    ['2026-11-13', '2026-12-13', '2026-12-14'], // niedziela
    ['2026-01-31', '2026-02-28', '2026-03-02'], // brak 31 lutego, sobota
    ['2026-12-24', '2027-01-24', '2027-01-25'],
    ['2027-02-28', '2027-03-28', '2027-03-30'], // Wielkanoc i poniedziałek wielkanocny 2027
    ['2026-10-11', '2026-11-11', '2026-11-12'], // Święto Niepodległości
    ['2026-03-31', '2026-04-30', null],
    ['2028-01-31', '2028-02-29', null], // rok przestępny
    ['2026-04-30', '2026-05-30', '2026-06-01'],
    ['2026-11-30', '2026-12-30', null],
    ['2026-05-03', '2026-06-03', null], // 4 czerwca 2026 to Boże Ciało, ale termin kończy się dzień wcześniej
    ['2026-12-25', '2027-01-25', null],
    // Audyt jakosc4 (A-1, A-9): konwencja terminPracownika, sobota przesuwa dopiero od 1.01.2017 r. (Dz.U. 2016 poz. 2255,
    // art. 21), 12.11.2018 r. dniem wolnym; Wigilia wolna od 2025 r. (model w Pythonie, raporty/jakosc4/A-wer.json).
    ['2016-07-13', '2016-08-13', null],
    ['2018-10-12', '2018-11-12', '2018-11-13'],
    ['2018-10-10', '2018-11-10', '2018-11-13'],
    ['2018-10-11', '2018-11-11', '2018-11-13'],
    ['2025-11-24', '2025-12-24', '2025-12-29'],
    ['2024-11-24', '2024-12-24', null],
    ['2026-12-01', '2027-01-01', '2027-01-04'],
    ['2027-01-29', '2027-02-28', '2027-03-01'],
  ])('odwołanie od decyzji doręczonej %s: zdąż do %s, po art. 115 KC %s', (decyzja, koniec, przesuniety) => {
    const t = terminOdwolania(decyzja);
    expect(t.koniec).toBe(koniec);
    expect(t.poPrzesunieciu).toBe(przesuniety);
  });
  it.each([
    ['2026-11-10', '2026-11-17'],
    ['2026-12-28', '2027-01-04'],
    ['2026-02-25', '2026-03-04'],
    ['2024-02-25', '2024-03-03'],
  ])('zastrzeżenia do protokołu otrzymanego %s: do %s', (p, k) => expect(terminZastrzezen(p)).toBe(k));
  it.each([
    ['2026-11-07', '2026-11-14', '2026-11-16'],
    ['2026-12-17', '2026-12-24', '2026-12-28'],
    ['2026-12-25', '2027-01-01', '2027-01-04'],
    ['2027-03-20', '2027-03-27', '2027-03-30'],
    ['2027-05-20', '2027-05-27', '2027-05-28'],
  ])('zastrzeżenia (audyt jakosc4, A-2): protokół %s → zdąż do %s, według art. 115 KC %s', (p, z, k) => {
    const t = terminPracownika(terminZastrzezen(p));
    expect([t.zdazDo, t.wedlugArt115]).toEqual([z, k]);
  });
  it('status terminu z dwiema datami (A-2, A-3): „Termin minął” dopiero po drugiej dacie', () => {
    const t = terminPracownika('2026-11-14');
    expect(stanTerminuPracownika(t, '2026-11-13')).toEqual({ tekst: 'Został 1 dzień', klasa: 'pilne' });
    expect(stanTerminuPracownika(t, '2026-11-14')).toEqual({ tekst: 'Zdąż do: dziś', klasa: 'pilne' });
    expect(stanTerminuPracownika(t, '2026-11-15')).toEqual({ tekst: 'Pierwsza data minęła; ostatni dzień według art. 115 KC: 16 listopada 2026 r.', klasa: 'pilne' });
    expect(stanTerminuPracownika(t, '2026-11-16')).toEqual({ tekst: 'Pierwsza data minęła; ostatni dzień według art. 115 KC: dziś', klasa: 'pilne' });
    expect(stanTerminuPracownika(t, '2026-11-17')).toEqual({ tekst: 'Termin minął 1 dzień temu', klasa: 'po-terminie' });
    expect(stanTerminuPracownika(terminPracownika('2026-11-17'), '2026-11-17')).toEqual({ tekst: 'Dziś ostatni dzień', klasa: 'pilne' });
  });
  it('stan terminu', () => {
    expect(stanTerminu('2026-11-15', DZIS)).toEqual({ tekst: 'Dziś ostatni dzień', klasa: 'pilne' });
    expect(stanTerminu('2026-11-16', DZIS)).toEqual({ tekst: 'Został 1 dzień', klasa: 'pilne' });
    expect(stanTerminu('2026-11-22', DZIS)).toEqual({ tekst: 'Zostało 7 dni', klasa: 'wkrotce' });
    expect(stanTerminu('2026-11-23', DZIS)).toEqual({ tekst: 'Zostało 8 dni', klasa: 'w-terminie' });
    expect(stanTerminu('2026-11-12', DZIS)).toEqual({ tekst: 'Termin minął 3 dni temu', klasa: 'po-terminie' });
  });
});

describe('werdykty', () => {
  const W = (c: Czynnosc, dzien: string, wsk: 'chodzic' | 'lezec' = 'chodzic') => ocena(c, brzmienie(dzien), wsk);
  it('praca na polecenie pracodawcy: dawniej ryzyko (bez definicji), od 13.04.2026 nie wolno z ust. 1a zd. 2', () => {
    expect(W('polecenie', '2026-04-12')).toMatchObject({ werdykt: 'zalezy', etykieta: 'Ryzyko utraty zasiłku' });
    expect(W('polecenie', '2026-04-13')).toMatchObject({ werdykt: 'nie', etykieta: 'Nie wolno, także na polecenie', przepis: 'art. 17 ust. 1a ustawy zasiłkowej' });
    expect(W('polecenie', '2026-04-13').opis).toContain('istotną okolicznością nie może być polecenie pracodawcy');
  });
  it('praca w innej firmie: nie wolno, od 1.01.2027 tylko bez zwolnienia z tej pracy (ust. 1d)', () => {
    expect(W('inna-praca', '2026-04-12').werdykt).toBe('nie');
    expect(W('inna-praca', '2026-12-31')).toMatchObject({ werdykt: 'nie', przepis: 'art. 17 ust. 1a i 1c ustawy zasiłkowej' });
    expect(W('inna-praca', '2027-01-01')).toMatchObject({ werdykt: 'warunek', etykieta: 'Tylko bez zwolnienia z tej pracy' });
    expect(W('inna-praca', '2027-01-01').warunki.join(' ')).toContain('art. 17 ust. 1e');
  });
  it('czynność incydentalna: dawniej ryzyko, od 13.04.2026 wyjątek z warunkami', () => {
    expect(W('incydentalna', '2026-04-12').werdykt).toBe('zalezy');
    const o = W('incydentalna', '2026-04-13');
    expect(o.werdykt).toBe('warunek');
    expect(o.warunki.join(' ')).toContain('polecenie pracodawcy nią nie jest');
  });
  it('lekarz wolno, zakupy i dom z warunkiem, wyjazd z adresem i badaniem, wysiłek: ocena ZUS', () => {
    expect(W('lekarz', '2026-11-10').werdykt).toBe('wolno');
    expect(W('zakupy', '2026-11-10').werdykt).toBe('warunek');
    expect(W('dom', '2026-03-01').etykieta).toBe('Zwykle wolno');
    const w = W('wyjazd', '2026-11-10');
    expect(w.warunki.join(' ')).toMatch(/3 dni.*art\. 59 ust\. 5e–5f/);
    expect(w.warunki.join(' ')).toContain('art. 59 ust. 6');
    expect(W('wysilek', '2026-11-10')).toMatchObject({ werdykt: 'zalezy', przepis: 'art. 17 ust. 1b i art. 68 ust. 1e ustawy zasiłkowej' });
  });
  it('wskazanie „chory powinien leżeć”: uwaga przy wyjściach, nie przy pracy ani u lekarza', () => {
    for (const c of ['zakupy', 'dom', 'wyjazd', 'wysilek'] as Czynnosc[]) expect(W(c, '2026-11-10', 'lezec').warunki.join(' ')).toContain('chory powinien leżeć');
    for (const c of ['polecenie', 'inna-praca', 'lekarz', 'incydentalna'] as Czynnosc[]) expect(W(c, '2026-11-10', 'lezec').warunki.join(' ')).not.toContain('chory powinien leżeć');
  });
  it('każda czynność w każdym brzmieniu ma werdykt, przepis i opis', () => {
    for (const c of Object.keys(CZYNNOSCI) as Czynnosc[])
      for (const d of ['2026-01-10', '2026-06-10', '2027-06-10']) {
        const o = W(c, d);
        expect(o.etykieta.length).toBeGreaterThan(3);
        expect(o.przepis).toMatch(/^art\. 17/);
        expect(o.opis.length).toBeGreaterThan(40);
      }
  });
});

describe('cytaty przepisów', () => {
  it('dawne brzmienie tylko dla czynności sprzed 13.04.2026', () => {
    expect(cytaty('polecenie', 'dawne')).toEqual([CYTAT_DAWNY]);
    expect(cytaty('polecenie', 'nowe')).toEqual([CYTAT_1, CYTAT_1A]);
    expect(cytaty('zakupy', 'nowe')).toEqual([CYTAT_1, CYTAT_1B]);
    expect(cytaty('incydentalna', 'od2027')).toEqual([CYTAT_1, CYTAT_1A, CYTAT_1B]);
    expect(cytaty('inna-praca', 'nowe')).toEqual([CYTAT_1, CYTAT_1A, CYTAT_1C]);
    expect(cytaty('inna-praca', 'od2027')).toEqual([CYTAT_1, CYTAT_1A, CYTAT_1C, CYTAT_1D, CYTAT_1E]);
  });
  it('cytaty dosłowne (fragmenty z Dz.U. 2026 poz. 26 i 2025 poz. 501)', () => {
    expect(CYTAT_1A).toContain('z wyłączeniem czynności incydentalnych, których podjęcia w okresie zwolnienia od pracy wymagają istotne okoliczności. Istotną okolicznością nie może być polecenie pracodawcy.');
    expect(CYTAT_1B).toContain('są wszelkie działania utrudniające lub wydłużające proces leczenia lub rekonwalescencję, z wyłączeniem zwykłych czynności dnia codziennego');
    expect(CYTAT_DAWNY).toContain('traci prawo do zasiłku chorobowego za cały okres tego zwolnienia');
  });
});

describe('opis wyniku', () => {
  it('skutek: cały okres wpisanego zwolnienia z liczbą dni', () => {
    const o = opisL4(baza, DZIS);
    expect(o.werdykt).toBe('Nie wolno, także na polecenie');
    expect(o.werdyktKlasa).toBe('po-terminie');
    expect(o.skutek).toContain('od 3 listopada 2026 r. do 16 listopada 2026 r. (14 dni)');
    expect(o.skutek).toMatch(/^Gdy ZUS albo pracodawca, który sam wypłaca zasiłek, to ustali, tracisz prawo do zasiłku/);
    expect(o.skutek).toContain('art. 92 § 3 pkt 2 Kodeksu pracy');
  });
  it('jednodniowe zwolnienie i zwolnienie przez 29 lutego', () => {
    expect(opisL4({ ...baza, od: '2026-05-05', do: '2026-05-05', dzien: '2026-05-05' }, DZIS).skutek).toContain('5 maja 2026 r. (1 dzień)');
    expect(opisL4({ ...baza, od: '2024-02-28', do: '2024-03-01', dzien: '2024-02-29' }, DZIS).skutek).toContain('(3 dni)');
  });
  it('skutek warunkowy i „nie odbiera” dla lekarza', () => {
    expect(opisL4({ ...baza, czynnosc: 'zakupy' }, DZIS).skutek).toMatch(/^Jeśli ZUS albo pracodawca, który sam wypłaca zasiłek, uzna to za aktywność niezgodną z celem zwolnienia, tracisz/);
    expect(opisL4({ ...baza, czynnosc: 'zakupy', od: '2026-03-01', do: '2026-03-20', dzien: '2026-03-05' }, DZIS).skutek).toMatch(/^Jeśli ZUS albo pracodawca, który sam wypłaca zasiłek, uzna to za wykorzystywanie zwolnienia niezgodnie z celem/);
    expect(opisL4({ ...baza, czynnosc: 'incydentalna' }, DZIS).skutek).toMatch(/^Jeśli ZUS albo pracodawca, który sam wypłaca zasiłek, uzna, że to nie był wyjątek/);
    expect(opisL4({ ...baza, czynnosc: 'lekarz' }, DZIS).skutek).toMatch(/^Ta czynność nie odbiera zasiłku/);
  });
  it('zastrzeżenia i odwołanie z datami i statusem', () => {
    const o = opisL4({ ...baza, protokol: '2026-11-10', decyzja: '2026-11-13' }, DZIS);
    expect(o.zastrzezenia).toMatch(/^Zastrzeżenia składasz najpóźniej 17 listopada 2026 r\./);
    expect(o.zastrzezeniaStatus).toBe('Zostały 2 dni');
    expect(o.odwolanie).toMatch(/^Zdąż do 13 grudnia 2026 r\.: miesiąc od doręczenia decyzji\. 13 grudnia 2026 r\. to niedziela: według art\. 115 Kodeksu cywilnego \(przez art\. 165 § 1 KPC\) ostatni dzień to 14 grudnia 2026 r\./);
    expect(o.odwolanieStatus).toBe('Zostało 28 dni');
    expect(o.odwolanieKlasa).toBe('w-terminie');
    const bez = opisL4({ ...baza, decyzja: '2026-11-12', protokol: '2026-11-12' }, DZIS);
    expect(bez.odwolanie).toMatch(/^Zdąż do 12 grudnia 2026 r\.: miesiąc od doręczenia decyzji\. 12 grudnia 2026 r\. to sobota/);
    const pusto = opisL4(baza, DZIS);
    expect(pusto.odwolanieStatus).toBeNull();
    expect(pusto.zastrzezeniaStatus).toBeNull();
    expect(pusto.odwolanie).toContain('Wpisz dzień doręczenia decyzji');
  });
  it('przesunięcie ze święta: nazwa dnia, całe zdanie bez podwójnej kropki', () => {
    const pazdz = { ...baza, od: '2026-10-01', do: '2026-10-14', dzien: '2026-10-05', decyzja: '2026-10-11' };
    const o = opisL4(pazdz, '2026-11-05');
    expect(o.odwolanie).toMatch(
      /^Zdąż do 11 listopada 2026 r\.: miesiąc od doręczenia decyzji\. 11 listopada 2026 r\. to Narodowe Święto Niepodległości, dzień wolny od pracy: według art\. 115 Kodeksu cywilnego \(przez art\. 165 § 1 KPC\) ostatni dzień to 12 listopada 2026 r\., ale bezpieczniej zdążyć do 11 listopada 2026 r\. Odwołanie wnosisz/,
    );
    for (const t of [o.odwolanie, o.zastrzezenia, o.skutek, ...o.kontrola, ...o.uwagi]) expect(t).not.toContain('r..');
  });
  it('dzień po dacie bez przesunięcia, a przed przesuniętą: liczy się art. 115 KC, a nie „termin minął”', () => {
    const pazdz = { ...baza, od: '2026-10-01', do: '2026-10-14', dzien: '2026-10-05', decyzja: '2026-10-11' };
    const o = opisL4(pazdz, '2026-11-12');
    expect(o.odwolanieStatus).toBe('Pierwsza data minęła; ostatni dzień według art. 115 KC: dziś');
    expect(o.odwolanieKlasa).toBe('pilne');
    expect(o.odwolanie).toMatch(/^Miesiąc od doręczenia decyzji przypadł na 11 listopada 2026 r\., ale ten dzień to Narodowe Święto Niepodległości, dzień wolny od pracy, więc według art\. 115 Kodeksu cywilnego \(przez art\. 165 § 1 KPC\) termin upływa 12 listopada 2026 r\. Odwołanie wnosisz/);
    expect(o.odwolanie).not.toContain('Nie zwlekaj');
    // Po obu datach: liczy się data z art. 115 KC (12.11), a nie data bez przesunięcia (11.11).
    const po = opisL4(pazdz, '2026-11-13');
    expect(po.odwolanieStatus).toBe('Termin minął 1 dzień temu');
    expect(po.odwolanie).toMatch(/^Termin minął: miesiąc od doręczenia decyzji przypadł na 11 listopada 2026 r\., a że ten dzień to Narodowe Święto Niepodległości, dzień wolny od pracy, według art\. 115 Kodeksu cywilnego \(przez art\. 165 § 1 KPC\) termin upłynął 12 listopada 2026 r\. Odwołanie/);
    // W sam dzień „zdąż do” (audyt jakosc4, A-3): ta data nadal się liczy, jak we wspólnej fazaTerminu.
    const wDzienWolny = opisL4(pazdz, '2026-11-11');
    expect(wDzienWolny.odwolanieStatus).toBe('Zdąż do: dziś');
    expect(wDzienWolny.odwolanie).toMatch(/^Zdąż do 11 listopada 2026 r\./);
    const sobota = opisL4({ ...pazdz, decyzja: '2026-10-14' }, '2026-11-14');
    expect(sobota.odwolanieStatus).toBe('Zdąż do: dziś');
    expect(sobota.odwolanie.startsWith('Zdąż do 14 listopada 2026 r.: miesiąc od doręczenia decyzji. 14 listopada 2026 r. to sobota: według art. 115')).toBe(true);
    const niedziela = opisL4({ ...pazdz, decyzja: '2026-10-14' }, '2026-11-15');
    expect(niedziela.odwolanieStatus).toBe('Pierwsza data minęła; ostatni dzień według art. 115 KC: 16 listopada 2026 r.');
    expect(niedziela.odwolanie).not.toContain('Nie zwlekaj');
  });
  it('zastrzeżenia (A-2): dzień po sobocie nie „Termin minął”, dwie daty i art. 110 KC', () => {
    const o = opisL4({ ...baza, dzien: '2026-11-05', protokol: '2026-11-07' }, DZIS);
    expect(o.zastrzezeniaStatus).toBe('Pierwsza data minęła; ostatni dzień według art. 115 KC: 16 listopada 2026 r.');
    expect(o.zastrzezenia).toMatch(/^Zdąż do 14 listopada 2026 r\.: 7 dni od otrzymania protokołu albo aneksu do niego\. 14 listopada 2026 r\. to sobota: według art\. 115 Kodeksu cywilnego ostatni dzień to 16 listopada 2026 r\. Ustawa zasiłkowa nie mówi, jak liczyć ten termin.*\(art\. 110 Kodeksu cywilnego\)/);
    expect(o.zastrzezenia).not.toContain('r..');
    const wigilia = opisL4({ ...baza, od: '2026-12-01', do: '2026-12-20', dzien: '2026-12-10', protokol: '2026-12-17' }, '2026-12-20');
    expect(wigilia.zastrzezenia).toMatch(/^Zdąż do 24 grudnia 2026 r\.: 7 dni.*ostatni dzień to 28 grudnia 2026 r\. Ustawa/);
    expect(wigilia.zastrzezeniaStatus).toBe('Zostały 4 dni');
  });
  it('odwołanie (A-5): przy zasiłku od pracodawcy po kontroli rozstrzyga ZUS, wniosek z art. 63 tylko przy odmowie', () => {
    const o = opisL4(baza, DZIS);
    expect(o.odwolanie).not.toContain('decyzję ZUS dostaniesz po wniosku');
    expect(o.odwolanie).toContain('art. 68 ust. 1e');
  });
  it('praca w drugiej firmie przy zwolnieniu sprzed 1.01.2027 r. (A-4): warunek o dacie wystawienia', () => {
    const przelom = opisL4({ ...baza, czynnosc: 'inna-praca', od: '2026-12-20', do: '2027-01-10', dzien: '2027-01-05' }, '2027-01-06');
    expect(przelom.warunki[0]).toContain('zaczęło się przed 1 stycznia 2027 r.');
    const nowe = opisL4({ ...baza, czynnosc: 'inna-praca', od: '2027-01-02', do: '2027-01-10', dzien: '2027-01-05' }, '2027-01-06');
    expect(nowe.warunki.some((w) => w.includes('zaczęło się przed 1 stycznia 2027 r.'))).toBe(false);
    // ocena() nie może zmieniać wspólnych danych: drugie wywołanie bez zdublowanego warunku.
    expect(opisL4({ ...baza, czynnosc: 'inna-praca', od: '2026-12-20', do: '2027-01-10', dzien: '2027-01-05' }, '2027-01-06').warunki.filter((w) => w.includes('zaczęło się')).length).toBe(1);
  });
  it('rejestr (A-8): nazwy dni wolnych mają podstawę w ustawie o dniach wolnych', () => {
    expect(NARZEDZIA.find((n) => n.slug === 'co-wolno-na-l4')!.przepisy).toContain('dniWolne');
  });
  it('zastrzeżenia: druga data tylko wtedy, gdy termin wypada w dzień wolny', () => {
    expect(opisL4({ ...baza, protokol: '2026-11-14' }, DZIS).zastrzezenia).toContain('21 listopada 2026 r. to sobota: według art. 115 Kodeksu cywilnego ostatni dzień to 23 listopada 2026 r.');
    expect(opisL4({ ...baza, protokol: '2026-11-10' }, DZIS).zastrzezenia).not.toContain('art. 115');
  });
  it('protokół sprzed 13.04.2026: dawna kontrola, bez terminu 7 dni', () => {
    const o = opisL4({ ...baza, od: '2026-03-01', do: '2026-03-20', dzien: '2026-03-05', protokol: '2026-03-10' }, DZIS);
    expect(o.zastrzezeniaStatus).toBeNull();
    expect(o.zastrzezenia).toMatch(/^Protokół jest sprzed 13 kwietnia 2026 r\.: termin 7 dni z art\. 68e ust\. 4 nie dotyczy/);
    expect(o.kontrola).toHaveLength(1);
    expect(o.kontrola[0]).toContain('lekarza leczącego');
    const nowa = opisL4({ ...baza, od: '2026-03-01', do: '2026-03-20', dzien: '2026-03-05', protokol: '2026-04-13' }, DZIS);
    expect(nowa.zastrzezenia).toMatch(/^Zastrzeżenia składasz najpóźniej 20 kwietnia 2026 r\./);
    expect(nowa.kontrola.length).toBeGreaterThan(3);
  });
  it('kontrola pracodawcy: wynagrodzenie (ust. 1d) osobno od zasiłku (ust. 1a), wyjazd z decyzją z art. 59 ust. 10', () => {
    expect(opisL4({ ...baza, kontrola: 'pracodawca' }, DZIS).kontrola[0]).toMatch(/^Każdy pracodawca może kontrolować, gdy płaci Ci wynagrodzenie chorobowe \(art\. 68 ust\. 1d/);
    expect(opisL4({ ...baza, czynnosc: 'wyjazd' }, DZIS).warunki.join(' ')).toContain('art. 59 ust. 6 i 10');
    expect(ocena('inna-praca', 'od2027', 'chodzic').warunki.join(' ')).toContain('umowie o dzieło');
  });
  it('termin bez przesunięcia: jedna data', () => {
    const o = opisL4({ ...baza, dzien: '2026-11-04', decyzja: '2026-11-04' }, DZIS);
    expect(o.odwolanie).toMatch(/^Zdąż do 4 grudnia 2026 r\.: miesiąc od doręczenia decyzji\. Odwołanie wnosisz/);
  });
  it('kontrola: pracodawca bez badania u orzecznika, dawne brzmienie z art. 42 i art. 39', () => {
    expect(opisL4({ ...baza, kontrola: 'pracodawca' }, DZIS).kontrola.join(' ')).not.toContain('lekarza orzecznika; zwraca');
    expect(opisL4({ ...baza, kontrola: 'zus' }, DZIS).kontrola.join(' ')).toContain('art. 59 ust. 3 pkt 1 i ust. 13');
    const dawne = opisL4({ ...baza, od: '2026-04-01', do: '2026-04-20', dzien: '2026-04-12' }, DZIS);
    expect(dawne.brzmienieTytul).toBe('Przepis w brzmieniu do 12 kwietnia 2026 r.');
    expect(dawne.kontrola.join(' ')).toContain('art. 42 ustawy z 18 grudnia 2025 r.');
    expect(dawne.uwagi.join(' ')).toContain('art. 39 ustawy z 18 grudnia 2025 r.');
    expect(opisL4({ ...baza, od: '2026-04-01', do: '2026-04-20', dzien: '2026-04-13' }, DZIS).uwagi.join(' ')).not.toContain('art. 39');
  });
});

describe('błędne dane', () => {
  it.each([
    [{ od: '2026-02-30' }, 'od'],
    [{ do: '' }, 'do'],
    [{ dzien: '1999-12-31' }, 'dzien'],
    [{ od: '2026-11-17' }, 'do'],
    [{ dzien: '2026-11-17' }, 'dzien'],
    [{ dzien: '2026-11-02' }, 'dzien'],
    [{ od: '2026-01-01', do: '2026-09-28', dzien: '2026-02-01' }, 'do'],
    [{ protokol: '2026-11-09' }, 'protokol'],
    [{ protokol: '2026-11-16' }, 'protokol'],
    [{ decyzja: '2026-13-01' }, 'decyzja'],
    [{ decyzja: '2026-11-16' }, 'decyzja'],
  ] as [Partial<DaneL4>, keyof DaneL4][])('%o → pole %s', (zmiana, pole) => {
    const b = bladL4({ ...baza, ...zmiana }, DZIS);
    expect(b?.pole).toBe(pole);
    expect(() => opisL4({ ...baza, ...zmiana }, DZIS)).toThrow(RangeError);
  });
  it('270 dni zwolnienia to jeszcze poprawne dane, protokół i decyzja z dziś też', () => {
    expect(bladL4({ ...baza, od: '2026-01-01', do: '2026-09-27', dzien: '2026-02-01' }, DZIS)).toBeNull();
    expect(bladL4({ ...baza, protokol: DZIS, decyzja: DZIS, dzien: '2026-11-10' }, DZIS)).toBeNull();
  });
  it('werdykt bez dat bierze brzmienie z dnia czynności albo z dziś', () => {
    expect(werdyktBezDat('polecenie', 'chodzic', 'nikt', '2026-04-12', DZIS).werdykt).toBe('Ryzyko utraty zasiłku');
    expect(werdyktBezDat('polecenie', 'chodzic', 'nikt', '', DZIS).werdykt).toBe('Nie wolno, także na polecenie');
    expect(werdyktBezDat('inna-praca', 'chodzic', 'nikt', '', '2027-01-05').werdykt).toBe('Tylko bez zwolnienia z tej pracy');
  });
});

describe('wyszukiwarka serwisu: frazy z podpowiedzi Google prowadzą do narzędzia', () => {
  it.each(['czy na l4 można wychodzić z domu', 'czy na L4 można pracować', 'praca na L4 u innego pracodawcy', 'kontrola ZUS L4', 'wyjazd na L4', 'chory może chodzić', 'chory powinien leżeć', 'odwołanie od decyzji ZUS', 'siłownia na L4', 'sport na L4', 'remont na L4', 'spacer na L4', 'maile na L4', 'maile na zwolnieniu lekarskim', 'praca na zwolnieniu lekarskim'])('„%s” → pierwsze miejsce', async (q) => {
    const { przygotuj, szukaj } = await import('../szukaj-narzedzi');
    const { indeksNarzedzi } = await import('../indeks-narzedzi');
    expect(szukaj(przygotuj(indeksNarzedzi()), q, 1)[0]?.wpis.s).toBe('co-wolno-na-l4');
  });
});

describe('wyszukiwarka: hasła nie zabierają innych spraw (audyt jakosc4, A-6)', () => {
  it.each([
    ['wypadek na imprezie firmowej', 'odszkodowanie-za-wypadek-przy-pracy'],
    ['wypadek na siłowni', 'odszkodowanie-za-wypadek-przy-pracy'],
    ['zlecenie na L4', 'zasilek-chorobowy-na-zleceniu'],
    ['badania kontrolne po L4', 'badania-lekarskie-w-pracy'],
    ['spacer w przerwie', 'przerwy-w-pracy'],
  ])('„%s” → %s', async (q, slug) => {
    const { przygotuj, szukaj } = await import('../szukaj-narzedzi');
    const { indeksNarzedzi } = await import('../indeks-narzedzi');
    expect(szukaj(przygotuj(indeksNarzedzi()), q, 1)[0]?.wpis.s).toBe(slug);
  });
});

describe('typografia wszystkich wyników', () => {
  it('żaden tekst nie ma „r..”, podwójnej spacji ani pustego nawiasu', () => {
    const kontrole = ['nikt', 'zus', 'pracodawca'] as const;
    for (const c of Object.keys(CZYNNOSCI) as Czynnosc[])
      for (const [od, do_, dzien] of [['2026-04-01', '2026-04-20', '2026-04-12'], ['2026-10-01', '2026-10-14', '2026-10-05'], ['2027-01-01', '2027-01-10', '2027-01-02']])
        for (const k of kontrole)
          for (const wskazanie of ['chodzic', 'lezec'] as const)
            for (const [protokol, decyzja, dzis] of [['', '', DZIS], ['2026-10-10', '2026-10-11', '2026-11-12'], ['2026-10-14', '2026-10-31', DZIS], ['2027-01-09', '2027-01-30', '2027-02-02']]) {
              if ((protokol && protokol < dzien) || (decyzja && decyzja < dzien)) continue;
              const o = opisL4({ czynnosc: c, wskazanie, kontrola: k, od, do: do_, dzien, protokol, decyzja }, dzis);
              for (const t of [o.werdykt, o.werdyktOpis, o.skutek, o.zastrzezenia, o.odwolanie, ...o.warunki, ...o.kontrola, ...o.uwagi, ...o.cytaty]) {
                expect(t).not.toMatch(/r\.\.|\s{2}|\(\)|\.\./);
                expect(t).not.toMatch(/łeś|łaś/);
              }
            }
  });
});

// Linijka praktyczna (pakiet „terminy3”, daty z raporty/terminy3/linijka.py; raporty/terminy3/PRZEPISY.md, pyt. 3–4).
describe('terminy3: zastrzeżenia i odwołanie w dzień wolny', () => {
  const sp = (t: string) => t.replace(/\s/g, ' ');
  it('odwołanie do ZUS do niedzieli 13 grudnia 2026 r.: nadanie w Poczcie Polskiej do oddziału ZUS', () => {
    const o = opisL4({ ...baza, protokol: '2026-11-10', decyzja: '2026-11-13' }, DZIS);
    expect(sp(o.odwolaniePraktycznie)).toBe(
      'To niedziela. Tego dnia możesz jeszcze nadać odwołanie w placówce Poczty Polskiej (operatora wyznaczonego), jeśli jest czynna, zaadresowane do oddziału ZUS, który wydał decyzję: sądy uznają wtedy dzień nadania za dzień wniesienia odwołania (art. 165 § 2 Kodeksu postępowania cywilnego). Zachowaj potwierdzenie nadania; list u kuriera tego skutku nie ma.',
    );
    expect(o.zastrzezeniaPraktycznie).toBe('');
  });
  it('zastrzeżenia do Wigilii: złóż w środę 23 grudnia, bo nie wiadomo, czy wystarczy nadanie', () => {
    const w = opisL4({ ...baza, od: '2026-12-01', do: '2026-12-20', dzien: '2026-12-10', protokol: '2026-12-17' }, '2026-12-20');
    expect(sp(w.zastrzezeniaPraktycznie)).toBe(
      'To dzień wolny od pracy (Wigilia Bożego Narodzenia). Jeśli tego dnia nie da się ich złożyć osobiście, bezpieczniej złóż zastrzeżenia najpóźniej w ostatnim dniu roboczym przed tą datą, czyli w środę 23 grudnia 2026 r.: ustawa nie mówi, czy wystarczy nadanie na poczcie, więc bezpieczniej, żeby dotarły w terminie.',
    );
  });
  it('po dniu „zdąż do” bez linijki (status mówi o dniu z art. 115 KC); bez daty bez linijki', () => {
    expect(opisL4({ ...baza, dzien: '2026-11-05', protokol: '2026-11-07' }, DZIS).zastrzezeniaPraktycznie).toBe('');
    const pazdz = { ...baza, od: '2026-10-01', do: '2026-10-14', dzien: '2026-10-05', decyzja: '2026-10-11' };
    expect(opisL4(pazdz, '2026-11-11').odwolaniePraktycznie).toMatch(/^To dzień wolny od pracy \(Narodowe Święto Niepodległości\)\. Tego dnia/);
    expect(opisL4(pazdz, '2026-11-12').odwolaniePraktycznie).toBe('');
    expect(opisL4(baza, DZIS)).toMatchObject({ zastrzezeniaPraktycznie: '', odwolaniePraktycznie: '' });
  });
});
