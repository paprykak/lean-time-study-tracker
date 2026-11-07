# Arkusz „Test prognozy” (materiał do pobrania do artykułu „prognozowanie-popytu”).
# Twoja prognoza porównana z dwiema darmowymi: naiwną (sprzedaż z poprzedniego okresu) i średnią z 4 poprzednich okresów.
# Arkusze: instrukcja, jeden indeks, korekty planisty, wiele indeksów. Dane przykładowe są fikcyjne.
# Uruchom z katalogu projektu: python3 redakcja/prognozowanie-popytu/arkusz/arkusz.py
# Wymaga: Python 3 z openpyxl. Wynik: public/pobierz/test-prognozy.xlsx i arkusz/przyklad.json (oczekiwane wyniki dla test.py).
import json
import random
from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

KORZEN = Path(__file__).resolve().parents[3]
WYNIK = KORZEN / 'public/pobierz/test-prognozy.xlsx'
DANE = Path(__file__).with_name('przyklad.json')

# Kolory z src/styles/global.css (atrament, tekst, tekst drugi, linia, tło pola, akcent).
ATRAMENT, TEKST, DRUGI, LINIA, POLE, AKCENT = '1D2530', '2C3440', '58626F', 'C9CFD6', 'F2F4F6', 'C2410C'
FONT = 'Calibri'
cienka = Side(style='thin', color=LINIA)
RAMKA = Border(left=cienka, right=cienka, top=cienka, bottom=cienka)
TLO_FORMULY = PatternFill('solid', fgColor=POLE)
TLO_NAGLOWKA = PatternFill('solid', fgColor=ATRAMENT)
LICZBA = '#,##0;−#,##0'
LICZBA1 = '#,##0.0;−#,##0.0'
OSTATNI = 204        # ostatni wiersz danych w arkuszach jednego indeksu (200 okresów)
OSTATNI_M = 2004     # ostatni wiersz danych w arkuszu wielu indeksów
REMIS = 0.05         # umowny próg remisu redakcji: ±5%


def naglowek(ws, wiersz, kolumny):
    for k, tekst in enumerate(kolumny, start=1):
        c = ws.cell(row=wiersz, column=k, value=tekst)
        c.font = Font(name=FONT, bold=True, color='FFFFFF', size=10)
        c.fill = TLO_NAGLOWKA
        c.alignment = Alignment(wrap_text=True, vertical='center')
        c.border = RAMKA
    ws.row_dimensions[wiersz].height = 48


def tytul(ws, tekst, podtytul):
    ws['A1'] = tekst
    ws['A1'].font = Font(name=FONT, bold=True, size=16, color=ATRAMENT)
    ws['A2'] = podtytul
    ws['A2'].font = Font(name=FONT, size=10, color=DRUGI)


def komorka(ws, adres, wartosc, fmt=None, formula=False, gruba=False):
    c = ws[adres]
    c.value = wartosc
    c.border = RAMKA
    c.font = Font(name=FONT, size=11 if formula else 10, bold=gruba or formula, color=ATRAMENT if formula else TEKST)
    c.alignment = Alignment(wrap_text=False, vertical='center', horizontal='right' if formula else 'left')
    if formula:
        c.fill = TLO_FORMULY
    if fmt:
        c.number_format = fmt
    return c


def wiersz_danych(ws, r, ostatnia_kolumna, od_formul):
    for k in range(1, ostatnia_kolumna + 1):
        c = ws.cell(row=r, column=k)
        c.border = RAMKA
        c.font = Font(name=FONT, size=10)
        if k >= od_formul:
            c.fill = TLO_FORMULY
            c.number_format = LICZBA


