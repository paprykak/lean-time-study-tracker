// Plik kalendarza .ics (RFC 5545) z wydarzeniami całodniowymi: przypomnienia o terminach bez kont, e-maili
// i danych osobowych (DECYZJE.md, 2026-11-11). Plik powstaje w przeglądarce; kalendarz telefonu albo Outlook go importuje.
// Przypomnienia (VALARM, RFC 5545 3.6.6): domyślnie 7 dni i 1 dzień przed terminem, o 9:00 czasu urządzenia
// (wydarzenie całodniowe zaczyna się o północy, więc TRIGGER to przesunięcie od jej początku). Wydarzenie, które samo jest
// przypomnieniem z wyprzedzeniem („za 30 dni badanie”), dostaje alarm w swoim dniu (`przypomnienia: [0]`), a lista
// informacyjna (święta, dni wypłaty) bez alarmów (`[]`). Część kalendarzy pomija alarmy z importu (np. Kalendarz Google
// ustawia wtedy własne domyślne powiadomienia), dlatego teksty narzędzi mówią „Część kalendarzy pomija przypomnienia z pliku
// i ustawia własne”. Alarmy z dniem przed dniem pobrania pliku pomijamy (już minęły).

import { dodajDni, dzisWPolsce } from './terminy';

export interface Wydarzenie {
  /** RRRR-MM-DD */
  data: string;
  tytul: string;
  opis?: string;
  /** Ile dni przed wydarzeniem przypomnieć (o 9:00); 0 = w dniu wydarzenia. Domyślnie PRZYPOMNIENIA_DOMYSLNE. */
  przypomnienia?: readonly number[];
}

/** Domyślne przypomnienia o terminie: tydzień i dzień wcześniej. */
export const PRZYPOMNIENIA_DOMYSLNE = [7, 1] as const;
/** Godzina przypomnienia (czas urządzenia). */
const GODZINA_PRZYPOMNIENIA = 9;

/** TRIGGER względem początku dnia wydarzenia: 7 dni wcześniej o 9:00 = „-P6DT15H”, w dniu wydarzenia = „PT9H”. */
export function wyzwalacz(dniPrzed: number): string {
  if (!Number.isInteger(dniPrzed) || dniPrzed < 0) throw new RangeError(`Przypomnienie: ${dniPrzed} dni`);
  const godziny = dniPrzed * 24 - GODZINA_PRZYPOMNIENIA;
  if (godziny <= 0) return `PT${-godziny}H`;
  const dni = Math.floor(godziny / 24);
  return `-P${dni ? `${dni}D` : ''}T${godziny % 24}H`;
}

const tekstPrzypomnienia = (dniPrzed: number, tytul: string) =>
  `${dniPrzed === 0 ? 'Dziś' : dniPrzed === 1 ? 'Jutro' : `Za ${dniPrzed} dni`}: ${tytul}`;

/** Zawijanie wierszy do 75 bajtów i ucieczka znaków specjalnych (RFC 5545, 3.1 i 3.3.11). */
const tekst = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
function zawin(linia: string): string {
  const bajty = new TextEncoder();
  const wynik: string[] = [];
  let biezacy = '';
  for (const znak of linia) {
    const limit = wynik.length === 0 ? 75 : 74;
    if (bajty.encode(biezacy + znak).length > limit) {
      wynik.push(biezacy);
      biezacy = znak;
    } else biezacy += znak;
  }
  wynik.push(biezacy);
  return wynik.join('\r\n ');
}

const dataIcs = (d: string) => d.replaceAll('-', '');
const nastepnyDzien = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

/** Treść pliku .ics. `znacznik` (np. adres narzędzia) trafia do identyfikatorów wydarzeń. */
export function plikIcs(wydarzenia: Wydarzenie[], znacznik: string, teraz = new Date()): string {
  const stempel = teraz.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dzis = dzisWPolsce(teraz);
  const linie = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rytm Hali//Narzedzia//PL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...wydarzenia.flatMap((w, i) => [
      'BEGIN:VEVENT',
      `UID:${dataIcs(w.data)}-${i}-${znacznik.replace(/[^a-z0-9-]/gi, '')}@rytmhali.pl`,
      `DTSTAMP:${stempel}`,
      `DTSTART;VALUE=DATE:${dataIcs(w.data)}`,
      `DTEND;VALUE=DATE:${dataIcs(nastepnyDzien(w.data))}`,
      `SUMMARY:${tekst(w.tytul)}`,
      ...(w.opis ? [`DESCRIPTION:${tekst(w.opis)}`] : []),
      'TRANSP:TRANSPARENT',
      ...[...new Set(w.przypomnienia ?? PRZYPOMNIENIA_DOMYSLNE)].filter((dni) => dodajDni(w.data, -dni) >= dzis).flatMap((dni) => [
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${tekst(tekstPrzypomnienia(dni, w.tytul))}`,
        `TRIGGER;RELATED=START:${wyzwalacz(dni)}`,
        'END:VALARM',
      ]),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return linie.map(zawin).join('\r\n') + '\r\n';
}
