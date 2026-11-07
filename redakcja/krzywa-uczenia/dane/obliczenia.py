# Obliczenia redakcji na opublikowanych danych: Kleiza V., Tilindis J. (2014), Nonlinear Analysis: Modelling and Control
# 19(4), tabela 1 (eksperyment 1: ręczny montaż wiązki przewodów; numer sztuki → czas montażu w godzinach).
# Liczymy: ile godzin ponad czas ustalony (średnia z pomiarów po sztuce 163) kosztowało dojście do niego,
# przy interpolacji log-liniowej między pomiarami (model krzywej uczenia: log czasu liniowo od log numeru sztuki).
# Uruchom: python3 redakcja/krzywa-uczenia/dane/obliczenia.py → dane/wyniki.json
import json
from math import log, exp
from pathlib import Path

POMIARY = [(2, 6.880), (44, 3.078), (100, 2.423), (163, 2.047), (172, 2.128), (204, 2.224), (236, 2.212),
           (268, 2.178), (301, 2.233), (349, 2.114), (396, 2.101), (428, 2.136), (460, 2.140)]
ustalony = sum(y for x, y in POMIARY if x >= 163) / len([1 for x, y in POMIARY if x >= 163])


def czas(n):
    """Czas sztuki n z interpolacji log-liniowej między pomiarami (przed sztuką 2: wartość ze sztuki 2)."""
    if n <= POMIARY[0][0]:
        return POMIARY[0][1]
    for (x1, y1), (x2, y2) in zip(POMIARY, POMIARY[1:]):
        if x1 <= n <= x2:
            t = (log(n) - log(x1)) / (log(x2) - log(x1))
            return exp(log(y1) + t * (log(y2) - log(y1)))
    return POMIARY[-1][1]


nadwyzka = sum(max(0.0, czas(n) - ustalony) for n in range(1, 164))
pierwsze_100 = sum(czas(n) for n in range(1, 101))
wyniki = {
    'zrodlo': 'Kleiza i Tilindis (2014), tabela 1, eksperyment 1',
    'czas_ustalony_h': round(ustalony, 3),
    'czas_sztuki_2_h': 6.880, 'czas_sztuki_44_h': 3.078, 'czas_sztuki_100_h': 2.423, 'czas_sztuki_163_h': 2.047,
    'sztuka_2_do_ustalonego_razy': round(6.880 / ustalony, 2),
    'godziny_ponad_ustalony_do_sztuki_163': round(nadwyzka, 1),
    'rownowaznik_sztuk_w_czasie_ustalonym': round(nadwyzka / ustalony, 1),
    'czas_pierwszych_100_sztuk_h': round(pierwsze_100, 1),
    'czas_100_sztuk_po_nauce_h': round(100 * ustalony, 1),
}
print(json.dumps(wyniki, ensure_ascii=False, indent=1))
Path(__file__).with_name('wyniki.json').write_text(json.dumps(wyniki, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
