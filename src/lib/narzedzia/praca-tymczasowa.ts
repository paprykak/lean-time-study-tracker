// Limit pracy tymczasowej u jednego pracodawcy użytkownika: łącznie najwyżej 18 miesięcy w okresie obejmującym
// 36 kolejnych miesięcy (art. 20 ust. 1–4 ustawy o zatrudnianiu pracowników tymczasowych, t.j. Dz.U. 2025 poz. 236).
// Ustawa nie mówi, od kiedy liczyć 36 miesięcy, więc sprawdzamy każde okno 36 kolejnych miesięcy kończące się
// w dowolnym dniu (art. 112 KC). To wariant najostrożniejszy: gdy limit jest zachowany w każdym oknie, jest zachowany
// przy każdym sposobie wyznaczania okresu. 18 miesięcy pracy z przerwami liczymy jako 540 dni, miesiąc za 30 dni
// (art. 114 KC). Zastępstwo nieobecnego pracownika (art. 20 ust. 5–8) ma inne zasady i tu go nie liczymy.
import { dataPoPolsku, dniMiedzy, dodajDni, dodajMiesiace } from './terminy';

export interface Skierowanie {
  od: string;
  do: string;
}

export const LIMIT_DNI = 18 * 30;
export const OKNO_MIESIECY = 36;

const DZIEN_MS = 86_400_000;
const nr = (d: string) => Math.round(Date.parse(`${d}T00:00:00Z`) / DZIEN_MS);
const data = (n: number) => new Date(n * DZIEN_MS).toISOString().slice(0, 10);
/** Pierwszy dzień okna 36 kolejnych miesięcy, które kończy się w dniu `n`. */
const poczatekOkna = (n: number) => nr(dodajDni(dodajMiesiace(data(n), -OKNO_MIESIECY), 1));

export interface WynikLimitu {
  /** Wszystkie dni na podanych skierowaniach. */
  dniRazem: number;
  /** Okno 36 miesięcy kończące się ostatnim dniem ostatniego skierowania i dni pracy w tym oknie. */
  oknoOd: string;
  oknoDo: string;
  dniWOknie: number;
  /** Pierwszy dzień, w którym w oknie 36 miesięcy jest ponad 540 dni pracy; null, gdy limit zachowany. */
  przekroczenie: string | null;
  /** Najbliższy dzień (po ostatnim skierowaniu, nie wcześniej niż dziś), od którego limit pozwala pracować. */
  dalejOd: string;
  /** Czy limit pozwala pracować od razu: od dnia po ostatnim skierowaniu albo od dziś, gdy ten dzień minął. */
  odRazu: boolean;
  /** Ostatni dzień pracy bez przerwy od `dalejOd` w granicach limitu. */
  dalejDo: string;
  /** Gdy praca potrwa do `dalejDo`: najbliższy dzień, od którego limit znów pozwala pracować. */
  potemOd: string;
}

