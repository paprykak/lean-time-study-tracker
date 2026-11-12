// Praca w dniu wolnym z przeciętnie pięciodniowego tygodnia pracy (zwykle w wolną sobotę). Kodeks pracy,
// t.j. Dz.U. 2026 poz. 1245:
// - art. 151^3: za pracę w dniu wolnym wynikającym z rozkładu czasu pracy w przeciętnie pięciodniowym tygodniu pracy,
//   wykonywaną ze względu na okoliczności z art. 151 § 1, przysługuje „inny dzień wolny od pracy” udzielony do końca
//   okresu rozliczeniowego, w terminie uzgodnionym z pracownikiem;
// - art. 151 § 1: nadgodziny są dopuszczalne przy akcji ratowniczej albo szczególnych potrzebach pracodawcy;
//   § 3: przy szczególnych potrzebach najwyżej 150 godzin w roku kalendarzowym;
// - art. 129 § 1: 8 godzin na dobę i przeciętnie 40 godzin w przeciętnie pięciodniowym tygodniu;
// - art. 151^1 § 1: oprócz normalnego wynagrodzenia dodatek 100% za nadgodziny w nocy (pkt 1 lit. a), w niedziele
//   i święta (lit. b) i w dniu wolnym za niedzielę lub święto (lit. c), 50% w każdy inny dzień (pkt 2);
//   § 2: 100% za każdą nadgodzinę z przekroczenia przeciętnej tygodniowej normy, chyba że przekroczenie wynika
//   z nadgodzin, za które już przysługuje dodatek z § 1;
// - art. 151^7 § 1: pora nocna to 8 godzin między 21:00 a 7:00 (początek wybiera pracodawca: 21:00, 22:00 albo 23:00).
// Niedziele i święta mają osobne zasady (art. 151^9–151^11) i osobne narzędzie (/narzedzia/praca-w-niedziele).
//
// Przyjęte interpretacje (decyzje redakcji):
// - Termin dnia wolnego = ostatni dzień okresu rozliczeniowego liczonego od stycznia (okresZawierajacy). Przepis podaje
//   tylko koniec okresu i uzgodnienie terminu z pracownikiem; nie mówi, czy dzień wolny można dać wcześniej niż praca.
// - Należy się cały dzień wolny bez względu na liczbę godzin: przepis mówi o „innym dniu wolnym od pracy”,
//   a nie o czasie wolnym w liczbie przepracowanych godzin.
// - Kolejność godzin: pierwsze 8 godzin pracy tego dnia (art. 129 § 1), potem godziny po 8. godzinie = nadgodziny dobowe.
//   Zakładamy, że zmiana zaczyna się co najmniej 24 godziny po początku poprzedniej (doba pracownicza, art. 128 § 3 pkt 1).
// - Wariant A (dzień wolny udzielony): pierwsze 8 h bez dodatku, rozlicza je dzień wolny (pensję za nie pokrywa
//   wynagrodzenie za miesiąc); godziny po 8.: normalne wynagrodzenie + dodatek 100% za te w porze nocnej, 50% za
//   pozostałe (art. 151^1 § 1). Wolna sobota nie jest dniem z pkt 1 lit. b–c.
// - Wariant B (dnia wolnego nie udzielono do końca okresu): pierwsze 8 h to nadgodziny z przekroczenia przeciętnej
//   tygodniowej normy, dodatek 100% (art. 151^1 § 2); godziny po 8. jak w A (mają już dodatek, więc § 2 ich nie podwaja).
//   Normalne wynagrodzenie należy się za wszystkie godziny tego dnia, bo są ponad wymiar okresu. Zakładamy, że w pozostałe
//   dni okresu pracujesz według grafiku (bez niedopracowań).
// - Zmiana może przechodzić przez północ, trwa krócej niż 24 h (koniec = początek to błąd). Gdy zmiana z dnia przed
//   niedzielą lub świętem trwa po 6:00 następnego dnia, sygnalizujemy pracę w niedzielę lub święto (art. 151^9 § 2).
import { godzinyIMinuty, minuty, minutyNocneZmiany } from './czas-pracy';
import { dataPoPolsku, dodajDni, poprawnaData } from './terminy';
import { zl } from './format';
import { doGrosza } from './dodatek-nocny';
import { okresZawierajacy, rodzajDnia, type RodzajDnia } from './niedziela-swieto';

export const PORY_NOCNE = ['21:00', '22:00', '23:00'] as const;
const NORMA_DOBOWA = 8 * 60;

