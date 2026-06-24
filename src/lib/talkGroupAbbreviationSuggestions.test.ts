import { describe, expect, it } from 'vitest';
import { talkGroupAbbreviationSuggestions } from './talkGroupAbbreviationSuggestions.ts';

describe('talkGroupAbbreviationSuggestions', () => {
  it('returns empty for blank name', () => {
    expect(talkGroupAbbreviationSuggestions('')).toEqual([]);
    expect(talkGroupAbbreviationSuggestions('   ')).toEqual([]);
  });

  it('returns 6, 8, 10 and 12 char targets', () => {
    const suggestions = talkGroupAbbreviationSuggestions('Scotland TS1');
    expect(suggestions).toHaveLength(4);
    expect(suggestions.map((s) => s.maxLen)).toEqual([6, 8, 10, 12]);
    for (const { maxLen, text } of suggestions) {
      expect(text.length).toBeLessThanOrEqual(maxLen);
    }
  });
});
