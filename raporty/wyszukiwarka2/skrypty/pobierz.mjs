// Pobiera podpowiedzi Google (pl) dla fraz z pliku; zapisuje google/podpowiedzi.json {fraza: [podpowiedzi]}.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const [plik, wyj] = process.argv.slice(2);
const frazy = readFileSync(plik, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const wynik = existsSync(wyj) ? JSON.parse(readFileSync(wyj, 'utf8')) : {};
for (const f of frazy) {
  if (wynik[f]) continue;
  for (let proba = 0; proba < 3; proba++) {
    try {
      const o = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=pl&gl=pl&q=${encodeURIComponent(f)}`);
      const buf = Buffer.from(await o.arrayBuffer());
      let txt = buf.toString('utf8');
      if (txt.includes('�')) txt = new TextDecoder('iso-8859-2').decode(buf);
      wynik[f] = JSON.parse(txt)[1];
      break;
    } catch (e) { await new Promise((r) => setTimeout(r, 2000)); }
  }
  await new Promise((r) => setTimeout(r, 250));
}
writeFileSync(wyj, JSON.stringify(wynik, null, 1));
console.log(Object.keys(wynik).length, Object.values(wynik).flat().length);
