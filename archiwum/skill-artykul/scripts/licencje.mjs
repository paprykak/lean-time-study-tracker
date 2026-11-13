// Czyste funkcje skryptów redakcji (scripts/redakcja/): licencje zdjęć z wyszukiwarek i DOI badań. Testy obok.

/** Licencja z wyszukiwarki (Openverse: „cc0”, „by” + wersja; Commons: „CC BY 4.0”) → nazwa z rejestru albo null. */
export function licencja(kod, wersja) {
  const tekst = String(kod ?? '').trim().toLowerCase();
  if (/^(cc0|cc0 1\.0|cc-zero)$/.test(tekst)) return 'CC0 1.0';
  const by = tekst.replace(/^cc[\s-]/, '').match(/^by(?:[\s-]([234]\.0))?$/);
  const v = by?.[1] ?? wersja;
  return by && ['2.0', '3.0', '4.0'].includes(v) ? `CC BY ${v}` : null;
}

/** Podpis „Fot.” jak w rejestrze; przy CC BY dopisek „(kadr)”, bo każde zdjęcie kadrujemy do 16:9 i 1:1. */
export const podpisFot = ({ autor, serwis, licencja: l }) => `Fot. ${autor} / ${serwis}, ${l === 'CC0 1.0' ? 'CC0' : l}${l.startsWith('CC BY') ? ' (kadr)' : ''}`;

/** DOI z adresu (doi.org/…, albo DOI w ścieżce strony wydawcy). */
export const doi = (adres) => decodeURIComponent(adres).match(/\b(10\.\d{4,9}\/[^\s?#]+)/)?.[1]?.replace(/[.,;)]+$/, '');
