import { describe, expect, it } from 'vitest';
import { buildChannel } from '../../../test/builders/codeplug.ts';
import { diffChannelFromDevice, diffHasChanges } from './channelDiff.ts';

const DEVICE = {
  id: 235226,
  callsign: 'GB7HH',
  tx: '439.7500',
  rx: '430.7500',
  colorcode: 3,
  city: 'Romford',
};

describe('brandmeister channelDiff', () => {
  it('reports no changes when channel matches device', () => {
    const channel = buildChannel({
      id: 'c1',
      mode: 'dmr',
      callsign: 'GB7HH',
      name: 'Romford',
      rxFrequency: 439_750_000,
      txFrequency: 430_750_000,
      colourCode: 3,
    });
    const rows = diffChannelFromDevice(channel, DEVICE);
    expect(diffHasChanges(rows)).toBe(false);
  });

  it('detects frequency drift', () => {
    const channel = buildChannel({
      id: 'c1',
      mode: 'dmr',
      callsign: 'GB7HH',
      rxFrequency: 430_000_000,
      txFrequency: 430_750_000,
      colourCode: 3,
    });
    const rows = diffChannelFromDevice(channel, DEVICE);
    expect(diffHasChanges(rows)).toBe(true);
  });
});
