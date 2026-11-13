// Roczne rozliczenie PIT-37 z danych z PIT-11 (ustawa o podatku dochodowym od osób fizycznych, t.j. Dz.U. 2026 poz. 592;
// art. 6, 22 ust. 2, 26 ust. 1, 27 ust. 1 i 27f brzmią tak samo w t.j. Dz.U. 2025 poz. 163, a zmiany po t.j. z 2026 r.
// ich nie dotyczą, więc za 2025 i 2026 r. liczymy tak samo):
// - dochód ze źródła = przychód minus koszty (art. 9 ust. 2); koszty z umowy o pracę w zeznaniu najwyżej 3000 zł za rok,
//   3600 zł przy dojeździe z innej miejscowości, a przy kilku umowach o pracę jednocześnie najwyżej 4500 albo 5400 zł
//   (art. 22 ust. 2 pkt 1–4); koszty większe niż przychód ze źródła ucinamy do przychodu (strat nie liczymy);
// - podstawa = dochód minus składki społeczne potrącone przez płatnika (art. 26 ust. 1 pkt 2 lit. b) i inne odliczenia od
//   dochodu z PIT/O wpisane przez użytkownika; podstawa i podatek należny zaokrąglone do pełnych złotych (art. 63 § 1
//   Ordynacji podatkowej, t.j. Dz.U. 2026 poz. 622);
// - skala (art. 27 ust. 1): do 120 000 zł 12% minus kwota zmniejszająca 3600 zł, powyżej 10 800 zł + 32% nadwyżki;
// - składka zdrowotna od 2022 r. nie zmniejsza podatku (uchylony art. 27b); liczy się tylko do zwrotu ulgi na dzieci
//   (art. 27f ust. 9 pkt 2);
// - wspólnie z małżonkiem (art. 6 ust. 2–3): wspólność majątkowa i małżeństwo przez cały rok albo od ślubu do końca roku;
//   każdy odlicza swoje kwoty od dochodu, podatek = dwukrotność podatku od połowy łącznej podstawy;
// - osoba samotnie wychowująca dziecko (art. 6 ust. 4c–4f): podatek = dwukrotność podatku od połowy podstawy;
// - ulga na dzieci od podatku według art. 27f (src/lib/narzedzia/ulga-na-dzieci.ts), zwrot niewykorzystanej części;
// - wynik: podatek należny minus zaliczki pobrane przez płatników (art. 45 ust. 4 pkt 1): nadpłata do zwrotu albo dopłata;
//   termin zeznania 15 lutego–30 kwietnia (art. 45 ust. 1), zwrot w 45 dniach od zeznania złożonego elektronicznie, 3
//   miesiącach od papierowego (art. 77 § 1 pkt 5 i 5a Ordynacji).
// Przyjęte: przy rozliczeniu osobno małżonków-rodziców Twoja część ulgi to wybrany procent, reszta jest małżonka; zwrot
// niewykorzystanej ulgi u obojga ograniczamy łączną sumą ich składek (art. 27f ust. 10), najpierw u Ciebie. Wspólne
// rozliczenie zakłada wspólne dzieci (cała ulga od wspólnego podatku). Nie liczymy dochodów spoza PIT-11 (działalność,
// najem, kapitały), ulg od podatku innych niż na dzieci, strat z lat ubiegłych ani rozliczenia z zagranicy.
import { doGrosza } from './dodatek-nocny';
import { zl } from './format';
import { ulgaNaDzieci, type Sytuacja, type WynikUlgi } from './ulga-na-dzieci';

export const PROG_SKALI = 120_000;
export const KWOTA_ZMNIEJSZAJACA = 3600;

/** Podatek według skali z art. 27 ust. 1 od podstawy (zł, z groszami). */
export function podatekSkala(podstawa: number): number {
  if (!(podstawa >= 0)) throw new RangeError('Podstawa nie może być ujemna');
  if (podstawa <= PROG_SKALI) return Math.max(0, doGrosza(podstawa * 0.12 - KWOTA_ZMNIEJSZAJACA));
  return doGrosza(10_800 + (podstawa - PROG_SKALI) * 0.32);
}

/** Zaokrąglenie do pełnych złotych z art. 63 § 1 Ordynacji podatkowej (od 50 groszy w górę). */
export const doZlotego = (x: number) => Math.floor(doGrosza(x) + 0.5);

