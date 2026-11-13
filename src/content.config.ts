// Model treści Rytmu Hali: kolekcje ze schematami zod. Edycja w panelu /admin (Sveltia CMS, public/admin/config.yml).
// Od 2026-11-12 serwis to narzędzia i przepisy (rejestr src/data/narzedzia.ts, strony w src/pages/narzedzia), więc
// kolekcje treści to tylko strony stałe oraz partnerzy i kampanie reklamowe. Artykuły, materiały, działy, tematy,
// autorzy i rejestr zdjęć przeszły do archiwum/ (archiwum/README.md). Treści sponsorowane zawsze oznaczone.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { MIEJSCA_REKLAM } from './lib/model';
import { WSZYSTKIE_TRESCI } from './lib/srodowisko.mjs';

// Adresy tylko http(s): link w panelu z literówką albo „javascript:” zatrzymuje build.
const adresUrl = z.url({ protocol: /^https?$/ });

const partnerzy = defineCollection({
  loader: glob({
    pattern: WSZYSTKIE_TRESCI ? ['partnerzy/*.json', 'testowe/partnerzy/*.json'] : 'partnerzy/*.json',
    base: './src/content',
    generateId: ({ entry }) => entry.split('/').at(-1)!.replace(/\.json$/, ''),
  }),
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
  loader: glob({
    pattern: WSZYSTKIE_TRESCI ? ['kampanie/*.json', 'testowe/kampanie/*.json'] : 'kampanie/*.json',
    base: './src/content',
    generateId: ({ entry }) => entry.split('/').at(-1)!.replace(/\.json$/, ''),
  }),
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

/**
 * Strony stałe (O nas, zasady redakcyjne, polityka korekt, oznaczanie reklam, jak używamy AI, kontakt, polityka
 * prywatności, reklama i współpraca, newsletter). Adresy ustalone w src/pages; tekst edytuje redakcja w panelu.
 * „projekt: true” = projekt tekstu do akceptacji Patryka: strona pokazuje to wprost, a kontrola SEO nie przepuści
 * projektu na produkcję po starcie.
 * Nowe brzmienie strony, która już działa, leży obok jako `projekt-<slug>.md` (projekt: true): podgląd i build testowy
 * pokazują je pod /podglad/<slug> (src/pages/podglad/[slug].astro), produkcja ich nie ładuje. Akceptacja: treść
 * projektu przechodzi do `<slug>.md`, plik projektu znika.
 */
const strony = defineCollection({
  loader: glob({ pattern: WSZYSTKIE_TRESCI ? '*.md' : ['*.md', '!projekt-*.md'], base: './src/content/strony' }),
  schema: z.object({
    tytul: z.string().min(3).max(80),
    opis: z.string().min(70).max(160),
    zaktualizowano: z.coerce.date(),
    projekt: z.boolean().default(false),
  }),
});

export const collections = { partnerzy, kampanie, strony };
