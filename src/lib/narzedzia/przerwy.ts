// Przerwy w pracy: art. 134 Kp (15 minut od 6 godzin, dodatkowe ponad 9 i ponad 16 godzin, wliczane do czasu pracy),
// art. 141 (przerwa niewliczana do 60 minut, gdy wprowadzona w regulaminie, układzie albo umowie), art. 187 (karmienie
// piersią: 2 × 30 min, przy więcej niż jednym dziecku 2 × 45 min; do 6 h jedna, poniżej 4 h żadna), art. 202 § 3^1
// (młodociany: 30 minut nieprzerwanie, gdy dobowy wymiar przekracza 4,5 godziny), art. 17 ustawy o rehabilitacji (osoba
// z niepełnosprawnością: dodatkowe 15 minut), § 7 pkt 2 rozporządzenia o monitorach ekranowych (Dz.U. 2025 poz. 58: co
// najmniej 5 minut po każdej godzinie pracy przy monitorze, gdy praca przy nim trwa co najmniej połowę dobowego wymiaru,
// § 2 pkt 4; zamiast tego pracodawca może przeplatać ją z inną pracą, § 7 pkt 1). Przerwy przy monitorze liczymy po
// każdej pełnej godzinie zmiany poza ostatnią, po której zmiana się kończy: przy 8 godzinach 7 razy po 5 minut.

export interface DanePrzerw {
  /** Dobowy wymiar czasu pracy w godzinach. */
  godziny: number;
  mlodociany?: boolean;
  /** Osoba z niepełnosprawnością (art. 17 ustawy o rehabilitacji). */
  niepelnosprawny?: boolean;
  /** Praca przy monitorze co najmniej przez połowę dobowego wymiaru. */
  monitor?: boolean;
  /** Godziny pracy przy monitorze na zmianie (domyślnie cała zmiana); przerwa po każdej z nich (§ 7 pkt 2). */
  monitorGodzin?: number;
  /** Karmienie piersią: brak, jedno dziecko, więcej dzieci. */
  karmienie?: 'nie' | 'jedno' | 'wiecej';
  /** Przerwa niewliczana do czasu pracy z art. 141 (minuty, 0–60). */
  niewliczana?: number;
}

export interface Przerwa {
  minuty: number;
  wliczana: boolean;
  opis: string;
  podstawa: string;
}

export function przerwy({ godziny, mlodociany = false, niepelnosprawny = false, monitor = false, monitorGodzin = godziny, karmienie = 'nie', niewliczana = 0 }: DanePrzerw): {
  lista: Przerwa[];
  wliczane: number;
  niewliczane: number;
  wPracy: number;
} {
  if (!(godziny > 0 && godziny <= 24)) throw new RangeError('Wymiar od 0 do 24 godzin');
  if (!(niewliczana >= 0 && niewliczana <= 60)) throw new RangeError('Przerwa z art. 141: od 0 do 60 minut');
  const lista: Przerwa[] = [];
  if (godziny >= 6) lista.push({ minuty: 15, wliczana: true, opis: 'Przerwa przy dobowym wymiarze co najmniej 6 godzin', podstawa: 'art. 134 § 1 pkt 1 Kp' });
  if (godziny > 9) lista.push({ minuty: 15, wliczana: true, opis: 'Dodatkowa przerwa przy wymiarze dłuższym niż 9 godzin', podstawa: 'art. 134 § 1 pkt 2 Kp' });
  if (godziny > 16) lista.push({ minuty: 15, wliczana: true, opis: 'Kolejna przerwa przy wymiarze dłuższym niż 16 godzin', podstawa: 'art. 134 § 1 pkt 3 Kp' });
  if (mlodociany && godziny > 4.5) lista.push({ minuty: 30, wliczana: true, opis: 'Przerwa dla młodocianego, nieprzerwanie 30 minut', podstawa: 'art. 202 § 3^1 Kp' });
  if (niepelnosprawny) lista.push({ minuty: 15, wliczana: true, opis: 'Dodatkowa przerwa dla osoby z niepełnosprawnością', podstawa: 'art. 17 ustawy o rehabilitacji' });
  if (monitor && !(monitorGodzin >= godziny / 2 && monitorGodzin <= godziny)) throw new RangeError('Godziny przy monitorze: od połowy do całej zmiany');
  // Przerwa po każdej pełnej godzinie przy monitorze, ale nie po ostatniej godzinie zmiany (wtedy praca się kończy).
  const godzinMonitora = Math.min(Math.floor(monitorGodzin), Math.ceil(godziny) - 1);
  if (monitor && godzinMonitora > 0) {
    lista.push({ minuty: 5 * godzinMonitora, wliczana: true, opis: `Przy monitorze: co najmniej 5 minut po każdej godzinie pracy przy nim (${godzinMonitora} × 5 min)`, podstawa: '§ 7 rozporządzenia o monitorach ekranowych' });
  }
  if (karmienie !== 'nie' && godziny >= 4) {
    const min = karmienie === 'wiecej' ? 45 : 30;
    const ile = godziny > 6 ? 2 : 1;
    for (let i = 0; i < ile; i++) lista.push({ minuty: min, wliczana: true, opis: `Przerwa na karmienie dziecka piersią${ile === 2 ? ` (${i + 1} z 2)` : ''}`, podstawa: 'art. 187 Kp' });
  }
  if (niewliczana > 0) lista.push({ minuty: niewliczana, wliczana: false, opis: 'Przerwa na posiłek albo sprawy osobiste, niewliczana do czasu pracy', podstawa: 'art. 141 Kp' });
  const wliczane = lista.filter((p) => p.wliczana).reduce((s, p) => s + p.minuty, 0);
  const niew = lista.filter((p) => !p.wliczana).reduce((s, p) => s + p.minuty, 0);
  return { lista, wliczane, niewliczane: niew, wPracy: godziny * 60 + niew };
}
