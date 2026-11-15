// Zrzuty wyniku narzędzi pakietu „terminy3” na telefonie 412 i 320 px, w stanie z datą „Zdąż do” w sobotę, niedzielę albo
// święto (z linijką praktyczną). Użycie (przy działającym podglądzie na porcie 4322): node raporty/terminy3/zrzuty.mjs
// Sprawdza też przewijanie w bok (scrollWidth > clientWidth) i czy linijka jest widoczna.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4322';
const DZIS = new Date('2026-11-15T10:00:00+01:00');
const SCENARIUSZE = {
  'odwolanie-do-sadu-pracy': [
    async (p) => {
      await p.selectOption('#o-sprawa', 'sprostowanie-wniosek');
      await p.fill('#o-data', '2026-11-29');
    },
    '[data-w="praktycznie"]',
  ],
  'kara-porzadkowa': [
    async (p) => {
      await p.fill('#k-naruszenie', '2026-12-01');
      await p.fill('#k-wiadomosc', '2026-12-02');
      await p.fill('#k-ukaranie', '2026-12-06');
    },
    '[data-w="praktycznie"]',
  ],
  'swiadectwo-pracy': [
    async (p) => {
      await p.fill('#s-ustanie', '2026-11-10');
      await p.fill('#s-otrzymanie', '2026-11-15');
    },
    '[data-w="glowny-praktycznie"]',
  ],
  'przedawnienie-wynagrodzenia': [
    async (p) => {
      await p.fill('#p-dzis', '2026-11-15');
      await p.fill('#p-dzien', '5');
    },
    '[data-w="praktycznie"]',
  ],
  'zalegly-urlop': [
    async (p) => {
      await p.fill('[name="rok1"]', '2025');
      await p.fill('[name="dni1"]', '6');
      await p.fill('[name="rok2"]', '');
      await p.fill('[name="dni2"]', '');
      await p.fill('#u-dzis', '2026-11-15');
    },
    '[data-w="praktycznie"]',
  ],
  'wypowiedzenie-zmieniajace': [
    async (p) => {
      await p.fill('#wz-start', '2026-05-12');
      await p.fill('#wz-doreczenie', '2026-11-12');
    },
    '[data-w="odmowa-praktycznie"]',
  ],
  'badania-lekarskie-w-pracy': [
    async (p) => {
      await p.check('input[name="sytuacja"][value="orzeczenie"]');
      await p.fill('[name="otrzymane"]', '2026-11-14');
    },
    '[data-w="c-praktycznie"]',
  ],
  'co-wolno-na-l4': [
    async (p) => {
      await p.getByLabel('Kto kontroluje').selectOption('pracodawca');
      await p.getByLabel('Dzień czynności').fill('2026-11-12');
      await p.getByLabel('Otrzymanie protokołu').fill('2026-11-14');
      await p.getByLabel('Doręczenie decyzji ZUS').fill('2026-11-13');
    },
    '[data-w="odwolanie-praktycznie"]',
  ],
};

const przegladarka = await chromium.launch();
let bledy = 0;
for (const szer of [412, 320]) {
  for (const [slug, [ustaw, linijka]] of Object.entries(SCENARIUSZE)) {
    const k = await przegladarka.newContext({ viewport: { width: szer, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pl-PL', timezoneId: 'Europe/Warsaw' });
    const p = await k.newPage();
    await p.clock.setFixedTime(DZIS);
    await p.goto(`${BASE}/narzedzia/${slug}`, { waitUntil: 'networkidle' });
    await ustaw(p);
    await p.waitForTimeout(600);
    const bok = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const widac = await p.locator(linijka).isVisible();
    if (bok > 0 || !widac) bledy++;
    await p.locator('.kalkulator').first().screenshot({ path: `raporty/terminy3/zrzuty/${slug}-${szer}.png` });
    console.log(`${szer} px ${slug}: przewijanie w bok ${bok} px, linijka ${widac ? 'widoczna' : 'NIEWIDOCZNA'}`);
    await k.close();
  }
}
await przegladarka.close();
process.exit(bledy ? 1 : 0);
