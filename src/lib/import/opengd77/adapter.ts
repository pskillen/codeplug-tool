import { parseChannels, parseZones } from './parse.ts';

export type OpenGd77FileKind = 'channels' | 'zones' | 'unknown';

export function detectKind(fileName: string, headerRow: string[]): OpenGd77FileKind {
  const lower = fileName.toLowerCase();
  if (lower.includes('channel')) return 'channels';
  if (lower.includes('zone')) return 'zones';

  const headers = headerRow.map((h) => h.trim());
  if (headers.includes('Channel Name') && headers.includes('Latitude')) return 'channels';
  if (headers.includes('Zone Name')) return 'zones';
  return 'unknown';
}

export const opengd77Adapter = {
  id: 'opengd77' as const,
  label: 'OpenGD77 CPS CSV',
  detectKind,
  parseChannels,
  parseZones,
};
