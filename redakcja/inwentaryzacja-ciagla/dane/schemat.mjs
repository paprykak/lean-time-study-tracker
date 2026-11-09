// Rysunek 2 do artykułu „inwentaryzacja-ciagla”: pętla liczenia cyklicznego (zasady redakcji opisane w tekście, kroki 2–4).
import { schemat } from '../../wspolne/schemat.mjs';
const r = schemat({
  plik: new URL('../../../src/assets/rysunki/inwentaryzacja-ciagla-2.svg', import.meta.url),
  tytul: 'Jedno liczenie w liczeniu cyklicznym',
  kroki: [
    { tekst: 'Lokalizacja z harmonogramu albo wywołana: brak towaru, stan zero, stan ujemny' },
    { tekst: 'Liczenie na ślepo, bez stanu z systemu, gdy lokalizacja stoi' },
    { tekst: 'Różnica ponad próg? Drugie liczenie, przez inną osobę' },
    { tekst: 'Przyczyna różnicy: przyjęcie, pobranie, przesunięcie, ubytek, jednostka', akcent: true },
    { tekst: 'Korekta zatwierdzona przez osobę spoza zespołu liczącego' },
    { tekst: 'Raz w miesiącu: naprawa przyczyny, która dała najwięcej różnic', akcent: true },
  ],
  petla: 'mniej błędów przy operacjach',
});
console.log('zapisano src/assets/rysunki/inwentaryzacja-ciagla-2.svg', r.W, r.H);
