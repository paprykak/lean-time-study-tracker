# Przykład arkusza wdrożenia na danych fikcyjnych (Krok 4 tekstu).
# Norma 12 min na sztukę (0,2 h), 40 h tygodniowo; wydajność 70%, 70%, 70%, 90%, 100% normy.
NORMA_H = 0.2
GODZINY = 40
wydajnosc = [0.7, 0.7, 0.7, 0.9, 1.0]
razem_h = razem_szt = razem_ponizej = 0
for tydzien, w in enumerate(wydajnosc, 1):
    sztuki = round(GODZINY / NORMA_H * w)
    minut = GODZINY * 60 / sztuki
    ponizej = GODZINY - sztuki * NORMA_H
    razem_h += GODZINY; razem_szt += sztuki; razem_ponizej += ponizej
    print(f'{tydzien} | {GODZINY} | {sztuki} | {minut:.1f} | {ponizej:g}')
print(f'Razem | {razem_h} | {razem_szt} | — | {razem_ponizej:g}')
print('sześć osób:', 6 * razem_ponizej, 'h =', 6 * razem_ponizej / GODZINY, 'tygodni pracy jednego operatora')
