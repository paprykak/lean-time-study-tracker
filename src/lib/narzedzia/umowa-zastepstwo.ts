// Umowa na zastępstwo (Kodeks pracy, t.j. Dz.U. 2026 poz. 1245):
// - art. 25 § 1: umowa na okres próbny, na czas określony albo nieokreślony; zastępstwo to umowa na czas określony
//   zawarta „w celu zastępstwa pracownika w czasie jego usprawiedliwionej nieobecności w pracy” (art. 25^1 § 4 pkt 1);
// - art. 25^1 § 4 pkt 1: limitu 33 miesięcy i 3 umów (§ 1) nie stosuje się do takiej umowy, „jeżeli jej zawarcie w danym
//   przypadku służy zaspokojeniu rzeczywistego okresowego zapotrzebowania i jest niezbędne w tym zakresie”; zawiadomienie
//   inspektora pracy (§ 5) dotyczy tylko umów z § 4 pkt 4, nie zastępstwa;
// - art. 29 § 1^1: w umowie określa się jej cel przez informację o obiektywnych przyczynach;
// - art. 30 § 1 pkt 4: umowa rozwiązuje się z upływem czasu, na który była zawarta; art. 30 § 4: w wypowiedzeniu
//   pracodawca wskazuje przyczynę; art. 36 § 1: okres wypowiedzenia według stażu u pracodawcy, jak przy innych umowach
//   (2 tygodnie, 1 miesiąc, 3 miesiące); koniec w sobotę albo ostatniego dnia miesiąca (art. 30 § 2^1), wypowiedzenie.ts;
// - art. 177 § 1: w ciąży pracodawca nie może wypowiedzieć umowy (przepis nie wyłącza zastępstwa); § 3: umowa na czas
//   określony albo na okres próbny przekraczający jeden miesiąc, która rozwiązałaby się po upływie trzeciego miesiąca
//   ciąży, przedłuża się do dnia porodu; § 3^1: nie dotyczy umowy na zastępstwo.
//
// Interpretacje:
// 1. Upływ trzeciego miesiąca ciąży: Kodeks pracy nie mówi, jak go liczyć ani od której daty. Liczymy od początku ciąży
//    z zaświadczenia lekarskiego. Są dwa warianty: (A) art. 112 KC (przez art. 300 Kp): koniec w dniu, który datą
//    odpowiada dniowi początkowemu (od 10 stycznia: 10 kwietnia); (B) dzień początku ciąży jest pierwszym dniem
//    pierwszego miesiąca, więc 3. miesiąc upływa z końcem dnia poprzedzającego (9 kwietnia). Bierzemy wcześniejszy
//    wariant B, bezpieczny dla pracownicy: przy nim przedłużenie obejmuje więcej umów. Gdy w ostatnim miesiącu nie ma
//    dnia o tej dacie, punktem odniesienia jest ostatni dzień miesiąca (od 30 listopada: 28 lutego, upływ 27 lutego).
// 2. Umowa kończąca się dokładnie w dniu upływu (wariant B): kończy się razem z 3. miesiącem, a nie „po upływie”;
//    w wariancie A kończy się przed upływem. Przepis tego nie rozstrzyga wprost, więc zwracamy status „granica”.
// 3. Gdy umowa ma datę końca wcześniejszą niż koniec okresu wypowiedzenia, ostatnim dniem jest data z umowy
//    (art. 30 § 1 pkt 4). Gdy koniec zależy od powrotu osoby zastępowanej, daty nie znamy i jej nie liczymy.
// 4. Staż do okresu wypowiedzenia: pełne miesiące od początku pracy do dnia doręczenia (pelneMiesiace, jak w kalkulatorze
//    okresu wypowiedzenia). Do stażu wlicza się pracę u poprzedniego pracodawcy przy przejściu zakładu (art. 36 § 1^1)
//    oraz zlecenie i działalność na rzecz tego pracodawcy (art. 302^1 § 8): użytkownik wpisuje najwcześniejszą datę.
//    Gdy próg 6 miesięcy albo 3 lat mija w trakcie wypowiedzenia, przepis nie mówi wprost, co wtedy; jak w kalkulatorze
//    okresu wypowiedzenia (wypowiedzenieStalej) podajemy dłuższy okres (wariant bezpieczny dla pracownika).
// 5. Przedłużenie oceniamy od daty końca wpisanej w umowie. Gdy ta data wypada przed końcem okresu wypowiedzenia,
//    a umowa się przedłuża, ostatnim dniem jest dzień porodu. Gdy wypowiedzenie kończy umowę przed tą datą, przepis
//    nie mówi wprost, czy przedłużenie obejmuje taką umowę: zaznaczamy to (przedluzeniePoWypowiedzeniu).
import { wypowiedzenieStalej, type Okres } from './wypowiedzenie';
import { dodajDni, dodajMiesiace, poprawnaData } from './terminy';

