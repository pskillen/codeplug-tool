import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetIdGenerator, setIdGenerator } from '../../../models/codeplug.ts';
import { parseChannels, parseZones } from './parse.ts';

describe('parseChannels', () => {
  beforeEach(() => {
    let n = 0;
    setIdGenerator(() => `ch-${++n}`);
  });

  afterEach(() => {
    resetIdGenerator();
  });

  const header =
    'Channel Number,Channel Name,Channel Type,Rx Frequency,Tx Frequency,Contact,TG List,Latitude,Longitude,Use Location';

  it('parses valid channels with internal model fields', () => {
    const csv = `${header}
1,GB3DA DMR,Digital,430.0,430.0,None,None,56.5,-4.0,Yes
2,GB3XX FM,Analogue,145.0,145.0,None,None,57.0,-3.5,No`;

    const channels = parseChannels(csv);
    expect(channels).toHaveLength(2);
    expect(channels[0]).toMatchObject({
      id: 'ch-1',
      number: '1',
      name: 'GB3DA DMR',
      callsign: 'GB3DA',
      mode: 'digital',
      location: { lat: 56.5, lon: -4.0 },
      useLocation: true,
    });
    expect(channels[1].mode).toBe('analogue');
    expect(channels[1].useLocation).toBe(false);
    expect(new Set(channels.map((c) => c.id)).size).toBe(2);
  });

  it('throws when required column is missing', () => {
    expect(() => parseChannels('Channel Name,Latitude\nFoo,1.0')).toThrow(
      'Missing column "Longitude"',
    );
  });

  it('tolerates BOM', () => {
    const csv = `\uFEFF${header}\n1,Test,Digital,430,430,None,None,56.5,-4.0,Yes`;
    expect(parseChannels(csv)).toHaveLength(1);
  });

  it('skips empty rows and rows without channel name', () => {
    const csv = `${header}
1,Named,Digital,430,430,None,None,56.5,-4.0,Yes
,,,,,,,,,
2,,Digital,430,430,None,None,56.5,-4.0,Yes`;

    expect(parseChannels(csv)).toHaveLength(1);
    expect(parseChannels(csv)[0].name).toBe('Named');
  });

  it('sets null location for invalid coordinates', () => {
    const csv = `${header}\n1,Test,Digital,430,430,None,None,not-a-lat,not-a-lon,Yes`;
    const ch = parseChannels(csv)[0];
    expect(ch.location).toBeNull();
  });
});

describe('parseZones', () => {
  it('extracts zone members as raw names', () => {
    const csv = `Zone Name,Channel1,Channel2,Channel3
North,GB3DA DMR,GB3XX FM,
South,GB3YY FM,,`;

    const zones = parseZones(csv);
    expect(zones).toHaveLength(2);
    expect(zones[0]).toEqual({
      name: 'North',
      memberNames: ['GB3DA DMR', 'GB3XX FM'],
    });
    expect(zones[1]).toEqual({ name: 'South', memberNames: ['GB3YY FM'] });
  });

  it('preserves member name case', () => {
    const csv = `Zone Name,Channel1
Test,MixedCase Name`;
    expect(parseZones(csv)[0].memberNames[0]).toBe('MixedCase Name');
  });

  it('throws when Zone Name column is missing', () => {
    expect(() => parseZones('Name,Channel1\nFoo,Bar')).toThrow('Missing column "Zone Name"');
  });

  it('skips empty zone rows', () => {
    const csv = `Zone Name,Channel1
Valid,CH1
,,`;
    expect(parseZones(csv)).toHaveLength(1);
  });
});
