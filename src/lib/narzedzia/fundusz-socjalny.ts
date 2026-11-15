// Zakładowy fundusz świadczeń socjalnych: kto musi go tworzyć, ile wynosi odpis i kto korzysta. Przepisy:
// - ustawa z 4 marca 1994 r. o zakładowym funduszu świadczeń socjalnych (t.j. Dz.U. 2024 poz. 288; po tekście jednolitym
//   jedyna nowelizacja w mocy: Dz.U. 2026 poz. 25, od 27 stycznia 2026 r., art. 4 ust. 3 i art. 8 ust. 2 zd. 2:
//   „z pracownikami wybranymi przez załogę”; Dz.U. 2026 poz. 1123 zmienia art. 2 pkt 1 od 1 stycznia 2028 r.):
//   art. 3 ust. 1 (co najmniej 50 etatów 1 stycznia: fundusz), ust. 1c (20–49 etatów: fundusz na wniosek zakładowej
//   organizacji związkowej), ust. 2 (jednostki budżetowe i samorządowe zakłady budżetowe bez względu na liczbę),
//   ust. 3 (poniżej 50 etatów: fundusz albo świadczenie urlopowe), ust. 3a–3b (informacja o nietworzeniu w pierwszym
//   miesiącu roku albo postanowienie w układzie zbiorowym lub regulaminie wynagradzania), art. 4 ust. 1–3 (układ albo
//   regulamin wynagradzania może inaczej ustalić odpis albo wyłączyć fundusz), art. 5 ust. 2, 2a, 3, 4, 5, 5a i 7
//   (odpisy i zwiększenia, kwota GUS do 20 lutego), art. 6 ust. 2 i 2a (75% do 31 maja, całość do 30 września; nie
//   dotyczy pracodawców z art. 3 ust. 3), art. 2 pkt 5 (kto korzysta), art. 8 ust. 1 i 2 (kryterium socjalne,
//   regulamin), art. 8 ust. 3 (pozew związku), art. 12a (grzywna na wniosek PIP);
// - rozporządzenie MPiPS z 9 marca 2009 r. (Dz.U. 2009 nr 43 poz. 349), § 1 i 3: odpis od przeciętnej liczby
//   zatrudnionych w roku, niepełne etaty przeliczone na pełne, suma średnich miesięcznych przez 12;
// - obwieszczenia Prezesa GUS (art. 5 ust. 7): kwoty w PODSTAWA_ODPISU w swiadczenie-urlopowe.ts (jedno miejsce
//   aktualizacji dla obu narzędzi; rejestr.test.ts zatrzyma build po 20 lutego bez nowej kwoty). Ustawy okołobudżetowe
//   na 2025 r. (Dz.U. 2024 poz. 1925) i 2026 r. (Dz.U. 2025 poz. 1840, zmiana 2026 poz. 1349) podstawy nie zmieniają;
//   projekt na 2027 r. (druk sejmowy nr 3154, uchwalony przez Sejm 6 listopada 2026 r.) też nie;
// - ustawa o związkach zawodowych (t.j. Dz.U. 2026 poz. 549), art. 27 ust. 1–2: regulamin i przyznawanie świadczeń
//   w uzgodnieniu z zakładową organizacją związkową;
// - ustawa o PIT (t.j. Dz.U. 2026 poz. 592), art. 21 ust. 1 pkt 67 (1000 zł rocznie, bony nie są świadczeniem
//   rzeczowym) i pkt 78 lit. a (wypoczynek dzieci do 18 lat bez limitu); rozporządzenie składkowe (t.j. Dz.U. 2025
//   poz. 316), § 2 ust. 1 pkt 19 (świadczenia z funduszu poza podstawą składek).
// Interpretacje: (1) progi porównujemy z liczbą etatów wpisaną przez użytkownika (stan na 1 stycznia), a 50,00 to już
// „co najmniej 50”; (2) odpis na rok to odpis na jeden etat razy przeciętna liczba etatów; przyjmujemy, że w roku jest
// tyle samo etatów co 1 stycznia (pracodawca koryguje odpis na koniec roku, § 1 rozporządzenia); (3) przepisy nie mówią
// o zaokrąglaniu: odpis na etat i na rok zaokrąglamy do grosza (od 0,5 grosza w górę) i podajemy wartość dokładną,
// a „co najmniej 75%” do 31 maja w górę do grosza; (4) jednostka budżetowa: czy układ zbiorowy może tam wyłączyć
// fundusz, ustawa wprost nie mówi (art. 4 ust. 1 odsyła do art. 3 ust. 1 i 1c), więc tego nie przesądzamy.
import { PODSTAWA_ODPISU, LATA_ODPISU, maksimum, podstawaOdpisu } from './swiadczenie-urlopowe';
import { zl } from './format';
import { odmiana } from '../redakcja';

