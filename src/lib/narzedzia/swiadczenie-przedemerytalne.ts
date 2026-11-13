// Świadczenie przedemerytalne: czy spełniasz warunki (ustawa z 30 kwietnia 2004 r. o świadczeniach przedemerytalnych,
// tekst jednolity Dz.U. 2026 poz. 115, stan na 22 stycznia 2026 r.; API Sejmu nie podaje zmian po nim):
// - art. 2 ust. 1: pkt 1 likwidacja albo niewypłacalność pracodawcy, co najmniej 6 miesięcy u niego, 56/61 lat i 20/25 lat
//   okresu uprawniającego do emerytury do dnia rozwiązania; pkt 2 rozwiązanie z przyczyn dotyczących zakładu pracy
//   (art. 2 ust. 1 pkt 38 ustawy o rynku pracy, Dz.U. 2025 poz. 620: m.in. zwolnienie z przyczyn niedotyczących
//   pracowników, upadłość, likwidacja, likwidacja stanowiska, art. 55 § 1 i 1^1 Kp), 6 miesięcy, 55/60 lat i 30/35 lat;
//   pkt 3 upadłość własnej działalności prowadzonej nieprzerwanie co najmniej 24 miesiące ze składkami, 56/61 lat
//   i 20/25 lat; pkt 4 rejestracja w urzędzie pracy do 30 dni po końcu renty z tytułu niezdolności do pracy pobieranej
//   nieprzerwanie co najmniej 5 lat, 55/60 lat i 20/25 lat do dnia końca renty; pkt 4a rejestracja do 60 dni po końcu
//   świadczenia pielęgnacyjnego, specjalnego zasiłku opiekuńczego albo zasiłku dla opiekuna pobieranych co najmniej
//   365 dni, 55/60 lat i 20/25 lat; pkt 5 przyczyny dotyczące zakładu pracy, 6 miesięcy i 35/40 lat bez warunku wieku;
//   pkt 6 likwidacja albo niewypłacalność, 6 miesięcy i 34/39 lat do 31 grudnia roku przed rozwiązaniem;
// - art. 2 ust. 2: okres uprawniający do emerytury według art. 5–9, 10 ust. 1 i 11 ustawy o FUS;
// - art. 2 ust. 3: świadczenie po co najmniej 180 dniach zasiłku dla bezrobotnych, przy rejestracji i wniosku do 30 dni
//   od dokumentu urzędu pracy o 180 dniach;
// - art. 3: 1600,70 zł w ustawie, waloryzowane jak emerytury; art. 4 ust. 1 pkt 3: ustaje w dniu 60/65 urodzin;
// - art. 5: zmniejszenie przy przychodzie powyżej 25% i zawieszenie powyżej 70% przeciętnego wynagrodzenia (kwoty
//   z komunikatu Prezesa ZUS od 1 marca, M.P. 2026 poz. 208).
// Interpretacje: likwidacja i niewypłacalność są też przyczynami dotyczącymi zakładu pracy (art. 2 ust. 1 pkt 38 lit. b
// ustawy o rynku pracy), więc przy nich sprawdzamy także pkt 2 i 5. Okres z pkt 6 (do 31 grudnia poprzedniego roku)
// szacujemy od dołu: wpisany staż minus miesiące bieżącego roku do rozwiązania (zaczęty miesiąc liczymy w całości);
// gdy szacunek nie wystarcza, a staż tak, wynik to „zależy”. Wiek „ukończony do dnia” rozwiązania: dzień urodzin
// wystarcza (urodzeni 29 lutego: 28 lutego w roku nieprzestępnym).

import { zl } from './format';
import { lat, latBrak } from './emerytura-pomostowa';
import { dataPoPolsku, dodajLata } from './terminy';

export type Plec = 'k' | 'm';
export type Przyczyna = 'likwidacja' | 'zaklad' | 'firma' | 'renta' | 'opiekun';

export interface DanePrzedemerytalne {
  plec: Plec;
  urodzenie: string;
  przyczyna: Przyczyna;
  /** Dzień rozwiązania umowy, ogłoszenia upadłości albo ustania renty lub świadczenia. */
  data: string;
  /** Okres składkowy i nieskładkowy (uprawniający do emerytury) do tego dnia (lata). */
  staz: number;
  /** Czy spełniony jest warunek czasu: 6 miesięcy u pracodawcy, 24 miesiące firmy, 5 lat renty albo 365 dni świadczenia. */
  okres: boolean;
}

/** Kwoty przychodu (art. 5 ust. 2 i art. 6 ust. 4) według komunikatów Prezesa ZUS. */
export const KWOTY_PRZYCHODU = [
  { od: '2025-03-01', dopuszczalna: 2045.5, graniczna: 5727.2, publikator: 'M.P. 2025 poz. 142' },
  { od: '2026-03-01', dopuszczalna: 2225.9, graniczna: 6232.5, publikator: 'M.P. 2026 poz. 208' },
] as const;

