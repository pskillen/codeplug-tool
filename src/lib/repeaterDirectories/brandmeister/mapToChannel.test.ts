import { describe, expect, it } from 'vitest';
import { mapDeviceToChannelInput, isMapDeviceSkip } from './mapToChannel.ts';

const SAMPLE_DEVICE = {
  id: 235226,
  callsign: 'GB7HH',
  tx: '439.7500',
  rx: '430.7500',
  colorcode: 3,
  city: 'Romford',
  description: 'Covers East London',
  statusText: 'Both Slots Linked',
  lat: 51.565,
  lng: 0.1843,
};

describe('mapDeviceToChannelInput', () => {
  it('maps DMR repeater with inverted frequencies', () => {
    const result = mapDeviceToChannelInput(SAMPLE_DEVICE);
    expect(isMapDeviceSkip(result)).toBe(false);
    if (isMapDeviceSkip(result)) return;

    expect(result.input.mode).toBe('dmr');
    expect(result.input.callsign).toBe('GB7HH');
    expect(result.input.name).toBe('Romford');
    expect(result.input.rxFrequency).toBe(439_750_000);
    expect(result.input.txFrequency).toBe(430_750_000);
    expect(result.input.colourCode).toBe(3);
    expect(result.input.location).toEqual({ lat: 51.565, lon: 0.1843 });
    expect(result.meta.repeaterDirectory?.sourceId).toBe('brandmeister');
    expect(result.meta.repeaterDirectory?.remoteListingId).toBe(235226);
  });

  it('skips devices without frequencies', () => {
    const result = mapDeviceToChannelInput({ id: 1, callsign: 'TEST' });
    expect(isMapDeviceSkip(result)).toBe(true);
    if (!isMapDeviceSkip(result)) return;
    expect(result.reason).toContain('frequency');
  });
});
