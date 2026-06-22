import { DEFAULT_OPENGD77_PROFILE_ID } from '../../lib/opengd77/profiles.ts';

export type OpenGd77TestDataFileName =
  | 'Channels.csv'
  | 'Zones.csv'
  | 'Contacts.csv'
  | 'TG_Lists.csv'
  | 'DTMF.csv'
  | 'APRS.csv';

export interface OpenGd77TestDataFixture {
  version: string;
  profileId: typeof DEFAULT_OPENGD77_PROFILE_ID;
}

/** Committed OpenGD77 CPS export folders under `test-data/opengd77/`. */
export const OPENGD77_TEST_DATA_FIXTURES: readonly OpenGd77TestDataFixture[] = [
  {
    version: 'r2025.02.23.01',
    profileId: DEFAULT_OPENGD77_PROFILE_ID,
  },
] as const;

export const OPENGD77_TEST_DATA_FILE_NAMES: readonly OpenGd77TestDataFileName[] = [
  'Channels.csv',
  'Zones.csv',
  'Contacts.csv',
  'TG_Lists.csv',
  'DTMF.csv',
  'APRS.csv',
] as const;

const OPENGD77_TEST_DATA_MODULES = import.meta.glob('../../../test-data/opengd77/*/*.csv', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function fixtureModuleKey(
  fixture: OpenGd77TestDataFixture,
  fileName: OpenGd77TestDataFileName,
): string {
  return `../../../test-data/opengd77/${fixture.version}/${fileName}`;
}

export function readOpenGd77TestData(
  fixture: OpenGd77TestDataFixture,
  fileName: OpenGd77TestDataFileName,
): string {
  const text = OPENGD77_TEST_DATA_MODULES[fixtureModuleKey(fixture, fileName)];
  if (!text) {
    throw new Error(`Missing test-data fixture: ${fixtureModuleKey(fixture, fileName)}`);
  }
  return text;
}

export function openGd77TestDataFiles(fixture: OpenGd77TestDataFixture): File[] {
  return OPENGD77_TEST_DATA_FILE_NAMES.map(
    (fileName) =>
      new File([readOpenGd77TestData(fixture, fileName)], fileName, { type: 'text/csv' }),
  );
}
