import type { Channel } from '../../../models/codeplug.ts';
import type { BrandMeisterDevice } from './types.ts';
import { mhzStringToHz } from './types.ts';

export function matchDeviceForChannel(
  channel: Channel,
  devices: BrandMeisterDevice[],
): BrandMeisterDevice | null {
  if (devices.length === 0) return null;

  const remoteId = channel.meta?.repeaterDirectory?.remoteListingId;
  if (remoteId != null && channel.meta?.repeaterDirectory?.sourceId === 'brandmeister') {
    const byId = devices.find((d) => d.id === remoteId);
    if (byId) return byId;
  }

  const callsign = channel.callsign.trim().toLowerCase();
  if (callsign) {
    const byCall = devices.filter((d) => d.callsign.trim().toLowerCase() === callsign);
    if (byCall.length === 1) return byCall[0];
    if (byCall.length > 1 && channel.rxFrequency != null) {
      const match = byCall.find((d) => mhzStringToHz(d.tx) === channel.rxFrequency);
      if (match) return match;
    }
    if (byCall.length > 0) return byCall[0];
  }

  if (devices.length === 1) return devices[0];
  return null;
}
