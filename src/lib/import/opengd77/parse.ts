import { extractCallsign, parseCsv } from '../../csv.ts';
import { mapChannelMode, newId, type Channel } from '../../../models/codeplug.ts';
import type { ParsedZone } from '../types.ts';

const COL = {
  number: 'Channel Number',
  name: 'Channel Name',
  type: 'Channel Type',
  rx: 'Rx Frequency',
  tx: 'Tx Frequency',
  contact: 'Contact',
  tgList: 'TG List',
  lat: 'Latitude',
  lon: 'Longitude',
  useLocation: 'Use Location',
} as const;

export function parseChannels(text: string): Channel[] {
  const rows = parseCsv(text.replace(/^\uFEFF/, ''));
  if (!rows.length) throw new Error('Empty CSV');

  const headers = rows[0].map((h) => h.trim());
  const required = [COL.name, COL.lat, COL.lon];
  for (const key of required) {
    if (!headers.includes(key)) {
      throw new Error(`Missing column "${key}". Is this an OpenGD77 Channels.csv?`);
    }
  }

  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const out: Channel[] = [];

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    if (!cells.length || (cells.length === 1 && !cells[0].trim())) continue;

    const get = (col: string) => (cells[idx[col]] ?? '').trim().replace(/\t/g, '');

    const name = get(COL.name);
    if (!name) continue;

    const lat = parseFloat(get(COL.lat));
    const lon = parseFloat(get(COL.lon));
    const hasLat = Number.isFinite(lat);
    const hasLon = Number.isFinite(lon);

    out.push({
      id: newId(),
      number: get(COL.number),
      name,
      callsign: extractCallsign(name),
      mode: mapChannelMode(get(COL.type)),
      rxFrequency: get(COL.rx),
      txFrequency: get(COL.tx),
      contactName: get(COL.contact),
      rxGroupListName: get(COL.tgList),
      location: hasLat && hasLon ? { lat, lon } : null,
      useLocation: get(COL.useLocation).toLowerCase() === 'yes',
    });
  }
  return out;
}

export function parseZones(text: string): ParsedZone[] {
  const rows = parseCsv(text.replace(/^\uFEFF/, ''));
  if (!rows.length) throw new Error('Empty CSV');

  const headers = rows[0].map((h) => h.trim());
  if (!headers.includes('Zone Name')) {
    throw new Error('Missing column "Zone Name". Is this an OpenGD77 Zones.csv?');
  }

  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const channelCols = headers
    .map((h, i) => (/^Channel\d+$/i.test(h) ? i : -1))
    .filter((i) => i >= 0);

  const out: ParsedZone[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    if (!cells.length || (cells.length === 1 && !cells[0].trim())) continue;

    const name = (cells[idx['Zone Name']] ?? '').trim();
    if (!name) continue;

    const memberNames: string[] = [];
    for (const ci of channelCols) {
      const ch = (cells[ci] ?? '').trim();
      if (ch) memberNames.push(ch);
    }
    out.push({ name, memberNames });
  }
  return out;
}
