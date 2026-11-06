import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import worker, { zakres } from './index.js';

const ENV = { GITHUB_CLIENT_ID: 'id-aplikacji', GITHUB_CLIENT_SECRET: 'sekret-testowy', ASSETS: { fetch: vi.fn(async () => new Response('plik')) } };
const ADRES = 'https://rytmhali.pl';
const zadanie = (sciezka, naglowki = {}) => new Request(ADRES + sciezka, { headers: naglowki });
const stan = (odpowiedz) => odpowiedz.headers.get('Set-Cookie').match(/__Host-rh-oauth=([0-9a-f]*)/)[1];
const skrypt = (html) => html.match(/<script>([\s\S]*)<\/script>/)[1];

afterEach(() => vi.unstubAllGlobals());

describe('logowanie do panelu: krok 1 (/api/auth)', () => {
  it('przekierowuje do GitHuba z losowym stanem w ciasteczku __Host-, ważnym 10 minut', async () => {
    const odp = await worker.fetch(zadanie('/api/auth?provider=github&site_id=rytmhali.pl&scope=repo'), ENV);
    expect(odp.status).toBe(302);
    const cel = new URL(odp.headers.get('Location'));
    expect(cel.origin + cel.pathname).toBe('https://github.com/login/oauth/authorize');
    expect(cel.searchParams.get('client_id')).toBe('id-aplikacji');
    expect(cel.searchParams.get('redirect_uri')).toBe(`${ADRES}/api/auth/callback`);
    expect(cel.searchParams.get('scope')).toBe('repo');
    expect(cel.searchParams.get('state')).toBe(stan(odp));
    expect(stan(odp)).toMatch(/^[0-9a-f]{32}$/);
    expect(odp.headers.get('Set-Cookie')).toMatch(/HttpOnly; Secure; Path=\/; SameSite=Lax; Max-Age=600/);
    // Sekret nigdy nie opuszcza workera.
    expect(odp.headers.get('Location')).not.toContain('sekret-testowy');
  });

  it('każde logowanie ma inny stan', async () => {
    const a = await worker.fetch(zadanie('/api/auth?provider=github'), ENV);
    const b = await worker.fetch(zadanie('/api/auth?provider=github'), ENV);
    expect(stan(a)).not.toBe(stan(b));
  });

  it('zakres tylko z listy dozwolonych; szerszy albo nieznany daje domyślne „repo”', () => {
    expect(zakres('public_repo,read:user')).toBe('public_repo,read:user');
    expect(zakres('repo user')).toBe('repo');
    expect(zakres('repo,workflow')).toBe('repo');
    expect(zakres(undefined)).toBe('repo');
  });

  it('inny dostawca albo brak konfiguracji: strona z błędem zamiast przekierowania', async () => {
    const gitlab = await worker.fetch(zadanie('/api/auth?provider=gitlab'), ENV);
    expect(gitlab.status).toBe(200);
    expect(await gitlab.text()).toContain('UNSUPPORTED_BACKEND');
    const bezSekretow = await worker.fetch(zadanie('/api/auth?provider=github'), { ASSETS: ENV.ASSETS });
    expect(await bezSekretow.text()).toContain('MISCONFIGURED_CLIENT');
  });
});

