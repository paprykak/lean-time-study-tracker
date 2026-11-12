// Wynagrodzenie netto z umowy o pracę za miesiąc, przy dochodach od początku roku poniżej progu 120 000 zł i poniżej rocznego
// limitu składek emerytalnej i rentowych. Składki pracownika: emerytalna 9,76%, rentowe 1,5%, chorobowa 2,45% (art. 16 i 22
// ustawy o systemie ubezpieczeń społecznych), każda zaokrąglona do grosza. Zdrowotna: 9% (art. 79 ust. 1 ustawy
// o świadczeniach opieki zdrowotnej) od podstawy pomniejszonej o składki pracownika (art. 81 ust. 6). Zaliczka na PIT
// (art. 32 ust. 2 i 4 ustawy o PIT): 12% dochodu (przychód minus koszty 250 albo 300 zł z art. 22 ust. 2 pkt 1 i 3 minus
// składki społeczne), pomniejszona o 1/12 kwoty zmniejszającej podatek 3600 zł (art. 27 ust. 1, art. 31b) przy PIT-2;
// podstawa i zaliczka zaokrąglone do pełnych złotych (art. 63 § 1 Ordynacji podatkowej). Do 26 lat przychody do 85 528 zł
// w roku są wolne od podatku (art. 21 ust. 1 pkt 148). Kontrola: 4806 zł brutto → 3605,85 zł netto (koszty 250 zł, PIT-2).
import { doGrosza } from './dodatek-nocny';

export const STOPY = { emerytalna: 9.76, rentowa: 1.5, chorobowa: 2.45, zdrowotna: 9, pit: 12 } as const;
export const KWOTA_ZMNIEJSZAJACA = 3600;
export const PROG_PIT = 120_000;
export const LIMIT_ULGI_MLODYCH = 85_528;

export interface DaneNetto {
  brutto: number;
  /** Koszty uzyskania przychodów 300 zł (dojazd z innej miejscowości, art. 22 ust. 2 pkt 3). */
  kosztyPodwyzszone?: boolean;
  /** Złożony PIT-2: zaliczka pomniejszona o 300 zł (1/12 z 3600 zł). */
  pit2?: boolean;
  /** Do 26 lat, przychody w roku do 85 528 zł: bez zaliczki (art. 21 ust. 1 pkt 148). */
  ulgaMlodych?: boolean;
  /**
   * Wpłaty do PPK w procentach wynagrodzenia: wpłata pracodawcy zwiększa przychód do opodatkowania (nie jest podstawą
   * składek, art. 26 ust. 5 ustawy o PPK), a wpłata pracownika zmniejsza wypłatę.
   */
  ppk?: { pracownik: number; pracodawca: number };
}

const zl = (x: number) => Math.round(x);

export function netto(d: DaneNetto) {
  if (!(d.brutto > 0 && d.brutto < 1_000_000)) throw new RangeError('Brutto musi być dodatnie');
  const pit2 = d.pit2 ?? true;
  const B = d.brutto;
  const emerytalna = doGrosza((B * STOPY.emerytalna) / 100);
  const rentowa = doGrosza((B * STOPY.rentowa) / 100);
  const chorobowa = doGrosza((B * STOPY.chorobowa) / 100);
  const spoleczne = doGrosza(emerytalna + rentowa + chorobowa);
  const zdrowotna = doGrosza(((B - spoleczne) * STOPY.zdrowotna) / 100);
  const ppkPracodawca = d.ppk ? doGrosza((B * d.ppk.pracodawca) / 100) : 0;
  const ppkPracownik = d.ppk ? doGrosza((B * d.ppk.pracownik) / 100) : 0;
  const koszty = d.ulgaMlodych ? 0 : d.kosztyPodwyzszone ? 300 : 250;
  const podstawa = d.ulgaMlodych ? 0 : Math.max(0, zl(B + ppkPracodawca - koszty - spoleczne));
  const zaliczka = d.ulgaMlodych ? 0 : Math.max(0, zl((podstawa * STOPY.pit) / 100 - (pit2 ? KWOTA_ZMNIEJSZAJACA / 12 : 0)));
  // Art. 83 ust. 1 i 2a ustawy o świadczeniach: składka nie wyższa niż zaliczka liczona według przepisów o PIT z 2021 r.
  // (17%, kwota zmniejszająca 525,12 zł rocznie). Przy przychodach z tego kalkulatora wiąże tylko przy bardzo niskich
  // kwotach; wtedy pokazujemy ostrzeżenie zamiast pewnego wyniku.
  const zaliczka2021 = Math.max(0, zl(Math.max(0, zl(B + ppkPracodawca - (d.kosztyPodwyzszone ? 300 : 250) - spoleczne)) * 0.17 - (pit2 ? 43.76 : 0)));
  const mozliweObnizenieZdrowotnej = zdrowotna > zaliczka2021;
  return {
    brutto: B,
    emerytalna,
    rentowa,
    chorobowa,
    spoleczne,
    zdrowotna,
    koszty,
    podstawa,
    zaliczka,
    ppkPracownik,
    ppkPracodawca,
    netto: doGrosza(B - spoleczne - zdrowotna - zaliczka - ppkPracownik),
    mozliweObnizenieZdrowotnej,
    /** Przy takiej pensji dochód przekroczy w roku próg 120 000 zł: w ostatnich miesiącach zaliczka 32%. */
    progPrzekroczony: !d.ulgaMlodych && podstawa * 12 > PROG_PIT,
  };
}
