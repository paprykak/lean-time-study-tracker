import { readFileSync, writeFileSync } from 'node:fs';
const pliki = ['src/lib/szukaj-narzedzi.test.ts', 'src/lib/narzedzia/jakosc3-wyszukiwarka.test.ts', 'src/lib/narzedzia/jakosc4-wyszukiwarka.test.ts', 'src/lib/narzedzia/wyszukiwarka-runda8.test.ts', 'src/lib/narzedzia/fundusz-socjalny-szukaj.test.ts', 'src/lib/narzedzia/co-wolno-na-l4.test.ts'];
const out = new Map();
for (const f of pliki) {
  let t = readFileSync(f, 'utf8');
  if (f.includes('co-wolno')) t = t.slice(t.indexOf("describe('wyszukiwarka serwisu"), t.indexOf("describe('typografia"));
  const dodaj = (q) => { if (q && !/^[a-z0-9-]+$/.test(q) || q === 'nadgodziny' || q === 'urlop' || q === 'przerwy' || q === 'toaleta' || q === 'szatnia' || q === 'przedawnienie' || q === 'wymowienie' || q === 'urlopu' || q === 'nocki' || q === 'alkomat') out.set(q.toLowerCase(), { q, zrodlo: 'testy', plik: f }); };
  for (const m of t.matchAll(/\[\s*'([^']+)',\s*'([a-z0-9-]+)'\s*\]/g)) dodaj(m[1]);
  for (const m of t.matchAll(/(?:pierwszy|wsrod)\('([^']+)'/g)) dodaj(m[1]);
  for (const m of t.matchAll(/^\s+'([^']+)',$/gm)) dodaj(m[1]);
  for (const m of t.matchAll(/it\.each\(\[('[^\]]+')\]\)/g)) for (const n of m[1].matchAll(/'([^']+)'/g)) dodaj(n[1]);
  for (const m of t.matchAll(/for \(const q of \[([^\]]+)\]/g)) for (const n of m[1].matchAll(/'([^']+)'/g)) dodaj(n[1]);
}
// bez zapytań technicznych z testów (tekst, odmiana)
for (const k of ['kangur', '   ', 'ile']) out.delete(k);
writeFileSync(process.argv[2], JSON.stringify([...out.values()], null, 1));
console.log(out.size);
