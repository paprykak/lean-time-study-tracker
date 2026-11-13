// Kontrola tekstu artykułu (skill /artykul, krok „Kontrola”; w CI dla każdego artykułu, który nie jest testowy).
// Błędy blokują publikację: przypis bez źródła, źródło bez przypisu, liczba albo wniosek z badań bez źródła, frazy
// z tekstów generowanych, miejsca do uzupełnienia w tekście do publikacji. Uwagi to wskazówki redakcyjne: czytelność,
// rytm, styl urzędowy, anglicyzmy, konstrukcje typowe dla tekstów generowanych i typografia. Redakcja każdą poprawia
// albo w teczce pisze, dlaczego zostaje (skill /artykul, pisanie.md i styl.md).
import { numeryPrzypisu, PRZYPIS } from './markdown.mjs';

/** Frazy typowe dla tekstów generowanych i korporacyjnej waty. Zamiast nich: fakt, krok albo liczba. */
export const FRAZY_ZAKAZANE = [
  'w dzisiejszym dynamicznym świecie', 'w dzisiejszym świecie', 'w dzisiejszych czasach', 'w erze transformacji',
  'w dobie cyfryzacji', 'warto zauważyć', 'warto podkreślić', 'nie da się ukryć', 'nie ulega wątpliwości', 'kluczowe jest',
  'kluczową rolę odgrywa', 'odgrywa kluczową rolę', 'odgrywają kluczową rolę', 'klucz do sukcesu', 'kluczem do sukcesu',
  'nieodłącznym elementem', 'nieodłączny element', 'w dynamicznie zmieniającym się', 'nie jest tajemnicą', 'w świecie, w którym',
  'podsumowując', 'reasumując', 'w konkluzji', 'na zakończenie warto', 'zanurzmy się', 'przyjrzyjmy się bliżej',
  'w tym artykule dowiesz się', 'mam nadzieję, że', 'game changer', 'holistyczne podejście', 'przełomowe rozwiązanie',
  'szyte na miarę', 'jak wszyscy wiemy',
];
/** Frazy często puste, ale czasem uzasadnione (np. „rewolucja” w historii Toyoty): uwaga, nie błąd. */
export const FRAZY_PODEJRZANE = [
  'synergi', 'rewolucj', 'kompleksowe rozwiązanie', 'najwyższej jakości', 'nie bez powodu', 'innowacyjn', 'efektywnie zarządza',
  'przyjrzyjmy się', 'coraz więcej firm', 'coraz więcej przedsiębiorstw', 'w obliczu', 'transformacj', 'fundamentaln', 'nieocenion',
];

/** Wyrażenie dla całych słów: granice liczone dla liter polskich, nie tylko ASCII. */
const calymiSlowami = (zrodlo, flagi = 'giu') => new RegExp(`(?<![\\p{L}\\p{N}])(?:${zrodlo})(?![\\p{L}\\p{N}])`, flagi);

/**
 * Styl urzędowy: [wzorzec, rada]. Terminy z hali i magazynu zostają („realizacja zamówień”, „adresowanie lokalizacji”),
 * dlatego wzorce łapią konstrukcje, a nie same słowa.
 */
export const STYL_URZEDOWY = [
  ['dokon(?:ać|ał|ała|ało|ali|ały|ano|uje|ują|ywać|ywał|ywane|ywany|ywana|ania|anie|aniu)', 'czasownik zamiast „dokonać …” („dokonać analizy” → „przeanalizować”)'],
  ['przeprowadz\\p{L}* (?:analiz|szkoleni|audyt|badani|weryfikacj|kontrol|optymalizacj|wdrożeni|ocen)\\p{L}*', 'jeden czasownik: „przeanalizować”, „przeszkolić”, „sprawdzić”'],
  ['w celu', '„żeby …”'],
  ['posiad(?:a|ać|ają|ał|ała|ało|ali|ały|ający|ające|ająca)', '„mieć”'],
  ['w oparciu o|na bazie|bazuj\\p{L}*|bazować', '„na podstawie”, „opierać się na”'],
  ['poprzez', '„przez”'],
  ['na chwilę obecną|na dzień dzisiejszy|w chwili obecnej', '„teraz”, „dziś”'],
  ['w zakresie', 'gdy to nie zakres liczb: usuń albo nazwij rzecz wprost'],
  ['(?:jest|są|był|była|było) to(?!\\s*,)(?!\\s+(?:sam|samo|sama|tak|co|ten|ta|tylko)(?![\\p{L}]))', 'zacznij od podmiotu: „X to …”'],
  ['dan(?:y|ego|emu|ej|ą)', '„ten”, „każdy” albo nazwa rzeczy („dany pracownik” → „operator”)'],
  ['w sposób \\p{L}+(?:ny|wy|ki|czny|ty)', 'przysłówek albo liczba („w sposób efektywny” → „efektywnie”)'],
  ['(?:ma|mają|miał|miała|miało|miały|mieć) miejsce', 'konkretny czasownik: „zdarza się”, „trwa”, „następuje”'],
  ['w przypadku,? gdy', '„gdy”'],
  ['realiz\\p{L}* (?:działa|zadani|cel|strategi|projekt)\\p{L}*', 'konkretny czasownik: co dokładnie ktoś robi?'],
];

