// Pracownik młodociany (Kodeks pracy, dział IX, tekst jednolity Dz.U. 2026 poz. 1245):
// - młodociany: ukończone 15 lat, nieprzekroczone 18 (art. 190 § 1); wiek kończy się z początkiem dnia urodzin
//   (art. 112 zd. 2 KC), a urodzeni 29 lutego kończą lata 28 lutego w roku nieprzestępnym;
// - czas pracy do 16. urodzin najwyżej 6 godzin na dobę, potem 8, z nauką szkolną (art. 202 § 1–3); przerwa 30 minut,
//   gdy doba przekracza 4,5 godziny (§ 3^1); lekkie prace: w roku szkolnym 12 godzin tygodniowo i 2 w dniu zajęć,
//   w ferie 7 godzin na dobę (do 16 lat 6) i 35 w tygodniu (art. 200^2 § 2–3);
// - bez nadgodzin i pracy w porze nocnej 22–6, a w przypadkach z art. 191 § 2^1–2^3 i § 2^6 20–6 (art. 203 § 1–1^1);
// - urlop: 12 dni roboczych po 6 miesiącach od rozpoczęcia pierwszej pracy, 26 po roku pracy, w roku 18. urodzin 20,
//   jeżeli prawo do urlopu powstało przed 18. urodzinami (art. 205 § 1–2); kolejne urlopy 1 stycznia (art. 205 § 5
//   w zw. z art. 153 § 2). 20 dni traktujemy jak zmniejszony wymiar 26 dni: należy się po roku pracy albo 1 stycznia;
// - płaca w przygotowaniu zawodowym: procent przeciętnego wynagrodzenia z poprzedniego kwartału, obowiązującego od
//   pierwszego dnia miesiąca po ogłoszeniu w Monitorze Polskim (§ 19–20 rozporządzenia z 28 maja 1996 r., tekst jednolity
//   Dz.U. 2018 poz. 2010, stawki z Dz.U. 2023 poz. 1348 od 1 września 2023 r.); zaokrąglamy w górę do grosza, bo stawka
//   to minimum („nie mniej niż”).
import { dodajLata, dodajMiesiace } from './terminy';

export type CelZatrudnienia = 'nauka-zawodu' | 'przyuczenie' | 'lekkie-prace';
export type StatusMlodocianego = 'ponizej-15' | 'mlodociany' | 'pelnoletni';

/** Przeciętne wynagrodzenie w kwartale (komunikaty Prezesa GUS) i dzień, od którego liczy się z niego płacę młodocianych. */
export const PRZECIETNE_KWARTALNE = [
  { od: '2025-12-01', kwota: 8771.7, kwartal: 'III kwartał 2025 r.', publikator: 'M.P. 2025 poz. 1148' },
  { od: '2026-03-01', kwota: 9197.79, kwartal: 'IV kwartał 2025 r.', publikator: 'M.P. 2026 poz. 194' },
  { od: '2026-06-01', kwota: 9562.88, kwartal: 'I kwartał 2026 r.', publikator: 'M.P. 2026 poz. 457' },
  { od: '2026-09-01', kwota: 9233.13, kwartal: 'II kwartał 2026 r.', publikator: 'M.P. 2026 poz. 779' },
  { od: '2026-12-01', kwota: 9317.01, kwartal: 'III kwartał 2026 r.', publikator: 'M.P. 2026 poz. 1122' },
] as const;

/** Najniższa płaca w procentach przeciętnego wynagrodzenia: nauka zawodu w 1., 2. i 3. roku (§ 19 ust. 2), przyuczenie (§ 20). */
export const PROCENT_NAUKI = [8, 9, 10] as const;
export const PROCENT_PRZYUCZENIA = 7;

/** Pełne lata życia w danym dniu. */
export function wiek(urodzenie: string, naDzien: string): number {
  let lata = Number(naDzien.slice(0, 4)) - Number(urodzenie.slice(0, 4));
  if (dodajLata(urodzenie, lata) > naDzien) lata--;
  return lata;
}

export function podstawaNaDzien(data: string) {
  const lista = PRZECIETNE_KWARTALNE.filter((p) => p.od <= data);
  if (!lista.length) return null;
  const p = lista[lista.length - 1];
  const ostatnia = PRZECIETNE_KWARTALNE[PRZECIETNE_KWARTALNE.length - 1];
  // GUS ogłasza kwotę co kwartał, więc 3 miesiące po ostatniej obowiązuje zwykle już następna, której jeszcze nie znamy.
  return { ...p, mozeNieaktualna: p === ostatnia && data >= dodajMiesiace(ostatnia.od, 3) };
}

