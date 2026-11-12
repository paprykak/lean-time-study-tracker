import { describe, expect, it } from 'vitest';
import { stanTrzezwosci } from './trzezwosc';

describe('kontrola trzeźwości (art. 46 ust. 2–3 ustawy o wychowaniu w trzeźwości)', () => {
  it('wydychane powietrze: poniżej 0,1 brak, 0,1–0,25 stan po użyciu, powyżej 0,25 nietrzeźwość', () => {
    expect([0, 0.09, 0.1, 0.25, 0.26, 1.2].map((x) => stanTrzezwosci('powietrze', x))).toEqual(['brak', 'brak', 'po-uzyciu', 'po-uzyciu', 'nietrzezwosc', 'nietrzezwosc']);
  });
  it('krew: poniżej 0,2‰ brak, 0,2–0,5‰ stan po użyciu, powyżej 0,5‰ nietrzeźwość', () => {
    expect([0.19, 0.2, 0.5, 0.51].map((x) => stanTrzezwosci('krew', x))).toEqual(['brak', 'po-uzyciu', 'po-uzyciu', 'nietrzezwosc']);
  });
  it('zapis zmiennoprzecinkowy nie przesuwa progu', () => {
    expect(stanTrzezwosci('powietrze', 0.3 - 0.2)).toBe('po-uzyciu');
  });
  it('błędny wynik', () => {
    expect(() => stanTrzezwosci('krew', -1)).toThrow(RangeError);
  });
});
