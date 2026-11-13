"""Przeliczenia do teczki oee-85-procent (zrodla-agent-badania.md).

1. de Ron i Rooda (2006), tabela 1 i 2 (dane fikcyjne autorów, przykład liczbowy):
   ten sam tydzień pracy maszyny policzony dwiema definicjami OEE.
   - SEMI E79 (podstawa: czas całkowity 24/7, postój z braku zleceń = strata),
   - Nakajima (podstawa: czas załadowania = czas pracy minus czas bez zleceń/planowany postój).
   Druga wartość to nasz rachunek z danych autorów; autorzy tę samą liczbę
   podają jako swój wskaźnik E (tabela 6), nie jako „OEE Nakajimy”.
2. Andersson i Bellgran (2011), przykład linii montażowej: skrócenie idealnego czasu
   cyklu obniża OEE, choć rośnie wydajność godzinowa.
3. Iloczyn „idealnych” składowych przypisywanych Nakajimie (90% x 95% x 99%).

Uruchomienie: python3 -I przeliczenia_definicje_oee.py
"""


def oee_semi(total_h, standby_h, down_h, prod_h, n_items, n_good, t_theor_h):
    """OEE wg SEMI E79 w zapisie de Rona i Roody: AE * OE * RE * QE, podstawa = czas całkowity."""
    uptime = total_h - down_h
    ae = uptime / total_h
    oe = prod_h / uptime
    re = n_items * t_theor_h / prod_h
    qe = n_good / n_items
    return ae * oe * re * qe, (ae, oe, re, qe)


def oee_nakajima(total_h, standby_h, down_h, prod_h, n_items, n_good, t_theor_h):
    """OEE wg Nakajimy: czas załadowania bez czasu bez zleceń (standby), A * P * Q."""
    loading = total_h - standby_h
    a = (loading - down_h) / loading
    p = n_items * t_theor_h / (loading - down_h)
    q = n_good / n_items
    return a * p * q, (a, p, q)


# Tabela 1 u de Rona i Roody (s. 4 rękopisu HAL): przypadki A i B
przypadki = {
    "A": dict(total_h=168, standby_h=72, down_h=12, prod_h=84, n_items=1860, n_good=1810, t_theor_h=0.044),
    "B": dict(total_h=168, standby_h=48, down_h=15, prod_h=105, n_items=2324, n_good=2261, t_theor_h=0.044),
}

print("1. de Ron i Rooda (2006), te same dane, dwie definicje")
for nazwa, d in przypadki.items():
    s, skl_s = oee_semi(**d)
    n, skl_n = oee_nakajima(**d)
    print(f"  przypadek {nazwa}: OEE SEMI (czas całkowity) = {s:.3f}  |  OEE Nakajima (czas załadowania) = {n:.3f}")
    print(f"     składowe SEMI AE, OE, RE, QE = {[round(x, 3) for x in skl_s]}")
    print(f"     składowe Nakajima A, P, Q   = {[round(x, 3) for x in skl_n]}")

# Kontrola: autorzy podają OEE A = 0.474, B = 0.592 (tabela 2) i E = 0.829 dla obu (tabela 6)
sa, _ = oee_semi(**przypadki["A"])
sb, _ = oee_semi(**przypadki["B"])
assert abs(sa - 0.474) < 0.001 and abs(sb - 0.592) < 0.001, (sa, sb)
na, _ = oee_nakajima(**przypadki["A"])
assert abs(na - 0.829) < 0.001, na

print("\n2. Andersson i Bellgran (2011): skrócenie idealnego czasu cyklu wąskiego gardła")
for etykieta, cykl_s, oee in (("przed", 26, 0.86), ("po", 22, 0.79)):
    teor = 3600 / cykl_s
    print(f"  {etykieta}: cykl idealny {cykl_s} s -> teoretycznie {teor:.1f} szt./h; OEE {oee:.0%} -> {teor * oee:.1f} szt./h")
# Autorzy podają 138 -> 164 szt./h teoretycznie oraz 118 -> 130 szt./h rzeczywiście

print("\n3. Iloczyn składowych 90% x 95% x 99% =", round(0.90 * 0.95 * 0.99, 4))
print("   wariant z jakością 99,9%: 90% x 95% x 99,9% =", round(0.90 * 0.95 * 0.999, 4))
