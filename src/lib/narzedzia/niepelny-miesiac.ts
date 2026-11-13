// Wynagrodzenie w stałej stawce miesięcznej za przepracowaną część miesiąca (rozporządzenie MPiPS z 29 maja 1996 r.,
// t.j. Dz.U. 2017 poz. 927, bez zmian po tekście jednolitym według API Sejmu):
// - § 11 ust. 1–2: gdy za pozostałą część miesiąca przysługuje wynagrodzenie chorobowe (art. 92 Kp) albo zasiłek z ustawy
//   zasiłkowej lub wypadkowej: stawkę dzieli się przez 30, mnoży przez liczbę dni z zaświadczenia lekarskiego (dni
//   kalendarzowe, z wolnymi) i odejmuje od wynagrodzenia za cały miesiąc;
// - § 12 ust. 1: nieobecność z innych przyczyn bez prawa do wynagrodzenia (urlop bezpłatny, nieobecność nieusprawiedliwiona):
//   stawka dzielona przez liczbę godzin przypadających do przepracowania w danym miesiącu, razy godziny nieobecności,
//   odjęte od wynagrodzenia za cały miesiąc;
// - § 12 ust. 2: to samo, gdy stosunek pracy nie obejmuje pełnego miesiąca (przyjęcie albo odejście w trakcie miesiąca);
// - art. 80 Kp: wynagrodzenie przysługuje za pracę wykonaną;
// - płaca minimalna (ustawa o minimalnym wynagrodzeniu, t.j. Dz.U. 2024 poz. 1773): gdy nie przysługuje wynagrodzenie za
//   pełny miesięczny wymiar, wyrównanie za każdą godzinę pracy do płacy minimalnej podzielonej przez godziny do przepracowania
//   w miesiącu w pełnym wymiarze (art. 7 ust. 4), przy niepełnym etacie odpowiednio (art. 8).
// Interpretacje (przepisy tego nie rozstrzygają):
// 1. „Godziny do przepracowania w miesiącu” domyślnie z wymiaru (art. 130 § 1–2 Kp) razy etat; można wpisać godziny z grafiku.
// 2. Godziny w dniach umowy przy przyjęciu albo odejściu w trakcie miesiąca: 8 h razy etat za każdy dzień od poniedziałku
//    do piątku w okresie umowy, minus 8 h razy etat za każde święto poza niedzielą w tym okresie (art. 130 zastosowany do
//    części miesiąca); godziny poza umową = godziny miesiąca minus godziny w dniach umowy.
// 3. L4 razem z inną nieobecnością albo z umową przez część miesiąca: odejmujemy obie kwoty (każdy paragraf każe odjąć
//    swoją kwotę od wynagrodzenia za cały miesiąc). Wynik ujemny zamieniamy na 0 zł i oznaczamy.
// 4. L4 albo zasiłek przez wszystkie dni umowy w miesiącu: § 11 dotyczy przepracowanej części miesiąca, więc zostaje art. 80
//    i wynagrodzenie zasadnicze wynosi 0 zł (wzór dałby w lutym 2/30 stawki, a w miesiącu 31-dniowym −1/30).
// 4a. L4 bez prawa do wynagrodzenia chorobowego i zasiłku (np. okres wyczekiwania) nie podpada ani pod § 11, ani pod § 12
//    (ten wyłącza chorobę); liczymy je jak inne L4, przez 30.
// 5. Potrącenia zaokrąglamy do grosza i odejmujemy od stawki, żeby rozbicie sumowało się do wyniku.
// 6. Wyrównanie do płacy minimalnej liczymy tylko bez L4 (godzin pracy przypadających w dniach L4 nie znamy) i tylko
//    ze stawki zasadniczej; do porównania liczą się też inne składniki z art. 6 ust. 4 ustawy.
import { PLACA_MINIMALNA } from '../../data/prawo';
import { dniWMiesiacu, swieta, wymiarMiesiaca } from './czas-pracy';
import { doGrosza } from './dodatek-nocny';
import { zl } from './format';
import { odmiana } from '../redakcja';

