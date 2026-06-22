export interface ChirpTestDataFixture {
  version: string;
  radioDir: string;
  fileName: string;
  profileId: 'baofeng-uv5r-mini' | 'baofeng-uv21prov2' | 'retevis-rt95';
}

/** Committed CHIRP CPS exports under `test-data/chirp/`. */
export const CHIRP_TEST_DATA_FIXTURES: readonly ChirpTestDataFixture[] = [
  {
    version: '20260629',
    radioDir: 'baofeng-uv5r-mini',
    fileName: 'Baofeng_UV-5R Mini_20251129.csv',
    profileId: 'baofeng-uv5r-mini',
  },
  {
    version: '20260629',
    radioDir: 'baofeng-uv21proV2',
    fileName: 'Baofeng_UV-21ProV2_20251129.csv',
    profileId: 'baofeng-uv21prov2',
  },
  {
    version: '20260629',
    radioDir: 'retevis-rt95',
    fileName: 'Retevis_RT95 VOX_20251106.csv',
    profileId: 'retevis-rt95',
  },
] as const;

const CHIRP_TEST_DATA_MODULES = import.meta.glob('../../../test-data/chirp/*/*/*.csv', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function fixtureModuleKey(fixture: ChirpTestDataFixture): string {
  return `../../../test-data/chirp/${fixture.version}/${fixture.radioDir}/${fixture.fileName}`;
}

export function readChirpTestData(fixture: ChirpTestDataFixture): string {
  const text = CHIRP_TEST_DATA_MODULES[fixtureModuleKey(fixture)];
  if (!text) {
    throw new Error(`Missing test-data fixture: ${fixtureModuleKey(fixture)}`);
  }
  return text;
}
