# Podglądy arkusza „Test prognozy” do strony materiału: górna część arkuszy „Jeden indeks” i „Korekty”
# w proporcji 16:10. Plik przelicza i drukuje LibreOffice (bez interfejsu), strony renderuje pdftoppm.
# Uruchom z katalogu projektu po arkusz.py: python3 redakcja/prognozowanie-popytu/arkusz/podglady.py
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

KORZEN = Path(__file__).resolve().parents[3]
PLIK = KORZEN / 'public/pobierz/test-prognozy.xlsx'
CEL = KORZEN / 'src/assets/materialy'
CEL.mkdir(parents=True, exist_ok=True)

with tempfile.TemporaryDirectory() as tmp:
    t = Path(tmp)
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', tmp, str(PLIK)], check=True, capture_output=True, timeout=180)
    pdf = t / 'test-prognozy.pdf'
    strony = int(next(l for l in subprocess.run(['pdfinfo', str(pdf)], capture_output=True, text=True).stdout.splitlines() if l.startswith('Pages:')).split()[1])
    def strona_z(tekst):
        for n in range(1, strony + 1):
            if tekst in subprocess.run(['pdftotext', '-f', str(n), '-l', str(n), str(pdf), '-'], capture_output=True, text=True).stdout:
                return n
        raise SystemExit(f'Nie ma strony z tekstem: {tekst}')
    for i, tekst in enumerate(['Jeden indeks: Twoja prognoza', 'Korekty: czy poprawka'], start=1):
        n = strona_z(tekst)
        subprocess.run(['pdftoppm', '-r', '150', '-png', '-f', str(n), '-l', str(n), '-singlefile', str(pdf), str(t / f's{i}')], check=True)
        im = Image.open(t / f's{i}.png').convert('RGB')
        szer = im.width
        wys = round(szer * 10 / 16)
        gora = round(im.height * 0.07)  # pomija pusty margines nad tytułem
        im.crop((0, gora, szer, gora + wys)).save(CEL / f'test-prognozy-{i}.png', optimize=True)
        print(f'zapisano src/assets/materialy/test-prognozy-{i}.png (strona {n} PDF, {szer}×{wys})')
