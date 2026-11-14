// Drogi i przejścia w hali: wymiary, które podają przepisy (pakiet „hala”, 2026-11-14, raporty/hala/PRZEPISY.md).
// Rozporządzenie w sprawie ogólnych przepisów BHP (t.j. Dz.U. 2003 nr 169 poz. 1650; zmiany 2007 poz. 330, 2008 poz. 690,
// 2011 poz. 1034, 2021 poz. 2088 i 2026 poz. 927 nie dotyczą paragrafów poniżej):
// - § 47 ust. 1: dojście do stanowiska pracy o wysokości w świetle co najmniej 2 m na całej długości;
// - § 47 ust. 2: 1,8 m tylko w przypadkach uzasadnionych konstrukcją maszyn, przy zabezpieczeniu i oznakowaniu;
// - § 47 ust. 3: przejście między maszynami a innymi urządzeniami lub ścianami, tylko do ich obsługi, co najmniej 0,75 m,
//   a przy ruchu dwukierunkowym 1 m;
// - § 5 ust. 1: na drogach transportowych i w magazynach bez progów i stopni, pochylnie najwyżej 8%;
// - § 4 ust. 2: wymiary dróg dostosowane do użytkowników, urządzeń transportowych i ładunków, a minimalne wymiary dróg
//   i przejść „określają Polskie Normy”. Szerokości drogi dla wózków przepis nie podaje (także rozporządzenie o wózkach
//   jezdniowych, t.j. Dz.U. 2020 poz. 852, § 8). Reguła „szerokość wózka + 60 cm, w obu kierunkach dwie szerokości
//   + 90 cm” to § 46 rozporządzenia z 1953 r. (Dz.U. 1953 nr 22 poz. 89) o wózkach pchanych ręcznie, uchylonego
//   11 października 2000 r. (Dz.U. 2000 nr 26 poz. 313): nie liczymy jej.
// Rozporządzenie w sprawie ochrony przeciwpożarowej budynków (t.j. Dz.U. 2023 poz. 822; zmiany 2024 poz. 1716 i 2026
// poz. 1276 nie dotyczą § 33): § 33 ust. 2 pkt 2: dostęp do gaśnicy o szerokości co najmniej 1 m.
//
// Interpretacje:
// - regał to urządzenie do składowania (§ 68 ust. 2 pkt 2), więc alejka między regałami tylko do ręcznej obsługi
//   (kompletacja pieszo) to przejście z § 47 ust. 3; alejka, którą jeżdżą wózki, to droga transportowa bez liczby;
// - wysokość z § 47 ust. 1 sprawdzamy dla przejść pieszych i dla drogi wózków, po której chodzą piesi (to ich dojście);
// - nachylenie w procentach to różnica poziomów przez długość pochylni w poziomie razy 100 (spadek);
// - porównujemy w milimetrach na liczbach całkowitych, więc 0,75 m to dokładnie 0,75 m.

export type RodzajPrzejscia = 'obsluga' | 'obsluga-dwa' | 'wozki' | 'gasnica';
export type WynikSprawdzenia = 'tak' | 'nie' | 'warunkowo' | 'brak-liczby';

export const RODZAJE: Record<RodzajPrzejscia, string> = {
  obsluga: 'Przejście (1 kierunek)',
  'obsluga-dwa': 'Przejście (2 kierunki)',
  wozki: 'Droga dla wózków',
  gasnica: 'Dostęp do gaśnicy',
};

/** Najmniejsza szerokość w metrach; null: przepis nie podaje liczby. */
export const MIN_SZEROKOSC: Record<RodzajPrzejscia, number | null> = {
  obsluga: 0.75,
  'obsluga-dwa': 1,
  wozki: null,
  gasnica: 1,
};

export const PRZEPIS_SZEROKOSCI: Record<RodzajPrzejscia, string> = {
  obsluga: '§ 47 ust. 3 ogólnych przepisów BHP',
  'obsluga-dwa': '§ 47 ust. 3 ogólnych przepisów BHP',
  wozki: '§ 4 ust. 2 ogólnych przepisów BHP',
  gasnica: '§ 33 ust. 2 pkt 2 rozporządzenia o ochronie przeciwpożarowej',
};

