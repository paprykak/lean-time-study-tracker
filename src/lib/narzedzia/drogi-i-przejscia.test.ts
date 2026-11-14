import { describe, expect, it } from 'vitest';
import { liczbaZPola, najkrotszaPochylnia, nachylenieWGore, odczytajPrzejscie, sprawdzPrzejscie } from './drogi-i-przejscia';

// Oczekiwane wartości policzone niezależnie w Pythonie (decimal.Decimal, math.atan): raporty/hala/RAPORT.md.
const wynik = (d: Parameters<typeof sprawdzPrzejscie>[0], klucz: string) => sprawdzPrzejscie(d).sprawdzenia.find((s) => s.klucz === klucz);

describe('szerokość przejścia (§ 47 ust. 3) i dostępu do gaśnicy (§ 33 ust. 2 pkt 2 ppoż.)', () => {
  it('0,75 m w jednym kierunku: 0,75 m wystarcza, 0,7 m brakuje 5 cm, 0,749 m brakuje 0,1 cm', () => {
    expect(wynik({ rodzaj: 'obsluga', szerokosc: 0.75 }, 'szerokosc')).toMatchObject({ wynik: 'tak', tekst: '0,75 m, wymagane co najmniej 0,75 m (§ 47 ust. 3 ogólnych przepisów BHP).' });
    expect(wynik({ rodzaj: 'obsluga', szerokosc: 0.7 }, 'szerokosc')).toMatchObject({ wynik: 'nie', tekst: expect.stringContaining('brakuje 5 cm do 0,75 m') });
    expect(wynik({ rodzaj: 'obsluga', szerokosc: 0.749 }, 'szerokosc')?.tekst).toContain('brakuje 0,1 cm');
  });
  it('dwa kierunki i gaśnica: 1 m; 0,95 m brakuje 5 cm, 1,2 m jest', () => {
    expect(wynik({ rodzaj: 'obsluga-dwa', szerokosc: 1 }, 'szerokosc')?.wynik).toBe('tak');
    expect(wynik({ rodzaj: 'obsluga-dwa', szerokosc: 0.95 }, 'szerokosc')?.tekst).toContain('brakuje 5 cm do 1 m');
    expect(wynik({ rodzaj: 'gasnica', szerokosc: 0.95 }, 'szerokosc')?.tekst).toContain('§ 33 ust. 2 pkt 2');
    expect(sprawdzPrzejscie({ rodzaj: 'gasnica', szerokosc: 1.2 }).status.rodzaj).toBe('w-terminie');
  });
  it('droga dla wózków: przepis nie podaje liczby, bez względu na wpisaną szerokość', () => {
    const r = sprawdzPrzejscie({ rodzaj: 'wozki', szerokosc: 1.5 });
    expect(r.minimum).toBe('brak liczby w przepisie');
    expect(r.sprawdzenia).toEqual([expect.objectContaining({ klucz: 'szerokosc', wynik: 'brak-liczby' })]);
    expect(r.status).toEqual({ tekst: 'Przepis nie podaje liczby do porównania', rodzaj: 'brak' });
    expect(r.sprawdzenia[0].tekst).toContain('Polskie Normy');
  });
});

