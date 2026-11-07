// Karta definicji OEE (materiał do pobrania do artykułu „oee-85-procent”): dwie strony A4.
// Strona 1: osiem decyzji z ustawieniem startowym i polem na decyzję zakładu.
// Strona 2: zmiana rozpisana na minuty (przykład na danych fikcyjnych z dane/wynik.json i pusta kolumna),
// rachunek dla zarządu, cel w minutach, rejestr zmian karty.
// Uruchom z katalogu projektu: node redakcja/oee-85-procent/karta/karta.mjs
// Wynik: public/pobierz/karta-definicji-oee.pdf oraz podglądy src/assets/materialy/karta-definicji-oee-{1,2}.png.
// Kontrola: generator zatrzymuje się, gdy treść nachodzi na stopkę albo font się nie wczyta.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { typografia } from '../../../src/lib/typografia.mjs';
import { CACHE, ZRODLA, zrodlo } from '../../../scripts/fonty/zrodla.mjs';

const KORZEN = fileURLToPath(new URL('../../../', import.meta.url));
const dane = JSON.parse(readFileSync(new URL('../dane/wynik.json', import.meta.url), 'utf8'));
const logo = readFileSync(`${KORZEN}src/assets/logo/rytm-hali-jasne.svg`, 'utf8').replace(/<title>.*?<\/title>/, '');
// Pełne fonty źródłowe (sprawdzane sumą SHA-256), a nie podzbiór serwisu: podzbiór nie ma znaku minus (U+2212),
// którego używa tabela minut. Chrome i tak osadza w PDF tylko użyte znaki.
for (const nazwa of ['sans', 'display']) await zrodlo(nazwa);
const font = (nazwa) => pathToFileURL(`${CACHE}${ZRODLA[nazwa].sciezka.split('/').at(-1)}`).href;

// Znak działania łączy się twardą spacją z tym, co po nim, żeby nie zostawał sam na końcu wiersza.
const t = (s) => typografia(s).replace(/ ([×÷=+]) /g, ' $1\u00a0').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const liczba = (x, miejsca = 0) => x.toLocaleString('pl-PL', { minimumFractionDigits: miejsca, maximumFractionDigits: miejsca });

// Przykład: arkusz inżyniera (wariant 1), te same liczby co w artykule.
const z = dane.zmiana;
const m = dane.minutyWariantu1;
const p = dane.pomocnicze;
const przyklad = {
  planowany: m.czasPlanowany,
  przezbrojenia: z.przezbrojeniaMin,
  konserwacja: z.konserwacjaPlanowanaMin,
  awaria: z.awariaMin,
  praca: m.czasPracy,
  tempo: m.strataTempa,
  braki: m.strataJakosci,
  produktywna: m.wPelniProduktywny,
  oee: 100 * m.udzial,
};
if (Math.abs(przyklad.planowany - przyklad.przezbrojenia - przyklad.konserwacja - przyklad.awaria - przyklad.praca) > 1e-9) throw new Error('Minuty się nie sumują');
if (Math.abs(przyklad.praca - przyklad.tempo - przyklad.braki - przyklad.produktywna) > 1e-9) throw new Error('Minuty pracy się nie sumują');

const DECYZJE = [
  ['Czas planowany', 'Długość zmiany minus przerwy. Czas bez zleceń poza czasem planowanym, a w raporcie osobno, w godzinach.'],
  ['Przezbrojenia', 'Strata dostępności, razem z wymianą oprzyrządowania pod nowy wyrób, regulacją i brakami przy tej regulacji. Wymiana zużytego narzędzia w trakcie serii: osobny kod.'],
  ['Konserwacja planowa, sprzątanie, odprawy', 'W stratach, jeśli chcesz je skracać. Każde zdarzenie z osobnym kodem.'],
  ['Brak operatora i materiału', 'Przestój z osobnym kodem przyczyny, oddzielnie od awarii. Czekanie maszyny na operatora, który obsługuje drugą maszynę, też tak.'],
  ['Cykl idealny', 'Cykl producenta albo czas z programu CNC, osobno dla każdego wyrobu. Gdy maszyna jest szybsza: najkrótszy powtarzalny cykl z kilkunastu kolejnych sztuk. Nie norma z ERP z zapasem czasu.'],
  ['Dobra sztuka', 'Tylko dobra za pierwszym razem. Przeróbka to strata jakości, tak jak brak.'],
  ['Próg krótkiego zatrzymania', 'Na przykład 2 minuty: dłuższe zatrzymanie dostaje przyczynę i jest przestojem, krótsze obniża tylko wydajność.'],
  ['Źródło danych', 'Zapisz, czy liczy licznik i czujnik, czy ręczny zapis. Wyniku z ręcznego zapisu nie porównuj z danymi z czujników.'],
];

