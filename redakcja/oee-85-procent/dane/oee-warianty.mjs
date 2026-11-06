// Przykład na danych fikcyjnych do artykułu „OEE 85%”: jedna zmiana, te same zdarzenia, trzy definicje OEE.
// Uruchom: node redakcja/oee-85-procent/dane/oee-warianty.mjs  (zapisuje wynik.json i drukuje tabelę)
// Sprawdzenie drugim sposobem: OEE = dostępność × wydajność × jakość musi równać się
// (dobre sztuki × cykl idealny) / czas planowany (czas w pełni produktywny / czas planowany).
import { writeFileSync } from 'node:fs';

const zmiana = {
  dlugoscMin: 480, // 8 godzin
  przerwaMin: 30, // przerwa
  konserwacjaPlanowanaMin: 30,
  przezbrojeniaMin: 50, // 2 przezbrojenia po 25 min
  awariaMin: 20,
  sztukiRazem: 520,
  sztukiDobre: 505,
};
const cykl = { nominalnyS: 30, standardowyS: 40 };

/** OEE dla wybranej definicji czasu planowanego i cyklu idealnego. */
function oee({ planowaneWylaczone, cyklIdealnyS }) {
  const czasPlanowany = zmiana.dlugoscMin - zmiana.przerwaMin - planowaneWylaczone;
  const czasPracy = zmiana.dlugoscMin - zmiana.przerwaMin - zmiana.konserwacjaPlanowanaMin - zmiana.przezbrojeniaMin - zmiana.awariaMin;
  const dostepnosc = czasPracy / czasPlanowany;
  const wydajnosc = (zmiana.sztukiRazem * cyklIdealnyS) / (czasPracy * 60);
  const jakosc = zmiana.sztukiDobre / zmiana.sztukiRazem;
  const wynik = dostepnosc * wydajnosc * jakosc;
  const kontrola = (zmiana.sztukiDobre * cyklIdealnyS) / (czasPlanowany * 60);
  if (Math.abs(wynik - kontrola) > 1e-12) throw new Error('Iloczyn składowych ≠ czas w pełni produktywny / czas planowany');
  return { czasPlanowany, czasPracy, dostepnosc, wydajnosc, jakosc, oee: wynik };
}

const warianty = [
  { nazwa: 'Przezbrojenia i konserwacja to strata, cykl nominalny maszyny (30 s)', ...oee({ planowaneWylaczone: 0, cyklIdealnyS: cykl.nominalnyS }) },
  { nazwa: 'Przezbrojenia i konserwacja wyłączone z czasu planowanego, cykl nominalny (30 s)', ...oee({ planowaneWylaczone: zmiana.przezbrojeniaMin + zmiana.konserwacjaPlanowanaMin, cyklIdealnyS: cykl.nominalnyS }) },
  { nazwa: 'Jak wyżej, ale cykl ze standardu planowania (40 s)', ...oee({ planowaneWylaczone: zmiana.przezbrojeniaMin + zmiana.konserwacjaPlanowanaMin, cyklIdealnyS: cykl.standardowyS }) },
];
/** Wariant 1 rozpisany na minuty: drzewo strat od czasu planowanego do czasu w pełni produktywnego. */
function minuty() {
  const czasPlanowany = zmiana.dlugoscMin - zmiana.przerwaMin;
  const postoje = { przezbrojenia: zmiana.przezbrojeniaMin, konserwacja: zmiana.konserwacjaPlanowanaMin, awaria: zmiana.awariaMin };
  const czasPracy = czasPlanowany - Object.values(postoje).reduce((a, b) => a + b, 0);
  const czasWTempieIdealnym = (zmiana.sztukiRazem * cykl.nominalnyS) / 60;
  const strataTempa = czasPracy - czasWTempieIdealnym;
  const strataJakosci = ((zmiana.sztukiRazem - zmiana.sztukiDobre) * cykl.nominalnyS) / 60;
  const wPelniProduktywny = czasWTempieIdealnym - strataJakosci;
  const udzial = wPelniProduktywny / czasPlanowany;
  if (Math.abs(udzial - warianty[0].oee) > 1e-12) throw new Error('Drzewo strat w minutach nie zgadza się z OEE wariantu 1');
  return { czasPlanowany, postoje, czasPracy, czasWTempieIdealnym, strataTempa, strataJakosci, wPelniProduktywny, udzial };
}
const drzewo = minuty();

const proc = (x) => `${(100 * x).toFixed(1).replace('.', ',')}%`;
for (const w of warianty) {
  console.log(`${w.nazwa}\n  czas planowany ${w.czasPlanowany} min, praca ${w.czasPracy} min | dostępność ${proc(w.dostepnosc)}, wydajność ${proc(w.wydajnosc)}, jakość ${proc(w.jakosc)} → OEE ${proc(w.oee)}`);
}
// Rachunki pomocnicze do tekstu.
const sztukiUtraconeNaTempie = (drzewo.strataTempa * 60) / cykl.nominalnyS; // 90 min w cyklu producenta
const trzyRazy90 = 0.9 ** 3;
const z60do85 = 0.85 / 0.6; // ile więcej sztuk przy tym samym czasie i tej samej definicji
// Andersson i Bellgran (2011): linia 118 szt./h przy cyklu idealnym 26 s (OEE 86%), po usprawnieniu 130 szt./h
// przy cyklu 22 s (OEE 79%). Ile wyszłoby OEE sprzed zmiany, gdyby liczyć je nowym cyklem 22 s?
const andersson = {
  przedStarymCyklem: (118 * 26) / 3600, // ok. 0,85 (autorzy: 86%)
  przedNowymCyklem: (118 * 22) / 3600, // ok. 0,72
  poNowymCyklem: (130 * 22) / 3600, // ok. 0,79 (autorzy: 79%)
};
// Przykład dla zarządu (dane fikcyjne): marża 8 zł na sztuce, dwie zmiany, 250 dni pracy w roku.
const zarzad = { marzaZl: 8, zmianNaDzien: 2, dniWRoku: 250 };
zarzad.zlNaZmiane = sztukiUtraconeNaTempie * zarzad.marzaZl;
zarzad.zlNaRok = zarzad.zlNaZmiane * zarzad.zmianNaDzien * zarzad.dniWRoku;
const pomocnicze = { sztukiUtraconeNaTempie, trzyRazy90, z60do85, andersson, zarzad };
console.log('Wariant 1 w minutach:', drzewo);
console.log('Rachunki pomocnicze:', pomocnicze);
writeFileSync(new URL('./wynik.json', import.meta.url), JSON.stringify({ zmiana, cykl, warianty, minutyWariantu1: drzewo, pomocnicze }, null, 2));
