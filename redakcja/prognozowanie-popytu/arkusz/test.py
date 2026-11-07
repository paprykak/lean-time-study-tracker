# Sprawdza formuły arkusza „Test prognozy”: przelicza plik w LibreOffice (bez interfejsu) i porównuje wyniki
# z wartościami policzonymi w Pythonie (przyklad.json). Sprawdza też wyprzedzenie: kopia pliku z wyprzedzeniem 3
# musi dać wynik zgodny z Pythonem dla h = 3. Uruchom z katalogu projektu po arkusz.py:
# python3 redakcja/prognozowanie-popytu/arkusz/test.py
import importlib.util
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from openpyxl import load_workbook

KORZEN = Path(__file__).resolve().parents[3]
PLIK = KORZEN / 'public/pobierz/test-prognozy.xlsx'
oczek = json.loads(Path(__file__).with_name('przyklad.json').read_text(encoding='utf8'))
A = oczek['adresy']
bledy = []


def przelicz(plik, katalog):
    subprocess.run(['soffice', '--headless', '--calc', '--convert-to', 'xlsx', '--outdir', katalog, str(plik)],
                   check=True, capture_output=True, timeout=180)
    return load_workbook(Path(katalog) / Path(plik).name, data_only=True)


def sprawdz(opis, wartosc, oczekiwana, tol=1e-6):
    ok = isinstance(wartosc, (int, float)) and abs(wartosc - oczekiwana) <= tol
    print(f"{'✓' if ok else '✗'} {opis}: {wartosc} (oczekiwane {round(oczekiwana, 6)})")
    if not ok:
        bledy.append(opis)


