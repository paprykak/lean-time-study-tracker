# Treści testowe (fikcyjne)

Artykuły w `artykuly/` wypełniają szablony serwisu w podglądzie gałęzi (`noindex`) i w buildzie testowym (`RH_TESTOWE=1`,
używa go `npm run check`). Produkcja ich nigdy nie ładuje, panel redakcji ich nie widzi (`src/lib/srodowisko.mjs`,
`src/content.config.ts`). Każdy ma `testowy: true` i widoczne oznaczenie w treści. Tytuły pochodzą z podglądu szablonów
zaakceptowanego w F1. Nie dodawaj tu prawdziwych tekstów ani danych.
