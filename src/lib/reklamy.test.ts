import { describe, expect, it } from 'vitest';
import { FORMATY, linkReklamy } from './reklamy';

describe('reklamy', () => {
  it('formaty mają wymiary ze specyfikacji', () => {
    expect(Object.fromEntries(Object.entries(FORMATY).map(([k, f]) => [k, `${f.szerokosc}×${f.wysokosc}`]))).toEqual({
      billboard: '970×250',
      baner: '750×200',
      prostokat: '300×250',
      polstrona: '300×600',
      mobilny: '320×100',
      'mobilny-prostokat': '300×250',
    });
  });

  it('link reklamy dostaje UTM, a istniejących parametrów nie nadpisuje', () => {
    expect(linkReklamy({ id: 'wiosna-2027', link: 'https://example.com/oferta?x=1' })).toBe(
      'https://example.com/oferta?x=1&utm_source=rytmhali&utm_medium=display&utm_campaign=wiosna-2027',
    );
    expect(linkReklamy({ id: 'k', link: 'https://example.com/?utm_source=partner' })).toBe('https://example.com/?utm_source=partner&utm_medium=display&utm_campaign=k');
  });
});
