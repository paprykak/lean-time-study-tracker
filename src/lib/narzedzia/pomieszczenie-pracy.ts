// Pomieszczenie stałej pracy: na każdego jednocześnie zatrudnionego co najmniej 13 m³ wolnej objętości i 2 m² wolnej
// powierzchni podłogi, niezajętej przez urządzenia i sprzęt (§ 19 ust. 2 ogólnych przepisów BHP, t.j. Dz.U. 2003 poz. 1650;
// późniejsze zmiany nie dotyczą § 19–20). Wysokość w świetle co najmniej 3 m, a przy czynnikach szkodliwych 3,3 m (§ 20
// ust. 1); 2,5 m, gdy pracuje najwyżej 4 osoby i na każdą przypada co najmniej 15 m³ (§ 20 ust. 3 pkt 1 lit. a).
// Obniżenie przy klimatyzacji wymaga zgody inspektora sanitarnego (§ 20 ust. 2), a inne wyjątki z § 20 ust. 3–4 opisuje strona.

export const OBJETOSC_NA_OSOBE = 13;
export const POWIERZCHNIA_NA_OSOBE = 2;

export interface DanePomieszczenia {
  /** Powierzchnia podłogi (m²) i wysokość w świetle (m). */
  powierzchnia: number;
  wysokosc: number;
  /** Powierzchnia podłogi i objętość zajęte przez maszyny, regały i sprzęt. */
  zajetaPowierzchnia?: number;
  zajetaObjetosc?: number;
  /** Czynniki szkodliwe dla zdrowia w pomieszczeniu. */
  szkodliwe?: boolean;
}

export function pomieszczeniePracy(d: DanePomieszczenia) {
  if (!(d.powierzchnia > 0 && d.wysokosc > 0)) throw new RangeError('Powierzchnia i wysokość muszą być dodatnie');
  const wolnaPowierzchnia = d.powierzchnia - (d.zajetaPowierzchnia ?? 0);
  const wolnaObjetosc = d.powierzchnia * d.wysokosc - (d.zajetaObjetosc ?? 0);
  if (!(wolnaPowierzchnia >= 0 && wolnaObjetosc >= 0)) throw new RangeError('Zajęte nie może przekraczać całości');
  const zaPowierzchnia = Math.floor(wolnaPowierzchnia / POWIERZCHNIA_NA_OSOBE + 1e-9);
  const zaObjetosc = Math.floor(wolnaObjetosc / OBJETOSC_NA_OSOBE + 1e-9);
  const maksOsob = Math.min(zaPowierzchnia, zaObjetosc);
  const wymaganaWysokosc = d.szkodliwe ? 3.3 : 3;
  // § 20 ust. 3 pkt 1 lit. a: 2,5 m przy najwyżej 4 osobach i co najmniej 15 m³ na osobę (tylko bez czynników szkodliwych).
  const maksPrzyNiskim = Math.min(4, Math.floor(wolnaObjetosc / 15 + 1e-9), zaPowierzchnia);
  const wysokoscOk = d.wysokosc >= wymaganaWysokosc - 1e-9;
  const niskieOk = !d.szkodliwe && !wysokoscOk && d.wysokosc >= 2.5 - 1e-9 && maksPrzyNiskim > 0;
  return {
    wolnaPowierzchnia,
    wolnaObjetosc,
    zaPowierzchnia,
    zaObjetosc,
    maksOsob: wysokoscOk ? maksOsob : niskieOk ? maksPrzyNiskim : 0,
    wymaganaWysokosc,
    wysokoscOk,
    /** Pomieszczenie niższe niż 3 m, dopuszczalne dla najwyżej 4 osób po 15 m³. */
    niskie: niskieOk,
  };
}
