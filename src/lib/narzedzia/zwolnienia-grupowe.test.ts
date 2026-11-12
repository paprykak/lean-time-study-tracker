import { describe, expect, it } from 'vitest';
import { progGrupowego, terminyPowrotu, terminyUrzedu, zwolnienieGrupowe } from './zwolnienia-grupowe';

describe('próg grupowego zwolnienia (art. 1 ust. 1)', () => {
  it('20–99 zatrudnionych: 10 osób; 100–299: 10%, w górę; od 300: 30 osób; poniżej 20: ustawa nie dotyczy', () => {
    expect([19, 20, 99, 100, 155, 299, 300, 5000].map(progGrupowego)).toEqual([null, 10, 10, 10, 16, 30, 30, 30]);
  });
});

describe('czy zwolnienie jest grupowe', () => {
  it('porozumienia liczą się od 5 osób (art. 1 ust. 2)', () => {
    expect(zwolnienieGrupowe({ zatrudnionych: 80, wypowiedzen: 6, porozumien: 4 })).toMatchObject({ liczone: 6, porozumieniaLiczone: 0, rodzaj: 'indywidualne', brakuje: 4 });
    expect(zwolnienieGrupowe({ zatrudnionych: 80, wypowiedzen: 6, porozumien: 5 })).toMatchObject({ liczone: 11, rodzaj: 'grupowe', brakuje: 0 });
  });
  it('150 zatrudnionych: 15 to grupowe, 14 nie', () => {
    expect(zwolnienieGrupowe({ zatrudnionych: 150, wypowiedzen: 15, porozumien: 0 }).rodzaj).toBe('grupowe');
    expect(zwolnienieGrupowe({ zatrudnionych: 150, wypowiedzen: 14, porozumien: 0 })).toMatchObject({ rodzaj: 'indywidualne', brakuje: 1 });
  });
  it('poniżej 20 zatrudnionych ustawa nie dotyczy', () => {
    expect(zwolnienieGrupowe({ zatrudnionych: 19, wypowiedzen: 12, porozumien: 0 })).toMatchObject({ prog: null, rodzaj: 'nie-dotyczy' });
  });
  it('błędne liczby', () => {
    expect(() => zwolnienieGrupowe({ zatrudnionych: 10, wypowiedzen: 11, porozumien: 0 })).toThrow(RangeError);
    expect(() => zwolnienieGrupowe({ zatrudnionych: 10.5, wypowiedzen: 1, porozumien: 0 })).toThrow(RangeError);
  });
});

describe('terminy (art. 6 ust. 2 i art. 9)', () => {
  it('zawiadomienie urzędu 1 marca 2027 r.: 30. dzień 31 marca, rozwiązanie najwcześniej 1 kwietnia', () => {
    expect(terminyUrzedu('2027-03-01')).toEqual({ trzydziesty: '2027-03-31', najwczesniejRozwiazanie: '2027-04-01' });
  });
  it('rozwiązanie 31 stycznia 2027 r.: zgłoszenie do 31 stycznia 2028 r., zatrudnienie do 30 kwietnia 2028 r.', () => {
    expect(terminyPowrotu('2027-01-31')).toEqual({ zgloszenieDo: '2028-01-31', zatrudnienieDo: '2028-04-30' });
  });
});
