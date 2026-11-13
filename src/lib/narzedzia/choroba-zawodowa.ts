// Choroba zawodowa: czy choroba jest w wykazie, do kiedy po zakończeniu pracy w narażeniu muszą wystąpić udokumentowane
// objawy, kto i komu zgłasza podejrzenie, terminy postępowania i świadczenia.
//
// Przepisy (stan na 13.11.2026):
// - Rozporządzenie Rady Ministrów z 30 czerwca 2009 r. w sprawie chorób zawodowych, t.j. Dz.U. 2026 poz. 1297 (obejmuje
//   zmianę Dz.U. 2025 poz. 1582 z 21.12.2025: nowe brzmienie poz. 5 i 21, nowa poz. 6a i 17 pkt 10–11; po t.j. bez zmian):
//   § 2 i załącznik (wykaz z kolumną „okres, w którym wystąpienie udokumentowanych objawów chorobowych upoważnia do
//   rozpoznania choroby zawodowej pomimo wcześniejszego zakończenia pracy w narażeniu zawodowym”), § 3 (zgłoszenie
//   niezwłocznie do państwowego inspektora sanitarnego i okręgowego inspektora pracy), § 4 (ocena narażenia,
//   skierowanie do jednostki orzeczniczej I stopnia), § 5 (jednostki I i II stopnia), § 6 (orzeczenie lekarskie),
//   § 7 (wniosek o ponowne badanie w 14 dni od otrzymania orzeczenia, za pośrednictwem jednostki I stopnia),
//   § 8 (decyzja inspektora sanitarnego), § 9 (karta stwierdzenia w 14 dni od dnia, w którym decyzja stała się ostateczna).
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 230 (przeniesienie przy objawach, dodatek wyrównawczy do 6 miesięcy),
//   art. 231, art. 235 § 1, 2, 2¹, 2² (kto zgłasza; pracownik aktualnie zatrudniony przez lekarza profilaktyka),
//   art. 235 § 3, art. 235¹ (definicja: tylko choroba z wykazu), art. 235² (rozpoznanie po zakończeniu pracy
//   w narażeniu, gdy objawy wystąpiły w okresie z wykazu), art. 237¹ § 1.
// - Ustawa wypadkowa, t.j. Dz.U. 2025 poz. 1644 (zmiana Dz.U. 2026 poz. 26 dotyczy orzekania w ZUS dopiero od 1.01.2027):
//   art. 3 ust. 1 (wypadek przy pracy), art. 4, art. 5 ust. 2–3, art. 6 ust. 1 (świadczenia), art. 8–9 (zasiłek od
//   pierwszego dnia, 100%), art. 11–12 (jednorazowe odszkodowanie), art. 15 ust. 3 (wypłata w 30 dni od decyzji),
//   art. 17 ust. 2, art. 18 ust. 1. Kwota za 1% uszczerbku z obwieszczenia (odszkodowanie-wypadek.ts, KWOTY_ODSZKODOWAN).
// - Kodeks postępowania administracyjnego, t.j. Dz.U. 2025 poz. 1691: art. 127 § 1–2, art. 129 § 1–2 (odwołanie od
//   decyzji inspektora w 14 dni od doręczenia, za pośrednictwem organu, który ją wydał).
//
// Interpretacje (przepis nie rozstrzyga; wariant bezpieczny dla pracującego, opis na stronie w „Jak liczymy”):
// 1. Okres z wykazu liczymy od ostatniego dnia pracy w narażeniu (art. 235² i § 2 mówią o okresie „pomimo wcześniejszego
//    zakończenia pracy w narażeniu”, bez punktu startowego). Sposób liczenia jak w art. 111 § 2 i art. 112 Kodeksu
//    cywilnego: dnia zakończenia nie liczymy, okres w latach i miesiącach kończy się w dniu, który datą odpowiada dniowi
//    zakończenia (gdy takiego dnia nie ma: w ostatnim dniu miesiąca). Dzień wyniku liczymy włącznie, czyli najpóźniejszy
//    możliwy wariant.
// 2. Liczy się wystąpienie udokumentowanych objawów w tym okresie, nie data zgłoszenia ani rozpoznania. Termin na
//    zgłoszenie podejrzenia przez pracownika przepis nie podaje.
// 3. Okresy „nie można określić”, „indywidualnie…” i „w zależności od rodzaju substancji” nie dają daty: nie piszemy, że
//    to brak limitu, tylko że ocenia lekarz orzecznik.
// 4. Choroba spoza wykazu nie jest chorobą zawodową (art. 235¹). Pokazujemy to dla chorób kręgosłupa, o które pytają
//    ludzie z hali; wykaz ich nie wymienia (sprawdzone w tekście jednolitym).
// 5. Narzędzie porównuje daty z przepisem i nie ocenia, czy objawy to choroba zawodowa: rozpoznaje lekarz jednostki
//    orzeczniczej (§ 6), a stwierdza decyzją państwowy inspektor sanitarny (§ 8).
// 6. Pracownik, który już nie jest zatrudniony, zgłasza sam: wymóg pośrednictwa lekarza (art. 235 § 2²) dotyczy
//    „pracownika aktualnie zatrudnionego”. Osobę zatrudnioną u innego pracodawcy traktujemy jak pracownika aktualnie
//    zatrudnionego (dosłowne brzmienie).

