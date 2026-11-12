// Doba pracownicza i nadgodziny z doby (Kodeks pracy, t.j. Dz.U. 2026 poz. 1245):
// - doba to 24 kolejne godziny od godziny, w której pracownik zaczyna pracę według rozkładu (art. 128 § 3 pkt 1);
// - czas pracy nie może przekraczać 8 godzin na dobę (art. 129 § 1); praca ponad normy albo ponad przedłużony dobowy
//   wymiar wynikający z systemu i rozkładu to praca w godzinach nadliczbowych (art. 151 § 1);
// - dodatek 100% za nadgodziny w nocy, w niedziele i święta niebędące dniami pracy według rozkładu i w dniu wolnym
//   za niedzielę albo święto; 50% w każdym innym dniu (art. 151^1 § 1); pora nocna to 8 godzin między 21:00 a 7:00
//   (art. 151^7 § 1), niedziela i święto liczą się od 6:00 do 6:00, chyba że pracodawca ustalił inną godzinę
//   (art. 151^9 § 2; liczymy od 6:00);
// - w każdej dobie co najmniej 11 godzin nieprzerwanego odpoczynku (art. 132 § 1), z zastrzeżeniem art. 136 § 2 i 137:
//   w systemach do 16 i 24 h odpoczynek po zmianie co najmniej tak długi jak przepracowany czas. Dla zmiany dłuższej
//   niż 12 h (więcej nie pozwala art. 135 § 1) stan odpoczynku to „inne-zasady” i nie liczymy go jako naruszenia;
// - ruchomy rozkład (art. 140^1 § 1–2): ponowna praca w tej samej dobie nie jest nadgodzinami (§ 4), ale rozkład nie może
//   naruszać odpoczynku z art. 132 i 133 (§ 3); odpracowanie wyjścia w sprawach osobistych też nie jest nadgodzinami
//   (art. 151 § 2^1) — tylko wzmianka na stronie;
// - w systemie równoważnym dobowy wymiar można przedłużyć do 12 godzin (art. 135 § 1), do 16 i 24 godzin tylko przy pracach
//   z art. 136–137.
//
// Model (przyjęte interpretacje):
// - 7 kolejnych dni od podanej daty; w każdym dniu najwyżej jedna zmiana z rozkładu, od–do; koniec ≤ początek oznacza
//   zmianę przez północ (ta sama godzina = 24 h). Czas liczymy w minutach od 0:00 pierwszego dnia (bez zmian czasu).
//   Zmiany nachodzące na siebie to błąd danych (RangeError).
// - Doba dnia k to okno [początek zmiany k, początek + 24 h). Norma doby k = max(8 h, długość zmiany k): zmianę dłuższą
//   niż 8 h traktujemy jak przedłużony dobowy wymiar z systemu równoważnego (art. 151 § 1); godzin ponad 8 na samej
//   zmianie k nie liczymy jako nadgodzin.
// - Nadgodziny z doby k to minuty zmian kolejnych dni wewnątrz okna doby k, po odjęciu zapasu (norma − długość zmiany k).
//   Zapas zużywają najwcześniejsze z tych minut: nadgodziny to praca po wyczerpaniu normy doby, czyli chronologicznie
//   ostatnie godziny w oknie. Nadgodziny przypisujemy do dnia, w którym przypada ta praca (dnia j).
// - Każdą minutę liczymy najwyżej raz (w najwcześniejszej dobie). Przy jednej zmianie na dzień okno doby k sięga najwyżej
//   do końca dnia k+1, więc w praktyce w grę wchodzi tylko zmiana następnego dnia; zabezpieczenie zostawiamy na wypadek
//   zmian modelu.
// - Ruchomy rozkład: nadgodziny z doby = 0 (art. 140^1 § 4); podajemy, ile byłoby bez niego. Odpoczynek sprawdzamy dalej.
// - Odpoczynek w dobie k: najdłuższa przerwa bez pracy wewnątrz okna doby (części przerw na krawędziach okna też się
//   liczą). Za 7. dniem grafiku nie znamy: gdy przerwa sięga poza znane dni, a mogłaby mieć co najmniej 11 h, stan to
//   „bez-danych” zamiast naruszenia; podajemy jej znaną część. Zmiany czasu (marzec, październik) nie uwzględniamy.
// - Pora nocna: domyślnie 22:00–6:00, początek 21:00–23:00. Nadgodziny z doby to godziny zmian z rozkładu, więc dzień,
//   w którym przypadają, jest dniem pracy według rozkładu: niedziela i święto nie dają same 100% (art. 151^1 § 1 pkt 1
//   lit. b), ale podajemy, ile nadgodzin przypada w niedzielę lub święto (6:00–6:00, art. 151^9 § 2), z uwagą na stronie.
// - Przepis nie rozstrzyga, czy nadgodziny z doby wliczają się też do wymiaru dnia, w którym przypadają; nie liczymy tego.
import { godzinyIMinuty, minuty, minutyNocneZmiany } from './czas-pracy';
import { odmiana } from '../redakcja';
import { rodzajDnia } from './niedziela-swieto';
import { dodajDni, poprawnaData } from './terminy';

