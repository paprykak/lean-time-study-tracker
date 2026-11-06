// Formularze bez skryptów zewnętrznych (F6): zapis na newsletter (Brevo, podwójne potwierdzenie) i kontakt
// z redakcją (e-mail przez Cloudflare Email Routing). Ochrona przed spamem: pole-pułapka „strona”, limit prób na IP
// (wiązanie Rate Limiting LIMIT_FORMULARZY), formularz tylko z tej samej domeny (nagłówek Origin), kontrola pól po
// stronie serwera. Odpowiedź to przekierowanie 303 na stronę statyczną, więc wszystko działa bez JavaScriptu.
// Konfiguracja (STAN.md): sekret BREVO_API_KEY (wpisuje Patryk: npx wrangler secret put BREVO_API_KEY), zmienne
// BREVO_LISTA i BREVO_SZABLON_DOI, wiązanie send_email POCZTA i zmienna ADRES_REDAKCJI (zweryfikowany adres docelowy
// Email Routing). Bez konfiguracji formularz prowadzi na stronę błędu i zapisuje przyczynę w logach workera.

import { TEMATY_KONTAKTU } from '../src/lib/formularze.mjs';

export { TEMATY_KONTAKTU };

export const STRONY = {
  newsletter: { ok: '/newsletter/potwierdz', blad: '/newsletter/blad' },
  kontakt: { ok: '/kontakt/wyslano', blad: '/kontakt/blad' },
};
export const BREVO_DOI = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';
const NADAWCA_DOMYSLNY = 'formularz@rytmhali.pl';
const LIMIT_CZASU_MS = 8000;

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;
/** Adres e-mail do zapisu i odpowiedzi: bez spacji i znaków, które mogłyby wejść do nagłówków wiadomości. */
export const poprawnyEmail = (adres) => adres.length <= 254 && EMAIL.test(adres);

const przekieruj = (zadanie, sciezka) =>
  new Response(null, { status: 303, headers: { Location: new URL(sciezka, zadanie.url).toString(), 'Cache-Control': 'no-store' } });

/**
 * Wspólne wejście formularzy: format, pochodzenie, limit prób, pole-pułapka. Zwraca dane formularza albo gotową
 * odpowiedź. Wypełniona pułapka udaje sukces, żeby bot nie dostał sygnału, że go odrzucono.
 */
async function przyjmij(zadanie, env, rodzaj) {
  const strony = STRONY[rodzaj];
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)/.test(zadanie.headers.get('Content-Type') ?? '')) {
    return { odpowiedz: new Response('Nieobsługiwany format formularza.', { status: 415, headers: { 'Cache-Control': 'no-store' } }) };
  }
  const pochodzenie = zadanie.headers.get('Origin');
  if (pochodzenie && pochodzenie !== new URL(zadanie.url).origin) {
    return { odpowiedz: new Response('Formularz wysłany z innej strony.', { status: 403, headers: { 'Cache-Control': 'no-store' } }) };
  }
  if (env.LIMIT_FORMULARZY) {
    const ip = zadanie.headers.get('CF-Connecting-IP') ?? 'nieznany';
    const { success } = await env.LIMIT_FORMULARZY.limit({ key: `${rodzaj}:${ip}` });
    if (!success) return { odpowiedz: przekieruj(zadanie, strony.blad) };
  }
  let dane;
  try {
    dane = await zadanie.formData();
  } catch {
    return { odpowiedz: przekieruj(zadanie, strony.blad) };
  }
  if (String(dane.get('strona') ?? '').trim()) return { odpowiedz: przekieruj(zadanie, strony.ok) };
  return { dane };
}

const pole = (dane, nazwa, max) => String(dane.get(nazwa) ?? '').trim().slice(0, max);

/** POST /api/newsletter: zapis z podwójnym potwierdzeniem (Brevo wysyła wiadomość z linkiem potwierdzającym). */
export async function zapisNaNewsletter(zadanie, env) {
  const { dane, odpowiedz } = await przyjmij(zadanie, env, 'newsletter');
  if (odpowiedz) return odpowiedz;
  const email = pole(dane, 'email', 300);
  if (!poprawnyEmail(email) || dane.get('zgoda') !== 'tak') return przekieruj(zadanie, STRONY.newsletter.blad);
  if (!env.BREVO_API_KEY || !Number(env.BREVO_LISTA) || !Number(env.BREVO_SZABLON_DOI)) {
    console.error('newsletter: brak konfiguracji Brevo (BREVO_API_KEY, BREVO_LISTA, BREVO_SZABLON_DOI)');
    return przekieruj(zadanie, STRONY.newsletter.blad);
  }
  try {
    const odp = await fetch(BREVO_DOI, {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email,
        includeListIds: [Number(env.BREVO_LISTA)],
        templateId: Number(env.BREVO_SZABLON_DOI),
        redirectionUrl: new URL('/newsletter/potwierdzono', zadanie.url).toString(),
      }),
      signal: AbortSignal.timeout(LIMIT_CZASU_MS),
    });
    if (!odp.ok) {
      // Bez adresu e-mail w logach: tylko kod odpowiedzi dostawcy.
      console.error(`newsletter: Brevo odpowiedział HTTP ${odp.status}`);
      return przekieruj(zadanie, STRONY.newsletter.blad);
    }
  } catch (e) {
    console.error(`newsletter: Brevo niedostępny (${e?.name ?? 'błąd'})`);
    return przekieruj(zadanie, STRONY.newsletter.blad);
  }
  return przekieruj(zadanie, STRONY.newsletter.ok);
}

