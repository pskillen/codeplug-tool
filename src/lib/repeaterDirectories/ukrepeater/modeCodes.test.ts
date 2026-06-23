import { describe, expect, it } from 'vitest';
import { parseModeCodes, isOperationalStatus } from './modeCodes.ts';

describe('parseModeCodes', () => {
  it('parses analogue only', () => {
    expect(parseModeCodes(['A'])).toMatchObject({
      hasAnalog: true,
      hasDmr: false,
      phase1Supported: true,
    });
  });

  it('parses DMR with colour code', () => {
    expect(parseModeCodes(['M:1'])).toMatchObject({
      hasDmr: true,
      colourCode: 1,
      phase1Supported: true,
    });
  });

  it('parses multi-mode GB7DC style listing', () => {
    const parsed = parseModeCodes(['A', 'D', 'M:1', 'F', 'P', 'N']);
    expect(parsed.hasAnalog).toBe(true);
    expect(parsed.hasDmr).toBe(true);
    expect(parsed.colourCode).toBe(1);
    expect(parsed.unsupportedFlags.length).toBeGreaterThan(0);
  });

  it('marks D-STAR-only as unsupported in phase 1', () => {
    expect(parseModeCodes(['D']).phase1Supported).toBe(false);
  });
});

describe('isOperationalStatus', () => {
  it('matches OPERATIONAL case-insensitively', () => {
    expect(isOperationalStatus('OPERATIONAL')).toBe(true);
    expect(isOperationalStatus('operational')).toBe(true);
    expect(isOperationalStatus('NOT OPERATIONAL')).toBe(false);
  });
});
