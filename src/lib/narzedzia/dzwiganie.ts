// Ile kg wolno dźwigać: górne granice masy przy ręcznych pracach transportowych.
// Dorośli: § 13 i § 17 rozporządzenia w sprawie BHP przy ręcznych pracach transportowych (t.j. Dz.U. 2018 poz. 1139).
// Kobiety w ciąży i karmiące: załącznik do rozporządzenia RM z 3 kwietnia 2017 r. (Dz.U. 2017 poz. 796), cz. I.
// Młodociani: 60% wartości dla kobiet i 40% dla mężczyzn (zał. nr 1 do rozporządzenia RM z 19 czerwca 2023 r.,
// Dz.U. 2023 poz. 1240, cz. I ust. 1 pkt 4). Praca dorywcza: do 4 razy na godzinę i łącznie do 4 godzin na dobę.

export type Osoba = 'mezczyzna' | 'kobieta' | 'ciaza' | 'karmiaca' | 'mlodociany' | 'mlodociana';
export type Czynnosc = 'podnoszenie' | 'nad-barki' | 'ponad-25m' | 'gora-do-30' | 'gora-ponad-30' | 'zespolowo';
export type Tryb = 'stala' | 'dorywcza';

export const OSOBY: Record<Osoba, string> = {
  mezczyzna: 'Mężczyzna',
  kobieta: 'Kobieta',
  ciaza: 'Kobieta w ciąży',
  karmiaca: 'Kobieta karmiąca dziecko piersią',
  mlodociany: 'Młodociany (15–18 lat), chłopak',
  mlodociana: 'Młodociana (15–18 lat), dziewczyna',
};

export const CZYNNOSCI: Record<Czynnosc, string> = {
  podnoszenie: 'Podnoszenie i przenoszenie',
  'nad-barki': 'Podnoszenie powyżej barków',
  'ponad-25m': 'Przenoszenie na odległość ponad 25 m',
  'gora-do-30': 'Pod górę (schody, pochylnie) do 30°, na wysokość ponad 4 m',
  'gora-ponad-30': 'Pod górę (schody, pochylnie) ponad 30°, na wysokość ponad 4 m',
  zespolowo: 'Zespołowo: przedmiot dłuższy niż 4 m, na jedną osobę',
};

/** [praca stała, praca dorywcza] w kg; 0 = zakaz. */
type Para = readonly [number, number];
interface Limit {
  kg: Para;
  podstawa: string;
}

const RPT = 'rozporządzenia o ręcznych pracach transportowych';
const CIAZA = 'rozporządzenia o pracach wzbronionych kobietom w ciąży i karmiącym, zał. cz. I ust.';

const DOROSLI: Record<'mezczyzna' | 'kobieta', Record<Czynnosc, Para>> = {
  mezczyzna: { podnoszenie: [30, 50], 'nad-barki': [21, 35], 'ponad-25m': [30, 30], 'gora-do-30': [30, 30], 'gora-ponad-30': [20, 30], zespolowo: [25, 42] },
  kobieta: { podnoszenie: [12, 20], 'nad-barki': [8, 14], 'ponad-25m': [12, 12], 'gora-do-30': [12, 12], 'gora-ponad-30': [8, 12], zespolowo: [10, 17] },
};
const PODSTAWA_DOROSLI: Record<Czynnosc, string> = {
  podnoszenie: `§ 13 ust. 1 ${RPT}`,
  'nad-barki': `§ 13 ust. 2 ${RPT}`,
  'ponad-25m': `§ 13 ust. 3 ${RPT}`,
  'gora-do-30': `§ 13 ust. 4 ${RPT}`,
  'gora-ponad-30': `§ 13 ust. 5 ${RPT}`,
  zespolowo: `§ 17 ust. 1 ${RPT}`,
};

const W_CIAZY: Record<Czynnosc, Limit> = {
  podnoszenie: { kg: [3, 3], podstawa: `${CIAZA} 1 pkt 2` },
  'nad-barki': { kg: [3, 3], podstawa: `${CIAZA} 1 pkt 2` },
  'ponad-25m': { kg: [3, 3], podstawa: `${CIAZA} 1 pkt 2` },
  'gora-do-30': { kg: [0, 1], podstawa: `${CIAZA} 1 pkt 5` },
  'gora-ponad-30': { kg: [0, 1], podstawa: `${CIAZA} 1 pkt 5` },
  zespolowo: { kg: [0, 0], podstawa: `${CIAZA} 1 pkt 7` },
};
const KARMIACA: Record<Czynnosc, Limit> = {
  podnoszenie: { kg: [6, 10], podstawa: `${CIAZA} 2 pkt 2` },
  'nad-barki': { kg: [6, 10], podstawa: `${CIAZA} 2 pkt 2` },
  'ponad-25m': { kg: [6, 6], podstawa: `${CIAZA} 2 pkt 5` },
  'gora-do-30': { kg: [6, 6], podstawa: `${CIAZA} 2 pkt 6` },
  'gora-ponad-30': { kg: [4, 6], podstawa: `${CIAZA} 2 pkt 7` },
  zespolowo: { kg: [0, 0], podstawa: `${CIAZA} 2 pkt 10` },
};
const MLODOCIANI = 'rozporządzenia o pracach wzbronionych młodocianym, zał. nr 1 cz. I ust. 1 pkt 4';

/** Zaokrąglenie do 0,1 kg (60% z 12 kg = 7,2 kg). */
const doDziesiatej = (x: number) => Math.round(Number((x * 10).toPrecision(12))) / 10;

export interface WynikLimitu {
  /** Najwyższa dopuszczalna masa w kg; 0 = praca zabroniona. */
  kg: number;
  podstawa: string;
  zakaz: boolean;
}

export function limit(osoba: Osoba, czynnosc: Czynnosc, tryb: Tryb): WynikLimitu {
  const i = tryb === 'stala' ? 0 : 1;
  let kg: number;
  let podstawa: string;
  if (osoba === 'mezczyzna' || osoba === 'kobieta') {
    kg = DOROSLI[osoba][czynnosc][i];
    podstawa = PODSTAWA_DOROSLI[czynnosc];
  } else if (osoba === 'ciaza' || osoba === 'karmiaca') {
    const l = (osoba === 'ciaza' ? W_CIAZY : KARMIACA)[czynnosc];
    kg = l.kg[i];
    podstawa = l.podstawa;
  } else {
    const baza = osoba === 'mlodociana' ? DOROSLI.kobieta : DOROSLI.mezczyzna;
    kg = doDziesiatej(baza[czynnosc][i] * (osoba === 'mlodociana' ? 0.6 : 0.4));
    podstawa = `${osoba === 'mlodociana' ? '60% wartości dla kobiet' : '40% wartości dla mężczyzn'} (${MLODOCIANI}; ${PODSTAWA_DOROSLI[czynnosc]})`;
  }
  return { kg, podstawa, zakaz: kg === 0 };
}

/** Wszystkie granice dla osoby (tabela i mapa regału). */
export const tabelaOsoby = (osoba: Osoba) =>
  (Object.keys(CZYNNOSCI) as Czynnosc[]).map((c) => ({ czynnosc: c, stala: limit(osoba, c, 'stala'), dorywcza: limit(osoba, c, 'dorywcza') }));

/** Czy ładunek mieści się w granicy; różnica w kg (ujemna = zapas). */
export function porownaj(masa: number, granica: WynikLimitu): { miesciSie: boolean; roznica: number } {
  return { miesciSie: !granica.zakaz && masa <= granica.kg, roznica: doDziesiatej(masa - granica.kg) };
}