import { kwotyNaDzien } from './odszkodowanie-wypadek';
import { zl } from './format';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajMiesiace, poprawnaData } from './terminy';

export interface CzasWykazu {
  miesiace?: number;
  dni?: number;
}

export interface PozycjaWykazu {
  /** Identyfikator wyboru w formularzu (numer pozycji, dla zatruć z dopiskiem). */
  id: string;
  /** Numer w wykazie: „20.1” = poz. 20 pkt 1. */
  poz: string;
  /** Numer pozycji z nagłówkiem grupy (GRUPY), gdy to punkt pozycji. */
  grupa?: string;
  /** Brzmienie z wykazu (kolumna 1). */
  nazwa: string;
  /** Krótka nazwa do listy wyboru. */
  krotko: string;
  /** Brzmienie okresu z wykazu (kolumna 2). */
  okres: string;
  /** Okres w liczbach; null, gdy wykaz nie podaje go w dniach, miesiącach ani latach. */
  czas: CzasWykazu | null;
}

export const GRUPY: Record<string, { nazwa: string; krotko: string }> = {
  '3': { nazwa: 'Pylice płuc', krotko: 'Pylice płuc' },
  '4': { nazwa: 'Choroby opłucnej lub osierdzia wywołane pyłem azbestu', krotko: 'Azbest: opłucna, osierdzie' },
  '7': { nazwa: 'Zewnątrzpochodne alergiczne zapalenie pęcherzyków płucnych', krotko: 'Pęcherzyki płucne' },
  '15': { nazwa: 'Przewlekłe choroby narządu głosu spowodowane nadmiernym wysiłkiem głosowym, trwającym co najmniej 15 lat', krotko: 'Narząd głosu' },
  '16': { nazwa: 'Choroby wywołane działaniem promieniowania jonizującego', krotko: 'Promieniowanie jonizujące' },
  '17': { nazwa: 'Nowotwory złośliwe powstałe w następstwie działania czynników występujących w środowisku pracy, uznanych za rakotwórcze u ludzi', krotko: 'Nowotwory złośliwe' },
  '18': { nazwa: 'Choroby skóry', krotko: 'Choroby skóry' },
  '19': { nazwa: 'Przewlekłe choroby układu ruchu wywołane sposobem wykonywania pracy', krotko: 'Układ ruchu' },
  '20': { nazwa: 'Przewlekłe choroby obwodowego układu nerwowego wywołane sposobem wykonywania pracy', krotko: 'Nerwy obwodowe' },
  '22': { nazwa: 'Zespół wibracyjny', krotko: 'Zespół wibracyjny' },
  '23': { nazwa: 'Choroby wywołane pracą w warunkach podwyższonego ciśnienia atmosferycznego', krotko: 'Podwyższone ciśnienie' },
  '24': { nazwa: 'Choroby wywołane działaniem wysokich albo niskich temperatur otoczenia', krotko: 'Wysoka i niska temperatura' },
  '25': { nazwa: 'Choroby układu wzrokowego wywołane czynnikami fizycznymi, chemicznymi lub biologicznymi', krotko: 'Oczy' },
};

