import { expect, test } from '@playwright/test';
import { NARZEDZIA, adresNarzedzia } from '../../src/data/narzedzia';

// Telefon 320 px na wszystkich narzędziach z rejestru (pakiet „spójność UX”, 2026-11-13): brak przewijania w bok,
// żadna opcja listy nie jest ucięta po wybraniu (np. „październik”, „Odpoczynek”), pole daty i godziny mieści wartość
// z ikoną, tekst nie jest ucięty przez overflow ani nie wychodzi poza swój element. Pomijamy elementy sr-only,
// pułapkę na boty w newsletterze i tabele w przewijanym pojemniku (.tabela), które przewijają się celowo. Sprawdzamy
// stan domyślny i każdy tryb formularza (opcje list, pola wyboru), bo tryby odsłaniają inne pola.
// Szerokość tekstu mierzymy fontem strony (jak w jakosc2-uklad.spec.ts); strzałka listy i ikona pola to stałe zapasy.
test.use({ viewport: { width: 320, height: 700 } });
test.beforeEach(({}, info) => test.skip(info.project.name !== 'komputer', 'układ 320 px sprawdzamy w jednym projekcie'));

for (const n of NARZEDZIA) {
  test(`${n.slug}: nic nie jest ucięte przy 320 px`, async ({ page }) => {
    await page.goto(adresNarzedzia(n.slug));
    await page.evaluate(() => document.fonts.ready);
    const sprawdz = () => page.evaluate(async () => {
      const p: string[] = [];
      const de = document.documentElement;
      if (de.scrollWidth > de.clientWidth + 1) p.push(`przewijanie w bok: ${de.scrollWidth} > ${de.clientWidth}`);
      const ctx = document.createElement('canvas').getContext('2d')!;
      const font = (el: Element) => {
        const s = getComputedStyle(el);
        return `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      };
      const widoczny = (el: Element) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
      };
      const pominiety = (el: Element) => !!el.closest('.sr-only, .newsletter-pulapka, svg');
      const nazwa = (el: Element) => (el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
      for (const s of document.querySelectorAll<HTMLSelectElement>('main select')) {
        if (!widoczny(s) || pominiety(s)) continue;
        ctx.font = font(s);
        await document.fonts.load(ctx.font, [...s.options].map((o) => o.text).join(''));
        const st = getComputedStyle(s);
        // Lista bez natywnej strzałki (appearance: none, np. litery zmian w kalendarzu grafiku) nie potrzebuje zapasu.
        const strzalka = st.appearance === 'none' ? 0 : 28;
        const miejsce = s.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight) * (strzalka ? 0 : 1) - strzalka;
        const uciete = [...s.options].filter((o) => ctx.measureText(o.text).width > miejsce).map((o) => o.text);
        if (uciete.length) p.push(`lista ${nazwa(s)} (${Math.round(miejsce)} px): ${uciete.join(' | ')}`);
      }
      for (const i of document.querySelectorAll<HTMLInputElement>('main input')) {
        if (!widoczny(i) || pominiety(i) || ['checkbox', 'radio', 'hidden', 'range'].includes(i.type)) continue;
        ctx.font = font(i);
        const st = getComputedStyle(i);
        const tresc = i.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight);
        const wzor = i.type === 'date' ? '00.00.0000' : i.type === 'time' ? '00:00' : null;
        if (wzor) {
          const potrzeba = ctx.measureText(wzor).width + 26;
          if (tresc < potrzeba) p.push(`pole ${nazwa(i)}: ${Math.round(tresc)} px < ${Math.round(potrzeba)} px`);
        } else {
          for (const t of [i.value, i.placeholder])
            if (t && ctx.measureText(t).width > tresc) p.push(`pole ${nazwa(i)}: „${t}” szersze niż ${Math.round(tresc)} px`);
        }
      }
      for (const el of document.querySelectorAll<HTMLElement>('main *')) {
        if (!widoczny(el) || pominiety(el) || ['SELECT', 'INPUT', 'TEXTAREA', 'OPTION'].includes(el.tagName)) continue;
        const nadmiar = el.scrollWidth - el.clientWidth;
        if (nadmiar <= 1 || !el.clientWidth) continue;
        const st = getComputedStyle(el);
        const tekst = (el.innerText || '').trim().slice(0, 60).replace(/\s+/g, ' ');
        if (['auto', 'scroll'].includes(st.overflowX)) {
          if (!el.classList.contains('tabela')) p.push(`przewijany ${nazwa(el)} (${nadmiar} px): „${tekst}”`);
        } else if (['hidden', 'clip'].includes(st.overflowX) || st.textOverflow === 'ellipsis') {
          p.push(`ucięty ${nazwa(el)} (${nadmiar} px): „${tekst}”`);
        } else if ([...el.childNodes].some((w) => w.nodeType === Node.TEXT_NODE && w.textContent?.trim())) {
          p.push(`wychodzi poza ${nazwa(el)} (${nadmiar} px): „${tekst}”`);
        }
      }
      return p;
    });
    // Stan domyślny, a potem każdy tryb formularza: każda opcja list i każde pole wyboru odsłaniają inne pola
    // (np. rodzaj dźwigu w uprawnieniach UDT). Najwyżej 80 stanów na stronę.
    const problemy = new Map<string, string>();
    const dopisz = async (stan: string) => {
      for (const x of await sprawdz()) if (!problemy.has(x)) problemy.set(x, stan);
    };
    await dopisz('domyślnie');
    let stany = 0;
    const listy = await page.locator('form.kalkulator select:visible').all();
    for (const lista of listy) {
      if (!(await lista.isVisible()) || !(await lista.isEnabled())) continue;
      const pierwotna = await lista.inputValue();
      const wartosci = await lista.evaluate((el) => [...(el as HTMLSelectElement).options].map((o) => o.value));
      if (wartosci.length > 14) continue;
      for (const v of wartosci) {
        if (v === pierwotna || stany++ >= 80) continue;
        await lista.selectOption(v);
        await dopisz(`${(await lista.getAttribute('id')) ?? 'lista'}=${v}`);
      }
      await lista.selectOption(pierwotna);
    }
    for (const radio of await page.locator('form.kalkulator input[type="radio"]:visible').all()) {
      if ((await radio.isChecked()) || !(await radio.isVisible()) || stany++ >= 80) continue;
      const nazwa = await radio.getAttribute('name');
      const zaznaczone = page.locator(`form.kalkulator input[type="radio"][name="${nazwa}"]:checked`);
      const pierwotne = (await zaznaczone.count()) ? zaznaczone.first() : null;
      await radio.check();
      await dopisz(`${nazwa}=${await radio.getAttribute('value')}`);
      if (pierwotne && (await pierwotne.isVisible())) await pierwotne.check();
    }
    expect([...problemy].map(([x, stan]) => `${stan}: ${x}`)).toEqual([]);
  });
}
