// Sąd pracy czy PIP: opłaty, właściwy sąd i co może inspekcja.
// - Pracownik wnoszący powództwo nie ma obowiązku uiszczania kosztów sądowych (art. 96 ust. 1 pkt 4 ustawy o kosztach
//   sądowych w sprawach cywilnych, t.j. Dz.U. 2025 poz. 1228), a wydatki tymczasowo ponosi Skarb Państwa (art. 97).
// - Od apelacji: gdy wartość przedmiotu sporu przewyższa 50 000 zł, od wartości ponad tę kwotę pobiera się od pracownika
//   opłatę według art. 13 (art. 35 ust. 1 zdanie drugie): opłata stała do 20 000 zł według progów z ust. 1, powyżej
//   5% (ust. 2; od 23 września 2025 r. najwyżej 100 000 zł, Dz.U. 2025 poz. 1157); końcówkę zaokrągla się w górę do
//   pełnego złotego (art. 21).
// - Sąd: rejonowy, chyba że w sprawie o prawa majątkowe wartość przedmiotu sporu przewyższa 100 000 zł (art. 17 pkt 4
//   KPC, t.j. Dz.U. 2026 poz. 468); sprawy z art. 461 § 1¹ KPC (wypowiedzenie, przywrócenie, ustalenie stosunku pracy,
//   kary porządkowe, świadectwo pracy, od 5 listopada 2026 r. także dobra osobiste, mobbing i równe traktowanie, Dz.U.
//   2026 poz. 1046) zawsze w sądzie rejonowym. Miejscowo: sąd właściwy dla pozwanego albo sąd miejsca pracy (art. 461 § 1).
// - PIP: nakaz wypłaty wynagrodzenia i innych świadczeń (art. 11 ust. 1 pkt 7 ustawy o PIP), od 8 lipca 2026 r.
//   decyzja stwierdzająca stosunek pracy (art. 11 ust. 1 pkt 7a, Dz.U. 2026 poz. 473), nakazy BHP (pkt 1–6),
//   wystąpienie lub polecenie przy innych naruszeniach (pkt 8); o przywróceniu do pracy i odszkodowaniu orzeka sąd pracy
//   (art. 45 § 1 i 56 § 1 Kp), spory o roszczenia ze stosunku pracy rozstrzygają sądy pracy (art. 262 § 1 Kp).
// Interpretacja: art. 35 ust. 1 liczy opłatę od wartości przedmiotu sporu ponad 50 000 zł; pismo dotyczące części
// przedmiotu sporu podlega opłacie tylko od wartości tej części (art. 126¹ § 2 KPC), więc przy apelacji od części wyroku
// opłata może być niższa. Pokazujemy opłatę od apelacji co do całości, według brzmienia przepisu.

import { liczba } from './format';

export type SprawaPracownicza = 'wynagrodzenie' | 'wypowiedzenie' | 'mobbing' | 'umowa-o-prace' | 'swiadectwo' | 'kara' | 'bhp';

export interface OpisSprawy {
  krotko: string;
  /** Zawsze sąd rejonowy (art. 461 § 1¹ KPC). */
  rejonowy: boolean;
  pip: string;
  sad: string;
}

