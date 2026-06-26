import { describe, expect, it } from 'vitest';
import {
  isMapDeviceSkip,
  mapDeviceToChannelInput,
} from '../../lib/repeaterDirectories/registry.ts';
import type { BrandMeisterDevice } from '../../lib/repeaterDirectories/brandmeister/types.ts';

const GB7HH: BrandMeisterDevice = {
  id: 235226,
  callsign: 'GB7HH',
  tx: '439.7500',
  rx: '430.7500',
  colorcode: 3,
  city: 'Romford',
  description: 'Covers East London, West Essex and North Kent',
  statusText: 'Both Slots Linked',
  lat: 51.565,
  lng: 0.1843,
};

describe('brandmeister mapper system', () => {
  it('maps device to DMR channel input with provenance', () => {
    const mapped = mapDeviceToChannelInput(GB7HH);
    expect(isMapDeviceSkip(mapped)).toBe(false);
    if (isMapDeviceSkip(mapped)) return;

    expect(mapped.input.mode).toBe('dmr');
    expect(mapped.input.callsign).toBe('GB7HH');
    expect(mapped.input.rxFrequency).toBe(439_750_000);
    expect(mapped.input.txFrequency).toBe(430_750_000);
    expect(mapped.input.colourCode).toBe(3);
    expect(mapped.meta.repeaterDirectory?.sourceId).toBe('brandmeister');
    expect(mapped.meta.repeaterDirectory?.remoteListingId).toBe(235226);
  });
});
