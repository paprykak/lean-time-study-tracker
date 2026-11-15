# Niezależny rachunek do src/lib/narzedzia/odmowa-nadgodzin.test.ts: datetime zamiast minut.
# art. 132 § 1 Kp: 11 h odpoczynku w dobie (doba od startu zmiany, art. 128 § 3 pkt 1); art. 151 § 3: 150 h w roku.
from datetime import datetime, timedelta
D0 = datetime(2026, 11, 16)  # poniedziałek, dzień startu zmiany
def t(h, dzien=0):
    g, m = map(int, h.split(':')); return D0 + timedelta(days=dzien, hours=g, minutes=m)
def licz(start, koniec_zmiany, koniec_pracy, nastepna):
    s = t(start); k = t(koniec_zmiany); e = t(koniec_pracy)
    if k <= s: k += timedelta(days=1)
    if e <= s: e += timedelta(days=1)
    n = t(nastepna, 1) if nastepna else None
    koniec_doby = s + timedelta(hours=24)
    granica = min(koniec_doby, n) if n else koniec_doby
    odp = granica - e
    najp = granica - timedelta(hours=11)
    return (e - k), odp, najp
for c in [('6:00','14:00','18:00','6:00'), ('6:00','14:00','20:00','6:00'), ('6:00','14:00','20:00',''),
          ('22:00','6:00','8:00','22:00'), ('14:00','22:00','23:30','6:00'), ('6:00','18:00','19:00','6:00'),
          ('6:00','14:00','14:00','6:00'), ('7:00','15:00','17:30','5:00')]:
    nad, odp, najp = licz(*c)
    dz = (najp.date() - D0.date()).days
    print(c, 'nadgodziny', nad, 'odpoczynek', odp, 'najpozniej', najp.strftime('%H:%M'), '+%d' % dz)
# limit
for wroku, dzis_h, limit in [(146, 4, 150), (146, 4.5, 150), (150, 1, 150), (0, 2, 150), (190, 5, 200)]:
    print('limit', wroku, dzis_h, limit, 'przekroczony' if wroku + dzis_h > limit else 'ok', 'zostalo', max(0, limit - wroku))
