// Odzież i obuwie robocze, środki ochrony indywidualnej (ŚOI), pranie i ekwiwalenty. Sprawdzenie według przepisów
// i dwa rachunki z danych użytkownika (koszt prań, orientacyjny ekwiwalent za własną odzież).
//
// Przepisy (stan na 12.11.2026):
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245 (późniejsza zmiana Dz.U. 2026 poz. 1046 nie dotyczy poniższych artykułów):
//   art. 2 (kto jest pracownikiem), art. 18 § 1–2 (postanowienia mniej korzystne nieważne), art. 124 § 1 pkt 2 i § 3
//   (odpowiedzialność za powierzoną odzież), art. 207 § 2¹ (koszty BHP nie obciążają pracowników), art. 211 pkt 4,
//   art. 237⁶ § 1 (ŚOI nieodpłatnie), art. 237⁷ § 1–4 (odzież i obuwie robocze, własne za zgodą, wyłączenia,
//   ekwiwalent „uwzględniający ich aktualne ceny”), art. 237⁸ § 1–2 (okresy użytkowania, własność pracodawcy),
//   art. 237⁹ § 1–3 (niedopuszczenie do pracy, pranie, ekwiwalent „w wysokości kosztów poniesionych przez pracownika”),
//   art. 237¹⁰ § 1–2 (odzież skażona: pranie przez pracownika niedopuszczalne), art. 304 § 1 i 3, art. 304¹, art. 304⁴
//   (osoby na innej podstawie niż stosunek pracy, prace krótkotrwałe).
// - Ustawa o zatrudnianiu pracowników tymczasowych, t.j. Dz.U. 2025 poz. 236: art. 9 ust. 2a (odzież, obuwie i ŚOI
//   dostarcza pracodawca użytkownik), art. 27 ust. 2 pkt 1 (kara).
// - Ustawa o PIT, t.j. Dz.U. 2026 poz. 592: art. 21 ust. 1 pkt 11 (zwolnienie świadczeń i ekwiwalentów z przepisów BHP;
//   zmiany po t.j. tego punktu nie dotyczą).
// - Rozporządzenie MPiPS z 18.12.1998 o podstawie wymiaru składek, t.j. Dz.U. 2025 poz. 316: § 2 ust. 1 pkt 6
//   (ekwiwalenty za pranie i za własną odzież poza podstawą), § 5 ust. 2 pkt 2 (zlecenie: stosuje się odpowiednio).
// - Ustawa o świadczeniach opieki zdrowotnej, t.j. Dz.U. 2025 poz. 1461: art. 81 ust. 1 (ta sama podstawa dla składki
//   zdrowotnej pracowników i zleceniobiorców).
// - Rozporządzenie w sprawie ogólnych przepisów BHP, t.j. Dz.U. 2003 poz. 1650 ze zm.: § 2 pkt 9 (zwykła odzież robocza
//   nie jest ŚOI), zał. 3 § 43 (pralnia zakładowa przy odzieży skażonej lub szczególnie zabrudzonej).
//
// Interpretacje (przepis nie rozstrzyga, wybieramy wariant bezpieczny dla pracującego):
// 1. Nie klasyfikujemy konkretnych rzeczy jako ŚOI albo odzieży roboczej (to wynika z oceny ryzyka i norm): użytkownik
//    sam wybiera, o co pyta.
// 2. „Bezpośrednia obsługa maszyn” i „intensywne brudzenie” (art. 237⁷ § 3) nie mają definicji; gdy użytkownik je
//    zaznacza, wyłączenie działa: własnej odzieży za ekwiwalent nie dopuszczamy. Te warunki, a także skażenie, traktujemy
//    jednocześnie jako podstawę obowiązku z art. 237⁷ § 1 (intensywne brudzenie i skażenie mieszczą się w „znacznym
//    zabrudzeniu”, obsługa maszyn w wymaganiach BHP; wariant bezpieczny). Gdy jedyną podstawą jest obsługa maszyn,
//    wynik mówi wprost, że § 3 sam obowiązku nie tworzy i że to nasz wariant. „Skażenie” znaczy skażenie samej odzieży
//    środkami chemicznymi lub promieniotwórczymi albo materiałem biologicznie zakaźnym (art. 237⁷ § 3, 237¹⁰ § 1), nie
//    samą obecność chemii czy promieniowania w pracy.
// 3. ŚOI: ekwiwalentu za własne Kodeks nie przewiduje (art. 237⁷ § 2 i 4 dotyczą tylko odzieży i obuwia roboczego),
//    a ekwiwalent za pranie (art. 237⁹ § 3) dotyczy tylko odzieży roboczej.
// 4. Umowa zlecenia: art. 237⁶–237¹⁰ mówią o pracowniku (art. 2). Art. 304 § 1 nakazuje bezpieczne i higieniczne
//    warunki pracy, art. 304⁴ odzież przy pracach krótkotrwałych. O stałej pracy na zleceniu przepis nie mówi wprost,
//    więc wynik to „nie rozstrzyga”; ekwiwalentów dla zleceniobiorcy Kodeks nie przewiduje, a przy ich wypłacie składki
//    liczymy według § 5 ust. 2 pkt 2 rozporządzenia, PIT „nie rozstrzyga”. Zakazu z art. 237¹⁰ § 2 (dotyczy
//    pracownika) dla zlecenia nie wywodzimy.
// 5. Praca przez agencję: odzież, obuwie i ŚOI dostarcza pracodawca użytkownik (art. 9 ust. 2a); kto zapewnia pranie
//    i kto wypłaca ekwiwalent, przepis nie mówi (sygnalizujemy). Grzywna z art. 27 ust. 2 pkt 1 dotyczy osoby, która jako
//    pracodawca użytkownik lub w jego imieniu nie wypełnia obowiązków uzgodnionych na piśmie z agencją.
// 6. Pranie przy braku obowiązku z art. 237⁷ § 1: gdy pracodawca mimo to daje odzież roboczą, stosujemy art. 237⁹ § 2–3
//    (przepis mówi o „stosowanej” odzieży roboczej bez zawężenia); gdy jej nie daje, przepisy o praniu nie dotyczą.
// 7. Czy obok ekwiwalentu za własną odzież należy się ekwiwalent za jej pranie, przepis nie rozstrzyga (sygnalizujemy
//    tylko tę uwagę, bez uwagi o braku ekwiwalentu za pranie). ŚOI pierze pracodawca (art. 237⁹ § 2): gdy pierze je
//    pracownik, sygnalizujemy, że § 3 dotyczy tylko odzieży roboczej.
// 8. PIT: art. 21 ust. 1 pkt 11 zwalnia świadczenia rzeczowe i ekwiwalenty „przysługujące na podstawie przepisów BHP”,
//    jeżeli zasady ich przyznawania wynikają z ustawy; zwolnienie zakładamy dla ekwiwalentu wypłacanego zgodnie
//    z art. 237⁷ § 4 albo 237⁹ § 3 Kp (piszemy to w wyniku i w „Jak liczymy”).
// 9. Rachunki: przepis nie podaje stawki ani wzoru. Koszt prań = liczba prań w miesiącu × koszt jednego prania podany
//    przez użytkownika (pomoc do udokumentowania kosztów z art. 237⁹ § 3). Orientacyjny ekwiwalent za własne = suma
//    (aktualna cena ÷ okres użytkowania w miesiącach) — nasze przybliżenie „aktualnych cen” (art. 237⁷ § 4) i okresów
//    użytkowania ustalanych przez pracodawcę (art. 237⁸ § 1). Rok = 12 miesięcy, liczony z dokładnej sumy; zaokrąglenie
//    do grosza połówkowo w górę na końcu (arytmetyka całkowita na groszach).

