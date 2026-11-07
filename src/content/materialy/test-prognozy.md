---
tytul: "Test prognozy: czy pobijasz prognozy, które nic nie kosztują?"
opis: "Arkusz porównuje Twoją prognozę popytu z trzema darmowymi: naiwną, średnią z 4 okresów i wygładzaniem wykładniczym, liczonymi z Twoim wyprzedzeniem. Liczy błąd w sztukach, wartość dodaną prognozy (FVA) i skutki korekt planisty."
plik: /pobierz/test-prognozy.xlsx
format: XLSX
podglady:
  - /src/assets/materialy/test-prognozy-1.png
  - /src/assets/materialy/test-prognozy-2.png
dzial: dane-i-ai
tematy:
  - ai-w-planowaniu
opublikowano: 2026-11-07
szkic: true
---

Prognoza, za którą płacisz czasem planisty albo licencją systemu, powinna mylić się mniej niż trzy prognozy, które nic nie kosztują: ostatnia znana sprzedaż (prognoza naiwna), średnia z czterech okresów i wygładzanie wykładnicze. Arkusz sprawdza to na Twoich danych i liczy darmowe prognozy z takim samym wyprzedzeniem, z jakim robisz swoją.

## Co jest w arkuszu

- **Wiele indeksów:** dane w kolumnach indeks, okres, sprzedaż, prognoza dla około 20 indeksów. Wynik dla każdego indeksu i dla wszystkich razem, liczba indeksów, w których Twoja prognoza bije lepszą prostą metodę, oraz werdykt z zaleceniem: gorsza od naiwnej, prosta metoda lepsza, remis albo bije wszystkie darmowe. Granicę remisu (±10–20%) arkusz dobiera do wyprzedzenia.
- **Jeden indeks:** ten sam test dla jednego indeksu, z błędem każdej prognozy w sztukach, wartością dodaną (FVA) i odchyleniem, czyli tym, czy prognoza średnio zawyża albo zaniża sprzedaż.
- **Korekty:** prognoza systemu i prognoza po korekcie planisty. Arkusz pokazuje, czy korekty zmniejszają błąd, osobno w górę i w dół.

W pomarańczowych polach ustawiasz wyprzedzenie prognozy i wagę ostatniego okresu w wygładzaniu. Dane przykładowe są fikcyjne. Nadpisz je swoimi.

## Jak z niego korzystać

1. Wylosuj około 20 indeksów z listy sprzedaży z roku przed testem, po kilka z grup A, B i C, razem z wycofanymi.
2. Wklej sprzedaż i prognozę z ostatnich 26–52 tygodni. Bierz prognozę, z którą naprawdę zamawiałeś, i wpisz jej wyprzedzenie. Jako sprzedaż wklej to, co prognozujesz (na przykład zamówienia, a nie wysyłki), a tydzień bez towaru zostaw z pustą sprzedażą.
3. Jeśli prognozę poprawia planista, wklej też prognozę systemu sprzed korekty.
4. Wniosek wyciągaj z wyniku dla wszystkich indeksów razem. Wynik dla jednego indeksu to wskazówka, a nie dowód.
5. Tym samym arkuszem ocenisz pilotaż systemu prognoz: zamiast swojej prognozy wklej prognozę systemu.

Uzasadnienie, dowody z konkursów prognostycznych i badań w firmach oraz trzy pytania do dostawcy systemu prognoz znajdziesz w artykule [„Zanim kupisz AI do prognoz, sprawdź, czy bijesz proste metody”](/prognozowanie-popytu). Arkusz możesz kopiować i używać w firmie.
