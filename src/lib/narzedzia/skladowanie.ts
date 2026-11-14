// Składowanie w magazynie: obciążenie regału i odległości z przepisów (pakiet „hala”, 2026-11-14, raporty/hala/PRZEPISY.md).
// Rozporządzenie w sprawie ogólnych przepisów BHP (t.j. Dz.U. 2003 nr 169 poz. 1650 ze zm.):
// - § 68 ust. 2 pkt 2: masa składowanego ładunku nie może przekraczać dopuszczalnego obciążenia regałów, podestów itp.;
//   pkt 4: czytelne informacje o dopuszczalnym obciążeniu (tabliczka). Granica kilogramów pochodzi z tabliczki, a nie
//   z przepisu, więc ją wpisuje użytkownik;
// - § 77: zakaz składowania pod napowietrznymi liniami elektroenergetycznymi i bliżej (w poziomie od skrajnych przewodów)
//   niż 2 m od linii niskiego napięcia, 5 m do 15 kV, 10 m do 30 kV, 15 m powyżej 30 kV.
// Rozporządzenie w sprawie ochrony przeciwpożarowej budynków (t.j. Dz.U. 2023 poz. 822; zmiany Dz.U. 2024 poz. 1716
// i 2026 poz. 1276 nie dotyczą § 4 ust. 1 ani § 33):
// - § 4 ust. 1 pkt 8: materiałów palnych nie wolno przechowywać bliżej niż 0,5 m od urządzeń i instalacji nagrzewających
//   się powyżej 100°C, linii kablowych powyżej 1 kV, przewodów uziemiających i odprowadzających instalacji piorunochronnej,
//   czynnych rozdzielnic, przewodów i gniazd siłowych powyżej 400 V;
// - § 33 ust. 2: do najbliższej gaśnicy najwyżej 30 m, dostęp do gaśnicy o szerokości co najmniej 1 m.
//
// Interpretacje:
// - obciążenie sekcji liczymy przy tym samym ładunku na każdym zajętym poziomie (tak jest opisane pole);
// - przy linii „bezpośrednio pod linią” to odległość 0 m, czyli zakaz bez względu na napięcie;
// - porównujemy na liczbach całkowitych (gramy, milimetry), więc 2000 kg to dokładnie 2000 kg.

export type Linia = 'brak' | 'nn' | 'do15' | 'do30' | 'ponad30';

export const LINIE: Record<Linia, string> = {
  brak: 'Nie ma',
  nn: 'Niskie napięcie',
  do15: 'Do 15 kV',
  do30: 'Do 30 kV',
  ponad30: 'Powyżej 30 kV',
};

/** Najmniejsza odległość składowania od linii napowietrznej w poziomie (m), § 77. */
export const ODLEGLOSC_OD_LINII: Record<Exclude<Linia, 'brak'>, number> = { nn: 2, do15: 5, do30: 10, ponad30: 15 };
export const OD_GORACYCH = 0.5;
export const DOSTEP_DO_GASNICY = 1;
export const DO_GASNICY = 30;

export interface DaneSkladowania {
  /** Dopuszczalne obciążenie jednego poziomu z tabliczki (kg). */
  limitPoziomu?: number;
  /** Ładunki (np. palety) na poziomie. */
  ladunki?: number;
  /** Masa jednego ładunku razem z paletą (kg). */
  masa?: number;
  /** Dopuszczalne obciążenie sekcji albo całego regału z tabliczki (kg). */
  limitSekcji?: number;
  /** Zajęte poziomy w sekcji. */
  poziomy?: number;
  /** Składowane materiały są palne (karton, folia, drewno, tworzywa). */
  palne?: boolean;
  /** Odległość od urządzeń gorących, kabli i rozdzielnic (m). */
  odGoracych?: number;
  /** Szerokość dostępu do gaśnicy (m). */
  dostepGasnicy?: number;
  /** Odległość do najbliższej gaśnicy (m). */
  doGasnicy?: number;
  linia?: Linia;
  /** Odległość od skrajnego przewodu w poziomie (m). */
  odLinii?: number;
}

