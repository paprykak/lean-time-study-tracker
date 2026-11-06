// Model treści Rytmu Hali (F2): kolekcje ze schematami zod. Edycja w panelu /admin (Sveltia CMS, public/admin/config.yml).
// Zasady: artykuły, nie wiadomości (format zamiast godziny); każde zdjęcie z rejestru licencji (kolekcja „zdjecia”);
// treści sponsorowane zawsze oznaczone; szkice i wpisy testowe nigdy nie trafiają na produkcję (src/lib/tresci.ts).
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { FORMATY, LICENCJE, MIEJSCA_REKLAM, RODZAJE_ZRODEL } from './lib/model';
import { WSZYSTKIE_TRESCI } from './lib/srodowisko.mjs';

// Adresy tylko http(s): link w panelu z literówką albo „javascript:” zatrzymuje build.
const adresUrl = z.url({ protocol: /^https?$/ });

/** Rejestr licencji zdjęć: jedno zdjęcie = jeden wpis. Artykuły wybierają zdjęcia stąd (relacja). */
const zdjecia = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/zdjecia' }),
  schema: ({ image }) =>
    z.object({
      plik: image(),
      alt: z.string().min(20, 'Opis zdjęcia (alt) ma co najmniej 20 znaków'),
      fot: z.string().regex(/^Fot\. /, 'Podpis zaczyna się od „Fot. ”'),
      autor: z.string(),
      licencja: z.enum(LICENCJE),
      licencjaUrl: adresUrl.optional(),
      zrodlo: adresUrl.optional(),
      pobierz: adresUrl.optional(),
      dzial: z.string().optional(),
      kadr: z.object({ lewo: z.number(), gora: z.number(), szerokosc: z.number(), wysokosc: z.number() }).optional(),
      pozycja: z.enum(['center', 'left', 'right', 'top', 'bottom']).optional(),
      uwagi: z.string().optional(),
      zgoda: z.string().min(10, 'Data i forma zgody Patryka'),
    }),
});

const dzialy = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/dzialy' }),
  schema: z.object({
    nazwa: z.string(),
    nazwaMenu: z.string(),
    opis: z.string().min(40),
    kolejnosc: z.number().int(),
    tytulSeo: z.string().max(60).optional(),
    opisSeo: z.string().max(160).optional(),
  }),
});

const tematy = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/tematy' }),
  schema: z.object({
    nazwa: z.string(),
    opis: z.string().default(''),
    dzial: reference('dzialy').optional(),
  }),
});

/** Autorzy: strona autora i dane Person (E-E-A-T: kompetencje i doświadczenie). */
const autorzy = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/autorzy' }),
  schema: ({ image }) =>
    z.object({
      imie: z.string(),
      /** „Redakcja” to podpis zespołu: w danych strukturalnych organizacja Rytm Hali, nie osoba. */
      typ: z.enum(['Osoba', 'Redakcja']).default('Osoba'),
      rola: z.string(),
      bio: z.string().min(40),
      kompetencje: z.array(z.string()).default([]),
      zdjecie: image().optional(),
      sameAs: z.array(adresUrl).default([]),
      email: z.email().optional(),
    }),
});

const partnerzy = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/partnerzy' }),
  schema: ({ image }) =>
    z.object({
      nazwa: z.string(),
      adres: adresUrl,
      opis: z.string().optional(),
      logo: image().optional(),
    }),
});

/** Kampanie reklamowe sprzedawane bezpośrednio (F5): miejsca, kreacje w formatach slotów, daty, link z UTM. */
const kampanie = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/kampanie' }),
  schema: ({ image }) =>
    z
      .object({
        nazwa: z.string(),
        partner: reference('partnerzy'),
        link: adresUrl,
        od: z.coerce.date(),
        do: z.coerce.date(),
        miejsca: z.array(z.enum(MIEJSCA_REKLAM)).min(1),
        kreacje: z
          .object({
            billboard: image().optional(),
            baner: image().optional(),
            prostokat: image().optional(),
            polstrona: image().optional(),
            mobilny: image().optional(),
            mobilnyProstokat: image().optional(),
          })
          .refine((k) => Object.values(k).some(Boolean), 'Co najmniej jedna kreacja'),
        altKreacji: z.string().min(10),
        aktywna: z.boolean().default(true),
      })
      .refine((k) => k.do > k.od, { message: 'Data końca musi być po dacie początku', path: ['do'] }),
});

