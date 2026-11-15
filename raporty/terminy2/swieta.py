"""Niezależny kalendarz dni wolnych i art. 115 KC dla testów pakietu „terminy 2” (bez kodu z TS).
Święta: ustawa z 18.01.1951 r. o dniach wolnych od pracy, art. 1 (Wigilia od 2025 r., Trzech Króli od 2011 r.);
sobota przesuwa koniec terminu od 1.01.2017 r. (art. 115 KC po zmianie z Dz.U. 2016 poz. 2255); 12.11.2018 r. jednorazowo."""
from datetime import date, timedelta

def wielkanoc(r):
    a = r % 19; b = r // 100; c = r % 100; d = b // 4; e = b % 4
    f = (b + 8) // 25; g = (b - f + 1) // 3; h = (19 * a + b - d - g + 15) % 30
    i = c // 4; k = c % 4; l = (32 + 2 * e + 2 * i - h - k) % 7; m = (a + 11 * h + 22 * l) // 451
    mies = (h + l - 7 * m + 114) // 31; dz = ((h + l - 7 * m + 114) % 31) + 1
    return date(r, mies, dz)

def swieta(r):
    w = wielkanoc(r)
    s = {date(r, 1, 1), w, w + timedelta(1), date(r, 5, 1), date(r, 5, 3), w + timedelta(49), w + timedelta(60),
         date(r, 8, 15), date(r, 11, 1), date(r, 11, 11), date(r, 12, 25), date(r, 12, 26)}
    if r >= 2011: s.add(date(r, 1, 6))
    if r >= 2025: s.add(date(r, 12, 24))
    if r == 2018: s.add(date(2018, 11, 12))
    return s

def wolny(d):
    return d in swieta(d.year) or d.weekday() == 6 or (d.weekday() == 5 and d >= date(2017, 1, 1))

def art115(d):
    while wolny(d): d += timedelta(1)
    return d