def blok_wynikow(ws, kol, pozycje, wiersz0=5):
    """pozycje: (opis, formuła, format). Zwraca słownik opis → adres komórki z wynikiem."""
    L, W = kol, chr(ord(kol) + 1)
    ws[f'{L}4'] = 'Wynik'
    ws[f'{L}4'].font = Font(name=FONT, bold=True, size=13, color=ATRAMENT)
    adresy = {}
    for i, (klucz, opis, formula, fmt) in enumerate(pozycje):
        r = wiersz0 + i
        komorka(ws, f'{L}{r}', opis)
        komorka(ws, f'{W}{r}', formula, fmt, formula=True)
        adresy[klucz] = f'{W}{r}'
    ws.column_dimensions[L].width = 58
    ws.column_dimensions[W].width = 13
    return adresy, wiersz0 + len(pozycje)


def werdykt(ws, kol, wiersz, formula):
    L, W = kol, chr(ord(kol) + 1)
    ws[f'{L}{wiersz}'] = 'Werdykt'
    ws[f'{L}{wiersz}'].font = Font(name=FONT, bold=True, size=11, color=ATRAMENT)
    ws[f'{L}{wiersz + 1}'] = formula
    ws.merge_cells(f'{L}{wiersz + 1}:{W}{wiersz + 3}')
    c = ws[f'{L}{wiersz + 1}']
    c.font = Font(name=FONT, bold=True, size=11, color=AKCENT)
    c.alignment = Alignment(wrap_text=True, vertical='top')
    ws[f'{L}{wiersz + 4}'] = f'Remis to różnica do ±{int(REMIS * 100)}%: umowna granica redakcji, nie norma.'
    ws[f'{L}{wiersz + 4}'].font = Font(name=FONT, italic=True, size=9, color=DRUGI)


# ---------- Dane fikcyjne (powtarzalne: stałe ziarno) ----------
los = random.Random(20261107)
TYGODNIE = 30
sprzedaz = [max(0, round(120 + 0.2 * t + los.gauss(0, 18))) for t in range(TYGODNIE)]
system = [round(sum(sprzedaz[i - 4:i]) / 4) if i >= 4 else None for i in range(TYGODNIE)]
# Planista podnosi prognozę systemu o 15% co trzeci tydzień („na wszelki wypadek”) i obniża o 3% co siódmy.
twoja = []
for i, s in enumerate(system):
    if s is None:
        twoja.append(None)
    elif i % 3 == 0:
        twoja.append(round(s * 1.15))
    elif i % 7 == 0:
        twoja.append(round(s * 0.97))
    else:
        twoja.append(s)

wiele = []
for indeks, baza, szum in [('IND-001', 400, 40), ('IND-002', 60, 15), ('IND-003', 15, 6)]:
    s = [max(0, round(baza + los.gauss(0, szum))) for _ in range(16)]
    for t in range(16):
        if t < 4:
            prognoza = None
        else:
            prognoza = round(sum(s[t - 2:t]) / 2 * (1.12 if t % 4 == 0 else 1.0))
        wiele.append((indeks, f'T{t + 1:02d}', s[t], prognoza))


# Oczekiwane wyniki liczone w Pythonie (test.py porównuje je z formułami po przeliczeniu w LibreOffice).
def mae(pary):
    return sum(abs(a - b) for a, b in pary) / len(pary)


