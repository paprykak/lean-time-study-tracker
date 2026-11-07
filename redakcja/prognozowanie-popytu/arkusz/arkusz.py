# Arkusz „Test prognozy” (materiał do pobrania do artykułu „prognozowanie-popytu”).
# Twoja prognoza porównana z trzema darmowymi: naiwną (ostatnia znana sprzedaż), średnią z 4 okresów i wygładzaniem
# wykładniczym prostym. Darmowe prognozy znają tylko sprzedaż sprzed wyprzedzenia, z jakim robisz swoją prognozę.
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
TLO_PARAMETRU = PatternFill('solid', fgColor='FFF4E5')
LICZBA = '#,##0;−#,##0'
LICZBA1 = '#,##0.0;−#,##0.0'
OSTATNI = 204        # ostatni wiersz danych w arkuszach jednego indeksu (200 okresów)
OSTATNI_M = 2004     # ostatni wiersz danych w arkuszu wielu indeksów
REMIS = 0.05         # umowny próg remisu redakcji: ±5%
H_DOMYSLNE = 1       # wyprzedzenie prognozy w okresach
ALFA = 0.2           # waga ostatniego okresu w wygładzaniu wykładniczym prostym


def naglowek(ws, wiersz, kolumny, od=1):
    for k, tekst in enumerate(kolumny, start=od):
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


def parametr(ws, wiersz, kol, opis, wartosc, fmt):
    L, W = kol, chr(ord(kol) + 1)
    komorka(ws, f'{L}{wiersz}', opis, gruba=True)
    c = ws[f'{W}{wiersz}']
    c.value = wartosc
    c.number_format = fmt
    c.border = RAMKA
    c.fill = TLO_PARAMETRU
    c.font = Font(name=FONT, size=11, bold=True, color=ATRAMENT)
    c.alignment = Alignment(horizontal='right', vertical='center')
    return f'${W}${wiersz}'


def wiersz_danych(ws, r, ostatnia_kolumna, od_formul):
    for k in range(1, ostatnia_kolumna + 1):
        c = ws.cell(row=r, column=k)
        c.border = RAMKA
        c.font = Font(name=FONT, size=10)
        if k >= od_formul:
            c.fill = TLO_FORMULY
            c.number_format = LICZBA


def blok_wynikow(ws, kol, pozycje, wiersz0):
    """pozycje: (klucz, opis, formuła, format). Zwraca słownik klucz → adres komórki z wynikiem."""
    L, W = kol, chr(ord(kol) + 1)
    ws[f'{L}{wiersz0 - 1}'] = 'Wynik'
    ws[f'{L}{wiersz0 - 1}'].font = Font(name=FONT, bold=True, size=13, color=ATRAMENT)
    adresy = {}
    for i, (klucz, opis, formula, fmt) in enumerate(pozycje):
        r = wiersz0 + i
        komorka(ws, f'{L}{r}', opis)
        komorka(ws, f'{W}{r}', formula(adresy) if callable(formula) else formula, fmt, formula=True)
        adresy[klucz] = f'{W}{r}'
    ws.column_dimensions[L].width = 60
    ws.column_dimensions[W].width = 13
    return adresy, wiersz0 + len(pozycje)


def werdykt(ws, kol, wiersz, formula, uwaga):
    L, W = kol, chr(ord(kol) + 1)
    ws[f'{L}{wiersz}'] = 'Werdykt'
    ws[f'{L}{wiersz}'].font = Font(name=FONT, bold=True, size=11, color=ATRAMENT)
    ws[f'{L}{wiersz + 1}'] = formula
    ws.merge_cells(f'{L}{wiersz + 1}:{W}{wiersz + 3}')
    c = ws[f'{L}{wiersz + 1}']
    c.font = Font(name=FONT, bold=True, size=11, color=AKCENT)
    c.alignment = Alignment(wrap_text=True, vertical='top')
    ws[f'{L}{wiersz + 4}'] = uwaga
    ws.merge_cells(f'{L}{wiersz + 4}:{W}{wiersz + 6}')
    ws[f'{L}{wiersz + 4}'].font = Font(name=FONT, italic=True, size=9, color=DRUGI)
    ws[f'{L}{wiersz + 4}'].alignment = Alignment(wrap_text=True, vertical='top')
    return f'{L}{wiersz + 1}'


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
        prognoza = None if t < 4 else round(sum(s[t - 2:t]) / 2 * (1.12 if t % 4 == 0 else 1.0))
        wiele.append((indeks, f'T{t + 1:02d}', s[t], prognoza))


