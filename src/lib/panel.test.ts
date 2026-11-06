import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
import { Ajv } from 'ajv';
import { frontmatter } from './mapa.mjs';
import { FORMATY, LICENCJE, MIEJSCA_REKLAM } from './model';

// Panel redakcji (public/admin/config.yml) a model treści (src/content.config.ts). Rozjazd w którąkolwiek stronę
// kończy się źle: pole spoza schematu Astro po cichu znika przy buildzie, a pole schematu bez pola w panelu
// redakcja może skasować przy zapisie. Schematy JSON kolekcji generuje `astro sync` (uruchamia go `astro check`).

type Pole = {
  name: string;
  widget?: string;
  required?: boolean;
  default?: unknown;
  fields?: Pole[];
  field?: Pole;
  options?: (string | { value: string })[];
  multiple?: boolean;
  collection?: string;
  value_field?: string;
  minlength?: number;
  maxlength?: number;
  media_folder?: string;
  public_folder?: string;
};
type Schemat = { type?: string; properties?: Record<string, Schemat>; required?: string[]; items?: Schemat; enum?: string[]; default?: unknown; minLength?: number; maxLength?: number; anyOf?: Schemat[] };
type Kolekcja = { name: string; folder?: string; extension?: string; fields?: Pole[]; files?: { file: string; fields: Pole[] }[]; divider?: boolean };

const ROOT = new URL('../../', import.meta.url);
const czytaj = (sciezka: string) => readFileSync(new URL(sciezka, ROOT), 'utf8');
const config = parse(czytaj('public/admin/config.yml')) as { collections: Kolekcja[]; backend: Record<string, unknown>; media_folder: string; public_folder: string };
const kolekcje = config.collections.filter((k) => !k.divider);
const zFolderu = kolekcje.filter((k) => k.folder);
const nazwyKolekcji = new Set(kolekcje.map((k) => k.name));
const schematAstro = (nazwa: string): Schemat => {
  const sciezka = new URL(`.astro/collections/${nazwa}.schema.json`, ROOT);
  if (!existsSync(sciezka)) throw new Error(`Brak ${sciezka.pathname}: uruchom „npx astro sync” (robi to też „astro check”).`);
  return JSON.parse(readFileSync(sciezka, 'utf8'));
};
const wartosci = (p: Pole) => (p.options ?? []).map((o) => (typeof o === 'string' ? o : o.value));
const wymagane = (p: Pole) => p.required !== false;

/** Porównuje pola panelu ze schematem Astro rekurencyjnie i zwraca listę rozbieżności (pusta = zgodne). */
function rozbieznosci(pola: Pole[], schemat: Schemat, sciezka: string): string[] {
  const bledy: string[] = [];
  const wPanelu = pola.filter((p) => p.name !== 'body').map((p) => p.name).sort();
  // $schema dodaje Astro dla edytorów plików JSON; to nie jest pole treści.
  const wSchemacie = Object.keys(schemat.properties ?? {}).filter((n) => n !== '$schema').sort();
  for (const n of wSchemacie.filter((n) => !wPanelu.includes(n))) bledy.push(`${sciezka}.${n}: jest w schemacie Astro, nie ma w panelu`);
  for (const n of wPanelu.filter((n) => !wSchemacie.includes(n))) bledy.push(`${sciezka}.${n}: jest w panelu, nie ma w schemacie Astro`);
  for (const p of pola.filter((p) => p.name !== 'body' && schemat.properties?.[p.name])) {
    const s = schemat.properties![p.name];
    const gdzie = `${sciezka}.${p.name}`;
    const wymaganeAstro = (schemat.required ?? []).includes(p.name);
    if (wymaganeAstro && !wymagane(p)) bledy.push(`${gdzie}: wymagane w schemacie, opcjonalne w panelu`);
    if (!wymaganeAstro && wymagane(p) && s.default === undefined && p.widget !== 'boolean') bledy.push(`${gdzie}: opcjonalne w schemacie, wymagane w panelu`);
    if (p.widget === 'select') {
      const dozwolone = (p.multiple ? s.items?.enum : s.enum) ?? [];
      if (JSON.stringify(wartosci(p)) !== JSON.stringify(dozwolone)) bledy.push(`${gdzie}: opcje ${JSON.stringify(wartosci(p))} ≠ ${JSON.stringify(dozwolone)}`);
    }
    if (p.widget === 'relation') {
      if (!nazwyKolekcji.has(p.collection!)) bledy.push(`${gdzie}: relacja do nieznanej kolekcji ${p.collection}`);
      if (p.value_field !== '{{slug}}') bledy.push(`${gdzie}: relacja ma zapisywać nazwę pliku ({{slug}}), jak reference() w Astro`);
      if (Boolean(p.multiple) !== (s.type === 'array')) bledy.push(`${gdzie}: multiple w panelu ≠ tablica w schemacie`);
    }
    if (['string', 'text'].includes(p.widget ?? 'string')) {
      if (s.maxLength !== undefined && p.maxlength !== s.maxLength) bledy.push(`${gdzie}: maxlength ${p.maxlength} ≠ ${s.maxLength}`);
      if (s.minLength !== undefined && p.minlength !== s.minLength) bledy.push(`${gdzie}: minlength ${p.minlength} ≠ ${s.minLength}`);
    }
    if (p.widget === 'object') bledy.push(...rozbieznosci(p.fields ?? [], s, gdzie));
    if (p.widget === 'list' && p.fields) bledy.push(...rozbieznosci(p.fields, s.items ?? {}, `${gdzie}[]`));
    if (p.widget === 'list' && !p.fields && s.items?.type !== 'string') bledy.push(`${gdzie}: lista prosta w panelu, a w schemacie nie lista tekstów`);
  }
  return bledy;
}

