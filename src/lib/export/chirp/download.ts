import type { Codeplug } from '../../../models/codeplug.ts';
import type { ExportOptions, ExportResult } from '../../import-export/types.ts';
import { downloadBlob } from '../opengd77/download.ts';
import { DEFAULT_CHIRP_PROFILE_ID, getChirpProfile } from './profiles.ts';
import { serialiseChirpCsv } from './serialise.ts';

export function downloadChirpCsv(codeplug: Codeplug, options?: ExportOptions): ExportResult {
  const profileId = options?.profileId ?? DEFAULT_CHIRP_PROFILE_ID;
  const profile = getChirpProfile(profileId);
  const fileName = options?.fileName ?? profile.defaultFileName;
  const { csv, warnings } = serialiseChirpCsv(codeplug, options);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, fileName);
  return { warnings };
}
