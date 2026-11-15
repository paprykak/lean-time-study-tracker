import { describe, expect, it } from 'vitest';
import { przygotuj, szukaj } from '../szukaj-narzedzi';
import { indeksNarzedzi } from '../indeks-narzedzi';

// Pakiet „zfss”: dosłowne podpowiedzi wyszukiwarki Google (pl, 2026-11-15) mają prowadzić do narzędzia o funduszu
// socjalnym (pierwsza trójka), a pytania o świadczenie urlopowe dalej do świadczenia urlopowego.
const p = przygotuj(indeksNarzedzi());
const wsrod = (q: string, ile = 3) => szukaj(p, q, ile).map((w) => w.wpis.s);
const pierwszy = (q: string) => szukaj(p, q)[0]?.wpis.s;

describe('wyszukiwarka: fundusz socjalny', () => {
  it.each([
    'fundusz socjalny',
    'fundusz socjalny 2026',
    'fundusz socjalny w pracy',
    'fundusz socjalny ile wynosi',
    'fundusz socjalny ile na pracownika',
    'fundusz socjalny dla emerytów',
    'fundusz socjalny ile bez podatku',
    'zfśs co to',
    'zfśs od ilu pracowników',
    'zfśs odpis 2026',
    'zfśs kwota wolna od podatku 2026',
    'czy każdy pracodawca musi mieć fundusz socjalny',
    'kiedy pracodawca musi mieć fundusz socjalny',
    'wczasy pod gruszą zasady',
    'wczasy pod gruszą dla kogo',
    'bony świąteczne dla pracowników',
  ])('„%s” → fundusz-socjalny w pierwszej trójce', (q) => {
    expect(wsrod(q)).toContain('fundusz-socjalny');
  });
  it('pierwsze miejsce przy pytaniach wprost o fundusz', () => {
    for (const q of ['fundusz socjalny', 'zfśs', 'fundusz socjalny ile na pracownika', 'czy pracodawca musi mieć fundusz socjalny']) expect(pierwszy(q), q).toBe('fundusz-socjalny');
  });
  it('świadczenie urlopowe zostaje przy swoich pytaniach', () => {
    for (const q of ['świadczenie urlopowe', 'świadczenie urlopowe 2026 ile', 'wczasy pod gruszą ile dni urlopu trzeba wziąć']) expect(wsrod(q), q).toContain('swiadczenie-urlopowe');
    expect(pierwszy('świadczenie urlopowe')).toBe('swiadczenie-urlopowe');
  });
});
