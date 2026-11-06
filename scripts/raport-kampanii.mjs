// Raport kampanii dla partnera z API Umami. Użycie:
//   npm run raport-kampanii -- <id-kampanii> [--od 2026-11-01] [--do 2026-11-30]
// Zmienne środowiska (ustawia Patryk, nigdy w repozytorium): UMAMI_API_KEY, UMAMI_WEBSITE_ID,
// opcjonalnie UMAMI_API_ENDPOINT (domyślnie Umami Cloud; Umami na własnym serwerze: https://<serwer>/api).
// Raport idzie na ekran (Markdown), nie do repozytorium: to dane partnera.
import { existsSync, readFileSync } from 'node:fs';
import {
  DOMYSLNY_ADRES_API,
  ZDARZENIE_KLIKNIECIA,
  ZDARZENIE_WYSWIETLENIA,
  adresZapytania,
  raportMarkdown,
  suma,
  wedlugMiejsc,
} from '../src/lib/raport-kampanii.mjs';

const argumenty = process.argv.slice(2);
const opcja = (nazwa) => {
  const i = argumenty.indexOf(nazwa);
  return i >= 0 ? argumenty[i + 1] : undefined;
};
const id = argumenty.find((a, i) => !a.startsWith('--') && !['--od', '--do'].includes(argumenty[i - 1]));
const plik = (katalog, nazwa) => [`src/content/${katalog}/${nazwa}.json`, `src/content/testowe/${katalog}/${nazwa}.json`].find((p) => existsSync(p));
const plikKampanii = id && plik('kampanie', id);
if (!plikKampanii) {
  console.error('Podaj id kampanii (nazwa pliku w src/content/kampanie bez .json), np. npm run raport-kampanii -- wiosna-2027.');
  process.exit(2);
}
const { UMAMI_API_KEY: klucz, UMAMI_WEBSITE_ID: idStrony, UMAMI_API_ENDPOINT: adresApi = DOMYSLNY_ADRES_API } = process.env;
if (!klucz || !idStrony) {
  console.error('Brak UMAMI_API_KEY albo UMAMI_WEBSITE_ID. Klucz tworzy Patryk w Umami (Ustawienia → Klucze API) i ustawia tylko w swoim środowisku.');
  process.exit(2);
}

const kampania = JSON.parse(readFileSync(plikKampanii, 'utf8'));
const partner = JSON.parse(readFileSync(plik('partnerzy', kampania.partner) ?? '', 'utf8'));
const od = new Date(opcja('--od') ?? kampania.od);
const doDaty = new Date(Math.min(new Date(opcja('--do') ?? kampania.do).getTime(), Date.now()));

async function pobierz(zdarzenie, wlasciwosc) {
  const odp = await fetch(adresZapytania({ adresApi, idStrony, zdarzenie, wlasciwosc, od, do: doDaty }), {
    headers: { Accept: 'application/json', Authorization: `Bearer ${klucz}` },
  });
  if (!odp.ok) throw new Error(`Umami: HTTP ${odp.status} dla „${zdarzenie}” (${wlasciwosc}): ${(await odp.text()).slice(0, 200)}`);
  return odp.json();
}

const [wysw, klik, wyswSloty, klikSloty] = await Promise.all([
  pobierz(ZDARZENIE_WYSWIETLENIA, 'kampania'),
  pobierz(ZDARZENIE_KLIKNIECIA, 'kampania'),
  pobierz(ZDARZENIE_WYSWIETLENIA, 'slot'),
  pobierz(ZDARZENIE_KLIKNIECIA, 'slot'),
]);
const wMiejscach = wedlugMiejsc(wyswSloty, id);
const kMiejscach = wedlugMiejsc(klikSloty, id);
const miejsca = [...new Set([...kampania.miejsca, ...wMiejscach.keys(), ...kMiejscach.keys()])].map((miejsce) => ({
  miejsce,
  wyswietlenia: wMiejscach.get(miejsce) ?? 0,
  klikniecia: kMiejscach.get(miejsce) ?? 0,
}));
console.log(raportMarkdown({ nazwa: kampania.nazwa, partner: partner.nazwa, od, do: doDaty, wyswietlenia: suma(wysw, id), klikniecia: suma(klik, id), miejsca }));
