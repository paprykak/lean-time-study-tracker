// Daty po polsku, zawsze w strefie Europe/Warsaw (build w Cloudflare i GitHub Actions działa w UTC).
const STREFA = 'Europe/Warsaw';

const dzien = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: STREFA });
const dzienKrotki = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short', timeZone: STREFA });
const godzina = new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: STREFA });
const iso = new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: STREFA });

/** „6 listopada 2026” */
export const dataDluga = (d: Date) => dzien.format(d);

/** „6 lis” — bez kropki skrótu, jak w redakcjach. */
export const dataKrotka = (d: Date) => dzienKrotki.format(d).replace('.', '');

/** „07:05” */
export const godzinaMinuta = (d: Date) => godzina.format(d);

/** Data kalendarzowa w Polsce, np. „2026-11-06”, do porównań „dziś”. */
export const dzienWPolsce = (d: Date) => iso.format(d);

/** Na listach z godziną: dziś „07:05”, wcześniej „5 lis”. */
export const godzinaAlboData = (d: Date, teraz: Date = new Date()) => (dzienWPolsce(d) === dzienWPolsce(teraz) ? godzinaMinuta(d) : dataKrotka(d));

/** Atrybut datetime elementu <time> (ISO 8601 z przesunięciem strefy). */
export const datetime = (d: Date) => d.toISOString();

/** „4 min czytania” */
export const czasCzytaniaTekst = (minuty: number) => `${Math.max(1, Math.round(minuty))} min czytania`;