export interface DaneMiesiaca {
  rok: number;
  miesiac: number;
  /** Miesięczna stawka w stałej wysokości, zł brutto. */
  stawka: number;
  /** Wymiar etatu (0–1]. */
  etat?: number;
  /** Pierwszy dzień umowy w tym miesiącu (1–31), domyślnie 1. */
  od?: number;
  /** Ostatni dzień umowy w tym miesiącu, domyślnie ostatni dzień miesiąca. */
  do?: number;
  /** Dni kalendarzowe zwolnienia lekarskiego albo zasiłku w tym miesiącu. */
  dniL4?: number;
  /** Godziny innej nieobecności bez prawa do wynagrodzenia. */
  godzinyNieobecnosci?: number;
  /** Godziny do przepracowania w miesiącu według grafiku (domyślnie wymiar × etat). */
  godzinyMiesiaca?: number;
  /** Godziny do przepracowania w dniach umowy (domyślnie z kalendarza × etat). */
  godzinyUmowy?: number;
}

const tydzien = (rok: number, miesiac: number, dzien: number) => new Date(Date.UTC(rok, miesiac - 1, dzien)).getUTCDay();

/** Godziny do przepracowania przy pełnym etacie w dniach od–do jednego miesiąca (art. 130 § 1–2 Kp zastosowany do części miesiąca). */
export function wymiarCzesci(rok: number, miesiac: number, od: number, do_: number): number {
  let godziny = 0;
  for (let d = od; d <= do_; d++) {
    const t = tydzien(rok, miesiac, d);
    if (t >= 1 && t <= 5) godziny += 8;
  }
  const prefiks = `${rok}-${String(miesiac).padStart(2, '0')}-`;
  for (const s of swieta(rok)) {
    if (!s.data.startsWith(prefiks)) continue;
    const d = Number(s.data.slice(8, 10));
    if (d >= od && d <= do_ && tydzien(rok, miesiac, d) !== 0) godziny -= 8;
  }
  return godziny;
}

export function niepelnyMiesiac(d: DaneMiesiaca) {
  const placa = PLACA_MINIMALNA[d.rok];
  if (!placa) throw new RangeError(`Brak płacy minimalnej na ${d.rok} r.`);
  if (!Number.isInteger(d.miesiac) || d.miesiac < 1 || d.miesiac > 12) throw new RangeError('Miesiąc od 1 do 12');
  const S = d.stawka;
  if (!(S > 0 && S < 1_000_000)) throw new RangeError('Stawka musi być dodatnia');
  const etat = d.etat ?? 1;
  if (!(etat > 0 && etat <= 1)) throw new RangeError('Etat od 0 do 1');
  const dniMies = dniWMiesiacu(d.rok, d.miesiac);
  const od = d.od ?? 1;
  const do_ = d.do ?? dniMies;
  if (!Number.isInteger(od) || !Number.isInteger(do_) || od < 1 || do_ > dniMies || do_ < od) throw new RangeError('Dni umowy poza miesiącem');
  const pelnyMiesiac = od === 1 && do_ === dniMies;
  const dniUmowy = do_ - od + 1;
  const dniL4 = d.dniL4 ?? 0;
  if (!Number.isInteger(dniL4) || dniL4 < 0 || dniL4 > dniUmowy) throw new RangeError('Dni L4 więcej niż dni umowy w miesiącu');
  const wymiar = wymiarMiesiaca(d.rok, d.miesiac).godziny;
  const godzinyMiesiaca = d.godzinyMiesiaca ?? wymiar * etat;
  if (!(godzinyMiesiaca > 0 && godzinyMiesiaca <= 744)) throw new RangeError('Godziny do przepracowania w miesiącu muszą być dodatnie');
  const godzinyUmowy = pelnyMiesiac ? godzinyMiesiaca : (d.godzinyUmowy ?? wymiarCzesci(d.rok, d.miesiac, od, do_) * etat);
  if (!(godzinyUmowy >= 0 && godzinyUmowy <= godzinyMiesiaca)) throw new RangeError('Godziny w dniach umowy większe niż w miesiącu');
  const godzinyNieobecnosci = d.godzinyNieobecnosci ?? 0;
  if (!(godzinyNieobecnosci >= 0 && godzinyNieobecnosci <= godzinyUmowy)) throw new RangeError('Godziny nieobecności większe niż godziny w dniach umowy');
  const godzinyPoza = godzinyMiesiaca - godzinyUmowy;

  const zaDzienL4 = S / 30;
  const zaGodzine = S / godzinyMiesiaca;
  const potracenieL4 = doGrosza(zaDzienL4 * dniL4);
  const potracenieNieobecnosci = doGrosza(zaGodzine * godzinyNieobecnosci);
  const potraceniePozaUmowa = doGrosza(zaGodzine * godzinyPoza);
  const surowe = doGrosza(S - potracenieL4 - potracenieNieobecnosci - potraceniePozaUmowa);
  const calyMiesiacL4 = dniL4 > 0 && dniL4 === dniUmowy;
  const ujemne = !calyMiesiacL4 && surowe < 0;
  const wynagrodzenie = calyMiesiacL4 ? 0 : Math.max(0, surowe);

  // Płaca minimalna za przepracowane godziny (art. 7 ust. 4 i art. 8): tylko bez L4.
  let minimum: number | null = null;
  let wyrownanie = 0;
  if (dniL4 === 0) {
    const przepracowane = godzinyUmowy - godzinyNieobecnosci;
    const pelnyWymiar = godzinyMiesiaca / etat;
    minimum = doGrosza((placa.miesiecznie / pelnyWymiar) * przepracowane);
    wyrownanie = Math.max(0, doGrosza(minimum - wynagrodzenie));
  }

  return {
    wymiar,
    godzinyMiesiaca,
    godzinyUmowy,
    godzinyPoza,
    dniMies,
    dniUmowy,
    pelnyMiesiac,
    zaDzienL4: doGrosza(zaDzienL4),
    zaGodzine: doGrosza(zaGodzine),
    potracenieL4,
    potracenieNieobecnosci,
    potraceniePozaUmowa,
    calyMiesiacL4,
    ujemne,
    wynagrodzenie,
    minimum,
    wyrownanie,
  };
}

