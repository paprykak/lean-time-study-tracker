import { describe, expect, it } from 'vitest';
import { dataDluga, datetime } from './daty';

describe('daty po polsku w strefie Europe/Warsaw', () => {
  it('formatuje datę długą', () => {
    expect(dataDluga(new Date('2026-11-06T09:30:00Z'))).toBe('6 listopada 2026');
  });

  it('dzień kalendarzowy liczy się w Polsce: 23:30 UTC 5 listopada to już 6 listopada', () => {
    expect(dataDluga(new Date('2026-11-05T23:30:00Z'))).toBe('6 listopada 2026');
  });

  it('datetime w ISO 8601', () => {
    expect(datetime(new Date('2026-11-06T09:30:00Z'))).toBe('2026-11-06T09:30:00.000Z');
  });
});
