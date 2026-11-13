// Dodatek wyrównawczy do wynagrodzenia po przeniesieniu do innej pracy.
// Prawo do dodatku i okres:
// - art. 179 § 4 Kodeksu pracy (t.j. Dz.U. 2026 poz. 1245): pracownica w ciąży lub karmiąca piersią, gdy zmiana warunków
//   pracy, skrócenie czasu pracy albo przeniesienie obniża wynagrodzenie; bez limitu czasu, do ustania przyczyn (§ 6);
// - art. 230 § 2 Kp: przeniesienie z powodu objawów choroby zawodowej, przez okres nieprzekraczający 6 miesięcy;
// - art. 231 Kp: przeniesienie na podstawie orzeczenia lekarskiego po wypadku przy pracy lub chorobie zawodowej, gdy pracownik
//   nie został uznany za niezdolnego do pracy w rozumieniu przepisów o emeryturach i rentach; art. 230 § 2 odpowiednio;
// - art. 5 ust. 5–6 ustawy z 13 marca 2003 r. o zwolnieniach z przyczyn niedotyczących pracowników (t.j. Dz.U. 2026
//   poz. 1195): chronieni przy zwolnieniu grupowym, którym wypowiedziano warunki pracy i płacy, do końca okresu ochrony;
// - art. 10 ust. 4 tej ustawy: zwolnienia indywidualne u pracodawcy od 20 pracowników, najwyżej 6 miesięcy; nie przysługuje,
//   gdy ochrona wynika z art. 41 Kp.
// Wysokość (rozporządzenie z 29 maja 1996 r., t.j. Dz.U. 2017 poz. 927, § 7–10 i § 13):
// - § 7: różnica między wynagrodzeniem sprzed przeniesienia a wynagrodzeniem po przeniesieniu, liczonymi według zasad
//   wynagrodzenia za urlop (rozporządzenie z 8 stycznia 1997 r.: składniki stałe w wysokości należnej, zmienne z 3 miesięcy);
// - § 8: część ze stałych stawek miesięcznych zmniejsza się za każdy dzień pracy bez wynagrodzenia (dzielnik: współczynnik
//   z § 19 rozporządzenia urlopowego, § 13 ust. 2; przy niepełnym etacie obniżony proporcjonalnie, § 19 ust. 3), a za dni
//   wynagrodzenia chorobowego lub zasiłku dzieli się przez 30;
// - § 9: składniki godzinowe i zmienne: wynagrodzenie za dzień = zmienne sprzed przeniesienia / dni kalendarzowe, za które
//   przysługiwało wtedy wynagrodzenie; dodatek = za dzień × dni z wynagrodzeniem po przeniesieniu − zmienne po przeniesieniu.
// Interpretacje (przepisy tego nie mówią):
// 1. § 7 wymienia przeniesienie; te same zasady stosujemy do zmiany warunków i skrócenia czasu pracy z art. 179 § 4,
//    a ustawa z 2003 r. odsyła do „zasad wynikających z Kodeksu pracy”, czyli do tego rozporządzenia (art. 297 pkt 2 Kp).
// 2. Okres „nieprzekraczający 6 miesięcy” liczymy od dnia przeniesienia do dnia przed dniem, który datą mu odpowiada
//    (art. 112 KC); gdy takiego dnia nie ma (np. od 31 sierpnia), do ostatniego dnia miesiąca: wariant dłuższy.
// 3. Zmienne „z okresu poprzedzającego przeniesienie”: 3 pełne miesiące przed miesiącem przeniesienia (jak przed urlopem).
// 4. Dni z wynagrodzeniem (§ 9 mówi o „liczbie dni”): dni kalendarzowe; po przeniesieniu dni miesiąca w okresie dodatku
//    minus dni L4 lub zasiłku i dni pracy bez wynagrodzenia.
// 5. Miesiąc tylko częściowo w okresie dodatku: część stałą liczymy proporcjonalnie do dni kalendarzowych w okresie.
// 6. Składników za okresy dłuższe niż miesiąc (§ 10) nie liczymy.
import { dniMiedzy, dodajDni, koniecOkresu } from './terminy';
import { dniWMiesiacu } from './czas-pracy';
import { doGrosza } from './dodatek-nocny';
import { wspolczynnik } from './ekwiwalent';