export interface Pit11 {
  /** Przychód z umów o pracę (suma z PIT-11). */
  przychodPraca: number;
  /** Koszty uzyskania przychodów z umów o pracę (suma z PIT-11). */
  kosztyPraca: number;
  /** Przychód z umów zlecenia (suma z PIT-11). */
  przychodZlecenie?: number;
  /** Koszty z umów zlecenia (suma z PIT-11). */
  kosztyZlecenie?: number;
  /** Składki na ubezpieczenia społeczne odliczane od dochodu (suma z PIT-11). */
  skladki: number;
  /** Składka zdrowotna (suma z PIT-11): nie zmniejsza podatku, liczy się do zwrotu ulgi na dzieci. */
  zdrowotna?: number;
  /** Składki społeczne od przychodów zwolnionych (ulga dla młodych i inne z art. 21 ust. 1 pkt 148 i 152–154). */
  skladkiZwolnione?: number;
  /** Zaliczki pobrane przez płatników (suma z PIT-11). */
  zaliczki: number;
  /** Inne odliczenia od dochodu z PIT/O (np. internet, IKZE, darowizny), już w dopuszczalnej wysokości. */
  odliczenia?: number;
  /** Więcej niż jedna umowa o pracę w tym samym czasie (art. 22 ust. 2 pkt 2 i 4). */
  kilkaUmowNaraz?: boolean;
  /** Miejsce zamieszkania poza miejscowością zakładu pracy, bez dodatku za rozłąkę (art. 22 ust. 2 pkt 3 i 4). */
  dojazd?: boolean;
}

/** Roczny limit kosztów z umowy o pracę (art. 22 ust. 2 pkt 1–4). */
export const limitKosztowPracy = (kilkaNaraz = false, dojazd = false) => (kilkaNaraz ? (dojazd ? 5400 : 4500) : dojazd ? 3600 : 3000);

const POLA = ['przychodPraca', 'kosztyPraca', 'przychodZlecenie', 'kosztyZlecenie', 'skladki', 'zdrowotna', 'skladkiZwolnione', 'zaliczki', 'odliczenia'] as const;

export function dochodOsoby(o: Pit11) {
  for (const k of POLA) if (!((o[k] ?? 0) >= 0)) throw new RangeError(`${k} nie może być ujemne`);
  const limit = limitKosztowPracy(o.kilkaUmowNaraz, o.dojazd);
  const kosztyPraca = Math.min(o.kosztyPraca, limit, o.przychodPraca);
  const przychodZlecenie = o.przychodZlecenie ?? 0;
  const kosztyZlecenie = Math.min(o.kosztyZlecenie ?? 0, przychodZlecenie);
  const dochod = doGrosza(o.przychodPraca - kosztyPraca + przychodZlecenie - kosztyZlecenie);
  const skladki = Math.min(o.skladki, dochod);
  const odliczenia = Math.min(o.odliczenia ?? 0, doGrosza(dochod - skladki));
  return {
    kosztyPraca,
    kosztyUciete: o.kosztyPraca > kosztyPraca && o.przychodPraca > kosztyPraca,
    limitKosztow: limit,
    dochod,
    skladki,
    odliczenia,
    /** Dochód po odliczeniach, przed zaokrągleniem podstawy. */
    poOdliczeniach: doGrosza(dochod - skladki - odliczenia),
    /** Dochody do limitu ulgi na jedno dziecko (art. 27f ust. 2a): dochód minus składki społeczne. */
    dochodDoLimitu: doGrosza(dochod - skladki),
    /** Składki, do których wraca niewykorzystana ulga na dzieci (art. 27f ust. 9). */
    skladkiDoZwrotu: doGrosza(skladki + (o.zdrowotna ?? 0) + (o.skladkiZwolnione ?? 0)),
  };
}

export interface DanePit {
  rok: number;
  ty: Pit11;
  /** Dane małżonka: przy małżeństwie (cały rok albo od ślubu) do rozliczenia wspólnego i limitu ulgi. */
  malzonek?: Pit11;
  sytuacja: Sytuacja;
  /** Dzieci z ulgą, miesiące od–do. */
  dzieci: { od: number; do: number }[];
  /** Jedno dziecko z orzeczeniem o niepełnosprawności (bez limitu dochodów). */
  orzeczenie?: boolean;
  /** Twoja część ulgi na dzieci przy rozliczeniu osobno (procent); przy wspólnym cała ulga od wspólnego podatku. */
  czescUlgi: number;
}

export interface Rozliczenie {
  podstawa: number;
  podatek: number;
  ulga: WynikUlgi;
  nalezny: number;
  zaliczki: number;
  /** Nadpłata (zaliczki ponad podatek) plus zwrot niewykorzystanej ulgi na dzieci. */
  doZwrotu: number;
  doZaplaty: number;
}

/** Saldo: dodatnie = zwrot, ujemne = dopłata. */
export const saldo = (r: Rozliczenie) => doGrosza(r.doZwrotu - r.doZaplaty);

