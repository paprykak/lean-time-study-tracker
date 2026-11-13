// Spójność rejestru narzędzi i przepisów: każde narzędzie ma stronę, każdy przepis istnieje, płaca minimalna
// jest wpisana na bieżący rok, kwoty ogłaszane co kwartał i co rok nie są przeterminowane, a żadne sprawdzenie u źródła nie jest starsze niż 15 miesięcy (dane prawne się
// starzeją: nowa płaca minimalna co roku we wrześniu, nowe teksty jednolite).
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AKTY, LATA, OBJASNIENIA, PLACA_MINIMALNA, PRZECIETNE_WYNAGRODZENIE } from '../../data/prawo';
import { KATEGORIE, NARZEDZIA, W_PRZYGOTOWANIU } from '../../data/narzedzia';
import { ROKI_KOSZTU } from './koszt-pracodawcy';
import { PRZECIETNE_KWARTALNE } from './mlodociany';
import { KWOTY_ODSZKODOWAN } from './odszkodowanie-wypadek';
import { WSKAZNIKI } from './swiadczenie-rehabilitacyjne';
import { dodajMiesiace } from './terminy';
import { KWOTY_ZASILKU } from './zasilek-bezrobotny';

const dzis = new Date();
const MAKS_WIEK_DNI = 455;
const wiekDni = (data: string) => (dzis.valueOf() - Date.parse(`${data}T00:00:00Z`)) / 86_400_000;

describe('rejestr narzędzi', () => {
  it('slugi są unikalne i mają postać adresu', () => {
    const slugi = NARZEDZIA.map((n) => n.slug);
    expect(new Set(slugi).size).toBe(slugi.length);
    for (const s of slugi) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  it.each(NARZEDZIA.map((n) => [n.slug, n]))('%s: strona, przepisy, kategoria, opis, data', (slug, n) => {
    expect(existsSync(`src/pages/narzedzia/${slug}.astro`), `brak src/pages/narzedzia/${slug}.astro`).toBe(true);
    expect(KATEGORIE[n.kategoria]).toBeDefined();
    for (const p of n.przepisy) expect(AKTY[p], `nieznany przepis ${p}`).toBeDefined();
    expect(n.krotko.length).toBeLessThanOrEqual(110);
    expect(wiekDni(n.sprawdzono)).toBeLessThan(MAKS_WIEK_DNI);
  });
  it('narzędzie w przygotowaniu nie dubluje gotowego', () => {
    const gotowe = new Set(NARZEDZIA.map((n) => n.nazwa));
    for (const w of W_PRZYGOTOWANIU) expect(gotowe.has(w.nazwa)).toBe(false);
  });
});

describe('rejestr przepisów', () => {
  it('płaca minimalna jest wpisana na bieżący rok (rozporządzenie wychodzi do 15 września roku poprzedniego)', () => {
    expect(PLACA_MINIMALNA[dzis.getUTCFullYear()], `dopisz płacę minimalną na ${dzis.getUTCFullYear()} w src/data/prawo.ts`).toBeDefined();
  });
  it('każda płaca minimalna wskazuje istniejący akt, lata idą po kolei', () => {
    for (const [rok, p] of Object.entries(PLACA_MINIMALNA)) {
      expect(AKTY[p.akt]).toBeDefined();
      expect(AKTY[p.akt].nazwa).toContain(rok);
    }
    expect(LATA).toEqual(Array.from({ length: LATA.length }, (_, i) => LATA[0] + i));
  });
  it.each([...Object.entries(AKTY), ...Object.entries(OBJASNIENIA)])('%s: adres i sprawdzenie nie starsze niż 15 miesięcy', (_, a) => {
    expect(a.adres).toMatch(/^https:\/\//);
    expect(wiekDni(a.sprawdzono)).toBeGreaterThanOrEqual(-1);
    expect(wiekDni(a.sprawdzono), `sprawdź ponownie ${a.nazwa} u źródła i zmień datę`).toBeLessThan(MAKS_WIEK_DNI);
  });
});

// Kwoty ogłaszane co kwartał albo co rok (komunikaty GUS, obwieszczenia ZUS i ministra). Każda tabela ma termin, do
// którego musi pojawić się następna pozycja; po nim (z zapasem 20 dni na ogłoszenie w M.P.) build się zatrzymuje,
// żeby narzędzie nie liczyło po cichu starą kwotą. Co i gdzie sprawdzić, mówi komunikat błędu.
describe('kwoty ogłaszane okresowo są aktualne', () => {
  const ZAPAS_DNI = 20;
  const dzisIso = dzis.toISOString().slice(0, 10);
  const przeterminowane = (nastepnaOd: string) => wiekDni(nastepnaOd) > ZAPAS_DNI;
  const ostatni = <T,>(t: readonly T[]) => t[t.length - 1];
  it('przeciętne wynagrodzenie kwartalne (GUS, płace młodocianych)', () => {
    const od = dodajMiesiace(ostatni(PRZECIETNE_KWARTALNE).od, 3);
    expect(przeterminowane(od), `dopisz komunikat Prezesa GUS za kolejny kwartał do PRZECIETNE_KWARTALNE (mlodociany.ts); obowiązuje od ${od}`).toBe(false);
  });
  it('wskaźnik waloryzacji świadczenia rehabilitacyjnego (ZUS, co kwartał)', () => {
    const [rok, kw] = Object.keys(WSKAZNIKI).sort().at(-1)!.split('-').map(Number);
    const od = kw === 4 ? `${rok + 1}-01-01` : `${rok}-${String(kw * 3 + 1).padStart(2, '0')}-01`;
    expect(przeterminowane(od), `dopisz obwieszczenie Prezesa ZUS na kwartał od ${od} do WSKAZNIKI (swiadczenie-rehabilitacyjne.ts)`).toBe(false);
  });
  it('odszkodowania za wypadek przy pracy (od 1 kwietnia)', () => {
    const od = ostatni(KWOTY_ODSZKODOWAN).do;
    expect(przeterminowane(od), `dopisz obwieszczenie MRPiPS o kwotach odszkodowań od ${od} do KWOTY_ODSZKODOWAN`).toBe(false);
  });
  it('zasiłek dla bezrobotnych (od 1 czerwca)', () => {
    const od = dodajMiesiace(ostatni(KWOTY_ZASILKU).od, 12);
    expect(przeterminowane(od), `dopisz obwieszczenie MRPiPS o zasiłku od ${od} do KWOTY_ZASILKU`).toBe(false);
  });
  it('przeciętne wynagrodzenie roczne (GUS, luty; opłata UDT)', () => {
    const od = dodajMiesiace(PRZECIETNE_WYNAGRODZENIE.ogloszono, 12);
    expect(przeterminowane(od), `dopisz komunikat Prezesa GUS o przeciętnym wynagrodzeniu za ${PRZECIETNE_WYNAGRODZENIE.zaRok + 1} r. (PRZECIETNE_WYNAGRODZENIE w prawo.ts)`).toBe(false);
  });
  it('koszt pracodawcy ma parametry na bieżący rok (limit 30-krotności, stopy funduszy)', () => {
    expect(Object.keys(ROKI_KOSZTU), `dopisz rok ${dzisIso.slice(0, 4)} do ROKI_KOSZTU (koszt-pracodawcy.ts)`).toContain(dzisIso.slice(0, 4));
  });
});
