import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { okladka, rozmiarTytulu, SZEROKOSC, WYSOKOSC } from './okladka';

describe('okładka udostępnień', () => {
  it('ma 1200×630 px i jest plikiem JPEG', async () => {
    const plik = await okladka({
      tytul: 'Przezbrojenie krótsze o połowę bez nowych maszyn: SMED krok po kroku',
      etykieta: 'Produkcja · Poradnik',
      zdjecie: 'src/assets/zdjecia/robot-spawalniczy.jpg',
    });
    const meta = await sharp(plik).metadata();
    expect([meta.width, meta.height, meta.format]).toEqual([SZEROKOSC, WYSOKOSC, 'jpeg']);
    expect(plik.length).toBeLessThan(300 * 1024);
  }, 30_000);

  it('dłuższy tytuł dostaje mniejszy rozmiar', () => {
    expect(rozmiarTytulu('Krótki tytuł')).toBeGreaterThan(rozmiarTytulu('x'.repeat(100)));
  });
});