export const DOBA_MIN = 24 * 60;
export const NORMA_MIN = 8 * 60;
export const ODPOCZYNEK_MIN = 11 * 60;
export const ROWNOWAZNY_MAKS_MIN = 12 * 60;
export const DNI_TYGODNIA = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'] as const;

export interface Wiersz {
  /** „6:00” albo puste (dzień wolny). */
  od: string;
  do: string;
}

export interface Opcje {
  ruchomy?: boolean;
  /** Początek pory nocnej w minutach od północy (21:00–23:00). */
  poraNocnaOd?: number;
}

export type StanOdpoczynku = 'ok' | 'naruszenie' | 'bez-danych' | 'inne-zasady';

export interface DzienDoby {
  data: string;
  dzienTygodnia: string;
  /** null = dzień wolny */
  od: number | null;
  do: number | null;
  dlugosc: number;
  /** Minuty tej zmiany wewnątrz doby poprzedniego dnia. */
  wPoprzedniejDobie: number;
  /** Z nich nadgodziny z doby (0 przy ruchomym rozkładzie). */
  nadgodziny: number;
  /** Najdłuższy odpoczynek w dobie tego dnia (znana część); null w dniu wolnym. */
  odpoczynek: number | null;
  stan: StanOdpoczynku | null;
}

export interface WynikDoby {
  dni: DzienDoby[];
  /** Suma nadgodzin z doby w minutach. */
  nadgodziny: number;
  nocne: number;
  dzienne: number;
  /** Nadgodziny w niedzielę lub święto (6:00–6:00). */
  wNiedzieleSwieta: number;
  /** Nadgodziny z doby, gdyby rozkład nie był ruchomy. */
  bezRuchomego: number;
  naruszenia: number;
  /** Dni ze zmianą dłuższą niż 8 h i dłuższą niż 12 h (indeksy 0–6). */
  ponad8: number[];
  ponad12: number[];
  ruchomy: boolean;
}

/** „14:00–22:00” w nazwie dnia do komunikatów: „wtorek 17.11”. */
export const etykietaDnia = (data: string) => {
  const [, m, d] = data.split('-').map(Number);
  return `${DNI_TYGODNIA[new Date(`${data}T00:00:00Z`).getUTCDay()]} ${d}.${String(m).padStart(2, '0')}`;
};

/** Długość zmiany: koniec ≤ początek = przez północ, ta sama godzina = 24 h. */
export const dlugoscZmiany = (od: number, do_: number) => (do_ > od ? do_ - od : do_ - od + DOBA_MIN);

/** Błąd danych w konkretnym dniu (indeks 0–6), żeby oznaczyć pola. */
export class BladDnia extends RangeError {
  constructor(
    message: string,
    public dzien: number,
  ) {
    super(message);
  }
}

const przeciecie = (a0: number, a1: number, b0: number, b1: number) => Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));