export const WYKAZ: readonly PozycjaWykazu[] = [
  { id: '1-ostre', poz: '1', nazwa: 'Zatrucia ostre albo przewlekłe lub ich następstwa wywołane przez substancje chemiczne', krotko: 'Zatrucie ostre', okres: 'w przypadku zatruć ostrych – 3 dni, w przypadku zatruć przewlekłych – w zależności od rodzaju substancji', czas: { dni: 3 } },
  { id: '1-przewlekle', poz: '1', nazwa: 'Zatrucia ostre albo przewlekłe lub ich następstwa wywołane przez substancje chemiczne', krotko: 'Zatrucie przewlekłe', okres: 'w przypadku zatruć ostrych – 3 dni, w przypadku zatruć przewlekłych – w zależności od rodzaju substancji', czas: null },
  { id: '2', poz: '2', nazwa: 'Gorączka metaliczna', krotko: 'Gorączka metaliczna', okres: '3 dni', czas: { dni: 3 } },
  { id: '3.1', poz: '3.1', grupa: '3', nazwa: 'pylica krzemowa', krotko: 'Pylica krzemowa', okres: 'nie można określić', czas: null },
  { id: '3.2', poz: '3.2', grupa: '3', nazwa: 'pylica górników kopalń węgla', krotko: 'Pylica górników węgla', okres: 'nie można określić', czas: null },
  { id: '3.3', poz: '3.3', grupa: '3', nazwa: 'pylico-gruźlica', krotko: 'Pylico-gruźlica', okres: 'nie można określić', czas: null },
  { id: '3.4', poz: '3.4', grupa: '3', nazwa: 'pylica spawaczy', krotko: 'Pylica spawaczy', okres: 'nie można określić', czas: null },
  { id: '3.5', poz: '3.5', grupa: '3', nazwa: 'pylica azbestowa oraz pozostałe pylice krzemianowe', krotko: 'Pylica azbestowa, krzemianowe', okres: 'nie można określić', czas: null },
  { id: '3.6', poz: '3.6', grupa: '3', nazwa: 'pylica talkowa', krotko: 'Pylica talkowa', okres: 'nie można określić', czas: null },
  { id: '3.7', poz: '3.7', grupa: '3', nazwa: 'pylica grafitowa', krotko: 'Pylica grafitowa', okres: 'nie można określić', czas: null },
  { id: '3.8', poz: '3.8', grupa: '3', nazwa: 'pylice wywoływane pyłami metali', krotko: 'Pylice od pyłów metali', okres: 'nie można określić', czas: null },
  { id: '4.1', poz: '4.1', grupa: '4', nazwa: 'rozległe zgrubienia opłucnej', krotko: 'Zgrubienia opłucnej', okres: 'nie można określić', czas: null },
  { id: '4.2', poz: '4.2', grupa: '4', nazwa: 'rozległe blaszki opłucnej lub osierdzia', krotko: 'Blaszki opłucnej, osierdzia', okres: 'nie można określić', czas: null },
  { id: '4.3', poz: '4.3', grupa: '4', nazwa: 'wysięk opłucnowy', krotko: 'Wysięk opłucnowy', okres: '3 lata', czas: { miesiace: 36 } },
  { id: '5', poz: '5', nazwa: 'Przewlekłe obturacyjne zapalenie oskrzeli, które spowodowało trwałe upośledzenie sprawności wentylacyjnej płuc ze stosunkiem procentowym natężonej objętości wydechowej pierwszosekundowej (FEV1) do pojemności życiowej (VC) wynoszącym poniżej 0,7 po leku rozszerzającym oskrzela', krotko: 'Obturacyjne zapalenie oskrzeli', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '6', poz: '6', nazwa: 'Astma oskrzelowa', krotko: 'Astma oskrzelowa', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '6a', poz: '6a', nazwa: 'Eozynofilowe zapalenie oskrzeli', krotko: 'Eozynofilowe zapalenie oskrzeli', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '7.1', poz: '7.1', grupa: '7', nazwa: 'postać ostra i podostra', krotko: 'Pęcherzyki płucne, ostre', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '7.2', poz: '7.2', grupa: '7', nazwa: 'postać przewlekła', krotko: 'Pęcherzyki płucne, przewlekłe', okres: '3 lata', czas: { miesiace: 36 } },
  { id: '8', poz: '8', nazwa: 'Ostre uogólnione reakcje alergiczne', krotko: 'Ostra reakcja alergiczna', okres: '1 dzień', czas: { dni: 1 } },
  { id: '9', poz: '9', nazwa: 'Byssinoza', krotko: 'Byssinoza', okres: '7 dni', czas: { dni: 7 } },
  { id: '10', poz: '10', nazwa: 'Beryloza', krotko: 'Beryloza', okres: 'nie można określić', czas: null },
  { id: '11', poz: '11', nazwa: 'Choroby płuc wywołane pyłem metali twardych', krotko: 'Płuca od pyłu metali twardych', okres: 'nie można określić', czas: null },
  { id: '12', poz: '12', nazwa: 'Alergiczny nieżyt nosa', krotko: 'Alergiczny nieżyt nosa', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '13', poz: '13', nazwa: 'Zapalenie obrzękowe krtani o podłożu alergicznym', krotko: 'Alergiczny obrzęk krtani', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '14', poz: '14', nazwa: 'Przedziurawienie przegrody nosa wywołane substancjami o działaniu żrącym lub drażniącym', krotko: 'Przedziurawienie przegrody nosa', okres: '2 lata', czas: { miesiace: 24 } },
  { id: '15.1', poz: '15.1', grupa: '15', nazwa: 'guzki głosowe twarde', krotko: 'Guzki głosowe', okres: '2 lata', czas: { miesiace: 24 } },
  { id: '15.2', poz: '15.2', grupa: '15', nazwa: 'wtórne zmiany przerostowe fałdów głosowych', krotko: 'Przerost fałdów głosowych', okres: '2 lata', czas: { miesiace: 24 } },
  { id: '15.3', poz: '15.3', grupa: '15', nazwa: 'niedowład mięśni wewnętrznych krtani z wrzecionowatą niedomykalnością fonacyjną głośni i trwałą dysfonią', krotko: 'Niedowład mięśni krtani', okres: '2 lata', czas: { miesiace: 24 } },
  { id: '16.1', poz: '16.1', grupa: '16', nazwa: 'ostra choroba popromienna uogólniona po napromieniowaniu całego ciała lub przeważającej jego części', krotko: 'Ostra choroba popromienna', okres: '2 miesiące', czas: { miesiace: 2 } },
  { id: '16.2', poz: '16.2', grupa: '16', nazwa: 'ostra choroba popromienna o charakterze zmian zapalnych lub zapalno-martwiczych skóry i tkanki podskórnej', krotko: 'Ostre zmiany skóry od promieni', okres: '1 miesiąc', czas: { miesiace: 1 } },
  { id: '16.3', poz: '16.3', grupa: '16', nazwa: 'przewlekłe popromienne zapalenie skóry', krotko: 'Popromienne zapalenie skóry', okres: 'nie można określić', czas: null },
  { id: '16.4', poz: '16.4', grupa: '16', nazwa: 'przewlekłe uszkodzenie szpiku kostnego', krotko: 'Uszkodzenie szpiku', okres: 'nie można określić', czas: null },
  { id: '16.5', poz: '16.5', grupa: '16', nazwa: 'zaćma popromienna', krotko: 'Zaćma popromienna', okres: '10 lat', czas: { miesiace: 120 } },
  { id: '17.1', poz: '17.1', grupa: '17', nazwa: 'rak płuca, rak oskrzela', krotko: 'Rak płuca, oskrzela', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.2', poz: '17.2', grupa: '17', nazwa: 'międzybłoniak opłucnej albo otrzewnej', krotko: 'Międzybłoniak', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.3', poz: '17.3', grupa: '17', nazwa: 'nowotwór układu krwiotwórczego', krotko: 'Nowotwór krwiotwórczy', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.4', poz: '17.4', grupa: '17', nazwa: 'nowotwór skóry', krotko: 'Nowotwór skóry', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.5', poz: '17.5', grupa: '17', nazwa: 'nowotwór pęcherza moczowego', krotko: 'Nowotwór pęcherza', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.6', poz: '17.6', grupa: '17', nazwa: 'nowotwór wątroby', krotko: 'Nowotwór wątroby', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.7', poz: '17.7', grupa: '17', nazwa: 'rak krtani', krotko: 'Rak krtani', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.8', poz: '17.8', grupa: '17', nazwa: 'nowotwór nosa i zatok przynosowych', krotko: 'Nowotwór nosa, zatok', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.9', poz: '17.9', grupa: '17', nazwa: 'nowotwory wywołane działaniem promieniowania jonizującego', krotko: 'Nowotwór od promieniowania', okres: 'indywidualnie, po oszacowaniu ryzyka z prawdopodobieństwem indukcji przekraczającym 10 %', czas: null },
  { id: '17.10', poz: '17.10', grupa: '17', nazwa: 'rak jajnika', krotko: 'Rak jajnika', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '17.11', poz: '17.11', grupa: '17', nazwa: 'nowotwór przewodu pokarmowego', krotko: 'Nowotwór przewodu pokarmowego', okres: 'indywidualnie w zależności od okresu latencji nowotworu', czas: null },
  { id: '18.1', poz: '18.1', grupa: '18', nazwa: 'alergiczne kontaktowe zapalenie skóry', krotko: 'Alergiczne zapalenie skóry', okres: '2 lata', czas: { miesiace: 24 } },
  { id: '18.2', poz: '18.2', grupa: '18', nazwa: 'kontaktowe zapalenie skóry z podrażnienia', krotko: 'Zapalenie skóry z podrażnienia', okres: '1 miesiąc', czas: { miesiace: 1 } },
  { id: '18.3', poz: '18.3', grupa: '18', nazwa: 'trądzik olejowy, smarowy lub chlorowy o rozległym charakterze', krotko: 'Trądzik olejowy, chlorowy', okres: '1 miesiąc', czas: { miesiace: 1 } },
  { id: '18.4', poz: '18.4', grupa: '18', nazwa: 'drożdżakowe zapalenie skóry rąk u osób pracujących w warunkach sprzyjających rozwojowi drożdżaków chorobotwórczych', krotko: 'Drożdżyca skóry rąk', okres: '1 miesiąc', czas: { miesiace: 1 } },
  { id: '18.5', poz: '18.5', grupa: '18', nazwa: 'grzybice skóry u osób stykających się z materiałem biologicznym pochodzącym od zwierząt', krotko: 'Grzybica skóry od zwierząt', okres: '1 miesiąc', czas: { miesiace: 1 } },
  { id: '18.6', poz: '18.6', grupa: '18', nazwa: 'pokrzywka kontaktowa', krotko: 'Pokrzywka kontaktowa', okres: '2 miesiące', czas: { miesiace: 2 } },
  { id: '18.7', poz: '18.7', grupa: '18', nazwa: 'fotodermatozy zawodowe', krotko: 'Fotodermatoza', okres: '2 lata', czas: { miesiace: 24 } },
  { id: '19.1', poz: '19.1', grupa: '19', nazwa: 'przewlekłe zapalenie ścięgna i jego pochewki', krotko: 'Zapalenie ścięgna, pochewki', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '19.2', poz: '19.2', grupa: '19', nazwa: 'przewlekłe zapalenie kaletki maziowej', krotko: 'Zapalenie kaletki maziowej', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '19.3', poz: '19.3', grupa: '19', nazwa: 'przewlekłe uszkodzenie łąkotki u osób wykonujących pracę w pozycji klęczącej lub kucznej', krotko: 'Uszkodzenie łąkotki', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '19.4', poz: '19.4', grupa: '19', nazwa: 'przewlekłe zapalenie okołostawowe barku', krotko: 'Zapalenie barku', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '19.5', poz: '19.5', grupa: '19', nazwa: 'przewlekłe zapalenie nadkłykcia kości ramiennej', krotko: 'Zapalenie nadkłykcia (łokieć)', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '19.6', poz: '19.6', grupa: '19', nazwa: 'zmęczeniowe złamanie kości', krotko: 'Zmęczeniowe złamanie kości', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '20.1', poz: '20.1', grupa: '20', nazwa: 'zespół cieśni w obrębie nadgarstka', krotko: 'Cieśń nadgarstka', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '20.2', poz: '20.2', grupa: '20', nazwa: 'zespół rowka nerwu łokciowego', krotko: 'Rowek nerwu łokciowego', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '20.3', poz: '20.3', grupa: '20', nazwa: 'zespół kanału de Guyona', krotko: 'Kanał Guyona', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '20.4', poz: '20.4', grupa: '20', nazwa: 'uszkodzenie nerwu strzałkowego wspólnego u osób wykonujących pracę w pozycji kucznej', krotko: 'Nerw strzałkowy (kucanie)', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '21', poz: '21', nazwa: 'Trwały odbiorczy ubytek słuchu typu ślimakowego lub czuciowo-nerwowego spowodowany hałasem, wyrażony podwyższeniem progu słuchu o wielkości co najmniej 45 dB, obliczony jako średnia arytmetyczna dla częstotliwości audiometrycznych 1, 2 i 3 kHz', krotko: 'Ubytek słuchu od hałasu', okres: '2 lata', czas: { miesiace: 24 } },
  { id: '22.1', poz: '22.1', grupa: '22', nazwa: 'postać naczyniowo-nerwowa', krotko: 'Naczyniowo-nerwowy', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '22.2', poz: '22.2', grupa: '22', nazwa: 'postać kostno-stawowa', krotko: 'Kostno-stawowy', okres: '3 lata', czas: { miesiace: 36 } },
  { id: '22.3', poz: '22.3', grupa: '22', nazwa: 'postać mieszana: naczyniowo-nerwowa i kostno-stawowa', krotko: 'Mieszany', okres: '3 lata', czas: { miesiace: 36 } },
  { id: '23.1', poz: '23.1', grupa: '23', nazwa: 'choroba dekompresyjna', krotko: 'Choroba dekompresyjna', okres: '5 lat', czas: { miesiace: 60 } },
  { id: '23.2', poz: '23.2', grupa: '23', nazwa: 'urazy ciśnieniowe', krotko: 'Uraz ciśnieniowy', okres: '3 dni', czas: { dni: 3 } },
  { id: '23.3', poz: '23.3', grupa: '23', nazwa: 'następstwa oddychania mieszaninami gazowymi pod zwiększonym ciśnieniem', krotko: 'Gazy pod ciśnieniem', okres: '3 dni', czas: { dni: 3 } },
  { id: '24.1', poz: '24.1', grupa: '24', nazwa: 'udar cieplny albo jego następstwa', krotko: 'Udar cieplny', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '24.2', poz: '24.2', grupa: '24', nazwa: 'wyczerpanie cieplne albo jego następstwa', krotko: 'Wyczerpanie cieplne', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '24.3', poz: '24.3', grupa: '24', nazwa: 'odmroziny', krotko: 'Odmroziny', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '25.1', poz: '25.1', grupa: '25', nazwa: 'alergiczne zapalenie spojówek', krotko: 'Alergiczne zapalenie spojówek', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '25.2', poz: '25.2', grupa: '25', nazwa: 'ostre zapalenie spojówek wywołane promieniowaniem nadfioletowym', krotko: 'Spojówki od nadfioletu', okres: '3 dni', czas: { dni: 3 } },
  { id: '25.3', poz: '25.3', grupa: '25', nazwa: 'epidemiczne wirusowe zapalenie spojówek lub rogówki', krotko: 'Wirusowe zapalenie spojówek', okres: '1 rok', czas: { miesiace: 12 } },
  { id: '25.4', poz: '25.4', grupa: '25', nazwa: 'zwyrodnienie rogówki wywołane czynnikami drażniącymi', krotko: 'Zwyrodnienie rogówki', okres: '3 lata', czas: { miesiace: 36 } },
  { id: '25.5', poz: '25.5', grupa: '25', nazwa: 'zaćma wywołana działaniem promieniowania podczerwonego lub długofalowego nadfioletowego', krotko: 'Zaćma od podczerwieni, UV', okres: '10 lat', czas: { miesiace: 120 } },
  { id: '25.6', poz: '25.6', grupa: '25', nazwa: 'centralne zmiany zwyrodnieniowe siatkówki i naczyniówki wywołane krótkofalowym promieniowaniem podczerwonym lub promieniowaniem widzialnym z obszaru widma niebieskiego', krotko: 'Siatkówka od światła', okres: '3 lata', czas: { miesiace: 36 } },
  { id: '26', poz: '26', nazwa: 'Choroby zakaźne lub pasożytnicze albo ich następstwa', krotko: 'Choroba zakaźna, pasożytnicza', okres: 'nie można określić', czas: null },
];

