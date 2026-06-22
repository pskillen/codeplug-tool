/** CHIRP radio profiles — export-time constraints only. */

export interface ChirpRadioProfile {
  id: string;
  label: string;
  defaultFileName: string;
  maxMemorySlots: number;
}

export const CHIRP_PROFILES: readonly ChirpRadioProfile[] = [
  {
    id: 'baofeng-uv5r-mini',
    label: 'Baofeng UV-5R Mini',
    defaultFileName: 'Baofeng_UV-5R Mini_export.csv',
    maxMemorySlots: 128,
  },
  {
    id: 'baofeng-uv21prov2',
    label: 'Baofeng UV-21Pro V2',
    defaultFileName: 'Baofeng_UV-21ProV2_export.csv',
    maxMemorySlots: 128,
  },
  {
    id: 'retevis-rt95',
    label: 'Retevis RT95 VOX',
    defaultFileName: 'Retevis_RT95 VOX_export.csv',
    maxMemorySlots: 128,
  },
] as const;

export const DEFAULT_CHIRP_PROFILE_ID = 'baofeng-uv5r-mini';

export function getChirpProfile(profileId: string): ChirpRadioProfile {
  const found = CHIRP_PROFILES.find((p) => p.id === profileId);
  if (!found) throw new Error(`Unknown CHIRP profile: ${profileId}`);
  return found;
}

export function chirpProfileSelectData(): { value: string; label: string }[] {
  return CHIRP_PROFILES.map((p) => ({ value: p.id, label: p.label }));
}
