import { describe, expect, it } from 'vitest';
import { mhzStringToHz, parseMhz, toDirectoryListing } from './types.ts';

describe('BrandMeister types', () => {
  it('mhzStringToHz converts MHz to integer Hz', () => {
    expect(mhzStringToHz('439.7500')).toBe(439_750_000);
    expect(mhzStringToHz('430.7500')).toBe(430_750_000);
  });

  it('parseMhz handles invalid values', () => {
    expect(parseMhz('')).toBeNull();
    expect(parseMhz('invalid')).toBeNull();
  });

  it('toDirectoryListing maps device fields', () => {
    const listing = toDirectoryListing({
      id: 235226,
      callsign: 'GB7HH',
      tx: '439.7500',
      rx: '430.7500',
      city: 'Romford',
      statusText: 'Linked',
    });
    expect(listing.sourceId).toBe('brandmeister');
    expect(listing.remoteListingId).toBe(235226);
    expect(listing.callsign).toBe('GB7HH');
    expect(listing.band).toBe('70CM');
    expect(listing.town).toBe('Romford');
  });
});
