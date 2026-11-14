import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OPOZNIENIE_BLEDU, liczPoPowrocie, pokazBlad } from './formularz';

// Atrapy elementów DOM (testy jednostkowe działają w Node); zachowanie w przeglądarce sprawdza tests/e2e/formularze.spec.ts.
class Pole {
  atrybuty = new Map<string, string>();
  constructor(opis?: string) {
    if (opis) this.atrybuty.set('aria-describedby', opis);
  }
  getAttribute(n: string) {
    return this.atrybuty.get(n) ?? null;
  }
  setAttribute(n: string, w: string) {
    this.atrybuty.set(n, w);
  }
  removeAttribute(n: string) {
    this.atrybuty.delete(n);
  }
}

class Komunikat {
  hidden = true;
  zapisy = 0;
  private tekst = '';
  constructor(
    public id: string,
    private pola: Pole[],
  ) {}
  get textContent() {
    return this.tekst;
  }
  set textContent(t: string) {
    this.zapisy++;
    this.tekst = t;
  }
  closest() {
    return { querySelectorAll: () => this.pola.filter((p) => p.getAttribute('aria-describedby') !== null) };
  }
}

const nowy = () => {
  const a = new Pole('k-blad k-opis');
  const b = new Pole('k-blad');
  const c = new Pole('inny');
  const k = new Komunikat('k-blad', [a, b, c]);
  return { a, b, c, k, el: k as unknown as HTMLElement };
};

describe('pokazBlad', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('pokazuje komunikat po przerwie w pisaniu, z twardymi spacjami i aria-invalid', () => {
    const { a, b, c, k, el } = nowy();
    pokazBlad(el, 'Wpisz kwotę od 1 zł.', [a as unknown as Element]);
    expect(k.hidden).toBe(true);
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU);
    expect(k.hidden).toBe(false);
    expect(k.textContent).toBe('Wpisz kwotę od 1 zł.');
    expect(a.getAttribute('aria-invalid')).toBe('true');
    expect(b.getAttribute('aria-invalid')).toBeNull();
    expect(c.getAttribute('aria-invalid')).toBeNull();
  });

  it('nie wpisuje ponownie tego samego tekstu (czytnik nie ogłasza go przy każdym znaku)', () => {
    const { k, el } = nowy();
    pokazBlad(el, 'Błąd.');
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU);
    expect(k.zapisy).toBe(1);
    for (let i = 0; i < 5; i++) pokazBlad(el, 'Błąd.');
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU * 2);
    expect(k.zapisy).toBe(1);
    expect(k.hidden).toBe(false);
  });

  it('przy szybkim pisaniu pokazuje tylko ostatni komunikat', () => {
    const { k, el } = nowy();
    pokazBlad(el, 'Pierwszy.');
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU - 1);
    pokazBlad(el, 'Drugi.');
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU - 1);
    expect(k.hidden).toBe(true);
    vi.advanceTimersByTime(1);
    expect(k.textContent).toBe('Drugi.');
    expect(k.zapisy).toBe(1);
  });

  it('bez listy pól oznacza pola, które wskazują komunikat w aria-describedby', () => {
    const { a, b, c, el } = nowy();
    pokazBlad(el, 'Błąd.');
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU);
    expect([a, b, c].map((p) => p.getAttribute('aria-invalid'))).toEqual(['true', 'true', null]);
  });

  it('chowa komunikat od razu, zdejmuje aria-invalid i anuluje czekający komunikat', () => {
    const { a, b, k, el } = nowy();
    pokazBlad(el, 'Błąd.', [a, b] as unknown as Element[]);
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU);
    pokazBlad(el, 'Inny błąd.', [b as unknown as Element]);
    pokazBlad(el, null);
    expect(k.hidden).toBe(true);
    expect(k.textContent).toBe('');
    expect(a.getAttribute('aria-invalid')).toBeNull();
    expect(b.getAttribute('aria-invalid')).toBeNull();
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU * 2);
    expect(k.hidden).toBe(true);
  });

  it('zmiana treści widocznego komunikatu od razu zdejmuje aria-invalid z pól, których już nie dotyczy', () => {
    const { a, b, el } = nowy();
    pokazBlad(el, 'Błąd A.', [a, b] as unknown as Element[]);
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU);
    pokazBlad(el, 'Błąd B.', [b as unknown as Element]);
    expect(a.getAttribute('aria-invalid')).toBeNull();
    expect(b.getAttribute('aria-invalid')).toBe('true');
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU);
    expect(b.getAttribute('aria-invalid')).toBe('true');
  });

  it('ten sam komunikat dla innego pola przenosi tylko aria-invalid', () => {
    const { a, b, k, el } = nowy();
    pokazBlad(el, 'Błąd.', a as unknown as Element);
    vi.advanceTimersByTime(OPOZNIENIE_BLEDU);
    pokazBlad(el, 'Błąd.', b as unknown as Element);
    expect(a.getAttribute('aria-invalid')).toBeNull();
    expect(b.getAttribute('aria-invalid')).toBe('true');
    expect(k.zapisy).toBe(1);
  });
});

describe('liczPoPowrocie', () => {
  it('liczy po każdym pageshow', () => {
    const sluchacze: (() => void)[] = [];
    vi.stubGlobal('window', { addEventListener: (n: string, f: () => void) => n === 'pageshow' && sluchacze.push(f) });
    const przelicz = vi.fn();
    liczPoPowrocie(przelicz);
    sluchacze.forEach((f) => f());
    expect(przelicz).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
