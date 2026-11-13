import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './index.js';
import { BREVO_DOI, poprawnyEmail, wiadomoscKontaktowa } from './formularze.js';
import { kontakt } from './formularze.js';

const ADRES = 'https://rytmhali.pl';
const ENV = { ASSETS: { fetch: vi.fn() }, BREVO_API_KEY: 'klucz-testowy', BREVO_LISTA: '7', BREVO_SZABLON_DOI: '3' };
const formularz = (sciezka, pola, naglowki = {}) =>
  new Request(ADRES + sciezka, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: ADRES, 'CF-Connecting-IP': '203.0.113.7', ...naglowki },
    body: new URLSearchParams(pola),
  });
const cel = (odp) => new URL(odp.headers.get('Location')).pathname;

afterEach(() => vi.unstubAllGlobals());

describe('adres e-mail', () => {
  it('przyjmuje zwykłe adresy, odrzuca niepełne i takie, które mogłyby wejść do nagłówków', () => {
    for (const a of ['jan.kowalski@firma.pl', 'a+b@sub.firma.co.uk']) expect(poprawnyEmail(a), a).toBe(true);
    for (const a of ['kierownik@zaklad', 'jan kowalski@firma.pl', 'a@b.pl\r\nBcc: x@y.pl', 'a<b>@firma.pl', `${'a'.repeat(250)}@firma.pl`]) expect(poprawnyEmail(a), a).toBe(false);
  });
});

describe('zapis na newsletter (/api/newsletter)', () => {
  it('poprawny zapis: Brevo z podwójnym potwierdzeniem, lista, szablon i powrót na stronę „potwierdzono”', async () => {
    const wywolania = [];
    vi.stubGlobal('fetch', vi.fn(async (url, opcje) => (wywolania.push([url, opcje]), new Response(null, { status: 201 }))));
    const odp = await worker.fetch(formularz('/api/newsletter', { email: 'jan@firma.pl', zgoda: 'tak', strona: '' }), ENV);
    expect(odp.status).toBe(303);
    expect(cel(odp)).toBe('/newsletter/potwierdz');
    expect(odp.headers.get('Cache-Control')).toBe('no-store');
    const [url, opcje] = wywolania[0];
    expect(url).toBe(BREVO_DOI);
    expect(opcje.headers['api-key']).toBe('klucz-testowy');
    expect(JSON.parse(opcje.body)).toEqual({ email: 'jan@firma.pl', includeListIds: [7], templateId: 3, redirectionUrl: `${ADRES}/newsletter/potwierdzono` });
  });

  it('bez zgody, z błędnym adresem albo bez konfiguracji: strona błędu i brak wywołania dostawcy', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const [pola, env] of [
      [{ email: 'jan@firma.pl' }, ENV],
      [{ email: 'jan@firma', zgoda: 'tak' }, ENV],
      [{ email: 'jan@firma.pl', zgoda: 'tak' }, { ...ENV, BREVO_API_KEY: undefined }],
    ]) {
      const odp = await worker.fetch(formularz('/api/newsletter', pola), env);
      expect(cel(odp)).toBe('/newsletter/blad');
    }
    expect(f).not.toHaveBeenCalled();
  });

  it('pole-pułapka: bot widzi „sukces”, a dostawca nie dostaje zgłoszenia', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const odp = await worker.fetch(formularz('/api/newsletter', { email: 'bot@spam.pl', zgoda: 'tak', strona: 'https://spam.example' }), ENV);
    expect(cel(odp)).toBe('/newsletter/potwierdz');
    expect(f).not.toHaveBeenCalled();
  });

  it('limit prób na IP i formularz z obcej strony', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const limit = vi.fn(async () => ({ success: false }));
    const odp = await worker.fetch(formularz('/api/newsletter', { email: 'jan@firma.pl', zgoda: 'tak' }), { ...ENV, LIMIT_FORMULARZY: { limit } });
    expect(cel(odp)).toBe('/newsletter/blad');
    expect(limit).toHaveBeenCalledWith({ key: 'newsletter:203.0.113.7' });
    const obca = await worker.fetch(formularz('/api/newsletter', { email: 'jan@firma.pl', zgoda: 'tak' }, { Origin: 'https://zla.example' }), ENV);
    expect(obca.status).toBe(403);
    expect(f).not.toHaveBeenCalled();
  });

  it('błąd dostawcy prowadzi na stronę błędu bez adresu e-mail w logach; GET to 405', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{"code":"invalid_parameter"}', { status: 400 })));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const odp = await worker.fetch(formularz('/api/newsletter', { email: 'jan@firma.pl', zgoda: 'tak' }), ENV);
    expect(cel(odp)).toBe('/newsletter/blad');
    expect(log.mock.calls.flat().join(' ')).not.toContain('jan@firma.pl');
    const get = await worker.fetch(new Request(`${ADRES}/api/newsletter`), ENV);
    expect(get.status).toBe(405);
    expect(get.headers.get('Allow')).toBe('POST');
  });
});

