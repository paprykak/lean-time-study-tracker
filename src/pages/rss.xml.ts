// Kanał RSS całego serwisu: /rss.xml
import type { APIRoute } from 'astro';
import { artykuly } from '../lib/tresci';
import { kanal } from '../lib/rss';
import ustawienia from '../data/ustawienia.json';

export const GET: APIRoute = async () =>
  kanal({ tytul: ustawienia.nazwa, opis: ustawienia.opis, adres: '/', teksty: await artykuly() });
