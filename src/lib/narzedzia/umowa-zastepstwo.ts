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
// 1. Upływ trzeciego miesiąca ciąży: Kodeks pracy nie mówi, jak go liczyć. Liczymy 3 miesiące kalendarzowe od dnia
//    początku ciąży, który wpisuje użytkownik, według art. 112 Kodeksu cywilnego (przez art. 300 Kp): koniec w dniu, który
//    datą odpowiada dniowi początkowemu, a gdy go nie ma, w ostatnim dniu miesiąca (dodajMiesiace z terminy.ts).
// 2. Umowa kończąca się dokładnie w dniu upływu 3. miesiąca: przepis nie rozstrzyga, czy kończy się „po upływie”.
//    Zwracamy osobny status „granica” i nie zgadujemy.
// 3. Gdy umowa ma datę końca wcześniejszą niż koniec okresu wypowiedzenia, ostatnim dniem jest data z umowy
//    (art. 30 § 1 pkt 4). Gdy koniec zależy od powrotu osoby zastępowanej, daty nie znamy i jej nie liczymy.
// 4. Staż do okresu wypowiedzenia: pełne miesiące od początku pracy do dnia doręczenia (pelneMiesiace, jak w kalkulatorze
//    okresu wypowiedzenia).
import { koniecWypowiedzenia, okresWypowiedzenia, pelneMiesiace, type Okres } from './wypowiedzenie';
import { dodajMiesiace, poprawnaData } from './terminy';

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
  const stazMiesiecy = pelneMiesiace(poczatekPracy, doreczenie);
  const okres = okresWypowiedzenia('stala', stazMiesiecy);
  const koniecOkresu = koniecWypowiedzenia(doreczenie, okres)!;
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
  /** Dzień, w którym upływa 3. miesiąc ciąży (art. 112 KC). */
  uplyw3Miesiaca: string;
}

/** Upływ trzeciego miesiąca ciąży: 3 miesiące kalendarzowe od początku ciąży (art. 112 KC). */
export const uplywTrzeciegoMiesiaca = (poczatekCiazy: string) => dodajMiesiace(poczatekCiazy, 3);

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
