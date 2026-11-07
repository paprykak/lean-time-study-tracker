# Symulacja redakcji (dane fikcyjne): jak bardzo przez sam przypadek różni się stosunek średnich błędów (MAE)
# dwóch prognoz o tej samej trafności, gdy porównujemy je na n okresach. Błędy normalne, korelacja rho
# (prognozy zwykle mylą się podobnie, bo widzą te same dane). Uruchom: python3 redakcja/prognozowanie-popytu/dane/remis.py
# Część 2 (numpy): 20 indeksów różnej wielkości liczonych razem, jak w arkuszu „Wiele indeksów”, z wyprzedzeniem h.
# Uzasadnia granice remisu w arkuszu (±10% przy h 1–2, ±15% przy h 3–4, ±20% od 5) i liczbę wygranych indeksów.
# Część 3: przy jakiej próbie werdykt jest pełny (20 indeksów po 26 porównanych okresów), a kiedy tylko wstępny.
import json
import math
import random
from pathlib import Path

import numpy as np

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
# ---------- Część 2: wiele indeksów różnej wielkości, wyprzedzenie h ----------
# Trzy równie trafne prognozy: Twoja (A), średnia (B) i wygładzanie (C). Korelacja innowacji A–B i A–C = rho, B–C = rho_bc.
# Błąd z wyprzedzeniem h to suma h kolejnych innowacji (sąsiednie prognozy dzielą h−1 z nich: wariant pesymistyczny).
# Rozrzut błędu indeksu rośnie jak wielkość^beta (beta = 1: duże indeksy ważą najwięcej, wariant pesymistyczny).
# Liczymy jak arkusz: suma błędów wszystkich indeksów; A ÷ B; A ÷ lepsza z B i C; wygrane indeksy względem tej
# z metod B i C, która wypadła lepiej łącznie (iloraz < 1).
rng = np.random.default_rng(7)
R2, T2 = 4000, 26
ROZMIARY = np.array([400] * 7 + [60] * 7 + [15] * 6, dtype=float)


def wiele(beta, h, rho=0.7, rho_bc=0.9):
    kor = np.array([[1, rho, rho], [rho, 1, rho_bc], [rho, rho_bc, 1]])
    z = rng.standard_normal((R2, 20, T2 + h - 1, 3)) @ np.linalg.cholesky(kor).T
    c = np.cumsum(np.concatenate([np.zeros((R2, 20, 1, 3)), z], axis=2), axis=2)
    e = (c[:, :, h:, :] - c[:, :, :-h, :]) / np.sqrt(h) * (ROZMIARY ** beta)[None, :, None, None]
    s = np.abs(e).sum(axis=2)
    S = s.sum(axis=1)
    r_ab = S[:, 0] / S[:, 1]
    r_best = S[:, 0] / np.minimum(S[:, 1], S[:, 2])
    lepsza = np.where(S[:, 1] <= S[:, 2], 1, 2)
    mian = np.take_along_axis(s, np.repeat(lepsza[:, None, None], 20, axis=1), axis=2)[:, :, 0]
    wygrane = (s[:, :, 0] / mian < 1).sum(axis=1)
    q = lambda x, p: round(float(np.quantile(x, p)), 2)
    poza = lambda x: {f'{int(t * 100)}proc': round(float(np.mean(np.abs(x - 1) > t)), 2) for t in (0.05, 0.10, 0.15, 0.20)}
    return {
        'twoja_do_sredniej_przedzial_90proc': [q(r_ab, .05), q(r_ab, .95)], 'twoja_do_sredniej_poza_remisem': poza(r_ab),
        'twoja_do_lepszej_prostej_5_50_95': [q(r_best, .05), round(float(np.median(r_best)), 3), q(r_best, .95)],
        'twoja_do_lepszej_prostej_poza_remisem': poza(r_best),
        'wygrane_indeksy_6_do_14_z_20': round(float(np.mean((wygrane >= 6) & (wygrane <= 14))), 3),
    }


for beta in (0.5, 1.0):
    for h in (1, 2, 3, 4, 6, 8):
        wynik[f'wiele_beta{beta}_h{h}_rho0.7'] = w = wiele(beta, h)
        print('wiele', beta, h, w['twoja_do_sredniej_przedzial_90proc'], w['twoja_do_lepszej_prostej_5_50_95'], w['wygrane_indeksy_6_do_14_z_20'])
for rho, rho_bc in ((0.5, 0.8), (0.9, 0.95)):
    for h in (1, 3, 6):
        wynik[f'wiele_beta1.0_h{h}_rho{rho}'] = w = wiele(1.0, h, rho, rho_bc)
        print('wiele', 1.0, h, rho, w['twoja_do_sredniej_przedzial_90proc'])
# ---------- Część 3: mniejsze próby (ile danych potrzeba do pełnego werdyktu w arkuszu) ----------
# Ten sam model co w części 2; liczymy, jak często dwie równie dobre prognozy dostają werdykt inny niż remis
# (Twoja ÷ lepsza z dwóch prostych poza granicą arkusza: ±10% przy h 1–2, ±15% przy 3–4, ±20% od 5).
def proba(rozmiary, T, beta, h, rho=0.7, rho_bc=0.9, R=4000):
    roz = np.array(rozmiary, dtype=float)
    k = len(roz)
    kor = np.array([[1, rho, rho], [rho, 1, rho_bc], [rho, rho_bc, 1]])
    z = rng.standard_normal((R, k, T + h - 1, 3)) @ np.linalg.cholesky(kor).T
    c = np.cumsum(np.concatenate([np.zeros((R, k, 1, 3)), z], axis=2), axis=2)
    e = (c[:, :, h:, :] - c[:, :, :-h, :]) / np.sqrt(h) * (roz ** beta)[None, :, None, None]
    S = np.abs(e).sum(axis=2).sum(axis=1)
    rb = S[:, 0] / np.minimum(S[:, 1], S[:, 2])
    g = 0.10 if h <= 2 else 0.15 if h <= 4 else 0.20
    return {'przedzial_90proc': [round(float(np.quantile(rb, .05)), 2), round(float(np.quantile(rb, .95)), 2)],
            'falszywy_werdykt': round(float(np.mean(np.abs(rb - 1) > g)), 2)}


PROBY = {'20_indeksow': [400] * 7 + [60] * 7 + [15] * 6, '15_indeksow': [400] * 5 + [60] * 5 + [15] * 5,
         '6_rodzin': [400] * 6, '3_indeksy_jak_przyklad': [400, 60, 15]}
for nazwa, roz in PROBY.items():
    for T in ((12,) if nazwa.startswith('3_') else (13, 20, 26)):
        for h in (1, 2, 4, 6):
            for beta in (0.5, 1.0):
                wynik[f'proba_{nazwa}_T{T}_h{h}_beta{beta}'] = w = proba(roz, T, beta, h)
            print('proba', nazwa, T, h, w)
Path(__file__).with_name('remis-wyniki.json').write_text(json.dumps(wynik, indent=1) + '\n', encoding='utf8')