/** Najniższe wynagrodzenie młodocianego w przygotowaniu zawodowym w danym dniu (brutto). Lekkie prace: null. */
export function placaMlodocianego(cel: CelZatrudnienia, rokNauki: 1 | 2 | 3, data: string) {
  if (cel === 'lekkie-prace') return null;
  const podstawa = podstawaNaDzien(data);
  if (!podstawa) return null;
  const procent = cel === 'nauka-zawodu' ? PROCENT_NAUKI[rokNauki - 1] : PROCENT_PRZYUCZENIA;
  const grosze = Math.round(podstawa.kwota * 100);
  return { procent, kwota: Math.ceil((grosze * procent) / 100) / 100, podstawa };
}

export interface Uprawnienie {
  data: string;
  dni: 12 | 20 | 26;
  podstawa: string;
  opis: string;
}

/**
 * Daty, w których młodociany nabywa prawo do urlopu (art. 205). Gdy 6 miesięcy mija w dniu 18. urodzin albo później,
 * art. 205 nie działa: prawo do urlopu powstaje według zasad ogólnych (art. 153–154).
 */
export function urlopMlodocianego(urodzenie: string, poczatekPracy: string) {
  const osiemnascie = dodajLata(urodzenie, 18);
  const rok18 = Number(osiemnascie.slice(0, 4));
  const zasadyOgolneOd = `${rok18 + 1}-01-01`;
  const po6 = dodajMiesiace(poczatekPracy, 6);
  if (po6 >= osiemnascie) return { lista: [] as Uprawnienie[], zasadyOgolneOd, przedOsiemnastka: false };
  const lista: Uprawnienie[] = [{ data: po6, dni: 12, podstawa: 'art. 205 § 1', opis: 'po 6 miesiącach pierwszej pracy' }];
  const po12 = dodajMiesiace(poczatekPracy, 12);
  const rok12 = Number(po12.slice(0, 4));
  if (rok12 <= rok18) {
    lista.push(
      rok12 === rok18
        ? { data: po12, dni: 20, podstawa: 'art. 205 § 2 zd. 2', opis: 'po roku pracy, w roku 18. urodzin' }
        : { data: po12, dni: 26, podstawa: 'art. 205 § 2 zd. 1', opis: 'po roku pracy' },
    );
    for (let rok = rok12 + 1; rok <= rok18; rok++) {
      lista.push(
        rok === rok18
          ? { data: `${rok}-01-01`, dni: 20, podstawa: 'art. 205 § 2 zd. 2', opis: 'rok 18. urodzin' }
          : { data: `${rok}-01-01`, dni: 26, podstawa: 'art. 205 § 2 i 5, art. 153 § 2', opis: 'kolejny rok' },
      );
    }
  }
  return { lista, zasadyOgolneOd, przedOsiemnastka: true };
}

export interface DaneMlodocianego {
  urodzenie: string;
  poczatekPracy: string;
  /** Dzień, na który sprawdzamy limity i płacę. */
  naDzien: string;
  cel: CelZatrudnienia;
  rokNauki: 1 | 2 | 3;
  /** Bez ukończonej ośmioletniej szkoły podstawowej (art. 191 § 2^3 i § 2^6). */
  bezSzkolyPodstawowej: boolean;
}

export function mlodociany(d: DaneMlodocianego) {
  if (d.poczatekPracy < d.urodzenie || d.naDzien < d.urodzenie) throw new RangeError('Daty przed urodzeniem');
  const pietnascie = dodajLata(d.urodzenie, 15);
  const szesnascie = dodajLata(d.urodzenie, 16);
  const osiemnascie = dodajLata(d.urodzenie, 18);
  const status: StatusMlodocianego = d.naDzien < pietnascie ? 'ponizej-15' : d.naDzien < osiemnascie ? 'mlodociany' : 'pelnoletni';
  const ponizej16 = d.naDzien < szesnascie;
  const niepelnoletni = status !== 'pelnoletni';
  return {
    status,
    lata: wiek(d.urodzenie, d.naDzien),
    pietnascie,
    szesnascie,
    osiemnascie,
    /** Rok kalendarzowy 15. urodzin: wtedy po ukończeniu szkoły podstawowej wolno pracować przed 15. urodzinami (art. 191 § 2^1). */
    rokPietnastu: Number(pietnascie.slice(0, 4)),
    limitDoby: niepelnoletni ? (ponizej16 ? 6 : 8) : null,
    lekkie:
      niepelnoletni && d.cel === 'lekkie-prace'
        ? { tydzienSzkola: 12, dzienZajec: 2, dobaFerie: ponizej16 ? 6 : 7, tydzienFerie: 35 }
        : null,
    poraNocna: niepelnoletni ? (status === 'ponizej-15' || d.bezSzkolyPodstawowej ? '20:00–6:00' : '22:00–6:00') : null,
    placa: niepelnoletni ? placaMlodocianego(d.cel, d.rokNauki, d.naDzien) : null,
    urlop: urlopMlodocianego(d.urodzenie, d.poczatekPracy),
  };
}
