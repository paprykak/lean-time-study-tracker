"""Niezależny rachunek terminów miesięcznych (art. 112 KC) do testów src/lib/narzedzia/terminy.test.ts (moduły calendar
i datetime zamiast arytmetyki na Date.UTC; pelne_miesiace liczy brute force od zera).
Użycie: python3 -I raporty/wspolny-kod/miesiace.py /tmp/wynik.json  (pierwsze 80 przypadków: ziarno 112; brzegowe: ziarno 29)."""
import datetime as dt, calendar, json, random, sys

def odpowiadajacy(od: dt.date, n: int):
    """Dzień odpowiadający datą w miesiącu od+n albo None, gdy go nie ma; i ostatni dzień tego miesiąca."""
    y, m = divmod(od.year * 12 + od.month - 1 + n, 12); m += 1
    last = calendar.monthrange(y, m)[1]
    return (dt.date(y, m, od.day) if od.day <= last else None), dt.date(y, m, last)

def koniec_okresu(od, n):
    if n == 0: return od - dt.timedelta(days=1)
    dzien, ostatni = odpowiadajacy(od, n)
    return dzien - dt.timedelta(days=1) if dzien else ostatni

def dodaj_miesiace(d, n):
    dzien, ostatni = odpowiadajacy(d, n)
    return dzien or ostatni

def pelne_miesiace(od, ostatni):
    # Brute force: zliczamy n od zera, dopóki koniec n-tego miesiąca nie przekroczy `ostatni`.
    n = 0
    while ostatni >= od and koniec_okresu(od, n + 1) <= ostatni: n += 1
    return n

if __name__ == '__main__':
    random.seed(112)
    przypadki = []
    start = dt.date(2023, 1, 1)
    for _ in range(400):
        od = start + dt.timedelta(days=random.randrange(0, 365 * 4))
        n = random.choice([0, 1, 2, 3, 6, 12, 18, 24, 33, 36, random.randrange(0, 60)])
        ost = od + dt.timedelta(days=random.randrange(-3, 1200))
        przypadki.append({'od': od.isoformat(), 'n': n, 'koniec': koniec_okresu(od, n).isoformat(),
                          'dodaj': dodaj_miesiace(od, n).isoformat(), 'ostatni': ost.isoformat(),
                          'pelne': pelne_miesiace(od, ost)})
    json.dump(przypadki, open(sys.argv[1], 'w'), indent=0)
    random.seed(29)
    starty = [dt.date(y, m, d) for y in (2023, 2024, 2025, 2027, 2028) for m in range(1, 13) for d in (28, 29, 30, 31) if d <= calendar.monthrange(y, m)[1]]
    for od in random.sample(starty, 40):
        n = random.choice([1, 2, 3, 6, 11, 12, 24, 33, 36, random.randrange(0, 48)])
        ost = koniec_okresu(od, n) + dt.timedelta(days=random.choice([-1, 0, 1]))
        print('brzegowy', od, n, koniec_okresu(od, n), dodaj_miesiace(od, n), ost, pelne_miesiace(od, ost))
    for od, n in [('2026-03-31', 6), ('2026-11-30', 3), ('2027-11-30', 3), ('2024-02-29', 12), ('2026-03-01', 3), ('2026-01-31', 1)]:
        print(od, n, koniec_okresu(dt.date.fromisoformat(od), n))
    for od, o in [('2026-08-31', '2027-02-28'), ('2026-08-31', '2027-02-27'), ('2026-01-01', '2026-01-31'), ('2026-03-31', '2026-09-30'), ('2026-03-31', '2026-09-29')]:
        print(od, o, pelne_miesiace(dt.date.fromisoformat(od), dt.date.fromisoformat(o)))