export interface DanePracyWSobote {
  /** RRRR-MM-DD */
  data: string;
  /** „6:00” */
  od: string;
  do: string;
  /** 1, 2, 3, 4, 6 albo 12 miesięcy (od stycznia) */
  okres: number;
  /** początek pory nocnej: „21:00”, „22:00” albo „23:00” */
  poraNocna?: string;
  /** zł za godzinę; null = bez kwot */
  stawka?: number | null;
}

export interface Kwoty {
  dodatek: number;
  normalne: number;
  razem: number;
}

export interface WynikPracyWSobote {
  rodzaj: RodzajDnia;
  stawka: number | null;
  nazwaSwieta: string | null;
  /** niedziela albo święto: inne zasady (art. 151^9–151^11) */
  innaZasada: boolean;
  /** 0 = niedziela … 6 = sobota */
  dzienTygodnia: number;
  okres: { od: string; do: string };
  dzienWolnyDo: string;
  /** minuty */
  razem: number;
  doOsmej: number;
  poOsmej: number;
  poOsmejNoc: number;
  poOsmejDzien: number;
  /** minuty pracy po 6:00 następnego dnia, gdy ten dzień to niedziela albo święto */
  wNiedzieleSwieto: number;
  nastepnyDzien: { data: string; rodzaj: RodzajDnia; nazwa: string | null };
  /** wariant A: dzień wolny udzielony; B: nieudzielony do końca okresu (minuty z dodatkiem 100% i 50%) */
  a: { bezDodatku: number; z100: number; z50: number; kwoty: Kwoty | null };
  b: { z100: number; z50: number; kwoty: Kwoty | null };
}

const kwoty = (m100: number, m50: number, mNormalne: number, stawka: number): Kwoty => {
  const dodatek = doGrosza((m100 / 60) * stawka + (m50 / 60) * stawka * 0.5);
  const normalne = doGrosza((mNormalne / 60) * stawka);
  return { dodatek, normalne, razem: doGrosza(dodatek + normalne) };
};

export function pracaWSobote({ data, od, do: koniecTxt, okres, poraNocna = '22:00', stawka = null }: DanePracyWSobote): WynikPracyWSobote {
  if (!poprawnaData(data)) throw new RangeError('Wpisz poprawną datę.');
  const s = minuty(od);
  const k = minuty(koniecTxt);
  if (s === null || k === null) throw new RangeError('Wpisz godzinę jako 6:00.');
  if (s === k) throw new RangeError('Koniec pracy musi być inny niż początek.');
  if (!(PORY_NOCNE as readonly string[]).includes(poraNocna)) throw new RangeError('Pora nocna zaczyna się o 21:00, 22:00 albo 23:00.');
  if (stawka !== null && !(Number.isFinite(stawka) && stawka >= 0)) throw new RangeError('Stawka nie może być ujemna.');
  const pora = minuty(poraNocna)!;
  const e = k > s ? k : k + 1440;
  const razem = e - s;
  const doOsmej = Math.min(NORMA_DOBOWA, razem);
  const poOsmej = razem - doOsmej;
  const poOsmejNoc = poOsmej ? minutyNocneZmiany((s + NORMA_DOBOWA) % 1440, k, pora) : 0;
  const poOsmejDzien = poOsmej - poOsmejNoc;

  const { rodzaj, nazwa } = rodzajDnia(data);
  const o = okresZawierajacy(data, okres);
  const nastepna = dodajDni(data, 1);
  const nast = rodzajDnia(nastepna);
  const wNiedzieleSwieto = nast.rodzaj === 'zwykly' ? 0 : Math.max(0, e - (1440 + 360));

  return {
    rodzaj,
    stawka,
    nazwaSwieta: nazwa,
    innaZasada: rodzaj !== 'zwykly',
    dzienTygodnia: new Date(`${data}T00:00:00Z`).getUTCDay(),
    okres: o,
    dzienWolnyDo: o.do,
    razem,
    doOsmej,
    poOsmej,
    poOsmejNoc,
    poOsmejDzien,
    wNiedzieleSwieto,
    nastepnyDzien: { data: nastepna, rodzaj: nast.rodzaj, nazwa: nast.nazwa },
    a: { bezDodatku: doOsmej, z100: poOsmejNoc, z50: poOsmejDzien, kwoty: stawka === null ? null : kwoty(poOsmejNoc, poOsmejDzien, poOsmej, stawka) },
    b: { z100: doOsmej + poOsmejNoc, z50: poOsmejDzien, kwoty: stawka === null ? null : kwoty(doOsmej + poOsmejNoc, poOsmejDzien, razem, stawka) },
  };
}

/** Wiersz wyniku: etykieta i wartość. */
export type Wiersz = [string, string];

