import { describe, expect, it } from 'vitest';
import { detectKind } from './opengd77/adapter.ts';
import { importFiles } from './index.ts';

describe('detectKind', () => {
  it('classifies by filename', () => {
    expect(detectKind('Channels.csv', [])).toBe('channels');
    expect(detectKind('zones.csv', [])).toBe('zones');
  });

  it('falls back to header signatures', () => {
    expect(detectKind('data.csv', ['Channel Name', 'Latitude', 'Longitude'])).toBe('channels');
    expect(detectKind('data.csv', ['Zone Name', 'Channel1'])).toBe('zones');
    expect(detectKind('data.csv', ['Foo', 'Bar'])).toBe('unknown');
  });
});

describe('importFiles', () => {
  const channelsHeader =
    'Channel Number,Channel Name,Channel Type,Rx Frequency,Tx Frequency,Contact,TG List,Latitude,Longitude,Use Location';
  const channelsCsv = `${channelsHeader}
1,GB3DA DMR,Digital,430,430,None,None,56.5,-4.0,Yes`;
  const zonesCsv = `Zone Name,Channel1\nNorth,GB3DA DMR`;

  it('recognises channels and zones from separate files', async () => {
    const result = await importFiles([
      new File([channelsCsv], 'Channels.csv', { type: 'text/csv' }),
      new File([zonesCsv], 'Zones.csv', { type: 'text/csv' }),
    ]);
    expect(result.recognised).toEqual(['Channels.csv', 'Zones.csv']);
    expect(result.channels).toHaveLength(1);
    expect(result.zones).toHaveLength(1);
    expect(result.skipped).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it('skips unknown files without error', async () => {
    const result = await importFiles([
      new File(['Name,Number\nFoo,1'], 'Contacts.csv', { type: 'text/csv' }),
    ]);
    expect(result.skipped).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
    expect(result.channels).toBeUndefined();
    expect(result.zones).toBeUndefined();
  });

  it('records parse errors', async () => {
    const result = await importFiles([
      new File(['not,a,valid,channels,csv'], 'Channels.csv', { type: 'text/csv' }),
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.recognised).toHaveLength(0);
  });
});
