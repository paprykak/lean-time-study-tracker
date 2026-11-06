import { describe, expect, it } from 'vitest';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { WTYCZKI, ZNACZNIK_REKLAMY } from './markdown.mjs';

// Ten sam potok co przy buildzie (Astro 7, silnik Sätteri), z wtyczkami serwisu.
const procesor = await createSatteriMarkdownProcessor({ hastPlugins: WTYCZKI });
const html = async (md: string, frontmatter: Record<string, unknown> = {}) => (await procesor.render(md, { frontmatter })).code;
const znacznik = `<!--${ZNACZNIK_REKLAMY}-->`;
const akapity = (n: number) => Array.from({ length: n }, (_, i) => `Akapit ${i + 1}.`).join('\n\n');

describe('tabele', () => {
  it('tabela jest w przewijanym kontenerze .tabela', async () => {
    expect((await html('| a | b |\n| - | - |\n| 1 | 2 |')).trim()).toMatch(/^<div class="tabela"><table>[\s\S]*<\/table><\/div>$/);
  });
});

describe('miejsce reklamy w treści', () => {
  it('stoi po 3. akapicie, a nie po cytacie czy liście', async () => {
    const wynik = await html(`> Cytat\n\n${akapity(2)}\n\n- lista\n\n${akapity(3)}`);
    expect(wynik.split(znacznik)[0].match(/<p>Akapit/g)).toHaveLength(3);
  });

  it('akapit z dwukropkiem na końcu zapowiada listę, więc reklama idzie po następnym', async () => {
    const wynik = await html('Jeden.\n\nDwa.\n\nTrzy zapowiada:\n\n- punkt\n\nCztery.\n\nPięć.');
    expect(wynik).toContain(`<p>Cztery.</p>${znacznik}`);
  });

  it('nie ma go w krótkim tekście ani na samym końcu', async () => {
    expect(await html(akapity(2))).not.toContain(znacznik);
    expect(await html(akapity(3))).not.toContain(znacznik);
    expect((await html(akapity(4))).split(znacznik)).toHaveLength(2);
  });
});

describe('linki zewnętrzne', () => {
  const md = '[Zewnętrzny](https://example.com) i [nasz](https://rytmhali.pl/oee) i [względny](/temat/oee)';
  it('w zwykłym tekście rel="noopener", linki serwisu bez zmian', async () => {
    const wynik = await html(md);
    expect(wynik).toContain('<a href="https://example.com" rel="noopener">');
    expect(wynik).toContain('<a href="https://rytmhali.pl/oee">');
    expect(wynik).toContain('<a href="/temat/oee">');
  });
  it('w materiale partnera rel="sponsored noopener"', async () => {
    expect(await html(md, { partner: { partner: 'firma' } })).toContain('<a href="https://example.com" rel="sponsored noopener">');
  });
});

describe('śródtytuły', () => {
  it('mają kotwice z polskimi znakami (spis treści)', async () => {
    const { metadata } = await procesor.render('## Krok 1: oddziel czynności\n\nTekst.', { frontmatter: {} });
    expect(metadata.headings).toEqual([{ depth: 2, slug: 'krok-1-oddziel-czynności', text: 'Krok 1: oddziel czynności' }]);
  });
});