export interface OpisWyniku {
  naglowek: string;
  data: string;
  podData: string;
  godziny: string;
  /** puste, gdy niedziela albo święto */
  a: Wiersz[];
  b: Wiersz[];
  bTytul: string;
  uwagi: string[];
}

const h = (m: number) => godzinyIMinuty(m / 60);
const DZIEN = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

/** Teksty wyniku (te same na serwerze i w przeglądarce). Indeksy przepisów w Unicode (151³). */
export function opisWyniku(r: WynikPracyWSobote, data: string): OpisWyniku {
  if (r.innaZasada) {
    const co = r.rodzaj === 'niedziela' ? 'niedziela' : `święto${r.nazwaSwieta ? `: ${r.nazwaSwieta}` : ''}`;
    return {
      naglowek: 'Ten dzień to niedziela albo święto',
      data: dataPoPolsku(data),
      podData: co,
      godziny: h(r.razem),
      a: [],
      b: [],
      bTytul: '',
      uwagi: [
        'Za pracę w niedzielę i święto są inne zasady niż za wolną sobotę (art. 151⁹–151¹¹ Kodeksu pracy). Zasady dla niedziel i świąt opisuje kalkulator pracy w niedzielę i święto (link niżej).',
      ],
    };
  }
  const st = r.stawka;
  const dodatek = (m: number, proc: 100 | 50) => (st === null ? `${proc}% stawki za godzinę` : zl(doGrosza((m / 60) * st * (proc / 100))));
  const a: Wiersz[] = [[`Pierwsze ${h(r.doOsmej)}`, 'bez dodatku, rozlicza je dzień wolny']];
  if (r.a.z100) a.push([`${h(r.a.z100)} nadgodzin w porze nocnej, dodatek 100%`, dodatek(r.a.z100, 100)]);
  if (r.a.z50) a.push([`${h(r.a.z50)} nadgodzin, dodatek 50%`, dodatek(r.a.z50, 50)]);
  if (!r.poOsmej) a.push(['Nadgodziny dobowe', 'brak, praca do 8 h']);
  else if (r.a.kwoty) {
    a.push([`Normalne wynagrodzenie za ${h(r.poOsmej)} nadgodzin`, zl(r.a.kwoty.normalne)]);
    a.push(['Razem za nadgodziny', zl(r.a.kwoty.razem)]);
  }

  const b: Wiersz[] = [[`${h(r.doOsmej)} ponad wymiar okresu, dodatek 100%`, dodatek(r.doOsmej, 100)]];
  if (r.a.z100) b.push([`${h(r.a.z100)} nadgodzin w porze nocnej, dodatek 100%`, dodatek(r.a.z100, 100)]);
  if (r.b.z50) b.push([`${h(r.b.z50)} nadgodzin, dodatek 50%`, dodatek(r.b.z50, 50)]);
  if (r.b.kwoty) {
    b.push([`Normalne wynagrodzenie za ${h(r.razem)} ponad wymiar`, zl(r.b.kwoty.normalne)]);
    b.push(['Razem za ten dzień', zl(r.b.kwoty.razem)]);
  }

  const uwagi: string[] = [];
  if (r.dzienTygodnia !== 6) {
    uwagi.push(`To ${DZIEN[r.dzienTygodnia]}, nie sobota. Liczymy tak samo, jeśli w Twoim grafiku to dzień wolny z pięciodniowego tygodnia (art. 151³ Kodeksu pracy).`);
  }
  if (r.wNiedzieleSwieto) {
    const co = r.nastepnyDzien.rodzaj === 'niedziela' ? 'w niedzielę' : 'w święto';
    uwagi.push(`Zmiana trwa po 6:00 następnego dnia, jeśli pracodawca nie ustalił innej godziny (${dataPoPolsku(r.nastepnyDzien.data)}). Te ${h(r.wNiedzieleSwieto)} to praca ${co} z osobnymi zasadami (art. 151⁹ § 2 i art. 151¹¹ Kodeksu pracy). Tu liczymy je jak resztę zmiany.`);
  }
  return {
    naglowek: 'Dzień wolny za tę pracę do',
    data: dataPoPolsku(r.dzienWolnyDo),
    podData: 'koniec okresu rozliczeniowego; termin uzgadniasz z pracodawcą (art. 151³)',
    godziny: r.poOsmej ? `${h(r.razem)}: ${h(r.doOsmej)} + ${h(r.poOsmej)} nadgodzin dobowych` : h(r.razem),
    a,
    b,
    bTytul: `Gdy dnia wolnego nie dostaniesz do ${dataPoPolsku(r.dzienWolnyDo)} i przekroczysz przez to normę tygodniową`,
    uwagi,
  };
}