idx = [i for i in range(TYGODNIE) if i >= 4 and twoja[i] is not None]
oczekiwane_jeden = {
    'okresy': len(idx),
    'mae_twoja': mae([(twoja[i], sprzedaz[i]) for i in idx]),
    'mae_naiwna': mae([(sprzedaz[i - 1], sprzedaz[i]) for i in idx]),
    'mae_srednia': mae([(sum(sprzedaz[i - 4:i]) / 4, sprzedaz[i]) for i in idx]),
}
oczekiwane_jeden['twoja_do_naiwnej'] = oczekiwane_jeden['mae_twoja'] / oczekiwane_jeden['mae_naiwna']
oczekiwane_jeden['twoja_do_sredniej'] = oczekiwane_jeden['mae_twoja'] / oczekiwane_jeden['mae_srednia']
oczekiwane_jeden['odchylenie'] = sum(twoja[i] - sprzedaz[i] for i in idx) / sum(sprzedaz[i] for i in idx)
idx_k = [i for i in range(TYGODNIE) if system[i] is not None]
oczekiwane_korekty = {
    'okresy': len(idx_k),
    'mae_po': mae([(twoja[i], sprzedaz[i]) for i in idx_k]),
    'mae_przed': mae([(system[i], sprzedaz[i]) for i in idx_k]),
}
oczekiwane_korekty['po_do_przed'] = oczekiwane_korekty['mae_po'] / oczekiwane_korekty['mae_przed']
oczekiwane_wiele = {}
for indeks in ['IND-001', 'IND-002', 'IND-003']:
    w = [x for x in wiele if x[0] == indeks]
    t_idx = [t for t in range(4, 16)]
    bt = sum(abs(w[t][3] - w[t][2]) for t in t_idx)
    bn = sum(abs(w[t - 1][2] - w[t][2]) for t in t_idx)
    bs = sum(abs(sum(x[2] for x in w[t - 4:t]) / 4 - w[t][2]) for t in t_idx)
    oczekiwane_wiele[indeks] = {'okresy': len(t_idx), 'twoja_do_naiwnej': bt / bn, 'twoja_do_sredniej': bt / bs}

# ---------- Skoroszyt ----------
wb = Workbook()

# Arkusz 1: instrukcja
ins = wb.active
ins.title = 'Jak używać'
tytul(ins, 'Test prognozy: czy pobijasz prognozy, które nic nie kosztują?', 'Rytm Hali · rytmhali.pl/do-pobrania/test-prognozy · wersja 1, listopad 2026')
INSTRUKCJA = [
    ('h', 'Po co ten arkusz'),
    ('p', 'Dwie prognozy nic nie kosztują: naiwna (sprzedaż z poprzedniego okresu) i średnia z czterech poprzednich okresów. '
          'Prognoza, za którą płacisz czasem planisty albo licencją systemu, powinna mylić się mniej niż one. Arkusz to sprawdza.'),
    ('h', 'Jak go wypełnić'),
    ('p', '1. „Jeden indeks”: wklej sprzedaż i swoją prognozę dla jednego indeksu, okres po okresie, najlepiej 26–52 tygodnie. '
          'Wpisuj prognozę zrobioną przed okresem, z takim wyprzedzeniem, z jakim naprawdę zamawiasz albo planujesz produkcję.'),
    ('p', '2. „Korekty”: jeśli system liczy prognozę, a planista ją poprawia, wklej obie. Arkusz pokaże, czy korekty zmniejszają błąd, osobno w górę i w dół.'),
    ('p', '3. „Wiele indeksów”: wklej dane w kolumnach indeks, okres, sprzedaż, prognoza, posortowane według indeksu i okresu. '
          'Wpisz kody indeksów w tabeli po prawej, a dostaniesz wynik dla każdego.'),
    ('p', '4. Białe kolumny wypełniasz Ty, szare liczą się same. Dane przykładowe są fikcyjne: nadpisz je swoimi.'),
    ('h', 'Jak czytać wynik'),
    ('p', '„Twój błąd ÷ błąd naiwnej” poniżej 1 znaczy, że Twoja prognoza myli się mniej niż naiwna. To minimum. '
          'Prawdziwy sprawdzian to „Twój błąd ÷ błąd średniej z 4 okresów”: tę prostą metodę trudno pobić.'),
    ('p', 'Wartość dodana prognozy (FVA, forecast value added) to ten sam wynik w procentach: o ile Twoja prognoza zmniejsza błąd darmowej. Wynik ujemny oznacza, że go zwiększa.'),
    ('p', 'Odchylenie pokazuje, czy prognoza systematycznie zawyża (wynik dodatni) albo zaniża (ujemny) sprzedaż.'),
    ('h', 'Na co uważać'),
    ('p', '• Porównuj co najmniej 8–12 okresów. Przy krótszej historii różnica kilku procent nic nie znaczy.'),
    ('p', '• Indeksy, które w wielu okresach nie sprzedają się wcale, oceniaj osobno. Średni błąd w procentach (MAPE) przy zerowej sprzedaży nie da się policzyć, dlatego arkusz liczy błąd w sztukach.'),
    ('p', '• Popyt to nie zawsze sprzedaż: gdy towaru zabrakło, sprzedaż jest niższa od popytu. Takie okresy oznacz albo pomiń.'),
    ('p', '• Arkusz nie zastępuje systemu prognoz. Pokazuje, czy obecny sposób prognozowania jest lepszy od najprostszego, zanim zapłacisz za nowy.'),
    ('p', 'Uzasadnienie i źródła: artykuł na rytmhali.pl/prognozowanie-popytu. Arkusz możesz kopiować i używać w firmie.'),
]
r = 4
for rodzaj, tekst in INSTRUKCJA:
    if rodzaj == 'h' and r > 4:
        r += 1
    c = ins.cell(row=r, column=1, value=tekst)
    c.font = Font(name=FONT, bold=rodzaj == 'h', size=12 if rodzaj == 'h' else 10, color=ATRAMENT if rodzaj == 'h' else TEKST)
    c.alignment = Alignment(wrap_text=True, vertical='top')
    ins.row_dimensions[r].height = 18 if rodzaj == 'h' else (30 if len(tekst) < 160 else 44)
    r += 1