/** Wybór spoza wykazu, o który często pytają ludzie z hali. */
export const SPOZA_WYKAZU = { id: 'kregoslup', krotko: 'Kręgosłup (np. dyskopatia)' } as const;

export const pozycja = (id: string) => WYKAZ.find((p) => p.id === id) ?? null;

/** „20.1” → „poz. 20 pkt 1”, „6a” → „poz. 6a”. */
export const numerPozycji = (poz: string) => {
  const [p, pkt] = poz.split('.');
  return pkt ? `poz. ${p} pkt ${pkt}` : `poz. ${p}`;
};

/** Pełne brzmienie pozycji: nagłówek grupy i punkt. */
export const pelnaNazwa = (p: PozycjaWykazu) => (p.grupa ? `${GRUPY[p.grupa].nazwa}: ${p.nazwa}` : p.nazwa);

export type Narazenie = 'trwa' | 'koniec-pracuje' | 'koniec-nie-pracuje';
export const NARAZENIA: readonly Narazenie[] = ['trwa', 'koniec-pracuje', 'koniec-nie-pracuje'];

export interface DaneChoroby {
  /** Identyfikator pozycji wykazu albo SPOZA_WYKAZU.id. */
  choroba: string;
  narazenie: Narazenie;
  /** Ostatni dzień pracy w narażeniu (RRRR-MM-DD), gdy narażenie się skończyło. */
  koniec?: string;
  /** Dzień pierwszych udokumentowanych objawów (RRRR-MM-DD), opcjonalnie. */
  objawy?: string;
}