export type PowodDodatku = 'ciaza' | 'choroba-zawodowa' | 'wypadek' | 'choroba-stwierdzona' | 'grupowe' | 'indywidualne';

export const POWODY: Record<PowodDodatku, { nazwa: string; podstawa: string; miesiace: number | null }> = {
  ciaza: { nazwa: 'Ciąża, karmienie piersią', podstawa: 'art. 179 § 4 Kodeksu pracy', miesiace: null },
  'choroba-zawodowa': { nazwa: 'Objawy choroby zawodowej', podstawa: 'art. 230 § 2 Kodeksu pracy', miesiace: 6 },
  wypadek: { nazwa: 'Wypadek przy pracy', podstawa: 'art. 231 i 230 § 2 Kodeksu pracy', miesiace: 6 },
  'choroba-stwierdzona': { nazwa: 'Choroba zawodowa', podstawa: 'art. 231 i 230 § 2 Kodeksu pracy', miesiace: 6 },
  grupowe: { nazwa: 'Zwolnienie grupowe', podstawa: 'art. 5 ust. 6 ustawy o zwolnieniach grupowych', miesiace: null },
  indywidualne: { nazwa: 'Zwolnienie indywidualne', podstawa: 'art. 10 ust. 4 ustawy o zwolnieniach grupowych', miesiace: 6 },
};

/** Ostatni dzień okresu N miesięcy od dnia `od` włącznie (interpretacja 2, `koniecOkresu` z terminy.ts). */
export const koniecMiesiecy = (od: string, miesiace: number) => koniecOkresu(od, miesiace);

/** Okres dodatku: od dnia przeniesienia do końca (null = bez z góry znanego końca). */
export function okresDodatku(powod: PowodDodatku, od: string, koniecOchrony?: string): { od: string; koniec: string | null } {
  const p = POWODY[powod];
  if (!p) throw new RangeError('Nieznany powód');
  if (powod === 'grupowe') {
    if (!koniecOchrony) return { od, koniec: null };
    if (koniecOchrony < od) throw new RangeError('Koniec ochrony przed przeniesieniem');
    return { od, koniec: koniecOchrony };
  }
  return { od, koniec: p.miesiace ? koniecMiesiecy(od, p.miesiace) : null };
}

/** Dni kalendarzowe 3 pełnych miesięcy przed miesiącem przeniesienia (interpretacja 3). */
export function dniTrzechMiesiecyPrzed(od: string): number {
  const [r, m] = od.split('-').map(Number);
  let suma = 0;
  for (let i = 1; i <= 3; i++) {
    const indeks = r * 12 + (m - 1) - i;
    suma += dniWMiesiacu(Math.floor(indeks / 12), (indeks % 12) + 1);
  }
  return suma;
}

export interface DaneDodatku {
  powod: PowodDodatku;
  /** Dzień przeniesienia (obniżenia wynagrodzenia). */
  od: string;
  koniecOchrony?: string;
  /** Miesiąc rozliczenia. */
  rok: number;
  miesiac: number;
  /** Etat po przeniesieniu (do współczynnika z § 19 rozporządzenia urlopowego). */
  etat?: number;
  /** Stałe składniki miesięczne przed i po przeniesieniu, zł. */
  stalePrzed: number;
  stalePo: number;
  /** Suma składników zmiennych z 3 miesięcy przed przeniesieniem, zł. */
  zmiennePrzed?: number;
  /** Dni kalendarzowe z wynagrodzeniem w tych 3 miesiącach (domyślnie wszystkie dni). */
  dniPrzed?: number;
  /** Składniki zmienne po przeniesieniu w miesiącu rozliczenia, zł. */
  zmiennePo?: number;
  /** Dni L4 (wynagrodzenie chorobowe) albo zasiłku w miesiącu rozliczenia. */
  dniL4?: number;
  /** Dni pracy bez wynagrodzenia (urlop bezpłatny, nieobecność nieusprawiedliwiona). */
  dniBezPlacy?: number;
  /** Dni kalendarzowe z wynagrodzeniem po przeniesieniu w miesiącu rozliczenia (domyślnie wyliczone). */
  dniPo?: number;
}

