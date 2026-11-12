// Przedawnienie roszczeń pracownika ze stosunku pracy (Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245):
// - 3 lata od dnia, w którym roszczenie stało się wymagalne (art. 291 § 1); termin w latach kończy się z upływem dnia,
//   który datą odpowiada początkowemu dniowi (art. 112 KC przez art. 300 Kp), a 29 lutego odpowiada 28 lutego;
// - wynagrodzenie jest wymagalne w dniu wypłaty: raz w miesiącu w stałym terminie, najpóźniej 10. dnia następnego
//   miesiąca, a gdy ustalony dzień jest wolny od pracy, w dniu poprzedzającym (art. 85 § 1–3; src/lib/narzedzia/termin-wyplaty.ts);
// - nie doliczamy końca roku z art. 118 zd. 2 KC: Kodeks pracy ma własne przepisy o przedawnieniu (art. 291–295), a do
//   Kodeksu cywilnego odsyła tylko w sprawach nieuregulowanych (art. 300). Gdyby sąd przyjął koniec roku, termin byłby
//   dłuższy, więc nasza data jest najwcześniejsza z możliwych. Nie liczymy też przesunięć z art. 115 KC.
import { terminyWyplaty, type DzienWyplaty } from './termin-wyplaty';
import { dniMiedzy, dodajLata } from './terminy';

export const LATA_PRZEDAWNIENIA = 3;

export type StatusPrzedawnienia = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';

/** Ostatni dzień, w którym roszczenie nie jest przedawnione. */
export const koniecPrzedawnienia = (wymagalne: string) => dodajLata(wymagalne, LATA_PRZEDAWNIENIA);

export function przedawnienie(wymagalne: string, naDzien: string) {
  const koniec = koniecPrzedawnienia(wymagalne);
  const zostalo = dniMiedzy(naDzien, koniec);
  const status: StatusPrzedawnienia = zostalo < 0 ? 'po-terminie' : zostalo <= 30 ? 'pilne' : zostalo <= 90 ? 'wkrotce' : 'w-terminie';
  return { wymagalne, koniec, zostalo, status };
}

/** Kiedy przychodzi wypłata za miesiąc: w następnym miesiącu (dzień 1–10), w tym samym (1–28) albo ostatniego dnia. */
export type RodzajWyplaty = 'nastepny' | 'ten' | 'ostatni';

export interface WyplataZaMiesiac {
  /** Miesiąc pracy: „2023-10”. */
  za: string;
  /** Dzień wypłaty po przesunięciu z art. 85 § 3. */
  wymagalna: string;
  koniec: string;
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
  for (let r = rok - LATA_PRZEDAWNIENIA - 1; r <= rok; r++) {
    for (const t of terminyWyplaty(r, d, sobotaWolna)) terminy.set(`${r}-${String(t.miesiac).padStart(2, '0')}`, t.wyplata);
  }
  const wynik: WyplataZaMiesiac[] = [];
  for (let r = rok - LATA_PRZEDAWNIENIA - 1; r <= rok; r++) {
    for (let m = 1; m <= 12; m++) {
      const za = `${r}-${String(m).padStart(2, '0')}`;
      const placone = rodzaj === 'nastepny' ? (m === 12 ? `${r + 1}-01` : `${r}-${String(m + 1).padStart(2, '0')}`) : za;
      const wymagalna = terminy.get(placone);
      if (!wymagalna || wymagalna > naDzien) continue;
      const p = przedawnienie(wymagalna, naDzien);
      if (p.status === 'po-terminie') continue;
      wynik.push({ za, wymagalna, koniec: p.koniec, zostalo: p.zostalo, status: p.status });
    }
  }
  return wynik;
}
