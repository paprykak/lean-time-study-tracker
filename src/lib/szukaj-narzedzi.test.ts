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

  it('hasło z hali dokładnie pasujące wygrywa z odmianą w nazwie innego narzędzia', () => {
    expect(pierwszy('nocki')).toBe('dodatek-za-prace-w-nocy');
    expect(pierwszy('urlop')).toBe('kalkulator-urlopu');
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

describe('wyszukiwarka narzędzi: zestaw zapytań z hali', () => {
  // Zapytania w brzmieniu z podpowiedzi wyszukiwarki Google (pl, listopad 2026), nie wymyślone pod wynik: ludzie tak
  // pytają o te sprawy. Oczekiwane narzędzie musi być w pierwszej trójce. Ostatnie pozycje pilnują, żeby hasła nowych
  // narzędzi nie wypchnęły najczęstszych spraw (L4, urlop, nocki, wózek, przerwy).
  it.each([
    ['ile za sobotę', 'praca-w-sobote'],
    ['praca w sobotę 50 czy 100', 'praca-w-sobote'],
    ['wolne za sobotę', 'praca-w-sobote'],
    ['nadgodziny za sobotę', 'praca-w-sobote'],
    ['zwrot podatku ile', 'zwrot-podatku-pit-37'],
    ['kiedy zwrot podatku', 'zwrot-podatku-pit-37'],
    ['rozliczenie pit z żoną', 'zwrot-podatku-pit-37'],
    ['od ilu metrów wysokość', 'praca-na-wysokosci'],
    ['badania wysokościowe', 'praca-na-wysokosci'],
    ['praca na drabinie powyżej 2 metrów', 'praca-na-wysokosci'],
    ['emerytura pomostowa magazyn', 'emerytura-pomostowa'],
    ['pomostówka dla kogo', 'emerytura-pomostowa'],
    ['praca w szczególnych warunkach a emerytura', 'emerytura-pomostowa'],
    ['kod 95 do kiedy', 'kod-95'],
    ['kod 95 odnowienie', 'kod-95'],
    ['cieśń nadgarstka choroba zawodowa', 'choroba-zawodowa'],
    ['ubytek słuchu choroba zawodowa', 'choroba-zawodowa'],
    ['psychotesty co ile lat', 'badania-kierowcy'],
    ['badania kierowcy zawodowego', 'badania-kierowcy'],
    ['badania kontrolne po L4', 'badania-lekarskie-w-pracy'],
    ['dzień wolny na badania okresowe', 'badania-lekarskie-w-pracy'],
    ['medycyna pracy', 'badania-lekarskie-w-pracy'],
    ['posiłek regeneracyjny', 'posilki-profilaktyczne'],
    ['darmowy posiłek w pracy', 'posilki-profilaktyczne'],
    ['ekwiwalent za pranie', 'odziez-robocza'],
    ['buty robocze', 'odziez-robocza'],
    ['obniżka pensji', 'wypowiedzenie-zmieniajace'],
    ['zmiana warunków pracy i płacy', 'wypowiedzenie-zmieniajace'],
    ['umowa na zastępstwo w ciąży', 'umowa-na-zastepstwo'],
    ['pensja po L4', 'wynagrodzenie-za-niepelny-miesiac'],
    ['pierwsza wypłata w nowej pracy', 'wynagrodzenie-za-niepelny-miesiac'],
    ['L4 w pierwszym miesiącu pracy', 'okres-wyczekiwania'],
    ['L4 na zleceniu', 'zasilek-chorobowy-na-zleceniu'],
    ['wczasy pod gruszą', 'swiadczenie-urlopowe'],
    ['fundusz socjalny', 'swiadczenie-urlopowe'],
    ['urlop bezpłatny a ZUS', 'urlop-bezplatny'],
    ['urlop z zeszłego roku do kiedy', 'zalegly-urlop'],
    ['czy niewykorzystany urlop przepada', 'zalegly-urlop'],
    ['urlop na wypowiedzeniu', 'urlop-w-okresie-wypowiedzenia'],
    ['urlop przy 12 godzinach', 'urlop-w-godzinach'],
    ['urlop na studia', 'urlop-szkoleniowy'],
    ['zezwolenie na pracę', 'praca-cudzoziemca'],
    ['praca dla Ukraińca', 'praca-cudzoziemca'],
    ['zgłoszenie Ukraińca do PUP', 'zgloszenie-pracy-cudzoziemca'],
    ['wyjście prywatne', 'odpracowanie-wyjscia-prywatnego'],
    ['wcześniejsze wyjście z pracy a odpracowanie', 'odpracowanie-wyjscia-prywatnego'],
    ['wcześniejsze przyjście do pracy nadgodziny', 'doba-pracownicza'],
    ['praca po 12 godzin', 'rownowazny-czas-pracy'],
    ['system weekendowy', 'rownowazny-czas-pracy'],
    ['ile można dorobić do renty', 'dorabianie-do-renty'],
    ['limit dorabiania do emerytury', 'dorabianie-do-renty'],
    ['ulga na dziecko ile', 'ulga-na-dzieci'],
    ['ulga prorodzinna', 'ulga-na-dzieci'],
    ['pit dla młodych', 'zerowy-pit'],
    ['do 26 roku życia podatek', 'zerowy-pit'],
    ['renta ile lat pracy', 'renta-z-tytulu-niezdolnosci-do-pracy'],
    ['renta chorobowa', 'renta-z-tytulu-niezdolnosci-do-pracy'],
    ['zasiłek przedemerytalny', 'swiadczenie-przedemerytalne'],
    ['tachograf', 'czas-jazdy-kierowcy'],
    ['przerwa kierowcy po 4,5 godzinach', 'czas-jazdy-kierowcy'],
    ['podwójna obsada', 'dyzur-kierowcy'],
    ['czy dyżur kierowcy wlicza się do czasu pracy', 'dyzur-kierowcy'],
    ['adr przedłużenie', 'zaswiadczenie-adr'],
    ['towary niebezpieczne', 'zaswiadczenie-adr'],
    ['uprawnienia sep do kiedy ważne', 'waznosc-uprawnien-sep'],
    ['elektryk uprawnienia', 'waznosc-uprawnien-sep'],
    ['czy na paleciak trzeba mieć uprawnienia', 'czy-potrzebne-uprawnienia-udt'],
    ['zwyżka uprawnienia', 'czy-potrzebne-uprawnienia-udt'],
    ['przeniesienie na inne stanowisko a wynagrodzenie', 'dodatek-wyrownawczy'],
    ['praca bez umowy', 'informacja-o-warunkach-zatrudnienia'],
    ['48 godzin tygodniowo', 'nadgodziny-sredniotygodniowe'],
    ['L4', 'kalkulator-l4'],
    ['urlop', 'kalkulator-urlopu'],
    ['nocki', 'dodatek-za-prace-w-nocy'],
    ['uprawnienia na wózek', 'waznosc-uprawnien-udt'],
    ['12 godzin pracy ile przerwy', 'przerwy-w-pracy'],
    ['ile dostanę na L4', 'kalkulator-l4'],
    ['niewykorzystany urlop', 'ekwiwalent-za-urlop'],
    ['dyżur', 'dyzur-w-pracy'],
    ['emerytura', 'ochrona-przedemerytalna'],
  ])('„%s” → %s w pierwszej trójce', (q, slug) => {
    expect(wsrod(q)).toContain(slug);
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
