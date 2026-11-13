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
    expect(pokaz(typografia('(§ 15), zgodnie z § 9 ust. 3'))).toBe('(§~15), zgodnie z~§~9 ust.~3');
    expect(pokaz(typografia('Przezbrojenie – czas od ostatniej sztuki'))).toBe('Przezbrojenie~– czas od ostatniej sztuki');
  });

  it('„lp.” z numerem pozycji i dzień z nazwą miesiąca', () => {
    expect(pokaz(typografia('Lp. 12 i lp. 3a w tabeli; help. 5'))).toBe('Lp.~12 i~lp.~3a w~tabeli; help. 5');
    expect(pokaz(typografia('od 13 listopada 2026 r. do 1 stycznia, 31 grudnia i 9 maja'))).toBe('od 13~listopada 2026~r. do 1~stycznia, 31~grudnia i~9~maja');
    expect(pokaz(typografia('5 września, 22 października, 28 lutego'))).toBe('5~września, 22~października, 28~lutego');
    // Nie wiąże: liczba trzycyfrowa albo część większej liczby, miesiąc w mianowniku, słowo dłuższe niż nazwa miesiąca.
    expect(pokaz(typografia('120 maja, 1.5 marca, 13 listopad, 3 majami'))).toBe('120 maja, 1.5 marca, 13 listopad, 3 majami');
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

describe('typografiaWHtml', () => {
  it('twarde spacje w tekście, znaczniki i atrybuty bez zmian', async () => {
    const { typografiaWHtml, NBSP } = await import('./typografia.mjs');
    const html = '<p class="a i">Stawka z płacy w <a href="/x y">art. 151<sup>8</sup></a> i 160 h.</p><script>var a = "w x";</script>';
    expect(typografiaWHtml(html)).toBe(
      `<p class="a i">Stawka z${NBSP}płacy w${NBSP}<a href="/x y">art.${NBSP}151<sup>8</sup></a> i${NBSP}160${NBSP}h.</p><script>var a = "w x";</script>`,
    );
  });
});
