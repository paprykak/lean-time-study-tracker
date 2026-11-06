import type { APIRoute } from 'astro';
import ustawienia from '../data/ustawienia.json';

// Robotom wolno wszystko poza panelem i API. Strony podglądu blokuje noindex (meta i X-Robots-Tag), nie robots.txt:
// zablokowany adres nie zostałby pobrany, więc wyszukiwarka nie zobaczyłaby noindex.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${ustawienia.adres}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