describe('logowanie do panelu: krok 2 (/api/auth/callback)', () => {
  const ciastko = (wartosc) => ({ Cookie: `inne=1; __Host-rh-oauth=${wartosc}` });
  const STAN = 'a'.repeat(32);

  it('niezgodny albo brakujący stan: błąd CSRF, bez wymiany kodu na token', async () => {
    const fetchGithub = vi.fn();
    vi.stubGlobal('fetch', fetchGithub);
    const zly = await worker.fetch(zadanie(`/api/auth/callback?code=k&state=${STAN}`, ciastko('b'.repeat(32))), ENV);
    expect(await zly.text()).toContain('CSRF_DETECTED');
    const bezCiastka = await worker.fetch(zadanie(`/api/auth/callback?code=k&state=${STAN}`), ENV);
    expect(await bezCiastka.text()).toContain('CSRF_DETECTED');
    expect(fetchGithub).not.toHaveBeenCalled();
  });

  it('wymienia kod na token i przekazuje go tylko oknu panelu z tej samej domeny', async () => {
    const fetchGithub = vi.fn(async () => Response.json({ access_token: 'gho_testowy', token_type: 'bearer' }));
    vi.stubGlobal('fetch', fetchGithub);
    const odp = await worker.fetch(zadanie(`/api/auth/callback?code=kod-z-githuba&state=${STAN}`, ciastko(STAN)), ENV);
    const [adres, opcje] = fetchGithub.mock.calls[0];
    expect(adres).toBe('https://github.com/login/oauth/access_token');
    expect(JSON.parse(opcje.body)).toEqual({ client_id: 'id-aplikacji', client_secret: 'sekret-testowy', code: 'kod-z-githuba', redirect_uri: `${ADRES}/api/auth/callback` });

    const html = await odp.text();
    expect(html).toContain('authorization:github:success:{\\"provider\\":\\"github\\",\\"token\\":\\"gho_testowy\\"}');
    expect(html).toContain("origin !== window.location.origin");
    expect(html).not.toMatch(/postMessage\([^)]*'\*'/);
    // Ciasteczko stanu skasowane, strona bez pamięci podręcznej i bez odsyłacza.
    expect(odp.headers.get('Set-Cookie')).toMatch(/__Host-rh-oauth=; .*Max-Age=0/);
    expect(odp.headers.get('Cache-Control')).toBe('no-store');
    expect(odp.headers.get('Referrer-Policy')).toBe('no-referrer');
  });

  it('CSP strony zwrotnej dopuszcza wyłącznie jej własny skrypt (hash SHA-256)', async () => {
    vi.stubGlobal('fetch', async () => Response.json({ access_token: 'gho_testowy' }));
    const odp = await worker.fetch(zadanie(`/api/auth/callback?code=k&state=${STAN}`, ciastko(STAN)), ENV);
    const hash = createHash('sha256').update(skrypt(await odp.text())).digest('base64');
    expect(odp.headers.get('Content-Security-Policy')).toBe(`default-src 'none'; script-src 'sha256-${hash}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
  });

  it('token ze znakami specjalnymi nie wychodzi poza skrypt', async () => {
    vi.stubGlobal('fetch', async () => Response.json({ access_token: '</script><b>x' }));
    const html = await (await worker.fetch(zadanie(`/api/auth/callback?code=k&state=${STAN}`, ciastko(STAN)), ENV)).text();
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });

  it('błąd GitHuba trafia do panelu jako błąd z kodem', async () => {
    vi.stubGlobal('fetch', async () => Response.json({ error: 'bad_verification_code', error_description: 'The code passed is incorrect or expired.' }));
    const html = await (await worker.fetch(zadanie(`/api/auth/callback?code=k&state=${STAN}`, ciastko(STAN)), ENV)).text();
    expect(html).toContain('authorization:github:error:');
    expect(html).toContain('TOKEN_REQUEST_FAILED');
  });
});

describe('pozostałe adresy', () => {
  it('nieznany punkt /api/* to 404 JSON; reszta idzie do plików statycznych', async () => {
    const api = await worker.fetch(zadanie('/api/nie-ma'), ENV);
    expect(api.status).toBe(404);
    expect(api.headers.get('Content-Type')).toContain('application/json');
    await worker.fetch(zadanie('/o-nas'), ENV);
    expect(ENV.ASSETS.fetch).toHaveBeenCalled();
  });
});

describe('adres powrotu', () => {
  it('zawsze https, nawet gdy żądanie przyszło po http', async () => {
    const odp = await worker.fetch(new Request('http://rytmhali.pl/api/auth?provider=github'), ENV);
    expect(new URL(odp.headers.get('Location')).searchParams.get('redirect_uri')).toBe('https://rytmhali.pl/api/auth/callback');
  });
});
