// Oczekiwane wartości policzone niezależnie w Pythonie (decimal, calendar) przez budowniczego, weryfikatora i audytora
// (20 000 losowych dat i kwot bez rozbieżności; skrypty poza repozytorium, opis w raporcie pakietu):
// nieumyślna 20 000 zł przy 5200 zł → 15 600 zł; 3000 zł → 3000 zł; 20 000 − 8000 zł przy 3000 zł → 9000 zł;
// wspólne 9000,50 zł × 33,33% → 2999,87 zł; powierzone 12 000 − 1500 zł → 10 500 zł;
// art. 291 § 2: szkoda 10.03.2026, wiedza 2.04.2026 → 2.04.2027; szkoda 30.06.2023, wiedza 15.01.2026 → 30.06.2026
// (137 dni przed 14.11.2026); wiedza 29.02.2024 → 28.02.2025;
// art. 442¹: szkoda 29.02.2020, wiedza 29.02.2024 → 28.02.2027, koniec roku 31.12.2027, przestępstwo 29.02.2040;
// szkoda 15.05.2016, wiedza 10.01.2025 → 15.05.2026 (10 lat), koniec roku 31.12.2026, przestępstwo 15.05.2036.
import { describe, expect, it } from 'vitest';
import { bladDanych, granicaOdszkodowania, opisOdpowiedzialnosci, przedawnienieRoszczenia, przesunietyKoniec, SPOR_ART_115, sporArt115, type DaneOdpowiedzialnosci } from './odpowiedzialnosc';

const DZIS = '2026-11-14';
const dane = (x: Partial<DaneOdpowiedzialnosci>): DaneOdpowiedzialnosci => ({
  sytuacja: 'nieumyslna',
  szkoda: 20000,
  wynagrodzenie: 5200,
  dataSzkody: '2026-03-10',
  dataWiedzy: '2026-04-02',
  ...x,
});
const bezSpacji = (t: string) => t.replace(/\s/g, ' ');

describe('górna granica odszkodowania', () => {
  it('wina nieumyślna: limit trzech pensji (art. 119)', () => {
    const g = granicaOdszkodowania(dane({}));
    expect(g.kwota).toBe(15600);
    expect(g.limitDziala).toBe(true);
    expect(granicaOdszkodowania(dane({ szkoda: 3000 })).kwota).toBe(3000);
    expect(granicaOdszkodowania(dane({ szkoda: 3000 })).limitDziala).toBe(false);
  });
  it('limit równy szkodzie nie „działa”, a grosze się zgadzają', () => {
    const g = granicaOdszkodowania(dane({ szkoda: 15600 }));
    expect(g.kwota).toBe(15600);
    expect(g.limitDziala).toBe(false);
    expect(granicaOdszkodowania(dane({ szkoda: 15600.01 })).limitDziala).toBe(true);
    expect(granicaOdszkodowania(dane({ szkoda: 0.3, wynagrodzenie: 0.1 })).kwota).toBe(0.3);
  });
  it('przyczynienie pracodawcy odejmujemy przed limitem (art. 117 § 1)', () => {
    expect(granicaOdszkodowania(dane({ szkoda: 20000, przyczynienie: 8000, wynagrodzenie: 3000 })).kwota).toBe(9000);
    expect(granicaOdszkodowania(dane({ szkoda: 20000, przyczynienie: 20000 })).kwota).toBe(0);
  });
  it('umyślna i powierzone: pełna wysokość bez limitu', () => {
    expect(granicaOdszkodowania(dane({ sytuacja: 'umyslna', szkoda: 50000 })).kwota).toBe(50000);
    expect(granicaOdszkodowania(dane({ sytuacja: 'powierzone', szkoda: 12000, przyczynienie: 1500 })).kwota).toBe(10500);
  });
  it('wspólne: część z umowy, zaokrąglona do grosza', () => {
    expect(granicaOdszkodowania(dane({ sytuacja: 'wspolne', szkoda: 9000.5, udzial: 33.33 })).kwota).toBe(2999.87);
    expect(granicaOdszkodowania(dane({ sytuacja: 'wspolne', szkoda: 9000, udzial: 100 })).kwota).toBe(9000);
    expect(granicaOdszkodowania(dane({ sytuacja: 'wspolne', szkoda: 0.01, udzial: 50 })).kwota).toBe(0.01);
  });
});