export type Stan =
  | 'spoza-wykazu'
  | 'w-narazeniu'
  | 'termin'
  | 'termin-minal'
  | 'objawy-w-okresie'
  | 'objawy-po-okresie'
  | 'bez-daty';

export interface WynikChoroby {
  stan: Stan;
  pozycja: PozycjaWykazu | null;
  /** Ostatni dzień okresu z wykazu (włącznie). */
  termin?: string;
  /** Dni od dziś do terminu (ujemne, gdy minął). */
  dniDoTerminu?: number;
}

export const MIN_DATA = '1950-01-01';

export class BladDanych extends Error {
  constructor(
    message: string,
    readonly pole: 'koniec' | 'objawy',
  ) {
    super(message);
  }
}

/** Ostatni dzień okresu z wykazu: od dnia po zakończeniu narażenia, jak art. 111 § 2 i 112 KC. */
export function koniecOkresu(koniec: string, czas: CzasWykazu): string {
  if (czas.miesiace) return dodajMiesiace(koniec, czas.miesiace);
  return dodajDni(koniec, czas.dni ?? 0);
}

export function sprawdzChorobe(d: DaneChoroby, dzis: string): WynikChoroby {
  if (d.choroba === SPOZA_WYKAZU.id) return { stan: 'spoza-wykazu', pozycja: null };
  const p = pozycja(d.choroba);
  if (!p) throw new RangeError('Nieznana pozycja wykazu');
  if (d.narazenie === 'trwa') return { stan: 'w-narazeniu', pozycja: p };

  const koniec = d.koniec ?? '';
  if (!poprawnaData(koniec) || koniec < MIN_DATA) throw new BladDanych('Wpisz ostatni dzień pracy w narażeniu.', 'koniec');
  if (koniec > dzis) throw new BladDanych('Ostatni dzień pracy w narażeniu nie może być później niż dziś. Jeśli nadal tak pracujesz, wybierz „Tak, nadal”.', 'koniec');
  const objawy = d.objawy || undefined;
  if (objawy !== undefined) {
    if (!poprawnaData(objawy) || objawy < MIN_DATA) throw new BladDanych('Wpisz dzień pierwszych udokumentowanych objawów albo zostaw pole puste.', 'objawy');
    if (objawy > dzis) throw new BladDanych('Dzień objawów nie może być później niż dziś.', 'objawy');
  }

  if (!p.czas) return { stan: 'bez-daty', pozycja: p };
  const termin = koniecOkresu(koniec, p.czas);
  const dniDoTerminu = dniMiedzy(dzis, termin);
  if (objawy !== undefined) return { stan: objawy <= termin ? 'objawy-w-okresie' : 'objawy-po-okresie', pozycja: p, termin, dniDoTerminu };
  return { stan: dniDoTerminu >= 0 ? 'termin' : 'termin-minal', pozycja: p, termin, dniDoTerminu };
}

