# Model do artykułu „obciazenie-maszyn”: kolejka przed jednym stanowiskiem (G/G/1).
# 1) wzór Kingmana: Wq ≈ ((ca² + cs²) / 2) · (u / (1 − u)) · te
# 2) symulacja (rekurencja Lindleya) z rozkładami gamma o zadanej zmienności, 400 000 zleceń, 5 powtórzeń
# 3) przykład na danych fikcyjnych: wąskie gardło, czas obróbki zlecenia 30 min
import json, random, statistics as st

def kingman(u, ca2, cs2, te=1.0):
    return (ca2 + cs2) / 2 * u / (1 - u) * te

def gamma_cv(mean, cv, rng):
    if cv == 0: return mean
    k = 1 / cv**2
    return rng.gammavariate(k, mean / k)

def symuluj(u, ca, cs, n=400_000, seed=1):
    rng = random.Random(seed)
    te, ta = 1.0, 1.0 / u
    w, suma = 0.0, 0.0
    rozgrzewka = n // 10
    for i in range(n):
        s = gamma_cv(te, cs, rng)
        a = gamma_cv(ta, ca, rng)
        if i >= rozgrzewka: suma += w
        w = max(0.0, w + s - a)
    return suma / (n - rozgrzewka)

wyniki = {'krzywe': {}, 'symulacja': [], 'przyklad': {}}
for nazwa, c2 in [('wysoka', 1.0), ('srednia', 0.5), ('niska', 0.25)]:
    wyniki['krzywe'][nazwa] = [[round(u, 3), round(kingman(u, c2, c2), 3)] for u in [x / 100 for x in range(30, 98)]]
for u in [0.7, 0.8, 0.85, 0.9, 0.95]:
    for cv in [1.0, 0.5]:
        sym = [symuluj(u, cv, cv, seed=s) for s in range(1, 6)]
        wyniki['symulacja'].append({'u': u, 'cv': cv, 'kingman': round(kingman(u, cv**2, cv**2), 2), 'symulacja': round(st.mean(sym), 2), 'rozrzut': round(st.pstdev(sym), 2)})
te = 30  # min, dane fikcyjne
for u in [0.75, 0.8, 0.85, 0.9, 0.95]:
    wq = kingman(u, 1.0, 1.0, te)
    wyniki['przyklad'][str(u)] = {'oczekiwanie_min': round(wq), 'czas_przejscia_min': round(wq + te), 'zlecen_na_8h': round(8 * 60 / te * u, 1),
                                 'wip_little': round((u / te) * (wq + te), 2)}
json.dump(wyniki, open('wyniki.json', 'w'), indent=1)
for r in wyniki['symulacja']: print(r)
for k, v in wyniki['przyklad'].items(): print(k, v)
