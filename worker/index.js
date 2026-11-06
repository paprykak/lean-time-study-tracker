// Worker Rytmu Hali: punkty /api/* (reszta to pliki statyczne z dist/, które Cloudflare serwuje bez workera,
// patrz run_worker_first w wrangler.jsonc). Teraz: logowanie do panelu /admin przez GitHub (OAuth, przepływ z kodem
// autoryzacji), zapis na newsletter i formularz kontaktowy (F6, worker/formularze.js). Dalej: 410 dla usuniętych
// artykułów (F8).
//
// Logowanie to port protokołu Sveltia CMS Authenticator (https://github.com/sveltia/sveltia-cms-auth, licencja MIT,
// © 2026 Kohei Yoshino), ograniczony do GitHuba i zaostrzony:
// - token trafia wyłącznie do okna panelu z tej samej domeny co worker (event.origin === location.origin);
// - ciasteczko stanu z prefiksem __Host- (tylko HTTPS, tylko ta domena), ważne 10 minut, kasowane po powrocie;
// - strona zwrotna ma CSP z hashem jedynego skryptu, Cache-Control: no-store i Referrer-Policy: no-referrer;
// - zakres uprawnień tylko z listy dozwolonych (domyślnie „repo”).
// Sekrety (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET) ustawia Patryk: npx wrangler secret put <NAZWA> (STAN.md).

import { kontakt, zapisNaNewsletter } from './formularze.js';

const DOSTAWCA = 'github';
const CIASTKO = '__Host-rh-oauth';
const ZAKRES_DOMYSLNY = 'repo';
const ZAKRESY_DOZWOLONE = ['repo', 'public_repo', 'read:user', 'user:email'];
const SCIEZKA_LOGOWANIA = '/api/auth';
const SCIEZKA_POWROTU = '/api/auth/callback';

/** Zakres uprawnień tokenu: to, o co prosi panel (auth_scope), o ile mieści się w liście dozwolonych. */
export function zakres(zadany) {
  const zakresy = (zadany ?? '').split(/[\s,]+/).filter(Boolean);
  return zakresy.length && zakresy.every((z) => ZAKRESY_DOZWOLONE.includes(z)) ? zakresy.join(',') : ZAKRES_DOMYSLNY;
}

/** Wartość do wstawienia w <script>: JSON bez znaków, które mogłyby zamknąć skrypt albo złamać wiersz. */
const doSkryptu = (wartosc) => JSON.stringify(wartosc).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');

async function sha256Base64(tekst) {
  const skrot = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tekst));
  return btoa(String.fromCharCode(...new Uint8Array(skrot)));
}

/**
 * Strona zwrotna okna logowania: przekazuje wynik do panelu (window.opener) w formacie Sveltia/Decap CMS
 * „authorization:github:success|error:{json}”, tylko oknu z tej samej domeny.
 */
export async function stronaWyniku({ token, blad, kodBledu }) {
  const stan = token ? 'success' : 'error';
  const tresc = token ? { provider: DOSTAWCA, token } : { provider: DOSTAWCA, error: blad, errorCode: kodBledu };
  const wiadomosc = `authorization:${DOSTAWCA}:${stan}:${JSON.stringify(tresc)}`;
  const skrypt = `(() => {
  const wiadomosc = ${doSkryptu(wiadomosc)};
  window.addEventListener('message', ({ data, origin }) => {
    if (data !== 'authorizing:${DOSTAWCA}' || origin !== window.location.origin) return;
    window.opener?.postMessage(wiadomosc, window.location.origin);
  });
  window.opener?.postMessage('authorizing:${DOSTAWCA}', window.location.origin);
})();`;
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Logowanie do panelu Rytmu Hali</title></head><body><p>${
    token ? 'Zalogowano. To okno zamknie się samo.' : 'Logowanie nie powiodło się. Zamknij to okno i spróbuj ponownie.'
  }</p><script>${skrypt}</script></body></html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': `default-src 'none'; script-src 'sha256-${await sha256Base64(skrypt)}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      'Set-Cookie': `${CIASTKO}=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0`,
    },
  });
}