export { LATA_ODPISU, PODSTAWA_ODPISU, podstawaOdpisu };

/** Procent przeciętnego wynagrodzenia w punktach bazowych (37,5% = 3750). */
export const ODPISY = {
  zwykly: { bp: 3750, nazwa: 'Pracownik', przepis: 'art. 5 ust. 2' },
  szczegolne: { bp: 5000, nazwa: 'Praca w szczególnych warunkach lub o szczególnym charakterze', przepis: 'art. 5 ust. 3' },
  mlodociany1: { bp: 500, nazwa: 'Młodociany, 1. rok nauki', przepis: 'art. 5 ust. 2a' },
  mlodociany2: { bp: 600, nazwa: 'Młodociany, 2. rok nauki', przepis: 'art. 5 ust. 2a' },
  mlodociany3: { bp: 700, nazwa: 'Młodociany, 3. rok nauki', przepis: 'art. 5 ust. 2a' },
  niepelnosprawny: { bp: 625, nazwa: 'Zwiększenie: osoba ze znacznym lub umiarkowanym stopniem niepełnosprawności', przepis: 'art. 5 ust. 4' },
  emeryt: { bp: 625, nazwa: 'Zwiększenie: emeryt i rencista pod opieką socjalną', przepis: 'art. 5 ust. 5' },
  zlobek: { bp: 750, nazwa: 'Zwiększenie: zakładowy żłobek lub klub dziecięcy (na osobę)', przepis: 'art. 5 ust. 5a' },
} as const;

export type RodzajOdpisu = keyof typeof ODPISY;

/** a / b zaokrąglone do całości, połówka w górę (liczby nieujemne). */
const doCalosci = (a: bigint, b: bigint) => (2n * a + b) / (2n * b);
/** a / b zaokrąglone w górę. */
const wGore = (a: bigint, b: bigint) => (a + b - 1n) / b;

const groszePodstawy = (rok: number) => BigInt(Math.round(podstawaOdpisu(rok) * 100));

/** Odpis na jeden etat w roku: kwota do grosza i wartość dokładna (zł). */
export function odpisNaEtat(rok: number, rodzaj: RodzajOdpisu = 'zwykly') {
  const bp = BigInt(ODPISY[rodzaj].bp);
  const licznik = groszePodstawy(rok) * bp;
  return { kwota: Number(doCalosci(licznik, 10_000n)) / 100, dokladnie: Number(licznik) / 1_000_000, wGroszach: licznik % 10_000n === 0n };
}

/** Etaty wpisane przez człowieka: „35”, „49,5”, „12,875”. Tysięczne części etatu jako liczba całkowita; null, gdy błąd. */
export function etatyWTysiecznych(tekst: string): number | null {
  const t = tekst.trim().replace(/\s/g, '').replace(',', '.');
  const m = /^(\d{1,7})(?:\.(\d{1,3}))?$/.exec(t);
  if (!m) return null;
  const tys = Number(m[1]) * 1000 + Number((m[2] ?? '').padEnd(3, '0'));
  return tys > 0 && tys <= 1_000_000_000 ? tys : null;
}