/** Materiały do pobrania (wzory, karty): własna strona /do-pobrania/<slug> i ramka w artykułach. */
const materialy = defineCollection({
  loader: glob({
    pattern: WSZYSTKIE_TRESCI ? ['materialy/*.md', 'testowe/materialy/*.md'] : 'materialy/*.md',
    base: './src/content',
    generateId: ({ entry }) => entry.split('/').at(-1)!.replace(/\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      tytul: z.string(),
      opis: z.string().min(40).max(300),
      plik: z.string().regex(/^\/pobierz\/[a-z0-9-]+\.(pdf|xlsx|docx|zip)$/, 'Plik w /pobierz/, np. /pobierz/karta-smed.pdf'),
      format: z.enum(['PDF', 'XLSX', 'DOCX', 'ZIP']),
      strony: z.number().int().positive().optional(),
      podglady: z.array(image()).default([]),
      dzial: reference('dzialy'),
      tematy: z.array(reference('tematy')).default([]),
      opublikowano: z.coerce.date(),
      zaktualizowano: z.coerce.date().optional(),
      szkic: z.boolean().default(false),
      testowy: z.boolean().default(false),
    }),
});

/**
 * Artykuły (Markdown). Adres: /<nazwa pliku>, bez działu w adresie (zmiana działu nie zmienia adresu).
 * W podglądzie i buildzie testowym dochodzą fikcyjne artykuły z src/content/testowe/artykuly (wypełniają szablony;
 * panel ich nie widzi, produkcja nigdy ich nie ładuje). Identyfikator to sama nazwa pliku.
 */
const artykuly = defineCollection({
  loader: glob({
    pattern: WSZYSTKIE_TRESCI ? ['artykuly/*.md', 'testowe/artykuly/*.md'] : 'artykuly/*.md',
    base: './src/content',
    generateId: ({ entry }) => entry.split('/').at(-1)!.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      tytul: z.string().min(10).max(120),
      tytulSeo: z.string().max(60).optional(),
      opisSeo: z.string().min(70).max(160).optional(),
      lead: z.string().min(60).max(320),
      dzial: reference('dzialy'),
      format: z.enum(FORMATY),
      tematy: z.array(reference('tematy')).default([]),
      autorzy: z.array(reference('autorzy')).min(1),
      opublikowano: z.coerce.date(),
      zaktualizowano: z.coerce.date().optional(),
      zdjecie: reference('zdjecia'),
      podpisZdjecia: z.string().optional(),
      partner: z
        .object({
          partner: reference('partnerzy'),
          oznaczenie: z.enum(['Materiał partnera', 'Reklama']).default('Materiał partnera'),
          koniecKampanii: z.coerce.date().optional(),
        })
        .optional(),
      // Źródło n odpowiada przypisowi [n] w treści (wtyczka przypisów w src/lib/markdown.mjs, kontrola w src/lib/kontrola-tekstu.mjs).
      zrodla: z
        .array(z.object({ opis: z.string(), adres: adresUrl.optional(), rodzaj: z.enum(RODZAJE_ZRODEL).optional(), dostep: z.coerce.date().optional() }))
        .default([]),
      faq: z.array(z.object({ pytanie: z.string().max(160), odpowiedz: z.string().max(800) })).default([]),
      /** Data ostatniej pełnej weryfikacji faktów (każde twierdzenie sprawdzone w źródle). */
      sprawdzono: z.coerce.date().optional(),
      /** „Jak powstał ten tekst”: metoda, źródła, użycie AI, konflikty interesów (widoczne pod artykułem). */
      metoda: z.string().max(700).optional(),
      /** Jawne poprawki błędów rzeczowych i zmian wniosków (polityka korekt), widoczne pod tekstem. */
      poprawki: z.array(z.object({ data: z.coerce.date(), opis: z.string().min(10).max(400) })).default([]),
      powiazane: z.array(reference('artykuly')).default([]),
      materialy: z.array(reference('materialy')).default([]),
      wyrozniony: z.boolean().default(false),
      noindex: z.boolean().default(false),
      szkic: z.boolean().default(false),
      testowy: z.boolean().default(false),
    })
    .refine((a) => !a.zaktualizowano || a.zaktualizowano >= a.opublikowano, { message: 'Aktualizacja nie może być przed publikacją', path: ['zaktualizowano'] }),
});

/**
 * Strony stałe (O nas, zasady redakcyjne, polityka korekt, oznaczanie reklam, jak używamy AI, kontakt, polityka
 * prywatności, reklama i współpraca, newsletter). Adresy ustalone w src/pages; tekst edytuje redakcja w panelu.
 * „projekt: true” = projekt tekstu do akceptacji Patryka: strona pokazuje to wprost, a kontrola SEO nie przepuści
 * projektu na produkcję po starcie.
 */
const strony = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/strony' }),
  schema: z.object({
    tytul: z.string().min(3).max(80),
    opis: z.string().min(70).max(160),
    zaktualizowano: z.coerce.date(),
    projekt: z.boolean().default(false),
  }),
});

export const collections = { zdjecia, dzialy, tematy, autorzy, partnerzy, kampanie, materialy, artykuly, strony };
