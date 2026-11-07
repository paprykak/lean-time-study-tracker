# Wyniki konkursu M5 „Accuracy” z oficjalnego pliku organizatorów („Scores and Ranks.xlsx”,
# https://github.com/Mcompetitions/M5-methods, sprawdzone 2026-11-07). Plik nie jest w repozytorium:
# pobierz repozytorium i podaj ścieżkę do pliku.
# Uruchom: python3 -I redakcja/prognozowanie-popytu/dane/m5.py "<ścieżka>/Scores and Ranks.xlsx"
# Wynik: redakcja/prognozowanie-popytu/dane/m5-wyniki.json
import json
import sys
from pathlib import Path

import openpyxl

wb = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
POZIOMY = [f'L{i}' for i in range(1, 13)] + ['Avg']


def tabela(arkusz):
    wiersze = list(wb[arkusz].iter_rows(values_only=True))
    wynik = {}
    for w in wiersze[2:]:
        if w[0] is None:
            continue
        wynik[str(w[0]).strip()] = dict(zip(POZIOMY, w[1:14]))
    return wynik


bench = tabela('Accuracy-Benchmarks (AL)')
top = tabela('Accuracy-Top50 (AL)')
zwyciezca_nazwa = min(top, key=lambda k: top[k]['Avg'])
zw = top[zwyciezca_nazwa]
najlepszy_bench = min(bench, key=lambda k: bench[k]['Avg'])
statystyczne = {k: v for k, v in bench.items()}


def poprawa(a, b):  # o ile procent a jest mniejszy (lepszy) od b
    return round(100 * (1 - a / b), 1)


wynik = {
    'zrodlo': 'Mcompetitions/M5-methods, Scores and Ranks.xlsx, arkusze Accuracy-Benchmarks (AL) i Accuracy-Top50 (AL)',
    'benchmarki_avg': {k: round(v['Avg'], 3) for k, v in sorted(bench.items(), key=lambda kv: kv[1]['Avg'])},
    'najlepszy_benchmark': najlepszy_bench,
    'zwyciezca': zwyciezca_nazwa,
    'zwyciezca_avg': round(zw['Avg'], 3),
    'poprawa_zwyciezcy_nad_najlepszym_benchmarkiem_avg_proc': poprawa(zw['Avg'], bench[najlepszy_bench]['Avg']),
    'poprawa_zwyciezcy_nad_najlepszym_benchmarkiem_wg_poziomu_proc': {
        p: poprawa(zw[p], min(v[p] for v in bench.values())) for p in POZIOMY
    },
    'najlepszy_benchmark_wg_poziomu': {p: min(bench, key=lambda k: bench[k][p]) for p in POZIOMY},
    'poprawa_zwyciezcy_nad_sNaive_wg_poziomu_proc': {p: poprawa(zw[p], bench['sNaive'][p]) for p in POZIOMY},
    'top50_avg_min_max': [round(min(v['Avg'] for v in top.values()), 3), round(max(v['Avg'] for v in top.values()), 3)],
    'top50_poprawa_nad_najlepszym_benchmarkiem_min_proc': poprawa(max(v['Avg'] for v in top.values()), bench[najlepszy_bench]['Avg']),
    'top50_L12_poprawa_nad_najlepszym_benchmarkiem_L12_proc': {
        'min': poprawa(max(v['L12'] for v in top.values()), min(b['L12'] for b in bench.values())),
        'max': poprawa(min(v['L12'] for v in top.values()), min(b['L12'] for b in bench.values())),
    },
    'liczba_zespolow_top': len(top),
    'L12_benchmarki': {k: round(v['L12'], 3) for k, v in sorted(bench.items(), key=lambda kv: kv[1]['L12'])},
    'L12_zwyciezca': round(zw['L12'], 3),
}
import statistics
# Uzupełnienia po recenzji (2026-11-07): zwycięzca względem prognozy naiwnej, średniej ruchomej i ES_bu na każdym poziomie,
# mediana 50 najlepszych zespołów względem najlepszej metody porównawczej i część przewagi nad prognozą naiwną,
# którą daje już automatyczne wygładzanie wykładnicze (ES_bu).
wynik['zwyciezca_nad_metoda_wg_poziomu_proc'] = {
    m: {p: poprawa(zw[p], bench[m][p]) for p in POZIOMY} for m in ('Naive', 'sNaive', 'MA', 'ES_bu')
}
wynik['mediana_top50_nad_najlepszym_benchmarkiem_wg_poziomu_proc'] = {
    p: poprawa(statistics.median(v[p] for v in top.values()), min(b[p] for b in bench.values())) for p in POZIOMY
}
wynik['es_bu_czesc_przewagi_zwyciezcy_nad_naiwna_proc'] = {
    p: round(100 * (bench['Naive'][p] - bench['ES_bu'][p]) / (bench['Naive'][p] - zw[p]), 1) for p in POZIOMY
}
wynik['es_bu_nad_naiwna_i_ma_avg_proc'] = {'Naive': poprawa(bench['ES_bu']['Avg'], bench['Naive']['Avg']), 'MA': poprawa(bench['ES_bu']['Avg'], bench['MA']['Avg'])}
wynik['esx_nad_es_td_avg_proc'] = poprawa(bench['ESX']['Avg'], bench['ES_td']['Avg'])
wynik['arimax_nad_arima_td_avg_proc'] = poprawa(bench['ARIMAX']['Avg'], bench['ARIMA_td']['Avg'])
cel = Path(__file__).with_name('m5-wyniki.json')
cel.write_text(json.dumps(wynik, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
print(json.dumps(wynik, ensure_ascii=False, indent=1))
