// Zasiłek chorobowy po ustaniu zatrudnienia (ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854):
// - niezdolność powstała w czasie zatrudnienia i trwa dalej: zasiłek za okres po ustaniu, najwyżej przez 91 dni (art. 8 ust. 2),
//   liczonych od pierwszego dnia zasiłku po ustaniu;
// - niezdolność powstała po ustaniu: musi trwać bez przerwy co najmniej 30 dni i powstać najpóźniej w ciągu 14 dni od ustania,
//   a przy chorobie zakaźnej z wylęganiem dłuższym niż 14 dni albo chorobie z objawami po ponad 14 dniach w ciągu 3 miesięcy
//   (art. 7);
// - limit 91 dni nie dotyczy gruźlicy i ciąży (art. 8 ust. 2), a całość nie może przekroczyć okresu zasiłkowego 182 dni,
//   przy gruźlicy i w ciąży 270 dni (art. 8 ust. 1), liczonego od początku niezdolności;
// - brak zasiłku po ustaniu przy emeryturze albo rencie z tytułu niezdolności, pracy lub działalności z ubezpieczeniem
//   chorobowym, zasiłku dla bezrobotnych i świadczeniach przedemerytalnych, ubezpieczeniu rolników (art. 13 ust. 1).
// Daty jako RRRR-MM-DD; „w ciągu 14 dni” liczymy bez dnia ustania (art. 111 § 2 KC), miesiące kalendarzowo (art. 112 KC).
import { dniMiedzy, dodajDni, dodajMiesiace } from './terminy';

export type PrzyczynaPo = 'choroba' | 'zakazna' | 'ciaza' | 'gruzlica';

export interface DanePoUstaniu {
  /** Ostatni dzień zatrudnienia (ubezpieczenia chorobowego). */
  ustanie: string;
  /** Pierwszy dzień niezdolności do pracy. */
  poczatek: string;
  /** Ostatni dzień niezdolności z zaświadczenia lekarskiego. */
  koniec: string;
  przyczyna: PrzyczynaPo;
  /** Któraś z sytuacji z art. 13 ust. 1. */
  wylaczenie?: boolean;
}

export type PowodBraku = 'wylaczenie' | 'za-pozno' | 'za-krotko' | 'brak-dni';

export type WynikPoUstaniu =
  | { przysluguje: false; powod: PowodBraku; ostatniDzienPowstania?: string }
  | { przysluguje: true; od: string; do: string; dni: number; limit91: boolean; powstalaWCzasiePracy: boolean };

export function zasilekPoUstaniu(d: DanePoUstaniu): WynikPoUstaniu {
  if (d.koniec < d.poczatek) throw new RangeError('Koniec przed początkiem');
  if (d.wylaczenie) return { przysluguje: false, powod: 'wylaczenie' };
  const powstalaWCzasiePracy = d.poczatek <= d.ustanie;
  if (!powstalaWCzasiePracy) {
    const ostatniDzienPowstania = d.przyczyna === 'zakazna' ? dodajMiesiace(d.ustanie, 3) : dodajDni(d.ustanie, 14);
    if (d.poczatek > ostatniDzienPowstania) return { przysluguje: false, powod: 'za-pozno', ostatniDzienPowstania };
    if (dniMiedzy(d.poczatek, d.koniec) + 1 < 30) return { przysluguje: false, powod: 'za-krotko' };
  }
  const od = powstalaWCzasiePracy ? dodajDni(d.ustanie, 1) : d.poczatek;
  const okresZasilkowy = d.przyczyna === 'ciaza' || d.przyczyna === 'gruzlica' ? 270 : 182;
  const limit91 = d.przyczyna !== 'ciaza' && d.przyczyna !== 'gruzlica';
  const granice = [d.koniec, dodajDni(d.poczatek, okresZasilkowy - 1)];
  if (limit91) granice.push(dodajDni(od, 90));
  const do_ = granice.sort()[0];
  if (do_ < od) return { przysluguje: false, powod: 'brak-dni' };
  return { przysluguje: true, od, do: do_, dni: dniMiedzy(od, do_) + 1, limit91, powstalaWCzasiePracy };
}
