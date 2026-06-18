import { describe, expect, it } from 'vitest';
import { channelFieldDefaults, type Channel } from '../models/codeplug.ts';
import { channelHasLocation, channelOptionLabel, filterChannelOptions } from './channelLookup.ts';

function makeChannel(overrides: Partial<Channel> & Pick<Channel, 'id' | 'name'>): Channel {
  return {
    ...channelFieldDefaults(),
    callsign: '',
    mode: 'digital',
    ...overrides,
  };
}

describe('channelLookup', () => {
  it('labels channel with callsign when different from name', () => {
    const ch = makeChannel({ id: '1', name: 'NoLoc Rpt', callsign: 'GB0NL' });
    expect(channelOptionLabel(ch)).toBe('NoLoc Rpt (GB0NL)');
  });

  it('filters channels by name or callsign', () => {
    const channels = [
      makeChannel({ id: '1', name: 'GB3HI', callsign: 'GB3HI' }),
      makeChannel({ id: '2', name: 'Other', callsign: 'GB0XX' }),
    ];
    expect(filterChannelOptions(channels, 'gb3')).toEqual([
      { value: '1', label: 'GB3HI' },
    ]);
  });

  it('detects channels without usable coordinates', () => {
    const withLoc = makeChannel({
      id: '1',
      name: 'A',
      location: { lat: 55.86, lon: -4.25 },
    });
    const withoutLoc = makeChannel({ id: '2', name: 'B', location: null });
    const zeroLoc = makeChannel({ id: '3', name: 'C', location: { lat: 0, lon: 0 } });

    expect(channelHasLocation(withLoc)).toBe(true);
    expect(channelHasLocation(withoutLoc)).toBe(false);
    expect(channelHasLocation(zeroLoc)).toBe(false);
  });
});
