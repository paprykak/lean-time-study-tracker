# Kandydaci na zdjęcia

**Stan 2026-11-06:** Patryk dopuścił licencje Unsplash i Pexels i powierzył wybór redakcji. Wybrane: 8 rekomendowanych poniżej i 2 zdjęcia magazynu z rawpixel (Openverse, CC0). Wpisy i podpisy: rejestr `src/content/zdjecia/` (od F2 kolekcja treści, edycja w panelu). Pliki pobiera `npm run zdjecia`.

Lista z 2026-11-06. Źródło: Wikimedia Commons. Licencję każdego pliku sprawdzono dwa razy w API (`LicenseShortName`, `License`, `LicenseUrl`).
Pierwotny plan (wykonany po zgodzie Patryka): pobranie, wpis w rejestrze, kadry 16:9, 16:10 i 1:1, podpis „Fot.” przy każdym zdjęciu.

## Rekomendowane (8)

| # | Dział | Zdjęcie | Licencja | Podpis „Fot.” | Uwagi |
|---|---|---|---|---|---|
| 3 | Produkcja | [Robot spawalniczy w hali](https://commons.wikimedia.org/wiki/File:Robotic_Welding_and_Weld_Monitoring_Setup_using_a_weld_camera.jpg), 2048×1536 | CC BY 4.0 | Fot. WeldingWIP / Wikimedia Commons, CC BY 4.0 | mała etykieta na kamerze; konto wygląda na firmowe |
| 4 | Produkcja (hala) | [Pusta hala z torowiskiem](https://commons.wikimedia.org/wiki/File:Assembly_Line_(Unsplash).jpg), 4896×3264 | CC0 | Fot. Samuel Zeller / Unsplash (CC0) | bardziej hala obsługowa niż linia; dobra na tło i zdjęcia ogólne |
| 6 | Magazyn i logistyka | [Przenośniki rolkowe i taśmowe](https://commons.wikimedia.org/wiki/File:Conveyor_system_in_a_factory.jpg), 4000×3000 | CC0 | Fot. falco / Pixabay (CC0) | drobne etykiety kartonów |
| 8 | Lean | [Linia montażu elektroniki z instrukcjami stanowiskowymi](https://commons.wikimedia.org/wiki/File:Phone_Assembly_Line.jpg), 3968×2976 | CC0 | Fot. Encik Tekateki / Wikimedia Commons (CC0) | twarze w maskach, nie są tematem zdjęcia |
| 10 | Lean | [Ściana karteczek (kaizen, zarządzanie wizualne)](https://commons.wikimedia.org/wiki/File:Sticky_notes_on_the_wall_of_the_Wikimedia_Foundation_office,_2010-10-26.jpg), 3888×2592 | CC BY 3.0 | Fot. Ragesoss / Wikimedia Commons, CC BY 3.0 | biuro, nie hala; tekst nieczytelny |
| 11 | Dane i AI | [Inżynier z tabletem przy robocie w cleanroomie](https://commons.wikimedia.org/wiki/File:Reinraum_BBS_Automation_Blaichach.jpg), 8060×5184 | CC0 | Fot. Clemenspool / Wikimedia Commons (CC0) | twarz zasłonięta maską; brak widocznego logo |
| 12 | Dane i AI | [Stanowisko operatora SCADA](https://commons.wikimedia.org/wiki/File:SCADA_system_at_a_central_chilled_water_plant.jpg), 2048×1536 | CC0 | Fot. Rsparks3 / Wikimedia Commons (CC0) | **kadr bez logo uczelni po prawej** (kadr 16:9 od lewej) |
| 14 | Ludzie i szkolenia | [Warsztat szkoleniowy z tokarkami](https://commons.wikimedia.org/wiki/File:Mechanical_engineering_workshop_at_Arusha_Technical_College,_Tanzania.jpg), 4032×3024 | CC0 | Fot. Hilda Raphael / Wikimedia Commons (CC0) | twarze małe albo odwrócone |

## Warunkowo (1)

| # | Dział | Zdjęcie | Licencja | Dlaczego warunkowo |
|---|---|---|---|---|
| 2 | Produkcja | [Hala produkcyjna, prasy](https://commons.wikimedia.org/wiki/File:Hala_produkcyjna.jpg), 5278×3519 | CC BY 4.0 (PZL Sędziszów) | Najlepsze wizualnie i polskie, ale wgrane z archiwum firmy bez zgody zarejestrowanej w Wikimedia (VRT). Bezpiecznie dopiero po potwierdzeniu licencji e-mailem od PZL Sędziszów. |

## Odrzucone mimo poprawnej licencji
#1 i rezerwa „001” (linia Opla w Gliwicach: rozpoznawalne auta, nazwa zakładu), #5 (anonimowy autor przy zdjęciu wyglądającym na firmowe: ryzyko cudzego zdjęcia z przypisaną licencją), #7 (sklep IKEA, słaba ostrość), #9 (marka w nazwie pliku), #13 (mocna obróbka koloru), #15 (zdjęcie reklamowe producenta robota, twarze), #16 i rezerwy od tego samego autora (masowe zdjęcia w stylu stockowym; bez sprawdzenia pochodzenia).

## Luki i decyzja dla Patryka
- Brak zdjęć na CC0 albo CC BY: tablicy kanban, andon albo 5S na hali, wózka widłowego i doku bez logo marki, hali z dachem szedowym. Wszystkie znalezione zdjęcia tablic lean (16 w kategoriach lean, w tym 6 polskich) są na CC BY-SA, a ta licencja nie jest dozwolona.
- **Unsplash i Pexels** mają dziś własne licencje (darmowe, bez wymogu podpisu, ale nie CC0). Prompt dopuszcza z tych serwisów tylko CC0 i CC BY, więc to zdjęcia sprzed 2017 r. albo z CC0 w innych serwisach. Jeśli dopuścisz licencje Unsplash i Pexels (z podpisem „Fot.” mimo braku wymogu), pula zdjęć magazynów i lean wzrośnie wielokrotnie.
- Docelowo najlepsze będą własne zdjęcia redakcji z hal (za zgodą zakładów); kandydaci wyżej to start.