export type Umowa = 'praca' | 'tymczasowa' | 'zlecenie';
export type Rodzaj = 'odziez' | 'soi';
export type Warunek = 'brud' | 'wymogi' | 'maszyny' | 'intensywne' | 'skazenie';
export type Teraz = 'daje' | 'wlasna' | 'nic';
export type KtoPierze = 'firma' | 'ja';

export const UMOWY: readonly Umowa[] = ['praca', 'tymczasowa', 'zlecenie'];
export const RODZAJE: readonly Rodzaj[] = ['odziez', 'soi'];
export const WARUNKI: readonly Warunek[] = ['brud', 'wymogi', 'maszyny', 'intensywne', 'skazenie'];
export const TERAZ: readonly Teraz[] = ['daje', 'wlasna', 'nic'];
export const KTO_PIERZE: readonly KtoPierze[] = ['firma', 'ja'];

export interface DaneOdziezy {
  umowa: Umowa;
  rodzaj: Rodzaj;
  warunki: readonly Warunek[];
  teraz: Teraz;
  pranie: KtoPierze;
  /** Czy dostajesz ekwiwalent za własną odzież (ma znaczenie przy teraz = 'wlasna'). */
  ekwWlasne: boolean;
  /** Czy dostajesz ekwiwalent za pranie (ma znaczenie przy pranie = 'ja'). */
  ekwPranie: boolean;
}

