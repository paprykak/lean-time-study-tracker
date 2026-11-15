import { readFileSync, writeFileSync } from 'node:fs';
const indeks = JSON.parse(readFileSync('indeks.json', 'utf8'));
const norm = (t) => t.toLocaleLowerCase('pl').replace(/[ąćęłńóśźż]/g, (z) => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' })[z]).replace(/[^a-z0-9]+/g, ' ').trim();
const g = JSON.parse(readFileSync('google/zestaw-google.json', 'utf8'));
const t = JSON.parse(readFileSync('zestaw-testy.json', 'utf8')).map((x) => ({ q: x.q, zrodlo: 'testy' }));
const faq = indeks.map((w, i) => ({ q: w.p[i % w.p.length], zrodlo: 'faq', narzedzie: w.s }));
const raport = ['odprawa', 'kierownik dał mi upomnienie'].map((q) => ({ q, zrodlo: 'raport' }));
const mapa = new Map();
for (const x of [...g, ...t, ...raport, ...faq]) { const n = norm(x.q); if (!mapa.has(n)) mapa.set(n, x); }
const zestaw = [...mapa.values()].map((x, i) => ({ id: i + 1, ...x }));
writeFileSync('zestaw.json', JSON.stringify(zestaw, null, 1));
const zl = {}; for (const x of zestaw) zl[x.zrodlo] = (zl[x.zrodlo] || 0) + 1; console.log(zestaw.length, zl);
// Katalog dla oceniających: bez haseł i bez wyników wyszukiwarki.
const katalog = indeks.map((w) => `## ${w.s}\nNazwa: ${w.n}\nKategoria: ${w.c}\nOpis: ${w.k}\nTytuł strony: ${w.t}\nPytania z FAQ:\n${w.p.map((q) => `- ${q}`).join('\n')}`).join('\n\n');
writeFileSync('katalog.md', `# Katalog narzędzi Rytmu Hali (${indeks.length})\n\n${katalog}\n`);
writeFileSync('zapytania.txt', zestaw.map((x) => `${x.id}\t${x.q}`).join('\n') + '\n');