export function dobaPracownicza(start: string, wiersze: Wiersz[], opcje: Opcje = {}): WynikDoby {
  if (!poprawnaData(start)) throw new RangeError('Wpisz poprawną datę pierwszego dnia.');
  if (wiersze.length !== 7) throw new RangeError('Grafik ma mieć 7 dni.');
  const poraOd = opcje.poraNocnaOd ?? 22 * 60;
  const ruchomy = !!opcje.ruchomy;
  const daty = wiersze.map((_, i) => dodajDni(start, i));

  const zmiany = wiersze.map((w, i) => {
    const od = w.od.trim();
    const do_ = w.do.trim();
    if (!od && !do_) return null;
    if (!od || !do_) throw new BladDnia(`${etykietaDnia(daty[i])}: wpisz obie godziny albo żadnej.`, i);
    const a = minuty(od);
    const b = minuty(do_);
    if (a === null || b === null) throw new BladDnia(`${etykietaDnia(daty[i])}: zły zapis godziny (np. 6:00).`, i);
    const s = i * DOBA_MIN + a;
    return { od: a, do: b, s, e: s + dlugoscZmiany(a, b) };
  });

  let poprzednia: { e: number; i: number } | null = null;
  zmiany.forEach((z, i) => {
    if (!z) return;
    if (poprzednia && z.s < poprzednia.e) throw new BladDnia(`${etykietaDnia(daty[i])}: zmiana zaczyna się, zanim skończy się zmiana z ${etykietaDnia(daty[poprzednia.i])}.`, i);
    poprzednia = { e: z.e, i };
  });
  // Sprawdza też porę nocną (RangeError poza 21:00–23:00).
  minutyNocneZmiany(0, 60, poraOd);

  const koniecDanych = 7 * DOBA_MIN;
  const wPoprzedniej = Array(7).fill(0);
  const nadDnia = Array(7).fill(0);
  /** Przedziały nadgodzin [od, do) w minutach od początku tygodnia. */
  const nad: { a: number; b: number }[] = [];
  /** Do kiedy minuty zmiany j są już policzone jako nadgodziny (każda minuta raz). */
  const policzoneDo = zmiany.map((z) => z?.s ?? 0);
  const odpoczynki: { odp: number | null; stan: StanOdpoczynku | null }[] = [];

  zmiany.forEach((z, k) => {
    if (!z) {
      odpoczynki.push({ odp: null, stan: null });
      return;
    }
    const w0 = z.s;
    const w1 = z.s + DOBA_MIN;
    let zapas = Math.max(NORMA_MIN, z.e - z.s) - (z.e - z.s);
    for (let j = k + 1; j < 7; j++) {
      const y = zmiany[j];
      if (!y) continue;
      const a = Math.max(y.s, w0);
      const b = Math.min(y.e, w1);
      if (b <= a) continue;
      if (j === k + 1) wPoprzedniej[j] += b - a;
      const zuzyte = Math.min(zapas, b - a);
      zapas -= zuzyte;
      const a2 = Math.max(a + zuzyte, policzoneDo[j]);
      if (b > a2) {
        nad.push({ a: a2, b });
        nadDnia[j] += b - a2;
        policzoneDo[j] = b;
      }
    }

    // Odpoczynek: przerwy między pracą wewnątrz okna.
    const praca = zmiany
      .filter((y): y is NonNullable<typeof y> => !!y && przeciecie(y.s, y.e, w0, w1) > 0)
      .map((y) => ({ a: Math.max(y.s, w0), b: Math.min(y.e, w1) }));
    let znana = 0;
    let koncowa = 0;
    let kursor = w0;
    for (const p of [...praca, { a: w1, b: w1 }]) {
      const przerwa = p.a - kursor;
      if (przerwa > 0) {
        if (p.a <= koniecDanych) znana = Math.max(znana, przerwa);
        else {
          znana = Math.max(znana, Math.max(0, koniecDanych - kursor));
          koncowa = przerwa;
        }
      }
      kursor = Math.max(kursor, p.b);
    }
    const stan: StanOdpoczynku =
      z.e - z.s > ROWNOWAZNY_MAKS_MIN ? 'inne-zasady' : znana >= ODPOCZYNEK_MIN ? 'ok' : koncowa >= ODPOCZYNEK_MIN ? 'bez-danych' : 'naruszenie';
    odpoczynki.push({ odp: znana, stan });
  });

  const suma = nad.reduce((s, p) => s + p.b - p.a, 0);
  const nocne = nad.reduce((s, p) => s + minutyNocneZmiany(p.a % DOBA_MIN, p.b % DOBA_MIN, poraOd), 0);
  // Niedziela i święto: od 6:00 danego dnia do 6:00 następnego (art. 151^9 § 2, gdy pracodawca nie ustalił innej godziny). Sprawdzamy dni od dnia przed tygodniem.
  let wNiedzieleSwieta = 0;
  for (let d = -1; d <= 7; d++) {
    if (rodzajDnia(dodajDni(start, d)).rodzaj === 'zwykly') continue;
    const a = d * DOBA_MIN + 6 * 60;
    for (const p of nad) wNiedzieleSwieta += przeciecie(p.a, p.b, a, a + DOBA_MIN);
  }

  const dni: DzienDoby[] = zmiany.map((z, i) => ({
    data: daty[i],
    dzienTygodnia: DNI_TYGODNIA[new Date(`${daty[i]}T00:00:00Z`).getUTCDay()],
    od: z?.od ?? null,
    do: z?.do ?? null,
    dlugosc: z ? z.e - z.s : 0,
    wPoprzedniejDobie: wPoprzedniej[i],
    nadgodziny: ruchomy ? 0 : nadDnia[i],
    odpoczynek: odpoczynki[i].odp,
    stan: odpoczynki[i].stan,
  }));
  const dl = (i: number) => dni[i].dlugosc;
  const indeksy = dni.map((_, i) => i);

  return {
    dni,
    nadgodziny: ruchomy ? 0 : suma,
    nocne: ruchomy ? 0 : nocne,
    dzienne: ruchomy ? 0 : suma - nocne,
    wNiedzieleSwieta: ruchomy ? 0 : wNiedzieleSwieta,
    bezRuchomego: suma,
    naruszenia: dni.filter((d) => d.stan === 'naruszenie').length,
    ponad8: indeksy.filter((i) => dl(i) > NORMA_MIN),
    ponad12: indeksy.filter((i) => dl(i) > ROWNOWAZNY_MAKS_MIN),
    ruchomy,
  };
}

