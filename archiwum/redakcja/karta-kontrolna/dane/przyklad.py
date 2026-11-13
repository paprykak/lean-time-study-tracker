# Przykład do artykułu „karta-kontrolna” (dane fikcyjne): tokarka, średnica wałka 20,00 mm, σ procesu 0,010 mm, tolerancja ±0,030 mm.
# 1) braki przy regule 1 (σ) i regule 2 (σ·√2), z rozkładu normalnego;
# 2) karta wartości indywidualnych: 20 sztuk przed zmianą, potem przesunięcie średniej o 1,5σ; granice z ruchomego rozstępu (MR̄/1,128).
import json, math, random
phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))
sig, tol = 0.010, 0.030
braki = {r: 2 * phi(-tol / s) for r, s in [('regula1', sig), ('regula2', sig * math.sqrt(2))]}
rng = random.Random(2026)
x = [20.0 + rng.gauss(0, sig) for _ in range(20)] + [20.0 + 1.5 * sig + rng.gauss(0, sig) for _ in range(20)]
baza = x[:20]
mr = [abs(baza[i] - baza[i - 1]) for i in range(1, 20)]
srednia, mrs = sum(baza) / 20, sum(mr) / 19
ucl, lcl = srednia + 3 * mrs / 1.128, srednia - 3 * mrs / 1.128
s1 = srednia + 1 * mrs / 1.128; s2 = srednia + 2 * mrs / 1.128
def sygnaly(v):
    out = []
    for i in range(len(v)):
        if v[i] > ucl or v[i] < lcl: out.append((i + 1, 'poza granicą')); continue
        if i >= 2 and sum(w > s2 for w in v[i-2:i+1]) >= 2 and v[i] > s2: out.append((i + 1, '2 z 3 powyżej 2σ')); continue
        if i >= 4 and sum(w > s1 for w in v[i-4:i+1]) >= 4 and v[i] > s1: out.append((i + 1, '4 z 5 powyżej 1σ')); continue
        if i >= 7 and all(w > srednia for w in v[i-7:i+1]): out.append((i + 1, '8 powyżej średniej')); continue
    return out
wyn = {'braki': braki, 'x': [round(v, 4) for v in x], 'srednia': round(srednia, 4), 'mr_sr': round(mrs, 4), 'ucl': round(ucl, 4), 'lcl': round(lcl, 4), 'sygnaly': sygnaly(x)}
json.dump(wyn, open('przyklad.json', 'w'), indent=1)
print(braki, round(srednia, 4), round(mrs, 4), round(ucl, 4), round(lcl, 4)); print(wyn['sygnaly'])
