import { readFileSync } from 'node:fs';
const D = '/tmp/claude-0/-home-user-lean-time-study-tracker/b0b3f654-466d-5392-b1a0-b55158a76b00/scratchpad/';
const { przygotuj, szukaj } = await import(process.env.SILNIK ?? '/home/user/lean-time-study-tracker/src/lib/szukaj-narzedzi.ts');
const p = przygotuj(JSON.parse(readFileSync(process.env.INDEKS ?? D + 'indeks.json', 'utf8')));
const q = new Map(readFileSync(D + 'kontrolne.txt', 'utf8').trim().split('\n').map((l) => l.split('\t')).map(([i, t]) => [+i, t]));
const et = new Map(readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => l.split('\t')).map(([i, s]) => [+i, s]));
let n = 0, t1 = 0, t3 = 0; const zle = [];
for (const [i, s] of et) { if (s === 'brak') continue; const w = szukaj(p, q.get(i), 3).map((x) => x.wpis.s); n++; if (w[0] === s) t1++; if (w.includes(s)) t3++; else zle.push(`X #${i} ${q.get(i)} → ${s} | ${w.join(', ')}`); if (w[0] !== s && w.includes(s)) zle.push(`3 #${i} ${q.get(i)} → ${s} | ${w.join(', ')}`); }
console.log(`n=${n} top1 ${(100*t1/n).toFixed(1)}% top3 ${(100*t3/n).toFixed(1)}%`); if (process.argv[3]) console.log(zle.join('\n'));
