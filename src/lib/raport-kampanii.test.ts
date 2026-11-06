import { describe, expect, it } from 'vitest';
import { adresZapytania, NAZWY_MIEJSC, raportMarkdown, suma, wedlugMiejsc } from './raport-kampanii.mjs';
import { MIEJSCA_REKLAM } from './model';

describe('raport kampanii z Umami', () => {
  it('każde miejsce reklamy ma nazwę dla partnera', () => {
    expect(Object.keys(NAZWY_MIEJSC)).toEqual([...MIEJSCA_REKLAM]);
  });

  it('adres zapytania: wartości właściwości zdarzenia w oknie kampanii (milisekundy)', () => {
    const url = new URL(
      adresZapytania({ adresApi: 'https://api.umami.is/v1/', idStrony: 'abc', zdarzenie: 'Reklama: wyświetlenie', wlasciwosc: 'kampania', od: new Date('2026-11-01T00:00:00Z'), do: new Date('2026-11-02T00:00:00Z') }),
    );
    expect(url.origin + url.pathname).toBe('https://api.umami.is/v1/websites/abc/event-data/values');
    expect(Object.fromEntries(url.searchParams)).toEqual({ startAt: String(Date.UTC(2026, 10, 1)), endAt: String(Date.UTC(2026, 10, 2)), eventName: 'Reklama: wyświetlenie', propertyName: 'kampania' });
  });

  it('suma dla kampanii i podział na miejsca z właściwości „slot”', () => {
    expect(suma([{ value: 'a', total: 120 }, { value: 'b', total: 7 }, { value: 'a', total: 3 }], 'a')).toBe(123);
    const miejsca = wedlugMiejsc([{ value: 'a@glowna-gora', total: 100 }, { value: 'a@artykul-bok', total: 20 }, { value: 'ab@glowna-gora', total: 9 }], 'a');
    expect([...miejsca]).toEqual([['glowna-gora', 100], ['artykul-bok', 20]]);
  });

  it('raport w Markdownie: tabela miejsc, suma i CTR po polsku', () => {
    const tekst = raportMarkdown({
      nazwa: 'Wiosna',
      partner: 'Firma X',
      od: new Date('2026-11-01T00:00:00+01:00'),
      do: new Date('2026-11-30T23:00:00+01:00'),
      wyswietlenia: 12500,
      klikniecia: 50,
      miejsca: [{ miejsce: 'glowna-gora', wyswietlenia: 12500, klikniecia: 50 }],
    });
    expect(tekst).toContain('Okres: 1 listopada 2026 – 30 listopada 2026.');
    expect(tekst).toContain('| Strona główna, góra | 12 500 | 50 | 0,40% |');
    expect(tekst).toContain('| **Razem** | **12 500** | **50** | **0,40%** |');
  });
});