// ——— Teksty wyniku (wspólne dla HTML z serwera i skryptu w przeglądarce) ———

export interface Wiersz {
  dt: string;
  dd: string;
  opis: string;
}
export interface TekstyChoroby {
  glowny: string;
  podstawa: string;
  wiersze: Wiersz[];
  uwagi: string[];
}

const KP = 'Kodeksu pracy';
const ROZP = 'rozporządzenia w sprawie chorób zawodowych';
const KTO_ROZPOZNAJE = `Narzędzie porównuje daty z przepisem. Czy to choroba zawodowa, ocenia lekarz jednostki orzeczniczej (§ 6 ${ROZP}), a stwierdza decyzją państwowy inspektor sanitarny (§ 8).`;

/** „za 45 dni”, „dziś”, „45 dni temu”. */
const zaIle = (dni: number) => {
  if (dni === 0) return 'to dziś';
  const n = Math.abs(dni);
  const s = n === 1 ? 'dzień' : 'dni';
  return dni > 0 ? `zostało ${n} ${s}` : `minęło ${n} ${s} temu`;
};

function wierszZgloszenia(d: DaneChoroby): Wiersz {
  if (d.narazenie === 'koniec-nie-pracuje')
    return {
      dt: 'Kto zgłasza',
      dd: 'Możesz Ty, sam lub sama',
      opis: `Były pracownik może zgłosić podejrzenie choroby zawodowej (art. 235 § 2² ${KP}); pośrednictwa lekarza przepis wymaga tylko od pracownika aktualnie zatrudnionego. Zgłoszenie trafia do państwowego inspektora sanitarnego i okręgowego inspektora pracy właściwych dla miejsca pracy w narażeniu (§ 3 ust. 1 ${ROZP}). Każdy lekarz, który podejrzewa chorobę zawodową, kieruje na badania (art. 235 § 2¹).`,
    };
  return {
    dt: 'Kto zgłasza',
    dd: 'Ty, przez lekarza medycyny pracy',
    opis: `Pracownik aktualnie zatrudniony zgłasza podejrzenie za pośrednictwem lekarza, który sprawuje nad nim profilaktyczną opiekę zdrowotną (art. 235 § 2² ${KP}). Pracodawca musi niezwłocznie zgłosić każde podejrzenie (art. 235 § 1), a każdy lekarz, który podejrzewa chorobę zawodową, kieruje na badania (art. 235 § 2¹). Zgłoszenie trafia do państwowego inspektora sanitarnego i okręgowego inspektora pracy (§ 3 ust. 1 ${ROZP}).`,
  };
}

