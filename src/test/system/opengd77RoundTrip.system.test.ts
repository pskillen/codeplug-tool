import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { serialiseOpenGd77Files } from '../../lib/export/opengd77/serialise.ts';
import { importFiles } from '../../lib/import/index.ts';
import { applyImportToCodeplug } from '../../lib/importMerge.ts';
import { emptyCodeplug, resetIdGenerator, setIdGenerator } from '../../models/codeplug.ts';
import { compareCsvHeaders } from '../csvRecordCompare.ts';
import { stripCodeplugForSemanticCompare } from '../opengd77/codeplugSemanticCompare.ts';
import {
  OPENGD77_TEST_DATA_FIXTURES,
  readOpenGd77TestData,
  openGd77TestDataFiles,
  type OpenGd77TestDataFileName,
} from '../opengd77/testData.ts';

const HEADER_ONLY_FILES: OpenGd77TestDataFileName[] = ['DTMF.csv', 'APRS.csv'];

async function importFromExport(
  exported: ReturnType<typeof serialiseOpenGd77Files>,
  profileId: string,
) {
  return importFiles(
    [
      new File([exported['Channels.csv']], 'Channels.csv', { type: 'text/csv' }),
      new File([exported['Zones.csv']], 'Zones.csv', { type: 'text/csv' }),
      new File([exported['Contacts.csv']], 'Contacts.csv', { type: 'text/csv' }),
      new File([exported['TG_Lists.csv']], 'TG_Lists.csv', { type: 'text/csv' }),
    ],
    { vendorFormatId: 'opengd77', profileId },
  );
}

describe('OpenGD77 semantic round-trip (test-data)', () => {
  beforeEach(() => {
    let n = 0;
    setIdGenerator(() => `ogd77-sys-${++n}`);
  });

  afterEach(() => {
    resetIdGenerator();
  });

  it.each(OPENGD77_TEST_DATA_FIXTURES)(
    'import → export → re-import preserves logical model for $version',
    async (fixture) => {
      const parseResult = await importFiles(openGd77TestDataFiles(fixture), {
        vendorFormatId: 'opengd77',
        profileId: fixture.profileId,
      });
      expect(parseResult.errors).toHaveLength(0);
      expect(parseResult.channels?.length).toBeGreaterThan(0);

      const { codeplug: first } = applyImportToCodeplug(emptyCodeplug(), parseResult, 'merge');
      expect(first.talkGroups.length).toBeGreaterThan(0);
      expect(first.rxGroupLists.some((rgl) => rgl.memberRefs.some((m) => m.timeslot != null))).toBe(
        true,
      );

      const exported = serialiseOpenGd77Files(first, { profileId: fixture.profileId });

      for (const fileName of HEADER_ONLY_FILES) {
        const originalCsv = readOpenGd77TestData(fixture, fileName);
        expect(exported[fileName].trim()).toBe(originalCsv.trim());
        expect(compareCsvHeaders(originalCsv, exported[fileName])).toBe(true);
      }

      const secondParsed = await importFromExport(exported, fixture.profileId);
      expect(secondParsed.errors).toHaveLength(0);

      const { codeplug: second } = applyImportToCodeplug(emptyCodeplug(), secondParsed, 'merge');

      const firstStripped = stripCodeplugForSemanticCompare(first);
      const secondStripped = stripCodeplugForSemanticCompare(second);

      expect(secondStripped.talkGroups).toEqual(firstStripped.talkGroups);
      expect(secondStripped.rxGroupLists).toEqual(firstStripped.rxGroupLists);
      expect(secondStripped.contacts).toEqual(firstStripped.contacts);
      expect(secondStripped.zones).toEqual(firstStripped.zones);
      expect(secondStripped.channels).toEqual(firstStripped.channels);
    },
  );
});
