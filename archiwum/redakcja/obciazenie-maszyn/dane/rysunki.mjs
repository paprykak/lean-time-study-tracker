// Rysunki do artykułu „obciazenie-maszyn” (generator: redakcja/wspolne/wykresy.mjs).
import { readFileSync } from 'node:fs';
import { linia, slupki, macierz, kartogram, drzewo, pl } from '../../wspolne/wykresy.mjs';
const R = (n) => new URL(`../../../src/assets/rysunki/obciazenie-maszyn-${n}.svg`, import.meta.url);
const m = JSON.parse(readFileSync(new URL('./wyniki.json', import.meta.url), 'utf8'));
const proc = (v) => pl(v) + '%';
const proc1 = (v) => pl(v, 1) + '%';

// 1. Krzywe kolejki (wzór Kingmana, sprawdzony symulacją)
const kr = (k) => m.krzywe[k].filter(([u]) => u <= 0.97).map(([u, w]) => [u * 100, Math.min(w, 21)]);
console.log(linia({ plik: R(1), tytul: 'Czas czekania w kolejce, w wielokrotnościach czasu obróbki zlecenia',
  x: { min: 30, max: 100, etykiety: [[30, '30%'], [50, '50%'], [70, '70%'], [80, '80%'], [90, '90%'], [100, '100%']], opis: 'obciążenie stanowiska' },
  y: { min: 0, max: 20, krok: 5, format: (v) => pl(v) + '×' },
  serie: [{ nazwa: 'zmienność wysoka (c² = 1)', punkty: kr('wysoka') }, { nazwa: 'średnia (c² = 0,5)', punkty: kr('srednia'), kolor: '#1d2530' }, { nazwa: 'niska (c² = 0,25)', punkty: kr('niska'), kolor: '#5b6573', kreska: '7 5' }],
  pionowe: [{ x: 80, tekst: '80%: 4×', lewo: true, dy: 40 }, { x: 95, tekst: '95%: 19×', lewo: true, dy: 0 }] }));

// 2. Przykład wąskiego gardła (dane fikcyjne): czas przejścia przy rosnącym obciążeniu
const p = m.przyklad;
console.log(slupki({ plik: R(2), tytul: 'Czas przejścia zlecenia przez frezarkę (czekanie + obróbka 30 min), dane fikcyjne',
  serie: [{ nazwa: 'czas przejścia' }],
  wiersze: ['0.75', '0.8', '0.85', '0.9', '0.95'].map((u) => ({ etykieta: `obciążenie ${pl(u * 100)}% · ${pl(p[u].zlecen_na_8h, 1)} zlecenia na zmianę`, wartosci: [p[u].czas_przejscia_min / 60] })),
  format: (v) => pl(v, 1) + ' h', formatOsi: (v) => pl(v) + ' h', krok: 2, max: 10 }));

// 3. Macierz obciążenie × zmienność
console.log(macierz({ plik: R(3), tytul: 'Gdzie kolejki rosną najszybciej',
  osX: { nazwa: 'obciążenie', nisko: 'poniżej 80%', wysoko: 'powyżej 85%' }, osY: { nazwa: 'zmienność', nisko: 'niska', wysoko: 'wysoka' },
  cwiartki: [
    { tytul: 'Kolejki z chaosu', tekst: 'Maszyna ma luz, a i tak tworzą się zatory. Wyrównaj napływ i czasy obróbki.' },
    { tytul: 'Strefa kolejek', tekst: 'Każdy punkt obciążenia kosztuje godziny. Najpierw zmniejsz zmienność.', akcent: true },
    { tytul: 'Zapas mocy', tekst: 'Tu możesz dokładać zlecenia bez ryzyka dla terminów.' },
    { tytul: 'Pełno, ale płynnie', tekst: 'Wysokie obciążenie działa, dopóki zmienność jest niska. Pilnuj jej.' },
  ] }));