/** Odpis podstawowy na rok przy danej przeciętnej liczbie etatów (37,5%) i kwota do 31 maja (co najmniej 75%). */
export function funduszNaRok(rok: number, etatyTys: number) {
  if (!Number.isInteger(etatyTys) || etatyTys <= 0) throw new RangeError('Liczba etatów musi być dodatnia');
  const licznik = groszePodstawy(rok) * BigInt(ODPISY.zwykly.bp) * BigInt(etatyTys);
  const mianownik = 10_000n * 1000n;
  return {
    kwota: Number(doCalosci(licznik, mianownik)) / 100,
    do31Maja: Number(wGore(licznik * 75n, mianownik * 100n)) / 100,
  };
}

export type Pracodawca = 'firma' | 'budzetowa';
export type Zwiazek = 'brak' | 'jest' | 'wniosek';

export type Obowiazek = 'prog50' | 'wniosek' | 'budzetowa' | 'dobrowolny';

/** Czy pracodawca musi tworzyć fundusz (art. 3 ust. 1, 1c, 2 i 3). */
export function obowiazek(etatyTys: number, zwiazek: Zwiazek, pracodawca: Pracodawca): Obowiazek {
  if (pracodawca === 'budzetowa') return 'budzetowa';
  if (etatyTys >= 50_000) return 'prog50';
  if (etatyTys >= 20_000 && zwiazek === 'wniosek') return 'wniosek';
  return 'dobrowolny';
}

export interface OpisFunduszu {
  werdykt: string;
  opis: string;
  odpis: string;
  odpisOpis: string;
  funduszEtykieta: string;
  fundusz: string;
  terminy: string;
  urlopowe: string;
  kto: string;
  odCzego: string;
  uwagi: string[];
}

/** „1 etat”, „22 etaty”, „50 etatów”, „49,5 etatu” (ułamek: dopełniacz liczby pojedynczej). */
export const etatyTekst = (tys: number) => {
  const liczba = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 3 }).format(tys / 1000);
  if (tys % 1000) return `${liczba} etatu`;
  return `${liczba} ${odmiana(tys / 1000, ['etat', 'etaty', 'etatów']).split(' ')[1]}`;
};

/** „37,5%”, „6,25%”. */
export const procentTekst = (bp: number) => `${new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 2 }).format(bp / 100)}%`;

const DOKLADNIE = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
/** „2943,225 zł” albo zwykła kwota, gdy wartość ma dwa miejsca po przecinku. */
export const zlDokladnie = (x: number) => `${DOKLADNIE.format(x)} zł`;

export const okresPodstawy = (rok: number) =>
  PODSTAWA_ODPISU[rok].zaPolrocze >= PODSTAWA_ODPISU[rok].zaRok ? `drugiego półrocza ${rok - 1} r.` : `${rok - 1} r.`;

export const KTO =
  'pracownicy i ich rodziny, emeryci i renciści, którzy tu pracowali, i ich rodziny, a także inne osoby, którym regulamin funduszu przyzna to prawo (art. 2 pkt 5)';