export type Obowiazek = 'tak' | 'nie-wymaga' | 'nie-rozstrzyga';
export type Wlasne = 'za-zgoda' | 'nie' | 'nie-dotyczy' | 'brak-przepisu';
export type Pranie = 'tylko-firma' | 'firma' | 'firma-lub-ty' | 'nie-dotyczy' | 'brak-przepisu';
export type Uwaga =
  | 'brak-odziezy'
  | 'wlasne-niedozwolone'
  | 'brak-ekw-wlasne'
  | 'pranie-skazonej'
  | 'pranie-soi'
  | 'pranie-bez-ekw'
  | 'wlasna-pranie'
  | 'agencja-ekwiwalent';

export interface Podatki {
  pit: 'zwolniony' | 'nie-rozstrzyga';
  /** Ekwiwalenty poza podstawą składek emerytalnej, rentowej i zdrowotnej. */
  skladki: 'bez';
}

export interface WynikOdziezy {
  obowiazek: Obowiazek;
  kto: 'pracodawca' | 'pracodawca-uzytkownik';
  wlasne: Wlasne;
  pranie: Pranie;
  podatki: Podatki | null;
  uwagi: Uwaga[];
}

const WYLACZENIA: readonly Warunek[] = ['maszyny', 'intensywne', 'skazenie'];

