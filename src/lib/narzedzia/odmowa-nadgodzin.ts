// Czy można odmówić nadgodzin: kiedy pracodawca może polecić pracę w godzinach nadliczbowych, kogo nie wolno w nich
// zatrudniać, limit roczny i odpoczynek dobowy.
//
// Przepisy (teksty z API Sejmu, kopie w .cache/narzedzia/prawo/):
// - Kodeks pracy (t.j. Dz.U. 2026 poz. 1245, stan na 27.08.2026 r.; późniejsze zmiany Dz.U. 2026 poz. 1046 dotyczą
//   art. 18³ᵃ i nast., nie tych przepisów):
//   art. 100 § 1: polecenia przełożonych dotyczące pracy wykonuje się, jeżeli nie są sprzeczne z prawem lub umową;
//   art. 151 § 1: nadgodziny dopuszczalne w razie (1) akcji ratowniczej albo usunięcia awarii, (2) szczególnych potrzeb
//     pracodawcy; § 2: pkt 2 nie stosuje się na stanowiskach z przekroczeniem NDS albo NDN; § 3: z powodu pkt 2 najwyżej
//     150 godzin w roku kalendarzowym; § 4: układ zbiorowy, regulamin pracy albo umowa mogą ustalić inną liczbę;
//   art. 132 § 1: co najmniej 11 godzin nieprzerwanego odpoczynku w każdej dobie; § 2 pkt 2: nie dotyczy akcji ratowniczej
//     i usuwania awarii (§ 2 pkt 1: pracowników zarządzających zakładem); § 3: wtedy równoważny odpoczynek w okresie
//     rozliczeniowym; art. 128 § 3 pkt 1: doba = 24 godziny od rozpoczęcia pracy według rozkładu;
//   art. 133: 35 godzin odpoczynku w tygodniu; art. 131 § 1: przeciętnie najwyżej 48 godzin tygodniowo z nadgodzinami;
//   art. 178 § 1: pracownicy w ciąży nie wolno zatrudniać w nadgodzinach (bez wyjątku na zgodę); § 2: pracownika
//     wychowującego dziecko do ukończenia 8 roku życia nie wolno bez jego zgody;
//   art. 203 § 1: młodocianego nie wolno zatrudniać w nadgodzinach;
//   art. 151¹–151²: dodatek albo czas wolny; art. 151⁴: kadra zarządzająca i kierownicy (poza zakresem narzędzia).
// - ustawa o rehabilitacji (t.j. Dz.U. 2026 poz. 884): art. 15 ust. 3: osoba niepełnosprawna nie może być zatrudniona
//   w godzinach nadliczbowych; art. 16 ust. 1: nie dotyczy zatrudnionych przy pilnowaniu i gdy, na wniosek osoby
//   zatrudnionej, lekarz przeprowadzający badania profilaktyczne (a w razie jego braku lekarz sprawujący opiekę) wyrazi zgodę.
//
// Interpretacje (opisane w „Jak liczymy” na stronie):
// - nadgodziny dziś = koniec pracy − koniec zmiany według grafiku (praca ponad dobowy wymiar z rozkładu);
// - odpoczynek dobowy liczymy w dobie zaczynającej się o godzinie rozpoczęcia dzisiejszej zmiany: od końca pracy do końca
//   tej doby albo do początku następnej zmiany, jeśli zaczyna się wcześniej; wynik musi mieć co najmniej 11 godzin, więc
//   najpóźniejszy koniec pracy = min(start + 13 h, następna zmiana − 11 h);
// - „następna zmiana jutro” to zmiana w dniu kalendarzowym po dniu, w którym zaczęła się dzisiejsza;
// - limit roczny dotyczy tylko nadgodzin z powodu szczególnych potrzeb; godziny w roku wpisuje użytkownik;
// - czy potrzeby są „szczególne”, przepis nie definiuje: narzędzie tego nie ocenia;
// - zgoda z art. 178 § 2 i zgoda lekarza z art. 16 ust. 1 pkt 2 to fakty, które podaje użytkownik.

export const LIMIT_ROCZNY = 150;
export const ODPOCZYNEK_MIN = 11 * 60;
export const DOBA_MIN = 24 * 60;

