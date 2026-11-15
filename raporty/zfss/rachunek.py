# Niezależny rachunek odpisów na ZFŚS (art. 5 ust. 2–5a ustawy o ZFŚS) do testów fundusz-socjalny.test.ts.
# Kwoty GUS przepisane z M.P. 2025 poz. 148 i M.P. 2026 poz. 232 (nie z kodu serwisu).
from decimal import Decimal as D, ROUND_HALF_UP, ROUND_CEILING
GUS = {2025: (D('7140.52'), D('7262.39')), 2026: (D('7770.04'), D('7848.60'))}
PROC = {'zwykly': '37.5', 'szczegolne': '50', 'mlodociany1': '5', 'mlodociany2': '6', 'mlodociany3': '7',
        'niepelnosprawny': '6.25', 'emeryt': '6.25', 'zlobek': '7.5'}
G = D('0.01')
for rok, (r, p) in GUS.items():
    podstawa = max(r, p)
    for k, pr in PROC.items():
        x = podstawa * D(pr) / 100
        print(rok, k, 'dokladnie', x.normalize(), 'kwota', x.quantize(G, ROUND_HALF_UP))
    for etaty in ['1', '19.999', '20', '35', '49.5', '50', '50.001', '120', '12.875', '1000000']:
        f = podstawa * D('37.5') / 100 * D(etaty)
        print(rok, 'fundusz', etaty, f.quantize(G, ROUND_HALF_UP), 'do31maja', (f * D('0.75')).quantize(G, ROUND_CEILING), 'dokl', f.normalize())