export function sprawdzLimit(skierowania: Skierowanie[], dzis: string): WynikLimitu {
  if (skierowania.length === 0) throw new RangeError('Podaj co najmniej jedno skierowanie');
  const lista = [...skierowania].sort((a, b) => a.od.localeCompare(b.od));
  for (const s of lista) if (s.do < s.od) throw new RangeError('Koniec skierowania przed początkiem');
  for (let i = 1; i < lista.length; i++) if (lista[i].od <= lista[i - 1].do) throw new RangeError('Skierowania nie mogą na siebie zachodzić');

  const ostatni = nr(lista[lista.length - 1].do);
  const start = Math.max(ostatni + 1, nr(dzis));
  // Zakres dni: okno wstecz od pierwszego skierowania i zapas na powrót, 540 dni pracy i kolejny powrót (każde do ok. 3 lat).
  const lo = nr(lista[0].od) - 1200;
  const hi = start + 3 * 1200;
  const praca = new Uint8Array(hi - lo + 1);
  for (const s of lista) for (let n = nr(s.od); n <= nr(s.do); n++) praca[n - lo] = 1;

  // Sumy narastające: ile(a, b) to dni pracy od dnia a do dnia b włącznie.
  const sumy = () => {
    const c = new Int32Array(praca.length + 1);
    for (let i = 0; i < praca.length; i++) c[i + 1] = c[i] + praca[i];
    return (a: number, b: number) => c[b - lo + 1] - c[a - lo];
  };
  let ile = sumy();
  const wOknie = (n: number) => ile(poczatekOkna(n), n);
  // Pierwszy dzień od `od`, w którym praca tego dnia mieści się w limicie (dzień sam jeszcze nie jest dniem pracy).
  const pierwszyWolny = (od: number) => {
    for (let n = od; n <= hi; n++) if (wOknie(n) + 1 <= LIMIT_DNI) return n;
    throw new RangeError('Poza zakresem obliczeń');
  };

  // Przekroczenie wystarczy sprawdzić w dniach pracy: w dniu bez pracy okno ma nie więcej dni niż w ostatnim dniu pracy.
  let przekroczenie: string | null = null;
  for (let n = nr(lista[0].od); n <= ostatni; n++) {
    if (praca[n - lo] && wOknie(n) > LIMIT_DNI) {
      przekroczenie = data(n);
      break;
    }
  }

  const dalejOd = pierwszyWolny(start);
  let dalejDo = dalejOd;
  while (dalejDo + 1 <= hi) {
    const n = dalejDo + 1;
    const p = poczatekOkna(n);
    if (wOknie(n) + (n - Math.max(p, dalejOd) + 1) > LIMIT_DNI) break;
    dalejDo = n;
  }

  for (let n = dalejOd; n <= dalejDo; n++) praca[n - lo] = 1;
  ile = sumy();
  const potemOd = pierwszyWolny(dalejDo + 1);

  for (let n = dalejOd; n <= dalejDo; n++) praca[n - lo] = 0;
  ile = sumy();
  const dniRazem = lista.reduce((a, s) => a + nr(s.do) - nr(s.od) + 1, 0);
  return {
    dniRazem,
    oknoOd: data(poczatekOkna(ostatni)),
    oknoDo: data(ostatni),
    dniWOknie: wOknie(ostatni),
    przekroczenie,
    dalejOd: data(dalejOd),
    odRazu: dalejOd === start,
    dalejDo: data(dalejDo),
    potemOd: data(potemOd),
  };
}

export interface Podsumowanie {
  naglowek: string;
  data: string;
  status: 'w-terminie' | 'wkrotce' | 'po-terminie';
  opis: string;
  uwaga: string | null;
}

/** Teksty wyniku dla strony narzędzia (te same przy pierwszym wyświetleniu i po przeliczeniu w przeglądarce). */
export function podsumowanie(r: WynikLimitu): Podsumowanie {
  if (r.przekroczenie)
    return {
      naglowek: 'Limit przekroczony od',
      data: dataPoPolsku(r.przekroczenie),
      status: 'po-terminie',
      opis: `Ponad 18 miesięcy w 36: znów od ${dataPoPolsku(r.dalejOd)}`,
      uwaga: 'Agencja nie może kierować, a pracodawca użytkownik korzystać z pracy ponad ten limit (art. 20 ust. 1 i 3 ustawy). Sprawdź, czy któreś skierowanie nie było zastępstwem nieobecnego pracownika: wtedy obowiązują inne zasady (art. 20 ust. 5–8).',
    };
  if (!r.odRazu)
    return {
      naglowek: 'Limit wykorzystany, znów od',
      data: dataPoPolsku(r.dalejOd),
      status: 'wkrotce',
      opis: `Potem bez przerwy do ${dataPoPolsku(r.dalejDo)}`,
      uwaga: null,
    };
  const zostalo = dniMiedzy(r.dalejOd, r.dalejDo) + 1;
  return {
    naglowek: 'Bez przerwy możesz pracować do',
    data: dataPoPolsku(r.dalejDo),
    status: zostalo <= 60 ? 'wkrotce' : 'w-terminie',
    opis: `W limicie: jeszcze ${zostalo} ${zostalo === 1 ? 'dzień' : 'dni'}`,
    uwaga: null,
  };
}