const WIERSZE_POSTEPOWANIA: Wiersz[] = [
  {
    dt: 'Badanie',
    dd: 'Skierowanie od inspektora sanitarnego',
    opis: `Inspektor sanitarny ocenia narażenie zawodowe i kieruje na badania do jednostki orzeczniczej I stopnia, np. poradni chorób zawodowych wojewódzkiego ośrodka medycyny pracy (§ 4 ust. 1 i § 5 ust. 2 ${ROZP}). Lekarz wydaje orzeczenie o rozpoznaniu choroby zawodowej albo o braku podstaw do jej rozpoznania (§ 6 ust. 1).`,
  },
  {
    dt: 'Nie zgadzasz się z orzeczeniem',
    dd: '14 dni na wniosek',
    opis: `Wniosek o ponowne badanie w jednostce II stopnia (instytut medycyny pracy) składasz w 14 dni od dnia otrzymania orzeczenia, za pośrednictwem jednostki, która je wydała (§ 5 ust. 3 i § 7 ust. 1–2 ${ROZP}).`,
  },
  {
    dt: 'Decyzja',
    dd: 'Inspektor sanitarny, odwołanie 14 dni',
    opis: `Państwowy inspektor sanitarny wydaje decyzję o stwierdzeniu choroby zawodowej albo o braku podstaw do jej stwierdzenia (§ 8 ust. 1 ${ROZP}). Odwołanie wnosisz w 14 dni od doręczenia decyzji do organu wyższego stopnia, za pośrednictwem inspektora, który ją wydał (art. 127 § 2 i art. 129 § 1–2 Kodeksu postępowania administracyjnego).`,
  },
];

function wierszSwiadczen(dzis: string): Wiersz {
  const k = kwotyNaDzien(dzis);
  const kwota = k ? ` Za każdy procent stałego lub długotrwałego uszczerbku na zdrowiu: ${zl(k.zaProcent)} przy decyzji ZUS wydanej od ${dataPoPolsku(k.od)} do ${dataPoPolsku(k.do)} (${k.zrodlo}).` : '';
  return {
    dt: 'Po stwierdzeniu',
    dd: 'Świadczenia z ZUS',
    opis: `Z ubezpieczenia wypadkowego: zasiłek chorobowy w wysokości 100% podstawy od pierwszego dnia niezdolności do pracy, świadczenie rehabilitacyjne, zasiłek wyrównawczy, jednorazowe odszkodowanie, renta z tytułu niezdolności do pracy i renta szkoleniowa (art. 6 ust. 1, art. 8 ust. 2 i art. 9 ust. 1 ustawy wypadkowej).${kwota}`,
  };
}

const WIERSZ_PRZENIESIENIA: Wiersz = {
  dt: 'Objawy w czasie pracy',
  dd: 'Przeniesienie do innej pracy',
  opis: `Na podstawie orzeczenia lekarskiego pracodawca przenosi pracownika do pracy, która nie naraża go na czynnik wywołujący objawy; gdy wynagrodzenie spada, przysługuje dodatek wyrównawczy przez najwyżej 6 miesięcy (art. 230 § 1–2 ${KP}).`,
};

