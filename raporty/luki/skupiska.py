import json, re, sys, unicodedata
def n(s):
    s=s.lower()
    return ''.join(c for c in unicodedata.normalize('NFD', s.replace('ł','l')) if unicodedata.category(c)!='Mn')
baza=json.load(open('.cache/luki/podpowiedzi.json')); sonda=json.load(open('.cache/luki/sonda.json'))
B=set(s for l in baza.values() for s in l); S=set(s for l in sonda.values() for s in l)-B
SK=[
 ('L4 wstecz, początek zwolnienia, zawiadomienie i dostarczenie L4', r'(l4|zwolnien\w* lekarsk|zwolnienie od psych|zwolnienie)\b.*(wstecz|do przodu|do tylu)|(wstecz).*(l4|zwolnien)|(l4|zwolnien\w* lekarsk).*(powiadom|zglos|zglas|dostarcz|informowac)|(dostarcz|zglos|zglas|powiadom)\w*.*(l4|zwolnien\w* lekarsk)|(l4|zwolnien\w*).*(ikp|pue|widoczn)', 'brak (co-wolno-na-l4 i kalkulator-l4 nie mówią o dacie wstecznej ani o zawiadomieniu)', '§ 7 rozp. Dz.U. 2015 poz. 2013; § 2 rozp. Dz.U. 2014 poz. 1632; art. 55–58, 62 ustawy zasiłkowej'),
 ('Nadgodziny: czy muszę, odmowa, limity, „zostać po godzinach”', r'nadgodzin\w*.*(obowiazkow|zmusi|odmow|musze|musisz|zgod|planowa|maksymal|ile mozna|w roku|w tygodniu|w miesiacu|okresie rozl|kazac)|(zmusi|musze|musisz|odmow|kazac|wolno plan)\w*.*nadgodzin|zostac (po godzinach|dluzej)|zostac$|po godzinach$|musi zostac', 'częściowo: kalkulator-nadgodzin ma tylko FAQ o limicie 150 h; o obowiązku i odmowie nic', 'art. 100 § 1, 131–133, 151 § 1–4, 151⁴, 178, 203 Kp; art. 15–16 ustawy o rehabilitacji'),
 ('Urlop: odmowa, wysłanie na urlop, 14 dni, do końca roku, na żądanie', r'urlop\w*.*(odmow|zmusi|wyslac|dysponow|14 dni|2 tygodnie|10 dni|do konca roku|w danym roku|wykorzystac|planowac|na zadanie)|(odmow|zmusi|wyslac)\w*.*urlop|na zadanie', 'częściowo: kalkulator-urlopu (FAQ o 4 dniach na żądanie, zdanie o 14 dniach), zalegly-urlop, urlop-w-okresie-wypowiedzenia', 'art. 161–168, 167² Kp'),
 ('Spóźniona albo niewypłacona pensja, odsetki', r'(nie wyplacil|nie wyplacic|odsetk|spozniona wyplata|spozniona wyplat|wyplate wynagrodzenia|wyplaty pieniedzy|nie wyplacic pieniedzy)', 'brak rachunku odsetek (termin-wyplaty-wynagrodzenia podaje termin i grzywnę)', 'art. 85, 282 § 1 pkt 1 Kp; art. 481 KC (odsetki ustawowe za opóźnienie)'),
 ('Służba BHP i komisja BHP: od ilu pracowników', r'(ile bhp na|bhp na etacie|bhpowiec na etacie|bhp musi byc na etacie|komisja bhp|sluzba bhp|kiedy bhp w firmie)', 'brak', 'art. 237¹¹–237¹² Kp, rozporządzenie o służbie BHP'),
 ('Agencja pracy: opłaty, prowizja, ile zabiera', r'agencj\w* pracy.*(oplat|prowizj|zabiera|bierze|pobiera|dostaje|zarabia)|(zabiera|bierze|pobiera|zarabia)\w* agencj', 'brak; większość to marża handlowa, bez przepisu z liczbą', 'zakaz pobierania opłat od osób kierowanych (ustawa o rynku pracy i służbach zatrudnienia)'),
 ('PIP: kontrola, skarga, czas na odpowiedź', r'\bpip\b.*(kontrol|anonim|odpowiedz|zapowiad|dzwoni|informuje|ile trwa|lat wstecz|zglos|przychodzi|nakazac|zmienic)', 'częściowo: sad-pracy-czy-pip', 'ustawa o PIP, art. 237 KPA'),
 ('Sąd pracy: ile trwa, ile czeka się na rozprawę', r'sad\w* pracy.*(ile trwa|ile czasu|czeka|ile sie czeka|rozpatrz|wyznaczenie|wydanie wyroku|odpowiedz|ile instancji)|ile trwa sad pracy|ile czasu ma sad', 'nie da się policzyć: przepis nie podaje terminu rozpoznania', 'brak liczby w KPC'),
]
wyn=[]
for nazwa,wz,stan,przep in SK:
    r=re.compile(wz)
    b=sorted(s for s in B if r.search(n(s))); s2=sorted(s for s in S if r.search(n(s)))
    wyn.append((nazwa,len(b),len(s2),stan,przep,b,s2))
wyn.sort(key=lambda x:-(x[1]+x[2]))
for w in wyn:
    print(f'## {w[0]}: {w[1]} + {w[2]} = {w[1]+w[2]} | {w[3]} | {w[4]}')
    for s in w[5]: print('   B', s)
    for s in w[6]: print('   S', s)
json.dump([w[:5] for w in wyn], open('.cache/luki/ranking.json','w'), ensure_ascii=False, indent=1)