export function sprawdzOdziez(d: DaneOdziezy): WynikOdziezy {
  if (!UMOWY.includes(d.umowa)) throw new RangeError('Nieznana umowa');
  if (!RODZAJE.includes(d.rodzaj)) throw new RangeError('Nieznany rodzaj');
  if (!TERAZ.includes(d.teraz)) throw new RangeError('Nieznany stan');
  if (!KTO_PIERZE.includes(d.pranie)) throw new RangeError('Nieznane pranie');
  for (const w of d.warunki) if (!WARUNKI.includes(w)) throw new RangeError('Nieznany warunek');

  const W = new Set(d.warunki);
  const wylaczenie = WYLACZENIA.some((w) => W.has(w)); // art. 237⁷ § 3
  const podstawa = W.has('brud') || W.has('wymogi') || wylaczenie; // art. 237⁷ § 1 pkt 1–2 (interpretacja 2)
  const pracowniczy = d.umowa !== 'zlecenie';

  let obowiazek: Obowiazek;
  if (d.rodzaj === 'soi') obowiazek = pracowniczy ? 'tak' : 'nie-rozstrzyga';
  else if (pracowniczy) obowiazek = podstawa ? 'tak' : 'nie-wymaga';
  else obowiazek = podstawa ? 'nie-rozstrzyga' : 'nie-wymaga';

  let wlasne: Wlasne;
  if (d.rodzaj === 'soi') wlasne = 'nie';
  else if (!pracowniczy) wlasne = 'brak-przepisu';
  else if (obowiazek === 'nie-wymaga') wlasne = 'nie-dotyczy';
  else if (wylaczenie) wlasne = 'nie';
  else wlasne = 'za-zgoda';

  let pranie: Pranie;
  if (!pracowniczy) pranie = 'brak-przepisu';
  else if (W.has('skazenie')) pranie = 'tylko-firma';
  else if (d.rodzaj === 'soi') pranie = 'firma';
  else if (obowiazek === 'nie-wymaga' && d.teraz !== 'daje') pranie = 'nie-dotyczy';
  else pranie = 'firma-lub-ty';

  let podatki: Podatki | null = null;
  if (pracowniczy && (wlasne === 'za-zgoda' || pranie === 'firma-lub-ty')) podatki = { pit: 'zwolniony', skladki: 'bez' };
  else if (!pracowniczy && d.rodzaj === 'odziez' && obowiazek === 'nie-rozstrzyga') podatki = { pit: 'nie-rozstrzyga', skladki: 'bez' };

  const uwagi: Uwaga[] = [];
  if (d.teraz === 'nic' && obowiazek === 'tak') uwagi.push('brak-odziezy');
  if (pracowniczy && d.teraz === 'wlasna' && wlasne === 'nie') uwagi.push('wlasne-niedozwolone');
  if (d.teraz === 'wlasna' && wlasne === 'za-zgoda' && !d.ekwWlasne) uwagi.push('brak-ekw-wlasne');
  if (pracowniczy && d.pranie === 'ja' && W.has('skazenie')) uwagi.push('pranie-skazonej');
  if (pracowniczy && d.pranie === 'ja' && d.rodzaj === 'soi' && !W.has('skazenie')) uwagi.push('pranie-soi');
  const wlasnaPranie = d.teraz === 'wlasna' && d.pranie === 'ja' && wlasne === 'za-zgoda'; // interpretacja 7
  if (d.pranie === 'ja' && pranie === 'firma-lub-ty' && !d.ekwPranie && !wlasnaPranie) uwagi.push('pranie-bez-ekw');
  if (wlasnaPranie) uwagi.push('wlasna-pranie');
  if (d.umowa === 'tymczasowa' && ((d.teraz === 'wlasna' && wlasne === 'za-zgoda') || (d.pranie === 'ja' && pranie === 'firma-lub-ty')))
    uwagi.push('agencja-ekwiwalent');

  return { obowiazek, kto: d.umowa === 'tymczasowa' ? 'pracodawca-uzytkownik' : 'pracodawca', wlasne, pranie, podatki, uwagi };
}

/** Które pytania o ekwiwalent pokazać: tylko te, których odpowiedź zmienia wynik (ekwWlasne, ekwPranie). */
export function polaEkwiwalentow(d: DaneOdziezy, w: WynikOdziezy): { ekwWlasne: boolean; ekwPranie: boolean } {
  const wlasnaZaZgoda = d.teraz === 'wlasna' && w.wlasne === 'za-zgoda';
  // Przy własnej odzieży pranej w domu wynik to „przepis nie rozstrzyga” (interpretacja 7), niezależnie od ekwPranie.
  return { ekwWlasne: wlasnaZaZgoda, ekwPranie: d.pranie === 'ja' && w.pranie === 'firma-lub-ty' && !wlasnaZaZgoda };
}

// ——— Rachunki (kwoty w groszach, całkowicie) ———

export const MAKS_PRAN = 62;
export const MAKS_KOSZT_PRANIA = 100;
export const MAKS_CENA = 5000;
export const MAKS_MIESIECY = 60;
/** Liczba wierszy rzeczy w rachunku ekwiwalentu za własne (formularz i skrypt strony). */
export const WIERSZE_RZECZY = 3;