# ---------- Oczekiwane wyniki liczone w Pythonie (test.py porównuje je z formułami po przeliczeniu w LibreOffice) ----------
def poziomy(szereg, alfa=ALFA):
    wynik, poprzedni = [], None
    for y in szereg:
        poprzedni = y if poprzedni is None else alfa * y + (1 - alfa) * poprzedni
        wynik.append(poprzedni)
    return wynik


def darmowe(szereg, i, h=H_DOMYSLNE):
    """Prognozy na okres i (od zera) znające sprzedaż do okresu i−h: naiwna, średnia z 4, wygładzanie."""
    if i - h - 3 < 0:
        return None
    return szereg[i - h], sum(szereg[i - h - 3:i - h + 1]) / 4, poziomy(szereg)[i - h]


def mae(pary):
    return sum(abs(a - b) for a, b in pary) / len(pary)


idx = [i for i in range(TYGODNIE) if twoja[i] is not None and darmowe(sprzedaz, i)]
oczekiwane_jeden = {
    'okresy': len(idx),
    'mae_twoja': mae([(twoja[i], sprzedaz[i]) for i in idx]),
    'mae_naiwna': mae([(darmowe(sprzedaz, i)[0], sprzedaz[i]) for i in idx]),
    'mae_srednia': mae([(darmowe(sprzedaz, i)[1], sprzedaz[i]) for i in idx]),
    'mae_wygladzanie': mae([(darmowe(sprzedaz, i)[2], sprzedaz[i]) for i in idx]),
}
o = oczekiwane_jeden
o['twoja_do_naiwnej'] = o['mae_twoja'] / o['mae_naiwna']
o['twoja_do_najlepszej_prostej'] = o['mae_twoja'] / min(o['mae_srednia'], o['mae_wygladzanie'])
o['odchylenie'] = sum(twoja[i] - sprzedaz[i] for i in idx) / sum(sprzedaz[i] for i in idx)
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
    sz = [x[2] for x in w]
    t_idx = [t for t in range(16) if w[t][3] is not None and darmowe(sz, t)]
    bt = sum(abs(w[t][3] - sz[t]) for t in t_idx)
    bn = sum(abs(darmowe(sz, t)[0] - sz[t]) for t in t_idx)
    bs = sum(abs(darmowe(sz, t)[1] - sz[t]) for t in t_idx)
    bw = sum(abs(darmowe(sz, t)[2] - sz[t]) for t in t_idx)
    oczekiwane_wiele[indeks] = {'okresy': len(t_idx), 'twoja_do_naiwnej': bt / bn, 'twoja_do_najlepszej_prostej': bt / min(bs, bw)}

# ---------- Skoroszyt ----------
wb = Workbook()

