import { readFileSync, writeFileSync } from 'node:fs';
const w = JSON.parse(readFileSync('google/podpowiedzi.json', 'utf8'));
const dobre = new Map(JSON.parse(readFileSync('google/kandydaci.json', 'utf8')).map((x) => [x.n, x]));
const norm = (t) => t.toLocaleLowerCase('pl').replace(/[ąćęłńóśźż]/g, (z) => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' })[z]).replace(/[^a-z0-9]+/g, ' ').trim();
const wziete = new Set(); const out = [];
for (const [f, lista] of Object.entries(w)) {
  let ile = 0;
  for (const s of lista) {
    const n = norm(s);
    if (n === norm(f) || !dobre.has(n) || wziete.has(n)) continue;
    wziete.add(n); out.push({ q: s, fraza: f }); if (++ile === 2) break;
  }
}
writeFileSync('google/probka.json', JSON.stringify(out, null, 1));
console.log(out.length); console.log(out.map((x, i) => `${i}\t${x.q}`).join('\n'));
