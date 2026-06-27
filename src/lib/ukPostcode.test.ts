import { describe, expect, it } from 'vitest';
import { looksLikeTownName, looksLikeUkPostcode } from './ukPostcode.ts';

describe('looksLikeUkPostcode', () => {
  it('matches common postcodes with space', () => {
    expect(looksLikeUkPostcode('DE1 1AA')).toBe(true);
    expect(looksLikeUkPostcode('SW1A 1AA')).toBe(true);
    expect(looksLikeUkPostcode('M1 1AE')).toBe(true);
    expect(looksLikeUkPostcode('B33 8TH')).toBe(true);
  });

  it('matches compact postcodes without space', () => {
    expect(looksLikeUkPostcode('DE11AA')).toBe(true);
    expect(looksLikeUkPostcode('SW1A1AA')).toBe(true);
  });

  it('rejects repeater callsigns', () => {
    expect(looksLikeUkPostcode('GB7DC')).toBe(false);
    expect(looksLikeUkPostcode('G7NPW')).toBe(false);
  });

  it('rejects town names', () => {
    expect(looksLikeUkPostcode('Derby')).toBe(false);
  });
});

describe('looksLikeTownName', () => {
  it('matches plain town names', () => {
    expect(looksLikeTownName('Derby')).toBe(true);
    expect(looksLikeTownName("St Albans")).toBe(true);
    expect(looksLikeTownName("King's Lynn")).toBe(true);
  });

  it('rejects addresses with digits', () => {
    expect(looksLikeTownName('10 High Street')).toBe(false);
    expect(looksLikeTownName('DE1 1AA')).toBe(false);
  });
});
