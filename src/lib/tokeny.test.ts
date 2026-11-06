import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { kontrast } from './kontrast';
import { tokenyKolorow } from './tokeny';

const css = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8');
const t = tokenyKolorow(css);

// Każda para tekst/tło, która występuje w komponentach, z wymaganym progiem WCAG 2.2 AA.
// 4,5 — zwykły tekst; 3 — duży tekst (od 24 px albo 18,66 px pogrubiony) i elementy interfejsu (obrysy pól, fokus).
const PARY: [tekst: string, tlo: string, prog: number, gdzie: string][] = [
  ['tekst', 'tlo', 4.5, 'tytuły na białym'],
  ['tekst-tresc', 'tlo', 4.5, 'treść artykułu'],
  ['tekst-tresc', 'tlo-szare', 4.5, 'treść w szarych ramkach'],
  ['tekst-drugi', 'tlo', 4.5, 'metadane, podpisy zdjęć'],
  ['tekst-drugi', 'tlo-szare', 4.5, 'tekst drugorzędny na szarym tle (pasek tematów, ramki)'],
  ['akcent-tekst', 'tlo', 4.5, 'kategoria, linki'],
  ['akcent-tekst', 'tlo-szare', 4.5, 'kategoria w szarych ramkach'],
  ['akcent-ciemny', 'tlo', 4.5, 'linki po najechaniu'],
  ['tekst-na-ciemnym', 'akcent-tekst', 4.5, 'biały napis na przycisku głównym'],
  ['tekst-na-ciemnym', 'akcent-ciemny', 4.5, 'przycisk główny po najechaniu'],
  ['tekst-na-ciemnym', 'grafit', 4.5, 'menu działów'],
  ['tekst-na-ciemnym', 'grafit-ciemny', 4.5, 'pasek górny, stopka'],
  ['tekst-na-ciemnym-drugi', 'grafit', 4.5, 'drugorzędny tekst w menu'],
  ['tekst-na-ciemnym-drugi', 'grafit-ciemny', 4.5, 'drugorzędny tekst w stopce'],
  ['akcent', 'grafit-ciemny', 4.5, 'pomarańcz na stopce'],
  ['blad', 'tlo', 4.5, 'komunikat błędu formularza'],
  ['sukces', 'tlo', 4.5, 'komunikat sukcesu formularza'],
  ['akcent', 'tlo', 3, 'duże numery „Najczęściej czytane”, fokus na białym'],
  ['akcent', 'grafit', 3, 'pasek aktywnego działu, fokus na grafitowym'],
  ['linia-mocna', 'tlo', 3, 'linia 2 px nagłówka sekcji'],
];

describe('tokeny kolorów', () => {
  it('blok @theme zawiera wszystkie kolory używane w parach', () => {
    const brak = [...new Set(PARY.flatMap(([a, b]) => [a, b]))].filter((n) => !t[n]);
    expect(brak).toEqual([]);
  });

  it('jeden kolor akcentu: wszystkie odcienie „akcent*” mają ten sam ton barwy (±6°)', () => {
    const ton = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return (h * 60 + 360) % 360;
    };
    const tony = Object.entries(t)
      .filter(([n]) => n.startsWith('akcent'))
      .map(([, v]) => ton(v));
    expect(Math.max(...tony) - Math.min(...tony)).toBeLessThanOrEqual(6);
  });

  it('tło strony jest białe, nie beżowe', () => {
    expect(t.tlo).toBe('#ffffff');
    // Szare tło ma być chłodne albo neutralne: składowa niebieska nie mniejsza niż czerwona.
    const [r, , b] = [1, 3, 5].map((i) => parseInt(t['tlo-szare'].slice(i, i + 2), 16));
    expect(b).toBeGreaterThanOrEqual(r);
  });

  for (const [tekst, tlo, prog, gdzie] of PARY) {
    it(`${tekst} na ${tlo} ≥ ${prog}:1 (${gdzie})`, () => {
      expect(kontrast(t[tekst], t[tlo])).toBeGreaterThanOrEqual(prog);
    });
  }

  it('obrys pola formularza ma co najmniej 3:1 na białym (WCAG 1.4.11)', () => {
    const obrys = css.match(/\.pole \{[\s\S]*?border-\[(#[0-9a-f]{6})\]/)?.[1];
    expect(obrys).toBeDefined();
    expect(kontrast(obrys!, t.tlo)).toBeGreaterThanOrEqual(3);
  });

  it('karty i zdjęcia mają promień najwyżej 4 px', () => {
    const promienie = [...css.matchAll(/--radius-[\w-]+:\s*(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1]));
    expect(promienie.length).toBeGreaterThan(0);
    expect(Math.max(...promienie)).toBeLessThanOrEqual(4);
  });
});
