// Netto z umowy zlecenia za miesiąc. Status zleceniobiorcy decyduje o składkach:
// - „jedyne”: emerytalna i rentowe obowiązkowo (art. 6 ust. 1 pkt 4 ustawy systemowej), chorobowa dobrowolnie (art. 11 ust. 2);
// - „etat”: etat u innego pracodawcy z pensją co najmniej minimalną, składki ze zlecenia dobrowolne (art. 9 ust. 1 i 1a),
//   zdrowotna obowiązkowa z każdego tytułu (art. 66 ust. 1 pkt 1 lit. e i art. 82 ust. 1 ustawy o świadczeniach);
// - „student”: uczeń lub student do 26 lat, bez składek (art. 6 ust. 4 ustawy systemowej), bez zdrowotnej (art. 66 ust. 1
//   pkt 1: obowiązek dotyczy osób spełniających warunki do ubezpieczeń społecznych) i bez podatku do 85 528 zł w roku
//   (art. 21 ust. 1 pkt 148 lit. b ustawy o PIT).
// Koszty: 20% przychodu pomniejszonego o składki społeczne (art. 22 ust. 9 pkt 4), zaliczka 12% (art. 41 ust. 1), PIT-2
// pomniejsza ją o 300 zł (art. 31b), zaokrąglenia do pełnych złotych (art. 63 § 1 Ordynacji podatkowej).
import { doGrosza } from './dodatek-nocny';
import { KWOTA_ZMNIEJSZAJACA, STOPY } from './netto';

export type StatusZleceniobiorcy = 'jedyne' | 'etat' | 'student';

export interface DaneZlecenia {
  brutto: number;
  status?: StatusZleceniobiorcy;
  /** Dobrowolne ubezpieczenie chorobowe (tylko gdy zlecenie jest jedynym tytułem). */
  chorobowe?: boolean;
  pit2?: boolean;
  /** Do 26 lat bez nauki: składki jak zwykle, ale bez podatku (art. 21 ust. 1 pkt 148). */
  ulgaMlodych?: boolean;
}

const zl = (x: number) => Math.round(x);

export function nettoZlecenie(d: DaneZlecenia) {
  if (!(d.brutto > 0 && d.brutto < 1_000_000)) throw new RangeError('Brutto musi być dodatnie');
  const status = d.status ?? 'jedyne';
  const B = d.brutto;
  const zSkladkami = status === 'jedyne';
  const emerytalna = zSkladkami ? doGrosza((B * STOPY.emerytalna) / 100) : 0;
  const rentowa = zSkladkami ? doGrosza((B * STOPY.rentowa) / 100) : 0;
  const chorobowa = zSkladkami && d.chorobowe ? doGrosza((B * STOPY.chorobowa) / 100) : 0;
  const spoleczne = doGrosza(emerytalna + rentowa + chorobowa);
  const zdrowotna = status === 'student' ? 0 : doGrosza(((B - spoleczne) * STOPY.zdrowotna) / 100);
  const bezPodatku = status === 'student' || d.ulgaMlodych === true;
  const koszty = bezPodatku ? 0 : doGrosza(((B - spoleczne) * 20) / 100);
  const podstawa = bezPodatku ? 0 : Math.max(0, zl(B - spoleczne - koszty));
  const zaliczka = bezPodatku ? 0 : Math.max(0, zl((podstawa * STOPY.pit) / 100 - (d.pit2 ? KWOTA_ZMNIEJSZAJACA / 12 : 0)));
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
    netto: doGrosza(B - spoleczne - zdrowotna - zaliczka),
    /** Umowa do 200 zł z osobą niebędącą pracownikiem płatnika: podatek zryczałtowany 12% (art. 30 ust. 1 pkt 5a). */
    malaUmowa: B <= 200 && !bezPodatku,
  };
}