describe('wysokość dojścia (§ 47 ust. 1–2)', () => {
  it('2 m tak, 1,999 m i 1,8 m tylko wyjątkowo, 1,79 m za nisko', () => {
    expect(wynik({ rodzaj: 'obsluga', wysokosc: 2 }, 'wysokosc')?.wynik).toBe('tak');
    expect(wynik({ rodzaj: 'obsluga', wysokosc: 1.999 }, 'wysokosc')?.wynik).toBe('warunkowo');
    expect(wynik({ rodzaj: 'obsluga-dwa', wysokosc: 1.8 }, 'wysokosc')?.wynik).toBe('warunkowo');
    expect(wynik({ rodzaj: 'obsluga', wysokosc: 1.79 }, 'wysokosc')?.wynik).toBe('nie');
    expect(sprawdzPrzejscie({ rodzaj: 'obsluga', szerokosc: 0.8, wysokosc: 1.9 }).status).toEqual({ tekst: 'Zgodne tylko wyjątkowo', rodzaj: 'wkrotce' });
  });
  it('droga wózków: wysokość tylko wtedy, gdy chodzą nią piesi; dostęp do gaśnicy bez wysokości', () => {
    expect(wynik({ rodzaj: 'wozki', wysokosc: 1.7 }, 'wysokosc')).toMatchObject({ wynik: 'brak-liczby', tekst: expect.stringContaining('gdy tą drogą chodzą piesi') });
    expect(sprawdzPrzejscie({ rodzaj: 'wozki', szerokosc: 3, wysokosc: 1.9 }).status.tekst).toBe('Przepis nie podaje liczby do porównania');
    expect(wynik({ rodzaj: 'wozki', wysokosc: 1.7, piesi: true }, 'wysokosc')?.wynik).toBe('nie');
    expect(sprawdzPrzejscie({ rodzaj: 'wozki', wysokosc: 2.2, piesi: true }).status).toEqual({ tekst: 'Liczby z przepisu spełnione', rodzaj: 'w-terminie' });
    expect(wynik({ rodzaj: 'gasnica', wysokosc: 1.5 }, 'wysokosc')).toMatchObject({ wynik: 'brak-liczby', tekst: 'Przy dostępie do gaśnicy przepis podaje tylko szerokość.' });
    expect(sprawdzPrzejscie({ rodzaj: 'gasnica', wysokosc: 1.5 }).status.tekst).toBe('Przepis nie podaje liczby do porównania');
  });
});

describe('pochylnia (§ 5 ust. 1: najwyżej 8%)', () => {
  it('20 cm na 2,5 m to dokładnie 8%; 20 cm na 2,49 m to 8,1% i za stromo', () => {
    expect(wynik({ rodzaj: 'obsluga', roznica: 20, dlugosc: 2.5 }, 'pochylnia')).toMatchObject({ wynik: 'tak', tekst: expect.stringContaining('8% (ok. 4,6°)') });
    expect(wynik({ rodzaj: 'obsluga', roznica: 20, dlugosc: 2.49 }, 'pochylnia')).toMatchObject({ wynik: 'nie', tekst: expect.stringContaining('8,1% (ok. 4,6°)') });
    expect(wynik({ rodzaj: 'wozki', roznica: 100, dlugosc: 12.5 }, 'pochylnia')?.wynik).toBe('tak');
    expect(wynik({ rodzaj: 'wozki', roznica: 100, dlugosc: 12.49 }, 'pochylnia')?.wynik).toBe('nie');
  });
  it('15 cm na 1,5 m: 10%, najkrótsza pochylnia 1,88 m; 12,5 cm na 1,2 m: 10,5%, 1,57 m', () => {
    expect(wynik({ rodzaj: 'obsluga', roznica: 15, dlugosc: 1.5 }, 'pochylnia')?.tekst).toBe('Nachylenie 10% (ok. 5,7°): więcej niż 8% dopuszczalnych na drogach transportowych i w magazynach (§ 5 ust. 1). Przy różnicy 15 cm pochylnia musi mieć w poziomie co najmniej 1,88 m.');
    expect(wynik({ rodzaj: 'obsluga', roznica: 12.5, dlugosc: 1.2 }, 'pochylnia')?.tekst).toContain('10,5% (ok. 5,9°)');
    expect(najkrotszaPochylnia(12.5)).toBe(1.57);
    expect(najkrotszaPochylnia(30)).toBe(3.75);
    expect(najkrotszaPochylnia(1)).toBe(0.13);
    expect(wynik({ rodzaj: 'obsluga', roznica: 15, dlugosc: 1.88 }, 'pochylnia')?.wynik).toBe('tak');
    expect(wynik({ rodzaj: 'obsluga', roznica: 15, dlugosc: 1.875 }, 'pochylnia')?.wynik).toBe('tak');
    expect(wynik({ rodzaj: 'obsluga', roznica: 15, dlugosc: 1.87 }, 'pochylnia')?.wynik).toBe('nie');
  });
  it('nachylenie zaokrąglone w górę do 0,1%', () => {
    expect(nachylenieWGore(200, 2500)).toBe(8);
    expect(nachylenieWGore(200, 2490)).toBe(8.1);
    expect(nachylenieWGore(10, 130)).toBe(7.7);
  });
});

