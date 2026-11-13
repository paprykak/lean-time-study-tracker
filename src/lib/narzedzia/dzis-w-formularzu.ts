// Strona narzędzia jest budowana raz, a czytana tygodniami i po Nowym Roku. Wartości domyślne liczone przy budowaniu
// („dziś”, bieżący rok i miesiąc) skrypt przeglądarki przestawia na prawdziwe dziś w Polsce, zanim policzy wynik.
// Znaczniki w HTML:
//   <input type="date" data-dzis>            dzisiejsza data; data-dzis="-10" to 10 dni przed dziś, "30" za 30 dni;
//   <select data-rok-biezacy>                bieżący rok, jeśli jest na liście; data-rok-biezacy="10" od października
//                                            następny rok (jak przy budowaniu strony);
//   <select data-miesiac-biezacy>            bieżący miesiąc (1–12), tylko gdy rok na liście przestawiono na bieżący.
// Pole zmienione przez użytkownika (przywrócone przez przeglądarkę przy powrocie) zostaje: przestawiamy tylko wartość
// domyślną z HTML.
import { dodajDni, dzisWPolsce } from './terminy';

const domyslnaOpcja = (s: HTMLSelectElement) => [...s.options].find((o) => o.defaultSelected)?.value ?? s.options[0]?.value;

export function ustawDzisiejszeWartosci(korzen: ParentNode, dzis = dzisWPolsce()) {
  for (const pole of korzen.querySelectorAll<HTMLInputElement>('input[data-dzis]')) {
    if (pole.value !== pole.defaultValue) continue;
    pole.value = dodajDni(dzis, Number(pole.dataset.dzis || 0));
  }
  const rokTeraz = Number(dzis.slice(0, 4));
  const miesiacTeraz = Number(dzis.slice(5, 7));
  const listyRoku = [...korzen.querySelectorAll<HTMLSelectElement>('select[data-rok-biezacy]')];
  for (const lista of listyRoku) {
    if (lista.value !== domyslnaOpcja(lista)) continue;
    const odMiesiaca = Number(lista.dataset.rokBiezacy || 13);
    const rok = String(miesiacTeraz >= odMiesiaca ? rokTeraz + 1 : rokTeraz);
    if ([...lista.options].some((o) => o.value === rok)) lista.value = rok;
  }
  // Bieżący miesiąc ma sens tylko w bieżącym roku (albo gdy formularz nie ma listy lat).
  if (listyRoku.length && !listyRoku.some((l) => l.value === String(rokTeraz))) return;
  for (const lista of korzen.querySelectorAll<HTMLSelectElement>('select[data-miesiac-biezacy]')) {
    if (lista.value === domyslnaOpcja(lista)) lista.value = String(miesiacTeraz);
  }
}

/** Lata do wyboru w narzędziach, które liczą z kalendarza (wymiar, święta), a nie z kwot: poprzedni, bieżący i następny. */
export const lataKalendarza = (dzis = dzisWPolsce()) => {
  const rok = Number(dzis.slice(0, 4));
  return [rok - 1, rok, rok + 1];
};
