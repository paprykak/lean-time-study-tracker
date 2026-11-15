// Sprawy bez narzędzia: liczba podpowiedzi Google (wszystkie trzy pobrania, bez powtórzeń), które dotyczą sprawy.
import { readFileSync, writeFileSync } from 'node:fs';
const norm = (t) => t.toLocaleLowerCase('pl').replace(/[ąćęłńóśźż]/g, (z) => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' })[z]).replace(/[^a-z0-9]+/g, ' ').trim();
const wsz = new Set();
for (const f of ['google/podpowiedzi.json', 'google/podpowiedzi2.json', 'google/podpowiedzi3.json']) for (const l of Object.values(JSON.parse(readFileSync(f, 'utf8')))) for (const s of l) wsz.add(norm(s));
const SPRAWY = [
  ['porozumienie stron (rozwiązanie umowy)', /porozumieni\w* stron/],
  ['praca na czarno, bez umowy, zgłoszenie do ZUS zlecenia', /na czarno|bez umowy|zgloszenie do zus/],
  ['wiek emerytalny i wcześniejsza emerytura', /wiek emerytaln|emerytura wiek|wczesniejsza emerytura/],
  ['przyczyny dyscyplinarki', /dyscyplinark\w* za co|dyscyplinarne powody|zwolnienie dyscyplinarne(?! na)/],
  ['nieobecność nieusprawiedliwiona, spóźnienia, porzucenie pracy', /nieusprawiedliwion|spoznienie|porzuceni\w* pracy/],
  ['potrącenia komornicze', /komornik|komornicz/],
  ['umowa o dzieło', /umowa o dzielo/],
  ['regulamin pracy, układ zbiorowy', /regulamin pracy|uklad zbiorowy/],
  ['premia, trzynastka, dodatek stażowy, wynagrodzenie zasadnicze', /premia|trzynastk|dodatek stazowy|wynagrodzenie zasadnicze/],
  ['pasek wypłaty', /pasek wyplaty/],
  ['kontrola PIP, skarga na pracodawcę (wzór, do ZUS)', /kontrola pip|skarga na pracodawce|skarga do pip/],
  ['staż z urzędu pracy, praktyki', /staz z urzedu|praktyki/],
  ['podpisanie i wycofanie wypowiedzenia, podstawa prawna', /podpisac wypowiedzeni|podpisanie wypowiedzeni|wycofac wypowiedzeni|wypowiedzenie przez pracownika (art|kod)/],
  ['pracodawca nie płaci składek, termin składek ZUS', /nie placi zus|nie placi skladek|zaplacic zus/],
  ['ubezpieczenie zdrowotne po zwolnieniu', /ubezpieczenie zdrowotne/],
  ['wypowiedzenie i umowa terminowa w ciąży, ciąża a zlecenie, kiedy powiedzieć o ciąży', /ciaz\w* a umowa|wypowiedzenie (umowy )?w ciazy|kiedy powiedziec|umowa na okres probny a ciaza/],
  ['odmowa delegacji, nadgodzin, urlopu', /odmowic (delegacji|nadgodzin|urlopu)|odmowa urlopu/],
  ['L4 wystawione wstecz', /l4 ile dni wstecz|wstecz/],
  ['L4 i chorobowe a emerytura, urlop a L4', /(zwolnienie lekarskie|chorobowe) a emerytura|urlop a l4/],
  ['świadectwo pracy: wzór, zlecenie, ekwiwalent', /swiadectwo pracy (wzor|aktualny wzor|a umowa zlecenie|umowa zlecenie|a ekwiwalent)/],
  ['renta socjalna', /renta socjalna/],
  ['zwrot akcyzy', /akcyz/],
  ['uprawnienia budowlane', /uprawnienia budowlane/],
  ['próg i podatek ogólnie (PIT-11A)', /prog podatkowy|pit 11a/],
  ['przerwa na papierosa', /papierosa/],
  ['skutki zdrowotne pracy w nocy', /praca w nocy skutki/],
  ['zakres obowiązków, kod zawodu', /zakres obowiazkow|kod zawodu/],
  ['macierzyński na zleceniu', /macierzynski a umowa zlecenie/],
  ['praca po godzinach w domu', /po godzinach w domu/],
  ['dodatek wyrównawczy do emerytury, wychowawczy a emerytura', /wyrownawczy do emerytury|wychowawczy przed 1999/],
];
const wynik = SPRAWY.map(([n, r]) => ({ n, ile: [...wsz].filter((s) => r.test(s)).length })).sort((a, b) => b.ile - a.ile);
console.log('podpowiedzi razem', wsz.size);
for (const w of wynik) console.log(`${w.ile}\t${w.n}`);
writeFileSync('brak-lista.json', JSON.stringify(wynik));
