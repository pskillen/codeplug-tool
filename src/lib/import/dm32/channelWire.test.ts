import { describe, expect, it } from 'vitest';
import {
  formatDm32SquelchWire,
  formatDm32TxAdmitWire,
  parseDm32TxAdmitWire,
} from './channelWire.ts';
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

describe('import/dm32/channelWire TX Admit', () => {
  it('parses and formats DM-32 wire labels', () => {
    expect(parseDm32TxAdmitWire('Channel Idle')).toBe('channel_idle');
    expect(parseDm32TxAdmitWire('Allow TX')).toBe('allow_tx');
    expect(formatDm32TxAdmitWire('channel_idle')).toBe('Channel Idle');
    expect(formatDm32TxAdmitWire('allow_tx')).toBe('Allow TX');
  });
});
