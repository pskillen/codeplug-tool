import { describe, expect, it } from 'vitest';
import {
  hasDuplicateTargetRadios,
  normalizeTargetRadios,
  PROJECT_NAME_MAX,
  validateProjectMetadata,
} from './project.ts';

describe('validateProjectMetadata', () => {
  it('requires a non-empty name', () => {
    const issues = validateProjectMetadata({ name: '  ' });
    expect(issues.some((i) => i.field === 'name' && i.severity === 'error')).toBe(true);
  });

  it('accepts valid metadata', () => {
    expect(
      validateProjectMetadata({
        name: 'Home repeaters',
        description: 'DMR + 2 m',
        author: 'MM9PDY',
        notes: 'Trip notes',
        targetRadios: ['Baofeng 1701', 'DM-32UV'],
      }),
    ).toEqual([]);
  });

  it('rejects duplicate target radios case-insensitively', () => {
    const issues = validateProjectMetadata({
      name: 'Test',
      targetRadios: ['Baofeng 1701', 'baofeng 1701'],
    });
    expect(issues.some((i) => i.field === 'targetRadios')).toBe(true);
  });

  it('rejects name over max length', () => {
    const issues = validateProjectMetadata({ name: 'x'.repeat(PROJECT_NAME_MAX + 1) });
    expect(issues.some((i) => i.field === 'name')).toBe(true);
  });
});

describe('normalizeTargetRadios', () => {
  it('trims and drops empty strings', () => {
    expect(normalizeTargetRadios(['  A  ', '', 'B'])).toEqual(['A', 'B']);
  });
});

describe('hasDuplicateTargetRadios', () => {
  it('detects case-insensitive duplicates', () => {
    expect(hasDuplicateTargetRadios(['DM-32', 'dm-32'])).toBe(true);
    expect(hasDuplicateTargetRadios(['A', 'B'])).toBe(false);
  });
});
