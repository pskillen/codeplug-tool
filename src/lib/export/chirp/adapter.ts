import type { ExportDownloadContext, ExportResult } from '../../import-export/types.ts';
import { DEFAULT_CHIRP_PROFILE_ID, getChirpProfile } from './profiles.ts';
import { downloadChirpCsv } from './download.ts';

export const chirpExportAdapter = {
  id: 'chirp' as const,
  label: 'CHIRP CSV',
  delivery: 'single-file' as const,
  get defaultFileName() {
    return getChirpProfile(DEFAULT_CHIRP_PROFILE_ID).defaultFileName;
  },
  download(ctx: ExportDownloadContext): ExportResult {
    return downloadChirpCsv(ctx.codeplug, ctx.options);
  },
} satisfies import('../../import-export/exportAdapter.ts').SingleFileExportAdapter;
