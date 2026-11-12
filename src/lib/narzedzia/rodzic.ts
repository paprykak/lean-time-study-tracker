// Rodzic w pracy: uprawnienia zależne od wieku dziecka i terminy wniosków (Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245).
// Wiek kończy się z początkiem dnia urodzin (art. 112 KC), więc prawo „do ukończenia N lat” trwa do dnia przed N. urodzinami.
// - urlop ojcowski: do ukończenia 12 miesięcy życia, wniosek 7 dni przed (art. 182^3 § 1 pkt 1 i § 2);
// - urlop rodzicielski: do końca roku 6. urodzin, wniosek 21 dni przed (art. 182^1c, 182^1d § 1);
// - urlop wychowawczy: do końca roku 6. urodzin, po 6 miesiącach zatrudnienia, wniosek 21 dni przed (art. 186 § 1, 2 i 7);
// - obniżony wymiar zamiast wychowawczego: w tym samym okresie, wniosek 21 dni przed (art. 186^7 § 1–3);
// - praca zdalna na wniosek: dziecko do 4 lat, odmowa tylko z powodu organizacji albo rodzaju pracy, w 7 dni roboczych
//   (art. 67^19 § 6);
// - elastyczna organizacja pracy: dziecko do 8 lat, wniosek 21 dni przed, odpowiedź w 7 dni (art. 188^1 § 1 i 5);
// - bez zgody bez nadgodzin, nocy, przerywanego czasu pracy i delegacji: dziecko do 8 lat (art. 178 § 2);
// - 2 dni albo 16 godzin wolnego w roku: dziecko „w wieku do 14 lat” (art. 188 § 1); przyjmujemy do dnia przed 14. urodzinami.
import { dodajDni, dodajLata } from './terminy';

export interface UprawnienieRodzica {
  klucz: string;
  nazwa: string;
  /** Ostatni dzień, w którym uprawnienie przysługuje. */
  do: string;
  /** Ile dni przed początkiem złożyć wniosek. */
  dniWniosku: number | null;
  podstawa: string;
}

const przedUrodzinami = (ur: string, lata: number) => dodajDni(dodajLata(ur, lata), -1);
const koniecRoku = (ur: string, lata: number) => `${Number(ur.slice(0, 4)) + lata}-12-31`;

export function uprawnieniaRodzica(urodzenie: string): UprawnienieRodzica[] {
  return [
    { klucz: 'ojcowski', nazwa: 'Urlop ojcowski, 2 tygodnie', do: przedUrodzinami(urodzenie, 1), dniWniosku: 7, podstawa: 'art. 182³' },
    { klucz: 'rodzicielski', nazwa: 'Urlop rodzicielski', do: koniecRoku(urodzenie, 6), dniWniosku: 21, podstawa: 'art. 182¹c i 182¹d' },
    { klucz: 'wychowawczy', nazwa: 'Urlop wychowawczy', do: koniecRoku(urodzenie, 6), dniWniosku: 21, podstawa: 'art. 186' },
    { klucz: 'obnizony', nazwa: 'Obniżony etat zamiast wychowawczego', do: koniecRoku(urodzenie, 6), dniWniosku: 21, podstawa: 'art. 186⁷' },
    { klucz: 'zdalna', nazwa: 'Praca zdalna na wniosek', do: przedUrodzinami(urodzenie, 4), dniWniosku: null, podstawa: 'art. 67¹⁹ § 6' },
    { klucz: 'elastyczna', nazwa: 'Elastyczna organizacja pracy', do: przedUrodzinami(urodzenie, 8), dniWniosku: 21, podstawa: 'art. 188¹' },
    { klucz: 'zgoda', nazwa: 'Nadgodziny, noc i delegacja tylko za zgodą', do: przedUrodzinami(urodzenie, 8), dniWniosku: null, podstawa: 'art. 178 § 2' },
    { klucz: 'wolne', nazwa: '2 dni albo 16 godzin wolnego w roku', do: przedUrodzinami(urodzenie, 14), dniWniosku: null, podstawa: 'art. 188' },
  ];
}

/** Uprawnienia na dzień `start` z terminem złożenia wniosku (start minus dni wniosku). */
export function planRodzica(urodzenie: string, start: string) {
  if (start < urodzenie) throw new RangeError('Początek przed urodzeniem dziecka');
  return uprawnieniaRodzica(urodzenie).map((u) => ({
    ...u,
    dostepne: start <= u.do,
    wniosekDo: u.dniWniosku === null ? null : dodajDni(start, -u.dniWniosku),
  }));
}
