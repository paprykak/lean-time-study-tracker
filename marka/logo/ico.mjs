// Plik .ico z obrazów PNG (format ICO dopuszcza PNG w środku; tak robią przeglądarki i narzędzia od Windows Vista).
// Bez zależności: nagłówek 6 bajtów, katalog 16 bajtów na obraz, potem dane PNG.

/** @param {{ rozmiar: number, png: Buffer }[]} obrazy */
export function zlozIco(obrazy) {
  const naglowek = Buffer.alloc(6);
  naglowek.writeUInt16LE(0, 0); // zarezerwowane
  naglowek.writeUInt16LE(1, 2); // typ: ikona
  naglowek.writeUInt16LE(obrazy.length, 4);
  let przesuniecie = 6 + 16 * obrazy.length;
  const katalog = obrazy.map(({ rozmiar, png }) => {
    const wpis = Buffer.alloc(16);
    wpis.writeUInt8(rozmiar >= 256 ? 0 : rozmiar, 0); // szerokość (0 = 256)
    wpis.writeUInt8(rozmiar >= 256 ? 0 : rozmiar, 1); // wysokość
    wpis.writeUInt8(0, 2); // paleta
    wpis.writeUInt8(0, 3); // zarezerwowane
    wpis.writeUInt16LE(1, 4); // płaszczyzny
    wpis.writeUInt16LE(32, 6); // bity na piksel
    wpis.writeUInt32LE(png.length, 8);
    wpis.writeUInt32LE(przesuniecie, 12);
    przesuniecie += png.length;
    return wpis;
  });
  return Buffer.concat([naglowek, ...katalog, ...obrazy.map((o) => o.png)]);
}

/** Odczyt katalogu .ico (do testów): rozmiary i poprawność sygnatur PNG. */
export function czytajIco(bufor) {
  const liczba = bufor.readUInt16LE(4);
  return Array.from({ length: liczba }, (_, i) => {
    const w = 6 + 16 * i;
    const rozmiar = bufor.readUInt8(w) || 256;
    const dlugosc = bufor.readUInt32LE(w + 8);
    const od = bufor.readUInt32LE(w + 12);
    const png = bufor.subarray(od, od + dlugosc);
    return { rozmiar, png: png.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) };
  });
}