describe('przedawnienie roszczenia pracodawcy', () => {
  it('art. 291 § 2: rok od wiedzy, najpóźniej 3 lata od szkody', () => {
    expect(przedawnienieRoszczenia('nieumyslna', '2026-03-10', '2026-04-02').koniec).toBe('2027-04-02');
    expect(przedawnienieRoszczenia('powierzone', '2023-06-30', '2026-01-15').koniec).toBe('2026-06-30');
    expect(przedawnienieRoszczenia('wspolne', '2024-02-29', '2024-02-29').koniec).toBe('2025-02-28');
    expect(przedawnienieRoszczenia('nieumyslna', '2026-03-10', '2026-04-02').koniecRoku).toBeNull();
  });
  it('wina umyślna: art. 442¹ KC, wariant końca roku i przestępstwo', () => {
    const p = przedawnienieRoszczenia('umyslna', '2020-02-29', '2024-02-29');
    expect([p.koniec, p.koniecRoku, p.przestepstwo]).toEqual(['2027-02-28', '2027-12-31', '2040-02-29']);
    const q = przedawnienieRoszczenia('umyslna', '2016-05-15', '2025-01-10');
    expect([q.koniec, q.koniecRoku, q.przestepstwo]).toEqual(['2026-05-15', '2026-12-31', '2036-05-15']);
  });
});

describe('błędne dane', () => {
  it('kwoty, procent i daty', () => {
    expect(bladDanych(dane({ szkoda: 0 }), DZIS)?.pole).toBe('szkoda');
    expect(bladDanych(dane({ szkoda: Number.NaN }), DZIS)?.pole).toBe('szkoda');
    expect(bladDanych(dane({ przyczynienie: 20000.01 }), DZIS)?.pole).toBe('przyczynienie');
    expect(bladDanych(dane({ przyczynienie: Number.NaN }), DZIS)?.pole).toBe('przyczynienie');
    expect(bladDanych(dane({ wynagrodzenie: 0 }), DZIS)?.pole).toBe('wynagrodzenie');
    expect(bladDanych(dane({ sytuacja: 'umyslna', wynagrodzenie: Number.NaN }), DZIS)).toBeNull();
    expect(bladDanych(dane({ sytuacja: 'wspolne', udzial: 0 }), DZIS)?.pole).toBe('udzial');
    expect(bladDanych(dane({ sytuacja: 'wspolne', udzial: 100.01 }), DZIS)?.pole).toBe('udzial');
    expect(bladDanych(dane({ sytuacja: 'wspolne', udzial: 100 }), DZIS)).toBeNull();
    expect(bladDanych(dane({ dataSzkody: '2026-02-30' }), DZIS)?.pole).toBe('dataSzkody');
    expect(bladDanych(dane({ dataSzkody: '2026-11-15', dataWiedzy: '2026-11-15' }), DZIS)?.pole).toBe('dataSzkody');
    expect(bladDanych(dane({ dataWiedzy: '2026-03-09' }), DZIS)?.pole).toBe('dataWiedzy');
    expect(bladDanych(dane({ dataWiedzy: '2026-11-15' }), DZIS)?.pole).toBe('dataWiedzy');
    expect(bladDanych(dane({ dataSzkody: DZIS, dataWiedzy: DZIS }), DZIS)).toBeNull();
    expect(() => opisOdpowiedzialnosci(dane({ szkoda: -1 }), DZIS)).toThrow(RangeError);
  });
});

