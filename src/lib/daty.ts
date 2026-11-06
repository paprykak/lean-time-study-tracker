// Daty po polsku, zawsze w strefie Europe/Warsaw (build w Cloudflare i GitHub Actions działa w UTC).
// Bez godzin publikacji: Rytm Hali publikuje artykuły, nie wiadomości (decyzja Patryka z 2026-11-06).
const STREFA = 'Europe/Warsaw';

const dzien = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: STREFA });
const dzienKrotki = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: STREFA });

/** „6 listopada 2026” */
export const dataDluga = (d: Date) => dzien.format(d);

/** „6 lis 2026” — bez kropki skrótu, jak w redakcjach. */
export const dataKrotka = (d: Date) => dzienKrotki.format(d).replace('.', '');

/** Atrybut datetime elementu <time> (ISO 8601). */
export const datetime = (d: Date) => d.toISOString();

/** „4 min czytania” */
export const czasCzytaniaTekst = (minuty: number) => `${Math.max(1, Math.round(minuty))} min czytania`;