export const WYSOKOSC_DOJSCIA = 2;
export const WYSOKOSC_WYJATEK = 1.8;
export const MAKS_NACHYLENIE = 8;

export interface DanePrzejscia {
  rodzaj: RodzajPrzejscia;
  /** Szerokość w świetle (m). */
  szerokosc?: number;
  /** Wysokość w świetle (m). */
  wysokosc?: number;
  /** Różnica poziomów podłogi (cm). */
  roznica?: number;
  /** Długość pochylni w poziomie (m). */
  dlugosc?: number;
  /** Piesi chodzą tą samą drogą co wózki. */
  piesi?: boolean;
}

export interface Sprawdzenie {
  klucz: 'szerokosc' | 'wysokosc' | 'pochylnia';
  co: string;
  wynik: WynikSprawdzenia;
  tekst: string;
}

export interface WynikPrzejscia {
  /** Najmniejsza szerokość do pokazania jako wynik główny. */
  minimum: string;
  status: { tekst: string; rodzaj: 'w-terminie' | 'po-terminie' | 'wkrotce' | 'brak' };
  sprawdzenia: Sprawdzenie[];
  uwaga: string;
}

const mm = (m: number) => Math.round(m * 1000);
export const metry = (x: number) => `${x.toLocaleString('pl-PL', { maximumFractionDigits: 2 })} m`;
const cm = (milimetry: number) => `${(milimetry / 10).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} cm`;

/** Nachylenie w procentach zaokrąglone w górę do 0,1 (różnica w mm, długość w mm). */
export function nachylenieWGore(roznicaMm: number, dlugoscMm: number): number {
  return Math.ceil((roznicaMm * 1000) / dlugoscMm - 1e-9) / 10;
}

/** Najkrótsza pochylnia (m, w górę do pełnego centymetra) dla różnicy poziomów w cm przy nachyleniu 8%. */
export function najkrotszaPochylnia(roznicaCm: number): number {
  // L = h / 0,08 = 12,5 · h; w milimetrach i w górę do pełnego centymetra.
  const roznicaMm = Math.round(roznicaCm * 10);
  return Math.ceil((roznicaMm * 125) / 100 - 1e-9) / 100;
}

