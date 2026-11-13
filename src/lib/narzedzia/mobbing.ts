// Mobbing i dyskryminacja: najniższe zadośćuczynienie albo odszkodowanie i przedawnienie (Kodeks pracy, tekst jednolity
// Dz.U. 2026 poz. 1245, ze zmianami z ustawy z 19 czerwca 2026 r., Dz.U. 2026 poz. 1046, w mocy od 5 listopada 2026 r.):
// - od 5.11.2026: naruszenie zasady równego traktowania: zadośćuczynienie nie niższe niż minimalne wynagrodzenie albo
//   odszkodowanie (art. 18^3d § 1); naruszenie wielokrotne (powtarzalne z tej samej przyczyny, z wielu przyczyn albo
//   jednokrotne z wielu przyczyn naraz, § 3): zadośćuczynienie nie niższe niż trzykrotność (§ 2); niekorzystne
//   traktowanie za korzystanie z uprawnień albo za wsparcie innej osoby: zadośćuczynienie nie niższe niż minimalne
//   wynagrodzenie albo odszkodowanie (art. 18^3e § 2–3); mobbing: zadośćuczynienie nie niższe niż sześciokrotność albo
//   odszkodowanie (art. 94^3 § 11); ciężar dowodu przy dyskryminacji: osoba uprawdopodabnia, pracodawca wykazuje, że
//   nie naruszył zasady (art. 18^3f);
// - przed 5.11.2026 (brzmienie oznaczone w tekście jednolitym odnośnikami 11 i 28): odszkodowanie nie niższe niż
//   minimalne wynagrodzenie za naruszenie równego traktowania (dawny art. 18^3d) i za odwet (dawny art. 18^3e § 3);
//   przy mobbingu odszkodowanie nie niższe niż minimalne wynagrodzenie (dawny art. 94^3 § 4) i „odpowiednia suma”
//   zadośćuczynienia, gdy mobbing wywołał rozstrój zdrowia (dawny § 3, bez kwoty najniższej);
// - nowe przepisy stosuje się też do wielokrotnego naruszenia i uporczywego nękania, które zaczęły się przed
//   5.11.2026 i trwały po tym dniu (art. 3 ustawy zmieniającej).
// Interpretacje (przepisy tego nie rozstrzygają, wybieramy wariant korzystniejszy dla pracownika):
// - „minimalne wynagrodzenie ustalane na podstawie odrębnych przepisów” bez wskazania dnia: liczymy z płacy minimalnej
//   z wybranego roku (domyślnie bieżącego) i pokazujemy kwotę z następnego roku, jeśli jest już ogłoszona;
// - zachowanie w dniu 5.11.2026 i później: nowe przepisy (art. 3 mówi o zachowaniach trwających „po dniu” wejścia
//   w życie, ale w dniu wejścia w życie nowe brzmienie już obowiązuje);
// - przedawnienie: 3 lata od dnia, w którym roszczenie stało się wymagalne (art. 291 § 1); Kodeks nie mówi, kiedy
//   wymagalne jest roszczenie o zadośćuczynienie, więc liczymy ostrożnie od dnia zachowania wpisanego przez osobę (koniec
//   bez przesunięć, jak w src/lib/narzedzia/przedawnienie.ts); czy przy mobbingu termin biegnie od ostatniego zachowania,
//   czy osobno od każdego, Kodeks nie rozstrzyga;
// - zadośćuczynienie „lub” odszkodowanie: spójnik „lub” nie wyklucza dochodzenia obu (wariant korzystny dla pracownika);
// - art. 18^3f to przepis o postępowaniu bez przepisu przejściowego: przy dyskryminacji sprzed 5.11.2026 piszemy, że sąd
//   w sprawie wniesionej od tego dnia może go stosować.
import { PLACA_MINIMALNA } from '../../data/prawo';
import { odmiana } from '../redakcja';
import { zl } from './format';
import { przedawnienie } from './przedawnienie';
import { dataPoPolsku } from './terminy';

/** Pierwszy dzień nowych przepisów o mobbingu i równym traktowaniu (art. 6 ustawy z 19 czerwca 2026 r.). */
export const NOWE_PRZEPISY_OD = '2026-11-05';

export type Naruszenie = 'dyskryminacja' | 'wielokrotna' | 'odwet' | 'mobbing';

