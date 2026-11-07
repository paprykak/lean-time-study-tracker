# Symulacja redakcji (dane fikcyjne): jak bardzo przez sam przypadek różni się stosunek średnich błędów (MAE)
# dwóch prognoz o tej samej trafności, gdy porównujemy je na n okresach. Błędy normalne, korelacja rho
# (prognozy zwykle mylą się podobnie, bo widzą te same dane). Uruchom: python3 redakcja/prognozowanie-popytu/dane/remis.py
import json
import math
import random
from pathlib import Path

los = random.Random(11)
POWTORZENIA = 20000
wynik = {}
for n, rhos, powt in [(12, (0.5, 0.7, 0.9), POWTORZENIA), (26, (0.5, 0.7, 0.9), POWTORZENIA), (52, (0.5, 0.7, 0.9), POWTORZENIA), (520, (0.7,), 4000)]:
    # n = 520: 20 indeksów po 26 okresów, błędy liczone łącznie (sumy błędów)
    for rho in rhos:
        ilorazy = []
        for _ in range(powt):
            a = b = 0.0
            for _ in range(n):
                z1, z2 = los.gauss(0, 1), los.gauss(0, 1)
                e1 = z1
                e2 = rho * z1 + math.sqrt(1 - rho * rho) * z2
                a += abs(e1)
                b += abs(e2)
            ilorazy.append(a / b)
        ilorazy.sort()
        p5, p95 = ilorazy[int(0.05 * powt)], ilorazy[int(0.95 * powt)]
        poza = sum(1 for x in ilorazy if x < 0.95 or x > 1.05) / powt
        wynik[f'n{n}_rho{rho}'] = {'przedzial_90proc': [round(p5, 2), round(p95, 2)], 'poza_remisem_5proc': round(poza, 2)}
        print(n, rho, round(p5, 2), round(p95, 2), f'poza ±5%: {poza:.0%}')
Path(__file__).with_name('remis-wyniki.json').write_text(json.dumps(wynik, indent=1) + '\n', encoding='utf8')