export type WynikSprawdzenia = 'tak' | 'nie' | 'nie-dotyczy';

export interface Sprawdzenie {
  klucz: 'poziom' | 'sekcja' | 'gorace' | 'dostep' | 'gasnica' | 'linia';
  co: string;
  wynik: WynikSprawdzenia;
  tekst: string;
}

export interface WynikSkladowania {
  /** Masa na poziomie (kg) albo null, gdy brak danych. */
  naPoziomie: number | null;
  /** Ile takich ładunków zmieści się na poziomie. */
  ileZmiesci: number | null;
  glowny: string;
  status: { tekst: string; rodzaj: 'w-terminie' | 'po-terminie' | 'brak' };
  sprawdzenia: Sprawdzenie[];
}

const g = (kg: number) => Math.round(kg * 1000);
const mm = (m: number) => Math.round(m * 1000);
export const kg = (x: number) => `${x.toLocaleString('pl-PL', { maximumFractionDigits: 3 })} kg`;
export const metry = (x: number) => `${x.toLocaleString('pl-PL', { maximumFractionDigits: 2 })} m`;
const naPoziomach = (n: number) => `na ${n} ${n === 1 ? 'poziomie' : 'poziomach'}`;
const PPOZ = 'rozporządzenia o ochronie przeciwpożarowej';

