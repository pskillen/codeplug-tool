import { describe, expect, it } from 'vitest';
import { extractCallsign, parseCsv } from './csv.ts';

describe('parseCsv', () => {
  it('parses quoted fields with commas', () => {
    expect(parseCsv('a,"b,c",d\n1,2,3')).toEqual([
      ['a', 'b,c', 'd'],
      ['1', '2', '3'],
    ]);
  });

  it('parses escaped double quotes', () => {
    expect(parseCsv('"a""b",c')).toEqual([['a"b', 'c']]);
  });
});

describe('extractCallsign', () => {
  it('returns first word of channel name', () => {
    expect(extractCallsign('GB3DA DMR')).toBe('GB3DA');
  });
});