ins.column_dimensions['A'].width = 120
ins.sheet_view.showGridLines = False

# Arkusz 2: jeden indeks
ws = wb.create_sheet('Jeden indeks')
tytul(ws, 'Jeden indeks: Twoja prognoza kontra dwie darmowe', 'Białe kolumny wypełniasz Ty, szare liczą się same. Dane przykładowe są fikcyjne.')
naglowek(ws, 4, ['Okres', 'Sprzedaż (sztuki)', 'Twoja prognoza na ten okres', 'Prognoza naiwna (poprzedni okres)',
                 'Średnia z 4 poprzednich okresów', 'Błąd Twojej', 'Błąd naiwnej', 'Błąd średniej', 'Odchylenie Twojej (prognoza − sprzedaż)'])
for i in range(OSTATNI - 4):
    r = 5 + i
    if i < TYGODNIE:
        ws.cell(row=r, column=1, value=f'T{i + 1:02d}')
        ws.cell(row=r, column=2, value=sprzedaz[i])
        ws.cell(row=r, column=3, value=twoja[i])
    ws.cell(row=r, column=4, value='=""' if r == 5 else f'=IF(AND(A{r}<>"",ISNUMBER(B{r - 1})),B{r - 1},"")')
    ws.cell(row=r, column=5, value='=""' if r < 9 else f'=IF(AND(A{r}<>"",COUNT(B{r - 4}:B{r - 1})=4),AVERAGE(B{r - 4}:B{r - 1}),"")')
    ws.cell(row=r, column=6, value=f'=IF(AND(ISNUMBER(B{r}),ISNUMBER(C{r}),ISNUMBER(D{r}),ISNUMBER(E{r})),ABS(C{r}-B{r}),"")')
    ws.cell(row=r, column=7, value=f'=IF(ISNUMBER(F{r}),ABS(D{r}-B{r}),"")')
    ws.cell(row=r, column=8, value=f'=IF(ISNUMBER(F{r}),ABS(E{r}-B{r}),"")')
    ws.cell(row=r, column=9, value=f'=IF(ISNUMBER(F{r}),C{r}-B{r},"")')
    wiersz_danych(ws, r, 9, 4)
    ws.cell(row=r, column=5).number_format = LICZBA1
    ws.cell(row=r, column=8).number_format = LICZBA1
