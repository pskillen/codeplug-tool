import type { Channel } from '../../../models/codeplug.ts';
import type { EtccListing } from './types.ts';

/** Pick the best ETCC listing for an existing channel. */
export function matchListingForChannel(
  channel: Channel,
  listings: EtccListing[],
): EtccListing | null {
  if (listings.length === 0) return null;

  const remoteId = channel.meta?.repeaterDirectory?.remoteListingId;
  if (remoteId != null) {
    const byId = listings.find((l) => l.id === remoteId);
    if (byId) return byId;
  }

  if (channel.rxFrequency != null && channel.txFrequency != null) {
    const byFreq = listings.find(
      (l) => l.tx === channel.rxFrequency && l.rx === channel.txFrequency,
    );
    if (byFreq) return byFreq;
  }

  const byCall = listings.find(
    (l) => l.repeater.toUpperCase() === channel.callsign.toUpperCase(),
  );
  if (byCall) return byCall;

  return listings.length === 1 ? listings[0] : null;
}
