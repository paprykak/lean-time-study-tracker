// Lojalka: zwrot kosztów podnoszenia kwalifikacji (Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245):
// - zwrot obejmuje koszty dodatkowych świadczeń z art. 103^3 (opłaty za naukę, przejazd, podręczniki, zakwaterowanie),
//   a nie wynagrodzenie za urlop szkoleniowy i zwolnienia z pracy (art. 103^1 § 3);
// - zwrot należy się przy: rezygnacji z nauki bez uzasadnionej przyczyny (art. 103^5 pkt 1), dyscyplinarce (pkt 2),
//   wypowiedzeniu przez pracownika poza mobbingiem z art. 94^3 (pkt 3) i rozwiązaniu bez wypowiedzenia z art. 55 albo
//   94^3 mimo braku przyczyn (pkt 4), w okresie z umowy po ukończeniu nauki, najwyżej 3 lata (pkt 2);
// - wysokość proporcjonalna do okresu zatrudnienia po ukończeniu nauki: koszt razy część okresu, której nie
//   przepracowano. Przepis nie mówi, czy liczyć w dniach, czy w miesiącach; liczymy w dniach kalendarzowych.
import { dniMiedzy, dodajMiesiace } from './terminy';

export const MAKS_MIESIECY = 36;

export type Rozwiazanie =
  | 'wypowiedzenie-pracownika'
  | 'dyscyplinarka'
  | 'art55-bez-podstaw'
  | 'wypowiedzenie-pracodawcy'
  | 'porozumienie'
  | 'koniec-umowy'
  | 'mobbing';

/** Czy dany sposób rozwiązania umowy daje obowiązek zwrotu (art. 103^5 pkt 2–4). */
export const ZWROT: Record<Rozwiazanie, { zwrot: boolean; podstawa: string }> = {
  'wypowiedzenie-pracownika': { zwrot: true, podstawa: 'art. 103⁵ pkt 3' },
  dyscyplinarka: { zwrot: true, podstawa: 'art. 103⁵ pkt 2' },
  'art55-bez-podstaw': { zwrot: true, podstawa: 'art. 103⁵ pkt 4' },
  'wypowiedzenie-pracodawcy': { zwrot: false, podstawa: 'art. 103⁵' },
  porozumienie: { zwrot: false, podstawa: 'art. 103⁵' },
  'koniec-umowy': { zwrot: false, podstawa: 'art. 103⁵' },
  mobbing: { zwrot: false, podstawa: 'art. 103⁵ pkt 3' },
};

export interface DaneLojalki {
  /** Koszty dodatkowych świadczeń (zł). */
  koszt: number;
  /** Dzień ukończenia nauki albo szkolenia. */
  ukonczenie: string;
  /** Okres zobowiązania do pracy po ukończeniu, w miesiącach (1–36). */
  miesiecy: number;
  /** Ostatni dzień pracy. */
  koniecPracy: string;
  rozwiazanie: Rozwiazanie;
}

export function lojalka(d: DaneLojalki) {
  if (!(d.koszt >= 0)) throw new RangeError('Koszt nie może być ujemny');
  if (!Number.isInteger(d.miesiecy) || d.miesiecy < 1 || d.miesiecy > MAKS_MIESIECY) throw new RangeError('Okres zobowiązania: 1–36 miesięcy');
  // Okres zobowiązania zaczyna się dzień po ukończeniu nauki i kończy z upływem dnia o tej samej dacie (art. 111 § 2 i 112 KC).
  const koniecZobowiazania = dodajMiesiace(d.ukonczenie, d.miesiecy);
  const okres = dniMiedzy(d.ukonczenie, koniecZobowiazania);
  const { zwrot, podstawa } = ZWROT[d.rozwiazanie];
  if (d.koniecPracy <= d.ukonczenie) return { stan: 'w-trakcie' as const, koniecZobowiazania, okres, przepracowane: 0, kwota: null, podstawa: 'art. 103⁵' };
  const przepracowane = Math.min(okres, dniMiedzy(d.ukonczenie, d.koniecPracy));
  if (przepracowane >= okres) return { stan: 'po-okresie' as const, koniecZobowiazania, okres, przepracowane, kwota: 0, podstawa };
  if (!zwrot) return { stan: 'bez-zwrotu' as const, koniecZobowiazania, okres, przepracowane, kwota: 0, podstawa };
  const grosze = Math.round(d.koszt * 100);
  return { stan: 'zwrot' as const, koniecZobowiazania, okres, przepracowane, kwota: Math.round((grosze * (okres - przepracowane)) / okres) / 100, podstawa };
}
