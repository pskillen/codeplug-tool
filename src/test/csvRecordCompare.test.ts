import { describe, expect, it } from 'vitest';
import { compareCsvRecords } from './csvRecordCompare.ts';

describe('compareCsvRecords', () => {
  const header = 'Location,Name,Frequency\n';

  it('matches identical named rows regardless of order', () => {
    const original = `${header}1,Alpha,145.5\n2,Beta,433.5`;
    const exported = `${header}2,Beta,433.5\n1,Alpha,145.5`;
    expect(compareCsvRecords(original, exported).ok).toBe(true);
  });

  it('ignores Location when excluded', () => {
    const original = `${header}10,Alpha,145.5`;
    const exported = `${header}1,Alpha,145.5`;
    expect(compareCsvRecords(original, exported, { excludeColumns: ['Location'] }).ok).toBe(true);
  });

  it('treats duplicate names as separate multiset rows', () => {
    const original = `${header}1,Alpha,145.5\n2,Alpha,433.5`;
    const exported = `${header}3,Alpha,433.5\n4,Alpha,145.5`;
    expect(compareCsvRecords(original, exported, { excludeColumns: ['Location'] }).ok).toBe(true);
  });

  it('reports field diffs when one row differs', () => {
    const original = `${header}1,Alpha,145.5`;
    const exported = `${header}1,Alpha,145.6`;
    const result = compareCsvRecords(original, exported, { excludeColumns: ['Location'] });
    expect(result.ok).toBe(false);
    expect(result.missingInExport).toHaveLength(1);
    expect(result.missingInOriginal).toHaveLength(1);
  });
});
