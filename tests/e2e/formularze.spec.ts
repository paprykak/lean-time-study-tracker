import { expect, test, type Locator, type Page } from '@playwright/test';
import { NARZEDZIA, adresNarzedzia } from '../../src/data/narzedzia';

// Wspólny wzorzec formularzy na wszystkich narzędziach z rejestru (src/lib/narzedzia/formularz.ts, raporty/ux/RAPORT.md):
// 1. komunikat błędu (.blad-pola) ma role="alert", id wskazywane przez aria-describedby pola, nie siedzi w regionie
//    aria-live i nie jest widoczny przy wartościach domyślnych;
// 2. błąd wywołany wpisaniem złej wartości: pole ma aria-invalid="true", komunikat nie jest wpisywany ponownie przy
//    kolejnych zdarzeniach input z tą samą wartością (czytnik ogłasza go raz), a po poprawie znika razem z aria-invalid;
// 3. po przejściu na inną stronę i powrocie „Wstecz” wynik odpowiada polom, które przeglądarka przywróciła.
// Wzorzec nie zależy od urządzenia, więc test działa tylko w projekcie „komputer”.
test.beforeEach(({}, info) => test.skip(info.project.name !== 'komputer', 'wzorzec formularza sprawdzamy raz'));

const PRZERWA = 650; // dłużej niż OPOZNIENIE_BLEDU (400 ms) z formularz.ts

const tekstWyniku = (page: Page) =>
  page.evaluate(() => {
    const czesci = [...document.querySelectorAll<HTMLElement>('form.kalkulator, [aria-live]')].filter(
      (el, _, wszystkie) => !wszystkie.some((inny) => inny !== el && inny.contains(el)),
    );
    return czesci.map((el) => el.innerText).join('\n');
  });

const POLA_TEKSTOWE = 'input[type="number"], input[type="text"], input:not([type]), input[type="date"], input[type="time"]';

