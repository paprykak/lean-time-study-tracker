// Terminy w latach i miesiącach (art. 112 Kodeksu cywilnego): termin kończy się w dniu, który datą odpowiada
// początkowemu dniowi, a gdyby takiego dnia w ostatnim miesiącu nie było, w ostatnim dniu tego miesiąca
// (29 lutego + 1 rok = 28 lutego). Daty jako RRRR-MM-DD, liczone w UTC. Wspólne dla narzędzi z terminami
// (szkolenia BHP, uprawnienia UDT, badania).

const DZIEN_MS = 86_400_000;

/** Czy tekst to poprawna data RRRR-MM-DD (także sprawdza, że dzień istnieje). */
export function poprawnaData(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const [r, m, d] = data.split('-').map(Number);
  const t = new Date(Date.UTC(r, m - 1, d));
  return t.getUTCFullYear() === r && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Dodaje miesiące według art. 112 KC. */
export function dodajMiesiace(data: string, miesiace: number): string {
  const [r, m, d] = data.split('-').map(Number);
  const indeks = r * 12 + (m - 1) + miesiace;
  const rok = Math.floor(indeks / 12);
  const miesiac = indeks - rok * 12;
  const ostatni = new Date(Date.UTC(rok, miesiac + 1, 0)).getUTCDate();
  return new Date(Date.UTC(rok, miesiac, Math.min(d, ostatni))).toISOString().slice(0, 10);
}

export const dodajLata = (data: string, lata: number) => dodajMiesiace(data, lata * 12);

/** Dodaje (albo odejmuje) dni kalendarzowe. */
export const dodajDni = (data: string, dni: number) => new Date(Date.parse(`${data}T00:00:00Z`) + dni * DZIEN_MS).toISOString().slice(0, 10);

/** Liczba dni od `od` do `do` (ujemna, gdy `do` jest wcześniej). */
export const dniMiedzy = (od: string, do_: string) => Math.round((Date.parse(`${do_}T00:00:00Z`) - Date.parse(`${od}T00:00:00Z`)) / DZIEN_MS);

/** Dzisiejsza data w Polsce (RRRR-MM-DD), niezależnie od strefy urządzenia. */
export const dzisWPolsce = (teraz = new Date()) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit' }).format(teraz);

const DATA_PL = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** „2027-03-15” → „15 marca 2027 r.” */
export const dataPoPolsku = (data: string) => `${DATA_PL.format(new Date(`${data}T00:00:00Z`))} r.`;

/** „za 45 dni”, „jutro”, „dziś”, „3 dni temu”. */
export function ileDni(dni: number): string {
  const n = Math.abs(dni);
  const slowo = n === 1 ? 'dzień' : 'dni';
  if (dni === 0) return 'dziś';
  if (dni === 1) return 'jutro';
  if (dni === -1) return 'wczoraj';
  return dni > 0 ? `za ${n} ${slowo}` : `${n} ${slowo} temu`;
}
