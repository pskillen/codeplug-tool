import { fetchDeviceById, fetchDevicesByCallsign } from './client.ts';
import type { BrandMeisterDevice } from './types.ts';
import { toDirectoryListing } from './types.ts';
import type { RepeaterDirectoryListing } from '../types.ts';

export type BrandMeisterQueryKind = 'callsign' | 'deviceId';

const CALLSIGN_RE = /^[A-Z0-9][A-Z0-9/-]{1,11}$/i;

export function detectBrandMeisterQueryKind(query: string): BrandMeisterQueryKind {
  const trimmed = query.trim();
  if (/^\d+$/.test(trimmed)) return 'deviceId';
  return 'callsign';
}

export function looksLikeBrandMeisterCallsign(query: string): boolean {
  const compact = query.trim().replace(/\s/g, '');
  if (!CALLSIGN_RE.test(compact)) return false;
  return /\d/.test(compact);
}

export interface BrandMeisterSearchResult {
  kind: BrandMeisterQueryKind;
  devices: BrandMeisterDevice[];
  listings: RepeaterDirectoryListing[];
}

export async function searchBrandMeisterDevices(query: string): Promise<BrandMeisterSearchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { kind: 'callsign', devices: [], listings: [] };
  }

  const kind = detectBrandMeisterQueryKind(trimmed);
  let devices: BrandMeisterDevice[];

  if (kind === 'deviceId') {
    const device = await fetchDeviceById(Number.parseInt(trimmed, 10));
    devices = device ? [device] : [];
  } else {
    devices = await fetchDevicesByCallsign(trimmed);
  }

  return {
    kind,
    devices,
    listings: devices.map(toDirectoryListing),
  };
}
