// Raport kampanii dla partnera z API Umami (F5): wyświetlenia i kliknięcia kampanii, razem i według miejsc.
// Zdarzenia wysyła slot (src/components/SlotReklamowy.astro): „Reklama: wyświetlenie” (połowa reklamy na ekranie
// przez sekundę) i „Reklama: kliknięcie”, z właściwościami kampania, miejsce i slot (kampania@miejsce).
// API: GET /websites/{websiteId}/event-data/values (lista {value, total}); Umami Cloud: https://api.umami.is/v1,
// klucz w nagłówku Authorization: Bearer (dokumentacja Umami, sprawdzone 2026-11-06). Klucz ustawia Patryk.

export const ZDARZENIE_WYSWIETLENIA = 'Reklama: wyświetlenie';
export const ZDARZENIE_KLIKNIECIA = 'Reklama: kliknięcie';
export const DOMYSLNY_ADRES_API = 'https://api.umami.is/v1';

/** Nazwy miejsc dla partnera; klucze to MIEJSCA_REKLAM z src/lib/model.ts (pilnuje test). */
export const NAZWY_MIEJSC = {
  'glowna-gora': 'Strona główna, góra',
  'glowna-bok': 'Strona główna, kolumna boczna',
  'artykul-tresc': 'Artykuł, w treści',
  'artykul-bok': 'Artykuł, kolumna boczna',
  'dzial-gora': 'Strony działów, góra',
};

/**
 * Adres zapytania o wartości właściwości zdarzenia.
 * @param {{ adresApi: string, idStrony: string, zdarzenie: string, wlasciwosc: string, od: Date, do: Date }} p
 */
export function adresZapytania({ adresApi, idStrony, zdarzenie, wlasciwosc, od, do: doDaty }) {
  const url = new URL(`${adresApi.replace(/\/$/, '')}/websites/${encodeURIComponent(idStrony)}/event-data/values`);
  url.searchParams.set('startAt', String(od.getTime()));
  url.searchParams.set('endAt', String(doDaty.getTime()));
  url.searchParams.set('eventName', zdarzenie);
  url.searchParams.set('propertyName', wlasciwosc);
  return url.toString();
}

/** Suma dla jednej wartości właściwości (np. id kampanii). */
export const suma = (wiersze, wartosc) => wiersze.filter((w) => w.value === wartosc).reduce((s, w) => s + Number(w.total), 0);

/** Wyniki według miejsc z właściwości „slot” (kampania@miejsce). */
export function wedlugMiejsc(wiersze, idKampanii) {
  const wynik = new Map();
  for (const w of wiersze) {
    if (!String(w.value).startsWith(`${idKampanii}@`)) continue;
    const miejsce = String(w.value).slice(idKampanii.length + 1);
    wynik.set(miejsce, (wynik.get(miejsce) ?? 0) + Number(w.total));
  }
  return wynik;
}

const CTR = (klikniecia, wyswietlenia) => (wyswietlenia ? `${((100 * klikniecia) / wyswietlenia).toFixed(2).replace('.', ',')}%` : '–');
const liczba = (n) => n.toLocaleString('pl-PL');
const data = (d) => d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Warsaw' });

/**
 * Raport w Markdownie (do wklejenia w mail albo PDF dla partnera).
 * @param {{ nazwa: string, partner: string, od: Date, do: Date, wyswietlenia: number, klikniecia: number, miejsca: { miejsce: string, wyswietlenia: number, klikniecia: number }[] }} r
 */
export function raportMarkdown(r) {
  return [
    `# Raport kampanii: ${r.nazwa}`,
    '',
    `Partner: ${r.partner}. Okres: ${data(r.od)} – ${data(r.do)}. Źródło: statystyki Rytmu Hali (Umami, bez plików cookie).`,
    '',
    '| Miejsce | Wyświetlenia | Kliknięcia | CTR |',
    '|---|---:|---:|---:|',
    ...r.miejsca.map((m) => `| ${NAZWY_MIEJSC[m.miejsce] ?? m.miejsce} | ${liczba(m.wyswietlenia)} | ${liczba(m.klikniecia)} | ${CTR(m.klikniecia, m.wyswietlenia)} |`),
    `| **Razem** | **${liczba(r.wyswietlenia)}** | **${liczba(r.klikniecia)}** | **${CTR(r.klikniecia, r.wyswietlenia)}** |`,
    '',
    'Wyświetlenie: co najmniej połowa reklamy na ekranie przez co najmniej sekundę. Osoby, które blokują statystyki w przeglądarce, nie są liczone, więc liczby mogą być zaniżone, ale nie zawyżone.',
    '',
  ].join('\n');
}
