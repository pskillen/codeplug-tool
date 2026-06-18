import type { Channel } from '../../models/codeplug.ts';

export interface ImportMessage {
  fileName: string;
  message: string;
}

/** Adapter output — raw name-based zone members before id resolution. */
export interface ParsedZone {
  name: string;
  memberNames: string[];
}

export interface ImportResult {
  channels?: Channel[];
  zones?: ParsedZone[];
  recognised: string[];
  skipped: ImportMessage[];
  errors: ImportMessage[];
}
