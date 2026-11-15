// node ocen.mjs <etykiety.tsv> [szczegóły]: trafność wyszukiwarki na zestawie.
import { readFileSync } from 'node:fs';
const { przygotuj, szukaj } = await import(process.env.SILNIK ?? '/home/user/lean-time-study-tracker/src/lib/szukaj-narzedzi.ts');
const D = '/tmp/claude-0/-home-user-lean-time-study-tracker/b0b3f654-466d-5392-b1a0-b55158a76b00/scratchpad/';
const p = przygotuj(JSON.parse(readFileSync(process.env.INDEKS ?? D + 'indeks.json', 'utf8')));
const zestaw = JSON.parse(readFileSync(D + 'zestaw.json', 'utf8'));
const et = new Map(readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => l.split('\t')).map(([id, s]) => [Number(id), s]));
const t0 = performance.now();
let n = 0, t1 = 0, t3 = 0; const zle = []; const zrodla = {};
for (const z of zestaw) {
  const ocz = et.get(z.id); if (!ocz || ocz === 'brak') continue;
  const w = szukaj(p, z.q, 5).map((x) => x.wpis.s);
  n++; const r = (zrodla[z.zrodlo] ??= { n: 0, t1: 0, t3: 0 }); r.n++;
  if (w[0] === ocz) { t1++; r.t1++; } if (w.slice(0, 3).includes(ocz)) { t3++; r.t3++; }
  if (w[0] !== ocz) zle.push(`${w.slice(0, 3).includes(ocz) ? '3' : 'X'} #${z.id} „${z.q}” → ${ocz} | ${w.slice(0, 3).join(', ') || '(nic)'}`);
}
const ms = performance.now() - t0;
console.log(`n=${n} top1=${t1} (${(100 * t1 / n).toFixed(1)}%) top3=${t3} (${(100 * t3 / n).toFixed(1)}%) czas ${(ms / n).toFixed(2)} ms/zapytanie`);
for (const [k, r] of Object.entries(zrodla)) console.log(`  ${k}: n=${r.n} top1 ${(100 * r.t1 / r.n).toFixed(1)}% top3 ${(100 * r.t3 / r.n).toFixed(1)}%`);
if (process.argv[3]) console.log(zle.join('\n'));