describe('teksty wyniku', () => {
  it('wina nieumyślna z limitem i terminem w toku', () => {
    const o = opisOdpowiedzialnosci(dane({}), DZIS);
    expect(bezSpacji(o.granica)).toBe('15 600,00 zł');
    expect(bezSpacji(o.granicaOpis)).toContain('3 × 5200,00 zł');
    expect(o.przedawnienie).toBe('2 kwietnia 2027 r.');
    expect(o.status).toBe('Pracodawcy zostało: 139 dni');
    expect(o.statusKlasa).toBe('w-terminie');
    expect(o.potracenie).toContain('art. 91 § 1');
    expect(o.uwagi.join(' ')).toContain('art. 121');
  });
  it('termin minął, ostatni dzień, odmiana', () => {
    const o = opisOdpowiedzialnosci(dane({ sytuacja: 'powierzone', dataSzkody: '2023-06-30', dataWiedzy: '2026-01-15' }), DZIS);
    expect(o.status).toBe('Termin pracodawcy minął 137 dni temu');
    expect(o.statusKlasa).toBe('po-terminie');
    expect(o.przedawnienieOpis).toContain('3 lata od szkody');
    expect(o.uwagi.join(' ')).toContain('halą spedycyjną');
    expect(o.uwagi.join(' ')).toContain('§ 6 ust. 1');
    expect(o.uwagi.join(' ')).toContain('wybierz wtedy „Szkoda umyślna”');
    expect(o.przedawnienieOpis).toContain('art. 292');
    expect(o.przedawnienieOpis).toContain('art. 295');
    // 14.11.2026 to sobota: termin może przesunąć się na poniedziałek 16.11.2026 (art. 115 KC).
    const ostatni = opisOdpowiedzialnosci(dane({ dataSzkody: '2025-11-14', dataWiedzy: '2025-11-14' }), DZIS);
    expect(ostatni.status).toBe('Termin kończy się dziś albo 16 listopada 2026 r.');
    expect(ostatni.statusKlasa).toBe('pilne');
    expect(ostatni.przedawnienieOpis).toContain('14 listopada 2026 r. to sobota. Czy koniec przedawnienia przesuwa się');
    expect(ostatni.przedawnienieOpis).toContain('III CZP 21/23, znanej nam tylko z przytoczeń');
    expect(ostatni.przedawnienieOpis).toContain('trwa do 16 listopada 2026 r. Dla Ciebie bezpieczniejsza jest ta późniejsza data');
    const roboczy = opisOdpowiedzialnosci(dane({ dataSzkody: '2025-11-13', dataWiedzy: '2025-11-13' }), '2026-11-13');
    expect(roboczy.status).toBe('Dziś jest ostatni dzień terminu pracodawcy');
    expect(roboczy.przedawnienieOpis).not.toContain('art. 115');
    const jeden = opisOdpowiedzialnosci(dane({ dataSzkody: '2025-11-15', dataWiedzy: '2025-11-15' }), DZIS);
    expect(jeden.status).toBe('Pracodawcy zostało: 1 dzień, a może do 16 listopada 2026 r.');
    const minal = opisOdpowiedzialnosci(dane({ dataSzkody: '2025-11-13', dataWiedzy: '2025-11-13' }), DZIS);
    expect(minal.status).toBe('Termin pracodawcy minął 1 dzień temu');
  });
  it('wina umyślna: KC, koniec roku i przestępstwo', () => {
    const o = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2020-02-29', dataWiedzy: '2024-02-29' }), DZIS);
    expect(o.przedawnienie).toBe('28 lutego 2027 r.');
    expect(o.przedawnienieOpis).toContain('442¹ § 1');
    expect(o.przedawnienieOpis).toContain('31 grudnia 2027 r.');
    expect(o.przedawnienieOpis).toContain('29 lutego 2040 r.');
    expect(o.granicaOpis).toContain('bez limitu');
    expect(o.przedawnienieOpis).toContain('art. 123–124 Kodeksu cywilnego');
    expect(o.przedawnienieOpis).not.toContain('art. 292');
    const dziesiec = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2016-05-15', dataWiedzy: '2025-01-10' }), DZIS);
    expect(dziesiec.przedawnienieOpis).toMatch(/^Termin: 10 lat od zdarzenia/);
    expect(dziesiec.przedawnienie).toBe('15 maja 2026 r.');
  });
  it('wspólne mienie: procent po polsku i przyczynienie w opisie', () => {
    const o = opisOdpowiedzialnosci(dane({ sytuacja: 'wspolne', szkoda: 9000.5, udzial: 33.33, przyczynienie: 0.5 }), DZIS);
    expect(bezSpacji(o.granica)).toBe('2999,70 zł');
    expect(bezSpacji(o.granicaOpis)).toBe('33,33% z 9000,00 zł (po odjęciu 0,50 zł, do których przyczynił się pracodawca albo inna osoba), według części z umowy (art. 125 § 2)');
    expect(o.przepisy).toBe('art. 125 Kodeksu pracy');
  });
});

