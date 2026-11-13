// Terminy w latach i miesiącach (art. 112 Kodeksu cywilnego, w prawie pracy przez art. 300 Kodeksu pracy). Daty jako
// RRRR-MM-DD, liczone w UTC. Jedna konwencja dla wszystkich narzędzi (pakiet „wspólny kod”, 2026-11-13; decyzja w DECYZJE.md):
//
// 1. Termin od zdarzenia (dzień zdarzenia się nie wlicza, art. 111 § 2 KC: „3 miesiące od naruszenia”, „15 miesięcy od
//    rozwiązania umowy”, „5 lat od dnia wydania”): kończy się z upływem dnia, który datą odpowiada dniowi zdarzenia,
//    a gdy takiego dnia w ostatnim miesiącu nie ma, z upływem ostatniego dnia tego miesiąca (art. 112 zd. 1 KC):
//    `dodajMiesiace` (31 sierpnia + 6 miesięcy = 28 lutego, 29 lutego + 1 rok = 28 lutego).
// 2. Okres od początku dnia (pierwszy dzień się wlicza: umowa, okres próbny, urlop, staż, „3 miesiące zatrudnienia”):
//    kończy się z upływem dnia poprzedzającego dzień, który datą odpowiada pierwszemu dniowi, a gdy takiego dnia
//    w ostatnim miesiącu nie ma, z upływem ostatniego dnia tego miesiąca (art. 112 zd. 1 KC, jak w zdaniu 2 dla wieku):
//    `koniecOkresu` (1 marca + 3 miesiące = 31 maja, 31 marca + 6 miesięcy = 30 września, 30 listopada + 3 miesiące =
//    28 lutego, a w roku przestępnym 29 lutego). Pełne miesiące takiego okresu liczy `pelneMiesiace`.
// 3. Okres wypowiedzenia w tygodniach i miesiącach kończy się w sobotę albo ostatniego dnia miesiąca (art. 30 § 2^1 Kp):
//    to przepis szczególny, liczy go `wypowiedzenie.ts`.
// 4. Wiek: kolejny rok życia kończy się z początkiem dnia urodzin (art. 112 zd. 2 KC): `dodajLata(urodzenie, n)` to
//    pierwszy dzień po ukończeniu n lat.
// Regułę „dzień przed dniem odpowiadającym datą” stosuje praktyka i orzecznictwo prawa pracy (np. SN II PK 223/09,
// pismo GIP z 17.01.2011); przypadku, gdy takiego dnia w ostatnim miesiącu nie ma, żadne znalezione źródło nie
// rozstrzyga wprost: przyjmujemy literę art. 112 zd. 1 KC (ostatni dzień miesiąca).
// Odstępstwa od pkt 2 są w narzędziach opisane jako wariant bezpieczny dla pracownika, gdy przepis nie rozstrzyga
// (umowa na zastępstwo: upływ 3. miesiąca ciąży; praca cudzoziemca: okno na podjęcie pracy), a w drugą stronę szkolenie
// okresowe BHP: „do 6 (12) miesięcy od rozpoczęcia pracy” liczymy jak okres z pierwszym dniem (pkt 2), bo wychodzi wcześniej.

const DZIEN_MS = 86_400_000;

/** Czy tekst to poprawna data RRRR-MM-DD (także sprawdza, że dzień istnieje). */
export function poprawnaData(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const [r, m, d] = data.split('-').map(Number);
  const t = new Date(Date.UTC(r, m - 1, d));
  return t.getUTCFullYear() === r && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Termin od zdarzenia według art. 112 KC: dzień, który datą odpowiada `data`, albo ostatni dzień miesiąca (pkt 1). */
export function dodajMiesiace(data: string, miesiace: number): string {
  const [r, m, d] = data.split('-').map(Number);
  const indeks = r * 12 + (m - 1) + miesiace;
  const rok = Math.floor(indeks / 12);
  const miesiac = indeks - rok * 12;
  const ostatni = new Date(Date.UTC(rok, miesiac + 1, 0)).getUTCDate();
  return new Date(Date.UTC(rok, miesiac, Math.min(d, ostatni))).toISOString().slice(0, 10);
}

export const dodajLata = (data: string, lata: number) => dodajMiesiace(data, lata * 12);

const ostatniDzien = (rok: number, miesiac0: number) => new Date(Date.UTC(rok, miesiac0 + 1, 0)).getUTCDate();

/**
 * Ostatni dzień okresu `miesiace` miesięcy liczonego od początku dnia `od` (dzień `od` wliczony): dzień przed dniem,
 * który datą odpowiada dniowi `od`, a gdy takiego dnia w ostatnim miesiącu nie ma, ostatni dzień tego miesiąca.
 * Dla `miesiace` = 0 dzień przed `od` (okres pusty).
 */
export function koniecOkresu(od: string, miesiace: number): string {
  if (!Number.isInteger(miesiace) || miesiace < 0) throw new RangeError(`Okres: ${miesiace} miesięcy`);
  const [r, m, d] = od.split('-').map(Number);
  const indeks = r * 12 + (m - 1) + miesiace;
  const rok = Math.floor(indeks / 12);
  const miesiac0 = indeks - rok * 12;
  const ostatni = ostatniDzien(rok, miesiac0);
  if (d > ostatni) return new Date(Date.UTC(rok, miesiac0, ostatni)).toISOString().slice(0, 10);
  return new Date(Date.UTC(rok, miesiac0, d - 1)).toISOString().slice(0, 10);
}

/**
 * Pełne miesiące okresu od `od` do `ostatni` (oba dni włącznie), np. staż od pierwszego dnia pracy: największe `m`,
 * dla którego `koniecOkresu(od, m)` nie wypada po `ostatni`. Od 31 sierpnia do 28 lutego: 6 miesięcy.
 */
export function pelneMiesiace(od: string, ostatni: string): number {
  if (ostatni < od) return 0;
  const [r1, m1] = od.split('-').map(Number);
  const [r2, m2] = ostatni.split('-').map(Number);
  // Okres od 1. dnia miesiąca kończy się ostatniego dnia miesiąca, więc pełnych miesięcy bywa o jeden więcej niż różnicy.
  let m = (r2 - r1) * 12 + (m2 - m1) + 1;
  while (m > 0 && koniecOkresu(od, m) > ostatni) m--;
  return m;
}

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
