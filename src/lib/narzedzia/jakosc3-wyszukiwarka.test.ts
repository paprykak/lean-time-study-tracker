// Audyt „jakosc3” (2026-11-15): zapytania ludzi z hali o odpowiedzialność materialną, monitoring, drogi i przejścia
// oraz składowanie (raporty/jakosc3/*-wer.json). Każde zapytanie sprawdzone w obie strony: narzędzie trafia w pierwszą
// trójkę, a jego hasła nie zabierają pierwszego miejsca narzędziu, które lepiej odpowiada na inną sprawę.
import { describe, expect, it } from 'vitest';
import { przygotuj, szukaj } from '../szukaj-narzedzi';
import { indeksNarzedzi } from '../indeks-narzedzi';

const p = przygotuj(indeksNarzedzi());
const pierwszy = (q: string) => szukaj(p, q)[0]?.wpis.s;
const wsrod = (q: string, ile = 3) => szukaj(p, q, ile).map((w) => w.wpis.s);

describe('jakosc3: zapytania z hali trafiają w narzędzie', () => {
  it.each([
    ['monitoring komputera', 'monitoring-w-pracy'],
    ['kamera nad stanowiskiem', 'monitoring-w-pracy'],
    ['monitoring bez informacji', 'monitoring-w-pracy'],
    ['czy pracodawca moze mnie podgladac', 'monitoring-w-pracy'],
    ['sledzenie pracownika', 'monitoring-w-pracy'],
    ['kamera w szatni', 'monitoring-w-pracy'],
    ['kamera w toalecie', 'monitoring-w-pracy'],
    ['zepsulem maszyne w pracy musze zaplacic', 'odpowiedzialnosc-materialna'],
    ['zgubilem narzedzia firmowe', 'odpowiedzialnosc-materialna'],
    ['pracodawca obciazyl mnie kosztami naprawy', 'odpowiedzialnosc-materialna'],
    ['zgoda na potracenie z wynagrodzenia', 'odpowiedzialnosc-materialna'],
    ['rozbilem auto sluzbowe', 'odpowiedzialnosc-materialna'],
    ['potracenie z wyplaty za szkode', 'odpowiedzialnosc-materialna'],
    ['manko w kasie', 'odpowiedzialnosc-materialna'],
    ['pracodawca kaze placic za szkode', 'odpowiedzialnosc-materialna'],
    ['ile kg na regal', 'skladowanie-w-magazynie'],
    ['ile kg na polke', 'skladowanie-w-magazynie'],
    ['ile metrow do gasnicy', 'skladowanie-w-magazynie'],
    ['co na najnizszej polce', 'skladowanie-w-magazynie'],
    ['rampa zaladunkowa', 'drogi-i-przejscia'],
    ['barierki dla pieszych hala', 'drogi-i-przejscia'],
    ['pasy na hali zolte', 'drogi-i-przejscia'],
  ])('„%s” → %s na pierwszym miejscu', (q, slug) => {
    expect(pierwszy(q)).toBe(slug);
  });

  it.each([
    ['kamery w magazynie', 'monitoring-w-pracy'],
    ['zniszczylem wozek widlowy kto placi', 'odpowiedzialnosc-materialna'],
    ['kara za zniszczenie', 'odpowiedzialnosc-materialna'],
    ['ile procent rampa', 'drogi-i-przejscia'],
    ['wysokosc dojscia do stanowiska pracy', 'drogi-i-przejscia'],
  ])('„%s” → %s w pierwszej trójce', (q, slug) => {
    expect(wsrod(q)).toContain(slug);
  });
});

describe('jakosc3: hasła tych narzędzi nie zabierają zapytań innym', () => {
  it.each([
    ['szatnia', 'normy-sanitarne'],
    ['toaleta', 'normy-sanitarne'],
    // „toaleta w pracy” wygrywa monitoring przez słowo „pracy” w nazwie; poprawka wymaga hasła u norm sanitarnych
    // (poza zakresem audytu, raporty/jakosc3/RAPORT.md).
    ['szafka w szatni', 'normy-sanitarne'],
    ['okulary do komputera', 'przerwy-w-pracy'],
    ['ile kg wolno dzwigac', 'ile-kg-wolno-dzwigac'],
    ['ile kg kobieta', 'ile-kg-wolno-dzwigac'],
    ['najnizsza krajowa', 'placa-minimalna'],
    ['od ile metrow praca na wysokosci', 'praca-na-wysokosci'],
    ['uprawnienia na wozek', 'waznosc-uprawnien-udt'],
    ['kara pieniezna potracenie z wyplaty', 'kara-porzadkowa'],
    ['praca przy maszynie', 'drgania-w-pracy'],
    ['auto sluzbowe', 'monitoring-w-pracy'],
    ['zepsulem sobie zdrowie w pracy', 'odszkodowanie-za-wypadek-przy-pracy'],
    ['zniszczylem sobie kregoslup w pracy', 'choroba-zawodowa'],
    ['wozek widlowy', 'waznosc-uprawnien-udt'],
    ['zaplacic podatek', 'zwrot-podatku-pit-37'],
  ])('„%s” → %s na pierwszym miejscu', (q, slug) => {
    expect(pierwszy(q)).toBe(slug);
  });

  it('„próg”, „pasy” i „wysokość” z innych spraw nie prowadzą do dróg i przejść', () => {
    for (const q of ['prog podatkowy', 'pasy bezpieczenstwa', 'wysokosc odprawy', 'wysokosc wynagrodzenia', 'badania na stanowisku pracy'])
      expect(pierwszy(q), q).not.toBe('drogi-i-przejscia');
  });
});