describe('poprawki po weryfikacji', () => {
  it('art. 115 KC: sobota, niedziela, święta, Wigilia', () => {
    expect(przesunietyKoniec('2026-11-14')).toBe('2026-11-16');
    expect(przesunietyKoniec('2026-11-13')).toBe('2026-11-13');
    expect(przesunietyKoniec('2027-01-01')).toBe('2027-01-04');
    expect(przesunietyKoniec('2026-12-24')).toBe('2026-12-28');
  });
  it('wina umyślna: status od końca roku, a po nim „chyba że przestępstwo”', () => {
    const trwa = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2023-03-10', dataWiedzy: '2023-03-10' }), DZIS);
    expect(trwa.przedawnienie).toBe('10 marca 2026 r.');
    expect(trwa.status).toBe('Termin mógł minąć, ale może trwać do 31 grudnia 2026 r.');
    expect(trwa.statusKlasa).toBe('wkrotce');
    const minal = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2022-05-05', dataWiedzy: '2022-05-05' }), DZIS);
    expect(minal.status).toBe('Termin pracodawcy minął 318 dni temu, chyba że szkoda wynikła z przestępstwa');
    expect(minal.statusKlasa).toBe('po-terminie');
    // Koniec terminu 31 grudnia: bez zdania o końcu roku.
    const grudzien = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2025-12-31', dataWiedzy: '2025-12-31' }), DZIS);
    expect(grudzien.przedawnienieOpis).not.toContain('Jeśli koniec terminu przypada na ostatni dzień roku');
  });
  it('granice statusu 30/31 i 90/91 dni', () => {
    const z = (wiedza: string) => opisOdpowiedzialnosci(dane({ dataSzkody: '2025-12-01', dataWiedzy: wiedza }), DZIS).statusKlasa;
    // wiedza + 1 rok: 14.12.2026 to 30 dni, 15.12.2026 to 31 dni, 12.02.2027 to 90 dni, 13.02.2027 to 91 dni.
    expect([z('2025-12-14'), z('2025-12-15'), z('2026-02-12'), z('2026-02-13')]).toEqual(['pilne', 'wkrotce', 'wkrotce', 'w-terminie']);
  });
  it('teksty gałęzi: bez limitu i rok od wiedzy', () => {
    const o = opisOdpowiedzialnosci(dane({ szkoda: 3000 }), DZIS);
    expect(bezSpacji(o.granicaOpis)).toBe('cała szkoda; limit trzech pensji to 15 600,00 zł');
    expect(o.przedawnienieOpis).toMatch(/^Termin: rok od dnia/);
    expect(o.uwagi.join(' ')).toContain('art. 121');
  });
  it('ułamki, które po zaokrągleniu dają zero, i daty sprzed 1990 r.', () => {
    expect(bladDanych(dane({ szkoda: 0.004 }), DZIS)?.pole).toBe('szkoda');
    expect(bladDanych(dane({ wynagrodzenie: 0.004 }), DZIS)?.pole).toBe('wynagrodzenie');
    expect(bladDanych(dane({ sytuacja: 'wspolne', udzial: 0.004 }), DZIS)?.pole).toBe('udzial');
    expect(bladDanych(dane({ sytuacja: 'wspolne', udzial: 33.335 }), DZIS)?.pole).toBe('udzial');
    expect(bladDanych(dane({ sytuacja: 'wspolne', udzial: 0.01 }), DZIS)).toBeNull();
    expect(bladDanych(dane({ dataSzkody: '1985-05-01', dataWiedzy: '1985-05-01' }), DZIS)?.tekst).toBe('Dzień szkody: najwcześniej 1 stycznia 1990 r.');
  });
});