export function sprawdzPrzejscie(d: DanePrzejscia): WynikPrzejscia {
  const min = MIN_SZEROKOSC[d.rodzaj];
  const sprawdzenia: Sprawdzenie[] = [];

  if (min === null) {
    sprawdzenia.push({
      klucz: 'szerokosc',
      co: 'Szerokość',
      wynik: 'brak-liczby',
      tekst: `Przepis nie podaje najmniejszej szerokości drogi dla wózków: ma być dostosowana do wózków i ładunków, a minimalne wymiary określają Polskie Normy (${PRZEPIS_SZEROKOSCI.wozki}).`,
    });
  } else if (d.szerokosc !== undefined) {
    const brak = mm(min) - mm(d.szerokosc);
    sprawdzenia.push(
      brak <= 0
        ? { klucz: 'szerokosc', co: 'Szerokość', wynik: 'tak', tekst: `${metry(d.szerokosc)}, wymagane co najmniej ${metry(min)} (${PRZEPIS_SZEROKOSCI[d.rodzaj]}).` }
        : { klucz: 'szerokosc', co: 'Szerokość', wynik: 'nie', tekst: `${metry(d.szerokosc)}: brakuje ${cm(brak)} do ${metry(min)} (${PRZEPIS_SZEROKOSCI[d.rodzaj]}).` },
    );
  }

  const dlaPieszych = d.rodzaj === 'obsluga' || d.rodzaj === 'obsluga-dwa' || (d.rodzaj === 'wozki' && !!d.piesi);
  if (d.wysokosc !== undefined && dlaPieszych) {
    const h = mm(d.wysokosc);
    const wynik: WynikSprawdzenia = h >= mm(WYSOKOSC_DOJSCIA) ? 'tak' : h >= mm(WYSOKOSC_WYJATEK) ? 'warunkowo' : 'nie';
    const tekst =
      wynik === 'tak'
        ? `${metry(d.wysokosc)}, wymagane co najmniej ${metry(WYSOKOSC_DOJSCIA)} w świetle na całej długości (§ 47 ust. 1).`
        : wynik === 'warunkowo'
          ? `${metry(d.wysokosc)}: mniej niż ${metry(WYSOKOSC_DOJSCIA)}. Do ${metry(WYSOKOSC_WYJATEK)} tylko wtedy, gdy wymusza to konstrukcja maszyn, z zabezpieczeniem i znakami bezpieczeństwa (§ 47 ust. 2).`
          : `${metry(d.wysokosc)}: za nisko, przepis dopuszcza najmniej ${metry(WYSOKOSC_WYJATEK)} i to tylko wyjątkowo (§ 47 ust. 1–2).`;
    sprawdzenia.push({ klucz: 'wysokosc', co: 'Wysokość dojścia', wynik, tekst });
  } else if (d.wysokosc !== undefined) {
    sprawdzenia.push({
      klucz: 'wysokosc',
      co: 'Wysokość',
      wynik: 'brak-liczby',
      tekst:
        d.rodzaj === 'wozki'
          ? 'Wysokości drogi dla wózków przepis nie podaje; 2 m z § 47 ust. 1 sprawdzamy, gdy tą drogą chodzą piesi.'
          : 'Przy dostępie do gaśnicy przepis podaje tylko szerokość.',
    });
  }

  if (d.roznica !== undefined && d.dlugosc !== undefined) {
    const hMm = Math.round(d.roznica * 10);
    const lMm = mm(d.dlugosc);
    const ok = hMm * 100 <= MAKS_NACHYLENIE * lMm;
    const proc = nachylenieWGore(hMm, lMm);
    const kat = (Math.atan(hMm / lMm) * 180) / Math.PI;
    const opis = `${proc.toLocaleString('pl-PL', { maximumFractionDigits: 1 })}% (ok. ${kat.toLocaleString('pl-PL', { maximumFractionDigits: 1 })}°)`;
    sprawdzenia.push(
      ok
        ? { klucz: 'pochylnia', co: 'Pochylnia', wynik: 'tak', tekst: `Nachylenie ${opis}, dopuszczalne najwyżej ${MAKS_NACHYLENIE}% (§ 5 ust. 1).` }
        : {
            klucz: 'pochylnia',
            co: 'Pochylnia',
            wynik: 'nie',
            tekst: `Nachylenie ${opis}: więcej niż ${MAKS_NACHYLENIE}% (§ 5 ust. 1). Przy różnicy ${cm(hMm)} pochylnia musi mieć w poziomie co najmniej ${metry(najkrotszaPochylnia(d.roznica))}.`,
          },
    );
  }

  const wyniki = sprawdzenia.map((s) => s.wynik);
  const status: WynikPrzejscia['status'] = wyniki.includes('nie')
    ? { tekst: 'Niezgodne z przepisem', rodzaj: 'po-terminie' }
    : wyniki.includes('warunkowo')
      ? { tekst: 'Zgodne tylko wyjątkowo', rodzaj: 'wkrotce' }
      : wyniki.includes('tak')
        ? { tekst: wyniki.includes('brak-liczby') ? 'Liczby z przepisu spełnione' : 'Zgodne z przepisem', rodzaj: 'w-terminie' }
        : wyniki.length
          ? { tekst: 'Przepis nie podaje liczby do porównania', rodzaj: 'brak' }
          : { tekst: 'Wpisz wymiary, a sprawdzimy je z przepisem', rodzaj: 'brak' };

  const uwaga =
    d.rodzaj === 'wozki'
      ? d.piesi
        ? 'Gdy piesi chodzą drogą wózków: pasy wyznaczające drogę z bezpieczną odległością między pieszymi a pojazdami (załącznik nr 1 § 13), barierki albo inne środki ochronne tam, gdzie piesi mogą niespodziewanie wejść na drogę, zwłaszcza przed bramami, drzwiami i przejściami (§ 6 ust. 5), oraz środki zapobiegające wtargnięciu osób na teren pracy wózków (§ 8 ust. 2 rozporządzenia o wózkach jezdniowych).'
        : 'Między regałami odstęp ma pozwalać bezpiecznie jeździć wózkiem i operować ładunkiem (§ 69 ust. 2), a prędkość wózków zależy od szerokości dróg (§ 66 ust. 2). Liczb szukaj w dokumentacji wózka i regałów oraz w normach.'
      : d.rodzaj === 'gasnica'
        ? 'Z każdego miejsca, w którym może przebywać człowiek, do najbliższej gaśnicy najwyżej 30 m (§ 33 ust. 2 pkt 1 rozporządzenia o ochronie przeciwpożarowej).'
        : 'Przejścia nie wolno zastawiać (§ 7 ust. 1), a stopnie i inne miejsca, o które można się potknąć, maluje się barwami bezpieczeństwa (§ 6 ust. 4).';

  return { minimum: min === null ? 'brak liczby w przepisie' : `co najmniej ${metry(min)}`, status, sprawdzenia, uwaga };
}

