import { readFileSync, writeFileSync } from 'node:fs';
const p = JSON.parse(readFileSync('google/probka.json', 'utf8'));
// Odrzucone: poza sprawami z hali (loty, prawo jazdy, sklepy i marki, oferty pracy, nauczyciele, budżetówka, policja,
// logowanie do serwisów, kultura), duplikaty „wzór pdf”.
const ODRZUC = new Set([17,68,72,86,87,101,123,124,130,131,183,184,188,195,198,199,205,206,207,219,255,259,265,271,278,279,285,297,298,323,327,328,329,330,331,332,333,338,342,344,345,346,347,349,350,363,364,367,371,372,390,391,392,398,405,406,407,408,409,410,419,420,421,422,423,424,425,426,429,430,433,451,453,462,473,474,477,478,481,482,486,487,491,492,499,500,520,529,530,532,533,534,537,538,539,541,547,180]);
const zostaja = p.filter((_, i) => !ODRZUC.has(i)).map((x) => ({ q: x.q, zrodlo: 'google', fraza: x.fraza }));
writeFileSync('google/zestaw-google.json', JSON.stringify(zostaja, null, 1));
console.log(zostaja.length, ODRZUC.size);
