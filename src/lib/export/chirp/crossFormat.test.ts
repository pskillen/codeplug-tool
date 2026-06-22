import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { importFiles } from '../../import/index.ts';
import { isAnalogMode } from '../../channelModes.ts';
import {
  CODEPLUG_SCHEMA_VERSION,
  resetIdGenerator,
  setIdGenerator,
  type Codeplug,
} from '../../../models/codeplug.ts';
import { CHANNEL_HEADERS } from '../../import/opengd77/columns.ts';
import { serialiseChirpCsv } from './serialise.ts';

describe('CHIRP cross-format export', () => {
  beforeEach(() => {
    let n = 0;
    setIdGenerator(() => `id-${++n}`);
  });

  afterEach(() => {
    resetIdGenerator();
  });

  it('exports analogue channels only from an OpenGD77 import with warnings', async () => {
    const channelsCsv = `${CHANNEL_HEADERS.join(',')}
1,GB3DA DMR,Digital,430.0,430.0,,2,1,Local 9,Scotland,,Off,Off,,,75%,Master,No,No,No,0,Off,No,No,None,56.5,-4.0,Yes
2,2m Calling,Analogue,145.5,145.5,,,,,,,,,,,,,,,,,,,,,,,Yes`;

    const imported = await importFiles(
      [new File([channelsCsv], 'Channels.csv', { type: 'text/csv' })],
      { profileId: 'opengd77-1701' },
    );

    const codeplug: Codeplug = {
      channels: imported.channels!,
      zones: [],
      talkGroups: [],
      rxGroupLists: [],
      contacts: [],
      meta: { schemaVersion: CODEPLUG_SCHEMA_VERSION, importedAt: null, sourceFiles: [] },
    };

    const analogueCount = codeplug.channels.filter((ch) => isAnalogMode(ch.mode)).length;
    expect(analogueCount).toBe(1);

    const { csv, warnings } = serialiseChirpCsv(codeplug);
    expect(warnings.some((w) => /Skipped 1 non-analogue/i.test(w))).toBe(true);
    expect(warnings.some((w) => /GB3DA DMR/.test(w))).toBe(true);

    const dataRows = csv.trim().split('\n').slice(1);
    expect(dataRows).toHaveLength(1);
    expect(dataRows[0]).toContain('2m Calling');
  });
});
