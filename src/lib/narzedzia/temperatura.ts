// Temperatura w pracy: co musi zrobić pracodawca przy danej temperaturze.
// Minimum w pomieszczeniach: § 30 rozporządzenia w sprawie ogólnych przepisów BHP (t.j. Dz.U. 2003 poz. 1650).
// Maksimum i obowiązki przy upale: § 30a tego rozporządzenia (Dz.U. 2026 poz. 927), w mocy od 11 stycznia 2027 r.;
// ust. 1 nie dotyczy prac z art. 151^10 pkt 1, 2, 5–8 i 9 lit. c–h Kp (np. ruch ciągły, transport) i kilku służb.
// Napoje: § 4 ust. 1 rozporządzenia RM w sprawie profilaktycznych posiłków i napojów (Dz.U. 1996 poz. 279).

export type Miejsce = 'pomieszczenie' | 'otwarta';
/** biuro-lekka: biuro albo lekka praca fizyczna; zwykla: inna praca; duzy: wydatek ponad 1500 kcal (mężczyźni) / 1000 kcal (kobiety) na zmianę. */
export type Wysilek = 'biuro-lekka' | 'zwykla' | 'duzy';

/** Dzień wejścia w życie § 30a (rozporządzenie z 9 lipca 2026 r., ogłoszone 10 lipca, „po upływie 6 miesięcy”). */
export const OD_30A = '2027-01-11';

export interface DaneTemperatury {
  miejsce: Miejsce;
  wysilek: Wysilek;
  /** Temperatura w °C. */
  temperatura: number;
  /** Czy wysoka temperatura wynika z pogody (a nie z technologii, np. pieca). */
  zPogody: boolean;
  /** Praca z wyjątków § 30a ust. 8 (np. ruch ciągły, transport, ochrona mienia). */
  wyjatek: boolean;
  /** Dzień, dla którego oceniamy (RRRR-MM-DD): od niego zależy, czy obowiązuje § 30a. */
  data: string;
}

export type Poziom = 'zakaz' | 'obowiazek' | 'zapowiedz';

export interface Punkt {
  poziom: Poziom;
  tekst: string;
  podstawa: string;
}

const OGOLNE = 'rozporządzenia w sprawie ogólnych przepisów BHP';
const NAPOJE = '§ 4 ust. 1 rozporządzenia w sprawie profilaktycznych posiłków i napojów';

export function ocenTemperature(d: DaneTemperatury): Punkt[] {
  const t = d.temperatura;
  const nowe = d.data >= OD_30A;
  const punkty: Punkt[] = [];
  const duzy = d.wysilek === 'duzy';
  // § 30a: przy nowych przepisach zakaz i obowiązki; przed 11.01.2027 te same punkty jako zapowiedź (interfejs dopisuje datę).
  const p30a = (poziom: 'zakaz' | 'obowiazek', tekst: string, podstawa: string) =>
    punkty.push({ poziom: nowe ? poziom : 'zapowiedz', tekst, podstawa });

  if (d.miejsce === 'pomieszczenie') {
    if (t < 14) punkty.push({ poziom: 'obowiazek', tekst: 'Za zimno: w pomieszczeniu pracy temperatura nie może być niższa niż 14°C, chyba że nie pozwalają na to względy technologiczne.', podstawa: `§ 30 ${OGOLNE}` });
    else if (d.wysilek === 'biuro-lekka' && t < 18) punkty.push({ poziom: 'obowiazek', tekst: 'Za zimno: w biurze i przy lekkiej pracy fizycznej temperatura nie może być niższa niż 18°C.', podstawa: `§ 30 ${OGOLNE}` });

    // § 30a ust. 1 (najwyżej 35°C) nie zależy od źródła ciepła; zakaz pracy z ust. 2 dotyczy tylko upału z pogody.
    if (!d.zPogody && t > 35 && !d.wyjatek) {
      p30a('obowiazek', 'Pracodawca zapewnia w pomieszczeniu najwyżej 35°C, chyba że nie pozwalają na to względy technologiczne. Zakaz pracy z § 30a ust. 2 dotyczy tylko upału z pogody.', `§ 30a ust. 1 ${OGOLNE}`);
    }
    if (d.zPogody) {
      if (t > 35 && !d.wyjatek) p30a('zakaz', 'Przerwać pracę: przy upale powyżej 35°C w pomieszczeniu nie wolno pracować, chyba że nie pozwalają na to względy technologiczne.', `§ 30a ust. 1 i 2 ${OGOLNE}`);
      if (t > 28 || (duzy && t > 25)) {
        p30a('obowiazek', `Pracodawca musi zastosować rozwiązania techniczne, które obniżają albo ograniczają wzrost temperatury, albo rozwiązania organizacyjne chroniące zdrowie (próg ${duzy ? '25°C przy dużym wysiłku' : '28°C'}).`, `§ 30a ust. 3 ${OGOLNE}`);
      }
      if (t > 28) punkty.push({ poziom: 'obowiazek', tekst: 'Napoje: przy temperaturze powyżej 28°C spowodowanej pogodą pracodawca zapewnia napoje w ilości zaspokajającej potrzeby.', podstawa: `${NAPOJE}, pkt 5` });
    }
  } else {
    if (t > 32 && duzy && !d.wyjatek) p30a('zakaz', 'Przerwać pracę: przy dużym wysiłku fizycznym na otwartej przestrzeni nie wolno pracować powyżej 32°C, chyba że nie pozwalają na to względy technologiczne.', `§ 30a ust. 1 i 2 ${OGOLNE}`);
    if (t > 25) p30a('obowiazek', 'Pracodawca musi zastosować rozwiązania organizacyjne, które ograniczają wpływ upału na zdrowie pracowników, dobrane do warunków i specyfiki pracy.', `§ 30a ust. 4 ${OGOLNE}`);
    if (t < 10 || t > 25) punkty.push({ poziom: 'obowiazek', tekst: `Napoje: przy pracy na otwartej przestrzeni ${t < 10 ? 'poniżej 10°C napoje gorące' : 'powyżej 25°C napoje zimne'} w ilości zaspokajającej potrzeby.`, podstawa: `${NAPOJE}, pkt 3 i ust. 2` });
  }
  if (duzy && !punkty.some((p) => p.podstawa.startsWith(NAPOJE))) {
    punkty.push({ poziom: 'obowiazek', tekst: 'Napoje: przy pracy z dużym wysiłkiem fizycznym pracodawca zapewnia napoje niezależnie od temperatury.', podstawa: `${NAPOJE}, pkt 4` });
  }
  return punkty;
}

/** Krótka ocena do nagłówka wyniku. */
export function podsumowanie(punkty: Punkt[]): 'zakaz' | 'obowiazki' | 'bez-obowiazkow' {
  if (punkty.some((p) => p.poziom === 'zakaz')) return 'zakaz';
  if (punkty.some((p) => p.poziom === 'obowiazek')) return 'obowiazki';
  return 'bez-obowiazkow';
}