const iso = (rok: number, miesiac: number, dzien: number) => `${rok}-${String(miesiac).padStart(2, '0')}-${String(dzien).padStart(2, '0')}`;

export function dodatekWyrownawczy(d: DaneDodatku) {
  const okres = okresDodatku(d.powod, d.od, d.koniecOchrony);
  if (!Number.isInteger(d.miesiac) || d.miesiac < 1 || d.miesiac > 12) throw new RangeError('Miesiąc od 1 do 12');
  const etat = d.etat ?? 1;
  if (!(etat > 0 && etat <= 1)) throw new RangeError('Etat od 0 do 1');
  for (const x of [d.stalePrzed, d.stalePo, d.zmiennePrzed ?? 0, d.zmiennePo ?? 0]) if (!(x >= 0 && x < 1_000_000)) throw new RangeError('Kwoty od 0 zł');
  const dniMies = dniWMiesiacu(d.rok, d.miesiac);
  const poczatekMies = iso(d.rok, d.miesiac, 1);
  const koniecMies = iso(d.rok, d.miesiac, dniMies);
  const odW = okres.od > poczatekMies ? okres.od : poczatekMies;
  const doW = okres.koniec && okres.koniec < koniecMies ? okres.koniec : koniecMies;
  const dniWOkresie = doW < odW ? 0 : dniMiedzy(odW, doW) + 1;
  const dniL4 = d.dniL4 ?? 0;
  const dniBezPlacy = d.dniBezPlacy ?? 0;
  if (!Number.isInteger(dniL4) || !Number.isInteger(dniBezPlacy) || dniL4 < 0 || dniBezPlacy < 0 || dniL4 + dniBezPlacy > dniWOkresie) {
    throw new RangeError('Dni L4 i bez wynagrodzenia więcej niż dni w okresie dodatku');
  }
  const dniPrzed = d.dniPrzed ?? dniTrzechMiesiecyPrzed(d.od);
  if (!(Number.isInteger(dniPrzed) && dniPrzed > 0 && dniPrzed <= 92)) throw new RangeError('Dni z 3 miesięcy od 1 do 92');
  const dniPo = d.dniPo ?? dniWOkresie - dniL4 - dniBezPlacy;
  if (!(Number.isInteger(dniPo) && dniPo >= 0 && dniPo <= dniWOkresie)) throw new RangeError('Dni z wynagrodzeniem poza zakresem');
  if (dniWOkresie === 0) return { okres, wOkresie: false as const, dniWOkresie, dniPrzed, dniPo: 0, stala: 0, zmniejszenie: 0, zaDzien: 0, zmienna: 0, dodatek: 0, przysluguje: false, wspolczynnik: 0 };

  // § 8: część stała i jej zmniejszenie (interpretacja 5 dla miesiąca częściowego).
  const roznicaStala = (d.stalePrzed - d.stalePo) * (dniWOkresie / dniMies);
  const wsp = wspolczynnik(d.rok) * etat;
  const zmniejszenie = roznicaStala > 0 ? (roznicaStala / wsp) * dniBezPlacy + (roznicaStala / 30) * dniL4 : 0;
  const stala = doGrosza(roznicaStala) - doGrosza(zmniejszenie);
  // § 9: część zmienna.
  const zaDzien = (d.zmiennePrzed ?? 0) / dniPrzed;
  const zmienna = zaDzien * dniPo - (d.zmiennePo ?? 0);
  const suma = doGrosza(stala) + doGrosza(zmienna);
  return {
    okres,
    wOkresie: true as const,
    dniWOkresie,
    dniPrzed,
    dniPo,
    wspolczynnik: wsp,
    stala: doGrosza(stala),
    zmniejszenie: doGrosza(zmniejszenie),
    zaDzien: doGrosza(zaDzien),
    zmienna: doGrosza(zmienna),
    dodatek: Math.max(0, doGrosza(suma)),
    przysluguje: suma > 0,
  };
}
