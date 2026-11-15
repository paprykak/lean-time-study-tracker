import json, urllib.request, urllib.parse, time, sys
SLOWA = ["pracodawca","praca","wypłata","L4","urlop","umowa","zwolnienie","BHP","wózek","magazyn","zmiana","nocka","nadgodziny","ZUS","agencja pracy","cudzoziemiec","emerytura","odprawa","kara","PIP","sąd pracy"]
PRE = ["czy","ile","kiedy","czy wolno","czy muszę"]
frazy=[]
for s in SLOWA:
    frazy.append(s)
    for p in PRE:
        frazy.append(f"{p} {s}")
        frazy.append(f"{s} {p}")
wyn={}
for f in frazy:
    url="https://suggestqueries.google.com/complete/search?client=firefox&hl=pl&gl=pl&q="+urllib.parse.quote(f)
    for proba in range(3):
        try:
            with urllib.request.urlopen(url, timeout=15) as r:
                d=json.loads(r.read().decode('utf-8','replace'))
            wyn[f]=d[1]; break
        except Exception as e:
            time.sleep(2)
    time.sleep(0.4)
json.dump(wyn, open(sys.argv[1],'w'), ensure_ascii=False, indent=1)
print(len(wyn), sum(len(v) for v in wyn.values()))