const WIERSZE_MINUT = [
  ['Czas planowany', 'Według karty, decyzja 1', liczba(przyklad.planowany), 'gruby'],
  ['Przezbrojenia', 'Rejestr przestojów', `−${liczba(przyklad.przezbrojenia)}`],
  ['Konserwacja planowa', 'Rejestr przestojów', `−${liczba(przyklad.konserwacja)}`],
  ['Awarie', 'Rejestr przestojów', `−${liczba(przyklad.awaria)}`],
  ['Brak operatora i materiału', 'Rejestr przestojów, osobny kod', '0'],
  ['Praca maszyny', 'Czas planowany minus postoje', liczba(przyklad.praca), 'gruby'],
  ['Wolniejsze tempo i krótkie zatrzymania', 'Praca maszyny minus (wszystkie sztuki × cykl idealny)', `−${liczba(przyklad.tempo)}`],
  ['Braki i przeróbki', 'Złe sztuki × cykl idealny', `−${liczba(przyklad.braki, 1)}`],
  ['Praca w pełni produktywna', 'Dobre sztuki × cykl idealny', liczba(przyklad.produktywna, 1), 'gruby'],
  ['OEE', 'Praca w pełni produktywna ÷ czas planowany', `${liczba(przyklad.oee, 1)}%`, 'gruby'],
];

const stopka = (nr) => `<footer class="stopka"><span>${t('Rytm Hali · Karta definicji OEE · wersja 1, listopad 2026')}</span><span>rytmhali.pl/do-pobrania/karta-definicji-oee</span><span>${nr} / 2</span></footer>`;