# Arkusz 1: instrukcja
ins = wb.active
ins.title = 'Jak używać'
tytul(ins, 'Test prognozy: czy pobijasz prognozy, które nic nie kosztują?', 'Rytm Hali · rytmhali.pl/do-pobrania/test-prognozy · wersja 1, listopad 2026')
INSTRUKCJA = [
    ('h', 'Po co ten arkusz'),
    ('p', 'Trzy prognozy nic nie kosztują: naiwna (ostatnia znana sprzedaż), średnia z czterech okresów i wygładzanie wykładnicze proste. '
          'Prognoza, za którą płacisz czasem planisty albo licencją systemu, powinna mylić się mniej niż one. Arkusz to sprawdza.'),
    ('h', 'Jak go wypełnić'),
    ('p', '1. Wpisz wyprzedzenie: o ile okresów naprzód robisz prognozę, z którą zamawiasz albo planujesz produkcję (np. 6, jeśli prognozę na tydzień 20 '
          'robisz po zamknięciu tygodnia 14). Darmowe prognozy znają wtedy tylko sprzedaż, którą Ty znałeś w chwili prognozy.'),
    ('p', '2. „Wiele indeksów”: wklej indeks, okres, sprzedaż i prognozę dla około 20 indeksów, posortowane według indeksu i okresu, najlepiej 26–52 tygodnie. '
          'Indeksy wylosuj z listy sprzedaży z roku przed testem, po kilka z grup A, B i C, i nie pomijaj wycofanych.'),
    ('p', '3. „Jeden indeks”: ten sam test dla jednego indeksu, z wykresem w kolumnach. Wynik dla jednego indeksu to wskazówka, a nie dowód.'),
    ('p', '4. „Korekty”: jeśli system liczy prognozę, a planista ją poprawia, wklej obie. Arkusz pokaże, czy korekty zmniejszają błąd, osobno w górę i w dół.'),
    ('p', 'Białe kolumny wypełniasz Ty, szare liczą się same, a pomarańczowe pola to ustawienia. Dane przykładowe są fikcyjne: nadpisz je swoimi.'),
    ('h', 'Jak czytać wynik'),
    ('p', '„Twój błąd ÷ błąd naiwnej” poniżej 1 znaczy, że Twoja prognoza myli się mniej niż naiwna. To minimum. Właściwy sprawdzian to '
          '„Twój błąd ÷ błąd najlepszej prostej metody”: średniej z czterech okresów albo wygładzania wykładniczego, zależnie od tego, która myli się mniej.'),
    ('p', 'Wartość dodana prognozy (FVA, forecast value added) to ten sam wynik w procentach: o ile Twoja prognoza zmniejsza błąd darmowej. Wynik ujemny oznacza, że go zwiększa.'),
    ('p', 'Odchylenie pokazuje, czy prognoza średnio zawyża (wynik dodatni) albo zaniża (ujemny) sprzedaż.'),
    ('h', 'Na co uważać'),
    ('p', '• Jeden indeks niczego nie rozstrzyga: w symulacji redakcji dwie równie dobre prognozy porównane na 26 tygodniach różniły się przez sam przypadek '
          'o 20–30%. Wniosek wyciągaj z wyniku dla wszystkich indeksów razem i z liczby indeksów, w których Twoja prognoza wygrywa.'),
    ('p', '• Wygładzanie w tym arkuszu to wersja prosta: nie uwzględnia trendu ani sezonowości. Przy nich użyj też Arkusza prognozy w Excelu (karta Dane) '
          'i porównaj się z sezonową prognozą naiwną: sprzedażą z tego samego tygodnia rok wcześniej (wymaga roku historii przed testem).'),
    ('p', '• Indeksy, które w wielu okresach nie sprzedają się wcale, oceniaj osobno, po zapasie i poziomie obsługi. Przy nich najmniejszy błąd w sztukach może dać prognoza „zero”.'),
    ('p', '• Popyt to nie zawsze sprzedaż: gdy towaru zabrakło, sprzedaż jest niższa od popytu. Takie okresy oznacz albo pomiń.'),
    ('p', '• Jeśli system nadpisuje dawne prognozy, zacznij co tydzień zapisywać ich kopię. Po kwartale zrobisz pierwszy test, a po pół roku pełny.'),
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

UWAGA_JEDEN = (f'Remis to różnica do ±{int(REMIS * 100)}% (umowna granica redakcji). Na jednym indeksie przypadek bywa większy: '
               'wniosek wyciągaj z arkusza „Wiele indeksów”.')

# Arkusz 2: wiele indeksów (najważniejszy)
wm = wb.create_sheet('Wiele indeksów')
tytul(wm, 'Wiele indeksów: czy Twoja prognoza bije darmowe?', 'Dane posortowane według indeksu, a w nim według okresu. Pierwsze okresy indeksu służą tylko darmowym prognozom. Dane przykładowe są fikcyjne.')
H_M = parametr(wm, 1, 'P', 'Wyprzedzenie prognozy (okresy)', H_DOMYSLNE, '0')
A_M = parametr(wm, 2, 'P', 'Waga ostatniego okresu w wygładzaniu (α, 0,1–0,3)', ALFA, '0.00')
naglowek(wm, 4, ['Indeks', 'Okres', 'Sprzedaż (sztuki)', 'Twoja prognoza', 'Prognoza naiwna', 'Średnia z 4 okresów', 'Wygładzanie wykładnicze',
                 'Błąd Twojej', 'Błąd naiwnej', 'Błąd średniej', 'Błąd wygładzania', 'Nr okresu (pomoc.)', 'Poziom wygładzony (pomoc.)'])
C = f'$C$5:$C${OSTATNI_M}'
M_ = f'$M$5:$M${OSTATNI_M}'
for i in range(OSTATNI_M - 4):
    r = 5 + i
    if i < len(wiele):
        ind, okres, sp, pr = wiele[i]
        wm.cell(row=r, column=1, value=ind)
        wm.cell(row=r, column=2, value=okres)
        wm.cell(row=r, column=3, value=sp)
        wm.cell(row=r, column=4, value=pr)
    k = f'(ROW()-4-{H_M})'
    wm.cell(row=r, column=12, value=f'=IF(A{r}="","",1)' if r == 5 else f'=IF(A{r}="","",IF(A{r}=A{r - 1},L{r - 1}+1,1))')
    wm.cell(row=r, column=13, value=(f'=IF(A{r}="","",IF(ISNUMBER(C{r}),C{r},""))' if r == 5 else
            f'=IF(A{r}="","",IF(L{r}=1,IF(ISNUMBER(C{r}),C{r},""),IF(ISNUMBER(C{r}),IF(ISNUMBER(M{r - 1}),{A_M}*C{r}+(1-{A_M})*M{r - 1},C{r}),M{r - 1})))'))
    wm.cell(row=r, column=5, value=f'=IF(A{r}="","",IF(L{r}-{H_M}<1,"",IF(ISNUMBER(INDEX({C},{k})),INDEX({C},{k}),"")))')
    wm.cell(row=r, column=6, value=(f'=IF(A{r}="","",IF(L{r}-{H_M}-3<1,"",IF(COUNT(INDEX({C},{k}-3):INDEX({C},{k}))=4,'
                                    f'AVERAGE(INDEX({C},{k}-3):INDEX({C},{k})),"")))'))
    wm.cell(row=r, column=7, value=f'=IF(A{r}="","",IF(L{r}-{H_M}<1,"",IF(ISNUMBER(INDEX({M_},{k})),INDEX({M_},{k}),"")))')
    wm.cell(row=r, column=8, value=f'=IF(AND(ISNUMBER(C{r}),ISNUMBER(D{r}),ISNUMBER(E{r}),ISNUMBER(F{r}),ISNUMBER(G{r})),ABS(D{r}-C{r}),"")')
    wm.cell(row=r, column=9, value=f'=IF(ISNUMBER(H{r}),ABS(E{r}-C{r}),"")')
    wm.cell(row=r, column=10, value=f'=IF(ISNUMBER(H{r}),ABS(F{r}-C{r}),"")')
    wm.cell(row=r, column=11, value=f'=IF(ISNUMBER(H{r}),ABS(G{r}-C{r}),"")')
    wiersz_danych(wm, r, 13, 5)
    for kol in (6, 7, 10, 11, 13):
        wm.cell(row=r, column=kol).number_format = LICZBA1
naglowek(wm, 4, ['Indeks (wpisz kod)', 'Porównane okresy', 'Twój błąd ÷ błąd naiwnej', 'Twój błąd ÷ najlepsza prosta', 'Werdykt'], od=16)
ZM = lambda kol: f'${kol}$5:${kol}${OSTATNI_M}'
for i in range(50):
    r = 5 + i
    if i < 3:
        wm.cell(row=r, column=16, value=['IND-001', 'IND-002', 'IND-003'][i])
    wm.cell(row=r, column=17, value=f'=IF(P{r}="","",COUNTIFS({ZM("A")},P{r},{ZM("H")},">=0"))')
    wm.cell(row=r, column=18, value=f'=IF(OR(P{r}="",Q{r}=0),"",IFERROR(SUMIF({ZM("A")},P{r},{ZM("H")})/SUMIF({ZM("A")},P{r},{ZM("I")}),""))')
    wm.cell(row=r, column=19, value=(f'=IF(OR(P{r}="",Q{r}=0),"",IFERROR(SUMIF({ZM("A")},P{r},{ZM("H")})/'
                                     f'MIN(SUMIF({ZM("A")},P{r},{ZM("J")}),SUMIF({ZM("A")},P{r},{ZM("K")})),""))'))
    wm.cell(row=r, column=20, value=(
        f'=IF(P{r}="","",IF(Q{r}<8,"za mało okresów",IF(R{r}>{1 + REMIS},"gorsza od naiwnej",IF(S{r}>{1 + REMIS},"prosta metoda lepsza",'
        f'IF(AND(R{r}<{1 - REMIS},S{r}<{1 - REMIS}),"bije wszystkie trzy","remis")))))'
    ))
    for k, fmt in zip(range(16, 21), ['@', '0', '0.00', '0.00', '@']):
        c = wm.cell(row=r, column=k)
        c.border = RAMKA
        c.font = Font(name=FONT, size=10, bold=k in (18, 19))
        c.number_format = fmt
        if k >= 17:
            c.fill = TLO_FORMULY
r = 57
wm[f'P{r}'] = 'Wszystkie indeksy razem'
wm[f'P{r}'].font = Font(name=FONT, bold=True, size=11, color=ATRAMENT)
komorka(wm, f'P{r + 1}', 'Twój błąd ÷ błąd naiwnej (suma błędów)')
komorka(wm, f'R{r + 1}', f'=IFERROR(SUM(H5:H{OSTATNI_M})/SUM(I5:I{OSTATNI_M}),"")', '0.00', formula=True)
komorka(wm, f'P{r + 2}', 'Twój błąd ÷ błąd najlepszej prostej metody (suma błędów)')
komorka(wm, f'R{r + 2}', f'=IFERROR(SUM(H5:H{OSTATNI_M})/MIN(SUM(J5:J{OSTATNI_M}),SUM(K5:K{OSTATNI_M})),"")', '0.00', formula=True)
komorka(wm, f'P{r + 3}', 'Indeksy, w których Twoja prognoza bije najlepszą prostą metodę')
komorka(wm, f'R{r + 3}', '=COUNTIF(S5:S54,"<"&(1-0.05))&" z "&COUNT(S5:S54)', '@', formula=True)
for rr in (r + 1, r + 2, r + 3):
    wm.merge_cells(f'P{rr}:Q{rr}')
wm[f'P{r + 4}'] = 'Suma błędów waży indeksy według wielkości sprzedaży: szybko rotujące indeksy przeważają.'
wm[f'P{r + 4}'].font = Font(name=FONT, italic=True, size=9, color=DRUGI)
for kol, sz in zip('ABCDEFGHIJKLMNOPQRST', [10, 7, 10, 10, 10, 10, 11, 9, 9, 9, 10, 9, 11, 3, 3, 30, 11, 12, 12, 18]):
    wm.column_dimensions[kol].width = sz
wm.column_dimensions['P'].width = 44
wm.freeze_panes = 'A5'

# Arkusz 3: jeden indeks
ws = wb.create_sheet('Jeden indeks')
tytul(ws, 'Jeden indeks: Twoja prognoza kontra trzy darmowe', 'Białe kolumny wypełniasz Ty, szare liczą się same, pomarańczowe pola to ustawienia. Dane przykładowe są fikcyjne.')
H_J = parametr(ws, 1, 'N', 'Wyprzedzenie prognozy (okresy)', H_DOMYSLNE, '0')
A_J = parametr(ws, 2, 'N', 'Waga ostatniego okresu w wygładzaniu (α, 0,1–0,3)', ALFA, '0.00')
naglowek(ws, 4, ['Okres', 'Sprzedaż (sztuki)', 'Twoja prognoza na ten okres', 'Prognoza naiwna', 'Średnia z 4 okresów', 'Wygładzanie wykładnicze',
                 'Błąd Twojej', 'Błąd naiwnej', 'Błąd średniej', 'Błąd wygładzania', 'Odchylenie Twojej (prognoza − sprzedaż)', 'Poziom wygładzony (pomoc.)'])
B = f'$B$5:$B${OSTATNI}'
LJ = f'$L$5:$L${OSTATNI}'
for i in range(OSTATNI - 4):
    r = 5 + i
    if i < TYGODNIE:
        ws.cell(row=r, column=1, value=f'T{i + 1:02d}')
        ws.cell(row=r, column=2, value=sprzedaz[i])
        ws.cell(row=r, column=3, value=twoja[i])
    k = f'(ROW()-4-{H_J})'
    ws.cell(row=r, column=12, value=(f'=IF(ISNUMBER(B{r}),B{r},"")' if r == 5 else
            f'=IF(ISNUMBER(B{r}),IF(ISNUMBER(L{r - 1}),{A_J}*B{r}+(1-{A_J})*L{r - 1},B{r}),IF(ISNUMBER(L{r - 1}),L{r - 1},""))'))
    ws.cell(row=r, column=4, value=f'=IF(OR(A{r}="",{k}<1),"",IF(ISNUMBER(INDEX({B},{k})),INDEX({B},{k}),""))')
    ws.cell(row=r, column=5, value=(f'=IF(OR(A{r}="",{k}-3<1),"",IF(COUNT(INDEX({B},{k}-3):INDEX({B},{k}))=4,'
                                    f'AVERAGE(INDEX({B},{k}-3):INDEX({B},{k})),""))'))
    ws.cell(row=r, column=6, value=f'=IF(OR(A{r}="",{k}<1),"",IF(ISNUMBER(INDEX({LJ},{k})),INDEX({LJ},{k}),""))')
    ws.cell(row=r, column=7, value=f'=IF(AND(ISNUMBER(B{r}),ISNUMBER(C{r}),ISNUMBER(D{r}),ISNUMBER(E{r}),ISNUMBER(F{r})),ABS(C{r}-B{r}),"")')
    ws.cell(row=r, column=8, value=f'=IF(ISNUMBER(G{r}),ABS(D{r}-B{r}),"")')
    ws.cell(row=r, column=9, value=f'=IF(ISNUMBER(G{r}),ABS(E{r}-B{r}),"")')
    ws.cell(row=r, column=10, value=f'=IF(ISNUMBER(G{r}),ABS(F{r}-B{r}),"")')
    ws.cell(row=r, column=11, value=f'=IF(ISNUMBER(G{r}),C{r}-B{r},"")')
    wiersz_danych(ws, r, 12, 4)
    for kol in (5, 6, 9, 10, 12):
        ws.cell(row=r, column=kol).number_format = LICZBA1
Z = lambda kol: f'{kol}5:{kol}{OSTATNI}'
adr, dalej = blok_wynikow(ws, 'N', [
    ('n', 'Porównane okresy', f'=COUNT({Z("G")})', '0'),
    ('mt', 'Średni błąd Twojej prognozy (sztuki)', f'=IFERROR(AVERAGE({Z("G")}),"")', LICZBA1),
    ('mn', 'Średni błąd prognozy naiwnej (sztuki)', f'=IFERROR(AVERAGE({Z("H")}),"")', LICZBA1),
    ('ms', 'Średni błąd średniej z 4 okresów (sztuki)', f'=IFERROR(AVERAGE({Z("I")}),"")', LICZBA1),
    ('mw', 'Średni błąd wygładzania wykładniczego (sztuki)', f'=IFERROR(AVERAGE({Z("J")}),"")', LICZBA1),
    ('rn', 'Twój błąd ÷ błąd naiwnej', lambda a: f'=IFERROR({a["mt"]}/{a["mn"]},"")', '0.00'),
    ('rp', 'Twój błąd ÷ błąd najlepszej prostej metody', lambda a: f'=IFERROR({a["mt"]}/MIN({a["ms"]},{a["mw"]}),"")', '0.00'),
    ('fp', 'Wartość dodana względem najlepszej prostej (FVA)', lambda a: f'=IFERROR(1-{a["rp"]},"")', '0.0%;−0.0%'),
    ('od', 'Odchylenie (+ zawyża, − zaniża), % sprzedaży', f'=IFERROR(SUM({Z("K")})/SUMPRODUCT(({Z("G")}<>"")*{Z("B")}),"")', '0.0%;−0.0%'),
], wiersz0=5)
wer_j = werdykt(ws, 'N', dalej + 1, (
    f'=IF({adr["n"]}<8,"Za mało okresów: porównaj co najmniej 8–12.",'
    f'IF({adr["rn"]}>{1 + REMIS},"Twoja prognoza myli się bardziej niż naiwna. Sprawdź korekty i odchylenie.",'
    f'IF({adr["rp"]}>{1 + REMIS},"Prosta metoda (średnia albo wygładzanie) myliłaby się mniej niż Twoja prognoza.",'
    f'IF(AND({adr["rn"]}<{1 - REMIS},{adr["rp"]}<{1 - REMIS}),"Twoja prognoza bije wszystkie trzy darmowe prognozy.",'
    f'"Remis: Twoja prognoza nie jest wyraźnie lepsza od prostych metod."))))'
), UWAGA_JEDEN)
for kol, sz in zip('ABCDEFGHIJKL', [8, 10, 12, 11, 11, 12, 10, 10, 10, 11, 14, 11]):
    ws.column_dimensions[kol].width = sz
ws.column_dimensions['M'].width = 3
ws.freeze_panes = 'A5'

# Arkusz 4: korekty
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
    ('r', 'Błąd po korekcie ÷ błąd przed korektą', lambda a: f'=IFERROR({a["mp"]}/{a["mq"]},"")', '0.00'),
    ('f', 'Wartość dodana korekty (FVA)', lambda a: f'=IFERROR(1-{a["r"]},"")', '0.0%;−0.0%'),
    ('ile', 'Okresy z korektą', f'=SUMPRODUCT(({Z("E")}<>"")*({Z("H")}<>0))', '0'),
    ('wg_p', 'Korekty w górę: średni błąd przed', f'=IFERROR(AVERAGEIF({Z("H")},">0",{Z("F")}),"brak")', LICZBA1),
    ('wg_k', 'Korekty w górę: średni błąd po', f'=IFERROR(AVERAGEIF({Z("H")},">0",{Z("E")}),"brak")', LICZBA1),
    ('wd_p', 'Korekty w dół: średni błąd przed', f'=IFERROR(AVERAGEIF({Z("H")},"<0",{Z("F")}),"brak")', LICZBA1),
    ('wd_k', 'Korekty w dół: średni błąd po', f'=IFERROR(AVERAGEIF({Z("H")},"<0",{Z("E")}),"brak")', LICZBA1),
], wiersz0=5)
wer_k = werdykt(wk, 'J', dalej + 1, (
    f'=IF({adr_k["n"]}<8,"Za mało okresów: porównaj co najmniej 8–12.",'
    f'IF({adr_k["r"]}<{1 - REMIS},"Korekty zmniejszają błąd.",'
    f'IF({adr_k["r"]}<={1 + REMIS},"Remis: korekty nie zmieniają błędu, a zajmują czas planisty.",'
    f'"Korekty zwiększają błąd. Porównaj korekty w górę i w dół: które psują prognozę?")))'
), f'Remis to różnica do ±{int(REMIS * 100)}% (umowna granica redakcji). Wynik dla jednego indeksu to wskazówka, nie dowód.')
for kol, sz in zip('ABCDEFGH', [8, 10, 13, 12, 11, 11, 13, 12]):
    wk.column_dimensions[kol].width = sz
