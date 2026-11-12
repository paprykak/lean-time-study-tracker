// Odszkodowania przy rozwiązaniu umowy o pracę z naruszeniem prawa (Kodeks pracy): art. 47^1 (wypowiedzenie),
// art. 50 § 1 (okres próbny), art. 55 § 1^1 (pracownik odchodzi z winy pracodawcy), art. 58 (dyscyplinarka), art. 60
// (dyscyplinarka w okresie wypowiedzenia) i art. 61^2 (pracodawca przeciw pracownikowi). O odszkodowaniu orzeka sąd
// pracy; kalkulator pokazuje granice z ustawy.
//
// Kwota według zasad ekwiwalentu za urlop (§ 2 ust. 1 pkt 2–4 rozporządzenia z 29 maja 1996 r., t.j. Dz.U. 2017
// poz. 927): miesięczna kwota to pensja liczona jak do ekwiwalentu, 2 tygodnie to połowa miesięcznej kwoty (§ 2 ust. 2
// mówi to wprost przy art. 55 § 1^1 i 61^2; przy art. 47^1 i 58 przyjmujemy tak samo, co strona opisuje), a należność
// za dni pracy to miesięczna kwota przez współczynnik z § 19 rozporządzenia urlopowego razy liczba dni pracy (§ 2a).
import { doGrosza } from './dodatek-nocny';
import { wspolczynnik } from './ekwiwalent';

export type Sytuacja = 'wypowiedzenie' | 'dyscyplinarka' | 'w-wypowiedzeniu' | 'probny' | 'z-winy-pracodawcy' | 'od-pracownika';
export type OkresWypowiedzenia = '2t' | '1m' | '3m';

/** Okres wypowiedzenia w miesiącach (2 tygodnie = pół miesiąca, § 2 ust. 2 rozporządzenia). */
export const MIESIACE: Record<OkresWypowiedzenia, number> = { '2t': 0.5, '1m': 1, '3m': 3 };
export const NAZWA_OKRESU: Record<OkresWypowiedzenia, string> = { '2t': '2 tygodnie', '1m': '1 miesiąc', '3m': '3 miesiące' };

export interface OpisSytuacji {
  nazwa: string;
  podstawa: string;
  /** Czy wynik zależy od okresu wypowiedzenia. */
  okres: boolean;
  /** Czy wynik zależy od rodzaju umowy (nieokreślona albo określona). */
  umowa: boolean;
  /** Kiedy potrzebna jest liczba dni pracy: zawsze, przy umowie na czas określony, nigdy. */
  dni: 'zawsze' | 'okreslona' | 'nigdy';
  /** Etykieta pola z dniami pracy. */
  etykietaDni: string;
}

export const SYTUACJE: Record<Sytuacja, OpisSytuacji> = {
  wypowiedzenie: {
    nazwa: 'Bezprawne wypowiedzenie',
    podstawa: 'art. 45 i 47¹ Kodeksu pracy',
    okres: true,
    umowa: true,
    dni: 'okreslona',
    etykietaDni: 'Dni pracy do końca umowy',
  },
  dyscyplinarka: {
    nazwa: 'Bezprawna dyscyplinarka',
    podstawa: 'art. 56 i 58 Kodeksu pracy',
    okres: true,
    umowa: true,
    dni: 'okreslona',
    etykietaDni: 'Dni pracy do końca umowy',
  },
  'w-wypowiedzeniu': {
    nazwa: 'Dyscyplinarka w wypowiedzeniu',
    podstawa: 'art. 60 Kodeksu pracy',
    okres: false,
    umowa: false,
    dni: 'zawsze',
    etykietaDni: 'Dni pracy do końca okresu wypowiedzenia',
  },
  probny: {
    nazwa: 'Wypowiedzenie okresu próbnego',
    podstawa: 'art. 50 § 1 Kodeksu pracy',
    okres: false,
    umowa: false,
    dni: 'zawsze',
    etykietaDni: 'Dni pracy do końca okresu próbnego',
  },
  'z-winy-pracodawcy': {
    nazwa: 'Odchodzę z winy pracodawcy',
    podstawa: 'art. 55 § 1¹ Kodeksu pracy',
    okres: true,
    umowa: true,
    dni: 'okreslona',
    etykietaDni: 'Dni pracy do końca umowy',
  },
  'od-pracownika': {
    nazwa: 'Pracodawca żąda odszkodowania',
    podstawa: 'art. 61¹ i 61² Kodeksu pracy',
    okres: true,
    umowa: true,
    dni: 'okreslona',
    etykietaDni: 'Dni pracy do końca umowy',
  },
};

