// Przedawnienie roszczeń pracownika ze stosunku pracy (Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245):
// - 3 lata od dnia, w którym roszczenie stało się wymagalne (art. 291 § 1); termin w latach kończy się z upływem dnia,
//   który datą odpowiada początkowemu dniowi (art. 112 KC przez art. 300 Kp), a 29 lutego odpowiada 28 lutego;
// - wynagrodzenie jest wymagalne w dniu wypłaty: raz w miesiącu w stałym terminie, najpóźniej 10. dnia następnego
//   miesiąca, a gdy ustalony dzień jest wolny od pracy, w dniu poprzedzającym (art. 85 § 1–3; src/lib/narzedzia/termin-wyplaty.ts);
// - nie doliczamy końca roku z art. 118 zd. 2 KC: Kodeks pracy ma własne przepisy o przedawnieniu (art. 291–295), a do
//   Kodeksu cywilnego odsyła tylko w sprawach nieuregulowanych (art. 300). Gdyby sąd przyjął koniec roku, termin byłby
//   dłuższy, więc nasza data jest najwcześniejsza z możliwych;
// - koniec przedawnienia w sobotę albo dzień ustawowo wolny: wspólna konwencja z terminy.ts (pakiet „terminy”,
//   2026-11-15), czyli „zdąż do” (bez przesunięcia, `koniec`) i ostatni dzień według art. 115 KC (`art115`). Wypłata,
//   której pierwsza data minęła, ale dzień z art. 115 KC jeszcze nie, zostaje na liście ze statusem „pilne” i zastrzeżeniem,
//   że roszczenie jest prawdopodobnie przedawnione: przesunięcie przy przedawnieniu jest wątpliwe (`ZDANIE_ART_115.przedawnienie`).
import { odmiana } from '../redakcja';
import { terminyWyplaty, type DzienWyplaty } from './termin-wyplaty';
import { ETYKIETA_ART_115, UWAGA_ART_115_LISTA, dataPoPolsku, dniMiedzy, dodajLata, fazaTerminu, ileDni, terminPracownika, zdanieArt115 } from './terminy';

export const LATA_PRZEDAWNIENIA = 3;

export type StatusPrzedawnienia = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';

/** Ostatni dzień, w którym roszczenie nie jest przedawnione. */
export const koniecPrzedawnienia = (wymagalne: string) => dodajLata(wymagalne, LATA_PRZEDAWNIENIA);

export function przedawnienie(wymagalne: string, naDzien: string) {
  const koniec = koniecPrzedawnienia(wymagalne);
  const t = terminPracownika(koniec);
  const zostalo = dniMiedzy(naDzien, koniec);
  const faza = fazaTerminu(t, naDzien).faza;
  const status: StatusPrzedawnienia =
    faza === 'po-terminie' ? 'po-terminie' : faza === 'tylko-art-115' || zostalo <= 30 ? 'pilne' : zostalo <= 90 ? 'wkrotce' : 'w-terminie';
  return { wymagalne, koniec, art115: t.wedlugArt115, zostalo, status };
}

const DNI: [string, string, string] = ['dzień', 'dni', 'dni'];

/** Teksty o jednym terminie przedawnienia: te same w HTML ze strony i w skrypcie (skrypt dodaje typografia()). */
export function opisPrzedawnienia(p: { wymagalne: string; koniec: string; art115: string }, naDzien: string, co = 'Wypłata') {
  const t = terminPracownika(p.koniec);
  const f = fazaTerminu(t, naDzien);
  return {
    opis: t.rozne
      ? `${co} z ${dataPoPolsku(p.wymagalne)}: zdąż do ${dataPoPolsku(p.koniec)}; ${ETYKIETA_ART_115.charAt(0).toLowerCase()}${ETYKIETA_ART_115.slice(1)}: ${dataPoPolsku(p.art115)}`
      : `${co} z ${dataPoPolsku(p.wymagalne)} przedawnia się z końcem dnia ${dataPoPolsku(p.koniec)}`,
    zdanie: zdanieArt115(t, 'przedawnienie'),
    status:
      f.faza === 'po-terminie'
        ? `Termin minął ${odmiana(-f.dni, DNI)} temu`
        : f.faza === 'tylko-art-115'
          ? `Pierwsza data minęła, więc roszczenie jest prawdopodobnie przedawnione; tylko gdy sąd przesunie koniec według art. 115 KC, ${f.dni === 0 ? 'ostatni dzień to dziś' : `zostało: ${odmiana(f.dni, DNI)}`}`
          : f.dni === 0
            ? 'Ostatni dzień: dziś'
            : `Zostało: ${odmiana(f.dni, DNI)}`,
    /** Krótko do listy i pola „inna należność”: „8 grudnia 2026 r.” albo „… (według art. 115 KC: …)”. */
    krotko: t.rozne ? `${dataPoPolsku(p.koniec)} (według art. 115 KC: ${dataPoPolsku(p.art115)})` : dataPoPolsku(p.koniec),
    /**
     * Pole „inna należność” ze stanem terminu (audyt jakości 4, C-2): „15 listopada 2026 r. (za 3 dni)”, przy dniu wolnym
     * druga data z ostrzeżeniem, po pierwszej dacie „prawdopodobnie przedawnione”, po obu art. 292.
     */
    inna:
      f.faza === 'w-terminie'
        ? `${dataPoPolsku(p.koniec)} (${ileDni(dniMiedzy(naDzien, p.koniec))})${t.rozne ? `; według art. 115 KC: ${dataPoPolsku(p.art115)} (to przesunięcie jest wątpliwe, zdąż do pierwszej daty)` : ''}`
        : f.faza === 'tylko-art-115'
          ? `${dataPoPolsku(p.koniec)} (${ileDni(dniMiedzy(naDzien, p.koniec))}). Pierwsza data minęła, więc roszczenie jest prawdopodobnie przedawnione; tylko gdy sąd przesunie koniec według art. 115 KC: ${dataPoPolsku(p.art115)}`
          : `${dataPoPolsku(p.koniec)} (${ileDni(dniMiedzy(naDzien, p.koniec))}); po tym dniu pracodawca może powołać się na przedawnienie (art. 292)`,
  };
}