export function sprawdzSkladowanie(d: DaneSkladowania): WynikSkladowania {
  const sprawdzenia: Sprawdzenie[] = [];
  let naPoziomie: number | null = null;
  let ileZmiesci: number | null = null;

  if (d.ladunki !== undefined && d.masa !== undefined) {
    const sumaG = d.ladunki * g(d.masa);
    naPoziomie = sumaG / 1000;
    if (d.limitPoziomu !== undefined) {
      const limitG = g(d.limitPoziomu);
      ileZmiesci = g(d.masa) > 0 ? Math.floor(limitG / g(d.masa)) : null;
      sprawdzenia.push(
        sumaG <= limitG
          ? { klucz: 'poziom', co: 'Obciążenie poziomu', wynik: 'tak', tekst: `${kg(naPoziomie)} z ${kg(d.limitPoziomu)} dopuszczalnych (§ 68 ust. 2 pkt 2 ogólnych przepisów BHP).` }
          : { klucz: 'poziom', co: 'Obciążenie poziomu', wynik: 'nie', tekst: `${kg(naPoziomie)}: o ${kg((sumaG - limitG) / 1000)} więcej niż ${kg(d.limitPoziomu)} z tabliczki (§ 68 ust. 2 pkt 2 ogólnych przepisów BHP).` },
      );
    }
    if (d.limitSekcji !== undefined && d.poziomy !== undefined) {
      const sekcjaG = sumaG * d.poziomy;
      const limitG = g(d.limitSekcji);
      sprawdzenia.push(
        sekcjaG <= limitG
          ? { klucz: 'sekcja', co: 'Obciążenie sekcji', wynik: 'tak', tekst: `${kg(sekcjaG / 1000)} ${naPoziomach(d.poziomy)} z ${kg(d.limitSekcji)} dopuszczalnych.` }
          : { klucz: 'sekcja', co: 'Obciążenie sekcji', wynik: 'nie', tekst: `${kg(sekcjaG / 1000)} ${naPoziomach(d.poziomy)}: o ${kg((sekcjaG - limitG) / 1000)} więcej niż ${kg(d.limitSekcji)} z tabliczki.` },
      );
    }
  }

  if (d.odGoracych !== undefined) {
    sprawdzenia.push(
      !d.palne
        ? { klucz: 'gorace', co: 'Od urządzeń gorących i kabli', wynik: 'nie-dotyczy', tekst: `Odstęp ${metry(OD_GORACYCH)} dotyczy materiałów palnych (§ 4 ust. 1 pkt 8 ${PPOZ}).` }
        : mm(d.odGoracych) >= mm(OD_GORACYCH)
          ? { klucz: 'gorace', co: 'Od urządzeń gorących i kabli', wynik: 'tak', tekst: `${metry(d.odGoracych)}: co najmniej ${metry(OD_GORACYCH)} jest (§ 4 ust. 1 pkt 8 ${PPOZ}).` }
          : { klucz: 'gorace', co: 'Od urządzeń gorących i kabli', wynik: 'nie', tekst: `${metry(d.odGoracych)}: materiały palne trzymaj co najmniej ${metry(OD_GORACYCH)} od nich (§ 4 ust. 1 pkt 8 ${PPOZ}).` },
    );
  }

  if (d.dostepGasnicy !== undefined) {
    sprawdzenia.push(
      mm(d.dostepGasnicy) >= mm(DOSTEP_DO_GASNICY)
        ? { klucz: 'dostep', co: 'Dostęp do gaśnicy', wynik: 'tak', tekst: `${metry(d.dostepGasnicy)}: co najmniej ${metry(DOSTEP_DO_GASNICY)} jest (§ 33 ust. 2 pkt 2 ${PPOZ}).` }
        : { klucz: 'dostep', co: 'Dostęp do gaśnicy', wynik: 'nie', tekst: `${metry(d.dostepGasnicy)}: dostęp musi mieć co najmniej ${metry(DOSTEP_DO_GASNICY)} szerokości (§ 33 ust. 2 pkt 2 ${PPOZ}).` },
    );
  }

  if (d.doGasnicy !== undefined) {
    sprawdzenia.push(
      mm(d.doGasnicy) <= mm(DO_GASNICY)
        ? { klucz: 'gasnica', co: 'Do najbliższej gaśnicy', wynik: 'tak', tekst: `${metry(d.doGasnicy)}: najwyżej ${DO_GASNICY} m jest (§ 33 ust. 2 pkt 1 ${PPOZ}).` }
        : { klucz: 'gasnica', co: 'Do najbliższej gaśnicy', wynik: 'nie', tekst: `${metry(d.doGasnicy)}: z każdego miejsca, w którym może być człowiek, do gaśnicy najwyżej ${DO_GASNICY} m (§ 33 ust. 2 pkt 1 ${PPOZ}).` },
    );
  }

  if (d.linia && d.linia !== 'brak' && d.odLinii !== undefined) {
    const min = ODLEGLOSC_OD_LINII[d.linia];
    sprawdzenia.push(
      mm(d.odLinii) >= mm(min)
        ? { klucz: 'linia', co: 'Od linii napowietrznej', wynik: 'tak', tekst: `${metry(d.odLinii)} w poziomie: co najmniej ${metry(min)} jest (§ 77 ogólnych przepisów BHP).` }
        : { klucz: 'linia', co: 'Od linii napowietrznej', wynik: 'nie', tekst: `${metry(d.odLinii)} w poziomie: przy tej linii nie wolno składować bliżej niż ${metry(min)} od skrajnego przewodu (§ 77 ogólnych przepisów BHP).` },
    );
  }

  const wyniki = sprawdzenia.map((s) => s.wynik);
  const status: WynikSkladowania['status'] = wyniki.includes('nie')
    ? { tekst: 'Niezgodne z przepisem', rodzaj: 'po-terminie' }
    : wyniki.includes('tak')
      ? { tekst: 'Zgodne z przepisem', rodzaj: 'w-terminie' }
      : { tekst: 'Wpisz dane z tabliczki regału albo odległości', rodzaj: 'brak' };

  return { naPoziomie, ileZmiesci, glowny: naPoziomie === null ? '—' : kg(naPoziomie), status, sprawdzenia };
}