export const ETYKIETA_WYNIKU: Record<WynikSprawdzenia, string> = {
  tak: 'zgodne',
  nie: 'niezgodne',
  warunkowo: 'tylko wyjątkowo',
  'brak-liczby': 'brak liczby',
};

export type PolePrzejscia = 'szerokosc' | 'wysokosc' | 'roznica' | 'dlugosc';

const POLA: Record<PolePrzejscia, { miejsca: number; maks: number; blad: string }> = {
  szerokosc: { miejsca: 3, maks: 50, blad: 'Wpisz szerokość w metrach, na przykład 0,8 (najwyżej z dokładnością do 1 mm).' },
  wysokosc: { miejsca: 3, maks: 30, blad: 'Wpisz wysokość w metrach, na przykład 2,1 (najwyżej z dokładnością do 1 mm).' },
  roznica: { miejsca: 1, maks: 1000, blad: 'Wpisz różnicę poziomów w centymetrach, na przykład 15 (najwyżej z dokładnością do 1 mm).' },
  dlugosc: { miejsca: 3, maks: 1000, blad: 'Wpisz długość pochylni w metrach, na przykład 1,5 (najwyżej z dokładnością do 1 mm).' },
};

/**
 * Liczba z pola tekstowego: undefined dla pustego pola, NaN dla błędnej. Przecinek albo kropka, spacje pomijamy,
 * najwyżej `miejsca` cyfr po przecinku.
 */
export function liczbaZPola(tekst: string, miejsca: number): number | undefined {
  const t = tekst.trim().replace(/\s/g, '').replace(',', '.');
  if (t === '') return undefined;
  return new RegExp(`^\\d+(\\.\\d{1,${miejsca}})?$`).test(t) ? Number(t) : Number.NaN;
}

/** Dane z formularza albo pierwszy błąd (pole i komunikat). */
export function odczytajPrzejscie(
  teksty: Record<PolePrzejscia, string>,
  rodzaj: RodzajPrzejscia,
  piesi: boolean,
): { dane: DanePrzejscia; blad: null } | { dane: null; blad: { pole: PolePrzejscia; tekst: string } } {
  const dane: DanePrzejscia = { rodzaj, piesi };
  for (const pole of Object.keys(POLA) as PolePrzejscia[]) {
    const { miejsca, maks, blad } = POLA[pole];
    const x = liczbaZPola(teksty[pole], miejsca);
    if (x === undefined) continue;
    if (!(x > 0 && x <= maks)) return { dane: null, blad: { pole, tekst: blad } };
    dane[pole] = x;
  }
  if ((dane.roznica === undefined) !== (dane.dlugosc === undefined)) {
    const pole = dane.roznica === undefined ? 'roznica' : 'dlugosc';
    return { dane: null, blad: { pole, tekst: 'Do pochylni wpisz i różnicę poziomów, i długość w poziomie.' } };
  }
  return { dane, blad: null };
}