export const OD_CZEGO =
  'od sytuacji życiowej, rodzinnej i materialnej osoby uprawnionej (art. 8 ust. 1) i od regulaminu funduszu, który podaje rodzaje świadczeń i zasady ich przyznawania (art. 8 ust. 2)';

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisFunduszu(rok: number, etatyTys: number, zwiazek: Zwiazek, pracodawca: Pracodawca): OpisFunduszu {
  const o = obowiazek(etatyTys, zwiazek, pracodawca);
  const odpis = odpisNaEtat(rok);
  const f = funduszNaRok(rok, etatyTys);
  const musi = o !== 'dobrowolny';
  const podstawa = zl(podstawaOdpisu(rok));
  const r: OpisFunduszu = {
    werdykt: musi ? 'Musi tworzyć fundusz' : 'Nie musi tworzyć funduszu',
    opis: '',
    odpis: zl(odpis.kwota),
    odpisOpis: `37,5% z ${podstawa}, przeciętnego wynagrodzenia z ${okresPodstawy(rok)}${odpis.wGroszach ? '' : `, dokładnie ${zlDokladnie(odpis.dokladnie)}`} (art. 5 ust. 2)`,
    funduszEtykieta: musi ? `Odpis na ${rok} r., ${etatyTekst(etatyTys)}` : `Fundusz najwyżej, ${etatyTekst(etatyTys)}`,
    fundusz: zl(f.kwota),
    terminy: musi
      ? `co najmniej ${zl(f.do31Maja)} do 31 maja, całość do 30 września ${rok} r. na osobny rachunek funduszu (art. 6 ust. 2, art. 12 ust. 1)`
      : 'bez ustawowych terminów: dotyczą tylko pracodawców, którzy muszą tworzyć fundusz (art. 6 ust. 2a)',
    urlopowe: musi
      ? 'nie zamiast funduszu: świadczenie urlopowe z art. 3 ust. 3 dotyczy tylko pracodawców poniżej 50 etatów'
      : `najwyżej ${zl(maksimum(rok, 'zwykle').kwota)} na pełny etat raz w roku, przy co najmniej 14 kolejnych dniach urlopu (art. 3 ust. 3–5)`,
    kto: KTO,
    odCzego: OD_CZEGO,
    uwagi: [],
  };
  if (o === 'prog50') r.opis = 'co najmniej 50 etatów 1 stycznia (art. 3 ust. 1 ustawy o ZFŚS)';
  else if (o === 'wniosek') r.opis = 'od 20 do 49 etatów 1 stycznia i wniosek zakładowej organizacji związkowej (art. 3 ust. 1c)';
  else if (o === 'budzetowa') r.opis = 'jednostka budżetowa albo samorządowy zakład budżetowy tworzy fundusz bez względu na liczbę pracowników (art. 3 ust. 2)';
  else r.opis = 'mniej niż 50 etatów 1 stycznia: może utworzyć fundusz, wypłacać świadczenie urlopowe albo nie robić żadnej z tych rzeczy (art. 3 ust. 3)';

  if (o === 'prog50' || o === 'wniosek') {
    r.uwagi.push(
      'Układ zbiorowy pracy, a gdy go nie ma, regulamin wynagradzania może inaczej ustalić odpis albo postanowić, że funduszu nie będzie (art. 4 ust. 1–2). Bez zakładowej organizacji związkowej takie postanowienie regulaminu wynagradzania wymaga uzgodnienia z pracownikami wybranymi przez załogę (art. 4 ust. 3).',
    );
  }
  if (o === 'dobrowolny' && etatyTys >= 20_000) {
    r.uwagi.push(
      zwiazek === 'jest'
        ? 'Zakładowa organizacja związkowa może złożyć wniosek, a wtedy fundusz jest obowiązkowy (art. 3 ust. 1c).'
        : 'Przy 20–49 etatach fundusz staje się obowiązkowy na wniosek zakładowej organizacji związkowej (art. 3 ust. 1c). Wniosku nie składa pojedynczy pracownik.',
    );
  }
  if (o === 'dobrowolny' && etatyTys < 20_000 && zwiazek === 'wniosek') {
    r.uwagi.push('Poniżej 20 etatów wniosek związku zawodowego nie zobowiązuje do utworzenia funduszu: art. 3 ust. 1c dotyczy pracodawców od 20 do 49 etatów.');
  }
  if (o === 'dobrowolny') {
    r.uwagi.push(
      'Gdy pracodawca nie tworzy funduszu i nie wypłaca świadczenia urlopowego, informuje o tym w pierwszym miesiącu roku, w sposób przyjęty w firmie. Przy co najmniej 50 pracownikach w osobach zapisuje to w układzie zbiorowym albo regulaminie wynagradzania (art. 3 ust. 3a–3b).',
    );
  }
  if (musi) {
    r.uwagi.push(
      'Gdy pracodawca, który musi tworzyć fundusz, go nie tworzy albo nie przekazuje pieniędzy, związek zawodowy może pozwać go do sądu pracy o przekazanie należnych środków (art. 8 ust. 3), a za niewykonywanie ustawy grozi grzywna na wniosek inspektora pracy (art. 12a).',
    );
  }
  return r;
}