export type Powod = 'potrzeby' | 'awaria';

export interface DaneNadgodzin {
  powod: Powod;
  ciaza: boolean;
  dziecko8: boolean;
  zgodaDziecko: boolean;
  mlodociany: boolean;
  niepelnosprawny: boolean;
  zgodaLekarza: boolean;
  pilnowanie: boolean;
  nds: boolean;
  /** „6:00” */
  start: string;
  /** koniec zmiany według grafiku */
  koniecZmiany: string;
  /** do której pracodawca chce, żeby praca trwała */
  koniecPracy: string;
  /** początek zmiany w dniu następnym; pusty = dzień wolny */
  nastepna: string;
  /** nadgodziny z powodu szczególnych potrzeb przepracowane wcześniej w tym roku (godziny) */
  wRoku: number;
  limit: number;
}

export type Werdykt = 'zakaz' | 'za-dlugo' | 'zgoda' | 'obowiazek' | 'brak';

/** „6:00”, „06:00” → minuty od północy; null przy błędzie. */
export function minuty(godzina: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(godzina.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h <= 23 && min <= 59 ? h * 60 + min : null;
}

/** Minuty od północy dnia rozpoczęcia zmiany → „19:00” albo „1:30 następnego dnia”. */
export function godzina(min: number): string {
  const dzien = Math.floor(min / DOBA_MIN);
  const w = ((min % DOBA_MIN) + DOBA_MIN) % DOBA_MIN;
  const t = `${Math.floor(w / 60)}:${String(w % 60).padStart(2, '0')}`;
  return dzien === 0 ? t : dzien === 1 ? `${t} następnego dnia` : `${t} (${dzien} dni później)`;
}

/** 150 → „150 h”, 2,5 → „2,5 h”, minuty 150 → „2 h 30 min”. */
export const czasMin = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? (h ? `${h} h ${m} min` : `${m} min`) : `${h} h`;
};
const liczba = (x: number) => (Math.round(x * 100) / 100).toLocaleString('pl-PL', { maximumFractionDigits: 2 });

export interface CzasDnia {
  start: number;
  koniecZmiany: number;
  koniecPracy: number;
  nastepna: number | null;
  nadgodzinyMin: number;
  /** odpoczynek w dobie po końcu pracy (minuty) */
  odpoczynek: number;
  /** najpóźniejszy koniec pracy z 11 godzinami odpoczynku */
  najpozniej: number;
}

export type BladCzasu = 'godziny' | 'kolejnosc' | 'nastepna';
export const KOMUNIKATY: Record<BladCzasu | 'liczby', string> = {
  godziny: 'Wpisz godziny w postaci 6:00.',
  kolejnosc: 'Koniec pracy nie może być wcześniej niż koniec zmiany.',
  nastepna: 'Następna zmiana zaczyna się, zanim skończysz pracę.',
  liczby: 'Wpisz liczbę godzin, na przykład 40 albo 12,5.',
};

/** Czasy w minutach od północy dnia, w którym zaczęła się zmiana. */
export function czasDnia(d: Pick<DaneNadgodzin, 'start' | 'koniecZmiany' | 'koniecPracy' | 'nastepna'>): CzasDnia | { blad: BladCzasu } {
  const s = minuty(d.start);
  const k0 = minuty(d.koniecZmiany);
  const e0 = minuty(d.koniecPracy);
  const n0 = d.nastepna.trim() ? minuty(d.nastepna) : null;
  if (s === null || k0 === null || e0 === null || (d.nastepna.trim() && n0 === null)) return { blad: 'godziny' };
  const k = k0 <= s ? k0 + DOBA_MIN : k0;
  // Koniec pracy przed startem według zegara to już następny dzień; równy startowi to pełna doba (najwyżej 24 h).
  const e = e0 <= s ? e0 + DOBA_MIN : e0;
  if (e < k) return { blad: 'kolejnosc' };
  const n = n0 === null ? null : n0 + DOBA_MIN;
  if (n !== null && n < e) return { blad: 'nastepna' };
  const koniecDoby = s + DOBA_MIN;
  const granica = n === null ? koniecDoby : Math.min(koniecDoby, n);
  return {
    start: s,
    koniecZmiany: k,
    koniecPracy: e,
    nastepna: n,
    nadgodzinyMin: e - k,
    odpoczynek: granica - e,
    najpozniej: granica - ODPOCZYNEK_MIN,
  };
}