/** Klucze danych spoza schematu (zod je po cichu pomija, więc to zgubione dane albo literówka). */
function nadmiarowe(dane: Record<string, unknown>, schemat: Schemat, sciezka: string): string[] {
  return Object.entries(dane).flatMap(([k, v]) => {
    const s = schemat.properties?.[k];
    if (!s) return [`${sciezka}.${k}`];
    if (s.type === 'object' && v && typeof v === 'object' && !Array.isArray(v)) return nadmiarowe(v as Record<string, unknown>, s, `${sciezka}.${k}`);
    if (s.type === 'array' && s.items?.type === 'object' && Array.isArray(v)) return v.flatMap((x, i) => nadmiarowe(x, s.items!, `${sciezka}.${k}[${i}]`));
    return [];
  });
}

describe('konfiguracja panelu', () => {
  it('jest zgodna ze schematem Sveltia CMS przypiętej wersji', () => {
    const schemat = JSON.parse(czytaj('node_modules/@sveltia/cms/schema/sveltia-cms.json'));
    const ajv = new Ajv({ strict: false, allErrors: true, validateFormats: false });
    const sprawdz = ajv.compile(schemat);
    const ok = sprawdz(config);
    // Przy anyOf ajv podaje błąd każdej gałęzi; do diagnozy wystarczą miejsca i pierwsze komunikaty.
    const bledy = ok ? [] : [...new Set(sprawdz.errors!.map((e) => `${e.instancePath}: ${e.message} ${JSON.stringify(e.params)}`))];
    expect(bledy.slice(0, 15)).toEqual([]);
  });

  it('przepływ redakcyjny, logowanie przez worker serwisu i bez stockowych zdjęć', () => {
    expect(config.backend).toMatchObject({ name: 'github', branch: 'main', base_url: 'https://rytmhali.pl', auth_endpoint: 'api/auth', auth_scope: 'repo' });
    expect(parse(czytaj('public/admin/config.yml')).publish_mode.type).toBe('editorial_workflow');
    expect(parse(czytaj('public/admin/config.yml')).media_libraries.stock_assets.providers).toEqual([]);
  });

  it('skrypt panelu w wersji z package.json i z poprawną sumą SRI', () => {
    const html = czytaj('public/admin/index.html');
    const wersja = JSON.parse(czytaj('package.json')).devDependencies['@sveltia/cms'];
    const skrypt = html.match(/<script src="https:\/\/unpkg\.com\/@sveltia\/cms@([^/]+)\/dist\/sveltia-cms\.js" integrity="(sha384-[^"]+)" crossorigin="anonymous"><\/script>/);
    expect(skrypt, 'skrypt z unpkg z integrity i crossorigin').not.toBeNull();
    expect(skrypt![1]).toBe(wersja);
    const suma = `sha384-${createHash('sha384').update(readFileSync(new URL('node_modules/@sveltia/cms/dist/sveltia-cms.js', ROOT))).digest('base64')}`;
    expect(skrypt![2], 'nowa suma SRI po aktualizacji wersji').toBe(suma);
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
  });
});

