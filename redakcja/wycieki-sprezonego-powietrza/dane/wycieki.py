"""Wycieki sprężonego powietrza: natężenie przez otwór, moc i koszt (obliczenia redakcji).

1. Przepływ krytyczny przez otwór idealny (Cd = 1), powietrze 20 °C; wynik w powietrzu wolnym (1,013 bar, 20 °C).
   Sprawdzenie: tabela DOE (Sourcebook, 3. wyd., Fact Sheet 3, s. 28): 1/16" = 6,5 cfm, 1/8" = 26 cfm, 1/4" = 104 cfm przy 100 psi.
2. Moc sprężarki na 1 m3/min: wyprowadzona z tej samej tabeli DOE (koszt roczny / 0,10 USD/kWh / 8760 h / przepływ).
3. Cena energii: Eurostat nrg_pc_205, Polska, pasmo ID (2 000–20 000 MWh), bez VAT i podatków zwrotnych, PLN, 2026-S1.
"""
import json, math
from pathlib import Path

G, R, T = 1.4, 287.05, 293.15
RHO_WOLNE = 101325 / (R * T)          # kg/m3, powietrze wolne 1 atm, 20 °C
CFM = 0.0283168 / 60                  # m3/s
KRYT = (2 / (G + 1)) ** ((G + 1) / (2 * (G - 1)))

def przeplyw_m3min(d_mm, p_bar_g, cd=1.0):
    A = math.pi * (d_mm / 1000) ** 2 / 4
    p0 = (p_bar_g + 1.01325) * 1e5
    m = cd * A * p0 * math.sqrt(G / (R * T)) * KRYT     # kg/s
    return m / RHO_WOLNE * 60                           # m3/min powietrza wolnego

# 1. Sprawdzenie z tabelą DOE
DOE = {1/16: (6.5, 1046), 1/8: (26, 4190), 1/4: (104, 16784)}
psi100 = 100 * 0.0689476
print('Sprawdzenie z DOE (100 psi):')
moc_na_m3min = []
for cal, (cfm, usd) in DOE.items():
    q = przeplyw_m3min(cal * 25.4, psi100)
    print(f'  {cal:.4f}" model {q / (CFM * 60):6.1f} cfm, DOE {cfm} cfm')
    kw = usd / 0.10 / 8760
    moc_na_m3min.append(kw / (cfm * CFM * 60))
MOC = sum(moc_na_m3min) / len(moc_na_m3min)
print(f'Moc z tabeli DOE: {MOC:.2f} kW na 1 m3/min (pojedynczo: {", ".join(f"{x:.2f}" for x in moc_na_m3min)})')

# 3. Cena z Eurostatu
e = json.load(open(Path(__file__).parents[3] / '.cache/redakcja/wycieki-sprezonego-powietrza/nrg_pc_205_PL.json'))
dims = e['id']; size = e['size']
def idx(**kw):
    i = 0
    for d, s in zip(dims, size):
        i = i * s + e['dimension'][d]['category']['index'][kw[d]]
    return i
cena = {}
for okres in ['2025-S1', '2025-S2', '2026-S1']:
    for pasmo in ['MWH500-1999', 'MWH2000-19999']:
        k = dict(freq='S', siec='E7000', nrg_cons=pasmo, unit='KWH', tax='X_VAT', currency='NAC', geo='PL', time=okres)
        cena[(okres, pasmo)] = e['value'].get(str(idx(**k)))
print('Ceny PLN/kWh (bez VAT):', cena)
CENA = cena[('2026-S1', 'MWH2000-19999')]

# 2. Tabela dla polskich warunków
wyniki = {'moc_kw_na_m3min': round(MOC, 2), 'cena_pln_kwh': CENA, 'tabela': []}
print(f'\nCena {CENA} PLN/kWh; godziny: 8760 (ciągła praca) i 4000 (dwie zmiany)')
for d in [1, 2, 3, 4]:
    for p in [6, 7]:
        q = przeplyw_m3min(d, p)
        kw = q * MOC
        w = {'d_mm': d, 'p_bar': p, 'l_min': round(q * 1000), 'kw': round(kw, 2),
             'pln_8760': round(kw * 8760 * CENA, -2), 'pln_4000': round(kw * 4000 * CENA, -2)}
        wyniki['tabela'].append(w)
        print(w)

# Przykład na danych fikcyjnych: test załadunku i koszt wycieków
T_on, t_off = 0.5, 2.0  # minuty pracy pod obciążeniem / bez obciążenia, przy wyłączonych odbiorach
udzial = T_on * 100 / (T_on + t_off)
moc_sprezarek, godziny = 75, 4000
koszt = udzial / 100 * moc_sprezarek * godziny * CENA
koszt_10 = 0.10 * moc_sprezarek * godziny * CENA
wyniki['przyklad'] = {'udzial_proc': udzial, 'koszt_pln': round(koszt, -2), 'koszt_przy_10proc': round(koszt_10, -2), 'oszczednosc': round(koszt - koszt_10, -2)}
print('\nPrzykład:', wyniki['przyklad'])
Path(__file__).with_name('wyniki.json').write_text(json.dumps(wyniki, ensure_ascii=False, indent=1) + '\n')

# Metoda spadku ciśnienia (DOE, s. 28–29), przeliczona na jednostki SI przez redakcję:
# wyciek [m3/min powietrza wolnego] = V [m3] × (p1 − p2) [bar] / (1,013 × T [min]) × 1,25
V, p1, p2, Tmin = 3.0, 6.0, 3.0, 5.0
wyciek = V * (p1 - p2) / (1.013 * Tmin) * 1.25
wydajnosc = 75 / MOC  # m3/min, które dają sprężarki 75 kW przy mocy z tabeli DOE
wyniki['spadek_cisnienia'] = {'V_m3': V, 'p1': p1, 'p2': p2, 'T_min': Tmin, 'wyciek_m3min': round(wyciek, 2),
                              'wydajnosc_75kW_m3min': round(wydajnosc, 1), 'udzial_proc': round(wyciek / wydajnosc * 100, 1)}
# Ciśnienie: 2 psi ≈ 1% energii (DOE); 1 bar = 14,504 psi
wyniki['bar_na_proc_energii'] = round(14.504 / 2, 1)
wyniki['wzrost_wycieku_6_7_bar_proc'] = round((przeplyw_m3min(2, 7) / przeplyw_m3min(2, 6) - 1) * 100, 1)
print('Spadek ciśnienia:', wyniki['spadek_cisnienia'], '| 1 bar ≈', wyniki['bar_na_proc_energii'], '% energii | wyciek 6→7 bar +', wyniki['wzrost_wycieku_6_7_bar_proc'], '%')
Path(__file__).with_name('wyniki.json').write_text(json.dumps(wyniki, ensure_ascii=False, indent=1) + '\n')