/** Krok 1: panel otwiera /api/auth?provider=github&scope=…; przekierowanie do GitHuba z losowym stanem. */
export async function logowanie(zadanie, env) {
  const url = new URL(zadanie.url);
  if (url.searchParams.get('provider') !== DOSTAWCA) {
    return stronaWyniku({ blad: 'Panel obsługuje tylko logowanie przez GitHub.', kodBledu: 'UNSUPPORTED_BACKEND' });
  }
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return stronaWyniku({ blad: 'Logowanie przez GitHub nie jest jeszcze skonfigurowane. Użyj logowania tokenem.', kodBledu: 'MISCONFIGURED_CLIENT' });
  }
  const stan = crypto.randomUUID().replaceAll('-', '');
  const parametry = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: adresPowrotu(url),
    scope: zakres(url.searchParams.get('scope')),
    state: stan,
    allow_signup: 'false',
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${parametry}`,
      'Cache-Control': 'no-store',
      // SameSite=Lax: ciasteczko wraca przy przekierowaniu z GitHuba (nawigacja najwyższego poziomu).
      'Set-Cookie': `${CIASTKO}=${stan}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600`,
    },
  });
}

/** Adres powrotu zawsze po HTTPS (wymaga tego GitHub i ciasteczko __Host-), także gdy żądanie przyszło po HTTP. */
const adresPowrotu = (url) => `https://${url.host}${SCIEZKA_POWROTU}`;

const zgodne = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let roznica = 0;
  for (let i = 0; i < a.length; i++) roznica |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return roznica === 0;
};

/** Krok 2: GitHub wraca z kodem; sprawdzenie stanu (CSRF), wymiana kodu na token, przekazanie tokenu panelowi. */
export async function powrot(zadanie, env) {
  const url = new URL(zadanie.url);
  const kod = url.searchParams.get('code');
  const stan = url.searchParams.get('state');
  const zapisany = zadanie.headers.get('Cookie')?.match(new RegExp(`(?:^|;\\s*)${CIASTKO}=([0-9a-f]{32})(?:;|$)`))?.[1];
  if (!kod || !stan) return stronaWyniku({ blad: 'GitHub nie przekazał kodu autoryzacji.', kodBledu: 'AUTH_CODE_REQUEST_FAILED' });
  if (!zgodne(stan, zapisany)) return stronaWyniku({ blad: 'Niezgodny stan logowania (możliwa próba CSRF). Zaloguj się ponownie.', kodBledu: 'CSRF_DETECTED' });
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return stronaWyniku({ blad: 'Logowanie przez GitHub nie jest jeszcze skonfigurowane.', kodBledu: 'MISCONFIGURED_CLIENT' });
  }
  let odpowiedz;
  try {
    odpowiedz = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'rytm-hali-panel' },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code: kod, redirect_uri: adresPowrotu(url) }),
    });
  } catch {
    return stronaWyniku({ blad: 'Nie udało się połączyć z GitHubem. Spróbuj za chwilę.', kodBledu: 'TOKEN_REQUEST_FAILED' });
  }
  let dane;
  try {
    dane = await odpowiedz.json();
  } catch {
    return stronaWyniku({ blad: 'GitHub zwrócił nieczytelną odpowiedź. Spróbuj za chwilę.', kodBledu: 'MALFORMED_RESPONSE' });
  }
  if (!dane?.access_token) return stronaWyniku({ blad: dane?.error_description ?? dane?.error ?? 'GitHub nie wydał tokenu.', kodBledu: 'TOKEN_REQUEST_FAILED' });
  return stronaWyniku({ token: dane.access_token });
}

export default {
  /**
   * @param {Request} zadanie
   * @param {{ ASSETS: { fetch: typeof fetch }, GITHUB_CLIENT_ID?: string, GITHUB_CLIENT_SECRET?: string }} env
   */
  async fetch(zadanie, env) {
    const { pathname } = new URL(zadanie.url);
    if (zadanie.method === 'GET' && pathname === SCIEZKA_LOGOWANIA) return logowanie(zadanie, env);
    if (zadanie.method === 'GET' && pathname === SCIEZKA_POWROTU) return powrot(zadanie, env);
    if (pathname === '/api/newsletter' || pathname === '/api/kontakt') {
      if (zadanie.method !== 'POST') return new Response('Ten adres przyjmuje tylko formularz (POST).', { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } });
      return pathname === '/api/newsletter' ? zapisNaNewsletter(zadanie, env) : kontakt(zadanie, env);
    }
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ blad: 'Nie ma takiego punktu API.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
    return env.ASSETS.fetch(zadanie);
  },
};
