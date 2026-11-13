# Przykład liczbowy na danych fikcyjnych do sekcji o mechanizmie: 100 indeksów, każdy sprzedaje losowo średnio 4 sztuki
# dziennie (rozkład Poissona). Wahania jednego indeksu i sumy stu: wzór i symulacja (sprawdzenie drugim sposobem).
# Uruchom: python3 redakcja/prognozowanie-popytu/dane/szum.py
import math
import random
import statistics

SREDNIA, INDEKSY, DNI = 4, 100, 20000
cv_jeden = math.sqrt(SREDNIA) / SREDNIA
cv_suma = math.sqrt(SREDNIA * INDEKSY) / (SREDNIA * INDEKSY)
los = random.Random(7)


def poisson(lam):
    # algorytm Knutha, wystarczy dla małych średnich
    granica, k, p = math.exp(-lam), 0, 1.0
    while True:
        p *= los.random()
        if p <= granica:
            return k
        k += 1


jeden, suma = [], []
for _ in range(DNI):
    dzien = [poisson(SREDNIA) for _ in range(INDEKSY)]
    jeden.append(dzien[0])
    suma.append(sum(dzien))
print(f'wzór: odchylenie standardowe / średnia — jeden indeks {cv_jeden:.1%}, suma {INDEKSY} indeksów {cv_suma:.1%}')
print(f'symulacja {DNI} dni: jeden indeks {statistics.pstdev(jeden) / statistics.mean(jeden):.1%}, suma {statistics.pstdev(suma) / statistics.mean(suma):.1%}')
print(f'dni bez sprzedaży jednego indeksu: wzór {math.exp(-SREDNIA):.1%}, symulacja {jeden.count(0) / DNI:.1%}')
