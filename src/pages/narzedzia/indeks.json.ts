import type { APIRoute } from 'astro';
import { indeksNarzedzi } from '../../lib/indeks-narzedzi';

// Indeks wyszukiwarki narzędzi (src/lib/indeks-narzedzi.ts): pobiera go skrypt pola wyszukiwania przy pierwszym
// użyciu, więc strony nie niosą go w HTML. Bez danych osobowych; plik statyczny jak każdy inny w dist/.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(indeksNarzedzi()), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