Z = lambda k: f'{k}5:{k}{OSTATNI}'
adr, dalej = blok_wynikow(ws, 'K', [
    ('n', 'Porównane okresy', f'=COUNT({Z("F")})', '0'),
    ('mt', 'Średni błąd Twojej prognozy (sztuki)', f'=IFERROR(AVERAGE({Z("F")}),"")', LICZBA1),
    ('mn', 'Średni błąd prognozy naiwnej (sztuki)', f'=IFERROR(AVERAGE({Z("G")}),"")', LICZBA1),
    ('ms', 'Średni błąd średniej z 4 okresów (sztuki)', f'=IFERROR(AVERAGE({Z("H")}),"")', LICZBA1),
    ('rn', 'Twój błąd ÷ błąd naiwnej', '=IFERROR(L6/L7,"")', '0.00'),
    ('rs', 'Twój błąd ÷ błąd średniej z 4 okresów', '=IFERROR(L6/L8,"")', '0.00'),
    ('fn', 'Wartość dodana względem naiwnej (FVA)', '=IFERROR(1-L9,"")', '0.0%;−0.0%'),
    ('fs', 'Wartość dodana względem średniej (FVA)', '=IFERROR(1-L10,"")', '0.0%;−0.0%'),
    ('od', 'Odchylenie (+ zawyża, − zaniża), % sprzedaży', f'=IFERROR(SUM({Z("I")})/SUMPRODUCT(({Z("F")}<>"")*{Z("B")}),"")', '0.0%;−0.0%'),
    ('lp', 'Okresy, w których Twoja była bliżej sprzedaży niż naiwna', f'=IFERROR(SUMPRODUCT(({Z("F")}<>"")*({Z("F")}<{Z("G")}))/L5,"")', '0%'),
])
assert adr['rn'] == 'L9' and adr['rs'] == 'L10' and adr['n'] == 'L5'
werdykt(ws, 'K', dalej + 1, (
    f'=IF(L5<8,"Za mało okresów: porównaj co najmniej 8–12.",'
    f'IF(L9>{1 + REMIS},"Twoja prognoza myli się bardziej niż naiwna. Sprawdź korekty i odchylenie.",'
    f'IF(L10>{1 + REMIS},"Nie gorsza od naiwnej, ale zwykła średnia z 4 okresów myliłaby się mniej.",'
    f'IF(L10<{1 - REMIS},"Twoja prognoza bije obie darmowe prognozy.",'
    f'"Remis ze średnią z 4 okresów: Twoja prognoza nie jest wyraźnie lepsza od najprostszej metody."))))'
))
for kol, sz in zip('ABCDEFGHI', [8, 10, 12, 12, 12, 10, 10, 10, 14]):
    ws.column_dimensions[kol].width = sz
ws.column_dimensions['J'].width = 3
ws.freeze_panes = 'A5'

# Arkusz 3: korekty
wk = wb.create_sheet('Korekty')
tytul(wk, 'Korekty: czy poprawka planisty zmniejsza błąd?', 'Wklej prognozę systemu (przed korektą) i prognozę po korekcie. Dane przykładowe są fikcyjne.')
naglowek(wk, 4, ['Okres', 'Sprzedaż (sztuki)', 'Prognoza systemu (przed korektą)', 'Prognoza po korekcie',
                 'Błąd po korekcie', 'Błąd przed korektą', 'Odchylenie po korekcie', 'Korekta (po − przed)'])