export function kwotyNaDzien(data: string) {
  const p = KWOTY_PRZYCHODU.filter((k) => k.od <= data);
  return p.length ? p[p.length - 1] : KWOTY_PRZYCHODU[0];
}

interface Podstawa {
  pkt: string;
  wiek: number | null;
  staz: number;
}

/** Podstawy z art. 2 ust. 1 sprawdzane przy danej przyczynie (pkt 6 osobno). */
export function podstawy(przyczyna: Przyczyna, plec: Plec): Podstawa[] {
  const k = plec === 'k';
  const p1 = { pkt: 'pkt 1', wiek: k ? 56 : 61, staz: k ? 20 : 25 };
  const p2 = { pkt: 'pkt 2', wiek: k ? 55 : 60, staz: k ? 30 : 35 };
  const p5 = { pkt: 'pkt 5', wiek: null, staz: k ? 35 : 40 };
  if (przyczyna === 'likwidacja') return [p1, p2, p5];
  if (przyczyna === 'zaklad') return [p2, p5];
  if (przyczyna === 'firma') return [{ ...p1, pkt: 'pkt 3' }];
  if (przyczyna === 'renta') return [{ pkt: 'pkt 4', wiek: k ? 55 : 60, staz: k ? 20 : 25 }];
  return [{ pkt: 'pkt 4a', wiek: k ? 55 : 60, staz: k ? 20 : 25 }];
}

export type StanPrzedemerytalnego = 'spelnia' | 'zalezy' | 'brak' | 'wiek-emerytalny';

export function swiadczeniePrzedemerytalne(dane: DanePrzedemerytalne) {
  // Staż z ułamkiem do setnych przed porównaniem (tak jak go wyświetlamy).
  const d = { ...dane, staz: Math.round(dane.staz * 100) / 100 };
  if (!(d.staz >= 0)) throw new RangeError('Staż nie może być ujemny');
  if (d.data < d.urodzenie) throw new RangeError('Data przed urodzeniem');
  const wiekEmerytalny = d.plec === 'k' ? 60 : 65;
  const koniec = dodajLata(d.urodzenie, wiekEmerytalny);
  const lista = podstawy(d.przyczyna, d.plec).map((p) => {
    const dataWieku = p.wiek === null ? null : dodajLata(d.urodzenie, p.wiek);
    return { ...p, dataWieku, ok: d.okres && d.staz >= p.staz && (dataWieku === null || d.data >= dataWieku) };
  });
  // Pkt 6: staż do 31 grudnia roku przed rozwiązaniem; od dołu: staż minus zaczęte miesiące bieżącego roku.
  let pkt6: 'tak' | 'zalezy' | 'nie' | null = null;
  const prog6 = d.plec === 'k' ? 34 : 39;
  if (d.przyczyna === 'likwidacja') {
    const miesiaceRoku = Number(d.data.slice(5, 7));
    pkt6 = !d.okres || d.staz < prog6 ? 'nie' : d.staz - miesiaceRoku / 12 >= prog6 ? 'tak' : 'zalezy';
  }
  const spelnione = lista.filter((p) => p.ok).map((p) => p.pkt);
  if (pkt6 === 'tak') spelnione.push('pkt 6');
  let stan: StanPrzedemerytalnego;
  if (d.data >= koniec) stan = 'wiek-emerytalny';
  else if (spelnione.length) stan = 'spelnia';
  else if (pkt6 === 'zalezy') stan = 'zalezy';
  else stan = 'brak';
  return { stan, lista, spelnione, pkt6, prog6, koniec, wiekEmerytalny };
}

export interface OpisPrzedemerytalnego {
  stan: string;
  opis: string;
  podstawa: string;
  koniec: string;
  przychod: string;
  uwagi: string[];
}

const WARUNEK_OKRESU: Record<Przyczyna, string> = {
  likwidacja: 'co najmniej 6 miesięcy pracy u tego pracodawcy',
  zaklad: 'co najmniej 6 miesięcy pracy u tego pracodawcy',
  firma: 'co najmniej 24 miesiące działalności bez przerwy, ze składkami',
  renta: 'renta pobierana nieprzerwanie co najmniej 5 lat i rejestracja w urzędzie pracy do 30 dni po jej końcu',
  opiekun: 'świadczenie pobierane nieprzerwanie co najmniej 365 dni i rejestracja w urzędzie pracy do 60 dni po jego końcu',
};

export const warunekOkresu = (p: Przyczyna) => WARUNEK_OKRESU[p];

