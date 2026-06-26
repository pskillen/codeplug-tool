export const BRANDMEISTER_API_BASE = 'https://api.brandmeister.network/v2';

export interface BrandMeisterDevice {
  id: number;
  callsign: string;
  linkname?: string;
  hardware?: string;
  firmware?: string;
  /** Repeater output MHz string — maps to channel rxFrequency. */
  tx?: string;
  /** Repeater input MHz string — maps to channel txFrequency. */
  rx?: string;
  colorcode?: number;
  status?: number;
  lastKnownMaster?: number;
  lat?: number;
  lng?: number;
  city?: string;
  website?: string;
  priorityDescription?: string;
  description?: string;
  statusText?: string;
  last_seen?: string;
}

export interface BrandMeisterStaticTalkgroup {
  talkgroup: string;
  slot: string;
  repeaterid: string;
}

export interface BrandMeisterTalkgroupMeta {
  ID: number;
  Name: string;
}

export function deviceToSnapshot(device: BrandMeisterDevice): Record<string, unknown> {
  return {
    id: device.id,
    callsign: device.callsign,
    city: device.city,
    statusText: device.statusText,
    colorcode: device.colorcode,
    last_seen: device.last_seen,
    priorityDescription: device.priorityDescription,
  };
}

export function toDirectoryListing(device: BrandMeisterDevice) {
  return {
    sourceId: 'brandmeister' as const,
    remoteListingId: device.id,
    callsign: device.callsign,
    band: inferBandFromFrequencies(device),
    town: device.city ?? '',
    status: device.statusText ?? String(device.status ?? ''),
    raw: device,
  };
}

function inferBandFromFrequencies(device: BrandMeisterDevice): string {
  const mhz = parseMhz(device.tx) ?? parseMhz(device.rx);
  if (mhz == null) return '';
  if (mhz >= 420 && mhz <= 450) return '70CM';
  if (mhz >= 144 && mhz <= 148) return '2M';
  return '';
}

export function parseMhz(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

/** Convert BrandMeister MHz string to integer Hz for internal model. */
export function mhzStringToHz(value: string | undefined): number | null {
  const mhz = parseMhz(value);
  if (mhz == null || mhz <= 0) return null;
  return Math.round(mhz * 1_000_000);
}