/** Kalki z angielskiego: [wzorzec, rada]. Angielski termin w nawiasie przy pierwszym użyciu nie jest błędem. */
export const ANGLICYZMY = [
  ['(?:za)?adres(?:ować|uje|ują|ował|owała|owali|owanie|owania|owaniu) (?:problem|wyzwani|potrzeb|kwesti|ryzyk)\\p{L}*', '„rozwiązać”, „zająć się”'],
  ['dedykowan\\p{L}*', '„przeznaczony”, „osobny”'],
  ['(?:za)?implement\\p{L}*', '„wdrożyć”, „wdrożenie”'],
  ['w temacie(?! (?:wiadomości|maila|e-maila))', '„o”, „w sprawie”'],
  ['robi\\p{L}* sens', '„ma sens”'],
  ['(?:jest|są|był|była|było|byli|były|będzie|będą) w stanie', '„może”, „potrafi”'],
  ['insight\\p{L}*|ownership|mindset\\p{L}*|engagement\\p{L}*|framework\\p{L}*|best practice\\p{L}*|quick win\\p{L}*|stakeholder\\p{L}*|challeng\\p{L}*|empower\\p{L}*',
    'polski termin („wgląd”, „odpowiedzialność”, „rama”, „dobra praktyka”); angielski tylko w nawiasie przy pierwszym użyciu'],
];

/** Słowa dobre w dawce, puste w nadmiarze: [wzorzec, ile razy wolno, rada]. */
export const NADUZYWANE = [
  ['kluczow\\p{L}*', 1, 'powiedz, dlaczego to ważne, albo usuń'],
  ['istotn\\p{L}*', 2, 'powiedz, dlaczego to ważne, albo usuń'],
  ['wyzwani\\p{L}*', 1, 'nazwij problem wprost'],
  ['co więcej|ponadto|dodatkowo', 1, 'przejście z treści („dlatego”, „ale”, „to prowadzi do”) albo nic'],
  ['warto', 2, 'polecenie wprost („policz”, „sprawdź”)'],
  ['należy', 2, 'tryb rozkazujący („nagraj”, „policz”)'],
  ['w przypadku', 2, '„gdy”, „przy”'],
];

