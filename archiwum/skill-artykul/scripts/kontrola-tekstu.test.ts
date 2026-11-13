import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { bloki, fogPl, kontrolaTekstu, PROGI, sylaby, zdania, zmiennosc } from './kontrola-tekstu.mjs';
import { frontmatter } from './mapa.mjs';

const ZRODLA = [{ opis: 'GUS, Rocznik statystyczny przemysłu', adres: 'https://stat.gov.pl', rodzaj: 'Dane publiczne' }];
const sprawdz = (body: string, fm: Record<string, unknown> = { zrodla: ZRODLA }) => kontrolaTekstu({ body, frontmatter: fm });

describe('kontrola tekstu: przypisy i źródła', () => {
  it('poprawny tekst: liczba z przypisem, źródło zacytowane', () => {
    expect(sprawdz('Przetwórstwo daje 18,5% wartości dodanej [1].').bledy).toEqual([]);
  });

  it('przypis bez źródła i źródło bez przypisu to błędy', () => {
    const { bledy } = sprawdz('Zdanie z przypisem [2].');
    expect(bledy).toContain('przypis [2] nie ma źródła (lista „Źródła” ma 1 pozycji)');
    expect(bledy.some((b) => b.startsWith('źródło 1'))).toBe(true);
  });

  it('liczba bez źródła to błąd, chyba że to oznaczony przykład na danych fikcyjnych', () => {
    expect(sprawdz('Firmy tracą 30% czasu na przezbrojenia. [1] jest gdzie indziej.\n\nDrugi akapit [1].').bledy).toEqual([]);
    const bez = sprawdz('Firmy tracą 30% czasu na przezbrojenia.\n\nInny akapit [1].');
    expect(bez.bledy[0]).toMatch(/^liczba bez źródła: „Firmy tracą 30% czasu/);
    expect(sprawdz('Przykład na danych fikcyjnych: linia traci 30% czasu.\n\nAkapit [1].').bledy).toEqual([]);
  });

  it('tabelę z liczbami może opisać akapit przed nią (przypis albo fikcja)', () => {
    const tabela = '| Czynność | Udział |\n| --- | --- |\n| Czekanie | 40% |';
    expect(sprawdz(`Struktura strat w badaniu [1]:\n\n${tabela}`).bledy).toEqual([]);
    expect(sprawdz(`Struktura strat:\n\n${tabela}\n\nAkapit [1].`).bledy.some((b) => b.startsWith('liczba bez źródła'))).toBe(true);
  });

  it('przypisy zapisane przez panel z ukośnikami liczą się tak samo', () => {
    expect(sprawdz('Udział 18,5% \\[1\\].').bledy).toEqual([]);
  });
});

describe('kontrola tekstu: język', () => {
  it('frazy z tekstów generowanych to błąd, frazy podejrzane to uwaga', () => {
    const { bledy, uwagi } = sprawdz('Warto zauważyć, że synergia działa [1].');
    expect(bledy).toContain('fraza z tekstów generowanych: „warto zauważyć”');
    expect(uwagi.some((u) => u.includes('synergi'))).toBe(true);
  });

  it('miejsce do uzupełnienia blokuje tylko tekst do publikacji', () => {
    const body = 'Akapit [1]. [DO UZUPEŁNIENIA: przykład z praktyki]';
    expect(sprawdz(body, { zrodla: ZRODLA, szkic: true }).bledy).toEqual([]);
    expect(sprawdz(body, { zrodla: ZRODLA }).bledy).toContain('w tekście do publikacji zostało miejsce [DO UZUPEŁNIENIA]');
  });

  it('zdania: skróty nie dzielą zdania, koniec zdania po „r.” tak', () => {
    expect(zdania('Firmy, np. Toyota, mierzą czas. Dane z Dz. U. 2018 poz. 1914 są jawne.')).toHaveLength(2);
    expect(zdania('Badanie z 2023 r. Potem kolejne.')).toHaveLength(2);
    expect(zdania('Metodę opisał S. Shingo w 1985 r. i rozwinęli ją inni.')).toHaveLength(1);
  });

  it('sylaby i FOG-PL', () => {
    expect([sylaby('nie'), sylaby('operacji'), sylaby('przezbrojenie'), sylaby('kierownik')]).toEqual([1, 4, 4, 3]);
    expect(fogPl('Krótkie zdanie. Drugie też.')).toBeLessThan(5);
    expect(fogPl('Niewystarczająca standaryzacja przezbrojeń powoduje nieprzewidywalne opóźnienia produkcyjne.')).toBeGreaterThan(15);
  });

  it('bloki: rozpoznaje śródtytuł, listę, tabelę, cytat i obraz', () => {
    expect(bloki('## A\n\n- x\n\n| a |\n\n> c\n\n![o](p.png)\n\nTekst').map((b) => b.rodzaj)).toEqual(['naglowek', 'lista', 'tabela', 'cytat', 'obraz', 'akapit']);
  });
});

