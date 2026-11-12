// Normy wyposażenia pomieszczeń higienicznosanitarnych: załącznik nr 3 do rozporządzenia w sprawie ogólnych przepisów
// bezpieczeństwa i higieny pracy (t.j. Dz.U. 2003 poz. 1650; zmiany z 2007, 2011 i 2021 r. nie dotyczą § 19–28).
// § 19 ust. 1: umywalka na 10 pracowników najliczniejszej zmiany, przy pracach brudzących i z substancjami szkodliwymi
// lub zakaźnymi na 5; ust. 2: przy pracach biurowych na 30 mężczyzn albo 20 kobiet. § 22 ust. 1: kabina natryskowa na
// 8 pracowników przy pracach brudzących ciało, na 5 przy pracach z § 16 ust. 1. § 23 ust. 4: miska ustępowa przy
// natryskach na 10 natrysków. § 26 ust. 2: umywalka w przedsionku ustępu na 3 miski lub pisuary. § 28: na 30 mężczyzn
// na zmianie miska i pisuar, na 20 kobiet miska. Wszędzie „nie mniej niż jedna” przy mniejszej liczbie.
// Przepis mówi „na każdych N” i nie rozstrzyga, czy liczyć każdą rozpoczętą grupę, więc podajemy dwa warianty:
// minimum według pełnych grup i wariant ostrożny (każda rozpoczęta grupa).

export type RodzajPracy = 'zwykla' | 'brudzaca' | 'biurowa';
export type Natryski = 'brak' | 'brudzace-cialo' | 'przepustowa';

export interface Liczba {
  minimum: number;
  ostroznie: number;
}

/** Na każdych `n` osób co najmniej jedno urządzenie, nie mniej niż jedno, gdy ktokolwiek jest zatrudniony. */
export const naKazdych = (osoby: number, n: number): Liczba =>
  osoby <= 0 ? { minimum: 0, ostroznie: 0 } : { minimum: Math.max(1, Math.floor(osoby / n)), ostroznie: Math.ceil(osoby / n) };

const suma = (a: Liczba, b: Liczba): Liczba => ({ minimum: a.minimum + b.minimum, ostroznie: a.ostroznie + b.ostroznie });

export interface DaneSanitarne {
  kobiety: number;
  mezczyzni: number;
  praca: RodzajPracy;
  natryski: Natryski;
}

export function normySanitarne(d: DaneSanitarne) {
  for (const x of [d.kobiety, d.mezczyzni]) if (!(Number.isInteger(x) && x >= 0 && x <= 100_000)) throw new RangeError('Liczba osób: liczba całkowita od 0');
  const razem = d.kobiety + d.mezczyzni;
  if (razem === 0) throw new RangeError('Podaj liczbę pracowników');
  const umywalki =
    d.praca === 'biurowa' ? suma(naKazdych(d.mezczyzni, 30), naKazdych(d.kobiety, 20)) : naKazdych(razem, d.praca === 'brudzaca' ? 5 : 10);
  const miskiM = naKazdych(d.mezczyzni, 30);
  const miskiK = naKazdych(d.kobiety, 20);
  const miski = suma(miskiM, miskiK);
  const pisuary = naKazdych(d.mezczyzni, 30);
  const umywalkiPrzyUstepach = { minimum: Math.max(1, Math.floor((miski.minimum + pisuary.minimum) / 3)), ostroznie: Math.max(1, Math.ceil((miski.ostroznie + pisuary.ostroznie) / 3)) };
  const natryski = d.natryski === 'brak' ? { minimum: 0, ostroznie: 0 } : naKazdych(razem, d.natryski === 'przepustowa' ? 5 : 8);
  const miskiPrzyNatryskach = d.natryski === 'brak' ? { minimum: 0, ostroznie: 0 } : { minimum: Math.max(1, Math.floor(natryski.minimum / 10)), ostroznie: Math.max(1, Math.ceil(natryski.ostroznie / 10)) };
  return {
    razem,
    umywalki,
    miskiMezczyzni: miskiM,
    miskiKobiety: miskiK,
    pisuary,
    umywalkiPrzyUstepach,
    natryski,
    miskiPrzyNatryskach,
    /** § 29 ust. 1: jadalnia, gdy na zmianie pracuje ponad 20 osób. */
    jadalnia: razem > 20,
    /** § 39 ust. 1: miejsca do wypoczynku w pozycji leżącej dla kobiet w ciąży i karmiących, gdy na zmianie ponad 20 kobiet. */
    miejscaDlaKobietWCiazy: d.kobiety > 20 ? Math.max(1, Math.ceil(d.kobiety / 300)) : 0,
  };
}