wk.column_dimensions['I'].width = 3
wk.freeze_panes = 'A5'

# Czerwony wynik, gdy prognoza myli się bardziej od darmowej.
czerwony = Font(name=FONT, bold=True, color='B42318')
for arkusz, zakres, pierwsza in [(ws, f'{adr["rn"]}:{adr["rp"]}', adr['rn']), (wk, adr_k['r'], adr_k['r']), (wm, 'R5:S54', 'R5')]:
    arkusz.conditional_formatting.add(zakres, FormulaRule(formula=[f'AND(ISNUMBER({pierwsza}),{pierwsza}>{1 + REMIS})'], font=czerwony))

# Kolumny wejścia: liczby nieujemne (ostrzeżenie, nie blokada); wyprzedzenie: liczba całkowita od 1.
for arkusz, zakres in [(ws, f'B5:C{OSTATNI}'), (wk, f'B5:D{OSTATNI}'), (wm, f'C5:D{OSTATNI_M}')]:
    dv = DataValidation(type='decimal', operator='greaterThanOrEqual', formula1='0', allow_blank=True,
                        showErrorMessage=True, errorStyle='warning', errorTitle='Sprawdź wartość', error='Wpisz liczbę sztuk (0 albo więcej).')
    arkusz.add_data_validation(dv)
    dv.add(zakres)
