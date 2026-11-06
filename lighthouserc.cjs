// Lighthouse CI: poprzeczki z sekcji 3 promptu na zbudowanej stronie (telefon, ustawienia domyślne Lighthouse).
// Każdy nowy szablon (dział, artykuł, wyszukiwarka) dopisuje tu swój adres w F3.
// SEO ≥ 95 sprawdzamy na stronach indeksowanych. Na stronach z noindex (404, /styleguide) Lighthouse z definicji
// obniża SEO („strona zablokowana przed indeksowaniem”), więc tam pilnujemy wydajności, dostępności i dobrych praktyk.
const { chromium } = require('@playwright/test');

const PORT = 4323;
const adres = (a) => `http://127.0.0.1:${PORT}${a}`;
const INDEKSOWANE = ['/'];
const WEWNETRZNE = ['/styleguide', '/404'];

const kategorie = {
  'categories:performance': ['error', { minScore: 0.95 }],
  'categories:accessibility': ['error', { minScore: 0.95 }],
  'categories:best-practices': ['error', { minScore: 0.95 }],
};
const metryki = {
  'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
  // INP mierzy się w terenie; w laboratorium jego odpowiednikiem jest Total Blocking Time (dobry: do 200 ms).
  'total-blocking-time': ['error', { maxNumericValue: 200 }],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx astro preview --host 127.0.0.1 --port ${PORT} --ignore-lock`,
      startServerReadyPattern: '127.0.0.1',
      url: [...INDEKSOWANE, ...WEWNETRZNE].map(adres),
      numberOfRuns: 1,
      chromePath: chromium.executablePath(),
      // --no-proxy-server: w środowiskach z proxy (np. sesje w chmurze) Chrome nie może kierować localhost przez proxy.
      settings: { chromeFlags: '--no-sandbox --headless=new --no-proxy-server' },
    },
    assert: {
      assertMatrix: [
        { matchingUrlPattern: `^${adres('/')}$`, assertions: { ...kategorie, ...metryki, 'categories:seo': ['error', { minScore: 0.95 }] } },
        { matchingUrlPattern: `/(styleguide|404)$`, assertions: { ...kategorie, ...metryki } },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/raporty' },
  },
};
