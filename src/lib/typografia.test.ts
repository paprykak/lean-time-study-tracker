import { describe, expect, it } from 'vitest';
import { czesciTypografii, NBSP, typografia, typografiaHtml } from './typografia.mjs';

const pokaz = (t: string) => t.replaceAll(NBSP, '~');

describe('typografia: twarde spacje', () => {
  it('jednoliterowe słowa wiążą się z następnym, także dwa z rzędu i po nawiasie', () => {
    expect(pokaz(typografia('brał udział w uruchomieniu centrum i szkolił trenerów, a w Faraone (w Polsce)'))).toBe(
      'brał udział w~uruchomieniu centrum i~szkolił trenerów, a~w~Faraone (w~Polsce)',
    );
    expect(pokaz(typografia('W Amazonie i Z dala'))).toBe('W~Amazonie i~Z~dala');
  });

  it('nie rusza liter w środku słów ani na końcu tekstu (chyba że coś po nim stoi)', () => {
    expect(pokaz(typografia('kawa i'))).toBe('kawa i');
    expect(pokaz(typografia('kawa i ', { ciagDalszy: true }))).toBe('kawa i~');
    expect(pokaz(typografia('Toyota w'))).toBe('Toyota w');
  });

  it('liczby: tysiące, jednostki i rok', () => {
    expect(pokaz(typografia('12 500 zł, 47 min, 1 250 000 palet, w 2017 r. i 18,5 %'))).toBe('12~500~zł, 47~min, 1~250~000~palet, w~2017~r. i~18,5~%');
    expect(pokaz(typografia('od 2017 500 osób'))).toBe('od 2017 500~osób');
    expect(pokaz(typografia('średnia z 4 tygodni, 26 tygodnie, 15,2 sztuki, 120 sztuk, 4 okresów, 12 miesięcy'))).toBe('średnia z~4~tygodni, 26~tygodnie, 15,2~sztuki, 120~sztuk, 4~okresów, 12~miesięcy');
  });

  it('skróty wiążą się z tym, co po nich, a półpauza nie zaczyna wiersza', () => {
    expect(pokaz(typografia('np. Toyota, art. 14a, tzw. SMED'))).toBe('np.~Toyota, art.~14a, tzw.~SMED');
    expect(pokaz(typografia('Przezbrojenie – czas od ostatniej sztuki'))).toBe('Przezbrojenie~– czas od ostatniej sztuki');
  });
});

describe('typografia: dywiz i HTML', () => {
  it('krótki człon z dywizem w elemencie, który się nie łamie; tekst zakodowany', () => {
    expect(typografiaHtml('e-commerce z 50-osobowym zespołem & <b>')).toBe(
      '<span class="nierozdzielnie">e-commerce</span> z~<span class="nierozdzielnie">50-osobowym</span> zespołem &amp; &lt;b&gt;'.replaceAll('~', NBSP),
    );
    expect(typografiaHtml('Lean-Six Sigma i biało-czerwony')).toBe(`Lean-Six Sigma i${NBSP}biało-czerwony`);
  });

  it('części dla drzewa HTML', () => {
    expect(czesciTypografii('logistyka e-commerce')).toEqual([
      { type: 'text', value: 'logistyka ' },
      { type: 'element', tagName: 'span', properties: { className: ['nierozdzielnie'] }, children: [{ type: 'text', value: 'e-commerce' }] },
    ]);
    expect(czesciTypografii('bez zmian')).toEqual([{ type: 'text', value: 'bez zmian' }]);
  });
});