describe('poprawki po audycie', () => {
  it('bez „r..”, bez mediacji jako przerwania, brzmienie art. 442¹', () => {
    const n = opisOdpowiedzialnosci(dane({ dataSzkody: '2025-11-21', dataWiedzy: '2025-11-21' }), DZIS);
    expect(n.przedawnienieOpis).not.toMatch(/r\.\./);
    expect(n.przedawnienieOpis).toContain('trwa do 23 listopada 2026 r. Dla Ciebie bezpieczniejsza jest ta późniejsza data: do jej końca nie zakładaj, że roszczenie się przedawniło. Bieg');
    const u = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2023-12-01', dataWiedzy: '2023-12-01' }), DZIS);
    expect(u.przedawnienieOpis).not.toMatch(/r\.\./);
    expect(u.przedawnienieOpis).not.toMatch(/przerywa[^.]*mediacji/);
    expect(u.przedawnienieOpis).toContain('art. 121 pkt 5');
    expect(u.przedawnienieOpis).toContain('o osobie obowiązanej do jej naprawienia');
  });
  it('„zostało” z datą późniejszą i kolorem według niej', () => {
    // 21.11.2026 to sobota → 23.11.2026; 7 dni do wcześniejszej.
    const n = opisOdpowiedzialnosci(dane({ dataSzkody: '2025-11-21', dataWiedzy: '2025-11-21' }), DZIS);
    expect(n.status).toBe('Pracodawcy zostało: 7 dni, a może do 23 listopada 2026 r.');
    // Umyślna: 1.12.2026 (17 dni), koniec roku 31.12.2026 (47 dni) → kolor „wkrotce”.
    const u = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2023-12-01', dataWiedzy: '2023-12-01' }), DZIS);
    expect(u.status).toBe('Pracodawcy zostało: 17 dni, a może do 31 grudnia 2026 r.');
    expect(u.statusKlasa).toBe('wkrotce');
    expect(opisOdpowiedzialnosci(dane({}), DZIS).status).toBe('Pracodawcy zostało: 139 dni');
  });
  it('po 20 latach bez dopisku o przestępstwie', () => {
    const u = opisOdpowiedzialnosci(dane({ sytuacja: 'umyslna', dataSzkody: '2005-01-10', dataWiedzy: '2005-01-10' }), DZIS);
    expect(u.status).toMatch(/^Termin pracodawcy minął \d+ dni temu$/);
  });
});