export function tekstyChoroby(d: DaneChoroby, w: WynikChoroby, dzis: string): TekstyChoroby {
  if (w.stan === 'spoza-wykazu') {
    return {
      glowny: 'Nie ma w wykazie',
      podstawa: `Chorobą zawodową może być tylko choroba wymieniona w wykazie chorób zawodowych (art. 235¹ ${KP}). Wykaz nie wymienia chorób kręgosłupa, np. dyskopatii czy przepukliny krążka.`,
      wiersze: [
        {
          dt: 'Co jest w wykazie z układu ruchu',
          dd: 'Poz. 19 i 20',
          opis: 'Przewlekłe choroby układu ruchu wywołane sposobem wykonywania pracy (np. zapalenie ścięgna, kaletki, barku, nadkłykcia, uszkodzenie łąkotki, zmęczeniowe złamanie kości) i przewlekłe choroby obwodowego układu nerwowego (np. zespół cieśni w obrębie nadgarstka). Okres po zakończeniu pracy w narażeniu: 1 rok.',
        },
        {
          dt: 'Nagły uraz w pracy',
          dd: 'To może być wypadek przy pracy',
          opis: 'Wypadek przy pracy to nagłe zdarzenie wywołane przyczyną zewnętrzną, powodujące uraz lub śmierć, które nastąpiło w związku z pracą (art. 3 ust. 1 ustawy wypadkowej). Ma osobną procedurę i też daje świadczenia z ZUS.',
        },
      ],
      uwagi: ['Narzędzie mówi, co mówi przepis, i nie ocenia stanu zdrowia. Choroby spoza wykazu nie dają świadczeń z ustawy wypadkowej z tytułu choroby zawodowej.'],
    };
  }
  const p = w.pozycja!;
  const nr = numerPozycji(p.poz);
  const wiersze: Wiersz[] = [{ dt: 'W wykazie', dd: nr.replace(/^poz/, 'Poz'), opis: `${pelnaNazwa(p)}.` }];
  const okresWiersz: Wiersz = {
    dt: 'Okres po zakończeniu pracy w narażeniu',
    dd: p.okres.charAt(0).toUpperCase() + p.okres.slice(1),
    opis: `W tym okresie muszą wystąpić udokumentowane objawy, żeby można było rozpoznać chorobę zawodową mimo wcześniejszego zakończenia pracy w narażeniu (art. 235² ${KP}, załącznik do ${ROZP}).`,
  };
  let glowny: string;
  let podstawa: string;
  const uwagi: string[] = [];

  if (w.stan === 'w-narazeniu') {
    glowny = `Jest w wykazie: ${nr}`;
    podstawa = `Rozpoznanie choroby zawodowej może nastąpić w okresie zatrudnienia w narażeniu zawodowym (art. 235² ${KP}). Po zakończeniu takiej pracy objawy muszą wystąpić w okresie z wykazu: ${p.okres}.`;
    wiersze.push(okresWiersz, WIERSZ_PRZENIESIENIA);
  } else if (w.stan === 'bez-daty') {
    glowny = p.okres.startsWith('indywidualnie') ? 'Okres: indywidualnie' : `Okres: ${p.okres.replace(/^w przypadku zatruć ostrych – 3 dni, w przypadku zatruć przewlekłych – /, '')}`;
    podstawa = `Choroba jest w wykazie (${nr}), ale wykaz nie podaje dla niej okresu w dniach, miesiącach ani latach. Przepis nie mówi, czy to brak limitu: ocenia lekarz jednostki orzeczniczej na podstawie dokumentacji i oceny narażenia (§ 6 ${ROZP}).`;
    wiersze.push(okresWiersz);
  } else {
    const t = dataPoPolsku(w.termin!);
    okresWiersz.opis += ` Ostatni dzień pracy w narażeniu: ${dataPoPolsku(d.koniec!)}; liczymy od następnego dnia.`;
    wiersze.push(okresWiersz);
    if (w.stan === 'objawy-w-okresie') {
      glowny = 'Objawy w okresie z wykazu';
      podstawa = `Choroba jest w wykazie (${nr}). Pierwsze udokumentowane objawy z ${dataPoPolsku(d.objawy!)} mieszczą się w okresie, który trwa do ${t} włącznie, więc termin z art. 235² ${KP} nie zamyka drogi do rozpoznania.`;
    } else if (w.stan === 'objawy-po-okresie') {
      glowny = 'Objawy po okresie z wykazu';
      podstawa = `Choroba jest w wykazie (${nr}), ale okres na udokumentowane objawy trwał do ${t}, a wpisane objawy są z ${dataPoPolsku(d.objawy!)}, czyli później. Jeśli objawy były wcześniej i są w dokumentacji (np. u lekarza), liczy się ta wcześniejsza data.`;
    } else if (w.stan === 'termin') {
      glowny = `Objawy do ${t}`;
      podstawa = `Choroba jest w wykazie (${nr}). Udokumentowane objawy muszą wystąpić najpóźniej ${t} (${zaIle(w.dniDoTerminu!)}). Zgłoszenie i badanie mogą być później: liczy się data objawów w dokumentacji.`;
    } else {
      glowny = `Okres minął ${t}`;
      podstawa = `Choroba jest w wykazie (${nr}). Okres na udokumentowane objawy trwał do ${t} (${zaIle(w.dniDoTerminu!)}). Jeśli objawy wystąpiły wcześniej i są w dokumentacji, wpisz ich datę.`;
    }
  }
  wiersze.push(wierszZgloszenia(d), ...WIERSZE_POSTEPOWANIA, wierszSwiadczen(dzis));
  uwagi.push(KTO_ROZPOZNAJE);
  if (p.poz === '21') uwagi.push('Wykaz wymaga ubytku słuchu o co najmniej 45 dB jako średniej dla 1, 2 i 3 kHz. Od 21 grudnia 2025 r. przepis nie wymaga już, żeby ubytek był obustronny ani mierzony w uchu lepiej słyszącym (Dz.U. 2025 poz. 1582).');
  if (p.grupa === '15') uwagi.push('Ta grupa wymaga nadmiernego wysiłku głosowego trwającego co najmniej 15 lat.');
  if (p.poz === '19.3' || p.poz === '20.4') uwagi.push(`Ta pozycja dotyczy osób pracujących w pozycji ${p.poz === '19.3' ? 'klęczącej lub kucznej' : 'kucznej'}.`);
  return { glowny, podstawa, wiersze, uwagi };
}