function rozlicz(podstawa: number, podatek: number, zaliczki: number, ulga: WynikUlgi): Rozliczenie {
  const nalezny = doZlotego(podatek - ulga.odliczenie);
  const roznica = doGrosza(zaliczki - nalezny);
  return { podstawa, podatek, ulga, nalezny, zaliczki, doZwrotu: doGrosza(Math.max(0, roznica) + ulga.zwrot), doZaplaty: Math.max(0, -roznica) };
}

const dwukrotnosc = (podstawa: number) => doGrosza(2 * podatekSkala(podstawa / 2));

export interface WynikPit {
  /** Twoje rozliczenie osobno (dla osoby samotnie wychowującej dziecko: z preferencją z art. 6 ust. 4c). */
  ty: Rozliczenie;
  /** Rozliczenie osobno małżonka, gdy podano jego dane. */
  malzonek: Rozliczenie | null;
  /** Rozliczenie wspólne małżonków (art. 6 ust. 2), gdy dozwolone i podano dane małżonka. */
  wspolnie: Rozliczenie | null;
  /** Ile rodzina zyskuje na rozliczeniu wspólnym w porównaniu z osobnym (zł, może być 0). */
  zyskWspolnego: number | null;
  /** Koszty z umowy o pracę ucięte do rocznego limitu. */
  kosztyUciete: { ty: boolean; malzonek: boolean; limitTy: number; limitMalzonek: number };
}

export function pitRoczny(d: DanePit): WynikPit {
  const malzenstwo = d.sytuacja === 'malzenstwo' || d.sytuacja === 'slub';
  const a = dochodOsoby(d.ty);
  const b = malzenstwo && d.malzonek ? dochodOsoby(d.malzonek) : null;
  // Limit ulgi przy jednym dziecku: małżeństwo przez cały rok — dochody obojga (art. 27f ust. 2 pkt 1 lit. a).
  const dochodLimitu = d.sytuacja === 'malzenstwo' ? doGrosza(a.dochodDoLimitu + (b?.dochodDoLimitu ?? 0)) : a.dochodDoLimitu;
  // Zwrot ulgi: małżonkowie przez cały rok liczą składki obojga (art. 27f ust. 10).
  const skladkiRodziny = d.sytuacja === 'malzenstwo' ? doGrosza(a.skladkiDoZwrotu + (b?.skladkiDoZwrotu ?? 0)) : a.skladkiDoZwrotu;
  const czesc = d.dzieci.length ? d.czescUlgi : 0;
  const ulga = (czescUlgi: number, podatek: number, skladki: number) =>
    ulgaNaDzieci({ dzieci: d.dzieci, sytuacja: d.sytuacja, dochod: dochodLimitu, orzeczenie: d.orzeczenie, czesc: czescUlgi, podatek, skladki });

  const podstawaTy = doZlotego(a.poOdliczeniach);
  // Preferencja z art. 6 ust. 4c wymaga dziecka: bez wpisanego dziecka liczymy zwykłą skalę.
  const podatekTy = d.sytuacja === 'samotny' && d.dzieci.length ? dwukrotnosc(podstawaTy) : podatekSkala(podstawaTy);
  const ulgaTy = ulga(czesc, podatekTy, skladkiRodziny);
  const ty = rozlicz(podstawaTy, podatekTy, d.ty.zaliczki, ulgaTy);

  let malzonek: Rozliczenie | null = null;
  let wspolnie: Rozliczenie | null = null;
  if (b && d.malzonek) {
    const podstawaM = doZlotego(b.poOdliczeniach);
    const podatekM = podatekSkala(podstawaM);
    const skladkiM = d.sytuacja === 'malzenstwo' ? doGrosza(skladkiRodziny - ulgaTy.zwrot) : b.skladkiDoZwrotu;
    malzonek = rozlicz(podstawaM, podatekM, d.malzonek.zaliczki, ulga(d.dzieci.length ? 100 - czesc : 0, podatekM, skladkiM));
    const podstawaW = doZlotego(a.poOdliczeniach + b.poOdliczeniach);
    const podatekW = dwukrotnosc(podstawaW);
    const skladkiW = doGrosza(a.skladkiDoZwrotu + b.skladkiDoZwrotu);
    wspolnie = rozlicz(podstawaW, podatekW, doGrosza(d.ty.zaliczki + d.malzonek.zaliczki), ulga(d.dzieci.length ? 100 : 0, podatekW, skladkiW));
  }
  const zyskWspolnego = wspolnie && malzonek ? doGrosza(saldo(wspolnie) - saldo(ty) - saldo(malzonek)) : null;
  return {
    ty,
    malzonek,
    wspolnie,
    zyskWspolnego,
    kosztyUciete: { ty: a.kosztyUciete, malzonek: !!b?.kosztyUciete, limitTy: a.limitKosztow, limitMalzonek: b?.limitKosztow ?? 0 },
  };
}