/** Ostrzeżenie pod listą „Kolejne terminy”, gdy któraś pozycja ma drugą datę według art. 115 KC (C-1); inaczej pusty tekst. */
export const uwagaListy = (lista: { koniec: string; art115: string }[]) => (lista.some((x) => x.art115 !== x.koniec) ? UWAGA_ART_115_LISTA : '');

/** Kiedy przychodzi wypłata za miesiąc: w następnym miesiącu (dzień 1–10), w tym samym (1–28) albo ostatniego dnia. */
export type RodzajWyplaty = 'nastepny' | 'ten' | 'ostatni';

export interface WyplataZaMiesiac {
  /** Miesiąc pracy: „2023-10”. */
  za: string;
  /** Dzień wypłaty po przesunięciu z art. 85 § 3. */
  wymagalna: string;
  /** Zdąż do: koniec bez przesunięcia. */
  koniec: string;
  /** Ostatni dzień według art. 115 KC (równy `koniec`, gdy to dzień roboczy). */
  art115: string;
  zostalo: number;
  status: StatusPrzedawnienia;
}

/**
 * Wypłaty za kolejne miesiące, które w dniu `naDzien` są już wymagalne i jeszcze nieprzedawnione, od najstarszej.
 * `dzien`: dzień miesiąca wypłaty (przy „ostatni” pomijany).
 */
export function wyplatyDoDochodzenia(naDzien: string, rodzaj: RodzajWyplaty, dzien: number, sobotaWolna = true): WyplataZaMiesiac[] {
  if (rodzaj === 'nastepny' && !(Number.isInteger(dzien) && dzien >= 1 && dzien <= 10)) throw new RangeError('Wypłata w następnym miesiącu: dzień 1–10 (art. 85 § 2)');
  if (rodzaj === 'ten' && !(Number.isInteger(dzien) && dzien >= 1 && dzien <= 28)) throw new RangeError('Dzień wypłaty: 1–28');
  const d: DzienWyplaty = rodzaj === 'ostatni' ? 'ostatni' : dzien;
  const rok = Number(naDzien.slice(0, 4));
  const terminy = new Map<string, string>();
  // Do rok + 1: wypłata za grudzień w następnym miesiącu cofnięta z art. 85 § 3 może przypaść jeszcze w grudniu.
  for (let r = rok - LATA_PRZEDAWNIENIA - 1; r <= rok + 1; r++) {
    for (const t of terminyWyplaty(r, d, sobotaWolna)) terminy.set(`${r}-${String(t.miesiac).padStart(2, '0')}`, t.wyplata);
  }
  const wynik: WyplataZaMiesiac[] = [];
  // Też rok + 1: wypłata za styczeń w tym samym miesiącu, cofnięta z 1 stycznia na grudzień (audyt jakości 4, C-4).
  for (let r = rok - LATA_PRZEDAWNIENIA - 1; r <= rok + 1; r++) {
    for (let m = 1; m <= 12; m++) {
      const za = `${r}-${String(m).padStart(2, '0')}`;
      const placone = rodzaj === 'nastepny' ? (m === 12 ? `${r + 1}-01` : `${r}-${String(m + 1).padStart(2, '0')}`) : za;
      const wymagalna = terminy.get(placone);
      if (!wymagalna || wymagalna > naDzien) continue;
      const p = przedawnienie(wymagalna, naDzien);
      if (p.status === 'po-terminie') continue;
      wynik.push({ za, wymagalna, koniec: p.koniec, art115: p.art115, zostalo: p.zostalo, status: p.status });
    }
  }
  return wynik;
}
