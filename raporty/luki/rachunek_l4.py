# Niezależny rachunek do testów src/lib/narzedzia/l4-wstecz.test.ts (datetime, własny kalendarz świąt).
# § 7 rozp. Dz.U. 2015 poz. 2013: od B-3 do B+1 bez warunków (B-3..B-1 tylko gdy badanie potwierdza), B+2..B+4 z warunkiem.
# § 2 ust. 2 rozp. Dz.U. 2014 poz. 1632: zawiadomienie najpóźniej w drugim dniu nieobecności = P+1.
from datetime import date, timedelta
import sys

DNI = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']

def wielkanoc(r):
    a=r%19; b=r//100; c=r%100; d=b//4; e=b%4; f=(b+8)//25; g=(b-f+1)//3; h=(19*a+b-d-g+15)%30
    i=c//4; k=c%4; l=(32+2*e+2*i-h-k)%7; m=(a+11*h+22*l)//451; mies=(h+l-7*m+114)//31; dz=((h+l-7*m+114)%31)+1
    return date(r,mies,dz)

def swieta(r):
    w=wielkanoc(r)
    s={date(r,1,1),date(r,1,6),w,w+timedelta(1),date(r,5,1),date(r,5,3),w+timedelta(49),w+timedelta(60),date(r,8,15),date(r,11,1),date(r,11,11),date(r,12,25),date(r,12,26)}
    if r>=2025: s.add(date(r,12,24))
    return s

def wolny(d):
    return d.weekday()>=5 or d in swieta(d.year)

def polozenie(b,p):
    r=(p-b).days
    if r<-3: return 'przed-granica',r
    if r<0: return 'wstecz',r
    if r<=1: return 'zwykle',r
    if r<=4: return 'pozniej-warunek',r
    return 'za-pozno',r

PRZYPADKI=[
 ('2026-11-13','2026-11-10'),('2026-11-13','2026-11-09'),('2026-11-13','2026-11-13'),('2026-11-13','2026-11-14'),
 ('2026-11-13','2026-11-17'),('2026-11-13','2026-11-18'),('2028-03-01','2028-02-27'),('2027-01-02','2026-12-30'),
 ('2026-12-31','2027-01-04'),('2026-12-23','2026-12-24'),('2026-04-03','2026-04-05'),('2024-03-01','2024-02-27'),
]
for b,p in PRZYPADKI:
    B=date.fromisoformat(b); P=date.fromisoformat(p)
    pol,r=polozenie(B,P)
    t=P+timedelta(1)
    print(b,p,pol,r,'najwczesniej',B-timedelta(3),DNI[(B-timedelta(3)).weekday()],'zwykle',B+timedelta(1),'warunek',B+timedelta(4),
          'zawiadom',t,DNI[t.weekday()],'wolny' if wolny(t) else '-', 'poza', ((B-timedelta(3))-P).days if pol=='przed-granica' else 0,
          'wizyta_najwczesniej', P-timedelta(4))
