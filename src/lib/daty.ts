// Daty po polsku, zawsze w strefie Europe/Warsaw (build w Cloudflare i GitHub Actions działa w UTC).
const STREFA = 'Europe/Warsaw';

const dzien = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: STREFA });

/** „6 listopada 2026” */
export const dataDluga = (d: Date) => dzien.format(d);

/** Atrybut datetime elementu <time> (ISO 8601). */
export const datetime = (d: Date) => d.toISOString();
