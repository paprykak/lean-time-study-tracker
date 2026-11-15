// Zrzuty wyniku sześciu narzędzi pakietu „terminy” na telefonie 412 i 320 px, w stanie z dwiema datami (art. 115 KC).
// Użycie (przy działającym podglądzie na porcie 4322): node raporty/terminy/zrzuty.mjs
// Sprawdza też przewijanie w bok (scrollWidth > clientWidth) i wypisuje wynik.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4322';
const DZIS = new Date('2026-12-20T10:00:00+01:00');
const SCENARIUSZE = {
  'odwolanie-do-sadu-pracy': async (p) => {
    await p.selectOption('#o-sprawa', 'bez-wypowiedzenia');
    await p.fill('#o-data', '2026-12-03');
  },
  'kara-porzadkowa': async (p) => {
    await p.fill('#k-naruszenie', '2026-12-10');
    await p.fill('#k-wiadomosc', '2026-12-12');
    await p.fill('#k-ukaranie', '2026-12-17');
  },
  'swiadectwo-pracy': async (p) => {
    await p.fill('#s-ustanie', '2026-10-30');
    await p.fill('#s-otrzymanie', '2026-10-31');
    await p.fill('#s-wniosek', '2026-11-10');
    await p.fill('#s-odmowa', '2026-12-10');
  },
  'przedawnienie-wynagrodzenia': async (p) => {
    await p.selectOption('#p-rodzaj', 'ten');
    await p.fill('#p-dzien', '14');
    await p.fill('#p-dzis', '2026-11-10');
  },
  'zalegly-urlop': async (p) => {
    await p.fill('[name="rok1"]', '2025');
    await p.fill('[name="dni1"]', '6');
    await p.fill('[name="rok2"]', '');
    await p.fill('[name="dni2"]', '');
  },
  'informacja-o-warunkach-zatrudnienia': async (p) => {
    await p.fill('#sp-start', '2026-12-17');
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
    await p.waitForTimeout(300);
    const bok = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (bok > 0) bledy++;
    const wynik = p.locator('.kalkulator');
    await wynik.screenshot({ path: `raporty/terminy/zrzuty/${slug}-${szer}.png` });
    console.log(`${szer} px ${slug}: przewijanie w bok ${bok} px`);
    await k.close();
  }
}
await przegladarka.close();
process.exit(bledy ? 1 : 0);