// 4. Mapa: wykorzystanie mocy produkcyjnych w przetwórstwie, IV kw. 2026 (Eurostat)
const e = JSON.parse(readFileSync(new URL('./eurostat-ei_bsin_q_r2.json', import.meta.url), 'utf8'));
const geo = e.dimension.geo.category, czas = e.dimension.time.category;
const gi = Object.fromEntries(Object.entries(geo.index).map(([k, v]) => [v, k])), ti = Object.fromEntries(Object.entries(czas.index).map(([k, v]) => [v, k]));
const nt = Object.keys(ti).length, ser = {};
for (const [k, v] of Object.entries(e.value)) { const g = gi[Math.floor(k / nt)], t = ti[k % nt]; (ser[g] ??= {})[t] = v; }
const iso = (g) => ({ EL: 'GR', UK: 'GB' }[g] ?? g);
const ost = '2026-Q4', wart = {};
for (const [g, s] of Object.entries(ser)) if (s[ost] != null && g.length === 2) wart[iso(g)] = s[ost];
const mapa = JSON.parse(readFileSync(new URL('../../wspolne/mapy/europa-50m.geojson', import.meta.url), 'utf8'));
console.log(kartogram({ plik: R(4), tytul: 'Wykorzystanie mocy produkcyjnych w przetwórstwie przemysłowym, IV kwartał 2026, %', geojson: mapa, id: (f) => f.properties.iso2,
  wartosci: wart, obszar: [-11, 35, 34, 70.5], progi: [70, 74, 77, 80, 83], format: (v) => pl(v),
  podpisy: [{ klucz: 'PL', tekst: proc1(wart.PL) }, { klucz: 'DE', tekst: proc1(wart.DE) }, { klucz: 'FR', tekst: proc1(wart.FR), dx: 10, dy: 10 }, { klucz: 'ES', tekst: proc1(wart.ES) }, { klucz: 'IT', tekst: proc1(wart.IT), dx: 8, dy: 12 }, { klucz: 'SE', tekst: proc1(wart.SE), dx: -16, dy: 14 }],
  legenda: 'Wykorzystanie mocy (%), średnia UE: ' + proc1(ser.EU27_2020[ost]) }));

// 5. Polska i UE, 2000–2026
const kw = Object.keys(ser.PL).sort();
const t2x = (t) => Number(t.slice(0, 4)) + (Number(t.slice(-1)) - 1) / 4;
console.log(linia({ plik: R(5), tytul: 'Wykorzystanie mocy produkcyjnych w przetwórstwie, % (dane wyrównane sezonowo)',
  x: { min: 2000, max: 2027, etykiety: [[2000, '2000'], [2008, '2008'], [2016, '2016'], [2027, '2026']] },
  y: { min: 60, max: 90, krok: 5, format: (v) => pl(v) + '%' },
  serie: [{ nazwa: 'Polska', punkty: kw.map((t) => [t2x(t), ser.PL[t]]), grubosc: 2.5 },
    { nazwa: 'Unia Europejska', punkty: Object.keys(ser.EU27_2020).sort().map((t) => [t2x(t), ser.EU27_2020[t]]), kolor: '#5b6573', grubosc: 2 }],
  poziome: [{ y: 85, tekst: '85%', prawo: false }] }));

// 6. Drzewo decyzji: dokładać zlecenia na wąskie gardło?
console.log(drzewo({ plik: R(6), tytul: 'Czy dołożyć zlecenia na wąskie gardło (reguła redakcji na podstawie modelu kolejki)',
  pytania: [
    { pytanie: 'Po dołożeniu obciążenie zostaje poniżej 80%?', tak: 'Dokładaj. Kolejka rośnie wolno.' },
    { pytanie: 'Czasy obróbki i odstępy między zleceniami są równe (c poniżej 0,5)?', tak: 'Możesz dojść do 90%, ale mierz kolejkę co tydzień.' },
    { pytanie: 'Da się w tym miesiącu skrócić przezbrojenia albo wyrównać napływ zleceń?', tak: 'Najpierw zmniejsz zmienność, potem dokładaj.' },
  ], koniec: 'Nie dokładaj. Podaj klientowi dłuższy termin albo przenieś zlecenie na inną maszynę.' }));
console.log('PL', ost, ser.PL[ost], 'UE', ser.EU27_2020[ost], 'min PL', Math.min(...Object.values(ser.PL)), Object.entries(ser.PL).sort((a, b) => a[1] - b[1]).slice(0, 3), 'max', Object.entries(ser.PL).sort((a, b) => b[1] - a[1]).slice(0, 3), 'kraje', Object.keys(wart).length);