/** Wniosek z badań podany bez przypisu: błąd (zasada skilla: przypis przy każdym wniosku z badania). */
const BADANIA = calymiSlowami(
  '(?:badania|badanie|badacze|naukowcy|eksperci|specjaliści|analitycy)\\s+(?:\\p{L}+\\s+)?' +
    '(?:pokazuj|pokazał|wskazuj|wskazał|dowodz|dowiodł|potwierdzaj|potwierdził|sugeruj|sugerował|wykazał|wykazuj|twierdz|szacuj|uważaj)\\p{L}*' +
    '|według (?:badań|badaczy|naukowców|ekspertów|specjalistów)|z badań wynika|jak (?:pokazują|wskazują|dowodzą) badania',
  'iu',
);
/** Bezosobowe „uważa się”: kto tak uważa? Uwaga, gdy zdanie nie ma przypisu. */
const BEZOSOBOWO = calymiSlowami('uważa się|mówi się|szacuje się|przyjmuje się|powszechnie wiadomo|wiadomo, że', 'iu');
/** Strona bierna z „zostać” i „być” (bez form bezosobowych na -no/-to, które są dobrą polszczyzną). */
const BIERNA = calymiSlowami(
  'zosta(?:ł|ła|ło|li|ły|nie|ną|ć|wał|wała|wało|wali|wały|je|ją)\\s+(?!(?:one|ona|ono|oni)(?![\\p{L}]))\\p{L}+(?:ny|na|ne|ni|nych|ty|ta|te|ci|tych)' +
    '|(?:jest|są|był|była|było|były|byli|będzie|będą)\\s+(?!dane(?![\\p{L}]))\\p{L}+(?:any|ana|ane|ani|ony|ona|one|eni|ywany|ywana|ywane)',
);
const NIE_TYLKO = calymiSlowami('nie tylko[^.!?]{1,140}?\\s(?:ale|lecz)');
const TO_NIE = calymiSlowami('to nie (?:jest )?[^.!?,;]{1,60}(?:,|\\s–)\\s+(?:to|lecz|ale|tylko)|nie chodzi o [^.!?]{1,80}?(?:,|\\s–)\\s+(?:lecz|ale|tylko|chodzi)');
const ODPOWIEDZ = /^(?:odpowiedź|to proste|proste\.|otóż|krótko mówiąc|wręcz przeciwnie|bo\s)/i;
/** Śródtytuły, które z natury są etykietą, i kroki poradnika („Krok 2: oddziel czynności…”). */
const ETYKIETY_DOZWOLONE = new Set(['w skrócie', 'źródła']);
const KROK = /^krok \d+[:.]/i;
/** Etykiety akapitów w „W skrócie” (standard.md). */
const ETYKIETY_W_SKROCIE = /^\*\*(?:Problem|Dlaczego|Co zrobić)\.\*\*/;

/**
 * Progi uwag. Rytm skalibrowany na felietonach Boya-Żeleńskiego („Piekło kobiet”, „Brązownicy”; Wolne Lektury):
 * w 16 fragmentach po 1500 słów zróżnicowanie długości zdań wynosiło od 0,57 do 0,96, a krótkich zdań (do 6 słów)
 * było od 0,7 do 16 na 1000 słów; na tych progach uwaga o rytmie nie padła ani razu. Półpauz Boy miał od 8 do 18 na 1000 słów;
 * w magazynie z krótkimi zdaniami 12 to już tekst przeładowany wtrąceniami.
 */
export const PROGI = {
  zroznicowanieZdan: 0.45,
  krotkieNa1000: 2,
  zroznicowanieAkapitow: 0.3,
  polpauzyNa1000: 12,
  biernaNa1000: 8,
  listy: 3,
  pogrubienia: 2,
};