/** Minuty od północy → „6:00”. */
export const zapisGodziny = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

const KROTKO = ['nd', 'pn', 'wt', 'śr', 'czw', 'pt', 'sob'];
/** „pn 16.11” do tabeli. */
export const etykietaKrotka = (data: string) => {
  const [, m, d] = data.split('-').map(Number);
  return `${KROTKO[new Date(`${data}T00:00:00Z`).getUTCDay()]} ${d}.${String(m).padStart(2, '0')}`;
};
/** Minuty → „8 h”, „5 h 1 min”. */
export const czas = (min: number) => godzinyIMinuty(min / 60);

export interface WierszTabeli {
  dzien: string;
  praca: string;
  wPoprzedniej: string;
  nadgodziny: string;
  odpoczynek: string;
  stan: StanOdpoczynku | 'wolne';
}

export interface Opis {
  glowna: string;
  dodatki: string;
  odpoczynek: string;
  wiersze: WierszTabeli[];
  uwagi: string[];
}

const lista = (r: WynikDoby, i: number[]) => i.map((x) => etykietaDnia(r.dni[x].data)).join(', ');

/** Teksty wyniku (wspólne dla serwera i przeglądarki). */
export function opisWyniku(r: WynikDoby): Opis {
  const wiersze: WierszTabeli[] = r.dni.map((d) => {
    if (d.od === null || d.do === null) return { dzien: etykietaKrotka(d.data), praca: 'wolne', wPoprzedniej: '', nadgodziny: '—', odpoczynek: '—', stan: 'wolne' };
    const odp = d.odpoczynek ?? 0;
    return {
      dzien: etykietaKrotka(d.data),
      praca: `${zapisGodziny(d.od)}–${zapisGodziny(d.do)}`,
      wPoprzedniej: d.wPoprzedniejDobie ? `w poprzedniej dobie ${czas(d.wPoprzedniejDobie)}` : '',
      nadgodziny: d.nadgodziny ? czas(d.nadgodziny) : '—',
      odpoczynek:
        d.stan === 'ok'
          ? czas(odp)
          : d.stan === 'naruszenie'
            ? `${czas(odp)}, za krótki`
            : d.stan === 'inne-zasady'
              ? 'Praca dłuższa niż 12 h: w systemach z art. 136–137 odpoczynek po zmianie co najmniej tak długi jak przepracowany czas (art. 136 § 2)'
              : odp
                ? `co najmniej ${czas(odp)}, bez danych o następnym dniu`
                : 'bez danych o następnym dniu',
      stan: d.stan ?? 'ok',
    };
  });
  const naruszone = r.dni.map((d, i) => (d.stan === 'naruszenie' ? i : -1)).filter((i) => i >= 0);
  const uwagi: string[] = [];
  if (naruszone.length)
    uwagi.push(
      `Odpoczynek krótszy niż 11 h: ${lista(r, naruszone)}. W każdej dobie przysługuje co najmniej 11 godzin nieprzerwanego odpoczynku (art. 132 § 1 Kodeksu pracy)${r.ruchomy ? '; ruchomy rozkład tego nie zmienia (art. 140¹ § 3)' : ''}.`,
    );
  if (r.ruchomy && r.bezRuchomego)
    uwagi.push(`W ruchomym rozkładzie ponowna praca w tej samej dobie nie jest nadgodzinami (art. 140¹ § 4). Bez ruchomego rozkładu wyszłoby ${czas(r.bezRuchomego)}.`);
  if (r.ponad8.length)
    uwagi.push(
      `Zmiana dłuższa niż 8 h: ${lista(r, r.ponad8)}. Liczymy ją jako przedłużony dobowy wymiar z systemu równoważnego (art. 135 § 1). W systemie podstawowym godziny ponad 8 na takiej zmianie też są nadgodzinami (art. 129 § 1 i art. 151 § 1); tych tu nie liczymy.`,
    );
  if (r.ponad12.length)
    uwagi.push(
      `Zmiana dłuższa niż 12 h: ${lista(r, r.ponad12)}. W systemie równoważnym dobowy wymiar można przedłużyć najwyżej do 12 h (art. 135 § 1); do 16 h i 24 h tylko przy pracach z art. 136 i 137.`,
    );
  if (r.wNiedzieleSwieta)
    uwagi.push(
      `${czas(r.wNiedzieleSwieta)} nadgodzin przypada w niedzielę lub święto (od 6:00 do 6:00, chyba że pracodawca ustalił inną godzinę, art. 151⁹ § 2). W Twoim grafiku to dzień pracy, więc dodatek wynosi 50% (w porze nocnej 100%). 100% przysługuje, gdy niedziela lub święto nie jest dniem pracy według rozkładu (art. 151¹ § 1 pkt 1 lit. b).`,
    );
  if (r.dni[6].od !== null) uwagi.push(`Doby ostatniego dnia (${etykietaDnia(r.dni[6].data)}) nie sprawdzimy do końca: nie znamy grafiku na następny dzień.`);

  const zDoby = r.dni.map((d, i) => (d.nadgodziny ? i : -1)).filter((i) => i >= 0);
  return {
    glowna: czas(r.nadgodziny),
    dodatki: r.nadgodziny
      ? `W porze nocnej ${czas(r.nocne)} (dodatek 100%), w pozostałych godzinach ${czas(r.dzienne)} (dodatek 50%). Dni: ${lista(r, zDoby)}.`
      : r.ruchomy && r.bezRuchomego
        ? 'Ruchomy rozkład: praca w tej samej dobie nie daje nadgodzin.'
        : 'Żadna zmiana nie wchodzi w dobę poprzedniego dnia ponad jej normę.',
    odpoczynek: r.dni.every((d) => d.od === null)
      ? 'brak zmian do sprawdzenia'
      : naruszone.length
        ? `za krótki w ${odmiana(naruszone.length, ['dobie', 'dobach', 'dobach'])}`
        : 'co najmniej 11 h w każdej sprawdzonej dobie',
    wiersze,
    uwagi,
  };
}