describe('panel a model treści', () => {
  it('każda kolekcja z folderu ma odpowiednik w src/content.config.ts', () => {
    expect(zFolderu.map((k) => k.name).sort()).toEqual(['artykuly', 'autorzy', 'dzialy', 'kampanie', 'materialy', 'partnerzy', 'strony', 'tematy', 'zdjecia']);
  });

  for (const k of zFolderu) {
    it(`${k.name}: pola, wymagalność, listy wyboru i relacje zgodne ze schematem`, () => {
      expect(rozbieznosci(k.fields!, schematAstro(k.name), k.name)).toEqual([]);
      expect(Boolean(k.fields!.find((p) => p.name === 'body'))).toBe(k.extension === 'md');
    });

    it(`${k.name}: istniejące wpisy nie mają pól spoza schematu`, () => {
      const folder = new URL(`${k.folder}/`, ROOT);
      const wpisy = existsSync(folder) ? readdirSync(folder).filter((f) => f.endsWith(`.${k.extension}`)) : [];
      const zle = wpisy.flatMap((f) => {
        const tekst = readFileSync(new URL(f, folder), 'utf8');
        return nadmiarowe(k.extension === 'json' ? JSON.parse(tekst) : frontmatter(tekst), schematAstro(k.name), f);
      });
      expect(zle).toEqual([]);
    });
  }

  it('listy wyboru panelu to te same stałe co w modelu (formaty, licencje, miejsca reklam)', () => {
    const pole = (kolekcja: string, nazwa: string) => kolekcje.find((k) => k.name === kolekcja)!.fields!.find((p) => p.name === nazwa)!;
    expect(wartosci(pole('artykuly', 'format'))).toEqual([...FORMATY]);
    expect(wartosci(pole('zdjecia', 'licencja'))).toEqual([...LICENCJE]);
    expect(wartosci(pole('kampanie', 'miejsca'))).toEqual([...MIEJSCA_REKLAM]);
  });

  it('obrazy trafiają do src/assets (optymalizacja Astro), a ścieżka w danych jest od katalogu projektu', () => {
    const obrazy: Pole[] = [];
    const zbierz = (pola: Pole[]) => pola.forEach((p) => (p.widget === 'image' ? obrazy.push(p) : zbierz([...(p.fields ?? []), ...(p.field ? [p.field] : [])])));
    kolekcje.forEach((k) => zbierz(k.fields ?? k.files!.flatMap((f) => f.fields)));
    expect(obrazy.length).toBeGreaterThan(5);
    for (const p of obrazy) {
      const folder = p.media_folder ?? config.media_folder;
      expect(folder, p.name).toMatch(/^\/src\/assets\/[a-z]+$/);
      expect(p.public_folder ?? config.public_folder, p.name).toBe(folder);
    }
  });
});

describe('ustawienia serwisu w panelu', () => {
  const plik = kolekcje.find((k) => k.name === 'ustawienia')!.files![0];
  const dane = JSON.parse(czytaj(plik.file));

  it('pola panelu pokrywają cały plik (nic nie ginie przy zapisie) i nic ponad niego', () => {
    const roznice = (pola: Pole[], obiekt: Record<string, unknown>, sciezka: string): string[] => {
      const wPanelu = pola.map((p) => p.name).sort();
      const wPliku = Object.keys(obiekt).sort();
      const bledy = [...wPliku.filter((n) => !wPanelu.includes(n)).map((n) => `${sciezka}.${n}: brak w panelu`), ...wPanelu.filter((n) => !wPliku.includes(n)).map((n) => `${sciezka}.${n}: brak w pliku`)];
      for (const p of pola) {
        const v = obiekt[p.name];
        if (p.widget === 'object') bledy.push(...roznice(p.fields!, v as Record<string, unknown>, `${sciezka}.${p.name}`));
        if (p.widget === 'list' && p.fields) (v as Record<string, unknown>[]).forEach((x, i) => bledy.push(...roznice(p.fields!, x, `${sciezka}.${p.name}[${i}]`)));
      }
      return bledy;
    };
    expect(roznice(plik.fields, dane, 'ustawienia')).toEqual([]);
  });

  it('pasek tematów wskazuje istniejące tematy, a linki menu i stopki są wypełnione', () => {
    for (const t of dane.tematyWyroznione) expect(existsSync(new URL(`src/content/tematy/${t}.json`, ROOT)), t).toBe(true);
    const linki = [...dane.menuDodatkowe, ...dane.pasekGorny, ...dane.stopka.serwis, ...dane.stopka.wspolpraca, ...dane.stopka.prawne];
    for (const l of linki) {
      expect(l.nazwa.trim().length, JSON.stringify(l)).toBeGreaterThan(0);
      expect(l.adres, JSON.stringify(l)).toMatch(/^\/[a-z0-9\-/.]*$|^https:\/\//);
    }
  });
});
