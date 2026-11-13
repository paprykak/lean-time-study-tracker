// Świadczenie urlopowe u pracodawcy, który nie tworzy zakładowego funduszu świadczeń socjalnych (ustawa o ZFŚS,
// t.j. Dz.U. 2024 poz. 288; zmiany Dz.U. 2026 poz. 25 i 1123 nie dotyczą art. 3 i 5):
// - pracodawca z co najmniej 50 pracownikami w przeliczeniu na pełne etaty (stan na 1 stycznia) tworzy fundusz (art. 3
//   ust. 1), od 20 do 49 etatów na wniosek związku zawodowego (ust. 1c); poniżej 50 etatów może tworzyć fundusz, wypłacać
//   świadczenie urlopowe albo nie robić nic, o czym informuje w pierwszym miesiącu roku (ust. 3, 3a, 3b);
// - świadczenie nie może przekroczyć odpisu podstawowego z art. 5 ust. 2, 2a i 3, dla zatrudnionych z ust. 2 i 3
//   proporcjonalnie do wymiaru czasu pracy (art. 3 ust. 4); młodociani (ust. 2a) bez proporcji, a zwiększenia z ust. 4–5a
//   (np. 6,25% na osobę z niepełnosprawnością) nie podnoszą limitu, bo art. 3 ust. 4 do nich nie odsyła;
// - odpis: 37,5% przeciętnego wynagrodzenia miesięcznego w gospodarce narodowej w roku poprzednim albo w drugim półroczu
//   roku poprzedniego, jeżeli było wyższe (art. 5 ust. 2), 50% przy pracach w szczególnych warunkach lub o szczególnym
//   charakterze (ust. 3), młodociani 5, 6 i 7% w 1., 2. i 3. roku nauki (ust. 2a). Kwoty ogłasza Prezes GUS do 20 lutego
//   (ust. 7). Ustawy okołobudżetowe na 2024–2026 r. nie zmieniają podstawy (ostatnie zamrożenie: art. 5l, rok 2023);
// - wypłata raz w roku każdemu pracownikowi, który w roku kalendarzowym korzysta z urlopu wypoczynkowego co najmniej
//   14 kolejnych dni kalendarzowych (art. 3 ust. 5), najpóźniej w ostatnim dniu przed tym urlopem (ust. 5a);
// - bez składek na ubezpieczenia społeczne (art. 3 ust. 6; § 2 ust. 1 pkt 21 rozporządzenia składkowego, t.j. Dz.U. 2025
//   poz. 316: do wysokości odpisu) i bez zdrowotnej (art. 81 ust. 1 ustawy o świadczeniach opieki zdrowotnej odsyła do
//   podstawy emerytalnej); podatek jak od pensji (art. 12 ust. 1 ustawy o PIT; zwolnienie z art. 21 ust. 1 pkt 67 dotyczy
//   tylko świadczeń z funduszu), do 26 lat zwolnienie z art. 21 ust. 1 pkt 148.
// Interpretacje: (1) obwieszczenie GUS podaje kwotę „pomniejszoną o składki”, ustawa tego nie definiuje; bierzemy kwotę
// z obwieszczenia, bo to jedyny akt wydany na podstawie art. 5 ust. 7; (2) „nie może przekroczyć”, więc maksimum
// zaokrąglamy w dół do grosza (2026: 2943,225 zł → 2943,22 zł); (3) zaliczka PIT: świadczenie wypłacane z pensją, więc
// koszty uzyskania i kwotę zmniejszającą wykorzystała pensja; zaliczka = 12% albo 32% kwoty, do pełnych złotych (art. 63
// § 1 Ordynacji podatkowej); wynik „około”; (4) urlop przez przełom roku przypisujemy do roku jego pierwszego dnia
// (świadczenie wypłaca się przed rozpoczęciem urlopu); przepis tego nie rozstrzyga.
import { dniMiedzy, dodajDni } from './terminy';

export interface PodstawaOdpisu {
  /** Przeciętne wynagrodzenie miesięczne w roku poprzednim, zł. */
  zaRok: number;
  /** Przeciętne wynagrodzenie miesięczne w drugim półroczu roku poprzedniego, zł. */
  zaPolrocze: number;
  /** Obwieszczenie Prezesa GUS. */
  publikator: string;
}

