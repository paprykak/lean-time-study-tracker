# Wyniki konkursu M4 (prognozy punktowe) z oficjalnego pliku organizatorów („Evaluation and Ranks.xlsx”,
# https://github.com/Mcompetitions/M4-methods, sprawdzone 2026-11-07). Plik nie jest w repozytorium: podaj ścieżkę.
# Uruchom: python3 -I redakcja/prognozowanie-popytu/dane/m4.py "<ścieżka>/Evaluation and Ranks.xlsx"
# Wynik: redakcja/prognozowanie-popytu/dane/m4-wyniki.json
import json
import sys
from pathlib import Path

import openpyxl

ws = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)['Point Forecasts-Summary']
wiersze = [w for w in list(ws.iter_rows(values_only=True))[2:] if w[0] is not None and isinstance(w[24], (int, float))]
metody = [{'id': w[0], 'zespol': w[1], 'afiliacja': w[2], 'typ': w[3], 'smape': w[10], 'mase': w[17], 'owa': w[24],
           'ranga_owa': w[26]} for w in wiersze]
zgloszenia = [m for m in metody if m['afiliacja'] not in ('Benchmark', 'Standard for comparison')]
bench = {m['id']: m for m in metody if m['afiliacja'] in ('Benchmark', 'Standard for comparison')}
comb, naive2 = bench['Com'], bench['Naive2']  # „Com” to w pliku benchmark Comb (SES, Holt, Damped)
ml = [m for m in zgloszenia if m['typ'] in ('Machine Learning', 'Combination (ML)')]
najlepszy = min(zgloszenia, key=lambda m: m['owa'])
wynik = {
    'zrodlo': 'Mcompetitions/M4-methods, Evaluation and Ranks.xlsx, arkusz Point Forecasts-Summary',
    'liczba_metod': len(metody),
    'liczba_zgloszen': len(zgloszenia),
    'typy_w_tabeli_benchmarkow': sorted({m['afiliacja'] for m in metody if m not in zgloszenia}),
    'zwyciezca': {k: najlepszy[k] for k in ('zespol', 'afiliacja', 'typ', 'owa', 'smape')},
    'comb_owa': comb['owa'], 'naive2_owa': naive2['owa'],
    'poprawa_zwyciezcy_nad_comb_owa_proc': round(100 * (1 - najlepszy['owa'] / comb['owa']), 1),
    'zgloszenia_lepsze_od_comb_owa': sum(m['owa'] < comb['owa'] for m in zgloszenia),
    'zgloszenia_lepsze_od_naive2_owa': sum(m['owa'] < naive2['owa'] for m in zgloszenia),
    'czyste_ml': [{k: m[k] for k in ('zespol', 'afiliacja', 'typ', 'owa', 'ranga_owa')} for m in sorted(ml, key=lambda m: m['owa'])],
    'czyste_ml_lepsze_od_comb': sum(m['owa'] < comb['owa'] for m in ml),
    'czyste_ml_lepsze_od_naive2': sum(m['owa'] < naive2['owa'] for m in ml),
    'benchmarki_ml': {k: bench[k]['owa'] for k in bench if bench[k]['typ'] == 'Machine Learning'},
    'pierwsza_piatka': [{k: m[k] for k in ('zespol', 'afiliacja', 'typ', 'owa', 'ranga_owa')} for m in sorted(zgloszenia, key=lambda m: m['owa'])[:5]],
}
cel = Path(__file__).with_name('m4-wyniki.json')
cel.write_text(json.dumps(wynik, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
print(json.dumps(wynik, ensure_ascii=False, indent=1))