for arkusz, h, a in [(ws, H_J, A_J), (wm, H_M, A_M)]:
    dv = DataValidation(type='whole', operator='between', formula1='1', formula2='52', showErrorMessage=True,
                        errorTitle='Wyprzedzenie', error='Wpisz liczbę okresów od 1 do 52.')
    arkusz.add_data_validation(dv)
    dv.add(h.replace('$', ''))
    dv2 = DataValidation(type='decimal', operator='between', formula1='0.05', formula2='0.95', showErrorMessage=True,
                         errorTitle='Waga', error='Wpisz wagę od 0,05 do 0,95 (zwykle 0,1–0,3).')
    arkusz.add_data_validation(dv2)
    dv2.add(a.replace('$', ''))

# Wydruk: poziomo, do szerokości strony.
for arkusz in (ins, wm, ws, wk):
    arkusz.page_setup.orientation = 'landscape'
    arkusz.page_setup.paperSize = arkusz.PAPERSIZE_A4
    arkusz.page_setup.fitToWidth = 1
    arkusz.page_setup.fitToHeight = 0
    arkusz.sheet_properties.pageSetUpPr.fitToPage = True
    arkusz.page_margins.left = arkusz.page_margins.right = 0.4
ins.page_setup.fitToHeight = 1
wm.print_area = 'A1:T60'
ws.print_area = 'A1:O40'
wk.print_area = 'A1:K40'

wb.active = 1  # otwiera się na arkuszu „Wiele indeksów”
wb.calculation.fullCalcOnLoad = True
wb.properties.title = 'Test prognozy'
wb.properties.creator = 'Rytm Hali'
WYNIK.parent.mkdir(parents=True, exist_ok=True)
wb.save(WYNIK)
DANE.write_text(json.dumps({
    'adresy': {'jeden': adr, 'jeden_werdykt': wer_j, 'korekty': adr_k, 'korekty_werdykt': wer_k},
    'jeden_indeks': oczekiwane_jeden, 'korekty': oczekiwane_korekty, 'wiele': oczekiwane_wiele,
    'sprzedaz': sprzedaz, 'system': system, 'twoja': twoja,
}, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
print(f'zapisano {WYNIK.relative_to(KORZEN)}')
print(json.dumps({'jeden_indeks': oczekiwane_jeden, 'korekty': oczekiwane_korekty, 'wiele': oczekiwane_wiele}, ensure_ascii=False, indent=1))
