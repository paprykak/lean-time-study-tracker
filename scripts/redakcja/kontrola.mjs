// Kontrola tekstu artykułu: przypisy, źródła, liczby bez źródła, frazy z tekstów generowanych, czytelność (FOG-PL).
// Użycie: npm run redakcja:kontrola -- <slug albo ścieżka do .md>. Kod wyjścia 1, gdy są błędy (skill /artykul, krok 7).
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frontmatter } from '../../src/lib/mapa.mjs';
import { kontrolaTekstu } from '../../src/lib/kontrola-tekstu.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const arg = process.argv[2];
if (!arg) {
  console.error('Podaj slug artykułu albo ścieżkę do pliku .md');
  process.exit(2);
}
const plik = existsSync(arg) ? arg : join(ROOT, 'src/content/artykuly', `${arg.replace(/\.md$/, '')}.md`);
const tekst = readFileSync(plik, 'utf8');
const fm = frontmatter(tekst);
const body = tekst.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
const { bledy, uwagi, statystyki: s } = kontrolaTekstu({ body, frontmatter: fm });

console.log(`Kontrola: ${plik.replace(ROOT, '')}${fm.testowy ? ' (wpis testowy)' : ''}`);
console.log(
  `  ${s.slowa} słów, ${s.zdania} zdań, średnio ${s.sredniaZdania.toFixed(1)} słowa w zdaniu, FOG-PL ${s.fogPl.toFixed(1)}, ` +
    `${s.srodtytuly} śródtytułów, ${s.zrodla} źródeł, ${s.przypisy} zacytowanych`,
);
for (const b of bledy) console.log(`  ✗ ${b}`);
for (const u of uwagi) console.log(`  · ${u}`);
console.log(bledy.length ? `\n${bledy.length} błędów: popraw przed oddaniem.` : '\nBez błędów.');
process.exit(bledy.length ? 1 : 0);