/** Kwota w złotych z najwyżej dwoma miejscami po przecinku → grosze; inaczej NaN. */
function grosze(zl: number): number {
  const g = Math.round(zl * 100);
  return Number.isFinite(zl) && Math.abs(zl * 100 - g) < 1e-6 ? g : Number.NaN;
}

export interface Rachunek {
  /** Złote, zaokrąglone do grosza. */
  miesiac: number;
  rok: number;
}

/** Koszt Twoich prań: liczba prań w miesiącu × koszt jednego prania (art. 237⁹ § 3 nie podaje stawki). */
export function kosztPran(pranMies: number, kosztPrania: number): Rachunek {
  if (!Number.isInteger(pranMies) || pranMies < 0 || pranMies > MAKS_PRAN) throw new RangeError('Liczba prań spoza zakresu');
  const g = grosze(kosztPrania);
  if (!(g >= 0 && g <= MAKS_KOSZT_PRANIA * 100)) throw new RangeError('Koszt prania spoza zakresu');
  const mies = pranMies * g;
  return { miesiac: mies / 100, rok: (mies * 12) / 100 };
}

export interface Rzecz {
  cena: number;
  miesiace: number;
}

/** Zaokrąglenie ułamka licznik/mianownik (BigInt, dodatnie) do liczby całkowitej, połówki w górę. */
const zaokraglij = (licznik: bigint, mianownik: bigint) => Number((2n * licznik + mianownik) / (2n * mianownik));

/** Orientacyjny ekwiwalent za własną odzież: suma (aktualna cena ÷ okres użytkowania w miesiącach). */
export function ekwiwalentWlasne(rzeczy: readonly Rzecz[]): Rachunek {
  if (!rzeczy.length) throw new RangeError('Brak rzeczy');
  let licznik = 0n;
  let mianownik = 1n;
  for (const r of rzeczy) {
    const g = grosze(r.cena);
    if (!(g > 0 && g <= MAKS_CENA * 100)) throw new RangeError('Cena spoza zakresu');
    if (!Number.isInteger(r.miesiace) || r.miesiace < 1 || r.miesiace > MAKS_MIESIECY) throw new RangeError('Okres spoza zakresu');
    const m = BigInt(r.miesiace);
    licznik = licznik * m + BigInt(g) * mianownik;
    mianownik *= m;
  }
  return { miesiac: zaokraglij(licznik, mianownik) / 100, rok: zaokraglij(12n * licznik, mianownik) / 100 };
}

// ——— Teksty wyniku (wspólne dla HTML z serwera i skryptu w przeglądarce) ———

export interface Wiersz {
  dt: string;
  dd: string;
  opis: string;
}
export interface TekstyWyniku {
  glowny: string;
  podstawa: string;
  wiersze: Wiersz[];
  uwagi: string[];
}

const KP = 'Kodeksu pracy';

