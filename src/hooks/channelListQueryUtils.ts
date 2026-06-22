import { DISTANCE_FILTER_MARKS_KM } from '../lib/channels.ts';

export const CHANNEL_LIST_COLUMN_STORAGE_KEY = 'channels-list-columns';

export type ChannelSortMode = 'name' | 'distance';

export const CHANNEL_OPTIONAL_COLUMNS = [
  { key: 'contact', header: 'Contact', defaultVisible: true },
  { key: 'rgl', header: 'RX group list', defaultVisible: true },
  { key: 'loc', header: 'Locator', defaultVisible: true },
  { key: 'distance', header: 'Distance from me', defaultVisible: true },
  { key: 'power', header: 'Power', defaultVisible: true },
  { key: 'squelch', header: 'Squelch', defaultVisible: false },
] as const;

export function defaultChannelVisibleColumns(): string[] {
  return CHANNEL_OPTIONAL_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.key);
}

export function loadChannelVisibleColumns(): string[] {
  const validKeys = new Set(CHANNEL_OPTIONAL_COLUMNS.map((c) => c.key));

  try {
    const raw = localStorage.getItem(CHANNEL_LIST_COLUMN_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as string[];
      let cols = stored.filter((k) => validKeys.has(k as (typeof CHANNEL_OPTIONAL_COLUMNS)[number]['key']));
      if (!cols.includes('distance')) {
        cols = [...cols, 'distance'];
      }
      if (!cols.includes('power')) {
        cols = [...cols, 'power'];
      }
      return cols;
    }
  } catch {
    /* ignore */
  }
  return defaultChannelVisibleColumns();
}

export function defaultMaxDistanceKm(): number {
  return DISTANCE_FILTER_MARKS_KM[2];
}

export function parseMaxDistanceKm(raw: string | null): number {
  if (!raw) return defaultMaxDistanceKm();
  const n = Number.parseInt(raw, 10);
  return (DISTANCE_FILTER_MARKS_KM as readonly number[]).includes(n) ? n : defaultMaxDistanceKm();
}

export function parseCsvParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(',').filter(Boolean);
}

export function serializeCsvParam(values: string[]): string | null {
  return values.length > 0 ? values.join(',') : null;
}