for i in range(OSTATNI - 4):
    r = 5 + i
    if i < TYGODNIE:
        wk.cell(row=r, column=1, value=f'T{i + 1:02d}')
        wk.cell(row=r, column=2, value=sprzedaz[i])
        wk.cell(row=r, column=3, value=system[i])
        wk.cell(row=r, column=4, value=twoja[i])
    wk.cell(row=r, column=5, value=f'=IF(AND(ISNUMBER(B{r}),ISNUMBER(C{r}),ISNUMBER(D{r})),ABS(D{r}-B{r}),"")')
    wk.cell(row=r, column=6, value=f'=IF(ISNUMBER(E{r}),ABS(C{r}-B{r}),"")')
    wk.cell(row=r, column=7, value=f'=IF(ISNUMBER(E{r}),D{r}-B{r},"")')
    wk.cell(row=r, column=8, value=f'=IF(ISNUMBER(E{r}),D{r}-C{r},"")')
    wiersz_danych(wk, r, 8, 5)
adr_k, dalej = blok_wynikow(wk, 'J', [
    ('n', 'Porównane okresy', f'=COUNT({Z("E")})', '0'),
    ('mp', 'Średni błąd po korekcie (sztuki)', f'=IFERROR(AVERAGE({Z("E")}),"")', LICZBA1),
    ('mq', 'Średni błąd prognozy systemu (sztuki)', f'=IFERROR(AVERAGE({Z("F")}),"")', LICZBA1),
    ('r', 'Błąd po korekcie ÷ błąd przed korektą', '=IFERROR(K6/K7,"")', '0.00'),
    ('f', 'Wartość dodana korekty (FVA)', '=IFERROR(1-K8,"")', '0.0%;−0.0%'),
    ('ile', 'Okresy z korektą', f'=SUMPRODUCT(({Z("E")}<>"")*({Z("H")}<>0))', '0'),
    ('wg_p', 'Korekty w górę: średni błąd przed', f'=IFERROR(AVERAGEIF({Z("H")},">0",{Z("F")}),"brak")', LICZBA1),
    ('wg_k', 'Korekty w górę: średni błąd po', f'=IFERROR(AVERAGEIF({Z("H")},">0",{Z("E")}),"brak")', LICZBA1),
    ('wd_p', 'Korekty w dół: średni błąd przed', f'=IFERROR(AVERAGEIF({Z("H")},"<0",{Z("F")}),"brak")', LICZBA1),
    ('wd_k', 'Korekty w dół: średni błąd po', f'=IFERROR(AVERAGEIF({Z("H")},"<0",{Z("E")}),"brak")', LICZBA1),
])
assert adr_k['r'] == 'K8' and adr_k['n'] == 'K5'
werdykt(wk, 'J', dalej + 1, (
    f'=IF(K5<8,"Za mało okresów: porównaj co najmniej 8–12.",'
    f'IF(K8<{1 - REMIS},"Korekty zmniejszają błąd.",'
    f'IF(K8<={1 + REMIS},"Remis: korekty nie zmieniają błędu, a zajmują czas planisty.",'
    f'"Korekty zwiększają błąd. Porównaj korekty w górę i w dół: które psują prognozę?")))'
))
for kol, sz in zip('ABCDEFGH', [8, 10, 13, 12, 11, 11, 13, 12]):
    wk.column_dimensions[kol].width = sz
wk.column_dimensions['I'].width = 3
wk.freeze_panes = 'A5'

# Arkusz 4: wiele indeksów
wm = wb.create_sheet('Wiele indeksów')
tytul(wm, 'Wiele indeksów: wynik dla każdego', 'Dane posortowane według indeksu, a w nim według okresu. Pierwsze 4 okresy indeksu służą tylko darmowym prognozom.')
naglowek(wm, 4, ['Indeks', 'Okres', 'Sprzedaż (sztuki)', 'Twoja prognoza', 'Prognoza naiwna', 'Średnia z 4 okresów',
                 'Błąd Twojej', 'Błąd naiwnej', 'Błąd średniej'])
