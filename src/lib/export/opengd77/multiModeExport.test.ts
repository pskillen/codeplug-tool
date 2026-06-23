import { describe, expect, it } from 'vitest';
import { buildChannel, buildCodeplug, buildZone } from '../../../test/builders/codeplug.ts';
import { channelModeProfileDefaults } from '../../../models/codeplug.ts';
import { serialiseChannels, serialiseZones } from './serialise.ts';
import { DEFAULT_OPENGD77_PROFILE_ID } from '../../opengd77/profiles.ts';
import { parseCsv } from '../../csv.ts';

function csvToRecords(csv: string): Record<string, string>[] {
  const rows = parseCsv(csv.trim());
  const [headers, ...data] = rows;
  return data.map((row) =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])),
  );
}

describe('OpenGD77 multi-mode export', () => {
  it('expands multi-mode channel into -F and -D rows', () => {
    const ch = buildChannel({
      id: 'c1',
      name: 'GB7GL',
      mode: 'fm',
      multiMode: true,
      rxFrequency: 430_000_000,
      txFrequency: 430_000_000,
      modeProfiles: [
        { ...channelModeProfileDefaults('fm'), rxTone: '88.5' },
        { ...channelModeProfileDefaults('dmr'), colourCode: 1 },
      ],
    });
    const csv = serialiseChannels(buildCodeplug({ channels: [ch] }), DEFAULT_OPENGD77_PROFILE_ID);
    const rows = csvToRecords(csv);
    expect(rows).toHaveLength(2);
    const names = rows.map((r) => r['Channel Name']).sort();
    expect(names).toEqual(['GB7GL-D', 'GB7GL-F']);
    const fmRow = rows.find((r) => r['Channel Name'] === 'GB7GL-F');
    const dmrRow = rows.find((r) => r['Channel Name'] === 'GB7GL-D');
    expect(fmRow?.['Channel Type']).toBe('Analogue');
    expect(dmrRow?.['Channel Type']).toBe('Digital');
    expect(dmrRow?.['Colour Code']).toBe('1');
  });

  it('expands zone members for multi-mode channel', () => {
    const ch = buildChannel({
      id: 'c1',
      name: 'GB7GL',
      mode: 'fm',
      multiMode: true,
      modeProfiles: [channelModeProfileDefaults('fm'), channelModeProfileDefaults('dmr')],
    });
    const zone = buildZone({ id: 'z1', name: 'Test Zone', memberChannelIds: ['c1'] });
    const csv = serialiseZones(
      buildCodeplug({ channels: [ch], zones: [zone] }),
      DEFAULT_OPENGD77_PROFILE_ID,
    );
    const rows = csvToRecords(csv);
    expect(rows[0]['Channel1']).toBe('GB7GL-F');
    expect(rows[0]['Channel2']).toBe('GB7GL-D');
  });
});
