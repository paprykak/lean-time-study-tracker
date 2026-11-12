// Oczekiwania spisane z tekstów aktów (art. 1 ust. 4, art. 3–5a, 15, 17, 19–20, 61, 68, 70 ustawy z 2025 r.; art. 41 ustawy
// o wygaszeniu; art. 42v ustawy o pomocy obywatelom Ukrainy), nie z kodu.
import { describe, expect, it } from 'vitest';
import { OBYWATELSTWA, POBYTY, podstawaPracy, type Obywatelstwo, type Pobyt } from './cudzoziemiec-podstawa';

const tekst = (o: Obywatelstwo, p: Pobyt) => podstawaPracy(o, p).obowiazki.map((x) => x.tekst).join(' | ');

describe('podstawa pracy cudzoziemca', () => {
  it('UE i EOG: ustawy nie stosuje się, bez obowiązków cudzoziemskich', () => {
    const w = podstawaPracy('ue', 'inny');
    expect(w.werdykt).toBe('bez-zezwolenia');
    expect(w.podstawa).toMatch(/art\. 1 ust\. 4 pkt 6/);
    expect(w.obowiazki).toEqual([]);
  });
  it('Ukraina z ochroną czasową: bez zezwolenia, zgłoszenie do PUP w 7 dni (art. 5a), kopia dokumentu', () => {
    const w = podstawaPracy('ukraina', 'ochrona-czasowa');
    expect(w.werdykt).toBe('bez-zezwolenia');
    expect(w.podstawa).toMatch(/art\. 3 ust\. 1 pkt 12/);
    expect(tekst('ukraina', 'ochrona-czasowa')).toMatch(/urząd pracy .* 7 dni/);
    expect(tekst('ukraina', 'ochrona-czasowa')).toMatch(/dokumentu pobytowego/);
  });
  it('Ukraina na wizie albo bez wizy: art. 41 ustawy o wygaszeniu, też zgłoszenie z art. 5a', () => {
    const w = podstawaPracy('ukraina', 'inny');
    expect(w.werdykt).toBe('bez-zezwolenia');
    expect(w.podstawa).toMatch(/art\. 41/);
    expect(w.obowiazki.some((o) => o.podstawa.includes('art. 5a'))).toBe(true);
  });
  it('karta CUKR: bez zezwolenia (art. 42v), zgłoszenie nierozstrzygnięte; dla innych obywatelstw nie dotyczy', () => {
    const w = podstawaPracy('ukraina', 'karta-ukr');
    expect(w.werdykt).toBe('bez-zezwolenia');
    expect(w.obowiazki.some((o) => o.podstawa.includes('art. 41'))).toBe(true);
    expect(podstawaPracy('inne', 'karta-ukr').werdykt).toBe('nie-dotyczy');
  });
  it('Armenia, Białoruś, Mołdawia na wizie: oświadczenie (24 miesiące) albo zezwolenie, umowa do urzędu, płaca minimalna', () => {
    const w = podstawaPracy('oswiadczenie', 'inny');
    expect(w.werdykt).toBe('oswiadczenie-lub-zezwolenie');
    expect(w.uwaga).toMatch(/24 miesiące/);
    expect(tekst('oswiadczenie', 'inny')).toMatch(/umowę do urzędu/);
    expect(tekst('oswiadczenie', 'inny')).toMatch(/płaca minimalna/);
    expect(tekst('oswiadczenie', 'inny')).toMatch(/starostę .* 7 dni.* 14 dni/);
  });
  it('inne państwo na wizie: zezwolenie na pracę do 3 lat, wykaz państw bez pracy w ruchu bezwizowym', () => {
    const w = podstawaPracy('inne', 'inny');
    expect(w.werdykt).toBe('zezwolenie');
    expect(w.uwaga).toMatch(/3 lata/);
    expect(w.uwaga).toMatch(/Wenezueli, Gruzji i Kolumbii/);
    expect(tekst('inne', 'inny')).toMatch(/wojewodę w 7 dni/);
  });
  it('swobodny dostęp: pobyt stały, ochrona, studia, Karta Polaka, absolwent, student stacjonarny', () => {
    for (const p of ['staly', 'ochrona', 'studia-pobyt', 'karta-polaka', 'absolwent', 'student'] as Pobyt[]) {
      expect(podstawaPracy('inne', p).werdykt, p).toBe('bez-zezwolenia');
      expect(tekst('inne', p), p).not.toMatch(/umowę do urzędu/);
    }
    expect(podstawaPracy('inne', 'staly').podstawa).toMatch(/pkt 6–7/);
    expect(podstawaPracy('inne', 'karta-polaka').podstawa).toMatch(/art\. 3 ust\. 5 pkt 1/);
  });
  it('karta pobytu i pracy: na warunkach zezwolenia (art. 3 ust. 2 pkt 1)', () => {
    expect(podstawaPracy('inne', 'karta-praca')).toMatchObject({ werdykt: 'na-warunkach-karty' });
  });
  it('Szwajcaria i rodzina obywatela Polski: bez kopii dokumentu pobytowego (art. 4 ust. 5)', () => {
    expect(podstawaPracy('szwajcaria', 'inny').podstawa).toMatch(/pkt 4/);
    expect(tekst('szwajcaria', 'inny')).not.toMatch(/dokumentu pobytowego/);
    expect(tekst('inne', 'rodzina')).not.toMatch(/dokumentu pobytowego/);
    expect(tekst('inne', 'staly')).toMatch(/dokumentu pobytowego/);
  });
  it('każda kombinacja daje wynik z podstawą, a etykiety list są krótkie (telefon)', () => {
    for (const o of Object.keys(OBYWATELSTWA) as Obywatelstwo[])
      for (const p of Object.keys(POBYTY) as Pobyt[]) expect(podstawaPracy(o, p).podstawa.length).toBeGreaterThan(5);
    for (const e of [...Object.values(OBYWATELSTWA), ...Object.values(POBYTY)]) expect(e.length).toBeLessThanOrEqual(38);
  });
});
