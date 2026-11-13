// Urlop szkoleniowy i zwolnienia na naukę (Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245, dział III rozdział III):
// - podnoszenie kwalifikacji to nauka z inicjatywy pracodawcy albo za jego zgodą (art. 103^1 § 1); przysługuje wtedy
//   urlop szkoleniowy i zwolnienie z całości lub części dnia pracy na dojazd na obowiązkowe zajęcia i ich czas
//   (§ 2 pkt 1–2), oba z zachowaniem prawa do wynagrodzenia (§ 3);
// - wymiar urlopu szkoleniowego (art. 103^2 § 1): 6 dni dla pracownika przystępującego do egzaminów eksternistycznych
//   (pkt 1), 6 dni do egzaminu maturalnego (pkt 2), 6 dni do egzaminu potwierdzającego kwalifikacje w zawodzie lub
//   egzaminu zawodowego (pkt 3), 21 dni w ostatnim roku studiów na pracę i egzamin dyplomowy (pkt 4);
// - urlopu udziela się w dni, które są dla pracownika dniami pracy według jego rozkładu czasu pracy (art. 103^2 § 2);
// - pracodawca może przyznać dodatkowe świadczenia (art. 103^3), umowa na piśmie, nie mniej korzystna niż przepisy,
//   nieobowiązkowa bez zobowiązania do pozostania w pracy (art. 103^4 § 1–3);
// - nauka na innych zasadach: zwolnienie bez wynagrodzenia i urlop bezpłatny w wymiarze z porozumienia (art. 103^6).
// Interpretacje (przepis ich wprost nie rozstrzyga):
// 1. Każdy punkt art. 103^2 § 1 to osobne uprawnienie „dla pracownika przystępującego do…”, więc przy dwóch różnych
//    egzaminach dni dodajemy; przepis nie mówi o sumowaniu wprost. Przepis nie rozstrzyga też, czy każde kolejne
//    przystąpienie do egzaminu tego samego rodzaju daje nowe 6 dni: liczymy 6 dni do każdego wpisanego egzaminu
//    (wariant korzystny dla pracownika). Ostatni rok studiów (pkt 4) liczy się raz.
// 2. Dzień urlopu szkoleniowego to cały dzień pracy z grafiku: art. 103^2 § 2 nie przelicza dni na 8 godzin, tak jak
//    robi to art. 154^2 § 2 dla urlopu wypoczynkowego. Godziny = dni × długość zmiany, liczone w minutach
//    (zmiana zaokrąglona do pełnej minuty); to odczytanie brzmienia.
// 3. Narzędzie nie ustala, kiedy urlop wziąć (przepis o tym milczy).
export type Egzamin = 'eksternistyczny' | 'maturalny' | 'zawodowy' | 'studia';

export const WYMIAR: Record<Egzamin, number> = { eksternistyczny: 6, maturalny: 6, zawodowy: 6, studia: 21 };
export const EGZAMINY = Object.keys(WYMIAR) as Egzamin[];
export const MAKS_ZMIANA = 24;
/** Najwięcej egzaminów jednego rodzaju w formularzu. */
export const MAKS_EGZAMINOW = 5;

export interface DaneNauki {
  /** Nauka z inicjatywy pracodawcy albo za jego zgodą (art. 103^1 § 1). */
  zaZgoda: boolean;
  /** Liczba egzaminów danego rodzaju (pkt 1–3: 0–5); ostatni rok studiów 0 albo 1. Brak klucza = 0. */
  egzaminy: Partial<Record<Egzamin, number>>;
  /** Długość zmiany w godzinach, więcej niż 0 i najwyżej 24. Przy nauce bez zgody nie ma znaczenia. */
  zmiana: number;
}

export interface WynikNauki {
  /** Urlop szkoleniowy i płatne zwolnienie na obowiązkowe zajęcia (art. 103^1 § 2); przy „nie” zostaje art. 103^6. */
  podstawa: 'art. 103^1' | 'art. 103^6';
  dni: number;
  /** Dni × zmiana, w pełnych minutach. */
  minuty: number;
  godziny: number;
  pozycje: { egzamin: Egzamin; liczba: number; dni: number }[];
}

export function urlopSzkoleniowy({ zaZgoda, egzaminy, zmiana }: DaneNauki): WynikNauki {
  for (const [e, n] of Object.entries(egzaminy)) {
    if (!Object.hasOwn(WYMIAR, e)) throw new RangeError(`Nieznany egzamin: ${e}`);
    const maks = e === 'studia' ? 1 : MAKS_EGZAMINOW;
    if (!Number.isInteger(n) || (n as number) < 0 || (n as number) > maks) throw new RangeError(`Liczba egzaminów poza zakresem: ${e}`);
  }
  if (!zaZgoda) return { podstawa: 'art. 103^6', dni: 0, minuty: 0, godziny: 0, pozycje: [] };
  if (!Number.isFinite(zmiana) || zmiana <= 0 || zmiana > MAKS_ZMIANA) throw new RangeError('Długość zmiany poza zakresem');
  const pozycje = EGZAMINY.filter((e) => (egzaminy[e] ?? 0) > 0).map((egzamin) => {
    const liczba = egzaminy[egzamin]!;
    return { egzamin, liczba, dni: WYMIAR[egzamin] * liczba };
  });
  const dni = pozycje.reduce((s, p) => s + p.dni, 0);
  const minuty = dni * Math.round(zmiana * 60);
  return { podstawa: 'art. 103^1', dni, minuty, godziny: minuty / 60, pozycje };
}

/** Krótkie nazwy pozycji art. 103^2 § 1 do wyniku. */
export const NAZWA: Record<Egzamin, string> = {
  eksternistyczny: 'egzaminy eksternistyczne',
  maturalny: 'matura',
  zawodowy: 'egzamin zawodowy',
  studia: 'ostatni rok studiów',
};
