import { expect, test } from '@playwright/test';

// Audyt jakości 2: na telefonie 320 px etykiety w siatce nie nachodzą na sąsiednią kolumnę, a pola dat mają miejsce
// na pełną datę (wcześniej „EksternistycznyMaturalny” i ucięty rok „01.03.202”).
test.use({ viewport: { width: 320, height: 640 } });

const prawaKrawedzTekstu = (sel: string) =>
  `(() => { const el = document.querySelector('${sel}'); const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; })()`;

test('urlop szkoleniowy: etykiety egzaminów mieszczą się nad swoim polem', async ({ page }) => {
  await page.goto('/narzedzia/urlop-szkoleniowy');
  for (const e of await page.locator('label[for^="s-"].meta').evaluateAll((l) => l.map((x) => x.getAttribute('for')))) {
    const tekst = await page.evaluate(prawaKrawedzTekstu(`label[for="${e}"]`));
    const pole = await page.locator(`#${e}`).boundingBox();
    expect(tekst, e!).toBeLessThanOrEqual(pole!.x + pole!.width + 1);
  }
});

for (const [slug, pola] of [
  ['urlop-bezplatny', ['#b-od', '#b-do']],
  ['zalegly-urlop', ['#u-wod', '#u-wdo']],
] as const) {
  test(`${slug}: pola dat na 320 px mają co najmniej 147 px`, async ({ page }) => {
    await page.goto(`/narzedzia/${slug}`);
    for (const p of pola) {
      const box = await page.locator(p).boundingBox();
      if (box) expect(box.width, p).toBeGreaterThanOrEqual(147);
    }
  });
}