describe('kontrola tekstu: wnioski z badań i bezosobowe „uważa się”', () => {
  it('wniosek z badań bez przypisu to błąd; z przypisem albo w przykładzie fikcyjnym nie', () => {
    expect(sprawdz('Badania pokazują, że krótsze przezbrojenia zwiększają wydajność. Inne zdanie [1].').bledy[0]).toMatch(/^wniosek z badań bez przypisu: „Badania pokazują/);
    expect(sprawdz('Według ekspertów to działa. Zdanie [1].').bledy.some((b) => b.startsWith('wniosek z badań'))).toBe(true);
    expect(sprawdz('Badania pokazują, że krótsze przezbrojenia zwiększają wydajność [1].').bledy).toEqual([]);
    expect(sprawdz('Przykład na danych fikcyjnych: badanie czasu pokazało, że czekanie trwa najdłużej. Zdanie [1].').bledy).toEqual([]);
  });

  it('„uważa się” bez przypisu to uwaga', () => {
    expect(sprawdz('Uważa się, że SMED działa wszędzie. Zdanie [1].').uwagi.some((u) => u.includes('kto tak uważa'))).toBe(true);
    expect(sprawdz('Uważa się, że SMED działa wszędzie [1].').uwagi.some((u) => u.includes('kto tak uważa'))).toBe(false);
  });
});

describe('kontrola tekstu: styl', () => {
  const uwagi = (body: string, fm: Record<string, unknown> = { zrodla: ZRODLA }) => sprawdz(body, fm).uwagi;

  it('styl urzędowy i kalki z angielskiego to uwagi z podpowiedzią', () => {
    const u = uwagi('W celu dokonania analizy zespół posiada dane i dedykowany arkusz [1].');
    expect(u.some((x) => x.startsWith('styl: „W celu”'))).toBe(true);
    expect(u.some((x) => x.startsWith('styl: „dokonania”'))).toBe(true);
    expect(u.some((x) => x.startsWith('styl: „posiada”'))).toBe(true);
    expect(u.some((x) => x.startsWith('styl: „dedykowany”'))).toBe(true);
  });

  it('terminy branżowe, angielski w nawiasie i temat maila nie są uwagami stylu', () => {
    const u = uwagi('Realizacja zamówień i adresowanie lokalizacji (framework WMS) są proste. Napisz z tematem, w temacie wiadomości „Reklama”. Mamy dane [1].');
    expect(u.filter((x) => x.startsWith('styl:'))).toEqual([]);
  });

  it('„jest to” jest uwagą, „jest to samo” i „jest to, co” nie', () => {
    expect(uwagi('Jest to metoda Shingo [1].').some((x) => x.startsWith('styl: „Jest to”'))).toBe(true);
    expect(uwagi('Wynik jest to samo, a ważne jest to, co zostało [1].').some((x) => x.startsWith('styl:'))).toBe(false);
  });

  it('słowa nadużywane: uwaga dopiero powyżej limitu', () => {
    expect(uwagi('To kluczowy krok [1].').some((x) => x.startsWith('„kluczowy”'))).toBe(false);
    expect(uwagi('To kluczowy krok. To kluczowa miara [1].').some((x) => x.startsWith('„kluczowy” 2×'))).toBe(true);
  });

  it('frazy zakazane w tytule i leadzie też są błędem', () => {
    const fm = { zrodla: ZRODLA, tytul: 'Przezbrojenie w praktyce', lead: 'W dzisiejszych czasach każda minuta postoju kosztuje.' };
    expect(sprawdz('Zdanie [1].', fm).bledy).toContain('fraza z tekstów generowanych: „w dzisiejszych czasach”');
  });
});

