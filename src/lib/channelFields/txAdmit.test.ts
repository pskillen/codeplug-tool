import { describe, expect, it } from 'vitest';
import { normalizeTxAdmit } from './txAdmit.ts';

describe('channelFields/txAdmit', () => {
  it('normalizes DM-32 wire labels', () => {
    expect(normalizeTxAdmit('Channel Idle')).toBe('channel_idle');
    expect(normalizeTxAdmit('Allow TX')).toBe('allow_tx');
  });

  it('passes through enum values', () => {
    expect(normalizeTxAdmit('channel_idle')).toBe('channel_idle');
    expect(normalizeTxAdmit('allow_tx')).toBe('allow_tx');
  });

  it('defaults unknown values to channel_idle', () => {
    expect(normalizeTxAdmit('Always')).toBe('channel_idle');
    expect(normalizeTxAdmit(null)).toBe('channel_idle');
  });
});
