// Kary porządkowe (art. 108–113 Kp): upomnienie, nagana, przy naruszeniach z § 2 także kara pieniężna, najwyżej
// jednodniowe wynagrodzenie za jedno przekroczenie, a łącznie 1/10 wypłaty po potrąceniach z art. 87 § 1 pkt 1–3 (§ 3).
// Kara najpóźniej 2 tygodnie od powzięcia wiadomości i 3 miesiące od naruszenia (art. 109 § 1), sprzeciw 7 dni od
// zawiadomienia (art. 112 § 1), pozew 14 dni od odrzucenia sprzeciwu (§ 2), zatarcie po roku nienagannej pracy (art. 113).
// Terminy liczymy według KC (art. 300 Kp): tygodnie i miesiące z art. 112, dni z art. 111 § 2. Termin pracownika na
// sprzeciw ma dwie daty według wspólnej konwencji z terminy.ts: „Zdąż do” (bez przesunięcia) i ostatni dzień według
// art. 115 KC, gdy koniec wypada w sobotę albo dzień wolny. Terminów pracodawcy na ukaranie (art. 109 § 1) nie
// przesuwamy, bo to nie czynność pracownika: pokazujemy datę wcześniejszą, a gdy kara przypada między nią a dniem
// po przesunięciu, wynik mówi, że pracodawca może się powołać na art. 115 KC (`wOknieArt115`). Zatarcie (art. 113 § 1)
// to koniec okresu, a nie termin do czynności, więc też bez przesunięcia.
import { doGrosza } from './dodatek-nocny';
import { BEZ_PRZESUNIECIA, ETYKIETA_ZDAZ_DO, dataPoPolsku, dodajDni, dodajLata, dodajMiesiace, terminPracownika, zdanieArt115 } from './terminy';

export interface DaneKary {
  naruszenie: string;
  wiadomosc: string;
  /** Dzień zawiadomienia pracownika o karze. */
  ukaranie: string;
}

export function karaPorzadkowa(d: DaneKary) {
  if (d.wiadomosc < d.naruszenie) throw new RangeError('Pracodawca nie mógł się dowiedzieć przed naruszeniem');
  if (d.ukaranie < d.wiadomosc) throw new RangeError('Kara nie może być przed powzięciem wiadomości');
  const do2tygodni = dodajDni(d.wiadomosc, 14);
  const do3miesiecy = dodajMiesiace(d.naruszenie, 3);
  const ostatniDzienKary = do2tygodni < do3miesiecy ? do2tygodni : do3miesiecy;
  const wTerminie = d.ukaranie <= ostatniDzienKary;
  return {
    do2tygodni,
    do3miesiecy,
    ostatniDzienKary,
    wTerminie,
    /** Kara po dacie bez przesunięcia, ale nie później niż po przesunięciu z art. 115 KC. */
    wOknieArt115: !wTerminie && d.ukaranie <= terminPracownika(ostatniDzienKary).wedlugArt115,
    sprzeciw: terminPracownika(dodajDni(d.ukaranie, 7)),
    zatarcie: dodajLata(d.ukaranie, 1),
  };
}

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki (skrypt dodaje typografia()). */
export function opisKary(d: DaneKary) {
  const r = karaPorzadkowa(d);
  return {
    etykieta: r.sprzeciw.rozne ? `Sprzeciw do pracodawcy: ${ETYKIETA_ZDAZ_DO.toLowerCase()}` : 'Sprzeciw do pracodawcy najpóźniej',
    sprzeciw: dataPoPolsku(r.sprzeciw.zdazDo),
    art115: r.sprzeciw.rozne ? dataPoPolsku(r.sprzeciw.wedlugArt115) : null,
    zdanie: zdanieArt115(r.sprzeciw, 'pracodawca'),
    status: r.wTerminie
      ? 'Kara nałożona w terminie'
      : r.wOknieArt115
        ? 'Kara po terminie z art. 109 § 1, chyba że pracodawca powoła się na art. 115 KC'
        : 'Kara nałożona po terminie z art. 109 § 1',
    statusKlasa: r.wTerminie ? 'w-terminie' : r.wOknieArt115 ? 'wkrotce' : 'po-terminie',
    ostatni: dataPoPolsku(r.ostatniDzienKary),
    do2tygodni: dataPoPolsku(r.do2tygodni),
    do3miesiecy: dataPoPolsku(r.do3miesiecy),
    zatarcie: dataPoPolsku(r.zatarcie),
    bezPrzesuniecia: `${BEZ_PRZESUNIECIA.pracodawca} Zatarcie też podajemy bez przesunięcia: to koniec okresu, a nie termin do wykonania czynności.`,
  };
}

/** Łączny limit kar pieniężnych: 1/10 wynagrodzenia do wypłaty po potrąceniach z art. 87 § 1 pkt 1–3 (art. 108 § 3). */
export const limitKarPienieznych = (doWyplaty: number) => doGrosza(doWyplaty / 10);
