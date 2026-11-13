import { describe, expect, it } from 'vitest';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { WTYCZKI } from './markdown.mjs';

// Ten sam potok co przy buildzie (Astro 7, silnik Sätteri), z wtyczkami serwisu.
const procesor = await createSatteriMarkdownProcessor({ hastPlugins: WTYCZKI });
const html = async (md: string) => (await procesor.render(md, { frontmatter: {} })).code;

describe('tabele', () => {
  it('tabela jest w przewijanym kontenerze .tabela', async () => {
    expect((await html('| a | b |\n| - | - |\n| 1 | 2 |')).trim()).toMatch(/^<div class="tabela"><table>[\s\S]*<\/table><\/div>$/);
  });
});

describe('linki zewnętrzne', () => {
  const md = '[Zewnętrzny](https://example.com) i [nasz](https://rytmhali.pl/narzedzia) i [względny](/narzedzia/kalkulator-l4)';
  it('w zwykłym tekście rel="noopener", linki serwisu bez zmian', async () => {
    const wynik = await html(md);
    expect(wynik).toContain('<a href="https://example.com" rel="noopener">');
    expect(wynik).toContain('<a href="https://rytmhali.pl/narzedzia">');
    expect(wynik).toContain('<a href="/narzedzia/kalkulator-l4">');
  });
});

describe('śródtytuły', () => {
  it('mają kotwice z polskimi znakami (spis treści)', async () => {
    const { metadata } = await procesor.render('## Krok 1: oddziel czynności\n\nTekst.', { frontmatter: {} });
    expect(metadata.headings).toEqual([{ depth: 2, slug: 'krok-1-oddziel-czynności', text: 'Krok 1: oddziel czynności' }]);
  });
});

describe('typografia w treści', () => {
  it('twarde spacje i krótkie człony z dywizem', async () => {
    const wynik = await html('Zespół w Szczecinie skrócił czas o 12 500 min, a e-commerce rośnie.');
    expect(wynik).toContain('w Szczecinie');
    expect(wynik).toContain('12 500 min');
    expect(wynik).toContain('a <span class="nierozdzielnie">e-commerce</span>');
  });

  it('jednoliterowe słowo przed linkiem wiąże się z linkiem; kod bez zmian', async () => {
    const wynik = await html('Szkolenie i [standard pracy](/narzedzia/przerwy-w-pracy) oraz `a b` i\n\n```\nw kodzie\n```');
    expect(wynik).toContain('i <a href="/narzedzia/przerwy-w-pracy">');
    expect(wynik).toContain('<code>a b</code>');
    expect(wynik).toContain('w kodzie');
  });
});

describe('typografia a kotwice śródtytułów', () => {
  it('śródtytuł zachowuje kotwicę ze zwykłymi spacjami („fakty-i-źródła”)', async () => {
    const wynik = await html('## Fakty i źródła\n\nTekst w akapicie.');
    expect(wynik).toContain('<h2 id="fakty-i-źródła">Fakty i źródła</h2>');
    expect(wynik).toContain('w akapicie');
  });
});