describe('audyt jakosc3', () => {
  const sp = (t: string) => t.replace(/\s/g, ' ');
  const umyslna = (x: Partial<DaneOdpowiedzialnosci>) => dane({ sytuacja: 'umyslna', szkoda: 3000, ...x });
  it('art. 291 § 2: rok od wiadomości, że szkodę wyrządził pracownik (A-1)', () => {
    expect(sp(opisOdpowiedzialnosci(dane({ szkoda: 3000 }), DZIS).przedawnienieOpis)).toContain('dowiedział się, że pracownik wyrządził szkodę');
    expect(bladDanych(dane({ dataWiedzy: '' }), DZIS)?.tekst).toBe('Wpisz dzień, w którym pracodawca dowiedział się o szkodzie i o tym, kto ją wyrządził.');
  });
  it('20 lat przy przestępstwie: koniec roku i art. 115 KC jak przy 10 latach (A-3; dni policzone w Pythonie)', () => {
    const d = umyslna({ dataSzkody: '2006-12-01', dataWiedzy: '2006-12-01' });
    expect(sp(opisOdpowiedzialnosci(d, '2026-12-10').status)).toBe('Termin pracodawcy minął 6188 dni temu, chyba że szkoda wynikła z przestępstwa');
    expect(opisOdpowiedzialnosci(d, '2026-12-31').status).toContain('chyba że szkoda wynikła z przestępstwa');
    expect(sp(opisOdpowiedzialnosci(d, '2027-01-01').status)).toBe('Termin pracodawcy minął 6210 dni temu');
    const opis = sp(opisOdpowiedzialnosci(d, '2026-12-10').przedawnienieOpis);
    expect(opis).toContain('1 grudnia 2026 r., a jeśli koniec przypada na ostatni dzień roku i przesuwa się z dnia wolnego, 31 grudnia 2026 r.');
    const n = umyslna({ dataSzkody: '2008-05-05', dataWiedzy: '2008-05-05' });
    expect(sp(opisOdpowiedzialnosci(n, '2029-01-02').przedawnienieOpis)).toContain('5 maja 2028 r., a jeśli koniec przypada na ostatni dzień roku i przesuwa się z dnia wolnego, 2 stycznia 2029 r.');
    expect(opisOdpowiedzialnosci(n, '2029-01-02').status).toContain('chyba że szkoda wynikła z przestępstwa');
    expect(opisOdpowiedzialnosci(n, '2029-01-03').status).not.toContain('przestępstwa');
  });
  it('zawezwanie do próby ugodowej zawiesza, a nie przerywa bieg (A-4, art. 121 pkt 6 KC)', () => {
    const opis = sp(opisOdpowiedzialnosci(umyslna({ dataSzkody: '2023-12-01', dataWiedzy: '2023-12-01' }), DZIS).przedawnienieOpis);
    expect(opis).toContain('Mediacja i zawezwanie do próby ugodowej wstrzymują bieg przedawnienia na czas ich trwania (art. 121 pkt 5–6)');
    expect(opis).not.toContain('komornikiem, i uznanie');
  });
  it('obniżenie z § 6 ust. 1 rozporządzenia z 1975 r. obejmuje pieniądze we wspólnej kasie (A-5)', () => {
    const wspolne = opisOdpowiedzialnosci(dane({ sytuacja: 'wspolne', udzial: 50 }), DZIS).uwagi.join(' ');
    expect(sp(wspolne)).toContain('każdego mienia powierzonego wspólnie na podstawie umowy, także pieniędzy w kasie (art. 125;');
    const powierzone = opisOdpowiedzialnosci(dane({ sytuacja: 'powierzone' }), DZIS).uwagi.join(' ');
    expect(sp(powierzone)).toContain('(ale nie pieniędzy, narzędzi');
  });
  it('ostatni możliwy dzień to dziś: wynik mówi „do dziś” (A-6)', () => {
    const d = dane({ szkoda: 100, wynagrodzenie: 10, dataSzkody: '2025-11-14', dataWiedzy: '2025-11-14' });
    expect(opisOdpowiedzialnosci(d, '2026-11-16')).toMatchObject({ statusKlasa: 'pilne' });
    expect(sp(opisOdpowiedzialnosci(d, '2026-11-16').status)).toBe('Termin mógł minąć, ale może trwać do dziś (16 listopada 2026 r.)');
    expect(sp(opisOdpowiedzialnosci(d, '2026-11-15').status)).toBe('Termin mógł minąć, ale może trwać do 16 listopada 2026 r.');
    expect(sp(opisOdpowiedzialnosci(d, '2026-11-17').status)).toBe('Termin pracodawcy minął 1 dzień temu');
  });
  it('art. 115 KC: święta ruchome i Wigilia w latach 2027–2029 (A-10)', () => {
    for (const [z, na] of [
      ['2027-03-27', '2027-03-30'], ['2027-03-29', '2027-03-30'], ['2027-05-27', '2027-05-28'], ['2027-12-24', '2027-12-27'],
      ['2027-01-06', '2027-01-07'], ['2028-04-15', '2028-04-18'], ['2026-12-31', '2026-12-31'], ['2028-12-31', '2029-01-02'],
    ]) expect(przesunietyKoniec(z), z).toBe(na);
  });
});

describe('terminy 2: spór o art. 115 KC przy przedawnieniu (daty z raporty/terminy2/swieta.py)', () => {
  it('sobota przed 2017 r. nie przesuwa (stare brzmienie art. 115 KC), niedziela tak; 12.11.2018 r. jednorazowo wolny', () => {
    expect(przesunietyKoniec('2016-01-02')).toBe('2016-01-02');
    expect(przesunietyKoniec('2016-01-03')).toBe('2016-01-04');
    expect(przesunietyKoniec('2018-11-10')).toBe('2018-11-13');
    expect(sporArt115('2016-01-02')).toBe('');
  });
  it('zdanie: dzień, spór z sygnaturą znaną z przytoczeń, druga data i to, że późniejsza jest bezpieczna', () => {
    const z = sporArt115('2026-12-25').replace(/\s/g, ' ');
    expect(z.startsWith('25 grudnia 2026 r. to dzień wolny od pracy (Boże Narodzenie')).toBe(true);
    expect(z).toContain(SPOR_ART_115);
    expect(z).toContain('trwa do 28 grudnia 2026 r. Dla Ciebie');
    expect(sporArt115('2026-12-23')).toBe('');
  });
});
