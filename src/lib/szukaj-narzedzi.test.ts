import { describe, expect, it } from 'vitest';
import { normalizuj, pasuje, przygotuj, slowa, szukaj } from './szukaj-narzedzi';
import { indeksNarzedzi, zKoduStrony } from './indeks-narzedzi';
import { NARZEDZIA } from '../data/narzedzia';
import { HASLA } from '../data/sprawy';

const indeks = indeksNarzedzi();
const p = przygotuj(indeks);
const pierwszy = (q: string) => szukaj(p, q)[0]?.wpis.s;
const wsrod = (q: string, ile = 3) => szukaj(p, q, ile).map((w) => w.wpis.s);

describe('wyszukiwarka narzędzi: tekst', () => {
  it('bez polskich znaków i znaków przestankowych', () => {
    expect(normalizuj('Ciąża, ŻŁÓBEK i „L4”!')).toBe('ciaza zlobek i l4');
  });

  it('pomija słowa bez treści, ale nie zostawia pustego zapytania', () => {
    expect(slowa('Ile mi się należy za nadgodziny?')).toEqual(['nalezy', 'nadgodziny']);
    expect(slowa('ile')).toEqual(['ile']);
  });

  it('odmiana przez wspólny początek; krótkie skróty tylko od początku', () => {
    for (const [a, b] of [['urlopu', 'urlop'], ['ciazy', 'ciaza'], ['zwolnienia', 'zwolnienie'], ['nadgo', 'nadgodziny'], ['l4', 'l4']]) expect(pasuje(a, b), `${a}~${b}`).toBe(true);
    for (const [a, b] of [['urlop', 'umowa'], ['bhp', 'abhp'], ['pracy', 'pracodawca'], ['ciazy', 'ciagly']]) expect(pasuje(a, b), `${a}≁${b}`).toBe(false);
  });
});

describe('wyszukiwarka narzędzi: indeks z rejestru i stron', () => {
  it('każde narzędzie z rejestru jest w indeksie, z pytaniami z FAQ', () => {
    expect(indeks.map((w) => w.s)).toEqual(NARZEDZIA.map((n) => n.slug));
    const bezPytan = indeks.filter((w) => w.p.length < 3).map((w) => w.s);
    expect(bezPytan).toEqual([]);
  });

  it('pytania z szablonów dostają bieżący rok, a znaki ucieczki znikają', () => {
    const { pytania, tytul } = zKoduStrony("const faq = [{ pytanie: `Ile wynosi płaca w ${rok} r.?` }, { pytanie: 'Czy pracodawca może \\'cofnąć\\' urlop?' }];\n<X tytul=\"Tytuł strony\" />", 2027);
    expect(pytania).toEqual(['Ile wynosi płaca w 2027 r.?', "Czy pracodawca może 'cofnąć' urlop?"]);
    expect(tytul).toBe('Tytuł strony');
  });

  it('hasła z hali wskazują istniejące narzędzia', () => {
    const slugi = new Set(NARZEDZIA.map((n) => n.slug));
    expect(Object.keys(HASLA).filter((s) => !slugi.has(s))).toEqual([]);
  });
});

describe('wyszukiwarka narzędzi: trafność na pytaniach ludzi z hali', () => {
  it.each([
    ['nadgodziny', 'kalkulator-nadgodzin'],
    ['L4', 'kalkulator-l4'],
    ['ile dostanę na chorobowym', 'kalkulator-l4'],
    ['na rękę', 'brutto-netto'],
    ['urlopu', 'kalkulator-urlopu'],
    ['nocki', 'dodatek-za-prace-w-nocy'],
    ['wózek widłowy uprawnienia', 'waznosc-uprawnien-udt'],
    ['alkomat', 'kontrola-trzezwosci'],
    ['ile kg', 'ile-kg-wolno-dzwigac'],
    ['upał na hali', 'temperatura-w-pracy'],
    ['wypowiedzenie', 'okres-wypowiedzenia'],
    ['najnizsza krajowa', 'placa-minimalna'],
  ])('„%s” → %s w pierwszej trójce', (q, slug) => {
    expect(wsrod(q)).toContain(slug);
  });

  it('nazwa narzędzia wygrywa z przypadkowym słowem w pytaniu', () => {
    expect(pierwszy('kalkulator nadgodzin')).toBe('kalkulator-nadgodzin');
    expect(pierwszy('przerwy')).toBe('przerwy-w-pracy');
  });

  it('trafienie w pytaniu z FAQ pokazuje to pytanie pod nazwą', () => {
    const w = szukaj(p, 'kto płaci za L4').find((x) => x.wpis.s === 'kalkulator-l4');
    expect(w?.pytanie).toMatch(/Kto płaci za L4/);
  });

  it('słowo nieznane żadnemu narzędziu nie blokuje wyników („szef”)', () => {
    expect(wsrod('szef nie płaci za nadgodziny', 5)).toContain('kalkulator-nadgodzin');
  });

  it('bez trafienia: pusta lista; puste zapytanie: pusta lista', () => {
    expect(szukaj(p, 'kangur')).toEqual([]);
    expect(szukaj(p, '   ')).toEqual([]);
  });
});

describe('dane strony głównej', async () => {
  const { NAJCZESTSZE, SLOWA_KATEGORII } = await import('../data/sprawy');
  const { KATEGORIE } = await import('../data/narzedzia');
  it('najczęstsze sprawy wskazują istniejące narzędzia, bez powtórzeń', () => {
    const slugi = new Set(NARZEDZIA.map((n) => n.slug));
    expect(NAJCZESTSZE.filter((s) => !slugi.has(s.slug))).toEqual([]);
    expect(new Set(NAJCZESTSZE.map((s) => s.slug)).size).toBe(NAJCZESTSZE.length);
  });
  it('każda kategoria z rejestru ma słowa z hali', () => {
    expect(Object.keys(SLOWA_KATEGORII).sort()).toEqual(Object.keys(KATEGORIE).sort());
  });
  it('pytanie z najczęstszych spraw prowadzi wyszukiwarkę do tego samego narzędzia', () => {
    for (const s of NAJCZESTSZE) expect(wsrod(s.pytanie, 5), s.pytanie).toContain(s.slug);
  });
});
