// Wspólny wzorzec formularzy narzędzi (pakiet „spójność UX”, 2026-11-13, raporty/ux/RAPORT.md). Każde narzędzie z komunikatem
// błędu używa tych funkcji zamiast własnego przełączania `hidden`; pilnują tego testy tests/e2e/formularze.spec.ts.
//
// Komunikat błędu w HTML:
//   <p id="x-blad" class="blad-pola" role="alert" hidden></p>
// a każde pole, którego może dotyczyć, ma aria-describedby="x-blad" (obok innych opisów).
//
// Zasady (WCAG 2.2: 3.3.1 identyfikacja błędu, 4.1.3 komunikaty o stanie, 3.3.3 sugestia korekty):
// - komunikat ma role="alert": czytnik ogłasza go, gdy się pojawia albo zmienia treść, bez przenoszenia fokusu;
// - ogłaszany jest raz: ten sam tekst nie jest wpisywany ponownie (każde wpisanie byłoby nowym ogłoszeniem), a nowy
//   komunikat pojawia się dopiero po krótkiej przerwie w pisaniu (OPOZNIENIE_BLEDU), więc „1” w drodze do „1500” nie
//   przerywa czytnika ani nie miga na czerwono; zniknięcie błędu jest natychmiastowe;
// - pole z błędem ma aria-invalid="true" (czytnik mówi „nieprawidłowe”, styl .pole[aria-invalid] rysuje czerwoną ramkę),
//   a po poprawie atrybut znika;
// - tekst przechodzi przez typografia() (twarde spacje).
import { typografia } from '../typografia.mjs';

/** Przerwa w pisaniu (ms), po której pojawia się nowy komunikat błędu. */
export const OPOZNIENIE_BLEDU = 400;

type Pola = Element | null | undefined | Iterable<Element | null | undefined>;

const czekajace = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
const oznaczone = new WeakMap<HTMLElement, Set<Element>>();

const lista = (pola: Pola): Element[] => {
  if (!pola) return [];
  if (typeof (pola as Iterable<unknown>)[Symbol.iterator] === 'function') {
    return [...(pola as Iterable<Element | null | undefined>)].filter((p): p is Element => !!p);
  }
  return [pola as Element];
};

/** Pola formularza, które w aria-describedby wskazują ten komunikat. */
const opisywanePrzez = (komunikat: HTMLElement): Element[] => {
  if (!komunikat.id) return [];
  const korzen = komunikat.closest('form') ?? komunikat.ownerDocument;
  return [...korzen.querySelectorAll('[aria-describedby]')].filter((p) =>
    (p.getAttribute('aria-describedby') ?? '').split(/\s+/).includes(komunikat.id),
  );
};

const oznacz = (komunikat: HTMLElement, pola: Element[]) => {
  const poprzednie = oznaczone.get(komunikat) ?? new Set<Element>();
  for (const p of poprzednie) if (!pola.includes(p)) p.removeAttribute('aria-invalid');
  for (const p of pola) if (p.getAttribute('aria-invalid') !== 'true') p.setAttribute('aria-invalid', 'true');
  oznaczone.set(komunikat, new Set(pola));
};

/**
 * Pokazuje albo chowa komunikat błędu formularza.
 * @param komunikat element `.blad-pola` z role="alert"
 * @param tekst treść błędu; pusty tekst, null albo false chowa komunikat
 * @param pola pola, których dotyczy błąd (dostają aria-invalid); bez tego argumentu wszystkie pola, które wskazują
 *   komunikat w aria-describedby
 */
export function pokazBlad(komunikat: HTMLElement, tekst: string | null | undefined | false, pola?: Pola) {
  clearTimeout(czekajace.get(komunikat));
  czekajace.delete(komunikat);
  const t = tekst ? typografia(tekst) : '';
  if (!t) {
    // Bez ponownego ustawiania atrybutu: inaczej każdy ukryty komunikat zmieniałby się przy każdym zdarzeniu input.
    if (!komunikat.hidden) komunikat.hidden = true;
    if (komunikat.textContent) komunikat.textContent = '';
    oznacz(komunikat, []);
    return;
  }
  const cele = pola === undefined ? opisywanePrzez(komunikat) : lista(pola);
  const zastosuj = () => {
    czekajace.delete(komunikat);
    if (komunikat.textContent !== t) komunikat.textContent = t;
    komunikat.hidden = false;
    oznacz(komunikat, cele);
  };
  // Ten sam widoczny komunikat: nic nie ogłaszamy ponownie, najwyżej poprawiamy oznaczenie pól.
  if (!komunikat.hidden && komunikat.textContent === t) zastosuj();
  else {
    // Widoczny komunikat czeka na nową treść: pola, których nowy błąd już nie dotyczy, tracą aria-invalid od razu.
    if (!komunikat.hidden) oznacz(komunikat, [...(oznaczone.get(komunikat) ?? [])].filter((p) => cele.includes(p)));
    czekajace.set(komunikat, setTimeout(zastosuj, OPOZNIENIE_BLEDU));
  }
}

/**
 * Liczy wynik jeszcze raz po pokazaniu strony, także po powrocie przyciskiem „Wstecz”. Chromium przywraca wartości pól
 * po zdarzeniu load, czyli po pierwszym liczeniu i bez zdarzeń input/change (zmierzone w audycie jakości 2, D-7 i D-9),
 * a przeglądarka z pamięcią stron (bfcache) pokazuje stronę bez ponownego uruchomienia skryptu. Zdarzenie pageshow
 * przychodzi w obu przypadkach, po przywróceniu pól.
 */
export function liczPoPowrocie(przelicz: () => unknown) {
  window.addEventListener('pageshow', () => {
    przelicz();
  });
}
