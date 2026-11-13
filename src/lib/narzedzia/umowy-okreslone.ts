// Limit umów o pracę na czas określony (art. 25^1 Kp): łącznie najwyżej 33 miesiące i 3 umowy między tymi samymi stronami;
// po przekroczeniu umowa na czas nieokreślony od dnia po upływie 33 miesięcy albo od dnia zawarcia czwartej umowy (§ 3).
// Aneks przedłużający to nowa umowa (§ 2). Miesiące: przy umowach następujących bez przerwy termin ciągły (art. 112 KC, `koniecOkresu`: od 31 maja 33 miesiące do 28 lutego),
// przy przerwach okresy się sumuje, a miesiąc liczy za 30 dni (art. 114 KC w związku z art. 300 Kp).
import { dniMiedzy, dodajDni, koniecOkresu } from './terminy';

export interface Umowa {
  od: string;
  do: string;
}

export const LIMIT_MIESIECY = 33;
export const LIMIT_UMOW = 3;
export const LIMIT_DNI_PRZY_PRZERWACH = LIMIT_MIESIECY * 30;

export type WynikLimitu =
  | { stan: 'w-limicie'; limitDo: string; pozostaloDni: number }
  | { stan: 'nieokreslony'; od: string; powod: 'czwarta-umowa' | '33-miesiace' };

export interface AnalizaUmow {
  liczba: number;
  ciagle: boolean;
  dniRazem: number;
  wynik: WynikLimitu;
}

const dlugosc = (u: Umowa) => dniMiedzy(u.od, u.do) + 1;

export function sprawdzUmowy(umowy: Umowa[]): AnalizaUmow {
  if (umowy.length === 0) throw new RangeError('Podaj co najmniej jedną umowę');
  for (const u of umowy) if (u.do < u.od) throw new RangeError('Koniec umowy przed początkiem');
  const lista = [...umowy].sort((a, b) => a.od.localeCompare(b.od));
  for (let i = 1; i < lista.length; i++) if (lista[i].od <= lista[i - 1].do) throw new RangeError('Umowy nie mogą na siebie zachodzić');
  const ciagle = lista.every((u, i) => i === 0 || u.od === dodajDni(lista[i - 1].do, 1));
  const dniRazem = lista.reduce((s, u) => s + dlugosc(u), 0);

  // Ostatni dzień dozwolonych 33 miesięcy.
  let limitDo: string;
  if (ciagle) {
    limitDo = koniecOkresu(lista[0].od, LIMIT_MIESIECY);
  } else {
    let przed = 0;
    limitDo = '';
    for (const u of lista) {
      const d = dlugosc(u);
      if (przed + d >= LIMIT_DNI_PRZY_PRZERWACH) {
        limitDo = dodajDni(u.od, LIMIT_DNI_PRZY_PRZERWACH - przed - 1);
        break;
      }
      przed += d;
    }
    // Limit nie wyczerpany: pozostałe dni przypadają po ostatniej umowie (gdyby kolejna zaczęła się nazajutrz).
    if (!limitDo) limitDo = dodajDni(lista[lista.length - 1].do, LIMIT_DNI_PRZY_PRZERWACH - przed);
  }

  const ostatnia = lista[lista.length - 1];
  const czwarta = lista[LIMIT_UMOW];
  const po33 = ostatnia.do > limitDo ? dodajDni(limitDo, 1) : null;
  let wynik: WynikLimitu;
  if (czwarta && (!po33 || czwarta.od <= po33)) wynik = { stan: 'nieokreslony', od: czwarta.od, powod: 'czwarta-umowa' };
  else if (po33) wynik = { stan: 'nieokreslony', od: po33, powod: '33-miesiace' };
  else wynik = { stan: 'w-limicie', limitDo, pozostaloDni: dniMiedzy(ostatnia.do, limitDo) };
  return { liczba: lista.length, ciagle, dniRazem, wynik };
}
