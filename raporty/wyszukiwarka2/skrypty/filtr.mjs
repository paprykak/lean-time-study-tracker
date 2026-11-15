import { readFileSync, writeFileSync } from 'node:fs';
const w = JSON.parse(readFileSync('google/podpowiedzi.json', 'utf8'));
const norm = (t) => t.toLocaleLowerCase('pl').replace(/[ąćęłńóśźż]/g, (z) => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' })[z]).replace(/[^a-z0-9]+/g, ' ').trim();
const ZLE = /\b(mem|memy|krzyzowk\w*|ryanair|wizz\w*|lot|lotnisk\w*|film\w*|piosenk\w*|tekst|chomikuj|allegro|olx|sklep\w*|ceneo|oferty|od zaraz|pracuj|indeed|warszawa|krakow|wroclaw\w*|poznan|gdansk|lodz|katowice|szczecin|lublin|bydgoszcz|rzeszow|bialystok|kielce|opole|torun|olsztyn|gdynia|radom|niemcy|niemczech|holandi\w*|norwegi\w*|anglii|uk|gb|chomik|wikipedia|angielsku|english|po angielsku|synonim|definicja|co to znaczy|kurs walut|gra|gry|serial|lidl|biedronka|amazon|ikea|kaufland|dpd|inpost|zara|rossmann|auchan|carrefour|castorama|leroy|obi|decathlon|media markt|zalando|dino|zabka|netto ceny|jak wymowic|wymowa|cytaty|obrazki|zyczenia|kartka|wierszyk|znaczenie|chatgpt|reddit|forum|opinie|sennik|horoskop|grecki\w*|poslow)\b/;
const wszystko = new Map();
for (const [f, lista] of Object.entries(w)) for (const s of lista) {
  const n = norm(s);
  if (!wszystko.has(n)) wszystko.set(n, { q: s, f, n });
}
const dobre = [...wszystko.values()].filter((x) => !ZLE.test(x.n) && x.n.split(' ').length >= 2);
writeFileSync('google/kandydaci.json', JSON.stringify(dobre, null, 1));
console.log(wszystko.size, dobre.length);
