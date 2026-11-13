# Treści testowe (fikcyjne)

Fikcyjny partner i kampanie reklamowe w `partnerzy/` i `kampanie/` wypełniają jedyne miejsce reklamowe (strona główna,
„glowna”) w podglądzie gałęzi (`noindex`) i w buildzie testowym (`RH_TESTOWE=1`, używa go `npm run check`): kampania A
i B rotują, trzecia jest zakończona i nie może trafić do HTML. Produkcja ich nigdy nie ładuje, panel redakcji ich nie
widzi (`src/lib/srodowisko.mjs`, `src/content.config.ts`). Kreacje leżą w `src/assets/testowe/kampanie/`.

Od 2026-11-12 serwis to narzędzia i przepisy: fikcyjne artykuły i materiał do pobrania, które testowały szablony
artykułów, działów i tematów, zniknęły razem z tymi szablonami (historia git). Strony narzędzi testują się na
prawdziwych narzędziach z rejestru (`tests/e2e/strony.ts`). Nie dodawaj tu prawdziwych tekstów ani danych.