for i in range(OSTATNI_M - 4):
    r = 5 + i
    if i < len(wiele):
        ind, okres, sp, pr = wiele[i]
        wm.cell(row=r, column=1, value=ind)
        wm.cell(row=r, column=2, value=okres)
        wm.cell(row=r, column=3, value=sp)
        wm.cell(row=r, column=4, value=pr)
    wm.cell(row=r, column=5, value='=""' if r == 5 else f'=IF(AND(A{r}<>"",A{r}=A{r - 1},ISNUMBER(C{r - 1})),C{r - 1},"")')
    wm.cell(row=r, column=6, value='=""' if r < 9 else
            f'=IF(AND(A{r}<>"",COUNTIF(A{r - 4}:A{r - 1},A{r})=4,COUNT(C{r - 4}:C{r - 1})=4),AVERAGE(C{r - 4}:C{r - 1}),"")')
    wm.cell(row=r, column=7, value=f'=IF(AND(ISNUMBER(C{r}),ISNUMBER(D{r}),ISNUMBER(E{r}),ISNUMBER(F{r})),ABS(D{r}-C{r}),"")')
    wm.cell(row=r, column=8, value=f'=IF(ISNUMBER(G{r}),ABS(E{r}-C{r}),"")')
    wm.cell(row=r, column=9, value=f'=IF(ISNUMBER(G{r}),ABS(F{r}-C{r}),"")')
    wiersz_danych(wm, r, 9, 5)
    wm.cell(row=r, column=6).number_format = LICZBA1
    wm.cell(row=r, column=9).number_format = LICZBA1
naglowki_p = ['Indeks (wpisz kod)', 'Porównane okresy', 'Twój błąd ÷ błąd naiwnej', 'Twój błąd ÷ błąd średniej', 'Werdykt']
for k, tekst in enumerate(naglowki_p, start=11):
    c = wm.cell(row=4, column=k, value=tekst)
    c.font = Font(name=FONT, bold=True, color='FFFFFF', size=10)
    c.fill = TLO_NAGLOWKA
    c.alignment = Alignment(wrap_text=True, vertical='center')
    c.border = RAMKA
ZM = lambda k: f'{k}$5:{k}${OSTATNI_M}'
for i in range(50):
    r = 5 + i
    if i < 3:
        wm.cell(row=r, column=11, value=['IND-001', 'IND-002', 'IND-003'][i])
    wm.cell(row=r, column=12, value=f'=IF(K{r}="","",COUNTIFS({ZM("A")},K{r},{ZM("G")},">=0"))')
    wm.cell(row=r, column=13, value=f'=IF(OR(K{r}="",L{r}=0),"",IFERROR(SUMIF({ZM("A")},K{r},{ZM("G")})/SUMIF({ZM("A")},K{r},{ZM("H")}),""))')
    wm.cell(row=r, column=14, value=f'=IF(OR(K{r}="",L{r}=0),"",IFERROR(SUMIF({ZM("A")},K{r},{ZM("G")})/SUMIF({ZM("A")},K{r},{ZM("I")}),""))')
    wm.cell(row=r, column=15, value=(
        f'=IF(K{r}="","",IF(L{r}<8,"za mało okresów",IF(M{r}>{1 + REMIS},"gorsza od naiwnej",'
        f'IF(N{r}>{1 + REMIS},"gorsza od średniej",IF(N{r}<{1 - REMIS},"lepsza od obu","remis ze średnią")))))'
    ))
    for k, fmt in zip(range(11, 16), ['@', '0', '0.00', '0.00', '@']):
        c = wm.cell(row=r, column=k)
        c.border = RAMKA
        c.font = Font(name=FONT, size=10, bold=k in (13, 14))
        c.number_format = fmt
        if k >= 12:
            c.fill = TLO_FORMULY
