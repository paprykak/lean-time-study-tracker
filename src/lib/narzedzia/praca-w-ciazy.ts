// Praca w ciąży: rozporządzenie w sprawie wykazu prac uciążliwych, niebezpiecznych lub szkodliwych dla zdrowia kobiet
// w ciąży i karmiących (Dz.U. 2017 poz. 796, bez zmian), załącznik cz. I ust. 1:
// - pkt 2: ręczne podnoszenie i przenoszenie przedmiotów o masie ponad 3 kg;
// - pkt 11: praca w pozycji stojącej łącznie ponad 3 godziny na zmianie, jednorazowo najwyżej 15 minut, potem 15 minut przerwy;
// - pkt 12: praca przy monitorze łącznie ponad 8 godzin na dobę, jednorazowo najwyżej 50 minut, potem co najmniej 10 minut
//   przerwy wliczanej do czasu pracy;
// oraz Kodeks pracy: zakaz nadgodzin i pracy w nocy, a bez zgody delegacji i przerywanego czasu pracy (art. 178 § 1).
// Przerwy liczymy między kolejnymi blokami pracy przy monitorze albo na stojąco: przy 400 minutach przy monitorze to
// 8 bloków po 50 minut i 7 przerw.

export const MONITOR = { maksMin: 8 * 60, blokMin: 50, przerwaMin: 10 } as const;
export const STANIE = { maksMin: 3 * 60, blokMin: 15, przerwaMin: 15 } as const;
export const DZWIGANIE_MAKS_KG = 3;

const przerwy = (minuty: number, blok: number) => (minuty > 0 ? Math.ceil(minuty / blok) - 1 : 0);

export interface DanePracyWCiazy {
  monitorMin: number;
  stanieMin: number;
  nocna?: boolean;
  nadgodziny?: boolean;
  dzwiganie?: boolean;
}

export function pracaWCiazy(d: DanePracyWCiazy) {
  for (const x of [d.monitorMin, d.stanieMin]) if (!(x >= 0 && x <= 24 * 60)) throw new RangeError('Czas od 0 do 24 godzin');
  const monitor = {
    przekroczone: d.monitorMin > MONITOR.maksMin,
    przerw: przerwy(Math.min(d.monitorMin, MONITOR.maksMin), MONITOR.blokMin),
  };
  const stanie = {
    przekroczone: d.stanieMin > STANIE.maksMin,
    przerw: przerwy(Math.min(d.stanieMin, STANIE.maksMin), STANIE.blokMin),
  };
  const naruszenia = [
    monitor.przekroczone && 'monitor',
    stanie.przekroczone && 'stanie',
    d.nocna && 'nocna',
    d.nadgodziny && 'nadgodziny',
    d.dzwiganie && 'dzwiganie',
  ].filter(Boolean) as string[];
  return {
    monitor: { ...monitor, minutPrzerw: monitor.przerw * MONITOR.przerwaMin },
    stanie: { ...stanie, minutPrzerw: stanie.przerw * STANIE.przerwaMin },
    naruszenia,
  };
}