const base64 = (tekst) => {
  const bajty = new TextEncoder().encode(tekst);
  let binarny = '';
  for (const b of bajty) binarny += String.fromCharCode(b);
  return btoa(binarny);
};
const zawin = (tekst, szerokosc = 76) => tekst.match(new RegExp(`.{1,${szerokosc}}`, 'g'))?.join('\r\n') ?? '';
/** Nagłówek z polskimi znakami (RFC 2047). */
const naglowekUtf8 = (tekst) => `=?UTF-8?B?${base64(tekst)}?=`;

/**
 * Wiadomość z formularza kontaktowego w formacie MIME (tekst UTF-8 w base64). Odpowiedź z poczty trafia do nadawcy
 * formularza (Reply-To). Adresy w nagłówkach przeszły poprawnyEmail(), temat pochodzi z zamkniętej listy.
 */
export function wiadomoscKontaktowa({ nadawca, adresat, imie, email, temat, tresc, data, id }) {
  const kiedy = data.toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw', dateStyle: 'long', timeStyle: 'short' });
  const tekst = [
    'Wiadomość z formularza kontaktowego rytmhali.pl',
    '',
    `Temat: ${temat}`,
    `Imię i nazwisko: ${imie || 'nie podano'}`,
    `E-mail: ${email}`,
    `Wysłano: ${kiedy}`,
    '',
    tresc,
    '',
    '--',
    'Odpowiedz na tę wiadomość, a odpowiedź trafi do nadawcy formularza.',
  ].join('\r\n');
  return [
    `From: ${naglowekUtf8('Formularz Rytmu Hali')} <${nadawca}>`,
    `To: <${adresat}>`,
    `Reply-To: <${email}>`,
    `Subject: ${naglowekUtf8(`[Rytm Hali] ${temat}`)}`,
    `Date: ${data.toUTCString().replace('GMT', '+0000')}`,
    `Message-ID: <${id}@rytmhali.pl>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    zawin(base64(tekst)),
    '',
  ].join('\r\n');
}

/**
 * POST /api/kontakt: wiadomość do redakcji przez Email Routing (wiązanie send_email „POCZTA”).
 * @param {{ EmailMessage?: new (from: string, to: string, raw: string) => unknown }} [zaleznosci] klasa wiadomości
 *   (w workerze z modułu „cloudflare:email”; w testach podstawiona)
 */
export async function kontakt(zadanie, env, zaleznosci = {}) {
  const { dane, odpowiedz } = await przyjmij(zadanie, env, 'kontakt');
  if (odpowiedz) return odpowiedz;
  const email = pole(dane, 'email', 300);
  const tresc = pole(dane, 'wiadomosc', 5000);
  const temat = TEMATY_KONTAKTU.includes(pole(dane, 'temat', 80)) ? pole(dane, 'temat', 80) : 'Inne';
  const imie = pole(dane, 'imie', 100).replace(/[\r\n]+/g, ' ');
  if (!poprawnyEmail(email) || tresc.length < 10 || dane.get('zgoda') !== 'tak') return przekieruj(zadanie, STRONY.kontakt.blad);
  if (!env.POCZTA || !env.ADRES_REDAKCJI) {
    console.error('kontakt: brak konfiguracji poczty (wiązanie POCZTA, zmienna ADRES_REDAKCJI)');
    return przekieruj(zadanie, STRONY.kontakt.blad);
  }
  try {
    const EmailMessage = zaleznosci.EmailMessage ?? (await import('cloudflare:email')).EmailMessage;
    const nadawca = env.NADAWCA_FORMULARZA ?? NADAWCA_DOMYSLNY;
    const surowa = wiadomoscKontaktowa({ nadawca, adresat: env.ADRES_REDAKCJI, imie, email, temat, tresc, data: new Date(), id: crypto.randomUUID() });
    await env.POCZTA.send(new EmailMessage(nadawca, env.ADRES_REDAKCJI, surowa));
  } catch (e) {
    console.error(`kontakt: wysyłka nie powiodła się (${e?.name ?? 'błąd'})`);
    return przekieruj(zadanie, STRONY.kontakt.blad);
  }
  return przekieruj(zadanie, STRONY.kontakt.ok);
}
