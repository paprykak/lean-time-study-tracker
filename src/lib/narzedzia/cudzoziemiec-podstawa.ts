// Na jakiej podstawie cudzoziemiec może pracować w Polsce i co wtedy musi zrobić pracodawca. Ustawa z 20 marca 2025 r.
// o warunkach dopuszczalności powierzania pracy cudzoziemcom (Dz.U. 2025 poz. 621, bez tekstu jednolitego; zmiany:
// Dz.U. 2025 poz. 1794 (art. 3 ust. 1 pkt 18 i ust. 3 pkt 2 od 27 kwietnia 2026 r.), Dz.U. 2026 poz. 203 (art. 5a od 5 marca
// 2026 r.), poz. 473 (art. 33 i 69 od 8 lipca 2026 r.), poz. 734 (art. 17 i 68 od 20 czerwca 2026 r.)):
// - art. 1 ust. 4 pkt 6: ustawy nie stosuje się do obywateli UE i EOG (oraz części obywateli Wielkiej Brytanii);
// - art. 3 ust. 1: swobodny dostęp do rynku pracy (pkt 1–2 rodzina obywatela UE albo Polski, pkt 4 Szwajcaria, pkt 6–7 pobyt
//   stały i rezydent długoterminowy UE, pkt 8–11 ochrona, pkt 12 ochrona czasowa, pkt 14 pobyt czasowy m.in. na studia);
// - art. 3 ust. 2 pkt 1: praca w ramach zezwolenia na pobyt czasowy i pracę (art. 114 ustawy o cudzoziemcach);
// - art. 3 ust. 3: zezwolenie na pracę albo oświadczenie, art. 3 ust. 5: Karta Polaka i absolwenci polskich szkół i uczelni;
// - § 1 pkt 12 rozporządzenia Dz.U. 2025 poz. 1620: studenci studiów stacjonarnych;
// - § 2 rozporządzenia Dz.U. 2025 poz. 1617: oświadczenie tylko dla obywateli Armenii, Białorusi, Mołdawii i Ukrainy;
//   art. 61 ust. 1 pkt 5: najwyżej 24 miesiące; art. 15: zezwolenie najwyżej 3 lata;
// - rozporządzenie Dz.U. 2026 poz. 1072: obywatele Wenezueli, Gruzji i Kolumbii nie pracują na zezwoleniu w ruchu bezwizowym;
// - obowiązki: art. 4 ust. 2–5 (dokument pobytowy i kopia, bez osób z art. 3 ust. 1 pkt 1–5), art. 5 ust. 1, 2 i 4
//   (umowa na piśmie przed dopuszczeniem, wersja zrozumiała, informacja o związkach zawodowych), art. 5a (ochrona czasowa:
//   PUP w 7 dni), art. 17 ust. 1 pkt 2 i art. 68 ust. 1 pkt 2 (umowa do urzędu przed powierzeniem pracy);
// - obywatele Ukrainy: art. 41 ustawy z 23 stycznia 2026 r. o wygaszeniu (Dz.U. 2026 poz. 203): przez 3 lata od 5 marca
//   2026 r. legalnie przebywający bez ochrony czasowej mają dostęp jak z art. 3 ust. 1 pkt 12 i obowiązek z art. 5a; karta
//   pobytu z art. 42c ustawy o pomocy obywatelom Ukrainy (t.j. Dz.U. 2026 poz. 1293) zwalnia z zezwolenia (art. 42v).
// Interpretacja: przy karcie z art. 42c przepis nie mówi, czy pracodawca zgłasza pracę z art. 5a; piszemy to wprost.

export type Obywatelstwo = 'ue' | 'szwajcaria' | 'ukraina' | 'oswiadczenie' | 'inne';
export type Pobyt =
  | 'staly'
  | 'rodzina'
  | 'ochrona'
  | 'ochrona-czasowa'
  | 'karta-ukr'
  | 'karta-praca'
  | 'studia-pobyt'
  | 'karta-polaka'
  | 'absolwent'
  | 'student'
  | 'inny';

export type Werdykt = 'bez-zezwolenia' | 'na-warunkach-karty' | 'oswiadczenie-lub-zezwolenie' | 'zezwolenie' | 'nie-dotyczy';

export const OBYWATELSTWA: Record<Obywatelstwo, string> = {
  ue: 'Państwo UE albo EOG',
  szwajcaria: 'Szwajcaria',
  ukraina: 'Ukraina',
  oswiadczenie: 'Armenia/Białoruś/Mołdawia',
  inne: 'Inne państwo',
};

