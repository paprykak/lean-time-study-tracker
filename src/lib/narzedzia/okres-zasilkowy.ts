// Okres zasiłkowy (ustawa zasiłkowa, tekst jednolity Dz.U. 2026 poz. 854):
// - zasiłek najwyżej przez 182 dni, przy gruźlicy i w ciąży 270 (art. 8 ust. 1);
// - do okresu wlicza się wszystkie okresy niezdolności do pracy (art. 9 ust. 1), także te, za które płaci pracodawca,
//   i poprzednie niezdolności, jeśli przerwa między nimi nie przekraczała 60 dni (ust. 2 zd. 1); gdy po przerwie
//   niezdolność wystąpiła w trakcie ciąży, okresów sprzed przerwy się nie wlicza (ust. 2 zd. 2);
// - przerwa to dni między ostatnim dniem poprzedniego a pierwszym dniem kolejnego zwolnienia, bez nich samych;
//   nowy okres zasiłkowy zaczyna zwolnienie po przerwie co najmniej 61 dni.
// Nie uwzględniamy art. 9 ust. 3 (niezdolność w okresie wyczekiwania z art. 4 ust. 1).
import { dniMiedzy, dodajDni } from './terminy';

export type PrzyczynaZwolnienia = 'choroba' | 'gruzlica' | 'ciaza';
export const MAKS_PRZERWA = 60;
export const LIMIT: Record<PrzyczynaZwolnienia, number> = { choroba: 182, gruzlica: 270, ciaza: 270 };

export interface Zwolnienie {
  od: string;
  do: string;
}

/** Sortuje i scala zwolnienia nachodzące na siebie albo stykające się (bez dnia przerwy). */
export function scal(lista: Zwolnienie[]): Zwolnienie[] {
  const posortowane = [...lista].sort((a, b) => (a.od < b.od ? -1 : a.od > b.od ? 1 : 0));
  const wynik: Zwolnienie[] = [];
  for (const z of posortowane) {
    if (z.do < z.od) throw new RangeError('Koniec zwolnienia przed początkiem');
    const ostatnie = wynik[wynik.length - 1];
    if (ostatnie && z.od <= dodajDni(ostatnie.do, 1)) {
      if (z.do > ostatnie.do) ostatnie.do = z.do;
    } else wynik.push({ ...z });
  }
  return wynik;
}

const dni = (z: Zwolnienie) => dniMiedzy(z.od, z.do) + 1;

export function okresZasilkowy(lista: Zwolnienie[], przyczyna: PrzyczynaZwolnienia) {
  if (!lista.length) throw new RangeError('Brak zwolnień');
  const zw = scal(lista);
  const limit = LIMIT[przyczyna];
  // Łańcuch od ostatniego zwolnienia wstecz, dopóki przerwy nie przekraczają 60 dni.
  let poczatek = zw.length - 1;
  for (let i = zw.length - 2; i >= 0; i--) {
    const przerwa = dniMiedzy(zw[i].do, zw[i + 1].od) - 1;
    if (przerwa > MAKS_PRZERWA) break;
    if (przyczyna === 'ciaza' && i === zw.length - 2) break;
    poczatek = i;
  }
  const lancuch = zw.slice(poczatek);
  const wykorzystane = lancuch.reduce((s, z) => s + dni(z), 0);
  const ostatnie = lancuch[lancuch.length - 1];
  const przedOstatnim = wykorzystane - dni(ostatnie);
  // Dzień, w którym kończy się limit: w ostatnim zwolnieniu, gdyby trwało dalej, albo wcześniej, gdy limit już minął.
  let koniecLimitu: string;
  if (przedOstatnim >= limit) {
    let suma = 0;
    koniecLimitu = lancuch[0].od;
    for (const z of lancuch) {
      if (suma + dni(z) >= limit) {
        koniecLimitu = dodajDni(z.od, limit - suma - 1);
        break;
      }
      suma += dni(z);
    }
  } else koniecLimitu = dodajDni(ostatnie.od, limit - przedOstatnim - 1);
  return {
    limit,
    poczatekOkresu: lancuch[0].od,
    zwolnienWOkresie: lancuch.length,
    wykorzystane: Math.min(wykorzystane, limit),
    ponadLimit: Math.max(0, wykorzystane - limit),
    zostalo: Math.max(0, limit - wykorzystane),
    koniecLimitu,
    nowyOkresOd: dodajDni(ostatnie.do, MAKS_PRZERWA + 2),
  };
}