/** Teksty wyniku zależne od rachunku, te same w HTML i w skrypcie (przeglądarka przepuszcza je przez typografię). */
export function tekstyWyniku(r: ReturnType<typeof niepelnyMiesiac>, dniL4: number) {
  const uwagi: string[] = [];
  if (r.calyMiesiacL4) uwagi.push('L4 obejmuje wszystkie dni umowy w tym miesiącu, więc pensja zasadnicza wynosi 0 zł: wynagrodzenie należy się za pracę wykonaną (art. 80 Kodeksu pracy). Za te dni należy się wynagrodzenie chorobowe albo zasiłek.');
  else if (r.ujemne) uwagi.push('Potrącenia przekraczają pensję, więc pokazujemy 0 zł. Przepis nie mówi, co wtedy: zapytaj dział kadr o sposób rozliczenia.');
  else if (dniL4) uwagi.push(`Za ${odmiana(dniL4, ['dzień', 'dni', 'dni'])} L4 dostajesz osobno wynagrodzenie chorobowe albo zasiłek. Pensję dzieli się zawsze przez 30, bez względu na liczbę dni w miesiącu.`);
  if (r.wyrownanie > 0) uwagi.push(`Za przepracowane godziny należy się co najmniej ${zl(r.minimum!)} (płaca minimalna za godzinę), czyli wyrównanie ${zl(r.wyrownanie)}, jeśli pensja to jedyny składnik wliczany do płacy minimalnej.`);
  else if (!dniL4 && r.minimum !== null) uwagi.push(`Płaca minimalna za przepracowane godziny: ${zl(r.minimum)}. Pensja nie jest od niej niższa.`);
  return {
    opis: dniL4 ? 'Bez wynagrodzenia chorobowego lub zasiłku za dni L4' : 'Za stałą pensję, bez dodatków za wykonaną pracę',
    l4Etykieta: `Minus L4 (${zl(r.zaDzienL4)} za dzień)`,
    uwaga: uwagi.join(' '),
  };
}
