import { describe, expect, it } from 'vitest';
import { formatDm32SquelchWire } from './channelWire.ts';
import { DEFAULT_DM32_PROFILE_ID } from '../../dm32/profiles.ts';

describe('import/dm32/channelWire formatDm32SquelchWire', () => {
  it('exports radio default as level 1 on analog rows', () => {
    expect(formatDm32SquelchWire(null, DEFAULT_DM32_PROFILE_ID, { isAnalog: true })).toBe('1');
  });

  it('exports radio default as level 0 on digital rows', () => {
    expect(formatDm32SquelchWire(null, DEFAULT_DM32_PROFILE_ID, { isAnalog: false })).toBe('0');
  });

  it('maps explicit percent via squelch ladder', () => {
    expect(formatDm32SquelchWire(56, DEFAULT_DM32_PROFILE_ID, { isAnalog: true })).toBe('5');
  });
});
