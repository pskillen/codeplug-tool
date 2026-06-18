import { describe, expect, it } from 'vitest';
import { formatCsv, escapeCsvField } from './csvWrite.ts';

describe('csvWrite', () => {
  it('quotes fields with commas', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"');
    expect(formatCsv(['Name'], [['Hello, world']])).toBe('Name\n"Hello, world"\n');
  });
});
