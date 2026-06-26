import { formatFrequencyHz } from '../../formatFrequency.ts';
import type { Channel } from '../../../models/codeplug.ts';
import type { ChannelInput } from '../../codeplugMutations.ts';
import type { ChannelDiffField, ChannelDiffRow } from '../channelDiff.ts';
import { diffHasChanges } from '../channelDiff.ts';
import type { BrandMeisterDevice } from './types.ts';
import { deviceToSnapshot } from './types.ts';
import {
  isMapDeviceSkip,
  mapDeviceToChannelInput,
  type MapDeviceOptions,
} from './mapToChannel.ts';

export type { ChannelDiffField, ChannelDiffRow };
export { diffHasChanges };

const FIELD_LABELS: Record<ChannelDiffField, string> = {
  callsign: 'Callsign',
  name: 'Name',
  rxFrequency: 'RX frequency',
  txFrequency: 'TX frequency',
  rxTone: 'RX tone',
  txTone: 'TX tone',
  bandwidthKHz: 'Bandwidth',
  colourCode: 'Colour code',
  mode: 'Mode',
  location: 'Locator / coordinates',
  useLocation: 'Use location',
  comment: 'Comment',
};

function formatLocation(channel: Channel): string {
  if (!channel.location) return '—';
  const { lat, lon } = channel.location;
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

function locationEqual(a: Channel['location'], b: ChannelInput['location']): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return Math.abs(a.lat - b.lat) < 0.0001 && Math.abs(a.lon - b.lon) < 0.0001;
}

export function diffChannelFromDevice(
  channel: Channel,
  device: BrandMeisterDevice,
  options?: MapDeviceOptions,
): ChannelDiffRow[] {
  const mapped = mapDeviceToChannelInput(device, undefined, options);
  if (isMapDeviceSkip(mapped)) return [];

  const remote = mapped.input;
  const rows: ChannelDiffRow[] = [];

  const push = (field: ChannelDiffField, local: string, remoteVal: string, changed: boolean) => {
    rows.push({ field, label: FIELD_LABELS[field], local, remote: remoteVal, changed });
  };

  push('callsign', channel.callsign, remote.callsign, channel.callsign !== remote.callsign);
  push('name', channel.name, remote.name, channel.name !== remote.name);
  push(
    'rxFrequency',
    formatFrequencyHz(channel.rxFrequency) || '—',
    formatFrequencyHz(remote.rxFrequency) || '—',
    channel.rxFrequency !== remote.rxFrequency,
  );
  push(
    'txFrequency',
    formatFrequencyHz(channel.txFrequency) || '—',
    formatFrequencyHz(remote.txFrequency) || '—',
    channel.txFrequency !== remote.txFrequency,
  );
  push(
    'colourCode',
    channel.colourCode != null ? String(channel.colourCode) : '—',
    remote.colourCode != null ? String(remote.colourCode) : '—',
    channel.colourCode !== remote.colourCode,
  );
  push(
    'location',
    formatLocation(channel),
    formatLocation({ ...channel, location: remote.location }),
    !locationEqual(channel.location, remote.location),
  );
  push(
    'useLocation',
    channel.useLocation ? 'Yes' : 'No',
    remote.useLocation ? 'Yes' : 'No',
    channel.useLocation !== remote.useLocation,
  );
  push(
    'comment',
    channel.comment || '—',
    remote.comment || '—',
    channel.comment !== remote.comment,
  );

  return rows;
}

export function buildPatchFromDeviceDiff(
  device: BrandMeisterDevice,
  selectedFields: ChannelDiffField[],
  options?: MapDeviceOptions,
): Partial<ChannelInput> {
  const mapped = mapDeviceToChannelInput(device, undefined, options);
  if (isMapDeviceSkip(mapped)) return {};

  const remote = mapped.input;
  const patch: Partial<ChannelInput> = {};
  const selected = new Set(selectedFields);

  if (selected.has('callsign')) patch.callsign = remote.callsign;
  if (selected.has('name')) patch.name = remote.name;
  if (selected.has('rxFrequency')) patch.rxFrequency = remote.rxFrequency;
  if (selected.has('txFrequency')) patch.txFrequency = remote.txFrequency;
  if (selected.has('colourCode')) patch.colourCode = remote.colourCode;
  if (selected.has('location')) patch.location = remote.location;
  if (selected.has('useLocation')) patch.useLocation = remote.useLocation;
  if (selected.has('comment')) patch.comment = remote.comment;

  return patch;
}

export function brandMeisterProvenancePatch(
  device: BrandMeisterDevice,
  fetchedAt = new Date().toISOString(),
) {
  return {
    repeaterDirectory: {
      sourceId: 'brandmeister' as const,
      remoteListingId: device.id,
      fetchedAt,
      snapshot: deviceToSnapshot(device),
    },
  };
}
