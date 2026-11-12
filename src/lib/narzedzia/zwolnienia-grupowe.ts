// Zwolnienia grupowe (ustawa o szczególnych zasadach rozwiązywania z pracownikami stosunków pracy z przyczyn
// niedotyczących pracowników, tekst jednolity Dz.U. 2026 poz. 1195):
// - art. 1 ust. 1: pracodawca zatrudniający co najmniej 20 pracowników, w okresie do 30 dni zwolnienie obejmuje co najmniej
//   10 osób przy zatrudnieniu poniżej 100, 10% przy 100–299, 30 osób przy 300 i więcej; ust. 2: porozumienia stron
//   z inicjatywy pracodawcy liczą się, gdy dotyczą co najmniej 5 osób;
// - art. 10 ust. 1: mniej zwolnień niż próg, ale co najmniej 20 zatrudnionych i przyczyny niedotyczące pracownika jako
//   wyłączny powód: odprawa z art. 8 też się należy;
// - art. 6 ust. 2: rozwiązanie umów najwcześniej po upływie 30 dni od zawiadomienia urzędu pracy (liczymy od dnia
//   następnego, art. 111 § 2 KC, więc umowa może się rozwiązać najwcześniej następnego dnia po 30. dniu);
// - art. 3 ust. 1: porozumienie ze związkami w ciągu 20 dni od zawiadomienia o zamiarze;
// - art. 9: zgłoszenie zamiaru powrotu w ciągu roku od rozwiązania umowy, ponowne zatrudnienie w ciągu 15 miesięcy.
import { dodajDni, dodajLata, dodajMiesiace } from './terminy';

export const MIN_ZATRUDNIONYCH = 20;
export const MIN_POROZUMIEN = 5;

export type Rodzaj = 'nie-dotyczy' | 'indywidualne' | 'grupowe';

/** Najmniejsza liczba zwalnianych osób, od której zwolnienie jest grupowe (art. 1 ust. 1). */
export function progGrupowego(zatrudnionych: number): number | null {
  if (zatrudnionych < MIN_ZATRUDNIONYCH) return null;
  if (zatrudnionych < 100) return 10;
  if (zatrudnionych < 300) return Math.ceil(zatrudnionych / 10);
  return 30;
}

export interface DaneZwolnienia {
  zatrudnionych: number;
  wypowiedzen: number;
  porozumien: number;
}

export function zwolnienieGrupowe(d: DaneZwolnienia) {
  for (const x of [d.zatrudnionych, d.wypowiedzen, d.porozumien]) if (!Number.isInteger(x) || x < 0) throw new RangeError('Liczby osób: całkowite, nieujemne');
  if (d.wypowiedzen + d.porozumien > d.zatrudnionych) throw new RangeError('Zwalnianych więcej niż zatrudnionych');
  const prog = progGrupowego(d.zatrudnionych);
  const porozumieniaLiczone = d.porozumien >= MIN_POROZUMIEN ? d.porozumien : 0;
  const liczone = d.wypowiedzen + porozumieniaLiczone;
  const rodzaj: Rodzaj = prog === null ? 'nie-dotyczy' : liczone >= prog ? 'grupowe' : 'indywidualne';
  return { prog, liczone, porozumieniaLiczone, rodzaj, brakuje: prog !== null && rodzaj === 'indywidualne' ? prog - liczone : 0 };
}

/** Terminy grupowego zwolnienia od dnia zawiadomienia urzędu pracy (art. 6 ust. 2). */
export function terminyUrzedu(zawiadomienie: string) {
  const trzydziesty = dodajDni(zawiadomienie, 30);
  return { trzydziesty, najwczesniejRozwiazanie: dodajDni(trzydziesty, 1) };
}

/** Terminy ponownego zatrudnienia od dnia rozwiązania umowy (art. 9). */
export function terminyPowrotu(rozwiazanie: string) {
  return { zgloszenieDo: dodajLata(rozwiazanie, 1), zatrudnienieDo: dodajMiesiace(rozwiazanie, 15) };
}