describe('kontrola tekstu: konstrukcje typowe dla tekstów generowanych', () => {
  const uwagi = (body: string) => sprawdz(`${body}\n\nZdanie [1].`).uwagi;

  it('„nie tylko…, ale” i „to nie X, to Y” więcej niż raz', () => {
    expect(uwagi('Nie tylko skraca postój, ale też uczy zespół.').some((x) => x.includes('nie tylko'))).toBe(false);
    expect(uwagi('Nie tylko skraca postój, ale też uczy. Nie tylko oszczędza, lecz także porządkuje.').some((x) => x.includes('nie tylko'))).toBe(true);
    expect(uwagi('To nie jest problem maszyny. To problem przygotowania. Nie chodzi o szybkość, lecz o kolejność.').some((x) => x.startsWith('kontrast'))).toBe(true);
  });

  it('pytanie z natychmiastową odpowiedzią', () => {
    expect(uwagi('Dlaczego maszyna stoi? Bo nikt nie przywiózł matrycy.').some((x) => x.startsWith('pytanie z natychmiastową'))).toBe(true);
    expect(uwagi('Dlaczego maszyna stoi? Pomiar pokazał, że czeka na matrycę.').some((x) => x.startsWith('pytanie z natychmiastową'))).toBe(false);
  });

  it('trzy zdania z rzędu od tego samego słowa', () => {
    expect(uwagi('Operator czeka. Operator szuka klucza. Operator dzwoni po ustawiacza.').some((x) => x.startsWith('trzy zdania z rzędu zaczynają się od „operator”'))).toBe(true);
  });

  it('śródtytuły: dwukropek i etykieta to uwagi; „W skrócie” i kroki poradnika nie', () => {
    const u = uwagi('## SMED: jak zacząć\n\nTekst.\n\n## Wyzwania\n\nTekst.\n\n## W skrócie\n\nTekst.\n\n## Krok 2: oddziel czynności wewnętrzne\n\nTekst.');
    expect(u.filter((x) => x.startsWith('śródtytuł'))).toEqual(['śródtytuł z dwukropkiem „SMED: jak zacząć”: jedno zdanie-wniosek', 'śródtytuł-etykieta „Wyzwania”: napisz wniosek']);
  });

  it('pogrubienia w akapitach (bez etykiet „W skrócie”) i nadmiar list', () => {
    expect(uwagi('**Problem.** Maszyna stoi.\n\n**Dlaczego.** Czeka.\n\n**Co zrobić.** Nagraj.').some((x) => x.includes('pogrubień'))).toBe(false);
    expect(uwagi('Tu **a**, tam **b**, jeszcze **c**.').some((x) => x.includes('pogrubień'))).toBe(true);
    expect(uwagi(Array.from({ length: PROGI.listy + 1 }, () => '- punkt').join('\n\nAkapit.\n\n')).some((x) => x.includes('list:'))).toBe(true);
  });

  it('strona bierna liczy „zostać” i „być” z imiesłowem, bez „są dane” i „zostały one”', () => {
    const { statystyki } = sprawdz('Dane zostały zebrane. Czas został zmierzony. Plan jest realizowany. Wyniki są dane w tabeli. Zostały one opisane [1].');
    expect(statystyki.stronaBierna).toBe(3);
  });
});

describe('kontrola tekstu: rytm', () => {
  it('zmienność: 0 dla równych liczb, rośnie z rozrzutem', () => {
    expect(zmiennosc([8, 8, 8])).toBe(0);
    expect(zmiennosc([3, 30])).toBeGreaterThan(0.8);
  });

  it('monotonny rytm to uwaga, zróżnicowany nie', () => {
    const rowne = Array.from({ length: 20 }, (_, i) => `Operator numer ${i + 1} mierzy czas swojego przezbrojenia stoperem.`).join(' ');
    expect(sprawdz(`${rowne} [1]`).uwagi.some((u) => u.startsWith('monotonny rytm'))).toBe(true);
    const rozne = Array.from({ length: 10 }, (_, i) => `Maszyna stoi. Operator numer ${i + 1} szuka klucza, ustawiacz czeka na wózek z matrycą, a lider zmiany liczy w głowie, ilu sztuk zabraknie do planu.`).join(' ');
    expect(sprawdz(`${rozne} [1]`).uwagi.some((u) => u.startsWith('monotonny rytm'))).toBe(false);
  });

  it('długi tekst bez krótkich zdań dostaje uwagę', () => {
    const dlugi = Array.from({ length: 130 }, (_, i) => `Zespół numer ${i + 1} mierzy każde przezbrojenie na swojej linii.`).join(' ');
    expect(sprawdz(`${dlugi} [1]`).uwagi.some((u) => u.includes('krótkich zdań'))).toBe(true);
  });
});

// Każdy artykuł, który nie jest testowy, przechodzi kontrolę bez błędów (także szkice z przepływu redakcyjnego).
describe('artykuły w repozytorium', () => {
  const katalog = new URL('../content/artykuly/', import.meta.url);
  for (const plik of readdirSync(katalog).filter((f) => f.endsWith('.md'))) {
    const tekst = readFileSync(new URL(plik, katalog), 'utf8');
    const fm = frontmatter(tekst);
    const body = tekst.replace(/^---\n[\s\S]*?\n---\n?/, '');
    it.skipIf(fm.testowy)(`${plik}: kontrola tekstu bez błędów`, () => {
      expect(kontrolaTekstu({ body, frontmatter: fm }).bledy).toEqual([]);
    });
  }
});
