// Rysunek 2 do artykułu „wycieki-sprezonego-powietrza”: test sprężarki w sobotę (procedura z poradnika DOE, s. 28, w jednostkach SI).
import { schemat } from '../../wspolne/schemat.mjs';
const r = schemat({
  plik: new URL('../../../src/assets/rysunki/wycieki-sprezonego-powietrza-2.svg', import.meta.url),
  tytul: 'Test wycieków w sobotę, krok po kroku',
  kroki: [
    { tekst: 'Wyłącz wszystkie odbiory powietrza: maszyny, narzędzia, stanowiska' },
    { tekst: 'Zostaw włączoną jedną sprężarkę, jeśli sama utrzyma ciśnienie' },
    { tekst: 'Zmierz kilka cykli: T = minuty pod obciążeniem, t = minuty odpoczynku' },
    { tekst: 'Udział wycieków (%) = ' + 'T × 100 / (T + t)'.replace(/ /g, '\u00a0'), akcent: true },
    { tekst: 'Koszt roczny = udział × moc tej sprężarki (kW) × godziny pod ciśnieniem × cena kWh'.replace(/ × /g, '\u00a0×\u00a0'), akcent: true },
    { tekst: 'Zapisz wynik w karcie i powtórz test po naprawach' },
  ],
});
console.log('zapisano src/assets/rysunki/wycieki-sprezonego-powietrza-2.svg', r.W, r.H);