with tempfile.TemporaryDirectory() as tmp:
    wb = przelicz(PLIK, tmp)
    j, k, w = wb['Jeden indeks'], wb['Korekty'], wb['Wiele indeksów']
    o, a = oczek['jeden_indeks'], A['jeden']
    sprawdz('jeden indeks: okresy', j[a['n']].value, o['okresy'])
    sprawdz('jeden indeks: błąd Twojej', j[a['mt']].value, o['mae_twoja'])
    sprawdz('jeden indeks: błąd naiwnej', j[a['mn']].value, o['mae_naiwna'])
    sprawdz('jeden indeks: błąd średniej', j[a['ms']].value, o['mae_srednia'])
    sprawdz('jeden indeks: błąd wygładzania', j[a['mw']].value, o['mae_wygladzanie'])
    sprawdz('jeden indeks: Twój ÷ naiwna', j[a['rn']].value, o['twoja_do_naiwnej'])
    sprawdz('jeden indeks: Twój ÷ najlepsza prosta', j[a['rp']].value, o['twoja_do_najlepszej_prostej'])
    sprawdz('jeden indeks: odchylenie', j[a['od']].value, o['odchylenie'])
    o, a = oczek['korekty'], A['korekty']
    sprawdz('korekty: okresy', k[a['n']].value, o['okresy'])
    sprawdz('korekty: błąd po', k[a['mp']].value, o['mae_po'])
    sprawdz('korekty: błąd przed', k[a['mq']].value, o['mae_przed'])
    sprawdz('korekty: po ÷ przed', k[a['r']].value, o['po_do_przed'])
    for r, indeks in enumerate(['IND-001', 'IND-002', 'IND-003'], start=5):
        o = oczek['wiele'][indeks]
        sprawdz(f'{indeks}: okresy', w[f'Q{r}'].value, o['okresy'])
        sprawdz(f'{indeks}: Twój ÷ naiwna', w[f'R{r}'].value, o['twoja_do_naiwnej'])
        sprawdz(f'{indeks}: Twój ÷ lepsza prosta łącznie', w[f'S{r}'].value, o['twoja_do_lepszej_prostej'])
    o, a = oczek['razem'], A['razem']
    sprawdz('razem: Twój ÷ naiwna', w[a['rn']].value, o['twoja_do_naiwnej'])
    sprawdz('razem: Twój ÷ lepsza prosta', w[a['rp']].value, o['twoja_do_lepszej_prostej'])
    sprawdz('razem: odchylenie', w[a['od']].value, o['odchylenie'])
    sprawdz('granica remisu (wiele, h=1)', w['Q3'].value, 0.10)
    sprawdz('granica remisu (jeden, h=1)', j['O3'].value, 0.10)
    for opis, adres, oczekiwany in [('razem: lepsza prosta', a['lepsza'], o['lepsza_prosta']), ('razem: wygrane', a['wygrane'], o['wygrane']),
                                    ('razem: werdykt', A['razem_werdykt'], (oczek['wstepny'] if o['wstepny'] else '') + oczek['werdykty_razem'][o['kategoria']])]:
        ok = w[adres].value == oczekiwany
        print(f"{'✓' if ok else '✗'} {opis}: {w[adres].value}")
        if not ok:
            bledy.append(opis)
    for arkusz, adres in [(j, A['jeden_werdykt']), (k, A['korekty_werdykt']), (w, 'T5'), (w, 'T6'), (w, 'T7')]:
        print(f'  {arkusz.title}!{adres}: {arkusz[adres].value}')
    for arkusz in (j, k, w):
        for wiersz in arkusz.iter_rows(min_row=5, max_row=70):
            for c in wiersz:
                if isinstance(c.value, str) and c.value.startswith('#'):
                    bledy.append(f'{arkusz.title}!{c.coordinate} = {c.value}')

    # Wyprzedzenie 3: zmień parametr w kopii i porównaj z Pythonem.
    spec = importlib.util.spec_from_file_location('arkusz_gen', Path(__file__).with_name('arkusz.py'))
    from openpyxl import load_workbook as lw
    kopia = Path(tmp) / 'h3' / 'test-prognozy.xlsx'
    kopia.parent.mkdir()
    wb3 = lw(PLIK)
    wb3['Jeden indeks']['O1'] = 3
    wb3['Wiele indeksów']['Q1'] = 5
    wb3.save(kopia)
    wynik3 = przelicz(kopia, str(Path(tmp) / 'h3wynik'))
    j3 = wynik3['Jeden indeks']
    sprawdz('granica remisu (jeden, h=3)', j3['O3'].value, 0.15)
    sprawdz('granica remisu (wiele, h=5)', wynik3['Wiele indeksów']['Q3'].value, 0.20)
    sz, tw = oczek['sprzedaz'], oczek['twoja']

    def poziomy(s, alfa=0.2):
        wynik, p = [], None
        for y in s:
            p = y if p is None else alfa * y + (1 - alfa) * p
            wynik.append(p)
        return wynik

    lv = poziomy(sz)
    h = 3
    idx = [i for i in range(len(sz)) if tw[i] is not None and i - h - 3 >= 0]
    mae = lambda pary: sum(abs(x - y) for x, y in pary) / len(pary)
    a = A['jeden']
    sprawdz('h=3: okresy', j3[a['n']].value, len(idx))
    sprawdz('h=3: błąd naiwnej', j3[a['mn']].value, mae([(sz[i - h], sz[i]) for i in idx]))
    sprawdz('h=3: błąd średniej', j3[a['ms']].value, mae([(sum(sz[i - h - 3:i - h + 1]) / 4, sz[i]) for i in idx]))
    sprawdz('h=3: błąd wygładzania', j3[a['mw']].value, mae([(lv[i - h], sz[i]) for i in idx]))

    # Pełna próba: 20 indeksów po 33 tygodnie (h = 1, czyli 29 porównanych) daje werdykt bez dopisku „Wynik wstępny”.
    import random
    los = random.Random(5)
    pelna = Path(tmp) / 'pelna' / 'test-prognozy.xlsx'
    pelna.parent.mkdir()
    wbp = lw(PLIK)
    wp = wbp['Wiele indeksów']
    for r in range(5, 5 + 60):
        for k in range(1, 5):
            wp.cell(row=r, column=k).value = None
    r = 5
    for i in range(20):
        for t_ in range(33):
            sp = max(0, round(100 + los.gauss(0, 15)))
            wp.cell(row=r, column=1).value = f'K{i + 1:02d}'
            wp.cell(row=r, column=2).value = t_ + 1
            wp.cell(row=r, column=3).value = sp
            wp.cell(row=r, column=4).value = round(100 + los.gauss(0, 10))
            r += 1
    wbp.save(pelna)
    wp2 = przelicz(pelna, str(Path(tmp) / 'pelna-wynik'))['Wiele indeksów']
    sprawdz('pełna próba: porównane okresy K01', wp2['Q5'].value, 29)
    sprawdz('pełna próba: porównane okresy K20', wp2['Q24'].value, 29)
    werdykt_pelny = wp2[A['razem_werdykt']].value
    ok = isinstance(werdykt_pelny, str) and not werdykt_pelny.startswith('Wynik wstępny') and werdykt_pelny in oczek['werdykty_razem'].values()
    print(f"{'✓' if ok else '✗'} pełna próba: werdykt bez dopisku: {werdykt_pelny}")
    if not ok:
        bledy.append('pełna próba: werdykt')

if bledy:
    print('BŁĘDY:', bledy)
    sys.exit(1)
print('arkusz zgodny z obliczeniami')
