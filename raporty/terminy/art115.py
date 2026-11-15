"""Niezależny rachunek art. 115 KC do testów `terminPracownika` (pakiet „terminy”).
Święta z art. 1 ustawy o dniach wolnych od pracy liczone osobno (dateutil.easter, nie algorytm z czas-pracy.ts):
Trzech Króli od 2011 r., Wigilia od 2025 r. Uruchom: python3 -I raporty/terminy/art115.py"""
from datetime import date, timedelta
from dateutil.easter import easter

def swieta(r):
    e = easter(r)
    s = {date(r,1,1), e, e+timedelta(1), date(r,5,1), date(r,5,3), e+timedelta(49), e+timedelta(60),
         date(r,8,15), date(r,11,1), date(r,11,11), date(r,12,25), date(r,12,26)}
    if r >= 2011: s.add(date(r,1,6))
    if r >= 2025: s.add(date(r,12,24))
    return s

def wolny(d):
    return d.weekday() >= 5 or d in swieta(d.year)

def art115(d):
    while wolny(d): d += timedelta(1)
    return d

PRZYPADKI = ['2026-11-16','2026-11-14','2026-11-15','2026-11-11','2026-12-24','2026-12-26','2027-12-24','2028-12-23',
             '2026-12-31','2027-01-01','2028-12-31','2027-03-27','2027-03-28','2027-05-15','2027-05-27','2026-06-04',
             '2024-12-24','2024-02-29','2028-02-29','2020-02-29','2021-01-06','2010-01-06','2027-05-01','2027-05-03',
             '2026-08-15','2027-08-15','2029-12-31','2030-11-01','2026-04-05','2026-04-06']
for p in PRZYPADKI:
    d = date.fromisoformat(p)
    print(f"  ['{p}', '{art115(d).isoformat()}'],")