/** Pełny opis pozycji z krótkiej listy wyboru (telefon ucina długie opcje). */
const OPIS_PRZYCZYNY: Record<Przyczyna, string> = {
  likwidacja: 'Likwidacja albo niewypłacalność pracodawcy.',
  zaklad: 'Rozwiązanie umowy z przyczyn dotyczących zakładu pracy, na przykład zwolnienie z przyczyn niedotyczących pracowników albo likwidacja stanowiska.',
  firma: 'Ogłoszenie upadłości własnej działalności.',
  renta: 'Koniec renty z tytułu niezdolności do pracy.',
  opiekun: 'Koniec świadczenia pielęgnacyjnego, specjalnego zasiłku opiekuńczego albo zasiłku dla opiekuna.',
};

export const opisPrzyczyny = (p: Przyczyna) => OPIS_PRZYCZYNY[p];

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisPrzedemerytalnego(dane: DanePrzedemerytalne, dzis: string): OpisPrzedemerytalnego {
  const r = swiadczeniePrzedemerytalne(dane);
  const d = { ...dane, staz: Math.round(dane.staz * 100) / 100 };
  const kw = kwotyNaDzien(dzis);
  const o: OpisPrzedemerytalnego = {
    stan: '',
    opis: '',
    podstawa: r.spelnione.length ? `art. 2 ust. 1 ${r.spelnione.join(', ')}` : '—',
    koniec: dataPoPolsku(r.koniec),
    przychod: `bez zmniejszenia do ${zl(kw.dopuszczalna)}, zawieszenie powyżej ${zl(kw.graniczna)}`,
    uwagi: [],
  };
  if (r.stan === 'wiek-emerytalny') {
    o.stan = 'Nie przysługuje';
    o.opis = `świadczenie ustaje w dniu ${r.wiekEmerytalny}. urodzin (art. 4 ust. 1 pkt 3); w tym wieku można przejść na emeryturę`;
    o.podstawa = '—';
  } else if (r.stan === 'spelnia') {
    o.stan = 'Spełniasz warunki';
    o.opis = 'świadczenie przysługuje po co najmniej 180 dniach pobierania zasiłku dla bezrobotnych (art. 2 ust. 3)';
  } else if (r.stan === 'zalezy') {
    o.stan = 'Zależy od stażu na 31 grudnia';
    o.opis = `wystarczy ${lat(r.prog6)} okresu uprawniającego do emerytury do 31 grudnia ${Number(d.data.slice(0, 4)) - 1} r. (art. 2 ust. 1 pkt 6)`;
  } else {
    o.stan = 'Warunki niespełnione';
    const braki: string[] = [];
    if (!d.okres) braki.push(`brakuje warunku: ${WARUNEK_OKRESU[d.przyczyna]}`);
    else {
      // Najbliższa podstawa: najmniejszy brak stażu wśród tych, przy których wiek jest osiągnięty albo niewymagany.
      for (const p of r.lista) {
        const czesci: string[] = [];
        if (p.dataWieku && d.data < p.dataWieku) czesci.push(`wieku ${p.wiek} lat w dniu rozwiązania (osiągasz go ${dataPoPolsku(p.dataWieku)})`);
        if (d.staz < p.staz) czesci.push(`${latBrak(Math.round((p.staz - d.staz) * 100) / 100)} stażu`);
        braki.push(`${p.pkt}: brakuje ${czesci.join(' i ')}`);
      }
    }
    o.opis = braki.join('; ');
  }
  if (r.stan === 'spelnia' || r.stan === 'zalezy') {
    o.uwagi.push(
      'Do 180 dni wlicza się też okresy, za które zasiłek nie przysługiwał (art. 220 ust. 2 ustawy o rynku pracy), oraz pracę podjętą w tym czasie. Wniosek do ZUS składasz najpóźniej 30 dni od dnia, w którym urząd pracy wyda dokument o 180 dniach zasiłku, i wciąż musisz być w rejestrze bezrobotnych (art. 2 ust. 3 i 5).',
      `Ustawa podaje kwotę 1600,70 zł miesięcznie, podnoszoną co roku przy waloryzacji emerytur (art. 3); aktualną podaje ZUS. Przy przychodzie powyżej ${zl(kw.dopuszczalna)} świadczenie maleje o nadwyżkę, a powyżej ${zl(kw.graniczna)} jest zawieszone (art. 5, kwoty od ${dataPoPolsku(kw.od)}, ${kw.publikator}).`,
    );
  }
  o.uwagi.push('Prawo przyznaje ZUS na wniosek, od dnia po jego złożeniu z dokumentami (art. 7 ust. 1). Świadczenie ustaje m.in. z dniem nabycia emerytury i w dniu 60. urodzin kobiety albo 65. urodzin mężczyzny (art. 4 ust. 1).');
  return o;
}