export interface WypowiedzenieZastepstwa {
  stazMiesiecy: number;
  okres: Okres;
  /** Ostatni dzień okresu wypowiedzenia (art. 36 § 1, art. 30 § 2^1). */
  koniecOkresu: string;
  /** Ostatni dzień umowy: wcześniejszy z końca okresu i daty końca z umowy. */
  ostatniDzien: string;
  /** Co kończy umowę: wypowiedzenie czy upływ czasu, na który była zawarta (art. 30 § 1 pkt 4). */
  powod: 'wypowiedzenie' | 'termin';
}

export function wypowiedzenieZastepstwa(poczatekPracy: string, doreczenie: string, koniecUmowy?: string): WypowiedzenieZastepstwa {
  if (!poprawnaData(poczatekPracy)) throw new Error('Wpisz datę rozpoczęcia pracy.');
  if (!poprawnaData(doreczenie)) throw new Error('Wpisz dzień doręczenia wypowiedzenia.');
  if (doreczenie < poczatekPracy) throw new Error('Doręczenie nie może być przed rozpoczęciem pracy.');
  if (koniecUmowy !== undefined && koniecUmowy !== '') {
    if (!poprawnaData(koniecUmowy)) throw new Error('Wpisz poprawną datę końca umowy.');
    if (koniecUmowy < doreczenie) throw new Error('Koniec umowy nie może być przed doręczeniem wypowiedzenia.');
  }
  const w = wypowiedzenieStalej(poczatekPracy, doreczenie);
  const stazMiesiecy = w.staz;
  const okres = w.okres;
  const koniecOkresu = w.koniec;
  const termin = !!koniecUmowy && koniecUmowy < koniecOkresu;
  return { stazMiesiecy, okres, koniecOkresu, ostatniDzien: termin ? koniecUmowy! : koniecOkresu, powod: termin ? 'termin' : 'wypowiedzenie' };
}

export type RodzajUmowyWCiazy = 'zastepstwo' | 'okreslony' | 'probna-ponad-miesiac' | 'probna-do-miesiaca';

export type StatusPrzedluzenia =
  /** art. 177 § 3: umowa przedłuża się do dnia porodu */
  | 'przedluza'
  /** art. 177 § 3^1: umowa na zastępstwo się nie przedłuża */
  | 'zastepstwo'
  /** art. 177 § 3: okres próbny do jednego miesiąca się nie przedłuża */
  | 'probna-krotka'
  /** umowa kończy się przed upływem 3. miesiąca ciąży */
  | 'przed-uplywem'
  /** umowa kończy się w dniu upływu 3. miesiąca: przepis nie rozstrzyga */
  | 'granica'
  /** ciąża zaczyna się po końcu umowy: przepis nie dotyczy */
  | 'po-umowie';

export interface PrzedluzenieDoPorodu {
  status: StatusPrzedluzenia;
  /** Dzień, z którego końcem upływa 3. miesiąc ciąży (wariant B). */
  uplyw3Miesiaca: string;
}

/**
 * Upływ trzeciego miesiąca ciąży (wariant B, wcześniejszy): dzień przed dniem, który datą odpowiada początkowi ciąży.
 * Świadome odstępstwo od `koniecOkresu` (terminy.ts) przy starcie 29.–31. dnia: wcześniejszy upływ obejmuje
 * przedłużeniem więcej umów (wariant bezpieczny dla pracownicy, interpretacja 1 wyżej).
 */
