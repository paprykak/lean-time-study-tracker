// Sprawdza źródła artykułu: czy adres odpowiada, a przy badaniach z DOI dane z Crossref (tytuł, czasopismo, rok,
// liczba cytowań) i czy praca nie została wycofana ani poprawiona (Crossref „updated-by”, także dane Retraction Watch).
// Użycie: npm run redakcja:zrodla -- <slug albo ścieżka do .md>. Kod wyjścia 1: niedziałający adres albo wycofana praca.
// Zapytania po kolei, z identyfikującym User-Agentem (zasady Crossref: https://www.crossref.org/documentation/retrieve-metadata/rest-api/).
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frontmatter } from '../../src/lib/mapa.mjs';
import { doi } from '../../src/lib/licencje.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const UA = 'RytmHali-redakcja/1.0 (https://github.com/paprykak/lean-time-study-tracker)';
const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));
const arg = process.argv[2];
if (!arg) {
  console.error('Podaj slug artykułu albo ścieżkę do pliku .md');
  process.exit(2);
}
const plik = existsSync(arg) ? arg : join(ROOT, 'src/content/artykuly', `${arg.replace(/\.md$/, '')}.md`);
const zrodla = frontmatter(readFileSync(plik, 'utf8')).zrodla ?? [];


async function pobierz(adres) {
  try {
    const odp = await fetch(adres, { redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html,application/pdf,*/*' }, signal: AbortSignal.timeout(25_000) });
    await odp.body?.cancel();
    return { status: odp.status, koncowy: odp.url };
  } catch (e) {
    return { status: 0, blad: e.message };
  }
}

async function crossref(d) {
  try {
    const odp = await fetch(`https://api.crossref.org/works/${encodeURIComponent(d)}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25_000) });
    if (!odp.ok) return { blad: `Crossref HTTP ${odp.status}` };
    const m = (await odp.json()).message;
    return {
      tytul: m.title?.[0],
      gdzie: m['container-title']?.[0] ?? m.publisher,
      rok: m.issued?.['date-parts']?.[0]?.[0],
      rodzaj: m.type,
      cytowania: m['is-referenced-by-count'],
      zmiany: (m['updated-by'] ?? []).map((u) => `${u.type} (${u.DOI})`),
    };
  } catch (e) {
    return { blad: e.message };
  }
}

let bledy = 0;
console.log(`Źródła: ${plik.replace(ROOT, '')} (${zrodla.length})`);
for (const [i, z] of zrodla.entries()) {
  console.log(`\n[${i + 1}] ${z.opis}${z.rodzaj ? ` (${z.rodzaj})` : ''}`);
  if (!z.dostep) console.log('  · brak daty dostępu (pole „dostep”)');
  if (!z.adres) {
    console.log('  · bez adresu');
    continue;
  }
  const { status, koncowy, blad } = await pobierz(z.adres);
  if (status >= 200 && status < 400) console.log(`  ✓ ${status}${koncowy && koncowy !== z.adres ? ` → ${koncowy}` : ''}`);
  else if ([401, 403, 429].includes(status)) console.log(`  · ${status}: serwis blokuje automaty; otwórz adres ręcznie`);
  else {
    console.log(`  ✗ ${status || blad}: adres nie działa`);
    bledy++;
  }
  const d = doi(z.adres);
  if (d) {
    const c = await crossref(d);
    if (c.blad) console.log(`  · DOI ${d}: ${c.blad}`);
    else {
      console.log(`  DOI ${d}: ${c.tytul} — ${c.gdzie}, ${c.rok}, ${c.rodzaj}, cytowania: ${c.cytowania}`);
      const wycofanie = c.zmiany.filter((x) => /retraction|withdrawal|removal/i.test(x));
      if (wycofanie.length) {
        console.log(`  ✗ PRACA WYCOFANA: ${wycofanie.join(', ')}`);
        bledy++;
      } else if (c.zmiany.length) console.log(`  · zmiany po publikacji: ${c.zmiany.join(', ')} (sprawdź, czego dotyczą)`);
    }
  }
  await czekaj(1000);
}
console.log(bledy ? `\n${bledy} problemów: popraw albo usuń źródła.` : '\nŹródła bez problemów.');
process.exit(bledy ? 1 : 0);
