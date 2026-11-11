// Plik kalendarza .ics (RFC 5545) z wydarzeniami całodniowymi: przypomnienia o terminach bez kont, e-maili
// i danych osobowych (DECYZJE.md, 2026-11-11). Plik powstaje w przeglądarce; kalendarz telefonu albo Outlook go importuje.

export interface Wydarzenie {
  /** RRRR-MM-DD */
  data: string;
  tytul: string;
  opis?: string;
}

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
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return linie.map(zawin).join('\r\n') + '\r\n';
}
