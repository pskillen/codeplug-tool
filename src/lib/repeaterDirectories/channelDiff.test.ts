import { describe, expect, it } from 'vitest';
import { buildChannel } from '../../test/builders/codeplug.ts';
import { diffChannelFromListing, buildPatchFromDiff, diffHasChanges } from './channelDiff.ts';
import type { EtccListing } from './ukrepeater/types.ts';

const LISTING: EtccListing = {
  id: 4763,
  status: 'OPERATIONAL',
  town: 'DERBY',
  modeCodes: ['A', 'M:1'],
  tx: 439350000,
  rx: 430350000,
  repeater: 'GB7DC',
  ctcss: 71.9,
  txbw: 12.5,
  band: '70CM',
  locator: 'IO92',
};

describe('diffChannelFromListing', () => {
  it('detects frequency drift', () => {
    const channel = buildChannel({
      id: 'c1',
      name: 'GB7DC',
      rxFrequency: 430000000,
      txFrequency: 430350000,
      mode: 'fm',
    });
    const rows = diffChannelFromListing(channel, LISTING);
    const rxRow = rows.find((r) => r.field === 'rxFrequency');
    expect(rxRow?.changed).toBe(true);
    expect(diffHasChanges(rows)).toBe(true);
  });

  it('builds patch for selected fields', () => {
    const channel = buildChannel({
      id: 'c1',
      name: 'GB7DC',
      rxFrequency: 430000000,
      txFrequency: 430350000,
      mode: 'fm',
    });
    const patch = buildPatchFromDiff(channel, LISTING, ['rxFrequency', 'txFrequency']);
    expect(patch.rxFrequency).toBe(439350000);
    expect(patch.txFrequency).toBe(430350000);
    expect(patch.name).toBeUndefined();
  });
});
