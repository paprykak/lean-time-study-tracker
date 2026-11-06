// IndexNow (Bing, Yandex, Seznam, Naver i inne; Google z niego nie korzysta): zgłoszenie nowych i zmienionych adresów
// zaraz po wdrożeniu. Klucz nie jest sekretem: protokół wymaga, żeby leżał publicznie w pliku /<klucz>.txt
// (public/), a wyszukiwarka sprawdza go przy zgłoszeniu. Skrypt: scripts/indexnow.mjs.

export const PUNKT_ZGLOSZEN = 'https://api.indexnow.org/indexnow';
export const PLIK_KLUCZA = /^[0-9a-f]{32}\.txt$/;

/**
 * Pełne adresy do zgłoszenia: ścieżki („/oee”) dostają adres serwisu, obce domeny są błędem.
 * @param {string[]} wpisy
 * @param {string} adres adres serwisu, np. https://rytmhali.pl
 */
export function adresyDoZgloszenia(wpisy, adres) {
  const host = new URL(adres).host;
  const adresy = [...new Set(wpisy.map((w) => (/^https?:\/\//.test(w) ? w : `${adres}${w.startsWith('/') ? w : `/${w}`}`)))];
  const obce = adresy.filter((a) => new URL(a).host !== host);
  if (obce.length) throw new Error(`Adresy spoza ${host}: ${obce.join(', ')}`);
  return adresy;
}

/** Adresy z mapy strony (sitemap-0.xml). */
export const adresyZMapy = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

/**
 * Treść zgłoszenia (protokół IndexNow, do 10 000 adresów naraz).
 * @param {string[]} adresy
 * @param {string} klucz
 * @param {string} adres
 */
export function zgloszenie(adresy, klucz, adres) {
  if (!adresy.length) throw new Error('Brak adresów do zgłoszenia');
  if (adresy.length > 10000) throw new Error('IndexNow przyjmuje do 10 000 adresów w jednym zgłoszeniu');
  return { host: new URL(adres).host, key: klucz, keyLocation: `${adres}/${klucz}.txt`, urlList: adresy };
}