export interface DaneOdszkodowania {
  sytuacja: Sytuacja;
  /** Miesięczne wynagrodzenie liczone jak do ekwiwalentu za urlop (stała pensja plus średnia składników zmiennych). */
  pensja: number;
  okres?: OkresWypowiedzenia;
  /** Umowa na czas określony. */
  okreslona?: boolean;
  /** Dni pracy według rozkładu do końca umowy, okresu wypowiedzenia albo okresu próbnego. */
  dniPracy?: number;
  /** Rok, z którego bierzemy współczynnik dni pracy (§ 19 rozporządzenia urlopowego). */
  rok: number;
}

export interface WynikOdszkodowania {
  /** Najniższa i najwyższa kwota z ustawy; równe, gdy ustawa wskazuje jedną kwotę. */
  od: number;
  do: number;
  /** Miara z ustawy słowami. */
  miara: string;
  /** Wariant dla umowy na czas określony, która już minęła albo zaraz minie (art. 47^1 zdanie drugie). */
  doKoncaUmowy?: number;
  /** Za dzień pracy (§ 2a). */
  zaDzien: number;
  /** Czy kwota za 2 tygodnie jako połowa miesięcznej wynika wprost z § 2 ust. 2 rozporządzenia. */
  polowaWprost: boolean;
}

export function odszkodowanieZaZwolnienie(d: DaneOdszkodowania): WynikOdszkodowania {
  const s = SYTUACJE[d.sytuacja];
  if (!s) throw new RangeError('Nieznana sytuacja');
  if (!(d.pensja > 0)) throw new RangeError('Pensja musi być dodatnia');
  const okres = d.okres ?? '1m';
  const okreslona = s.umowa && Boolean(d.okreslona);
  const potrzebaDni = s.dni === 'zawsze' || (s.dni === 'okreslona' && okreslona);
  if (potrzebaDni && !(Number.isInteger(d.dniPracy) && (d.dniPracy as number) >= 0 && (d.dniPracy as number) <= 400)) {
    throw new RangeError('Podaj liczbę dni pracy');
  }
  const zaDzien = d.pensja / wspolczynnik(d.rok);
  const zaDni = (n: number) => doGrosza(zaDzien * n);
  const zaOkres = doGrosza(d.pensja * MIESIACE[okres]);
  const trzyMiesiace = doGrosza(d.pensja * 3);
  const polowaWprost = d.sytuacja === 'z-winy-pracodawcy' || d.sytuacja === 'od-pracownika';
  const wynik = (od: number, do_: number, miara: string, doKoncaUmowy?: number): WynikOdszkodowania => ({
    od,
    do: do_,
    miara,
    doKoncaUmowy,
    zaDzien: doGrosza(zaDzien),
    polowaWprost: polowaWprost || !(s.okres && okres === '2t'),
  });

  switch (d.sytuacja) {
    case 'wypowiedzenie': {
      const od = doGrosza(d.pensja * Math.max(0.5, MIESIACE[okres]));
      const miara = 'od 2 tygodni do 3 miesięcy wynagrodzenia, nie mniej niż za okres wypowiedzenia';
      return wynik(od, trzyMiesiace, miara, okreslona ? Math.min(zaDni(d.dniPracy!), trzyMiesiace) : undefined);
    }
    case 'dyscyplinarka':
    case 'z-winy-pracodawcy':
    case 'od-pracownika': {
      if (!okreslona) return wynik(zaOkres, zaOkres, `wynagrodzenie za okres wypowiedzenia (${NAZWA_OKRESU[okres]})`);
      const kwota = Math.min(zaDni(d.dniPracy!), zaOkres);
      return wynik(kwota, kwota, 'wynagrodzenie za czas do końca umowy, nie więcej niż za okres wypowiedzenia');
    }
    case 'w-wypowiedzeniu': {
      const kwota = zaDni(d.dniPracy!);
      return wynik(kwota, kwota, 'wynagrodzenie za czas do końca okresu wypowiedzenia');
    }
    case 'probny': {
      const kwota = zaDni(d.dniPracy!);
      return wynik(kwota, kwota, 'wynagrodzenie za czas do końca okresu próbnego');
    }
  }
}

/** Wynagrodzenie za czas bez pracy po przywróceniu do pracy wyrokiem (art. 47 i 57 Kp), słowami. */
export function zaCzasBezPracy(sytuacja: Sytuacja, okres: OkresWypowiedzenia): string | null {
  if (sytuacja === 'wypowiedzenie') return okres === '3m' ? 'najwyżej za 1 miesiąc (art. 47)' : 'najwyżej za 2 miesiące (art. 47)';
  if (sytuacja === 'dyscyplinarka') return 'od 1 do 3 miesięcy (art. 57 § 1)';
  return null;
}
