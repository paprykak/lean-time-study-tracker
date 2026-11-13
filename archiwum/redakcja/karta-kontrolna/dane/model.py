# Model do artykułu „karta-kontrolna”.
# 1) Lejek Deminga w wersji jednowymiarowej (odchyłka wymiaru od nominału, σ = 1):
#    reguła 1: nie ruszaj nastaw; reguła 2: przesuń nastawę o −(ostatnia odchyłka) względem bieżącej nastawy;
#    reguła 3: ustaw nastawę na −(ostatnia odchyłka) względem nominału; reguła 4: ustaw nastawę na ostatni wynik.
#    Wynik: odchylenie standardowe wymiaru po N sztukach (średnio z 2000 powtórzeń), dane do rysunku punktowego.
# 2) Średnia liczba punktów do sygnału (ARL) karty Shewharta dla przesunięcia średniej o 0–3σ:
#    tylko reguła 1 (punkt poza 3σ) i komplet reguł Western Electric (1–4), symulacja 20 000 serii na wariant.
import json, random, statistics as st, math

def lejek(regula, n, rng):
    f = 0.0; xs = []
    for k in range(n):
        x = f + rng.gauss(0, 1)
        xs.append(x)
        if regula == 2: f = f - x
        elif regula == 3: f = -x
        elif regula == 4: f = x
    return xs

rng = random.Random(7)
wyniki = {'lejek_sd': {}, 'lejek_przyklad': {}, 'arl': {}}
for reg in [1, 2, 3, 4]:
    for n in [50, 200]:
        sds = [st.pstdev(lejek(reg, n, rng)) for _ in range(2000)]
        wyniki['lejek_sd'][f'{reg}_{n}'] = round(st.mean(sds), 3)
    wyniki['lejek_przyklad'][str(reg)] = [round(v, 3) for v in lejek(reg, 100, random.Random(11))]

def sygnal(xs_iter, reguly):
    # zwraca numer punktu, przy którym pojawia się sygnał
    hist = []
    for i, x in enumerate(xs_iter, 1):
        hist.append(x)
        if abs(x) > 3: return i
        if reguly == 'WE':
            h = hist[-3:]
            if len(h) == 3 and (sum(v > 2 for v in h) >= 2 or sum(v < -2 for v in h) >= 2): return i
            h = hist[-5:]
            if len(h) == 5 and (sum(v > 1 for v in h) >= 4 or sum(v < -1 for v in h) >= 4): return i
            h = hist[-8:]
            if len(h) == 8 and (all(v > 0 for v in h) or all(v < 0 for v in h)): return i
    return None

def proces(przes, rng):
    while True: yield przes + rng.gauss(0, 1)

for reguly in ['3s', 'WE']:
    for przes in [0, 0.5, 1, 1.5, 2, 3]:
        r2 = random.Random(1000 + int(przes * 10) + (0 if reguly == '3s' else 1))
        serie = [sygnal(proces(przes, r2), reguly) for _ in range(20000 if przes > 0 else 4000)]
        wyniki['arl'][f'{reguly}_{przes}'] = round(st.mean(serie), 1)
json.dump(wyniki, open('wyniki.json', 'w'), indent=1)
print(wyniki['lejek_sd']); print(wyniki['arl'])
# teoria: ARL0 dla 3σ = 1/0.0027 = 370,4; dla przesunięcia 1σ: p = Φ(-2)+Φ(-4)
phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))
for d in [0, 0.5, 1, 1.5, 2, 3]:
    p = phi(-3 - d) + 1 - phi(3 - d)
    print('teoria 3s', d, round(1 / p, 1))
