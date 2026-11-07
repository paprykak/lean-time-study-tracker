# Rachunek redakcji (dane fikcyjne): ile wart jest krótszy czas przezbrojenia w dwóch miejscach.
# A. Linia bez wąskiego gardła: wartość to mniejsze partie i zapas. Ekonomiczna wielkość partii (Harris):
#    Q* = sqrt(2·D·S/H), roczny koszt przezbrojeń i utrzymania zapasu = sqrt(2·D·S·H) — rośnie z pierwiastkiem S.
# B. Wąskie gardło: wartość to odzyskane godziny pracy linii, które zamieniają się w sprzedaną produkcję.
# Uruchom: python3 redakcja/smed-przezbrojenia/dane/rachunek.py → dane/wyniki.json
import json
from math import sqrt
from pathlib import Path

D = 24_000          # roczny popyt na wyrób (szt.)
KOSZT_GODZINY = 600  # koszt godziny postoju linii przy przezbrojeniu (zł): ludzie, energia, odpady
H = 5.0             # roczny koszt utrzymania sztuki w zapasie (zł): 25% od kosztu wytworzenia 20 zł
CZAS_MIN = 60       # czas przezbrojenia przed zmianą (min)

wyniki = {'zalozenia': {'popyt_roczny_szt': D, 'koszt_godziny_postoju_zl': KOSZT_GODZINY, 'koszt_utrzymania_szt_rok_zl': H,
                        'czas_przezbrojenia_min': CZAS_MIN}, 'linia_bez_waskiego_gardla': []}
for skrocenie in (0.0, 0.2, 0.38, 0.5, 0.75):
    S = KOSZT_GODZINY * CZAS_MIN * (1 - skrocenie) / 60
    Q = sqrt(2 * D * S / H)
    koszt = sqrt(2 * D * S * H)
    wyniki['linia_bez_waskiego_gardla'].append({
        'skrocenie_przezbrojenia_proc': round(skrocenie * 100), 'koszt_przezbrojenia_zl': round(S),
        'partia_szt': round(Q), 'przezbrojen_rocznie': round(D / Q, 1), 'koszt_roczny_zl': round(koszt),
    })
baza = wyniki['linia_bez_waskiego_gardla'][0]['koszt_roczny_zl']
for w in wyniki['linia_bez_waskiego_gardla']:
    w['oszczednosc_roczna_zl'] = baza - w['koszt_roczny_zl']
    w['oszczednosc_proc'] = round(100 * (1 - w['koszt_roczny_zl'] / baza), 1)

# B. Wąskie gardło: 15 przezbrojeń tygodniowo po 50 min, 48 tygodni pracy, marża 400 zł z godziny pracy linii.
PRZEZBROJENIA_TYG, CZAS_B, TYGODNIE, MARZA_H = 15, 50, 48, 400
for skrocenie in (0.2, 0.38, 0.5):
    godziny_tyg = PRZEZBROJENIA_TYG * CZAS_B * skrocenie / 60
    wyniki.setdefault('waskie_gardlo', []).append({
        'skrocenie_proc': round(skrocenie * 100), 'odzyskane_godziny_tyg': round(godziny_tyg, 2),
        'odzyskane_godziny_rok': round(godziny_tyg * TYGODNIE, 1), 'marza_roczna_zl': round(godziny_tyg * TYGODNIE * MARZA_H),
    })
wyniki['zalozenia'].update({'waskie_gardlo_przezbrojenia_tyg': PRZEZBROJENIA_TYG, 'waskie_gardlo_czas_min': CZAS_B,
                            'tygodnie_pracy': TYGODNIE, 'marza_z_godziny_zl': MARZA_H})
print(json.dumps(wyniki, ensure_ascii=False, indent=1))
Path(__file__).with_name('wyniki.json').write_text(json.dumps(wyniki, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