export const SPRAWY_PRACOWNICZE: Record<SprawaPracownicza, OpisSprawy> = {
  wynagrodzenie: {
    krotko: 'Zaległa wypłata',
    rejonowy: false,
    pip: 'Inspektor może nakazać pracodawcy wypłatę należnego wynagrodzenia i innych świadczeń; nakaz podlega natychmiastowemu wykonaniu (art. 11 ust. 1 pkt 7 ustawy o PIP).',
    sad: 'Pozew o zapłatę do sądu pracy. Roszczenie przedawnia się po 3 latach od dnia, w którym pensja powinna być wypłacona (art. 291 § 1 i art. 85 Kodeksu pracy).',
  },
  wypowiedzenie: {
    krotko: 'Zwolnienie z pracy',
    rejonowy: true,
    pip: 'Inspekcja może skontrolować pracodawcę, ale o bezskuteczności wypowiedzenia, przywróceniu do pracy i odszkodowaniu orzeka tylko sąd pracy (art. 45 § 1 i 56 § 1 Kodeksu pracy).',
    sad: 'Odwołanie do sądu pracy w 21 dni od doręczenia wypowiedzenia albo zawiadomienia o rozwiązaniu umowy (art. 264 § 1–2 Kodeksu pracy), także wtedy, gdy sprawą zajmuje się PIP. Inaczej termin biegnie tylko w szczególnym przypadku z art. 34 ust. 2g–2i ustawy o PIP. Termin przekroczony bez Twojej winy sąd może przywrócić na wniosek złożony w 7 dni od ustania przyczyny (art. 265 Kodeksu pracy).',
  },
  mobbing: {
    krotko: 'Mobbing, dyskryminacja',
    rejonowy: true,
    pip: 'Inspektor może skierować do pracodawcy wystąpienie albo polecenie usunięcia naruszeń (art. 11 ust. 1 pkt 8 ustawy o PIP), ale zadośćuczynienie zasądza tylko sąd.',
    sad: 'Pozew o zadośćuczynienie lub odszkodowanie do sądu pracy (art. 18³d, 18³e i 94³ Kodeksu pracy); sprawy wniesione od 5 listopada 2026 r. zawsze trafiają do sądu rejonowego (art. 461 § 1¹ Kodeksu postępowania cywilnego; art. 5 ustawy z 19 czerwca 2026 r.).',
  },
  'umowa-o-prace': {
    krotko: 'Zlecenie zamiast etatu',
    rejonowy: true,
    pip: 'Od 8 lipca 2026 r. okręgowy inspektor pracy może decyzją stwierdzić stosunek pracy, gdy pracodawca nie wykona polecenia zawarcia umowy o pracę (art. 11 ust. 1 pkt 7a i ust. 2 ustawy o PIP). Okręgowy inspektor pracy może też wnieść pozew o ustalenie istnienia lub treści stosunku pracy na Twoją rzecz (art. 33a ust. 3). Decyzja obejmuje stan od rozpoczęcia kontroli, a umowa o pracę liczy się co do zasady od dnia decyzji (art. 34 ust. 2d i 2f); za okres wcześniejszy potrzebny jest pozew (art. 33a ust. 6).',
    sad: 'Pozew o ustalenie istnienia stosunku pracy do sądu pracy; taka sprawa zawsze trafia do sądu rejonowego (art. 461 § 1¹ Kodeksu postępowania cywilnego).',
  },
  swiadectwo: {
    krotko: 'Świadectwo pracy',
    rejonowy: true,
    pip: 'Inspektor może skierować do pracodawcy wystąpienie albo polecenie wydania świadectwa (art. 11 ust. 1 pkt 8 ustawy o PIP).',
    sad: 'Żądanie wydania świadectwa można zgłosić w sądzie w każdym czasie przed przedawnieniem (art. 97¹ § 1 i 3 Kodeksu pracy). Sprostowanie: najpierw wniosek do pracodawcy w 14 dni od otrzymania świadectwa, po odmowie pozew w 14 dni od zawiadomienia o niej, a gdy pracodawca nie zawiadomi o odmowie, żądanie wnosi się do sądu (art. 97 § 2¹).',
  },
  kara: {
    krotko: 'Kara porządkowa',
    rejonowy: true,
    pip: 'Inspekcja może skontrolować, czy kara była zgodna z przepisami, ale uchylić ją może pracodawca po sprzeciwie albo sąd pracy (art. 112 Kodeksu pracy).',
    sad: 'Najpierw sprzeciw do pracodawcy w 7 dni, po jego odrzuceniu pozew do sądu pracy w 14 dni (art. 112 § 1–2 Kodeksu pracy).',
  },
  bhp: {
    krotko: 'BHP, zagrożenie w pracy',
    rejonowy: false,
    pip: 'Inspektor może nakazać usunięcie uchybień w terminie (art. 11 ust. 1 pkt 1 ustawy o PIP), a przy bezpośrednim zagrożeniu życia lub zdrowia wstrzymać prace albo maszyny; te nakazy wykonuje się od razu (pkt 2–4).',
    sad: 'Sąd pracy rozpatruje roszczenia, na przykład o odszkodowanie; nakazy BHP wydaje inspekcja, nie sąd.',
  },
};

