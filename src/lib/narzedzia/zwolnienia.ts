// Zwolnienia od pracy z okazji wydarzeń rodzinnych i obowiązków: rozporządzenie w sprawie sposobu usprawiedliwiania
// nieobecności w pracy oraz udzielania pracownikom zwolnień od pracy (t.j. Dz.U. 2014 poz. 1632, bez późniejszych zmian):
// § 15 (ślub, narodziny, zgon i pogrzeb), § 6, § 9, § 11; wynagrodzenie zachowane przy § 9, § 12 i § 15, a przy § 5–7,
// § 10 i § 11 ust. 1 pkt 1 i 3 pracodawca wydaje zaświadczenie o utraconym wynagrodzeniu do rekompensaty (§ 16).
// Krwiodawcy: dzień oddania krwi i dzień następny (art. 9 ust. 1 pkt 1 ustawy o publicznej służbie krwi, t.j. Dz.U. 2024
// poz. 1782, bez późniejszych zmian), ze zwrotem utraconego zarobku (pkt 2).
// Strażak OSP: ustawa o ochotniczych strażach pożarnych (t.j. Dz.U. 2025 poz. 244 ze zm.: 2025 poz. 900, 2026 poz. 180,
// 426 i 1159; zmiany nie dotyczą art. 12 i 15) jest późniejsza i szczególna wobec § 11 ust. 1 pkt 1 rozporządzenia:
// zwolnienie na czas działań, akcji, szkoleń i ćwiczeń oraz na odpoczynek z art. 132 § 1 Kp, bez limitu dni (art. 12);
// pracodawca nie płaci, strażak ratownik dostaje ekwiwalent z budżetu gminy (art. 15 ust. 1 i 2) i zachowuje inne niż
// wynagrodzenie świadczenia związane z pracą (art. 15 ust. 3). „Rekompensata” z art. 14 dotyczy tylko niezdolności do
// pracy po wypadku, więc OSP ma osobny opis płatności.

export type Platnosc = 'platne' | 'rekompensata' | 'ekwiwalent-osp';

export interface Zwolnienie {
  klucz: string;
  /** Pełna nazwa sytuacji (tabela, opis pod polem). */
  nazwa: string;
  /** Krótka nazwa do listy wyboru (do ok. 28 znaków, telefon ucina dłuższe). */
  krotko: string;
  wymiar: string;
  platnosc: Platnosc;
  podstawa: string;
}

export const ZWOLNIENIA: Zwolnienie[] = [
  { klucz: 'slub', nazwa: 'Twój ślub', krotko: 'Twój ślub', wymiar: '2 dni', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'narodziny', nazwa: 'Narodziny Twojego dziecka', krotko: 'Narodziny dziecka', wymiar: '2 dni', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'pogrzeb-najblizszy', nazwa: 'Zgon i pogrzeb małżonka, dziecka, ojca, matki, ojczyma lub macochy', krotko: 'Pogrzeb: bliska rodzina', wymiar: '2 dni', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'slub-dziecka', nazwa: 'Ślub Twojego dziecka', krotko: 'Ślub dziecka', wymiar: '1 dzień', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'pogrzeb-dalszy', nazwa: 'Zgon i pogrzeb siostry, brata, teściowej, teścia, babci, dziadka albo innej osoby na Twoim utrzymaniu lub pod Twoją opieką', krotko: 'Pogrzeb: dalsza rodzina', wymiar: '1 dzień', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'krew', nazwa: 'Oddanie krwi (honorowy dawca)', krotko: 'Oddanie krwi', wymiar: 'dzień oddania krwi i dzień następny', platnosc: 'platne', podstawa: 'art. 9 ust. 1 pkt 1 i 2 ustawy o publicznej służbie krwi' },
  { klucz: 'badania', nazwa: 'Obowiązkowe badania lekarskie i szczepienia z przepisów o zwalczaniu chorób zakaźnych', krotko: 'Badania i szczepienia', wymiar: 'czas niezbędny', platnosc: 'platne', podstawa: '§ 9 i § 16 ust. 1 rozporządzenia' },
  { klucz: 'wezwanie', nazwa: 'Wezwanie do sądu, prokuratury, policji albo urzędu', krotko: 'Wezwanie do sądu, urzędu', wymiar: 'czas niezbędny do stawienia się', platnosc: 'rekompensata', podstawa: '§ 6 i § 16 ust. 2 rozporządzenia' },
  { klucz: 'osp', nazwa: 'Akcja, szkolenie lub ćwiczenia OSP', krotko: 'Akcja lub szkolenie OSP', wymiar: 'czas akcji, szkolenia lub ćwiczeń i odpoczynek po nich (art. 132 § 1 Kp)', platnosc: 'ekwiwalent-osp', podstawa: 'art. 12 i 15 ustawy o ochotniczych strażach pożarnych' },
];

export const zwolnienie = (klucz: string) => {
  const z = ZWOLNIENIA.find((x) => x.klucz === klucz);
  if (!z) throw new RangeError(`Brak zwolnienia „${klucz}”`);
  return z;
};

export const OPIS_PLATNOSCI: Record<Platnosc, string> = {
  platne: 'Płatne: zachowujesz wynagrodzenie.',
  rekompensata: 'Pracodawca nie płaci za ten czas, ale wydaje zaświadczenie o utraconym wynagrodzeniu, z którym ubiegasz się o rekompensatę od właściwego organu na zasadach z odrębnych przepisów, chyba że przepisy prawa pracy u pracodawcy przewidują zachowanie wynagrodzenia (§ 16 ust. 2 rozporządzenia).',
  'ekwiwalent-osp': 'Pracodawca nie płaci wynagrodzenia za ten czas. Strażak ratownik OSP dostaje ekwiwalent pieniężny z budżetu gminy za każdą rozpoczętą godzinę, w wysokości z uchwały rady gminy (art. 15 ust. 1 i 2), i zachowuje inne niż wynagrodzenie świadczenia związane z pracą (art. 15 ust. 3).',
};

/** Krótko w tabeli: czy i od kogo są pieniądze. */
export const PLATNOSC_KROTKO: Record<Platnosc, string> = {
  platne: 'płatne',
  rekompensata: 'bez wynagrodzenia od pracodawcy, z rekompensatą',
  'ekwiwalent-osp': 'bez wynagrodzenia od pracodawcy, z ekwiwalentem z gminy',
};
