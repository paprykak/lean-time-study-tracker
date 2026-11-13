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

// Opcje list wyboru mierzone fontem strony jak w narzedzie-probny.spec.ts: przy 320 px tekst szerszy niż pole minus
// strzałka (40 px) jest ucięty po wybraniu.
for (const [slug, listy] of [
  ['praca-cudzoziemca', ['#c-obywatelstwo', '#c-pobyt']],
  ['dorabianie-do-renty', ['#d-swiadczenie']],
  ['swiadczenie-urlopowe', ['#s-pit', '#s-rodzaj']],
  ['dodatek-wyrownawczy', ['#d-powod', '#d-miesiac']],
  ['zasilek-chorobowy-na-zleceniu', ['#z-status', '#z-przyczyna']],
  ['wynagrodzenie-za-niepelny-miesiac', ['#n-miesiac']],
] as const) {
  test(`${slug}: żadna opcja list nie jest ucięta na 320 px`, async ({ page }) => {
    await page.goto(`/narzedzia/${slug}`);
    for (const lista of listy) {
      const uciete = await page.locator(lista).evaluate(async (el) => {
        const s = el as HTMLSelectElement;
        const styl = getComputedStyle(s);
        const ctx = document.createElement('canvas').getContext('2d')!;
        ctx.font = `${styl.fontWeight} ${styl.fontSize} ${styl.fontFamily}`;
        await document.fonts.load(ctx.font, [...s.options].map((o) => o.text).join(''));
        return [...s.options].filter((o) => ctx.measureText(o.text).width > s.clientWidth - 40).map((o) => o.text);
      });
      expect(uciete, lista).toEqual([]);
    }
  });
}