export interface OpisPit {
  wynik: string;
  opis: string;
  podstawa: string;
  podatek: string;
  ulga: string;
  nalezny: string;
  zaliczki: string;
  /** Porównanie z rozliczeniem wspólnym (pusty, gdy nie dotyczy). */
  porownanie: string;
  uwagi: string[];
}

const opisSalda = (s: number) => (s > 0 ? `Zwrot ${zl(s)}` : s < 0 ? `Dopłata ${zl(-s)}` : 'Bez zwrotu i dopłaty');

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. `wspolnie` wybiera rozliczenie wspólne do pokazania. */
export function opisPit(d: DanePit, wspolnieWybrane: boolean): OpisPit {
  const w = pitRoczny(d);
  const r = wspolnieWybrane && w.wspolnie ? w.wspolnie : w.ty;
  const s = saldo(r);
  const uwagi: string[] = [];
  const kto = r === w.wspolnie ? 'razem z małżonkiem' : 'Twoje';
  let opis = s > 0 ? `urząd skarbowy odda ${kto === 'Twoje' ? 'Ci' : 'Wam'} nadpłatę` : s < 0 ? `do zapłaty do 30 kwietnia ${d.rok + 1} r.` : 'zaliczki były równe podatkowi';
  if (r.ulga.zwrot > 0) opis += `, w tym ${zl(r.ulga.zwrot)} niewykorzystanej ulgi na dzieci`;
  let porownanie = '';
  if (w.wspolnie && w.malzonek && w.zyskWspolnego !== null) {
    const osobno = doGrosza(saldo(w.ty) + saldo(w.malzonek));
    const zysk = w.zyskWspolnego;
    porownanie = `Osobno: Ty ${opisSalda(saldo(w.ty)).toLowerCase()}, małżonek ${opisSalda(saldo(w.malzonek)).toLowerCase()}, razem ${zl(osobno)}. Wspólnie: ${opisSalda(saldo(w.wspolnie)).toLowerCase()}. ${
      zysk > 0 ? `Rozliczenie wspólne daje rodzinie ${zl(zysk)} więcej.` : zysk < 0 ? `Rozliczenie osobno daje rodzinie ${zl(-zysk)} więcej.` : 'Oba sposoby dają tyle samo.'
    }`;
  } else if ((d.sytuacja === 'malzenstwo' || d.sytuacja === 'slub') && !d.malzonek) {
    porownanie = 'Wpisz dane małżonka z jego PIT-11, a porównamy rozliczenie osobno i wspólne.';
  }
  if (w.kosztyUciete.ty) uwagi.push(`Koszty z umowy o pracę w zeznaniu nie mogą przekroczyć ${zl(w.kosztyUciete.limitTy)} za rok, więc liczymy tyle (art. 22 ust. 2).`);
  if (w.kosztyUciete.malzonek) uwagi.push(`Koszty małżonka z umowy o pracę ucięliśmy do limitu ${zl(w.kosztyUciete.limitMalzonek)} (art. 22 ust. 2).`);
  if (d.sytuacja === 'samotny' && !d.dzieci.length) uwagi.push('Dodaj dziecko: bez niego nie liczymy preferencji dla osoby samotnie wychowującej dziecko.');
  if (d.sytuacja === 'samotny' && d.dzieci.length && r === w.ty) uwagi.push('Jako osoba samotnie wychowująca dziecko płacisz dwukrotność podatku od połowy dochodu (art. 6 ust. 4c–4d).');
  if (r.ulga.ponadLimit && r.ulga.limit !== null) uwagi.push(`Ulga na jedno dziecko nie przysługuje: dochody przekraczają ${zl(r.ulga.limit)} (art. 27f ust. 2 pkt 1).`);
  if (r.ulga.przepada > 0) uwagi.push(`${zl(r.ulga.przepada)} ulgi na dzieci przepada: zwrot nie może przekroczyć sumy składek (art. 27f ust. 9).`);
  if (r.podstawa > PROG_SKALI || (r === w.wspolnie && r.podstawa / 2 > PROG_SKALI)) uwagi.push('Część dochodu jest powyżej progu 120 000 zł i ma podatek 32%.');
  return {
    wynik: opisSalda(s),
    opis,
    podstawa: zl(r.podstawa),
    podatek: zl(r.podatek),
    ulga: zl(r.ulga.odliczenie),
    nalezny: zl(r.nalezny),
    zaliczki: zl(r.zaliczki),
    porownanie,
    uwagi,
  };
}
