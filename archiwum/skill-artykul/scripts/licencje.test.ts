import { describe, expect, it } from 'vitest';
import { doi, licencja, podpisFot } from './licencje.mjs';
import { LICENCJE } from './model';

describe('licencje zdjęć z wyszukiwarek', () => {
  it('przyjmuje tylko CC0 i CC BY 2.0–4.0, w nazwach z rejestru', () => {
    expect(licencja('cc0', '1.0')).toBe('CC0 1.0');
    expect(licencja('CC0')).toBe('CC0 1.0');
    expect(licencja('by', '4.0')).toBe('CC BY 4.0');
    expect(licencja('CC BY 2.0')).toBe('CC BY 2.0');
    for (const l of ['by', 'CC0', 'CC BY 3.0'].map((k) => licencja(k, '3.0'))) expect(LICENCJE).toContain(l);
  });

  it('odrzuca BY-SA, NC, ND, domenę publiczną bez CC0 i BY 1.0', () => {
    for (const [kod, w] of [['by-sa', '4.0'], ['CC BY-SA 4.0'], ['by-nc', '4.0'], ['by-nd', '2.0'], ['Public domain'], ['pdm'], ['by', '1.0'], ['GFDL']]) {
      expect(licencja(kod, w), `${kod} ${w ?? ''}`).toBeNull();
    }
  });

  it('podpis „Fot.”: przy CC BY z dopiskiem o kadrze', () => {
    expect(podpisFot({ autor: 'Jan Kowalski', serwis: 'Wikimedia Commons', licencja: 'CC BY 4.0' })).toBe('Fot. Jan Kowalski / Wikimedia Commons, CC BY 4.0 (kadr)');
    expect(podpisFot({ autor: 'Anna Nowak', serwis: 'rawpixel', licencja: 'CC0 1.0' })).toBe('Fot. Anna Nowak / rawpixel, CC0');
  });
});

describe('DOI z adresu źródła', () => {
  it('z doi.org i ze strony wydawcy, bez znaków końcowych', () => {
    expect(doi('https://doi.org/10.1016/S0140-6736(97)11096-0')).toBe('10.1016/S0140-6736(97)11096-0');
    expect(doi('https://link.springer.com/article/10.1007/s00170-020-05123-4?x=1')).toBe('10.1007/s00170-020-05123-4');
    expect(doi('https://stat.gov.pl/obszary-tematyczne/')).toBeUndefined();
  });
});
