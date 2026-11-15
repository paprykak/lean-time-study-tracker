import { readFileSync } from 'node:fs';
const { przygotuj, szukaj } = await import('/home/user/lean-time-study-tracker/src/lib/szukaj-narzedzi.ts');
const p = przygotuj(JSON.parse(readFileSync('/tmp/claude-0/-home-user-lean-time-study-tracker/b0b3f654-466d-5392-b1a0-b55158a76b00/scratchpad/indeks.json', 'utf8')));
const pary = readFileSync(0, 'utf8').trim().split('\n').map((l) => l.split('|').map((x) => x.trim()));
for (const [q, s] of pary) { const w = szukaj(p, q, 3).map((x) => x.wpis.s); console.log(w[0] === s ? 'OK ' : w.includes(s) ? '3  ' : 'ZLE', q, '→', s, '|', w.join(', ')); }
