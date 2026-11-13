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
    expect(zKoduStrony('<X\n  tytul={`Płaca minimalna ${rok}: sprawdź`}\n/>', 2027).tytul).toBe('Płaca minimalna 2027: sprawdź');
  });

  it('każde narzędzie ma w indeksie tytuł strony (także z szablonu z rokiem)', () => {
    expect(indeks.filter((w) => !w.t).map((w) => w.s)).toEqual([]);
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
  // Każde zapytanie to dosłowna podpowiedź wyszukiwarki Google (pl, 2026-11-13; frazy bazowe i podpowiedzi w raporcie
  // pakietu „wyszukiwarka”), a nie kopia hasła z src/data/sprawy.ts: test sprawdza, czy człowiek trafi do narzędzia,
  // a nie tylko, czy hasło działa. Oczekiwane narzędzie musi być w pierwszej trójce.
  it.each([
    ['ile za sobotę w pracy', 'praca-w-sobote'],
    ['praca w sobotę 50 czy 100', 'praca-w-sobote'],
    ['praca w sobotę a odbiór dnia wolnego', 'praca-w-sobote'],
    ['ile nadgodzin za sobotę', 'praca-w-sobote'],
    ['zwrot podatku ile sie czeka', 'zwrot-podatku-pit-37'],
    ['pit 37 a pit 11', 'zwrot-podatku-pit-37'],
    ['rozliczenie pit z żoną która nie pracuje', 'zwrot-podatku-pit-37'],
    ['praca na wysokości od ilu metrów', 'praca-na-wysokosci'],
    ['badania wysokościowe od ilu metrów', 'praca-na-wysokosci'],
    ['praca na drabinie powyżej 2 metrów', 'praca-na-wysokosci'],
    ['emerytura pomostowa dla kogo', 'emerytura-pomostowa'],
    ['pomostówka w jakim wieku', 'emerytura-pomostowa'],
    ['praca w szczególnych warunkach a emerytura', 'emerytura-pomostowa'],
    ['kod 95 stracił ważność', 'kod-95'],
    ['świadectwo kwalifikacji zawodowej kod 95', 'kod-95'],
    ['zespół cieśni nadgarstka czy to choroba zawodowa', 'choroba-zawodowa'],
    ['ubytek słuchu choroba zawodowa', 'choroba-zawodowa'],
    ['psychotesty dla kierowców co ile lat', 'badania-kierowcy'],
    ['badania kierowcy zawodowego co ile lat', 'badania-kierowcy'],
    ['badania kontrolne po l4 po ilu dniach', 'badania-lekarskie-w-pracy'],
    ['badania okresowe dzień wolny', 'badania-lekarskie-w-pracy'],
    ['badania wstępne do pracy czy przysługuje dzień wolny', 'badania-lekarskie-w-pracy'],
    ['posiłek regeneracyjny w pracy kiedy przysługuje', 'posilki-profilaktyczne'],
    ['kiedy pracownikowi przysługuje darmowy posiłek w pracy', 'posilki-profilaktyczne'],
    ['ekwiwalent za pranie odzieży roboczej', 'odziez-robocza'],
    ['ekwiwalent za pranie umowa zlecenie', 'odziez-robocza'],
    ['obniżenie wynagrodzenia bez zgody pracownika', 'wypowiedzenie-zmieniajace'],
    ['wypowiedzenie zmieniające a odprawa', 'wypowiedzenie-zmieniajace'],
    ['umowa na zastępstwo jaki okres wypowiedzenia', 'umowa-na-zastepstwo'],
    ['umowa na czas nieobecności pracownika', 'umowa-na-zastepstwo'],
    ['pensja po l4 kalkulator', 'wynagrodzenie-za-niepelny-miesiac'],
    ['wypłata za niepełny miesiąc', 'wynagrodzenie-za-niepelny-miesiac'],
    ['l4 w pierwszym miesiącu pracy', 'okres-wyczekiwania'],
    ['l4 na zleceniu ile płatne', 'zasilek-chorobowy-na-zleceniu'],
    ['umowa zlecenie l4 kto płaci', 'zasilek-chorobowy-na-zleceniu'],
    ['wczasy pod gruszą ile dni urlopu trzeba wziąć', 'swiadczenie-urlopowe'],
    ['dofinansowanie do urlopu wypoczynkowego', 'swiadczenie-urlopowe'],
    ['urlop bezpłatny a ubezpieczenie zdrowotne', 'urlop-bezplatny'],
    ['urlop bezpłatny a staż pracy', 'urlop-bezplatny'],
    ['urlop z zeszłego roku do kiedy wykorzystać', 'zalegly-urlop'],
    ['czy zaległy urlop przepada po 30 września', 'zalegly-urlop'],
    ['urlop na wypowiedzeniu czy pracodawca może odmówić', 'urlop-w-okresie-wypowiedzenia'],
    ['przymusowy urlop w okresie wypowiedzenia', 'urlop-w-okresie-wypowiedzenia'],
    ['urlop na żądanie w 12 godzinnym systemie pracy', 'urlop-w-godzinach'],
    ['urlop szkoleniowy na studia podyplomowe', 'urlop-szkoleniowy'],
    ['studia zaoczne a urlop szkoleniowy', 'urlop-szkoleniowy'],
    ['zezwolenie na pracę dla cudzoziemca', 'praca-cudzoziemca'],
    ['praca ukraińca w polsce', 'praca-cudzoziemca'],
    ['ile dni na zgłoszenie ukraińca do pup', 'zgloszenie-pracy-cudzoziemca'],
    ['powiadomienie o powierzeniu pracy obywatelowi ukrainy', 'zgloszenie-pracy-cudzoziemca'],
    ['wyjście prywatne w czasie pracy', 'odpracowanie-wyjscia-prywatnego'],
    ['wcześniejsze wyjście z pracy a odpracowanie', 'odpracowanie-wyjscia-prywatnego'],
    ['wcześniejsze przyjście do pracy nadgodziny', 'doba-pracownicza'],
    ['nadgodziny w tej samej dobie', 'doba-pracownicza'],
    ['praca po 12 godzin ile wolnego', 'rownowazny-czas-pracy'],
    ['system 12 godzinny grafik', 'rownowazny-czas-pracy'],
    ['praca powyżej 48 godzin tygodniowo', 'nadgodziny-sredniotygodniowe'],
    ['ile można dorobić do renty 2026', 'dorabianie-do-renty'],
    ['limit dorabiania do emerytury', 'dorabianie-do-renty'],
    ['ulga na dziecko ile wynosi', 'ulga-na-dzieci'],
    ['ulga prorodzinna limit dochodu', 'ulga-na-dzieci'],
    ['pit dla młodych do kiedy', 'zerowy-pit'],
    ['ulga dla pracujących seniorów', 'zerowy-pit'],
    ['renta ile lat pracy minimum', 'renta-z-tytulu-niezdolnosci-do-pracy'],
    ['renta po wypadku w pracy', 'renta-z-tytulu-niezdolnosci-do-pracy'],
    ['przedemerytalne dla mężczyzn', 'swiadczenie-przedemerytalne'],
    ['zasiłek przedemerytalny warunki', 'swiadczenie-przedemerytalne'],
    ['zwolnienie przed emeryturą okres ochronny', 'ochrona-przedemerytalna'],
    ['przerwa kierowcy po 4.5 godzinach jazdy', 'czas-jazdy-kierowcy'],
    ['odpoczynek tygodniowy kierowcy jak liczyć', 'czas-jazdy-kierowcy'],
    ['czas pracy kierowcy tabela', 'czas-jazdy-kierowcy'],
    ['ile może jechać kierowca zawodowy', 'czas-jazdy-kierowcy'],
    ['czy dyżur kierowcy wlicza się do czasu pracy', 'dyzur-kierowcy'],
    ['uprawnienia adr na ile lat', 'zaswiadczenie-adr'],
    ['kurs adr przedłużenie', 'zaswiadczenie-adr'],
    ['uprawnienia sep do kiedy ważne', 'waznosc-uprawnien-sep'],
    ['sep g1 ważność', 'waznosc-uprawnien-sep'],
    ['czy na paleciak elektryczny trzeba mieć uprawnienia', 'czy-potrzebne-uprawnienia-udt'],
    ['zwyżka nożycowa uprawnienia', 'czy-potrzebne-uprawnienia-udt'],
    ['przeniesienie na inne stanowisko a wynagrodzenie', 'dodatek-wyrownawczy'],
    ['ile czasu na zgłoszenie do zus nowego pracownika', 'informacja-o-warunkach-zatrudnienia'],
    ['12 godzin pracy ile przerwy', 'przerwy-w-pracy'],
  ])('„%s” → %s w pierwszej trójce', (q, slug) => {
    expect(wsrod(q)).toContain(slug);
  });

  it('najczęstsze sprawy zostają na pierwszym miejscu mimo haseł nowych narzędzi', () => {
    for (const [q, slug] of [['L4', 'kalkulator-l4'], ['urlop', 'kalkulator-urlopu'], ['nocki', 'dodatek-za-prace-w-nocy'], ['uprawnienia na wózek', 'waznosc-uprawnien-udt'], ['ile dostanę na L4', 'kalkulator-l4'], ['niewykorzystany urlop', 'ekwiwalent-za-urlop'], ['czas pracy kierowcy', 'czas-jazdy-kierowcy'], ['zwolnienie przed emeryturą okres ochronny', 'ochrona-przedemerytalna']]) expect(pierwszy(q), q).toBe(slug);
  });

  it('podpowiedzi o innej sprawie nie prowadzą na pierwszym miejscu do narzędzia, które na nią nie odpowiada', () => {
    // wyrównanie zaległej pensji to nie dodatek wyrównawczy; fundusz socjalny to nie świadczenie urlopowe;
    // kierowca zawodowy pyta o czas jazdy, a nie o kod 95.
    expect(pierwszy('wyrównanie wynagrodzenia')).not.toBe('dodatek-wyrownawczy');
    expect(pierwszy('fundusz socjalny ile na pracownika')).not.toBe('swiadczenie-urlopowe');
    expect(pierwszy('ile może jechać kierowca zawodowy')).toBe('czas-jazdy-kierowcy');
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