const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>Karta definicji OEE</title>
<style>
@font-face { font-family: "Noto Sans"; font-weight: 400 700; src: url("${font('sans')}") format("truetype"); }
@font-face { font-family: "Noto Sans Display"; font-weight: 100 900; src: url("${font('display')}") format("truetype"); }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: "Noto Sans", Arial, sans-serif; color: #2c3440; font-size: 9.3pt; line-height: 1.36; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.strona { width: 210mm; height: 297mm; padding: 12mm 14mm 17mm; position: relative; page-break-after: always; overflow: hidden; }
.strona:last-child { page-break-after: auto; }
.naglowek { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5pt solid #1d2530; padding-bottom: 4mm; }
.naglowek svg { height: 10mm; width: auto; }
.etykieta { font-size: 8pt; color: #58626f; text-transform: uppercase; letter-spacing: 0.05em; }
.dach { display: block; width: 14mm; height: 3mm; background: #e8590c; clip-path: polygon(0 0, 33.33% 100%, 33.33% 0, 66.66% 100%, 66.66% 0, 100% 100%, 0 100%); margin: 5mm 0 0; }
h1 { font-family: "Noto Sans Display", Arial, sans-serif; font-size: 21pt; line-height: 1.1; margin: 2.5mm 0 1.5mm; color: #1d2530; }
h2 { font-family: "Noto Sans Display", Arial, sans-serif; font-size: 13pt; line-height: 1.2; margin: 5mm 0 2mm; color: #1d2530; }
h2.pierwszy { margin-top: 6mm; }
.lead { font-size: 10pt; margin: 0 0 2.5mm; color: #2c3440; }
.pola { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5mm 6mm; margin: 0 0 4mm; }
.pole { border-bottom: 0.8pt solid #58626f; padding: 5mm 0 1mm; font-size: 8pt; color: #58626f; text-transform: uppercase; letter-spacing: 0.04em; position: relative; }
.pole span { position: absolute; top: 0; left: 0; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.04em; color: #1d2530; border-bottom: 1.6pt solid #1d2530; padding: 1.5mm 2mm; }
td { border-bottom: 0.6pt solid #c9cfd6; padding: 1.4mm 2mm; vertical-align: top; }
.decyzje td.nr { width: 7mm; font-family: "Noto Sans Display", Arial, sans-serif; color: #c2410c; font-size: 12pt; padding-top: 0.9mm; }
.decyzje td.nazwa { width: 43mm; font-weight: 700; color: #1d2530; }
.decyzje td.start { width: 86mm; }
.decyzje td.nasza { background: #f2f4f6; border-left: 0.6pt solid #c9cfd6; }
.wzor { margin-top: 4mm; border-left: 3pt solid #e8590c; background: #f2f4f6; padding: 2.5mm 4mm; }
.wzor b { color: #1d2530; }
.zasady { margin: 3mm 0 0; padding-left: 4.5mm; }
.zasady li { margin: 0 0 0.8mm; }
.minuty td.liczba, .minuty th.liczba { text-align: right; white-space: nowrap; }
.minuty td.twoja { background: #f2f4f6; width: 28mm; border-left: 0.6pt solid #c9cfd6; }
.minuty tr.gruby td { font-weight: 700; color: #1d2530; }
.minuty tr.gruby td.jak { font-weight: 400; color: #58626f; }
.minuty td.jak { color: #58626f; font-size: 8.8pt; }
.dwie { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 5mm; }
.ramka { border: 0.8pt solid #c9cfd6; padding: 3mm 4mm; }
.ramka h3 { font-family: "Noto Sans Display", Arial, sans-serif; font-size: 11pt; margin: 0 0 1.5mm; color: #1d2530; }
.ramka p { margin: 0 0 1.5mm; }
.przyklad { color: #58626f; font-size: 8.8pt; }
.rejestr td { height: 8.5mm; }
.adres { white-space: nowrap; }
.rejestr .data { width: 24mm; }
.rejestr .kto { width: 38mm; }
.rejestr .od { width: 34mm; }
.uwaga { font-size: 8.2pt; color: #58626f; margin: 2.5mm 0 0; }
.wstep { margin: 0 0 2.5mm; }
.stopka { position: absolute; left: 14mm; right: 14mm; bottom: 8mm; display: flex; justify-content: space-between; font-size: 7.6pt; color: #58626f; border-top: 0.6pt solid #c9cfd6; padding-top: 2mm; }
</style></head><body>

<section class="strona">
  <div class="naglowek">${logo}<span class="etykieta">Do pobrania · Produkcja</span></div>
  <span class="dach"></span>
  <h1>${t('Karta definicji OEE')}</h1>
  <p class="lead">${t('Osiem decyzji, które ustalają, co naprawdę mierzy Twój wynik OEE. Spisz je dla każdej maszyny albo linii, zanim porównasz wynik z 85%, z innym zakładem albo z własną historią. Przy każdej decyzji podajemy ustawienie, od którego warto zacząć.')}</p>
  <div class="pola">
    <div class="pole"><span>Maszyna albo linia</span></div>
    <div class="pole"><span>Wyroby (indeksy)</span></div>
    <div class="pole"><span>Wersja karty i data</span></div>
    <div class="pole"><span>${t('Zatwierdził (osoba nierozliczana z OEE)')}</span></div>
  </div>
  <table class="decyzje">
    <thead><tr><th></th><th>Decyzja</th><th>Ustawienie startowe</th><th>Nasza decyzja</th></tr></thead>
    <tbody>
      ${DECYZJE.map(([nazwa, start], i) => `<tr><td class="nr">${i + 1}</td><td class="nazwa">${t(nazwa)}</td><td class="start">${t(start)}</td><td class="nasza"></td></tr>`).join('\n      ')}
    </tbody>
  </table>
  <div class="wzor"><b>${t('Wzór:')}</b> ${t('OEE = dobre sztuki × cykl idealny ÷ czas planowany. To samo daje iloczyn dostępności, wydajności (tempa) i jakości.')}</div>
  <ol class="zasady">
    <li>${t('Policz ostatni miesiąc w dwóch albo trzech wariantach i wybierz ten, który pokazuje straty, nawet jeśli daje niższą liczbę.')}</li>
    <li>${t('Kartę zatwierdza osoba, której nie rozlicza się z OEE, na przykład kontroling. Jeśli od OEE zależą premie, ustal to z kadrami przed zmianą karty.')}</li>
    <li>${t('Każdą zmianę definicji zapisz z datą (strona 2) i przelicz według niej co najmniej poprzedni kwartał. Kartę dołączaj do każdego raportu z OEE.')}</li>
  </ol>
  <p class="uwaga">${t('Uzasadnienie każdej decyzji i źródła: artykuł „Ta sama zmiana może mieć 56 albo 91% OEE, zależnie od tego, kto liczy”,')} <span class="adres">rytmhali.pl/oee-85-procent</span>. ${t('Kartę możesz kopiować i używać w zakładzie.')}</p>
  ${stopka(1)}
</section>

<section class="strona">
  <div class="naglowek">${logo}<span class="etykieta">Karta definicji OEE · strona 2</span></div>
  <h2 class="pierwszy">${t('Jedna zmiana rozpisana na minuty')}</h2>
  <p class="wstep">${t('Wystarczy rejestr przestojów z czasem i przyczyną, licznik sztuk dobrych i złych oraz cykl idealny z karty. Kolumna „Przykład” to dane fikcyjne z artykułu: zmiana 8 godzin, przerwa 30 minut, 520 sztuk, z czego 505 dobrych, cykl producenta 30 sekund.')}</p>
  <table class="minuty">
    <thead><tr><th>Pozycja</th><th>Jak policzyć</th><th class="liczba">Przykład, min</th><th class="liczba">Twoja zmiana, min</th></tr></thead>
    <tbody>
      ${WIERSZE_MINUT.map(([poz, jak, prz, styl]) => `<tr class="${styl ?? ''}"><td>${t(poz)}</td><td class="jak">${t(jak)}</td><td class="liczba">${prz}</td><td class="twoja"></td></tr>`).join('\n      ')}
    </tbody>
  </table>
  <div class="dwie">
    <div class="ramka">
      <h3>${t('Kwota dla zarządu')}</h3>
      <p>${t('Minuty straty ÷ cykl idealny = utracone sztuki. Utracone sztuki × marża pokrycia (cena minus koszty zmienne) = kwota.')}</p>
      <p>${t('Liczy się tylko na wąskim gardle i przy zamówieniach na te sztuki. To górna granica, bo całej straty zwykle nie odzyskasz od razu.')}</p>
      <p class="przyklad">${t(`Przykład (dane fikcyjne): ${liczba(przyklad.tempo)} min ÷ ${liczba(dane.cykl.nominalnyS)} s = ${liczba(p.sztukiUtraconeNaTempie)} sztuk; × ${liczba(p.zarzad.marzaZl)} zł = ${liczba(p.zarzad.zlNaZmiane)} zł na zmianę, przy dwóch zmianach przez 250 dni ${liczba(p.zarzad.zlNaRok / 1000)} tys. zł rocznie.`)}</p>
    </div>
    <div class="ramka">
      <h3>${t('Cel w minutach, nie w procentach')}</h3>
      <p>${t('Zapisz cel jako minuty jednej straty, na przykład: przezbrojenia z 50 do 35 minut na zmianę do marca.')}</p>
      <p>${t('Gdy zarząd zapyta o procent: (praca maszyny + odzyskane minuty) ÷ czas planowany × wydajność × jakość.')}</p>
      <p class="przyklad">${t(`Przykład (dane fikcyjne): 15 minut krótsze przezbrojenia to około ${liczba(p.cel.punkty, 1)} punktu OEE, z ${liczba(100 * p.cel.oeePrzed, 1)} do ${liczba(100 * p.cel.oeePo, 1)}%.`)}</p>
    </div>
  </div>
  <h2>${t('Rejestr zmian karty')}</h2>
  <table class="rejestr">
    <thead><tr><th class="data">Data</th><th>Co zmieniono i dlaczego</th><th class="kto">Zatwierdził</th><th class="od">${t('Historię przeliczono od')}</th></tr></thead>
    <tbody>${'<tr><td></td><td></td><td></td><td></td></tr>'.repeat(5)}</tbody>
  </table>
  ${stopka(2)}
</section>
</body></html>`;

// Plik roboczy z adresami file:// do fontów: tylko lokalnie, poza gitem.
const roboczy = `${KORZEN}.cache/karta-definicji-oee.html`;
mkdirSync(`${KORZEN}.cache`, { recursive: true });
writeFileSync(roboczy, html);
mkdirSync(`${KORZEN}public/pobierz`, { recursive: true });
mkdirSync(`${KORZEN}src/assets/materialy`, { recursive: true });

const przegladarka = await chromium.launch();
const strona = await przegladarka.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
await strona.goto(pathToFileURL(roboczy).href, { waitUntil: 'networkidle' });
await strona.evaluate(() => document.fonts.ready);
const brakFontu = await strona.evaluate(() => [...document.fonts].filter((f) => f.status !== 'loaded').map((f) => f.family));
if (brakFontu.length) throw new Error(`Fonty się nie wczytały: ${brakFontu.join(', ')}`);
await strona.emulateMedia({ media: 'print' });
const kolizje = await strona.evaluate(() =>
  [...document.querySelectorAll('section.strona')].flatMap((sekcja, i) => {
    const stopkaGora = sekcja.querySelector('.stopka').getBoundingClientRect().top;
    return [...sekcja.children]
      .filter((el) => !el.matches('.stopka'))
      .map((el) => ({ el: el.className || el.tagName, dol: el.getBoundingClientRect().bottom }))
      .filter((x) => x.dol > stopkaGora - 3)
      .map((x) => `strona ${i + 1}: ${x.el} kończy się ${Math.round(x.dol - stopkaGora + 3)} px za nisko`);
  }),
);
if (kolizje.length) throw new Error(`Treść nachodzi na stopkę:\n${kolizje.join('\n')}`);
const zapas = await strona.evaluate(() =>
  [...document.querySelectorAll('section.strona')].map((sekcja) => {
    const stopkaGora = sekcja.querySelector('.stopka').getBoundingClientRect().top;
    const dol = Math.max(...[...sekcja.children].filter((el) => !el.matches('.stopka')).map((el) => el.getBoundingClientRect().bottom));
    return Math.round(((stopkaGora - dol) * 25.4) / 96);
  }),
);
console.log(`wolne miejsce nad stopką: ${zapas.map((z, i) => `strona ${i + 1}: ${z} mm`).join(', ')}`);
const plik = `${KORZEN}public/pobierz/karta-definicji-oee.pdf`;
await strona.pdf({ path: plik, format: 'A4', printBackground: true, preferCSSPageSize: true });
// Podglądy: górna część każdej strony w proporcji 16:10 (tak je kadruje strona materiału).
const strony = await strona.$$('section.strona');
for (const [i, el] of strony.entries()) {
  const box = await el.boundingBox();
  await strona.screenshot({ path: `${KORZEN}src/assets/materialy/karta-definicji-oee-${i + 1}.png`, fullPage: true, clip: { x: box.x, y: box.y, width: box.width, height: Math.round((box.width * 10) / 16) } });
}
await przegladarka.close();
console.log(`zapisano ${plik.replace(KORZEN, '')} i ${strony.length} podglądy`);