export const POBYTY: Record<Pobyt, string> = {
  inny: 'Wiza, bez wizy, inna karta',
  'ochrona-czasowa': 'Ochrona czasowa (UKR)',
  'karta-ukr': 'Karta pobytu CUKR',
  'karta-praca': 'Karta pobytu i pracy',
  staly: 'Pobyt stały albo rezydent UE',
  rodzina: 'Rodzina obywatela PL lub UE',
  ochrona: 'Uchodźca, inna ochrona',
  'studia-pobyt': 'Karta pobytu na studia',
  student: 'Studia stacjonarne',
  'karta-polaka': 'Karta Polaka',
  absolwent: 'Absolwent szkoły/uczelni w PL',
};

export interface Obowiazek {
  tekst: string;
  podstawa: string;
}

export interface Wynik {
  werdykt: Werdykt;
  naglowek: string;
  podstawa: string;
  uwaga?: string;
  obowiazki: Obowiazek[];
}

const U = 'ustawy o powierzaniu pracy cudzoziemcom';

function bez(podstawa: string, uwaga?: string): Pick<Wynik, 'werdykt' | 'naglowek' | 'podstawa' | 'uwaga'> {
  return { werdykt: 'bez-zezwolenia', naglowek: 'Bez zezwolenia na pracę i bez oświadczenia', podstawa, ...(uwaga ? { uwaga } : {}) };
}

