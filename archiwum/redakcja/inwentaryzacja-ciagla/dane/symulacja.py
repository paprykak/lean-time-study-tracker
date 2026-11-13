"""Jak narasta odsetek błędnych stanów między liczeniami (model redakcji, dane fikcyjne).

Założenia (fikcyjne, jawne w tekście): magazyn z 6 000 indeksów, 250 dni roboczych.
Klasa A: 20% indeksów, 8 operacji dziennie; B: 30%, 2 operacje; C: 50%, 0,3 operacji.
Każda operacja (przyjęcie, pobranie, przesunięcie) z prawdopodobieństwem p zostawia błąd w stanie.
Stan jest błędny, jeśli od ostatniego liczenia zdarzył się co najmniej jeden błąd (błędy się nie znoszą).
Liczenie przywraca poprawny stan.
"""
import json
from pathlib import Path

DNI = 250
KLASY = {'A': (0.20, 8.0, 21), 'B': (0.30, 2.0, 63), 'C': (0.50, 0.3, 250)}  # udział, operacje/dzień, cykl liczenia (dni)
INDEKSY = 6000

def blad(k, dni, p):
    return 1 - (1 - p) ** (k * dni)

def policz(p):
    roczny = [sum(u * blad(k, t, p) for u, k, _ in KLASY.values()) * 100 for t in range(DNI + 1)]
    sr_roczny = sum(roczny[:-1]) / DNI
    # liczenie cykliczne: indeksy klasy liczone równomiernie co T dni, wiek stanu rozłożony równomiernie w [0, T)
    cykl = sum(u * sum(blad(k, a, p) for a in range(T)) / T for u, k, T in KLASY.values()) * 100
    koniec = roczny[-1]
    return roczny, sr_roczny, cykl, koniec

wyniki = {'zalozenia': {'indeksy': INDEKSY, 'dni': DNI, 'klasy': KLASY}}
for p in (0.002, 0.005, 0.01):
    roczny, sr, cykl, koniec = policz(p)
    wyniki[f'p={p}'] = {'roczny_koniec_roku_proc': round(koniec, 1), 'roczny_srednio_proc': round(sr, 1), 'cykliczny_srednio_proc': round(cykl, 1),
                        'roczny_po_miesiacu_proc': round(roczny[21], 1), 'roczny_po_kwartale_proc': round(roczny[63], 1)}
    if p == 0.005:
        wyniki['krzywa_roczny_p0005'] = [round(x, 2) for x in roczny]
        wyniki['cykliczny_p0005'] = round(cykl, 2)
liczenia = {kl: round(u * INDEKSY * DNI / T) for kl, (u, k, T) in KLASY.items()}
wyniki['liczenia_rocznie'] = liczenia
wyniki['liczenia_suma'] = sum(liczenia.values())
wyniki['liczenia_dziennie'] = round(sum(liczenia.values()) / DNI, 1)
for k, v in wyniki.items():
    if not k.startswith('krzywa'):
        print(k, v)
Path(__file__).with_name('wyniki.json').write_text(json.dumps(wyniki, ensure_ascii=False, indent=1) + '\n')