/** Kwoty z obwieszczeń Prezesa GUS (art. 5 ust. 7). Co roku do 20 lutego dopisać nowy rok. */
export const PODSTAWA_ODPISU: Record<number, PodstawaOdpisu> = {
  2025: { zaRok: 7140.52, zaPolrocze: 7262.39, publikator: 'M.P. 2025 poz. 148' },
  2026: { zaRok: 7770.04, zaPolrocze: 7848.6, publikator: 'M.P. 2026 poz. 232' },
};

export const LATA_ODPISU = Object.keys(PODSTAWA_ODPISU).map(Number).sort((a, b) => a - b);

/** Podstawa odpisu: wyższa z dwóch kwot (art. 5 ust. 2). */
export function podstawaOdpisu(rok: number): number {
  const p = PODSTAWA_ODPISU[rok];
  if (!p) throw new RangeError(`Brak kwoty odpisu na ${rok} r.`);
  return Math.max(p.zaRok, p.zaPolrocze);
}

export type RodzajZatrudnienia = 'zwykle' | 'szczegolne' | 'mlodociany1' | 'mlodociany2' | 'mlodociany3';

/** Procent podstawy w promilach (37,5% = 375) i czy liczy się proporcja do etatu (art. 3 ust. 4). */
export const RODZAJE: Record<RodzajZatrudnienia, { promile: number; proporcja: boolean; nazwa: string }> = {
  zwykle: { promile: 375, proporcja: true, nazwa: 'Zwykłe warunki (37,5%)' },
  szczegolne: { promile: 500, proporcja: true, nazwa: 'Szczególne warunki (50%)' },
  mlodociany1: { promile: 50, proporcja: false, nazwa: 'Młodociany, 1. rok (5%)' },
  mlodociany2: { promile: 60, proporcja: false, nazwa: 'Młodociany, 2. rok (6%)' },
  mlodociany3: { promile: 70, proporcja: false, nazwa: 'Młodociany, 3. rok (7%)' },
};

/** Wymiar etatu jako ułamek (licznik/mianownik), żeby liczyć bez błędów zaokrągleń. */
export interface Etat {
  licznik: number;
  mianownik: number;
}

export function etat(tekst: string): Etat {
  const m = /^(\d+)(?:\/(\d+))?$/.exec(tekst.trim());
  const e = m ? { licznik: Number(m[1]), mianownik: Number(m[2] ?? 1) } : null;
  if (!e || e.mianownik === 0 || e.licznik === 0 || e.licznik > e.mianownik) throw new RangeError('Etat od 0 do 1');
  return e;
}

export function maksimum(rok: number, rodzaj: RodzajZatrudnienia, wymiar: Etat = { licznik: 1, mianownik: 1 }) {
  const r = RODZAJE[rodzaj];
  if (!r) throw new RangeError('Nieznany rodzaj zatrudnienia');
  const groszePodstawy = Math.round(podstawaOdpisu(rok) * 100);
  const e = r.proporcja ? wymiar : { licznik: 1, mianownik: 1 };
  const licznik = groszePodstawy * r.promile * e.licznik;
  const mianownik = 1000 * e.mianownik;
  return {
    podstawa: groszePodstawy / 100,
    /** Wartość dokładna (może mieć więcej niż 2 miejsca po przecinku). */
    dokladnie: licznik / mianownik / 100,
    /** Najwyższa kwota w groszach, która nie przekracza odpisu. */
    kwota: Math.floor(licznik / mianownik) / 100,
    proporcja: r.proporcja,
  };
}

/** Warunek 14 kolejnych dni kalendarzowych urlopu (art. 3 ust. 5) i termin wypłaty (ust. 5a). */
export function urlop(od: string, do_: string) {
  if (do_ < od) throw new RangeError('Koniec urlopu przed początkiem');
  const dni = dniMiedzy(od, do_) + 1;
  return { dni, spelnia: dni >= 14, terminWyplaty: dodajDni(od, -1), rok: Number(od.slice(0, 4)) };
}

export type StawkaPit = 12 | 32 | 0;

/** Kwota na rękę: bez składek ZUS i zdrowotnej, minus zaliczka PIT zaokrąglona do pełnych złotych. */
export function naReke(kwota: number, stawka: StawkaPit) {
  if (!(kwota > 0)) throw new RangeError('Kwota musi być dodatnia');
  const zaliczka = Math.round(Number(((kwota * stawka) / 100).toPrecision(12)));
  return { zaliczka, netto: Math.round((kwota - zaliczka) * 100) / 100 };
}

const DOKLADNIE = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
/** Wartość dokładna limitu, bez zaokrąglania do grosza: „2943,225 zł”. */
export const zlDokladnie = (x: number) => `${DOKLADNIE.format(x)} zł`;