/** „40”, „12,5”, „12.5” → liczba ≥ 0; null przy błędzie. */
export function wczytajGodziny(tekst: string): number | null {
  const t = tekst.trim().replace(',', '.');
  if (!t) return 0;
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(t)) return null;
  return Number(t);
}

export interface OpisNadgodzin {
  werdykt: Werdykt;
  naglowek: string;
  powody: string[];
  dzis: string;
  najpozniej: string;
  limit: string;
  uwagi: string[];
}

const NAGLOWKI: Record<Werdykt, string> = {
  zakaz: 'Nie wolno: możesz odmówić',
  'za-dlugo': 'Nie tak długo',
  zgoda: 'Tylko za Twoją zgodą',
  obowiazek: 'Co do zasady musisz zostać',
  brak: 'To nie są nadgodziny',
};

/** Teksty wyniku dla strony i skryptu. */
export function opisNadgodzin(d: DaneNadgodzin, c: CzasDnia): OpisNadgodzin {
  const powody: string[] = [];
  const uwagi: string[] = [];
  const awaria = d.powod === 'awaria';
  const godzinyDzis = c.nadgodzinyMin / 60;
  let werdykt: Werdykt = 'obowiazek';

  // Zakazy bez wyjątku na powód.
  if (d.ciaza) powody.push('W ciąży nie wolno pracować w godzinach nadliczbowych, także przy awarii i nawet za zgodą (art. 178 § 1 Kodeksu pracy).');
  if (d.mlodociany) powody.push('Pracownika młodocianego nie wolno zatrudniać w godzinach nadliczbowych (art. 203 § 1 Kodeksu pracy).');
  if (d.niepelnosprawny && !d.zgodaLekarza && !d.pilnowanie) {
    powody.push('Osoba z niepełnosprawnością nie może pracować w godzinach nadliczbowych (art. 15 ust. 3 ustawy o rehabilitacji), chyba że pracuje przy pilnowaniu albo lekarz przeprowadzający badania profilaktyczne na jej wniosek wyraził na to zgodę (art. 16 ust. 1).');
  }
  if (!awaria && d.nds) {
    powody.push('Na stanowisku z przekroczonymi najwyższymi dopuszczalnymi stężeniami albo natężeniami czynników szkodliwych nadgodziny z powodu szczególnych potrzeb pracodawcy są niedopuszczalne (art. 151 § 2 Kodeksu pracy).');
  }
  if (powody.length && c.nadgodzinyMin === 0) {
    // Bez nadgodzin dziś nie ma czego odmawiać; zakaz zostaje jako uwaga na przyszłość.
    uwagi.push(...powody.map((p) => `Gdyby praca trwała dłużej: ${p.charAt(0).toLowerCase()}${p.slice(1)}`));
    powody.length = 0;
  } else if (powody.length) werdykt = 'zakaz';

  const zostalo = Math.max(0, d.limit - d.wRoku);
  if (!awaria && werdykt !== 'zakaz' && c.nadgodzinyMin > 0) {
    if (d.wRoku + godzinyDzis > d.limit + 1e-9) {
      werdykt = 'za-dlugo';
      powody.push(
        zostalo > 0
          ? `Limit nadgodzin z powodu szczególnych potrzeb to ${liczba(d.limit)} h w roku kalendarzowym (art. 151 § 3–4 Kodeksu pracy). Zostało ${liczba(zostalo)} h, a dziś byłoby ${czasMin(c.nadgodzinyMin)}.`
          : `Limit nadgodzin z powodu szczególnych potrzeb to ${liczba(d.limit)} h w roku kalendarzowym (art. 151 § 3–4 Kodeksu pracy) i jest już wykorzystany.`,
      );
    }
    if (c.odpoczynek < ODPOCZYNEK_MIN) {
      werdykt = 'za-dlugo';
      powody.push(
        c.najpozniej >= c.koniecZmiany
          ? `Po pracy musi zostać 11 godzin nieprzerwanego odpoczynku w dobie (art. 132 § 1 Kodeksu pracy), a zostałoby ${czasMin(c.odpoczynek)}. Najpóźniej możesz skończyć o ${godzina(c.najpozniej)}.`
          : `Po pracy musi zostać 11 godzin nieprzerwanego odpoczynku w dobie (art. 132 § 1 Kodeksu pracy), a nie zostaje ich nawet po zmianie z grafiku. Nadgodzin dziś być nie może.`,
      );
    }
  }
  if (werdykt === 'obowiazek' && c.nadgodzinyMin === 0) werdykt = 'brak';
  if (werdykt === 'obowiazek' && d.dziecko8 && !d.zgodaDziecko) {
    werdykt = 'zgoda';
    powody.push('Gdy wychowujesz dziecko, które nie ma jeszcze 8 lat, pracodawca nie może zatrudniać Cię w nadgodzinach bez Twojej zgody (art. 178 § 2 Kodeksu pracy). Możesz się nie zgodzić.');
  }
  if (werdykt === 'obowiazek') {
    powody.push(
      awaria
        ? 'Przy akcji ratowniczej albo usuwaniu awarii nadgodziny są dopuszczalne (art. 151 § 1 pkt 1 Kodeksu pracy), bez rocznego limitu. Polecenie zgodne z przepisami i umową trzeba wykonać (art. 100 § 1).'
        : 'Nadgodziny są dopuszczalne przy szczególnych potrzebach pracodawcy (art. 151 § 1 pkt 2 Kodeksu pracy), w granicach limitu i odpoczynku. Polecenie zgodne z przepisami i umową trzeba wykonać (art. 100 § 1). Przepis nie definiuje „szczególnych potrzeb”; w sporze ocenia to sąd.',
    );
  }
  if (werdykt === 'brak') powody.push('Praca kończy się z końcem zmiany według grafiku, więc nie ma godzin nadliczbowych (art. 151 § 1 Kodeksu pracy).');

  if (awaria && c.odpoczynek < ODPOCZYNEK_MIN && werdykt !== 'zakaz') {
    uwagi.push(`Przy akcji ratowniczej albo awarii 11 godzin odpoczynku nie obowiązuje (zostałoby ${czasMin(c.odpoczynek)}), ale należy się równoważny odpoczynek w okresie rozliczeniowym (art. 132 § 2 pkt 2 i § 3).`);
  }
  if (c.nastepna !== null && c.nastepna < c.start + DOBA_MIN) {
    uwagi.push('Następna zmiana zaczyna się wcześniej niż dzisiejsza, więc jej początek wypada w tej samej dobie: poza ruchomym rozkładem to też nadgodziny (art. 151 § 1 i art. 140¹ Kodeksu pracy).');
  }
  if (werdykt !== 'zakaz' && werdykt !== 'brak') uwagi.push('Za nadgodziny należy się dodatek 50% albo 100% albo czas wolny (art. 151¹–151² Kodeksu pracy).');

  return {
    werdykt,
    naglowek: NAGLOWKI[werdykt],
    powody,
    dzis: c.nadgodzinyMin ? `${czasMin(c.nadgodzinyMin)}, do ${godzina(c.koniecPracy)}` : 'brak',
    najpozniej: awaria
      ? c.najpozniej >= c.koniecZmiany
        ? `${godzina(c.najpozniej)} przy zwykłej pracy; przy awarii bez tej granicy`
        : 'przy zwykłej pracy nadgodzin dziś być nie może; przy awarii bez tej granicy'
      : c.najpozniej >= c.koniecZmiany
        ? `${godzina(c.najpozniej)} (11 h odpoczynku${c.nastepna === null ? ' w dobie' : ' przed następną zmianą'})`
        : 'nadgodziny dziś naruszyłyby 11 h odpoczynku',
    limit: awaria
      ? 'nie dotyczy akcji ratowniczej ani awarii'
      : `zostało ${liczba(zostalo)} z ${liczba(d.limit)} h w tym roku${c.nadgodzinyMin ? `, po dzisiejszych ${liczba(Math.max(0, zostalo - godzinyDzis))} h` : ''}`,
    uwagi,
  };
}

