// Dorabianie do emerytury i renty (ustawa o emeryturach i rentach z FUS, tekst jednolity Dz.U. 2025 poz. 1749; zmiany
// Dz.U. 2026 poz. 26 i 425 nie dotyczą art. 103–106):
// - limity nie dotyczą emerytów w powszechnym wieku emerytalnym 60/65 lat (art. 103 ust. 2), ale emerytura jest zawieszona
//   przy pracy kontynuowanej bez rozwiązania umowy z tym samym pracodawcą (art. 103a);
// - przychód powyżej 70% przeciętnego wynagrodzenia za ostatni ogłoszony kwartał, ale nie wyższy niż 130%: świadczenie
//   zmniejsza się o kwotę przekroczenia, najwyżej o kwotę maksymalnego zmniejszenia (art. 104 ust. 8–9);
// - przychód powyżej 130%: prawo do emerytury, renty z tytułu niezdolności i renty rodzinnej jednej osoby jest zawieszone
//   (art. 104 ust. 7); do przychodu wlicza się też m.in. zasiłki i wynagrodzenie za L4 (ust. 6);
// - kwoty przychodu ogłasza Prezes ZUS co kwartał (ust. 10 pkt 1), kwoty maksymalnych zmniejszeń od 1 marca (waloryzacja).
// Nie liczymy renty rodzinnej dla kilku osób (art. 105), świadczeń wypłacanych w części (art. 104 ust. 8a–8b) ani emerytur
// pomostowych (osobna ustawa).

export type Swiadczenie = 'emerytura' | 'renta-calkowita' | 'renta-czesciowa' | 'renta-rodzinna';

/** Kwoty przychodu odpowiadające 70% i 130% przeciętnego wynagrodzenia (komunikaty Prezesa ZUS). */
export const PROGI_PRZYCHODU = [
  { od: '2025-12-01', p70: 6140.2, p130: 11403.3, publikator: 'M.P. 2025 poz. 1196' },
  { od: '2026-03-01', p70: 6438.5, p130: 11957.2, publikator: 'M.P. 2026 poz. 209' },
  { od: '2026-06-01', p70: 6694.1, p130: 12431.8, publikator: 'M.P. 2026 poz. 499' },
  { od: '2026-09-01', p70: 6463.2, p130: 12003.1, publikator: 'M.P. 2026 poz. 839' },
] as const;

/** Kwoty maksymalnych zmniejszeń (komunikaty Prezesa ZUS o kwotach od 1 marca). */
export const MAKS_ZMNIEJSZENIA = [
  { od: '2025-03-01', calkowita: 939.61, czesciowa: 704.75, rodzinna: 798.72, publikator: 'M.P. 2025 poz. 152' },
  { od: '2026-03-01', calkowita: 989.41, czesciowa: 742.1, rodzinna: 841.05, publikator: 'M.P. 2026 poz. 220' },
] as const;

const naDzien = <T extends { od: string }>(lista: readonly T[], data: string): T | null => {
  const pasujace = lista.filter((x) => x.od <= data);
  return pasujace.length ? pasujace[pasujace.length - 1] : null;
};

export function progiNaDzien(data: string) {
  const p = naDzien(PROGI_PRZYCHODU, data);
  if (!p) return null;
  const ostatni = PROGI_PRZYCHODU[PROGI_PRZYCHODU.length - 1];
  // ZUS ogłasza kwoty co kwartał; 3 miesiące po ostatnich zwykle obowiązują już nowe, których jeszcze nie wpisaliśmy.
  const [r, m] = ostatni.od.split('-').map(Number);
  const nastepne = `${m + 3 > 12 ? r + 1 : r}-${String(((m + 2) % 12) + 1).padStart(2, '0')}-01`;
  return { ...p, mozeNieaktualne: p === ostatni && data >= nastepne };
}

const MIESIACE = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];

/** Okresy kwot przychodu do listy wyboru, od najnowszego: „wrzesień–listopad 2026”, „grudzień 2025–luty 2026”. */
export function okresyProgow() {
  return PROGI_PRZYCHODU.map((p) => {
    const [r, m] = p.od.split('-').map(Number);
    const mk = ((m + 1) % 12) + 1;
    const rk = m + 2 > 12 ? r + 1 : r;
    const nazwa = r === rk ? `${MIESIACE[m - 1]}–${MIESIACE[mk - 1]} ${r}` : `${MIESIACE[m - 1]} ${r}–${MIESIACE[mk - 1]} ${rk}`;
    return { od: p.od, nazwa };
  }).reverse();
}

/** Okres, w którym wypada dany dzień; przed pierwszym wpisanym okresem: najstarszy. */
export function okresNaDzien(data: string) {
  const p = naDzien(PROGI_PRZYCHODU, data);
  return p ? p.od : PROGI_PRZYCHODU[0].od;
}

export function maksZmniejszenie(swiadczenie: Swiadczenie, data: string) {
  const m = naDzien(MAKS_ZMNIEJSZENIA, data);
  if (!m) return null;
  const kwota = swiadczenie === 'renta-czesciowa' ? m.czesciowa : swiadczenie === 'renta-rodzinna' ? m.rodzinna : m.calkowita;
  return { kwota, publikator: m.publikator };
}

export interface DaneDorabiania {
  swiadczenie: Swiadczenie;
  /** Przychód brutto w miesiącu (zł). */
  przychod: number;
  /** Miesiąc rozliczenia: dowolny dzień tego miesiąca. */
  data: string;
  /** Emerytura w powszechnym wieku emerytalnym 60/65 lat. */
  wiekEmerytalny?: boolean;
}

export type StanDorabiania = 'bez-limitu' | 'bez-zmian' | 'zmniejszenie' | 'zawieszenie' | 'brak-danych';

export function dorabianie(d: DaneDorabiania) {
  if (!(d.przychod >= 0)) throw new RangeError('Przychód nie może być ujemny');
  if (d.swiadczenie === 'emerytura' && d.wiekEmerytalny) return { stan: 'bez-limitu' as StanDorabiania, progi: null, zmniejszenie: 0, maks: null, zapas: null };
  const progi = progiNaDzien(d.data);
  const maks = maksZmniejszenie(d.swiadczenie, d.data);
  if (!progi || !maks) return { stan: 'brak-danych' as StanDorabiania, progi, zmniejszenie: 0, maks, zapas: null };
  const gr = (x: number) => Math.round(x * 100);
  const przychod = gr(d.przychod);
  if (przychod <= gr(progi.p70)) return { stan: 'bez-zmian' as StanDorabiania, progi, zmniejszenie: 0, maks, zapas: (gr(progi.p70) - przychod) / 100 };
  if (przychod <= gr(progi.p130)) {
    const zmniejszenie = Math.min(przychod - gr(progi.p70), gr(maks.kwota)) / 100;
    return { stan: 'zmniejszenie' as StanDorabiania, progi, zmniejszenie, maks, zapas: 0 };
  }
  return { stan: 'zawieszenie' as StanDorabiania, progi, zmniejszenie: 0, maks, zapas: 0 };
}
