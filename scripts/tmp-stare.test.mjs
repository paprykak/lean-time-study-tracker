import { it } from 'vitest';
import fs from 'node:fs';
import { podobne } from './tmp-podobne-stare';
import { NARZEDZIA } from '../src/data/narzedzia';
it('d', () => { const o = {}; for (const n of NARZEDZIA) o[n.slug] = podobne(n.slug, NARZEDZIA); fs.writeFileSync('/tmp/claude-0/linki-zrzuty/stare.json', JSON.stringify(o)); });
