// Pakiet „luki” (2026-11-15): podpowiedzi Google z badania popytu (raporty/luki/podpowiedzi-*.json) trafiają w nowe
// narzędzia, a ich hasła nie zabierają pierwszego miejsca narzędziom, które lepiej odpowiadają na inne sprawy.
import { describe, expect, it } from 'vitest';
import { przygotuj, szukaj } from '../szukaj-narzedzi';
import { indeksNarzedzi } from '../indeks-narzedzi';

const p = przygotuj(indeksNarzedzi());
const pierwszy = (q: string) => szukaj(p, q)[0]?.wpis.s;

describe('luki: podpowiedzi trafiają w nowe narzędzia', () => {
  it.each([
    ['l4 wstecz', 'l4-wstecz'],
    ['czy l4 można wystawić wstecz', 'l4-wstecz'],
    ['zwolnienie ile dni wstecz', 'l4-wstecz'],
    ['l4 wstecz od psychiatry', 'l4-wstecz'],
    ['czy muszę dostarczyć l4', 'l4-wstecz'],
    ['l4 czy trzeba powiadomić pracodawcę', 'l4-wstecz'],
    ['kiedy l4 jest widoczne w pue zus', 'l4-wstecz'],
    ['zwolnienie ile dni do przodu', 'l4-wstecz'],
    ['czy pracodawca może zmusić do nadgodzin', 'odmowa-nadgodzin'],
    ['czy nadgodziny są obowiązkowe', 'odmowa-nadgodzin'],
    ['odmowa nadgodzin', 'odmowa-nadgodzin'],
    ['czy muszę zostać po godzinach', 'odmowa-nadgodzin'],
    ['nadgodziny ile maksymalnie', 'odmowa-nadgodzin'],
    ['czy majac male dziecko mozna odmowic nadgodzin', 'odmowa-nadgodzin'],
  ])('„%s” → %s', (q, slug) => {
    expect(pierwszy(q)).toBe(slug);
  });
});

describe('luki: inne sprawy zostają przy swoich narzędziach', () => {
  it.each([
    ['l4', 'kalkulator-l4'],
    ['ile płatne l4', 'kalkulator-l4'],
    ['zwolnienie lekarskie', 'kalkulator-l4'],
    ['kontrola zus l4', 'co-wolno-na-l4'],
    ['nadgodziny', 'kalkulator-nadgodzin'],
    ['nadgodziny 50 czy 100', 'kalkulator-nadgodzin'],
    ['dodatek za nadgodziny', 'kalkulator-nadgodzin'],
  ])('„%s” → %s', (q, slug) => {
    expect(pierwszy(q)).toBe(slug);
  });
});
