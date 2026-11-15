import { it } from 'vitest';
import fs from 'node:fs';
import { wypowiedzenieZastepstwa } from '../src/lib/narzedzia/umowa-zastepstwo';
it('z', () => {
  const c = JSON.parse(fs.readFileSync('/tmp/claude-0/linki-zrzuty/py/cases.json', 'utf8'));
  const out = c.map(([p, d, k]) => { try { const r = wypowiedzenieZastepstwa(p, d, k); return { ...r, okres: r.okres.opis }; } catch (e) { return { err: String(e) }; } });
  fs.writeFileSync('/tmp/claude-0/linki-zrzuty/py/ts.json', JSON.stringify(out));
});
