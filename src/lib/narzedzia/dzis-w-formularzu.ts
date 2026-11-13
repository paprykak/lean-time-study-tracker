// Strona narzędzia jest budowana raz, a czytana tygodniami i po Nowym Roku. Wartości domyślne liczone przy budowaniu
// („dziś”, bieżący rok i miesiąc) skrypt przeglądarki przestawia na prawdziwe dziś w Polsce, zanim policzy wynik.
// Znaczniki w HTML:
//   <input type="date" data-dzis>            dzisiejsza data; data-dzis="-10" to 10 dni przed dziś, "30" za 30 dni;
//   <select data-rok-biezacy>                bieżący rok, jeśli jest na liście; data-rok-biezacy="10" od października
//                                            następny rok (jak przy budowaniu strony);
//   <select data-miesiac-biezacy>            bieżący miesiąc (1–12), tylko gdy rok na liście przestawiono na bieżący;
//   <select data-lata-kalendarza="-1 1">     lista lat dla narzędzi liczących z samego kalendarza: dopisuje brakujące lata
//                                            od bieżącego −1 do bieżącego +1 (przesunięcia „od do”), lat z budowania nie
//                                            usuwa; opcje to same liczby. Strona nieprzebudowana przez rok nie traci
//                                            bieżącego roku (pakiet „spójność UX”, 2026-11-13).
// Pole zmienione przez użytkownika (przywrócone przez przeglądarkę przy powrocie) zostaje: przestawiamy tylko wartość
// domyślną z HTML.
import { dodajDni, dzisWPolsce } from './terminy';

const domyslnaOpcja = (s: HTMLSelectElement) => [...s.options].find((o) => o.defaultSelected)?.value ?? s.options[0]?.value;

/** Lata listy po dopisaniu zakresu od rok+od do rok+do (rosnąco, bez powtórzeń); lata z budowania zostają. */
export function lataListy(obecne: readonly number[], rokTeraz: number, od: number, do_: number): number[] {
  const zakres = Array.from({ length: Math.max(0, do_ - od + 1) }, (_, i) => rokTeraz + od + i);
  return [...new Set([...obecne, ...zakres])].sort((a, b) => a - b);
}

function uzupelnijLata(korzen: ParentNode, rokTeraz: number) {
  for (const lista of korzen.querySelectorAll<HTMLSelectElement>('select[data-lata-kalendarza]')) {
    const [od = -1, do_ = 1] = (lista.dataset.lataKalendarza ?? '').trim().split(/\s+/).filter(Boolean).map(Number);
    const obecne = [...lista.options].map((o) => Number(o.value));
    const lata = lataListy(obecne, rokTeraz, od, do_);
    if (lata.length === obecne.length) continue;
    const wybrany = lista.value;
    const domyslny = domyslnaOpcja(lista);
    lista.replaceChildren(
      ...lata.map((r) => {
        const o = new Option(String(r), String(r));
        o.defaultSelected = String(r) === domyslny;
        return o;
      }),
    );
    lista.value = wybrany;
  }
}

export function ustawDzisiejszeWartosci(korzen: ParentNode, dzis = dzisWPolsce()) {
  uzupelnijLata(korzen, Number(dzis.slice(0, 4)));
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
