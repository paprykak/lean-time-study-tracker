// Rysunki do artykułu „karta-kontrolna” (generator: redakcja/wspolne/wykresy.mjs i schemat.mjs).
import { readFileSync } from 'node:fs';
import { panele, slupki, linia, mapaCieplna, drzewo, SKALA, pl } from '../../wspolne/wykresy.mjs';
import { schemat } from '../../wspolne/schemat.mjs';
const R = (n) => new URL(`../../../src/assets/rysunki/karta-kontrolna-${n}.svg`, import.meta.url);
const m = JSON.parse(readFileSync(new URL('./wyniki.json', import.meta.url), 'utf8'));
const p = JSON.parse(readFileSync(new URL('./przyklad.json', import.meta.url), 'utf8'));

// 1. Lejek: 100 sztuk przy każdej regule (odchyłka od nominału w σ)
const nazwy = { 1: 'Reguła 1: nie ruszaj nastaw', 2: 'Reguła 2: koryguj o ostatnią odchyłkę', 3: 'Reguła 3: ustaw naprzeciw ostatniego wyniku', 4: 'Reguła 4: ustaw na ostatni wynik' };
console.log(panele({ plik: R(1), tytul: 'Odchyłka wymiaru od nominału w kolejnych 100 sztukach, w odchyleniach standardowych procesu',
  panele: [1, 2, 3, 4].map((k) => ({ tytul: nazwy[k], punkty: m.lejek_przyklad[k].map((v, i) => [i + 1, v]), akcent: k > 1 })),
  x: { min: 1, max: 100, opis: 'kolejne sztuki' }, y: { min: -8, max: 8 }, format: (v) => (v > 0 ? '+' : '') + pl(v) + 'σ' }));

// 2. Rozrzut po 50 i 200 sztukach
console.log(slupki({ plik: R(2), tytul: 'Odchylenie standardowe wymiaru (w σ procesu), średnio z 2\u00a0000 symulacji',
  serie: [{ nazwa: 'po 50 sztukach', kolor: '#5b6573' }, { nazwa: 'po 200 sztukach', kolor: '#c2410c' }],
  wiersze: [1, 2, 3, 4].map((k) => ({ etykieta: nazwy[k], wartosci: [m.lejek_sd[`${k}_50`], m.lejek_sd[`${k}_200`]] })),
  format: (v) => pl(v, 2) + 'σ', formatOsi: (v) => pl(v) + 'σ', krok: 2, max: 10 }));

// 3. Karta wartości indywidualnych (dane fikcyjne)
const syg = new Set(p.sygnaly.map(([i]) => i));
const pierwszy = p.sygnaly[0][0];
console.log(linia({ plik: R(3), tytul: 'Karta wartości indywidualnych: średnica wałka, mm (dane fikcyjne)',
  x: { min: 1, max: 40, etykiety: [[1, '1'], [10, '10'], [20, '20'], [30, '30'], [40, '40']], opis: 'kolejne sztuki' },
  y: { min: 19.95, max: 20.05, krok: 0.025, format: (v) => pl(v, 3) },
  serie: [{ nazwa: 'pomiar', punkty: p.x.map((v, i) => [i + 1, v]), kolor: '#1d2530', grubosc: 1.5, znaczniki: true, promien: 2.5 },
    { nazwa: `pierwszy sygnał: sztuka ${pierwszy}`, punkty: [[pierwszy, p.x[pierwszy - 1]]], kolor: '#c2410c', tylkoZnaczniki: true, promien: 6 }],
  poziome: [{ y: p.ucl, tekst: 'górna granica ' + pl(p.ucl, 3), kolor: '#c2410c' }, { y: p.srednia }, { y: p.lcl, tekst: 'dolna granica ' + pl(p.lcl, 3), kolor: '#c2410c' }],
  pionowe: [{ x: 20.5, tekst: 'od sztuki 21 przesunięcie', dy: 222 }], H: 330, marginesL: 56 }));

// 4. ARL: ile punktów do sygnału (mapa cieplna, skala logarytmiczna)
const przes = [0, 0.5, 1, 1.5, 2, 3];
const wart = przes.map((d) => [m.arl[`3s_${d}`], m.arl[`WE_${d}`]]);
const kolor = (v) => SKALA[Math.max(0, Math.min(SKALA.length - 1, Math.round((Math.log(v) - Math.log(1.5)) / (Math.log(400) - Math.log(1.5)) * (SKALA.length - 1))))];
console.log(mapaCieplna({ plik: R(4), tytul: 'Średnia liczba sztuk do pierwszego sygnału karty (symulacja 20\u00a0000 serii)',
  kolumny: ['tylko punkt poza 3σ', 'wszystkie reguły Western Electric'], wiersze: przes.map((d) => d === 0 ? 'proces bez zmian' : `przesunięcie o ${pl(d, 1)}σ`), wartosci: wart,
  kolory: wart.map((w) => w.map(kolor)), format: (v) => v >= 20 ? pl(v) : pl(v, 1), szerEtykiet: 150,
  legenda: { tytul: 'Sztuk do sygnału', lewa: 'mało', prawa: 'dużo' } }));

// 5. Drzewo decyzji: reagować czy nie
console.log(drzewo({ plik: R(5), tytul: 'Czy przestawić maszynę po tym pomiarze',
  pytania: [
    { pytanie: 'Punkt poza granicą kontrolną?', tak: 'Zatrzymaj, sprawdź ostatnie sztuki, szukaj przyczyny i zapisz ją.' },
    { pytanie: 'Seria: 2 z 3 powyżej 2σ, 4 z 5 powyżej 1σ albo 8 po jednej stronie średniej?', tak: 'Proces się przesunął. Znajdź, co się zmieniło, potem koryguj.' },
    { pytanie: 'Znany dryf, np. zużycie narzędzia, z planem korekty?', tak: 'Koryguj według planu, a nie po każdym pomiarze.' },
  ], koniec: 'Nie ruszaj nastaw. To zmienność wspólna; zmniejszy ją tylko zmiana procesu.' }));

// 6. Wdrożenie karty w pięciu krokach
console.log(schemat({ plik: R(6), tytul: 'Karta kontrolna na jednym wymiarze w pięciu krokach',
  kroki: [
    { tekst: 'Wybierz jeden wymiar, który najczęściej daje braki albo korekty' },
    { tekst: 'Zbierz 20–25 pomiarów bez korygowania maszyny' },
    { tekst: 'Policz średnią, ruchomy rozstęp i granice: średnia ± 2,66 × MR̄', akcent: true },
    { tekst: 'Wywieś kartę przy maszynie z regułami reakcji' },
    { tekst: 'Zapisuj przyczynę każdego sygnału; co miesiąc usuń najczęstszą', akcent: true },
  ], petla: 'mniejszy rozrzut, nowe granice' }));
console.log('braki', p.braki, 'sygnały', p.sygnaly.slice(0, 3));