export function tekstyWyniku(d: DaneOdziezy, w: WynikOdziezy): TekstyWyniku {
  const soi = d.rodzaj === 'soi';
  const agencja = d.umowa === 'tymczasowa' ? ' Przy pracy przez agencję daje je pracodawca użytkownik, czyli firma, u której pracujesz (art. 9 ust. 2a ustawy o zatrudnianiu pracowników tymczasowych).' : '';

  const W = new Set(d.warunki);
  const tylkoMaszyny = W.has('maszyny') && !(['brud', 'wymogi', 'intensywne', 'skazenie'] as const).some((x) => W.has(x));
  const zlecenie304 = `Osobom na zleceniu pracującym w zakładzie pracy lub w miejscu wyznaczonym przez pracodawcę firma zapewnia bezpieczne i higieniczne warunki pracy (art. 304 § 1 i 3), a przy pracach krótkotrwałych i czynnościach inspekcyjnych przydziela niezbędną odzież roboczą i środki ochrony, gdy własna odzież może ulec zniszczeniu lub znacznemu zabrudzeniu, a także ze względu na bezpieczeństwo tych prac (art. 304⁴)`;

  let glowny: string;
  let podstawa: string;
  if (w.obowiazek === 'tak') {
    glowny = soi ? 'Firma musi dać środki ochrony' : 'Firma musi dać odzież i obuwie';
    podstawa = soi
      ? `Nieodpłatnie, gdy chronią przed niebezpiecznymi lub szkodliwymi czynnikami w środowisku pracy, z informacją, jak ich używać (art. 237⁶ § 1 ${KP}).${agencja}`
      : `Nieodpłatnie, gdy własna odzież może ulec zniszczeniu lub znacznemu zabrudzeniu albo wymagają tego technologia, higiena lub BHP (art. 237⁷ § 1 ${KP}).${agencja}`;
    if (!soi && tylkoMaszyny)
      podstawa += ' Zaznaczono tylko bezpośrednią obsługę maszyn: art. 237⁷ § 3 wyklucza wtedy pracę we własnej odzieży za ekwiwalent, ale sam obowiązku nie tworzy. Przyjmujemy, że obowiązek wynika z wymagań BHP (§ 1 pkt 2); to nasz wariant bezpieczny, przepis nie mówi tego wprost.';
  } else if (w.obowiazek === 'nie-rozstrzyga') {
    glowny = 'Przepis nie rozstrzyga wprost';
    podstawa = `Art. ${soi ? '237⁶' : '237⁷'} ${KP} mówi o pracownikach. ${zlecenie304}.`;
  } else if (d.umowa === 'zlecenie') {
    glowny = 'Przepis nie wymaga odzieży roboczej';
    podstawa = `Art. 237⁷ ${KP} mówi o pracownikach. ${zlecenie304}. Nie zaznaczono żadnego z tych warunków.`;
  } else {
    glowny = 'Przepis nie wymaga odzieży roboczej';
    podstawa = `Obowiązek powstaje, gdy własna odzież może ulec zniszczeniu lub znacznemu zabrudzeniu albo wymagają tego technologia, higiena lub BHP (art. 237⁷ § 1 ${KP}). Nie zaznaczono żadnego z tych warunków.`;
  }

  const wiersze: Wiersz[] = [];
  if (w.obowiazek === 'tak') {
    wiersze.push({
      dt: 'Kto daje i za ile',
      dd: w.kto === 'pracodawca-uzytkownik' ? 'Pracodawca użytkownik, bez opłat' : 'Pracodawca, bez opłat',
      opis: 'Koszty BHP w żaden sposób nie mogą obciążać pracowników (art. 207 § 2¹), a zapis umowy mniej korzystny niż przepisy jest nieważny (art. 18 § 2). Rzeczy pozostają własnością pracodawcy (art. 237⁸ § 2).',
    });
  }

  const wlasne: Record<Wlasne, [string, string]> = {
    'za-zgoda': ['Możliwe za Twoją zgodą', 'Tylko na stanowisku, które pracodawca na to dopuścił, i w odzieży spełniającej wymagania BHP; ekwiwalent uwzględnia aktualne ceny odzieży i obuwia (art. 237⁷ § 2 i 4).'],
    nie: soi
      ? ['Nie', 'Ekwiwalent za własne Kodeks pracy przewiduje tylko dla odzieży i obuwia roboczego (art. 237⁷ § 2 i 4), nie dla środków ochrony indywidualnej.']
      : ['Nie na tym stanowisku', 'Własnej odzieży za ekwiwalent nie dopuszcza się przy bezpośredniej obsłudze maszyn i urządzeń, pracach intensywnie brudzących i skażeniu chemicznym, promieniotwórczym lub biologicznym (art. 237⁷ § 3).'],
    'nie-dotyczy': ['Nie dotyczy', 'Ekwiwalent z art. 237⁷ § 4 przysługuje tylko na stanowiskach, które pracodawca dopuścił do pracy we własnej odzieży i obuwiu roboczym, za zgodą pracownika (§ 2).'],
    'brak-przepisu': ['Kodeks pracy nie przewiduje', 'Ekwiwalent za własną odzież i obuwie (art. 237⁷ § 4) dotyczy pracowników; dla zlecenia nie ma takiego przepisu.'],
  };
  wiersze.push({ dt: 'Własne ubranie za ekwiwalent', dd: wlasne[w.wlasne][0], opis: wlasne[w.wlasne][1] });

  const pranie: Record<Pranie, [string, string]> = {
    'tylko-firma': ['Tylko pracodawca', 'Rzeczy skażonych chemicznie, promieniotwórczo lub materiałem zakaźnym nie wolno powierzyć pracownikowi do prania, konserwacji, odpylania ani odkażania; przechowuje się je w miejscu wyznaczonym przez pracodawcę (art. 237¹⁰ § 1–2).'],
    firma: ['Pracodawca', 'Pracodawca zapewnia pranie, konserwację, naprawę, odpylanie i odkażanie (art. 237⁹ § 2). Ekwiwalent za pranie przez pracownika przepis przewiduje tylko dla odzieży roboczej (§ 3).'],
    'firma-lub-ty': ['Pracodawca, wyjątkowo Ty', 'Pracodawca zapewnia pranie, konserwację i naprawę (art. 237⁹ § 2). Gdy nie może zapewnić prania, może je wykonywać pracownik, a pracodawca wypłaca wtedy ekwiwalent w wysokości kosztów poniesionych przez pracownika (§ 3). Ten ekwiwalent dotyczy odzieży, nie obuwia.'],
    'nie-dotyczy': ['Nie dotyczy', 'Przepisy o praniu (art. 237⁹ § 2–3) dotyczą odzieży roboczej, a przy tych warunkach przepis jej nie wymaga.'],
    'brak-przepisu': ['Kodeks pracy nie mówi', 'Przepisy o praniu i ekwiwalencie za pranie (art. 237⁹–237¹⁰) dotyczą pracowników; dla zlecenia nie ma takiego przepisu.'],
  };
  const pranieAgencja =
    w.kto === 'pracodawca-uzytkownik' && (w.pranie === 'tylko-firma' || w.pranie === 'firma' || w.pranie === 'firma-lub-ty')
      ? ' Przy pracy przez agencję przepis nie mówi, czy pranie zapewnia agencja, czy pracodawca użytkownik (art. 9 ust. 2a ustawy o zatrudnianiu pracowników tymczasowych mówi tylko o dostarczeniu).'
      : '';
  wiersze.push({ dt: 'Kto pierze', dd: pranie[w.pranie][0], opis: pranie[w.pranie][1] + pranieAgencja });

  if (w.podatki?.pit === 'zwolniony') {
    wiersze.push({
      dt: 'Podatek od ekwiwalentu',
      dd: 'Bez podatku',
      opis: 'Świadczenia rzeczowe i ekwiwalenty za nie, przysługujące na podstawie przepisów BHP, są wolne od PIT, jeżeli zasady ich przyznawania wynikają z ustawy (art. 21 ust. 1 pkt 11 ustawy o PIT), tu z Kodeksu pracy. Zwolnienie zakładamy dla ekwiwalentu wypłacanego zgodnie z art. 237⁷ § 4 albo 237⁹ § 3 Kodeksu pracy.',
    });
    wiersze.push({
      dt: 'ZUS i zdrowotna od ekwiwalentu',
      dd: 'Bez składek',
      opis: 'Ekwiwalenty za pranie odzieży roboczej i za używanie własnej odzieży i obuwia nie wchodzą do podstawy składek (§ 2 ust. 1 pkt 6 rozporządzenia o podstawie wymiaru składek), a więc i składki zdrowotnej (art. 81 ust. 1 ustawy o świadczeniach opieki zdrowotnej).',
    });
  } else if (w.podatki?.pit === 'nie-rozstrzyga') {
    wiersze.push({
      dt: 'Podatek, jeśli dostajesz ekwiwalent',
      dd: 'Przepis nie rozstrzyga',
      opis: 'Zwolnienie z art. 21 ust. 1 pkt 11 ustawy o PIT obejmuje świadczenia przysługujące na podstawie przepisów BHP, a Kodeks pracy nie przyznaje ekwiwalentów osobom na zleceniu.',
    });
    wiersze.push({
      dt: 'ZUS i zdrowotna, jeśli dostajesz ekwiwalent',
      dd: 'Bez składek',
      opis: 'Wyłączenie ekwiwalentów za pranie i własną odzież z podstawy składek (§ 2 ust. 1 pkt 6 rozporządzenia) stosuje się odpowiednio do zlecenia (§ 5 ust. 2 pkt 2); składka zdrowotna ma tę samą podstawę (art. 81 ust. 1 ustawy o świadczeniach opieki zdrowotnej).',
    });
  }

  const UWAGI: Record<Uwaga, string> = {
    'brak-odziezy': `Pracodawca nie może dopuścić Cię do pracy bez środków ochrony indywidualnej oraz odzieży i obuwia roboczego przewidzianych na Twoim stanowisku (art. 237⁹ § 1 ${KP}).${d.umowa === 'tymczasowa' ? ' Kto jako pracodawca użytkownik lub w jego imieniu nie dostarcza ich mimo uzgodnienia na piśmie z agencją, podlega grzywnie od 1000 do 30 000 zł (art. 27 ust. 2 pkt 1 w związku z ust. 1 ustawy o zatrudnianiu pracowników tymczasowych).' : ''}`,
    'wlasne-niedozwolone': soi
      ? `Środki ochrony indywidualnej pracodawca dostarcza nieodpłatnie (art. 237⁶ § 1 ${KP}), a kosztami BHP nie wolno obciążać pracowników (art. 207 § 2¹).`
      : `Na stanowisku z obsługą maszyn, pracami intensywnie brudzącymi albo skażeniem przepis nie dopuszcza pracy we własnej odzieży za ekwiwalent (art. 237⁷ § 3 ${KP}); odzież i obuwie daje pracodawca (§ 1).`,
    'brak-ekw-wlasne': `Pracownikowi używającemu za zgodą własnej odzieży i obuwia roboczego pracodawca wypłaca ekwiwalent w wysokości uwzględniającej ich aktualne ceny (art. 237⁷ § 4 ${KP}).`,
    'pranie-skazonej': `Odzieży skażonej chemicznie, promieniotwórczo lub materiałem zakaźnym nie wolno powierzyć Ci do prania (art. 237¹⁰ § 2 ${KP}).`,
    'pranie-soi': `Pranie, konserwację i odkażanie środków ochrony indywidualnej zapewnia pracodawca (art. 237⁹ § 2 ${KP}); pranie przez pracownika za ekwiwalent przepis przewiduje tylko dla odzieży roboczej (§ 3).`,
    'pranie-bez-ekw': `Gdy pracownik pierze odzież roboczą, bo pracodawca nie może zapewnić prania, pracodawca wypłaca ekwiwalent w wysokości kosztów poniesionych przez pracownika (art. 237⁹ § 3 ${KP}).`,
    'wlasna-pranie': 'Przepis nie rozstrzyga, czy obok ekwiwalentu za własną odzież należy się ekwiwalent za jej pranie. Rozporządzenie o składkach wymienia oba ekwiwalenty osobno (§ 2 ust. 1 pkt 6).',
    'agencja-ekwiwalent': 'Przepis nie mówi, czy ekwiwalent wypłaca agencja, czy pracodawca użytkownik.',
  };

  return { glowny, podstawa, wiersze, uwagi: w.uwagi.map((u) => UWAGI[u]) };
}
