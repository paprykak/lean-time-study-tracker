import { describe, expect, it } from 'vitest';
import { centymetry, sprawdzPrace, tekstyPracy, type DanePracy, type Miejsce, type Oslona, type Osoba } from './praca-na-wysokosci';

// Oczekiwane wyniki z niezależnego zapisu reguł § 105–110 ogólnych przepisów BHP i wykazów prac wzbronionych
// w Pythonie (scratchpad/budowa/wysokosc_reguly.py: każdy przepis jako osobny predykat; cała siatka 1512 przypadków
// zgodna z kodem), tu wybór: wszystkie miejsca i osłony na 2,5 m, progi, młodociani, ciąża. Wysokości w centymetrach.
const PRZYPADKI: [number, Miejsce, Oslona, boolean, Osoba, Record<string, unknown>][] = [
  [250, 'pomost', 'sciany', false, 'dorosly', { naWysokosci: false, wylaczenie: 'sciany', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'pomost', 'balustrada', false, 'dorosly', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'pomost', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'drabina', 'sciany', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'drabina', 'balustrada', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'drabina', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'rusztowanie', 'sciany', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'rusztowanie', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'rusztowanie', 'balustrada', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'rusztowanie', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'rusztowanie', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'rusztowanie', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'podnosnik', 'sciany', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'podnosnik', 'balustrada', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'podnosnik', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'dach', 'sciany', false, 'dorosly', { naWysokosci: false, wylaczenie: 'sciany', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'dach', 'balustrada', false, 'dorosly', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'dach', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'konstrukcja', 'sciany', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'konstrukcja', 'balustrada', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'konstrukcja', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'rampa', 'sciany', false, 'dorosly', { naWysokosci: false, wylaczenie: 'sciany', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'rampa', 'balustrada', false, 'dorosly', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'rampa', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'rampa', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [99, 'pomost', 'brak', false, 'dorosly', { naWysokosci: false, wylaczenie: 'nisko', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [99, 'drabina', 'brak', false, 'dorosly', { naWysokosci: false, wylaczenie: 'nisko', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [100, 'pomost', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada-1m', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [100, 'drabina', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'stabilne', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [101, 'pomost', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [101, 'drabina', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'stabilne', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [200, 'pomost', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [200, 'drabina', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'stabilne', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [201, 'pomost', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [201, 'drabina', 'brak', false, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [100, 'pomost', 'balustrada', false, 'dorosly', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [150, 'rampa', 'balustrada', false, 'dorosly', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [150, 'rampa', 'sciany', false, 'dorosly', { naWysokosci: false, wylaczenie: 'sciany', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'pomost', 'balustrada', true, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [150, 'drabina', 'brak', true, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [250, 'dach', 'brak', true, 'dorosly', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'nie-dotyczy' }],
  [300, 'pomost', 'balustrada', false, 'mlodociany', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'balustrada', mlodociany: 'dozwolone', ciaza: 'nie-dotyczy' }],
  [301, 'pomost', 'balustrada', false, 'mlodociany', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'balustrada', mlodociany: 'wzbronione', ciaza: 'nie-dotyczy' }],
  [50, 'drabina', 'brak', false, 'ciaza', { naWysokosci: false, wylaczenie: 'nisko', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'wzbronione' }],
  [50, 'pomost', 'brak', false, 'ciaza', { naWysokosci: false, wylaczenie: 'nisko', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'dozwolone' }],
  [150, 'pomost', 'balustrada', false, 'ciaza', { naWysokosci: false, wylaczenie: 'balustrada', zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'dozwolone' }],
  [150, 'dach', 'sciany', false, 'ciaza', { naWysokosci: false, wylaczenie: 'sciany', zabezpieczenie: 'brak-wymogu', mlodociany: 'nie-dotyczy', ciaza: 'dozwolone' }],
  [150, 'pomost', 'brak', false, 'ciaza', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'wzbronione' }],
  [150, 'rusztowanie', 'balustrada', false, 'ciaza', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'wzbronione' }],
  [250, 'podnosnik', 'sciany', false, 'ciaza', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'balustrada', mlodociany: 'nie-dotyczy', ciaza: 'wzbronione' }],
  [150, 'pomost', 'balustrada', true, 'ciaza', { naWysokosci: true, wylaczenie: null, zabezpieczenie: 'szelki', mlodociany: 'nie-dotyczy', ciaza: 'wzbronione' }],
];

const dane = (cm: number, miejsce: Miejsce, oslona: Oslona, wychylanie: boolean, osoba: Osoba): DanePracy => ({ wysokosc: cm / 100, miejsce, oslona, wychylanie, osoba });

describe('reguły z przepisów (tabela z Pythona)', () => {
  it.each(PRZYPADKI)('%i cm, %s, %s, wychylanie %s, %s', (cm, m, o, w, os, oczekiwany) => {
    expect(sprawdzPrace(dane(cm, m, o, w, os))).toMatchObject(oczekiwany);
  });
});

describe('progi i dane', () => {
  it('centymetry bez błędów zaokrąglenia: 1,15 m, 2,01 m, 3,01 m', () => {
    expect(centymetry(1.15)).toBe(115);
    expect(centymetry(2.01)).toBe(201);
    expect(centymetry(3.01)).toBe(301);
    expect(centymetry(0)).toBe(0);
  });
  it('błędne wysokości', () => {
    for (const x of [-1, Number.NaN, 300.01, 1.005, Infinity]) expect(() => centymetry(x)).toThrow(RangeError);
  });
  it('brak balustrady na otwartej krawędzi powyżej 1,0 m (nie przy 1,0 m, drabinie i rampie)', () => {
    expect(sprawdzPrace(dane(101, 'pomost', 'brak', false, 'dorosly')).brakBalustrady).toBe(true);
    expect(sprawdzPrace(dane(100, 'pomost', 'brak', false, 'dorosly')).brakBalustrady).toBe(false);
    expect(sprawdzPrace(dane(150, 'drabina', 'brak', false, 'dorosly')).brakBalustrady).toBe(false);
    expect(sprawdzPrace(dane(150, 'rampa', 'brak', false, 'dorosly')).brakBalustrady).toBe(false);
  });
});

describe('teksty wyniku', () => {
  const t = (cm: number, m: Miejsce, o: Oslona, w: boolean, os: Osoba) => {
    const d = dane(cm, m, o, w, os);
    return tekstyPracy(d, sprawdzPrace(d));
  };
  const dd = (x: ReturnType<typeof t>, dt: string) => x.wiersze.find((r) => r.dt === dt)?.dd;
  it('drabina 2,5 m: praca na wysokości, szelki, szkolenie co rok, badania, pogoda', () => {
    const x = t(250, 'drabina', 'brak', false, 'dorosly');
    expect(x.glowny).toBe('To praca na wysokości');
    expect(x.podstawa).toContain('2,5 m');
    expect(dd(x, 'Zabezpieczenie')).toBe('Szelki z linką i hełm');
    expect(dd(x, 'Szkolenie BHP')).toBe('Nie rzadziej niż raz w roku');
    expect(dd(x, 'Badania lekarskie')).toBe('Równowaga, słuch, wzrok, cukier');
    expect(x.uwagi.join(' ')).toContain('warunki pogodowe');
    expect(x.uwagi.join(' ')).toContain('art. 210');
  });
  it('pomost z balustradą: wyłączenie z § 105 ust. 2 pkt 2, bez szkolenia co rok', () => {
    const x = t(250, 'pomost', 'balustrada', false, 'dorosly');
    expect(x.glowny).toBe('To nie jest praca na wysokości');
    expect(x.podstawa).toContain('§ 105 ust. 2 pkt 2');
    expect(dd(x, 'Praca szczególnie niebezpieczna')).toBe('Nie z tego powodu');
    expect(dd(x, 'Szkolenie BHP')).toBeUndefined();
  });
  it('wychylanie poza balustradę: praca na wysokości i opis wariantu', () => {
    const x = t(150, 'pomost', 'balustrada', true, 'dorosly');
    expect(x.glowny).toBe('To praca na wysokości');
    expect(x.podstawa).toContain('wariant bezpieczny');
  });
  it('0,8 m: nie jest; przy 1,0 m bez wymogu balustrady, otwarta krawędź powyżej 1,0 m', () => {
    expect(t(80, 'pomost', 'brak', false, 'dorosly').podstawa).toContain('0,8 m');
    expect(dd(t(100, 'pomost', 'brak', false, 'dorosly'), 'Zabezpieczenie')).toBe('Środki zabezpieczające');
    expect(t(150, 'pomost', 'brak', false, 'dorosly').uwagi[0]).toContain('Otwarta krawędź');
  });
  it('młodociani i ciąża', () => {
    expect(dd(t(350, 'pomost', 'balustrada', false, 'mlodociany'), 'Młodociani')).toBe('Wzbronione powyżej 3 m');
    expect(dd(t(300, 'pomost', 'brak', false, 'mlodociany'), 'Młodociani')).toBe('Nie wzbronione do 3 m');
    const drabina = t(50, 'drabina', 'brak', false, 'ciaza');
    expect(dd(drabina, 'W ciąży')).toBe('Nie wolno');
    expect(drabina.wiersze.find((r) => r.dt === 'W ciąży')?.opis).toContain('także poniżej 1 m');
    expect(dd(t(150, 'pomost', 'balustrada', false, 'ciaza'), 'W ciąży')).toBe('Dozwolone przy pełnym zabezpieczeniu');
    expect(dd(t(50, 'pomost', 'brak', false, 'ciaza'), 'W ciąży')).toBe('Nie wzbronione poniżej 1 m');
  });
  it('wynik nie przeczy sobie: wyłączenie z § 105 ust. 2 bez wierszy o pracy na wysokości', () => {
    for (const [cm, m, o] of [[100, 'pomost', 'balustrada'], [150, 'rampa', 'balustrada'], [150, 'rampa', 'sciany'], [400, 'dach', 'sciany']] as const) {
      const x = t(cm, m, o, false, 'dorosly');
      expect(x.glowny).toBe('To nie jest praca na wysokości');
      expect(JSON.stringify(x.wiersze)).not.toMatch(/to już praca na wysokości|pozostaje pracą na wysokości|Szelki/);
    }
  });
  it('dach powyżej 2 m bez szelek z § 110 (dachu tam nie ma), słup powyżej 2 m z szelkami', () => {
    expect(dd(t(250, 'dach', 'brak', false, 'dorosly'), 'Zabezpieczenie')).toBe('Balustrada: poręcz 1,1 m, krawężnik 0,15 m');
    expect(dd(t(250, 'konstrukcja', 'balustrada', false, 'dorosly'), 'Zabezpieczenie')).toBe('Szelki z linką i hełm');
    expect(t(250, 'konstrukcja', 'balustrada', false, 'dorosly').glowny).toBe('To praca na wysokości');
  });
  it('ściany przy rusztowaniu i podnośniku nie wyłączają pracy', () => {
    expect(t(250, 'rusztowanie', 'sciany', false, 'dorosly').glowny).toBe('To praca na wysokości');
    expect(t(250, 'podnosnik', 'sciany', false, 'dorosly').glowny).toBe('To praca na wysokości');
  });
  it('ŚOI nieodpłatnie z art. 237⁶ § 1', () => {
    expect(t(250, 'drabina', 'brak', false, 'dorosly').uwagi.join(' ')).toContain('art. 237⁶ § 1');
  });
  it('podnośnik: sprawność psychofizyczna', () => {
    expect(t(800, 'podnosnik', 'balustrada', false, 'dorosly').uwagi.join(' ')).toContain('sprawności psychofizycznej');
  });
  it('forma neutralna', () => {
    expect(JSON.stringify(t(250, 'drabina', 'brak', true, 'ciaza'))).not.toMatch(/łeś\b|powinieneś/);
  });
});
