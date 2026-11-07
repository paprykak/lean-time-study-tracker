# Sprawdza formuły arkusza „Test prognozy”: przelicza plik w LibreOffice (bez interfejsu) i porównuje wyniki
# z wartościami policzonymi w Pythonie (przyklad.json). Uruchom z katalogu projektu po arkusz.py:
# python3 redakcja/prognozowanie-popytu/arkusz/test.py
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from openpyxl import load_workbook

KORZEN = Path(__file__).resolve().parents[3]
PLIK = KORZEN / 'public/pobierz/test-prognozy.xlsx'
oczek = json.loads(Path(__file__).with_name('przyklad.json').read_text(encoding='utf8'))

with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(['soffice', '--headless', '--calc', '--convert-to', 'xlsx', '--outdir', tmp, str(PLIK)],
                   check=True, capture_output=True, timeout=180)
    wb = load_workbook(Path(tmp) / PLIK.name, data_only=True)

bledy = []


def sprawdz(opis, wartosc, oczekiwana, tol=1e-6):
    ok = isinstance(wartosc, (int, float)) and abs(wartosc - oczekiwana) <= tol
    print(f"{'✓' if ok else '✗'} {opis}: {wartosc} (oczekiwane {round(oczekiwana, 6)})")
    if not ok:
        bledy.append(opis)


j, k, w = wb['Jeden indeks'], wb['Korekty'], wb['Wiele indeksów']
o = oczek['jeden_indeks']
sprawdz('jeden indeks: okresy', j['L5'].value, o['okresy'])
sprawdz('jeden indeks: błąd Twojej', j['L6'].value, o['mae_twoja'])
sprawdz('jeden indeks: błąd naiwnej', j['L7'].value, o['mae_naiwna'])
sprawdz('jeden indeks: błąd średniej', j['L8'].value, o['mae_srednia'])
sprawdz('jeden indeks: Twój ÷ naiwna', j['L9'].value, o['twoja_do_naiwnej'])
sprawdz('jeden indeks: Twój ÷ średnia', j['L10'].value, o['twoja_do_sredniej'])
sprawdz('jeden indeks: odchylenie', j['L13'].value, o['odchylenie'])
o = oczek['korekty']
sprawdz('korekty: okresy', k['K5'].value, o['okresy'])
sprawdz('korekty: błąd po', k['K6'].value, o['mae_po'])
sprawdz('korekty: błąd przed', k['K7'].value, o['mae_przed'])
sprawdz('korekty: po ÷ przed', k['K8'].value, o['po_do_przed'])
for r, indeks in enumerate(['IND-001', 'IND-002', 'IND-003'], start=5):
    o = oczek['wiele'][indeks]
    sprawdz(f'{indeks}: okresy', w[f'L{r}'].value, o['okresy'])
    sprawdz(f'{indeks}: Twój ÷ naiwna', w[f'M{r}'].value, o['twoja_do_naiwnej'])
    sprawdz(f'{indeks}: Twój ÷ średnia', w[f'N{r}'].value, o['twoja_do_sredniej'])
for arkusz, adres in [(j, 'K17'), (k, 'J17'), (w, 'O5'), (w, 'O6'), (w, 'O7')]:
    print(f'  werdykt {arkusz.title}!{adres}: {arkusz[adres].value}')
# Pusty wiersz bez danych nie może dać błędu formuły (#VALUE!, #DIV/0! itd.).
for arkusz in (j, k, w):
    for wiersz in arkusz.iter_rows(min_row=5, max_row=60):
        for c in wiersz:
            if isinstance(c.value, str) and c.value.startswith('#'):
                bledy.append(f'{arkusz.title}!{c.coordinate} = {c.value}')
if bledy:
    print('BŁĘDY:', bledy)
    sys.exit(1)
print('arkusz zgodny z obliczeniami')
