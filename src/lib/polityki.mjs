// Zasady redakcji w danych strukturalnych NewsMediaOrganization (schema.org): Google i asystenci AI widzą, gdzie są
// zasady, korekty, weryfikacja faktów, finansowanie i skład redakcji. Adres to strona zaufania (src/content/strony),
// a kotwica to id śródtytułu w jej treści. Kontrola SEO sprawdza, że strona i kotwica istnieją, więc zmiana
// śródtytułu w panelu nie zostawi martwego odsyłacza.

/** Właściwość schema.org → ścieżka strony (z kotwicą śródtytułu). */
export const POLITYKI = {
  publishingPrinciples: '/zasady-redakcyjne',
  ethicsPolicy: '/zasady-redakcyjne#niezależność',
  verificationFactCheckingPolicy: '/zasady-redakcyjne#weryfikacja-przed-publikacją',
  correctionsPolicy: '/polityka-korekt',
  ownershipFundingInfo: '/o-nas#niezależność-i-finansowanie',
  masthead: '/o-nas#redakcja',
  noBylinesPolicy: '/o-nas#redakcja',
  actionableFeedbackPolicy: '/kontakt',
};

/**
 * Pola NewsMediaOrganization z pełnymi adresami (polskie litery w kotwicy zakodowane).
 * @param {string} adres adres serwisu bez ukośnika na końcu
 */
export const politykiRedakcji = (adres) => Object.fromEntries(Object.entries(POLITYKI).map(([pole, sciezka]) => [pole, encodeURI(adres + sciezka)]));
