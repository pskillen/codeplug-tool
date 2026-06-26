import type {
  BrandMeisterDevice,
  BrandMeisterStaticTalkgroup,
  BrandMeisterTalkgroupMeta,
} from './types.ts';
import { BRANDMEISTER_API_BASE } from './types.ts';
import { readCachedResponse, writeCachedResponse } from './cache.ts';

export class BrandMeisterDirectoryError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'BrandMeisterDirectoryError';
  }
}

function buildUrl(path: string): string {
  const trimmed = path.replace(/^\//, '');
  return `${BRANDMEISTER_API_BASE}/${trimmed}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = buildUrl(path);
  const cached = readCachedResponse(url);

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    if (cached) return JSON.parse(cached) as T;
    throw new BrandMeisterDirectoryError(
      'Could not reach BrandMeister — check your network connection.',
    );
  }

  const body = await response.text();
  if (!response.ok) {
    throw new BrandMeisterDirectoryError(
      `BrandMeister returned ${response.status}. The API may be unavailable.`,
      response.status,
    );
  }

  writeCachedResponse(url, body);
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new BrandMeisterDirectoryError('Invalid response from BrandMeister.');
  }
}

export async function fetchDevicesByCallsign(callsign: string): Promise<BrandMeisterDevice[]> {
  const q = encodeURIComponent(callsign.trim());
  const result = await fetchJson<BrandMeisterDevice[] | BrandMeisterDevice>(
    `device/byCall?callsign=${q}`,
  );
  if (Array.isArray(result)) return result;
  return result ? [result] : [];
}

export async function fetchDeviceById(deviceId: number): Promise<BrandMeisterDevice | null> {
  try {
    return await fetchJson<BrandMeisterDevice>(`device/${deviceId}`);
  } catch (err) {
    if (err instanceof BrandMeisterDirectoryError && err.status === 404) return null;
    throw err;
  }
}

export async function fetchStaticTalkgroups(
  deviceId: number,
): Promise<BrandMeisterStaticTalkgroup[]> {
  const result = await fetchJson<BrandMeisterStaticTalkgroup[]>(`device/${deviceId}/talkgroup`);
  return Array.isArray(result) ? result : [];
}

export async function fetchTalkgroupMeta(talkgroupId: string): Promise<BrandMeisterTalkgroupMeta | null> {
  const id = talkgroupId.trim();
  if (!id) return null;
  try {
    return await fetchJson<BrandMeisterTalkgroupMeta>(`talkgroup/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof BrandMeisterDirectoryError && err.status === 404) return null;
    throw err;
  }
}
