// Ochrona przedemerytalna: pracodawca nie może wypowiedzieć umowy o pracę pracownikowi, któremu brakuje nie więcej
// niż 4 lata do osiągnięcia wieku emerytalnego, jeżeli okres zatrudnienia umożliwia uzyskanie emerytury z osiągnięciem
// tego wieku (art. 39 Kp). Wiek emerytalny: 60 albo 65 lat (art. 24 ust. 1 ustawy o emeryturach i rentach z FUS,
// t.j. Dz.U. 2025 poz. 1749; zmiany z 2026 r. go nie dotyczą). Wiek osiąga się w dniu urodzin; urodzeni 29 lutego
// w roku nieprzestępnym 28 lutego (art. 112 KC).
import { dniMiedzy, dodajDni, dodajLata } from './terminy';

export const LATA_OCHRONY = 4;

export type StanOchrony = 'przed' | 'w-ochronie' | 'po';

export function ochronaPrzedemerytalna(urodzenie: string, wiek: 60 | 65, dzis: string) {
  if (dzis < urodzenie) throw new RangeError('Data urodzenia z przyszłości');
  const wiekEmerytalny = dodajLata(urodzenie, wiek);
  const od = dodajLata(urodzenie, wiek - LATA_OCHRONY);
  const do_ = dodajDni(wiekEmerytalny, -1);
  const stan: StanOchrony = dzis < od ? 'przed' : dzis < wiekEmerytalny ? 'w-ochronie' : 'po';
  return { od, do: do_, wiekEmerytalny, stan, dniDoOchrony: stan === 'przed' ? dniMiedzy(dzis, od) : 0 };
}
