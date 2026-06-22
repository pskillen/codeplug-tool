import { describe, expect, it } from 'vitest';
import { formatSquelchListCell, percentLabel } from './percent.ts';

describe('formatSquelchListCell', () => {
  it('labels open squelch distinctly from radio default', () => {
    expect(formatSquelchListCell(0)).toBe('Open (0%)');
    expect(formatSquelchListCell(null)).toBe(percentLabel(null));
    expect(formatSquelchListCell(50)).toBe('50%');
  });
});
