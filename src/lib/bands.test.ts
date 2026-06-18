import { describe, expect, it } from 'vitest';
import {
  bandFromChannel,
  bandFromFrequencyMhz,
  formatOffsetMhz,
  frequencyOffsetMhz,
} from './bands.ts';

describe('bands', () => {
  it('classifies 2m and 70cm', () => {
    expect(bandFromFrequencyMhz(145.775)?.id).toBe('2m');
    expect(bandFromFrequencyMhz(433.6125)?.id).toBe('70cm');
  });

  it('uses RX then TX', () => {
    expect(bandFromChannel('', '145.775')?.id).toBe('2m');
  });

  it('formats offset', () => {
    expect(frequencyOffsetMhz('145.775', '145.775')).toBe(0);
    expect(formatOffsetMhz(-0.6)).toBe('-0.6 MHz');
  });
});
