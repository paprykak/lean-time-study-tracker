// Urlop wypoczynkowy: wymiar 20 albo 26 dni (art. 154 § 1 Kp), staż ze szkołą (art. 155 § 1, bez sumowania),
// niepełny etat proporcjonalnie z zaokrągleniem w górę (art. 154 § 2), urlop proporcjonalny przy zmianie pracodawcy
// (art. 155^1, 155^2a, 155^3), pierwsza praca: 1/12 po każdym miesiącu (art. 153 § 1), dzień urlopu = 8 godzin
// (art. 154^2 § 2). Okresy z art. 302^1 (zlecenia, działalność) wlicza się do stażu od 2026 r.

// Krótkie nazwy do listy wyboru (telefon ucina długie; pełne nazwy w tabeli kalkulatora urlopu): „Zasadnicza” to zasadnicza
// (branżowa) szkoła zawodowa, „Technikum” każda średnia szkoła zawodowa o danym czasie nauki, „Po zasadniczej” średnia
// szkoła zawodowa dla absolwentów zasadniczych. Liczba lat w nawiasie to lata wliczane do stażu (art. 155 § 1).
export const SZKOLY = {
  brak: { nazwa: 'Brak lub nieukończona', lata: 0 },
  zasadnicza: { nazwa: 'Zasadnicza', lata: 3 },
  'technikum-4': { nazwa: 'Technikum 4-letnie', lata: 4 },
  'technikum-5': { nazwa: 'Technikum 5-letnie', lata: 5 },
  'srednia-po-zasadniczej': { nazwa: 'Po zasadniczej', lata: 5 },
  liceum: { nazwa: 'Liceum', lata: 4 },
  policealna: { nazwa: 'Policealna', lata: 6 },
  wyzsza: { nazwa: 'Wyższa', lata: 8 },
} as const;

export type Szkola = keyof typeof SZKOLY;

/** Etat jako ułamek, np. 1/2 → [1, 2]. */
export type Etat = readonly [number, number];

export interface DaneUrlopu {
  /** Staż pracy w miesiącach (umowy o pracę i okresy z art. 302^1). */
  stazMiesiecy: number;
  szkola: Szkola;
  etat: Etat;
  /** Sytuacja w roku: cały rok, pierwsza praca w życiu albo zatrudnienie przez część roku (zmiana pracodawcy). */
  sytuacja: 'caly-rok' | 'pierwsza-praca' | 'czesc-roku';
  /** Miesiące pracy u tego pracodawcy w roku (część roku, pierwsza praca); niepełny miesiąc liczy się jak pełny. */
  miesiaceWRoku?: number;
}

export interface WynikUrlopu {
  /** Staż do urlopu w miesiącach (praca + szkoła). */
  stazDoUrlopu: number;
  /** 20 albo 26 dni. */
  wymiarPodstawowy: 20 | 26;
  /** Wymiar roczny na tym etacie (dni). */
  wymiarRoczny: number;
  /** Urlop w tym roku (dni); przy pierwszej pracy może być ułamkowy. */
  dni: number;
  godziny: number;
  /** Miesiące do 10 lat stażu (0 = już jest 26 dni). */
  doDziesieciuLat: number;
  /** Przy pierwszej pracy: dni nabywane po każdym miesiącu. */
  zaMiesiac: number | null;
}

const MIESIACE_10_LAT = 120;

export function urlop(d: DaneUrlopu): WynikUrlopu {
  const [l, m] = d.etat;
  if (!(l > 0 && m > 0 && l <= m)) throw new RangeError('Etat od 0 do 1');
  if (!(d.stazMiesiecy >= 0)) throw new RangeError('Staż nie może być ujemny');
  // Szkoła liczy się zamiast okresu pracy, w którym była nauka, gdy to korzystniejsze (art. 155 § 2); bez danych
  // o nakładaniu się okresów dodajemy szkołę do stażu, jak w typowym przypadku nauki przed pracą.
  const stazDoUrlopu = d.stazMiesiecy + SZKOLY[d.szkola].lata * 12;
  const wymiarPodstawowy = stazDoUrlopu >= MIESIACE_10_LAT ? 26 : 20;
  const wymiarRoczny = Math.min(wymiarPodstawowy, Math.ceil((wymiarPodstawowy * l) / m));
  let dni = wymiarRoczny;
  let zaMiesiac: number | null = null;
  if (d.sytuacja === 'czesc-roku') {
    const mies = Math.min(12, Math.max(1, Math.ceil(d.miesiaceWRoku ?? 12)));
    dni = Math.min(wymiarRoczny, Math.ceil((wymiarRoczny * mies) / 12));
  } else if (d.sytuacja === 'pierwsza-praca') {
    const mies = Math.min(12, Math.max(0, Math.floor(d.miesiaceWRoku ?? 0)));
    zaMiesiac = wymiarRoczny / 12;
    dni = (wymiarRoczny * mies) / 12;
  }
  return {
    stazDoUrlopu,
    wymiarPodstawowy,
    wymiarRoczny,
    dni,
    godziny: dni * 8,
    doDziesieciuLat: Math.max(0, MIESIACE_10_LAT - stazDoUrlopu),
    zaMiesiac,
  };
}
