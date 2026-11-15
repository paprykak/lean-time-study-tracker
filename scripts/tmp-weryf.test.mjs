import { it } from 'vitest';
import fs from 'node:fs';
import { podobne, linkiZeStron } from '../src/lib/podobne';
import { NARZEDZIA } from '../src/data/narzedzia';
import { HASLA } from '../src/data/sprawy';
import { normalizuj } from '../src/lib/szukaj-narzedzi';
import { wypowiedzenieZastepstwa } from '../src/lib/narzedzia/umowa-zastepstwo';
const OUT = process.env.OUT;
it('dump', () => {
  const src = fs.readFileSync('src/lib/podobne.ts', 'utf8');
  const lit = src.match(/const POMIJANE = new Set\((\[[\s\S]*?\])\);/)[1].replace(/\/\/.*$/gm, '');
  const POM = new Set(eval(lit));
  const KR = new Set(['l4', 'udt', 'bhp', 'ppk', 'sep']);
  const lost = new Map();
  for (const n of NARZEDZIA) {
    const t = normalizuj(`${n.nazwa} ${n.slug.replaceAll('-', ' ')} ${(HASLA[n.slug] ?? []).join(' ')}`).split(' ');
    for (const s of t) {
      if (!(s.length >= 4 || KR.has(s))) continue;
      if (POM.has(s)) continue;
      if (POM.has(s.slice(0, 6))) { const k = s.slice(0, 6); if (!lost.has(k)) lost.set(k, new Set()); lost.get(k).add(s); }
    }
  }
  const lista = {};
  for (const n of NARZEDZIA) lista[n.slug] = podobne(n.slug, NARZEDZIA);
  const lista2 = {};
  for (const n of [...NARZEDZIA].reverse()) lista2[n.slug] = podobne(n.slug, [...NARZEDZIA].reverse());
  const det = NARZEDZIA.filter((n) => JSON.stringify(lista[n.slug]) !== JSON.stringify(lista2[n.slug])).map((n) => n.slug);
  // wypowiedzenie random
  const wyn = [];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const iso = (d) => d.toISOString().slice(0, 10);
  for (let i = 0; i < 3000; i++) {
    const dor = new Date(Date.UTC(2026, 0, 1) + rnd(0, 700) * 864e5);
    const poczatek = new Date(dor.getTime() - rnd(1, 1400) * 864e5);
    const k = Math.random() < 0.15 ? '' : iso(new Date(dor.getTime() + rnd(0, 120) * 864e5));
    try { const r = wypowiedzenieZastepstwa(iso(poczatek), iso(dor), k); wyn.push({ p: iso(poczatek), d: iso(dor), k, r }); } catch (e) { wyn.push({ p: iso(poczatek), d: iso(dor), k, err: String(e) }); }
  }
  // edge: koniec == doręczenie, koniec < doręczenie
  fs.writeFileSync(OUT, JSON.stringify({ lost: Object.fromEntries([...lost].map(([k, v]) => [k, [...v]])), lista, det, nazwy: Object.fromEntries(NARZEDZIA.map((n) => [n.slug, n.nazwa])), kat: Object.fromEntries(NARZEDZIA.map((n) => [n.slug, n.kategoria])), wyn }, null, 1));
});