/** Liczba, która wymaga źródła: procent, waluta, duże liczebniki, krotność. */
const STATYSTYKA = /\d[\d\s.,]*\s?(?:%|proc\.?|procent|zł|PLN|EUR|USD|€|\$|mln|mld|tys\.)|\d+(?:[.,]\d+)?\s?(?:razy|-krotn)/i;
/** Oznaczenie przykładu bez źródła (skill: „przykład na danych fikcyjnych”). */
const FIKCJA = /fikcyjn|hipotetyczn|przykład(?:owe|owy|owa)? (?:na danych|liczbowy)|dla przykładu przyjmijmy/i;
const DO_UZUPELNIENIA = /\[DO UZUPEŁNIENIA/i;
const PIERWSZA_OSOBA = /\b(wdrożyłem|wdrożyłam|u mojego klienta|w moim zakładzie|w mojej firmie|prowadziłem|prowadziłam|zrobiłem|zrobiłam)\b/i;
// Skróty, po których często stoi wielka litera albo liczba, a które nie kończą zdania („np. Toyota”, „Dz. U. 2018”).
// Bez „r.”, „min.”, „itd.”: te zwykle kończą zdanie („w 2023 r. Potem…”).
const SKROTY = ['np', 'm.in', 'tj', 'tzw', 'tzn', 'dr', 'prof', 'mgr', 'inż', 'ang', 'wg', 'cyt', 'nr', 'por', 'ust', 'art', 'pkt', 'poz', 'Dz', 'U', 'al', 'św', 'ul'];
/** Przypis w tekście (bez stanu globalnego wyrażenia z flagą g). */
const maPrzypis = (tekst) => new RegExp(PRZYPIS.source).test(tekst);

/** Markdown bez kodu i komentarzy, nawiasy przypisów bez ukośników z panelu. */
const oczysc = (md) =>
  md
    .replace(/```[\s\S]*?```/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\\([[\]])/g, '$1');

/**
 * Bloki treści oddzielone pustą linią, z rodzajem: naglowek, tabela, cytat, lista, obraz, akapit.
 * @param {string} md
 * @returns {{ rodzaj: 'naglowek' | 'tabela' | 'cytat' | 'lista' | 'obraz' | 'akapit', tekst: string }[]}
 */
export function bloki(md) {
  return oczysc(md)
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((tekst) => {
      const rodzaj = /^#{1,6}\s/.test(tekst)
        ? 'naglowek'
        : /^\|/.test(tekst)
          ? 'tabela'
          : /^>/.test(tekst)
            ? 'cytat'
            : /^(?:[-*+]|\d+\.)\s/.test(tekst)
              ? 'lista'
              : /^!\[/.test(tekst)
                ? 'obraz'
                : 'akapit';
      return { rodzaj, tekst };
    });
}

/** Tekst bez składni Markdowna (do statystyk); z `przypisy: true` zostawia przypisy [n]. */
const goly = (md, { przypisy = false } = {}) => {
  const bez = md.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  return (przypisy ? bez : bez.replace(PRZYPIS, ''))
    .replace(/^\s*(?:[-*+]|\d+\.|>)\s+/gm, '')
    .replace(/[*_`#]/g, '');
};

/**
 * Zdania z tekstu po polsku (skróty typu „np.”, „m.in.”, „tzw.” nie kończą zdania).
 * @param {string} tekst
 * @returns {string[]}
 */
export function zdania(tekst) {
  let t = ` ${tekst.replace(/\s+/g, ' ')} `;
  for (const s of SKROTY) t = t.replace(new RegExp(`(\\s|\\()${s.replace('.', '\\.')}\\.`, 'g'), `$1${s}§`);
  t = t.replace(/\b([A-ZŁŚŻŹĆŃÓ])\.\s/g, '$1§ '); // inicjały: „S. Shingo”
  return t
    .split(/(?<=[.!?…])\s+(?=[„"(A-ZĄĆĘŁŃÓŚŹŻ0-9])/)
    .map((z) => z.replace(/§/g, '.').trim())
    .filter((z) => /[\p{L}\p{N}]/u.test(z));
}

const SLOWO = /[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu;
export const slowa = (tekst) => tekst.match(SLOWO) ?? [];
/** Sylaby po polsku: grupy samogłosek („nie”, „się” to jedna sylaba). */
export const sylaby = (slowo) => (slowo.toLowerCase().match(/[aąeęioóuy]+/g) ?? []).length;

/**
 * Wskaźnik FOG-PL (polska odmiana wskaźnika mglistości Gunninga): 0,4 × (średnia długość zdania + odsetek słów
 * mających co najmniej 4 sylaby). Orientacyjnie: do 12 tekst przystępny dla menedżera, powyżej 15 trudny.
 */
export function fogPl(tekst) {
  const z = zdania(tekst);
  const s = slowa(tekst);
  if (!z.length || !s.length) return 0;
  const trudne = s.filter((w) => sylaby(w) >= 4 && !/^\d/.test(w)).length;
  return 0.4 * (s.length / z.length + (100 * trudne) / s.length);
}

/** Współczynnik zmienności (odchylenie standardowe / średnia); 0 dla pustej listy. */
export function zmiennosc(liczby) {
  if (liczby.length < 2) return 0;
  const srednia = liczby.reduce((a, b) => a + b, 0) / liczby.length;
  if (!srednia) return 0;
  return Math.sqrt(liczby.reduce((a, b) => a + (b - srednia) ** 2, 0) / liczby.length) / srednia;
}

/** Pierwsze wystąpienia wzorca (do pokazania w uwadze). */
const wystapienia = (wzor, tekst) => [...tekst.matchAll(wzor)].map((m) => m[0].replace(/\s+/g, ' '));
const skrot = (tekst, n = 70) => {
  const t = tekst.replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
};
const pierwszeSlowo = (zdanie) => (zdanie.match(/[\p{L}\p{N}]+/u)?.[0] ?? '').toLowerCase();

/**
 * @param {{ body: string, frontmatter: Record<string, any> }} artykul
 * @returns {{ bledy: string[], uwagi: string[], statystyki: Record<string, number> }}
 */
export function kontrolaTekstu({ body, frontmatter }) {
  const bledy = [];
  const uwagi = [];
  const zrodla = frontmatter.zrodla ?? [];
  const lista = bloki(body);
  const cytowane = new Set();

  // Przypisy i źródła
  for (const { tekst } of lista) {
    for (const m of tekst.matchAll(PRZYPIS)) for (const n of numeryPrzypisu(m[1])) cytowane.add(n);
  }
  for (const n of [...cytowane].sort((a, b) => a - b)) {
    if (n < 1 || n > zrodla.length) bledy.push(`przypis [${n}] nie ma źródła (lista „Źródła” ma ${zrodla.length} pozycji)`);
  }
  zrodla.forEach((z, i) => {
    if (!cytowane.has(i + 1)) bledy.push(`źródło ${i + 1} („${String(z.opis).slice(0, 60)}”) nie ma przypisu w tekście`);
    if (!z.adres && !['Książka', 'Rozmowa'].includes(z.rodzaj)) uwagi.push(`źródło ${i + 1} bez adresu: dodaj link, chyba że to książka albo rozmowa`);
    if (!z.rodzaj) uwagi.push(`źródło ${i + 1} bez rodzaju (badanie, dane publiczne, przepis…)`);
  });

  // Liczby i wnioski z badań bez źródła: akapit, element listy, cytat i tabela (tabelę może opisać akapit przed nią).
  lista.forEach((b, i) => {
    if (b.rodzaj === 'naglowek' || b.rodzaj === 'obraz') return;
    const jednostki = b.rodzaj === 'lista' ? b.tekst.split(/\n(?=\s*(?:[-*+]|\d+\.)\s)/) : [b.tekst];
    const poprzedni = lista[i - 1]?.tekst ?? '';
    for (const j of jednostki) {
      const fikcja = FIKCJA.test(j) || FIKCJA.test(poprzedni) || (b.rodzaj === 'lista' && FIKCJA.test(b.tekst));
      if (STATYSTYKA.test(goly(j))) {
        const zPrzypisem = maPrzypis(j) || (b.rodzaj === 'tabela' && maPrzypis(poprzedni));
        if (!zPrzypisem && !fikcja) bledy.push(`liczba bez źródła: „${skrot(goly(j), 90)}” (dodaj przypis albo oznacz dane fikcyjne)`);
      }
      if (b.rodzaj === 'tabela' || fikcja) continue;
      for (const z of zdania(goly(j, { przypisy: true }))) {
        if (maPrzypis(z)) continue;
        if (BADANIA.test(z)) bledy.push(`wniosek z badań bez przypisu: „${skrot(z, 90)}” (kto, gdzie? dodaj przypis)`);
        else if (BEZOSOBOWO.test(z)) uwagi.push(`„${z.match(BEZOSOBOWO)[0]}” bez przypisu: kto tak uważa? Podaj źródło albo usuń („${skrot(z, 60)}”)`);
      }
    }
  });

  // Język: frazy (także w tytule i leadzie)
  const proza = lista.filter((b) => b.rodzaj === 'akapit');
  const tresc = lista.filter((b) => ['akapit', 'lista', 'cytat'].includes(b.rodzaj)).map((b) => goly(b.tekst)).join('\n\n');
  const wlasny = [frontmatter.tytul, frontmatter.lead, ...lista.filter((b) => ['akapit', 'lista'].includes(b.rodzaj)).map((b) => goly(b.tekst))]
    .filter(Boolean)
    .join('\n\n');
  const male = `${tresc}\n\n${frontmatter.tytul ?? ''}\n\n${frontmatter.lead ?? ''}`.toLowerCase();
  for (const f of FRAZY_ZAKAZANE) if (male.includes(f)) bledy.push(`fraza z tekstów generowanych: „${f}”`);
  for (const f of FRAZY_PODEJRZANE) if (male.includes(f)) uwagi.push(`fraza często pusta: „${f}…” (zostaw tylko, gdy niesie treść)`);
  if (DO_UZUPELNIENIA.test(body) && !frontmatter.szkic) bledy.push('w tekście do publikacji zostało miejsce [DO UZUPEŁNIENIA]');
  const osoba = tresc.match(PIERWSZA_OSOBA);
  if (osoba) uwagi.push(`pierwsza osoba („${osoba[0]}”): wolno tylko z materiału autora, sprawdź w teczce`);
  if (/(^|\s)"[^"\n]+"/.test(tresc)) uwagi.push('cudzysłów prosty "…": po polsku „…”');
  if (/\s-\s/.test(tresc)) uwagi.push('dywiz zamiast półpauzy: „ – ” w środku zdania');
  if (/!/.test(tresc)) uwagi.push('wykrzyknik: ton spokojnego eksperta, bez wykrzykników');

  // Język: styl urzędowy, kalki z angielskiego, słowa nadużywane (tekst redakcji, bez cytatów; angielski w nawiasie dozwolony)
  const bezNawiasow = wlasny.replace(/\([^)]*\)/g, ' ');
  for (const [wzor, rada] of [...STYL_URZEDOWY, ...ANGLICYZMY]) {
    const w = wystapienia(calymiSlowami(wzor), bezNawiasow);
    if (w.length) uwagi.push(`styl: „${w[0]}”${w.length > 1 ? ` (${w.length}×)` : ''} → ${rada}`);
  }
  for (const [wzor, limit, rada] of NADUZYWANE) {
    const w = wystapienia(calymiSlowami(wzor), bezNawiasow);
    if (w.length > limit) uwagi.push(`„${w[0].toLowerCase()}” ${w.length}× (najwyżej ${limit}) → ${rada}`);
  }

  // Konstrukcje typowe dla tekstów generowanych
  const nieTylko = wystapienia(NIE_TYLKO, tresc).length;
  if (nieTylko > 1) uwagi.push(`„nie tylko…, ale…” ${nieTylko}×: zostaw jedno albo żadne`);
  const kontrasty = wystapienia(TO_NIE, tresc).length;
  const zdaniaProzy = proza.map((b) => zdania(goly(b.tekst)));
  let kontrastyDwuzdaniowe = 0;
  let pytaniaZOdpowiedzia = 0;
  const powtorzenia = [];
  for (const z of zdaniaProzy) {
    z.forEach((zd, i) => {
      if (/^to nie(?![\p{L}])/iu.test(zd) && /^to(?![\p{L}])/iu.test(z[i + 1] ?? '')) kontrastyDwuzdaniowe++;
      if (/\?$/.test(zd) && ODPOWIEDZ.test(z[i + 1] ?? '')) pytaniaZOdpowiedzia++;
      const p = pierwszeSlowo(zd);
      if (i >= 2 && p && p === pierwszeSlowo(z[i - 1]) && p === pierwszeSlowo(z[i - 2])) powtorzenia.push(`${p}: „${skrot(zd, 50)}”`);
    });
  }
  if (kontrasty + kontrastyDwuzdaniowe > 1) uwagi.push(`kontrast „to nie X, to Y” ${kontrasty + kontrastyDwuzdaniowe}×: zostaw najmocniejszy`);
  if (pytaniaZOdpowiedzia) uwagi.push(`pytanie z natychmiastową odpowiedzią („Dlaczego? Bo…”) ${pytaniaZOdpowiedzia}×: powiedz wprost`);
  for (const p of powtorzenia.slice(0, 3)) uwagi.push(`trzy zdania z rzędu zaczynają się od „${p.split(':')[0]}”${p.slice(p.indexOf(':'))}`);

  // Budowa: śródtytuły, listy, pogrubienia
  for (const b of lista.filter((x) => x.rodzaj === 'naglowek' && /^#{2,6}\s/.test(x.tekst))) {
    const tytul = b.tekst.replace(/^#+\s*/, '').trim();
    if (KROK.test(tytul)) continue;
    if (tytul.includes(':')) uwagi.push(`śródtytuł z dwukropkiem „${tytul}”: jedno zdanie-wniosek`);
    else if (slowa(tytul).length <= 2 && !ETYKIETY_DOZWOLONE.has(tytul.toLowerCase())) uwagi.push(`śródtytuł-etykieta „${tytul}”: napisz wniosek`);
  }
  const listy = lista.filter((b) => b.rodzaj === 'lista').length;
  if (listy > PROGI.listy) uwagi.push(`${listy} list: proza prowadzi argument (najwyżej ${PROGI.listy})`);
  const pogrubienia = proza.reduce((n, b) => n + (b.tekst.replace(ETYKIETY_W_SKROCIE, '').match(/\*\*[^*]+\*\*/g) ?? []).length, 0);
  if (pogrubienia > PROGI.pogrubienia) uwagi.push(`${pogrubienia} pogrubień w akapitach: wyróżnia śródtytuł, nie pogrubienie`);

  // Statystyki i rytm
  const z = zdania(tresc);
  const s = slowa(tresc);
  const dlugosci = z.map((x) => slowa(x).length);
  const dlugosciProzy = zdaniaProzy.flat().map((x) => slowa(x).length);
  const akapity = proza.map((b) => slowa(goly(b.tekst)).length);
  const naTysiac = (n) => (s.length ? (1000 * n) / s.length : 0);
  const bierna = wystapienia(BIERNA, tresc);
  const statystyki = {
    slowa: s.length,
    zdania: z.length,
    sredniaZdania: z.length ? s.length / z.length : 0,
    dlugieZdania: dlugosci.filter((d) => d > 30).length,
    fogPl: fogPl(tresc),
    srodtytuly: lista.filter((b) => /^##\s/.test(b.tekst)).length,
    zrodla: zrodla.length,
    przypisy: cytowane.size,
    zroznicowanieZdan: zmiennosc(dlugosciProzy),
    krotkieZdania: dlugosciProzy.filter((d) => d <= 6).length,
    zroznicowanieAkapitow: zmiennosc(akapity),
    stronaBierna: bierna.length,
    polpauzyNa1000: naTysiac((tresc.match(/\s[–—]\s/g) ?? []).length),
    listy,
  };
  if (statystyki.sredniaZdania > 20) uwagi.push(`średnio ${statystyki.sredniaZdania.toFixed(1)} słowa w zdaniu (cel: do 18)`);
  if (statystyki.dlugieZdania) uwagi.push(`${statystyki.dlugieZdania} zdań dłuższych niż 30 słów: podziel je`);
  if (statystyki.fogPl > 14) uwagi.push(`FOG-PL ${statystyki.fogPl.toFixed(1)}: tekst trudny (cel: do 12)`);
  if (statystyki.slowa > 800 && statystyki.srodtytuly < 3) uwagi.push('dłuższy tekst ma mniej niż 3 śródtytuły');
  for (const b of proza) {
    if (zdania(goly(b.tekst)).length > 6) uwagi.push(`akapit ma ponad 6 zdań: „${skrot(goly(b.tekst), 60)}”`);
  }
  if (dlugosciProzy.length >= 15 && statystyki.zroznicowanieZdan < PROGI.zroznicowanieZdan) {
    uwagi.push(`monotonny rytm: zdania podobnej długości (zróżnicowanie ${statystyki.zroznicowanieZdan.toFixed(2)}, cel: od ${PROGI.zroznicowanieZdan}); przeplataj długie z krótkimi`);
  }
  if (s.length >= 1000 && naTysiac(statystyki.krotkieZdania) < PROGI.krotkieNa1000) {
    uwagi.push(`${statystyki.krotkieZdania} krótkich zdań (do 6 słów): krótkie zdanie po dłuższym akcentuje wniosek`);
  }
  if (akapity.length >= 8 && statystyki.zroznicowanieAkapitow < PROGI.zroznicowanieAkapitow) {
    uwagi.push(`akapity podobnej długości (zróżnicowanie ${statystyki.zroznicowanieAkapitow.toFixed(2)}): akapit z wnioskiem może mieć jedno zdanie`);
  }
  if (s.length >= 300 && statystyki.polpauzyNa1000 > PROGI.polpauzyNa1000) {
    uwagi.push(`${statystyki.polpauzyNa1000.toFixed(0)} półpauz na 1000 słów (najwyżej ${PROGI.polpauzyNa1000}): część zastąp kropką albo przecinkiem`);
  }
  if (s.length >= 300 && naTysiac(bierna.length) > PROGI.biernaNa1000) {
    uwagi.push(`strona bierna ${bierna.length}× (np. „${bierna.slice(0, 3).join('”, „')}”): kto to robi? Strona czynna`);
  }
  return { bledy, uwagi, statystyki };
}