/** Opłata od pisma w sprawie o prawa majątkowe (art. 13 ust. 1–2 i art. 21 ustawy o kosztach sądowych). */
export function oplataOdPisma(wartosc: number): number {
  if (!(wartosc > 0)) return 0;
  const progi: [number, number][] = [[500, 30], [1500, 100], [4000, 200], [7500, 400], [10_000, 500], [15_000, 750], [20_000, 1000]];
  // Wartość przedmiotu sporu podaje się w zaokrągleniu w górę do pełnego złotego (art. 126¹ § 3 KPC).
  const w = Math.ceil(Math.round(wartosc * 100) / 100);
  for (const [do_, oplata] of progi) if (w <= do_) return oplata;
  return Math.min(Math.ceil(w * 0.05), 100_000);
}

export const PROG_APELACJI = 50_000;
export const PROG_SADU_OKREGOWEGO = 100_000;

/** Opłata od apelacji pracownika (art. 35 ust. 1 zdanie drugie): 0 do 50 000 zł, potem od nadwyżki według art. 13. */
export const oplataApelacji = (wartosc: number) => (wartosc > PROG_APELACJI ? oplataOdPisma(wartosc - PROG_APELACJI) : 0);

export type Sad = 'rejonowy' | 'okręgowy';

export function sadPierwszejInstancji(sprawa: SprawaPracownicza, wartosc: number): Sad {
  return !SPRAWY_PRACOWNICZE[sprawa].rejonowy && wartosc > PROG_SADU_OKREGOWEGO ? 'okręgowy' : 'rejonowy';
}

export interface WynikSadu {
  sad: string;
  pozew: string;
  apelacja: string;
  pip: string;
  droga: string;
  uwagi: string[];
}

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. Wartość 0: nie podano kwoty. */
export function opisSadu(sprawa: SprawaPracownicza, wartosc: number): WynikSadu {
  if (!(wartosc >= 0)) throw new RangeError('Wartość sporu nie może być ujemna');
  const s = SPRAWY_PRACOWNICZE[sprawa];
  const sad = sadPierwszejInstancji(sprawa, wartosc);
  const apel = oplataApelacji(wartosc);
  const uwagi: string[] = [];
  if (s.rejonowy) uwagi.push(sprawa === 'mobbing' ? 'Sprawa wniesiona od 5 listopada 2026 r. należy do sądu rejonowego bez względu na kwotę (art. 461 § 1¹ Kodeksu postępowania cywilnego, art. 5 ustawy z 19 czerwca 2026 r.).' : 'Ta sprawa należy do sądu rejonowego bez względu na kwotę (art. 461 § 1¹ Kodeksu postępowania cywilnego).');
  else if (sad === 'okręgowy') uwagi.push('Przy roszczeniu majątkowym powyżej 100 000 zł właściwy jest sąd okręgowy (art. 17 pkt 4 Kodeksu postępowania cywilnego).');
  if (apel > 0) {
    uwagi.push(`Opłata od apelacji liczona od ${liczba(Math.ceil(wartosc) - PROG_APELACJI)} zł, czyli od wartości ponad 50 000 zł (art. 35 ust. 1 ustawy o kosztach sądowych). Gdy apelacja dotyczy tylko części wyroku, opłata liczy się od tej części (art. 126¹ § 2 Kodeksu postępowania cywilnego).`);
  }
  uwagi.push('Bez opłaty nie znaczy bez ryzyka: przegrana strona zwraca przeciwnikowi na jego żądanie koszty procesu, na przykład wynagrodzenie adwokata (art. 98 § 1 Kodeksu postępowania cywilnego), choć w wypadkach szczególnie uzasadnionych sąd może tego nie zasądzić (art. 102). Wydatkami, na przykład za biegłego, sąd obciąża pracownika tylko w wypadkach szczególnie uzasadnionych (art. 97 ustawy o kosztach sądowych).');
  return {
    sad: `Sąd ${sad} (sąd pracy)`,
    pozew: '0 zł',
    apelacja: `${liczba(apel)} zł`,
    pip: s.pip,
    droga: s.sad,
    uwagi,
  };
}