/** `krotko` do listy wyboru (telefon ucina długie opcje), `nazwa` do opisu pod polem. */
export const NARUSZENIA: Record<Naruszenie, { krotko: string; nazwa: string }> = {
  dyskryminacja: { krotko: 'Dyskryminacja', nazwa: 'Gorsze traktowanie na przykład z powodu płci, wieku, narodowości albo umowy na czas określony (art. 18³a § 1).' },
  wielokrotna: { krotko: 'Powtarzana dyskryminacja', nazwa: 'Powtarzana z tej samej przyczyny, z wielu przyczyn albo jednorazowo z kilku przyczyn naraz.' },
  odwet: { krotko: 'Kara za upominanie się', nazwa: 'Gorsze traktowanie za upominanie się o prawa po ich naruszeniu (skarga, pozew) albo za wsparcie osoby, która to robi.' },
  mobbing: { krotko: 'Mobbing', nazwa: 'Uporczywe nękanie: powtarzalne, nawracające albo stałe.' },
};

export interface RegulaRoszczenia {
  /** Najniższa kwota jako wielokrotność płacy minimalnej (0: przepis nie podaje kwoty najniższej). */
  mnoznik: number;
  /** Czego dotyczy najniższa kwota. */
  rodzaj: 'zadośćuczynienie' | 'odszkodowanie';
  przepis: string;
}

const NOWE: Record<Naruszenie, RegulaRoszczenia> = {
  dyskryminacja: { mnoznik: 1, rodzaj: 'zadośćuczynienie', przepis: 'art. 18³d § 1 Kodeksu pracy' },
  wielokrotna: { mnoznik: 3, rodzaj: 'zadośćuczynienie', przepis: 'art. 18³d § 2 Kodeksu pracy' },
  odwet: { mnoznik: 1, rodzaj: 'zadośćuczynienie', przepis: 'art. 18³e § 2 Kodeksu pracy' },
  mobbing: { mnoznik: 6, rodzaj: 'zadośćuczynienie', przepis: 'art. 94³ § 11 Kodeksu pracy' },
};

const DAWNE: Record<Naruszenie, RegulaRoszczenia> = {
  dyskryminacja: { mnoznik: 1, rodzaj: 'odszkodowanie', przepis: 'art. 18³d Kodeksu pracy w brzmieniu sprzed 5 listopada 2026 r.' },
  wielokrotna: { mnoznik: 1, rodzaj: 'odszkodowanie', przepis: 'art. 18³d Kodeksu pracy w brzmieniu sprzed 5 listopada 2026 r.' },
  odwet: { mnoznik: 1, rodzaj: 'odszkodowanie', przepis: 'art. 18³e § 3 Kodeksu pracy w brzmieniu sprzed 5 listopada 2026 r.' },
  mobbing: { mnoznik: 1, rodzaj: 'odszkodowanie', przepis: 'art. 94³ § 4 Kodeksu pracy w brzmieniu sprzed 5 listopada 2026 r.' },
};

/** Przepisy dla zachowania z danego dnia: nowe od 5 listopada 2026 r. */
export const nowePrzepisy = (dataZachowania: string) => dataZachowania >= NOWE_PRZEPISY_OD;

export function regula(naruszenie: Naruszenie, dataZachowania: string): RegulaRoszczenia {
  return (nowePrzepisy(dataZachowania) ? NOWE : DAWNE)[naruszenie];
}

/** Najniższa kwota w złotych przy płacy minimalnej z danego roku; null, gdy nie mamy płacy na ten rok. */
export function najnizszaKwota(naruszenie: Naruszenie, dataZachowania: string, rok: number): number | null {
  const placa = PLACA_MINIMALNA[rok];
  if (!placa) return null;
  return regula(naruszenie, dataZachowania).mnoznik * placa.miesiecznie;
}

export interface OpisMobbingu {
  kwota: string;
  opis: string;
  przepisy: string;
  przedawnienie: string;
  status: string;
  statusKlasa: 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';
  dowod: string;
  uwagi: string[];
}

const DOWOD_NOWY =
  'Wystarczy uprawdopodobnić naruszenie, czyli przedstawić fakty, które je uwiarygodniają; wtedy pracodawca musi wykazać, że zasady nie naruszył (art. 18³f), a przy różnicowaniu z art. 18³b § 1, że kierował się obiektywnymi powodami.';
const DOWOD_DAWNY =
  'Gdy pracodawca różnicował sytuację pracownika z przyczyny z art. 18³a § 1, to pracodawca musi udowodnić, że kierował się obiektywnymi powodami (art. 18³b § 1). W sprawie wniesionej od 5 listopada 2026 r. sąd może stosować art. 18³f (wystarczy uprawdopodobnić naruszenie): to przepis o postępowaniu, a ustawa zmieniająca nie ma tu przepisu przejściowego.';