describe('formularz kontaktowy (/api/kontakt)', () => {
  class EmailMessage {
    constructor(from, to, raw) {
      Object.assign(this, { from, to, raw });
    }
  }
  const wyslane = [];
  const ENV_POCZTA = { ...ENV, ADRES_REDAKCJI: 'skrzynka@example.com', POCZTA: { send: async (m) => wyslane.push(m) } };
  const POLA = { imie: 'Anna Nowak', email: 'anna@firma.pl', temat: 'Błąd w narzędziu', wiadomosc: 'Kalkulator nadgodzin liczy dodatek od złej podstawy.', zgoda: 'tak', strona: '' };

  it('wysyła wiadomość do redakcji z odpowiedzią do nadawcy i polskimi znakami w temacie', async () => {
    const odp = await kontakt(formularz('/api/kontakt', POLA), ENV_POCZTA, { EmailMessage });
    expect(cel(odp)).toBe('/kontakt/wyslano');
    const m = wyslane.at(-1);
    expect([m.from, m.to]).toEqual(['formularz@rytmhali.pl', 'skrzynka@example.com']);
    expect(m.raw).toContain('Reply-To: <anna@firma.pl>');
    const temat = m.raw.match(/^Subject: =\?UTF-8\?B\?([^?]+)\?=/m)[1];
    expect(Buffer.from(temat, 'base64').toString('utf8')).toBe('[Rytm Hali] Błąd w narzędziu');
    const tresc = Buffer.from(m.raw.split('\r\n\r\n')[1].replace(/\r\n/g, ''), 'base64').toString('utf8');
    expect(tresc).toContain('Imię i nazwisko: Anna Nowak');
    expect(tresc).toContain('Kalkulator nadgodzin liczy dodatek od złej podstawy.');
  });

  it('temat spoza listy to „Inne”; za krótka wiadomość, brak zgody albo brak poczty: strona błędu', async () => {
    await kontakt(formularz('/api/kontakt', { ...POLA, temat: 'Spam\r\nBcc: x@y.pl' }), ENV_POCZTA, { EmailMessage });
    expect(Buffer.from(wyslane.at(-1).raw.match(/^Subject: =\?UTF-8\?B\?([^?]+)\?=/m)[1], 'base64').toString('utf8')).toBe('[Rytm Hali] Inne');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const [pola, env] of [
      [{ ...POLA, wiadomosc: 'krótko' }, ENV_POCZTA],
      [{ ...POLA, zgoda: '' }, ENV_POCZTA],
      [POLA, ENV],
    ]) {
      expect(cel(await kontakt(formularz('/api/kontakt', pola), env, { EmailMessage }))).toBe('/kontakt/blad');
    }
  });

  it('wiadomość MIME: nagłówki w porządku, treść w base64 zawinięta do 76 znaków', () => {
    const raw = wiadomoscKontaktowa({ nadawca: 'formularz@rytmhali.pl', adresat: 'r@example.com', imie: '', email: 'a@b.pl', temat: 'Inne', tresc: 'ż'.repeat(200), data: new Date('2026-11-06T13:00:00Z'), id: 'abc' });
    const [naglowki, tresc] = raw.split('\r\n\r\n');
    expect(naglowki).toContain('Date: Fri, 06 Nov 2026 13:00:00 +0000');
    expect(naglowki).toContain('Message-ID: <abc@rytmhali.pl>');
    expect(naglowki).toContain('Content-Type: text/plain; charset=UTF-8');
    expect(tresc.split('\r\n').filter(Boolean).every((w) => w.length <= 76)).toBe(true);
    expect(Buffer.from(tresc.replace(/\r\n/g, ''), 'base64').toString('utf8')).toContain('Imię i nazwisko: nie podano');
  });
});