export function podstawaPracy(obywatelstwo: Obywatelstwo, pobyt: Pobyt): Wynik {
  if (obywatelstwo === 'ue') {
    return {
      ...bez(`art. 1 ust. 4 pkt 6 ${U}`, 'Ustawy o powierzaniu pracy cudzoziemcom nie stosuje się: pracujesz na takich samych zasadach jak obywatele Polski.'),
      obowiazki: [],
    };
  }
  if (pobyt === 'karta-ukr' && obywatelstwo !== 'ukraina') {
    return { werdykt: 'nie-dotyczy', naglowek: 'Ta karta dotyczy tylko obywateli Ukrainy', podstawa: 'art. 42c ustawy o pomocy obywatelom Ukrainy', obowiazki: [] };
  }

  let w: Pick<Wynik, 'werdykt' | 'naglowek' | 'podstawa' | 'uwaga'>;
  let zgloszenie: Obowiazek | null = null;
  const pup5a: Obowiazek = { tekst: 'Pracodawca powiadamia powiatowy urząd pracy przez praca.gov.pl w ciągu 7 dni od rozpoczęcia pracy i ponownie w 7 dni po zmianie umowy, stanowiska, obniżeniu wymiaru albo stawki', podstawa: `art. 5a ust. 1–5 ${U}` };

  if (obywatelstwo === 'szwajcaria') w = bez(`art. 3 ust. 1 pkt 4 ${U}`, 'Dotyczy obywateli Szwajcarii z prawem pobytu w Polsce i członków ich rodzin.');
  else if (pobyt === 'staly') w = bez(`art. 3 ust. 1 pkt 6–7 ${U}`);
  else if (pobyt === 'rodzina') w = bez(`art. 3 ust. 1 pkt 1–2 ${U}`, 'Dotyczy członka rodziny, który przebywa w Polsce razem z obywatelem Polski albo UE.');
  else if (pobyt === 'ochrona') w = bez(`art. 3 ust. 1 pkt 8–11 ${U}`);
  else if (pobyt === 'ochrona-czasowa') {
    w = bez(`art. 3 ust. 1 pkt 12 ${U}`);
    zgloszenie = pup5a;
  } else if (pobyt === 'karta-ukr') {
    w = bez('art. 42v ustawy o pomocy obywatelom Ukrainy', 'Karta z art. 42c to zezwolenie na pobyt czasowy na 3 lata (art. 42p i 42r). Przepis nie mówi, czy pracodawca zgłasza taką pracę do urzędu pracy jak przy ochronie czasowej.');
  } else if (pobyt === 'karta-praca') {
    w = {
      werdykt: 'na-warunkach-karty',
      naglowek: 'Na warunkach z zezwolenia na pobyt czasowy i pracę',
      podstawa: `art. 3 ust. 2 pkt 1 ${U}`,
      uwaga: 'Praca na innych warunkach albo na innym stanowisku niż w tym zezwoleniu jest nielegalna, chyba że przepisy dopuszczają zmianę albo masz inną podstawę do pracy (art. 2 pkt 2 lit. e).',
    };
  } else if (pobyt === 'studia-pobyt') w = bez(`art. 3 ust. 1 pkt 14 ${U}`, 'Dotyczy zezwolenia na pobyt czasowy w celu studiów (art. 144 ustawy o cudzoziemcach), także na studiach niestacjonarnych.');
  else if (pobyt === 'student') w = bez('§ 1 pkt 12 rozporządzenia w sprawie pracy cudzoziemców bez zezwolenia', 'Tylko studia stacjonarne w Polsce, w uczelni zatwierdzonej do przyjmowania cudzoziemców albo niepodlegającej zatwierdzeniu. Okres przejściowy dla innych uczelni skończył się 30 czerwca 2026 r.');
  else if (pobyt === 'karta-polaka') w = bez(`art. 3 ust. 5 pkt 1 ${U}`, 'Potrzebny jest też legalny pobyt: na wizie, karcie pobytu albo w ruchu bezwizowym.');
  else if (pobyt === 'absolwent') w = bez(`art. 3 ust. 5 pkt 2–3 ${U}`, 'Absolwent polskiej szkoły ponadpodstawowej z polskim dokumentem kwalifikacji zawodowych albo polskiej uczelni; potrzebny jest legalny pobyt.');
  else if (obywatelstwo === 'ukraina') {
    w = bez('art. 41 ustawy o wygaszeniu pomocy obywatelom Ukrainy', 'Przez 3 lata od 5 marca 2026 r. obywatel Ukrainy przebywający legalnie bez ochrony czasowej ma dostęp do rynku pracy jak przy ochronie czasowej. Możliwe są też oświadczenie albo zezwolenie.');
    zgloszenie = pup5a;
  } else if (obywatelstwo === 'oswiadczenie') {
    w = {
      werdykt: 'oswiadczenie-lub-zezwolenie',
      naglowek: 'Potrzebne oświadczenie o powierzeniu pracy albo zezwolenie',
      podstawa: `art. 3 ust. 3, art. 15 i art. 61 ${U}`,
      uwaga: 'Oświadczenie: najwyżej 24 miesiące, praca poza działalnością sezonową, start najpóźniej 6 miesięcy od złożenia. Zezwolenie na pracę: najwyżej 3 lata. Gruzji nie ma już na liście państw z oświadczeniem.',
    };
    zgloszenie = { tekst: 'Przy oświadczeniu pracodawca powiadamia starostę o podjęciu pracy w 7 dni, a o niepodjęciu w 14 dni; przy zezwoleniu wojewodę w przypadkach z art. 19', podstawa: `art. 19–20 i art. 70 ${U}` };
  } else {
    w = {
      werdykt: 'zezwolenie',
      naglowek: 'Potrzebne zezwolenie na pracę',
      podstawa: `art. 3 ust. 3 i art. 15 ${U}`,
      uwaga: 'Zezwolenie wydaje wojewoda, najwyżej na 3 lata. Obywatele Wenezueli, Gruzji i Kolumbii nie mogą pracować na zezwoleniu podczas pobytu bez wizy (rozporządzenie Dz.U. 2026 poz. 1072).',
    };
    zgloszenie = { tekst: 'Pracodawca powiadamia wojewodę w 7 dni, gdy praca nie zaczęła się w 2 miesiące od początku ważności zezwolenia, gdy przerwa trwa ponad 2 miesiące albo gdy praca kończy się wcześniej niż 2 miesiące przed końcem zezwolenia', podstawa: `art. 19–20 ${U}` };
  }

  const obowiazki: Obowiazek[] = [
    { tekst: 'Umowa na piśmie przed dopuszczeniem do pracy', podstawa: `art. 5 ust. 1 ${U}` },
    { tekst: 'Gdy cudzoziemiec nie zna polskiego: treść umowy na piśmie w zrozumiałym języku przed podpisaniem', podstawa: `art. 5 ust. 2 ${U}` },
    { tekst: 'Pisemna informacja o prawie wstępowania do związków zawodowych, w zrozumiałym języku', podstawa: `art. 5 ust. 4 ${U}` },
  ];
  const bezKopii = obywatelstwo === 'szwajcaria' || pobyt === 'rodzina';
  if (!bezKopii) obowiazki.push({ tekst: 'Przed rozpoczęciem pracy pracodawca żąda ważnego dokumentu pobytowego i przechowuje jego kopię', podstawa: `art. 4 ust. 2–4 ${U}` });
  if (w.werdykt === 'oswiadczenie-lub-zezwolenie' || w.werdykt === 'zezwolenie') {
    obowiazki.push(
      { tekst: 'Pracodawca przekazuje umowę do urzędu przed powierzeniem pracy', podstawa: `art. 17 ust. 1 pkt 2 i art. 68 ust. 1 pkt 2 ${U}` },
      { tekst: 'Wynagrodzenie nie niższe niż płaca minimalna i płaca osób na porównywalnym stanowisku', podstawa: `art. 30 ust. 1 pkt 2 i art. 65 ust. 1 pkt 1 ${U}` },
    );
  }
  if (zgloszenie) obowiazki.push(zgloszenie);
  return { ...w, obowiazki };
}
