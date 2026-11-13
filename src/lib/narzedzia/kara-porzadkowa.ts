// Kary porządkowe (art. 108–113 Kp): upomnienie, nagana, przy naruszeniach z § 2 także kara pieniężna, najwyżej
// jednodniowe wynagrodzenie za jedno przekroczenie, a łącznie 1/10 wypłaty po potrąceniach z art. 87 § 1 pkt 1–3 (§ 3).
// Kara najpóźniej 2 tygodnie od powzięcia wiadomości i 3 miesiące od naruszenia (art. 109 § 1), sprzeciw 7 dni od
// zawiadomienia (art. 112 § 1), pozew 14 dni od odrzucenia sprzeciwu (§ 2), zatarcie po roku nienagannej pracy (art. 113).
// Terminy liczymy według KC (art. 300 Kp): tygodnie i miesiące z art. 112, dni z art. 111 § 2. Sobota i dzień wolny
// przesuwają koniec (art. 115) tylko terminu pracownika na sprzeciw. Terminów pracodawcy na ukaranie (art. 109 § 1)
// nie przesuwamy: przepis nie rozstrzyga, czy to termin do czynności z art. 115 KC, więc wariant bezpieczny dla
// pracownika to wcześniejsza data (zasada 2 standardu narzędzi).
import { doGrosza } from './dodatek-nocny';
import { terminWDniach } from './termin-odwolania';
import { dodajDni, dodajLata, dodajMiesiace } from './terminy';

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
  return {
    do2tygodni,
    do3miesiecy,
    ostatniDzienKary,
    wTerminie: d.ukaranie <= ostatniDzienKary,
    sprzeciw: terminWDniach(d.ukaranie, 7),
    zatarcie: dodajLata(d.ukaranie, 1),
  };
}

/** Łączny limit kar pieniężnych: 1/10 wynagrodzenia do wypłaty po potrąceniach z art. 87 § 1 pkt 1–3 (art. 108 § 3). */
export const limitKarPienieznych = (doWyplaty: number) => doGrosza(doWyplaty / 10);
