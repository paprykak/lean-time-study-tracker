// Zwolnienia od pracy z okazji wydarzeń rodzinnych i obowiązków: rozporządzenie w sprawie sposobu usprawiedliwiania
// nieobecności w pracy oraz udzielania pracownikom zwolnień od pracy (t.j. Dz.U. 2014 poz. 1632, bez późniejszych zmian):
// § 15 (ślub, narodziny, zgon i pogrzeb), § 6, § 9, § 11; wynagrodzenie zachowane przy § 9, § 12 i § 15, a przy § 5–7,
// § 10 i § 11 ust. 1 pkt 1 i 3 pracodawca wydaje zaświadczenie o utraconym wynagrodzeniu do rekompensaty (§ 16).
// Krwiodawcy: dzień oddania krwi i dzień następny (art. 9 ust. 1 pkt 1 ustawy o publicznej służbie krwi, t.j. Dz.U. 2024
// poz. 1782, bez późniejszych zmian), ze zwrotem utraconego zarobku (pkt 2).

export type Platnosc = 'platne' | 'rekompensata';

export interface Zwolnienie {
  klucz: string;
  nazwa: string;
  wymiar: string;
  platnosc: Platnosc;
  podstawa: string;
}

export const ZWOLNIENIA: Zwolnienie[] = [
  { klucz: 'slub', nazwa: 'Twój ślub', wymiar: '2 dni', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'narodziny', nazwa: 'Narodziny Twojego dziecka', wymiar: '2 dni', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'pogrzeb-najblizszy', nazwa: 'Zgon i pogrzeb małżonka, dziecka, ojca, matki, ojczyma lub macochy', wymiar: '2 dni', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'slub-dziecka', nazwa: 'Ślub Twojego dziecka', wymiar: '1 dzień', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'pogrzeb-dalszy', nazwa: 'Zgon i pogrzeb siostry, brata, teściowej, teścia, babci, dziadka albo innej osoby na Twoim utrzymaniu lub pod Twoją opieką', wymiar: '1 dzień', platnosc: 'platne', podstawa: '§ 15 rozporządzenia' },
  { klucz: 'krew', nazwa: 'Oddanie krwi (honorowy dawca)', wymiar: 'dzień oddania krwi i dzień następny', platnosc: 'platne', podstawa: 'art. 9 ust. 1 pkt 1 i 2 ustawy o publicznej służbie krwi' },
  { klucz: 'badania', nazwa: 'Obowiązkowe badania lekarskie i szczepienia z przepisów o zwalczaniu chorób zakaźnych', wymiar: 'czas niezbędny', platnosc: 'platne', podstawa: '§ 9 i § 16 ust. 1 rozporządzenia' },
  { klucz: 'wezwanie', nazwa: 'Wezwanie do sądu, prokuratury, policji albo urzędu', wymiar: 'czas niezbędny do stawienia się', platnosc: 'rekompensata', podstawa: '§ 6 i § 16 ust. 2 rozporządzenia' },
  { klucz: 'osp', nazwa: 'Akcja ratownicza ochotniczej straży pożarnej', wymiar: 'czas akcji i wypoczynku po niej; szkolenia do 6 dni w roku', platnosc: 'rekompensata', podstawa: '§ 11 ust. 1 pkt 1 i § 16 ust. 2 rozporządzenia' },
];

export const zwolnienie = (klucz: string) => {
  const z = ZWOLNIENIA.find((x) => x.klucz === klucz);
  if (!z) throw new RangeError(`Brak zwolnienia „${klucz}”`);
  return z;
};

export const OPIS_PLATNOSCI: Record<Platnosc, string> = {
  platne: 'Płatne: zachowujesz wynagrodzenie.',
  rekompensata: 'Pracodawca nie płaci za ten czas, ale wydaje zaświadczenie o utraconym wynagrodzeniu, z którym ubiegasz się o rekompensatę od właściwego organu na zasadach z odrębnych przepisów, chyba że przepisy prawa pracy u pracodawcy przewidują zachowanie wynagrodzenia (§ 16 ust. 2 rozporządzenia).',
};