describe('wynik ogólny', () => {
  it('jedno „nie” przesądza; bez wymiarów prośba o dane', () => {
    expect(sprawdzPrzejscie({ rodzaj: 'obsluga', szerokosc: 0.8, wysokosc: 2.1, roznica: 15, dlugosc: 1.5 }).status.rodzaj).toBe('po-terminie');
    expect(sprawdzPrzejscie({ rodzaj: 'obsluga' })).toMatchObject({ minimum: 'co najmniej 0,75 m', sprawdzenia: [], status: { rodzaj: 'brak' } });
  });
  it('uwagi: piesi na drodze wózków, gaśnica 30 m', () => {
    expect(sprawdzPrzejscie({ rodzaj: 'wozki', piesi: true }).uwaga).toContain('§ 6 ust. 5');
    expect(sprawdzPrzejscie({ rodzaj: 'wozki' }).uwaga).toContain('§ 69 ust. 2');
    expect(sprawdzPrzejscie({ rodzaj: 'gasnica' }).uwaga).toContain('30 m');
  });
});

describe('odczyt formularza', () => {
  const puste = { szerokosc: '', wysokosc: '', roznica: '', dlugosc: '' };
  it('przecinek, spacje, puste pola pomijane', () => {
    expect(odczytajPrzejscie({ ...puste, szerokosc: ' 0,75 ', roznica: '12,5', dlugosc: '1,2' }, 'obsluga', false)).toEqual({
      dane: { rodzaj: 'obsluga', piesi: false, szerokosc: 0.75, roznica: 12.5, dlugosc: 1.2 },
      blad: null,
    });
  });
  it('błędy: zero, litery, za dużo miejsc po przecinku, pochylnia bez długości', () => {
    expect(odczytajPrzejscie({ ...puste, szerokosc: '0' }, 'obsluga', false).blad?.pole).toBe('szerokosc');
    expect(odczytajPrzejscie({ ...puste, wysokosc: '2 m' }, 'obsluga', false).blad?.pole).toBe('wysokosc');
    expect(odczytajPrzejscie({ ...puste, szerokosc: '0,7495' }, 'obsluga', false).blad?.pole).toBe('szerokosc');
    expect(odczytajPrzejscie({ ...puste, roznica: '12,55', dlugosc: '2' }, 'obsluga', false).blad?.pole).toBe('roznica');
    expect(odczytajPrzejscie({ ...puste, roznica: '15' }, 'obsluga', false).blad).toEqual({ pole: 'dlugosc', tekst: 'Do pochylni wpisz i różnicę poziomów, i długość w poziomie.' });
    expect(odczytajPrzejscie({ ...puste, dlugosc: '2' }, 'obsluga', false).blad?.pole).toBe('roznica');
    expect(odczytajPrzejscie({ ...puste, szerokosc: '51' }, 'obsluga', false).blad?.pole).toBe('szerokosc');
  });
  it('liczbaZPola', () => {
    expect(liczbaZPola('', 3)).toBeUndefined();
    expect(liczbaZPola('1 000,5', 3)).toBe(1000.5);
    expect(liczbaZPola('-1', 3)).toBeNaN();
    expect(liczbaZPola('1.', 3)).toBeNaN();
  });
});