const DOWOD_OGOLNY =
  'Fakty musisz udowodnić Ty, więc zbieraj dowody: świadków, wiadomości, notatki z datami. Kodeks pracy nie ma przy tym roszczeniu osobnej reguły dowodowej, a fakty udowadnia ta strona, która wywodzi z nich skutki prawne (art. 6 Kodeksu cywilnego przez art. 300 Kodeksu pracy). Gdy sprawa dotyczy dyskryminacji albo odwetu za skargę na nierówne traktowanie, w postępowaniu o naruszenie równego traktowania wystarczy naruszenie uprawdopodobnić (art. 18³f, od 5 listopada 2026 r.).';

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisMobbingu(naruszenie: Naruszenie, dataZachowania: string, rok: number, dzis: string): OpisMobbingu {
  const nowe = nowePrzepisy(dataZachowania);
  const r = regula(naruszenie, dataZachowania);
  const kwota = najnizszaKwota(naruszenie, dataZachowania, rok);
  const p = przedawnienie(dataZachowania, dzis);
  const zostalo = p.zostalo;
  const status =
    p.status === 'po-terminie'
      ? 'Termin minął'
      : zostalo === 0
        ? 'To ostatni dzień'
        : `Zostało: ${odmiana(zostalo, ['dzień', 'dni', 'dni'])}`;
  const uwagi: string[] = [];
  let opis: string;
  if (kwota === null) {
    opis = `nie mamy płacy minimalnej na ${rok} r.`;
  } else if (r.rodzaj === 'zadośćuczynienie') {
    const razy = r.mnoznik === 1 ? 'płaca minimalna' : r.mnoznik === 3 ? '3 × płaca minimalna' : '6 × płaca minimalna';
    opis = `zadośćuczynienie za krzywdę: co najmniej ${razy} z ${rok} r.; możesz też żądać odszkodowania za szkodę majątkową, bez kwoty najniższej`;
  } else {
    opis = `odszkodowanie: co najmniej płaca minimalna z ${rok} r.`;
  }
  if (!nowe && naruszenie === 'mobbing') {
    uwagi.push('Gdy mobbing wywołał rozstrój zdrowia, możesz też żądać zadośćuczynienia w „odpowiedniej sumie”: przepis nie podaje kwoty najniższej (art. 94³ § 3 w brzmieniu sprzed 5 listopada 2026 r.).');
  }
  if (!nowe && (naruszenie === 'mobbing' || naruszenie === 'wielokrotna')) {
    uwagi.push('Jeśli te zachowania zaczęły się wcześniej i trwały także 5 listopada 2026 r. albo później, stosuje się nowe przepisy (art. 3 ustawy z 19 czerwca 2026 r. mówi o zachowaniach trwających po dniu wejścia w życie; sam 5 listopada liczymy na korzyść pracownika): wpisz datę ostatniego zachowania.');
  }
  if (nowe && naruszenie === 'wielokrotna') {
    uwagi.push('Przy naruszeniu wielokrotnym sąd ocenia rozmiar krzywdy i zasądza kwotę odpowiednio wyższą, nie niższą niż trzykrotność płacy minimalnej (art. 18³d § 2).');
  }
  if (nowe && naruszenie === 'mobbing') {
    uwagi.push('Mobbingiem nie są zachowania incydentalne, czyli sporadyczne, ani uzasadniona krytyka wyrażona we właściwej formie (art. 94³ § 3 i 9). Mobbingiem są te zachowania, choćby ich celem nie było nękanie (§ 7).');
  }
  if (naruszenie === 'odwet') {
    uwagi.push(nowe
      ? 'Ochrona nie przysługuje osobie, która wiedziała, że do naruszenia prawa pracy nie doszło (art. 18³e § 4).'
      : 'Ochrona obejmuje też osobę, która wspierała pracownika korzystającego z tych uprawnień (art. 18³e § 2 w brzmieniu sprzed 5 listopada 2026 r.).');
  }
  if (kwota !== null && rok < Number(dataZachowania.slice(0, 4))) {
    uwagi.push('Wybrany rok płacy minimalnej jest wcześniejszy niż rok zachowania, więc kwota jest niższa niż z płacą z roku zachowania albo późniejszego.');
  }
  const nastepny = PLACA_MINIMALNA[rok + 1];
  if (kwota !== null && nastepny && r.mnoznik > 0) {
    uwagi.push(`Kodeks nie mówi, z którego dnia brać płacę minimalną; z płacą z ${rok + 1} r. najniższa kwota to ${zl(r.mnoznik * nastepny.miesiecznie)}.`);
  }
  uwagi.push('To kwota najniższa, a nie wycena sprawy: o tym, czy doszło do naruszenia i ile się należy, rozstrzyga sąd pracy.');
  return {
    kwota: kwota === null ? '—' : zl(kwota),
    opis,
    przepisy: r.przepis,
    przedawnienie: dataPoPolsku(p.koniec),
    status,
    statusKlasa: p.status,
    dowod: naruszenie === 'mobbing' || naruszenie === 'odwet' ? DOWOD_OGOLNY : nowe ? DOWOD_NOWY : DOWOD_DAWNY,
    uwagi,
  };
}