for (const n of NARZEDZIA) {
  const adres = adresNarzedzia(n.slug);

  test(`${n.slug}: komunikaty błędów według wspólnego wzorca`, async ({ page }) => {
    await page.goto(adres);
    await page.waitForTimeout(PRZERWA);
    const problemy = await page.evaluate(() => {
      const wynik: string[] = [];
      const opisane = (id: string) =>
        [...document.querySelectorAll('[aria-describedby]')].some((p) =>
          (p.getAttribute('aria-describedby') ?? '').split(/\s+/).includes(id),
        );
      for (const b of document.querySelectorAll<HTMLElement>('.blad-pola')) {
        const nazwa = b.id || b.outerHTML.slice(0, 80);
        if (b.getAttribute('role') !== 'alert') wynik.push(`${nazwa}: brak role="alert"`);
        if (!b.id) wynik.push(`${nazwa}: komunikat bez id`);
        else if (!opisane(b.id)) wynik.push(`${nazwa}: żadne pole nie wskazuje go w aria-describedby`);
        if (b.parentElement?.closest('[aria-live], [role="status"], [role="log"], [role="alert"]'))
          wynik.push(`${nazwa}: wewnątrz regionu aria-live (podwójne ogłoszenie)`);
        if (!b.hidden && b.textContent?.trim()) wynik.push(`${nazwa}: widoczny przy wartościach domyślnych`);
      }
      for (const p of document.querySelectorAll('[aria-invalid="true"]'))
        wynik.push(`${p.id || p.getAttribute('name')}: aria-invalid przy wartościach domyślnych`);
      return wynik;
    });
    expect(problemy).toEqual([]);

    // Szukamy pola, które przy złej wartości pokazuje błąd: puste, ujemne albo bardzo duże.
    const pola = await page.locator(`form.kalkulator :is(${POLA_TEKSTOWE})`).all();
    let sprawdzone: Locator | null = null;
    let poprzednia = '';
    for (const pole of pola.slice(0, 8)) {
      if (!(await pole.isVisible()) || !(await pole.isEditable())) continue;
      const typ = (await pole.getAttribute('type')) ?? 'text';
      const proby = ['date', 'time'].includes(typ) ? [''] : ['', '-1', '999999999'];
      const oryginal = await pole.inputValue();
      for (const v of proby) {
        await pole.fill(v);
        const widoczny = await page
          .locator('.blad-pola:visible')
          .first()
          .waitFor({ timeout: PRZERWA })
          .then(() => true)
          .catch(() => false);
        if (widoczny) {
          sprawdzone = pole;
          break;
        }
      }
      if (sprawdzone) {
        poprzednia = oryginal;
        break;
      }
      await pole.fill(oryginal);
    }
    if (!sprawdzone) {
      test.info().annotations.push({ type: 'bez błędu', description: 'żadna prosta zła wartość nie wywołała komunikatu' });
      return;
    }
    await page.waitForTimeout(PRZERWA);

    // Każdy widoczny komunikat ma oznaczone pole (aria-invalid), które go wskazuje.
    const bezPola = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.blad-pola')]
        .filter((b) => !b.hidden)
        .filter(
          (b) =>
            ![...document.querySelectorAll('[aria-invalid="true"]')].some((p) =>
              (p.getAttribute('aria-describedby') ?? '').split(/\s+/).includes(b.id),
            ),
        )
        .map((b) => `${b.id}: ${b.textContent}`),
    );
    expect(bezPola, 'komunikat bez pola z aria-invalid="true"').toEqual([]);

    // Kolejne zdarzenia z tą samą wartością (jak kolejne znaki, które nie zmieniają błędu) nie ruszają komunikatu.
    await page.evaluate(() => {
      const w = window as unknown as { zmianyBledu: number };
      w.zmianyBledu = 0;
      const obserwator = new MutationObserver((m) => (w.zmianyBledu += m.length));
      for (const b of document.querySelectorAll('.blad-pola'))
        obserwator.observe(b, { attributes: true, childList: true, characterData: true, subtree: true });
    });
    for (let i = 0; i < 3; i++) {
      await sprawdzone.dispatchEvent('input');
      await sprawdzone.dispatchEvent('change');
    }
    await page.waitForTimeout(PRZERWA);
    expect(await page.evaluate(() => (window as unknown as { zmianyBledu: number }).zmianyBledu), 'komunikat wpisany ponownie').toBe(0);

    // Po poprawie komunikat i aria-invalid znikają.
    await sprawdzone.fill(poprzednia);
    await expect(page.locator('.blad-pola:visible')).toHaveCount(0);
    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  });

  test(`${n.slug}: po powrocie „Wstecz” wynik odpowiada polom`, async ({ page }) => {
    await page.goto(adres);
    await page.waitForTimeout(PRZERWA);
    // Pole, którego zmiana zmienia wynik; pola z autocomplete="off" przeglądarka nie przywraca.
    const kandydaci = await page
      .locator('form.kalkulator :is(select, input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="file"]))')
      .all();
    let sonda: Locator | null = null;
    let wartosc = '';
    let przed = await tekstWyniku(page);
    for (const k of kandydaci.slice(0, 14)) {
      if (!(await k.isVisible()) || !(await k.isEnabled())) continue;
      if ((await k.getAttribute('autocomplete')) === 'off') continue;
      if ((await k.evaluate((el) => el.closest('form')?.getAttribute('autocomplete'))) === 'off') continue;
      const tag = await k.evaluate((el) => el.tagName);
      const typ = (await k.getAttribute('type')) ?? 'text';
      if (tag === 'SELECT') {
        const opcje = await k.evaluate((el) =>
          [...(el as HTMLSelectElement).options].filter((o) => !o.disabled && !o.selected).map((o) => o.value),
        );
        if (!opcje.length) continue;
        await k.selectOption(opcje[opcje.length - 1]);
        wartosc = await k.inputValue();
      } else if (typ === 'checkbox') {
        await k.setChecked(!(await k.isChecked()));
        wartosc = String(await k.isChecked());
      } else if (typ === 'radio') {
        if (await k.isChecked()) continue;
        await k.check();
        wartosc = 'true';
      } else if (typ === 'date') {
        const v = await k.inputValue();
        const d = v ? new Date(`${v}T12:00:00Z`) : new Date('2026-06-15T12:00:00Z');
        d.setUTCDate(d.getUTCDate() + 45);
        await k.fill(d.toISOString().slice(0, 10));
        wartosc = await k.inputValue();
      } else if (typ === 'time') {
        const v = await k.inputValue();
        await k.fill(v === '07:30' ? '09:15' : '07:30');
        wartosc = await k.inputValue();
      } else if (['number', 'text', 'search', 'tel'].includes(typ)) {
        const v = Number((await k.inputValue()).replace(/\s/g, '').replace(',', '.'));
        await k.fill(String(Number.isFinite(v) && v > 0 ? Math.round(v * 2) + 1 : 10));
        wartosc = await k.inputValue();
      } else continue;
      await page.waitForTimeout(150);
      const po = await tekstWyniku(page);
      if (po !== przed) {
        sonda = k;
        break;
      }
      przed = po;
    }
    if (!sonda) {
      test.info().annotations.push({ type: 'bez sondy', description: 'żadne przywracane pole nie zmienia wyniku' });
      return;
    }
    await page.waitForTimeout(PRZERWA);
    const widziane = await tekstWyniku(page);
    await page.goto('/');
    await page.goBack();
    await page.waitForLoadState('load');
    await page.waitForTimeout(PRZERWA);
    const typ = (await sonda.getAttribute('type')) ?? '';
    const przywrocone = ['checkbox', 'radio'].includes(typ) ? String(await sonda.isChecked()) : await sonda.inputValue();
    expect(przywrocone, 'przeglądarka nie przywróciła pola (test nic nie sprawdza)').toBe(wartosc);
    const poPowrocie = await tekstWyniku(page);
    expect(poPowrocie, 'wynik po powrocie inny niż przed wyjściem').toBe(widziane);
    // Ponowne liczenie z tymi samymi polami niczego nie zmienia.
    await sonda.dispatchEvent('input');
    await sonda.dispatchEvent('change');
    await page.waitForTimeout(PRZERWA);
    expect(await tekstWyniku(page)).toBe(poPowrocie);
  });
}
