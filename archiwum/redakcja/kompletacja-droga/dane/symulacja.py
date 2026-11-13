# Symulacja redakcji (dane fikcyjne): droga kompletującego w magazynie z jednym blokiem regałów.
# 10 alejek po 30 miejsc z każdej strony (600 lokalizacji, 600 indeksów), alejki co 3 m, miejsce co 1 m,
# punkt wydań w lewym przednim rogu. Popyt skośny: 20% indeksów daje ok. 80% pobrań (rozkład Zipfa, przykład).
# Porównujemy dwie trasy (S-shape: przejście każdej alejki z pobraniem; largest gap: wejście z obu stron
# z pominięciem największej przerwy) i dwa rozmieszczenia (losowe oraz według rotacji: najczęściej pobierane
# indeksy najbliżej punktu wydań), dla zamówień z 5, 15 i 30 pozycjami.
# Uruchom: python3 redakcja/kompletacja-droga/dane/symulacja.py  → dane/wyniki.json
import json
from pathlib import Path

import numpy as np

rng = np.random.default_rng(2026)
ALEJKI, MIEJSCA, ROZSTAW = 10, 30, 3.0
L = MIEJSCA + 1               # długość alejki między przednią a tylną drogą poprzeczną (m)
N = ALEJKI * MIEJSCA * 2      # liczba lokalizacji = liczba indeksów
ZAMOWIENIA = 20000

# Lokalizacje: (alejka, pozycja 1..MIEJSCA); dwie strony alejki mają tę samą pozycję w osi alejki.
lok = np.array([(a, y) for a in range(ALEJKI) for y in range(1, MIEJSCA + 1) for _ in range(2)])

# Popyt Zipfa z wykładnikiem dobranym tak, by 20% indeksów dawało ok. 80% pobrań.
def udzial_top20(s):
    w = 1 / np.arange(1, N + 1) ** s
    w /= w.sum()
    return w[: N // 5].sum(), w
lo, hi = 0.1, 3.0
for _ in range(60):
    s = (lo + hi) / 2
    u, _w = udzial_top20(s)
    lo, hi = (s, hi) if u < 0.8 else (lo, s)
UDZIAL, POP = udzial_top20(s)

# Rozmieszczenie: losowe albo według rotacji (najpopularniejsze najbliżej punktu wydań, odległość x + y).
odl = lok[:, 0] * ROZSTAW + lok[:, 1]
kolejnosc_lok = np.argsort(odl, kind='stable')
ROZMIESZCZENIE = {
    'losowe': rng.permutation(N),          # indeks i → lokalizacja
    'wg rotacji': kolejnosc_lok,           # indeks o randze i → i-ta najbliższa lokalizacja
}


def s_shape(alejki_y):
    """alejki_y: słownik alejka → lista pozycji. Zwraca drogę w metrach."""
    a_sorted = sorted(alejki_y)
    if not a_sorted:
        return 0.0
    poziomo = 2 * a_sorted[-1] * ROZSTAW
    if len(a_sorted) % 2 == 0:
        pion = len(a_sorted) * L
    else:  # ostatnią alejkę obsługuje się z powrotem do przodu
        pion = (len(a_sorted) - 1) * L + 2 * max(alejki_y[a_sorted[-1]])
    return poziomo + pion


def largest_gap(alejki_y):
    a_sorted = sorted(alejki_y)
    if not a_sorted:
        return 0.0
    if len(a_sorted) == 1:
        return 2 * a_sorted[0] * ROZSTAW + 2 * max(alejki_y[a_sorted[0]])
    poziomo = 2 * a_sorted[-1] * ROZSTAW
    pion = 2 * L  # pierwsza i ostatnia alejka przechodzone w całości
    for a in a_sorted[1:-1]:
        punkty = [0] + sorted(alejki_y[a]) + [L]
        najwieksza = max(b - c for c, b in zip(punkty, punkty[1:]))
        pion += 2 * (L - najwieksza)
    return poziomo + pion


TRASY = {'S-shape': s_shape, 'largest gap': largest_gap}
wyniki = {'parametry': {'alejki': ALEJKI, 'miejsca_na_strone': MIEJSCA, 'rozstaw_alejek_m': ROZSTAW, 'lokalizacje': N,
                        'zipf_s': round(s, 3), 'udzial_20proc_indeksow_w_pobraniach': round(float(UDZIAL), 3), 'zamowienia_na_wariant': ZAMOWIENIA}}
for pozycje in (5, 15, 30):
    zam = [rng.choice(N, size=pozycje, replace=False, p=POP) for _ in range(ZAMOWIENIA)]  # rangi indeksów
    wynik = {}
    for nazwa_r, przypis in ROZMIESZCZENIE.items():
        for nazwa_t, trasa in TRASY.items():
            drogi = []
            for z in zam:
                alejki = {}
                for ranga in z:
                    a, y = lok[przypis[ranga]]
                    alejki.setdefault(int(a), []).append(int(y))
                drogi.append(trasa(alejki))
            wynik[f'{nazwa_r} + {nazwa_t}'] = round(float(np.mean(drogi)), 1)
    baza = wynik['losowe + S-shape']
    wyniki[f'{pozycje}_pozycji'] = {'srednia_droga_m': wynik,
                                    'krocej_niz_losowe_S_shape_proc': {k: round(100 * (1 - v / baza), 1) for k, v in wynik.items()}}
    print(pozycje, wyniki[f'{pozycje}_pozycji'])
print('zipf s =', round(s, 3), 'udział 20% indeksów =', round(float(UDZIAL), 3))
Path(__file__).with_name('wyniki.json').write_text(json.dumps(wyniki, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