r = 57
wm[f'K{r}'] = 'Wszystkie indeksy razem'
wm[f'K{r}'].font = Font(name=FONT, bold=True, size=11, color=ATRAMENT)
komorka(wm, f'K{r + 1}', 'Twój błąd ÷ błąd naiwnej (suma błędów)')
komorka(wm, f'M{r + 1}', f'=IFERROR(SUM(G5:G{OSTATNI_M})/SUM(H5:H{OSTATNI_M}),"")', '0.00', formula=True)
komorka(wm, f'K{r + 2}', 'Twój błąd ÷ błąd średniej (suma błędów)')
komorka(wm, f'M{r + 2}', f'=IFERROR(SUM(G5:G{OSTATNI_M})/SUM(I5:I{OSTATNI_M}),"")', '0.00', formula=True)
wm.merge_cells(f'K{r + 1}:L{r + 1}')
wm.merge_cells(f'K{r + 2}:L{r + 2}')
wm[f'K{r + 3}'] = 'Suma błędów waży indeksy według wielkości sprzedaży: szybko rotujące indeksy przeważają.'
wm[f'K{r + 3}'].font = Font(name=FONT, italic=True, size=9, color=DRUGI)
for kol, sz in zip('ABCDEFGHIJKLMNO', [10, 7, 10, 10, 10, 10, 9, 9, 9, 3, 16, 10, 12, 12, 18]):
    wm.column_dimensions[kol].width = sz
wm.freeze_panes = 'A5'

# Czerwony wynik, gdy prognoza myli się bardziej od darmowej.
czerwony = Font(name=FONT, bold=True, color='B42318')
for arkusz, zakres, pierwsza in [(ws, 'L9:L10', 'L9'), (wk, 'K8', 'K8'), (wm, 'M5:N54', 'M5')]:
    arkusz.conditional_formatting.add(zakres, FormulaRule(formula=[f'AND(ISNUMBER({pierwsza}),{pierwsza}>{1 + REMIS})'], font=czerwony))

# Kolumny wejścia: liczby nieujemne (ostrzeżenie, nie blokada).
for arkusz, zakres in [(ws, f'B5:C{OSTATNI}'), (wk, f'B5:D{OSTATNI}'), (wm, f'C5:D{OSTATNI_M}')]:
    dv = DataValidation(type='decimal', operator='greaterThanOrEqual', formula1='0', allow_blank=True,
                        showErrorMessage=True, errorStyle='warning', errorTitle='Sprawdź wartość',
                        error='Wpisz liczbę sztuk (0 albo więcej).')
    arkusz.add_data_validation(dv)
    dv.add(zakres)

# Wydruk: poziomo, do szerokości strony.
for arkusz in (ins, ws, wk, wm):
    arkusz.page_setup.orientation = 'landscape'
    arkusz.page_setup.paperSize = arkusz.PAPERSIZE_A4
    arkusz.page_setup.fitToWidth = 1
    arkusz.page_setup.fitToHeight = 0
    arkusz.sheet_properties.pageSetUpPr.fitToPage = True
    arkusz.page_margins.left = arkusz.page_margins.right = 0.4
ins.page_setup.fitToHeight = 1
ws.print_area = 'A1:L40'
wk.print_area = 'A1:K40'
wm.print_area = 'A1:O60'

wb.active = 1  # otwiera się na arkuszu „Jeden indeks”
wb.calculation.fullCalcOnLoad = True
wb.properties.title = 'Test prognozy'
wb.properties.creator = 'Rytm Hali'
WYNIK.parent.mkdir(parents=True, exist_ok=True)
wb.save(WYNIK)
DANE.write_text(json.dumps({
    'jeden_indeks': oczekiwane_jeden, 'korekty': oczekiwane_korekty, 'wiele': oczekiwane_wiele,
    'sprzedaz': sprzedaz, 'system': system, 'twoja': twoja,
}, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
print(f'zapisano {WYNIK.relative_to(KORZEN)}')
print(json.dumps({'jeden_indeks': oczekiwane_jeden, 'korekty': oczekiwane_korekty, 'wiele': oczekiwane_wiele}, ensure_ascii=False, indent=1))
