// Zrzuty wyniku siedmiu narzędzi pakietu „terminy 2” na telefonie 412 i 320 px, w stanie z datą w sobotę albo święto.
// Użycie (przy działającym podglądzie na porcie 4322): node raporty/terminy2/zrzuty.mjs
// Sprawdza też przewijanie w bok (scrollWidth > clientWidth) i wypisuje wynik.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4322';
const DZIS = new Date('2026-11-15T10:00:00+01:00');
const SCENARIUSZE = {
  'wypowiedzenie-zmieniajace': async (p) => {
    await p.fill('#wz-start', '2026-06-01');
    await p.fill('#wz-doreczenie', '2026-11-14');
  },
  'odszkodowanie-za-zwolnienie': async () => {},
  'odpowiedzialnosc-materialna': async (p) => {
    await p.fill('#o-data-szkody', '2025-11-21');
    await p.fill('#o-data-wiedzy', '2025-11-21');
  },
  'zgloszenie-pracy-cudzoziemca': async (p) => {
    await p.fill('#ct-o-start', '2026-11-14');
  },
  'zwrot-podatku-pit-37': async () => {},
  'badania-lekarskie-w-pracy': async (p) => {
    await p.check('input[name="sytuacja"][value="orzeczenie"]');
    await p.fill('[name="otrzymane"]', '2026-11-07');
  },
  'monitoring-w-pracy': async (p) => {
    await p.fill('#m-nagranie', '2026-11-14');
  },
};

const przegladarka = await chromium.launch();
let bledy = 0;
for (const szer of [412, 320]) {
  for (const [slug, ustaw] of Object.entries(SCENARIUSZE)) {
    const k = await przegladarka.newContext({ viewport: { width: szer, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pl-PL', timezoneId: 'Europe/Warsaw' });
    const p = await k.newPage();
    await p.clock.setFixedTime(DZIS);
    await p.goto(`${BASE}/narzedzia/${slug}`, { waitUntil: 'networkidle' });
    await ustaw(p);
    await p.waitForTimeout(600);
    const bok = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (bok > 0) bledy++;
    await p.locator('.kalkulator').first().screenshot({ path: `raporty/terminy2/zrzuty/${slug}-${szer}.png` });
    console.log(`${szer} px ${slug}: przewijanie w bok ${bok} px`);
    await k.close();
  }
}
await przegladarka.close();
process.exit(bledy ? 1 : 0);
