// Zwolnienia od pracy na sprawy rodzinne w roku kalendarzowym: opieka nad dzieckiem do 14 lat (art. 188 Kp: 2 dni albo
// 16 godzin, płatne 100%), siła wyższa w pilnych sprawach rodzinnych (art. 148^1: 2 dni albo 16 godzin, płatne 50%),
// urlop opiekuńczy (art. 173^1: 5 dni, bezpłatny). Przy niepełnym etacie wymiar godzinowy proporcjonalnie, niepełna godzina
// w górę (art. 148^1 § 4, art. 188 § 3); przy niższej dobowej normie odpowiednio (art. 148^1 § 5, art. 188 § 4).

export interface WymiarZwolnienia {
  dni: number;
  godziny: number;
}

/** Wymiar godzinowy 16 h przeliczony na etat i dobową normę, z zaokrągleniem w górę do pełnej godziny. */
export function godzinyZwolnienia(etat = 1, norma = 8): number {
  if (!(etat > 0 && etat <= 1)) throw new RangeError('Etat od 0 do 1');
  if (!(norma > 0 && norma <= 8)) throw new RangeError('Norma od 0 do 8 godzin');
  return Math.ceil(Math.round(2 * norma * etat * 1e6) / 1e6);
}

export const zwolnienieNaDziecko = (etat = 1, norma = 8): WymiarZwolnienia => ({ dni: 2, godziny: godzinyZwolnienia(etat, norma) });
export const silaWyzsza = (etat = 1, norma = 8): WymiarZwolnienia => ({ dni: 2, godziny: godzinyZwolnienia(etat, norma) });
export const URLOP_OPIEKUNCZY_DNI = 5;