export const uplywTrzeciegoMiesiaca = (poczatekCiazy: string) => dodajDni(dodajMiesiace(poczatekCiazy, 3), -1);

export function przedluzenieDoPorodu(rodzaj: RodzajUmowyWCiazy, koniecUmowy: string, poczatekCiazy: string): PrzedluzenieDoPorodu {
  if (!poprawnaData(koniecUmowy)) throw new Error('Wpisz datę końca umowy.');
  if (!poprawnaData(poczatekCiazy)) throw new Error('Wpisz datę początku ciąży.');
  const uplyw3Miesiaca = uplywTrzeciegoMiesiaca(poczatekCiazy);
  let status: StatusPrzedluzenia;
  if (poczatekCiazy > koniecUmowy) status = 'po-umowie';
  else if (rodzaj === 'zastepstwo') status = 'zastepstwo';
  else if (rodzaj === 'probna-do-miesiaca') status = 'probna-krotka';
  else if (koniecUmowy < uplyw3Miesiaca) status = 'przed-uplywem';
  else if (koniecUmowy === uplyw3Miesiaca) status = 'granica';
  else status = 'przedluza';
  return { status, uplyw3Miesiaca };
}

/** Czy wypowiedzenie doręczono w ciąży (art. 177 § 1: zakaz także przy zastępstwie, z wyjątkami z § 1 pkt 2 i § 4). */
export const wypowiedzenieWCiazy = (doreczenie: string, poczatekCiazy: string) =>
  poprawnaData(doreczenie) && poprawnaData(poczatekCiazy) && doreczenie >= poczatekCiazy;

export interface DaneUmowy {
  rodzaj: RodzajUmowyWCiazy;
  poczatekPracy: string;
  doreczenie: string;
  koniecUmowy?: string;
  poczatekCiazy?: string;
}

export interface WynikUmowy {
  wypowiedzenie: WypowiedzenieZastepstwa;
  /** Ocena przedłużenia: null, gdy brak daty końca umowy albo początku ciąży (dla zastępstwa zawsze „zastepstwo”). */
  przedluzenie: PrzedluzenieDoPorodu | null;
  /** Ostatni dzień umowy albo „porod”, gdy umowa z datą końca przed końcem okresu przedłuża się do dnia porodu. */
  ostatni: string | 'porod';
  /** Przedłużenie z daty w umowie, ale wypowiedzenie kończy umowę wcześniej: przepis nie mówi wprost, co wtedy. */
  przedluzeniePoWypowiedzeniu: boolean;
  wypowiedzenieWCiazy: boolean;
}

/** Całość: ostatni dzień przy wypowiedzeniu, przedłużenie do dnia porodu i zakaz wypowiedzenia w ciąży. */
export function umowaNaZastepstwo(d: DaneUmowy): WynikUmowy {
  const wyp = wypowiedzenieZastepstwa(d.poczatekPracy, d.doreczenie, d.koniecUmowy);
  const ciaza = d.poczatekCiazy || '';
  if (ciaza && !poprawnaData(ciaza)) throw new Error('Wpisz poprawną datę początku ciąży.');
  let przedluzenie: PrzedluzenieDoPorodu | null = null;
  if (d.koniecUmowy && ciaza) przedluzenie = przedluzenieDoPorodu(d.rodzaj, d.koniecUmowy, ciaza);
  else if (d.rodzaj === 'zastepstwo') przedluzenie = { status: 'zastepstwo', uplyw3Miesiaca: ciaza ? uplywTrzeciegoMiesiaca(ciaza) : '' };
  const przedluza = przedluzenie?.status === 'przedluza';
  return {
    wypowiedzenie: wyp,
    przedluzenie,
    ostatni: przedluza && wyp.powod === 'termin' ? 'porod' : wyp.ostatniDzien,
    przedluzeniePoWypowiedzeniu: przedluza && wyp.powod === 'wypowiedzenie',
    wypowiedzenieWCiazy: wypowiedzenieWCiazy(d.doreczenie, ciaza),
  };
}
