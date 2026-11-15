"""Niezależny rachunek linijki praktycznej pakietu „terminy3” (bez kodu z TS): czy data „Zdąż do” to dzień wolny
(sobota bez względu na rok, niedziela, święto z art. 1 ustawy o dniach wolnych od pracy, 12.11.2018 r.) i ostatni dzień
roboczy (pon.–pt. bez świąt) przed nią. Uruchomienie: python3 -I raporty/terminy3/linijka.py"""
import sys
from datetime import date, timedelta
sys.path.insert(0, 'raporty/terminy2')
from swieta import swieta  # noqa: E402  (niezależny kalendarz z pakietu „terminy 2”, własna Wielkanoc)

DNI = ['w poniedziałek', 'we wtorek', 'w środę', 'w czwartek', 'w piątek', 'w sobotę', 'w niedzielę']

def wolny(d):
    return d in swieta(d.year) or d.weekday() >= 5

def roboczy_przed(d):
    d -= timedelta(1)
    while wolny(d): d -= timedelta(1)
    return d

PRZYPADKI = ['2026-12-24', '2026-12-26', '2026-12-27', '2027-01-01', '2027-01-02', '2027-01-06', '2026-05-01', '2026-05-03',
             '2027-05-03', '2027-03-28', '2027-03-29', '2026-04-05', '2026-04-06', '2016-12-31', '2017-01-07', '2016-12-24',
             '2024-12-24', '2025-12-24', '2018-11-12', '2026-11-01', '2026-12-13', '2026-12-11', '2027-05-16', '2027-05-27',
             '2021-01-02', '2028-01-01']
if __name__ == '__main__':
    for p in PRZYPADKI:
        d = date.fromisoformat(p)
        print(p, 'wolny' if wolny(d) else 'roboczy', (lambda r: f'{r.isoformat()} {DNI[r.weekday()]}')(roboczy_przed(d)) if wolny(d) else '')
