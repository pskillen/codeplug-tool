import { emptyCodeplug, newId, type Codeplug } from './codeplug.ts';

export const DEFAULT_PROJECT_NAME = 'Imported codeplug';

export interface CodeplugProject {
  id: string;
  name: string;
  /** Short one-line summary for display on Summary and Home. */
  description: string;
  /** Free-form operator notes (plain text). */
  notes: string;
  /**
   * Who created or maintains this layout (callsign, name, etc.).
   * Operator annotation only — not used for import, export, or validation.
   */
  author: string;
  /**
   * Indicative radio labels (e.g. "Baofeng 1701", "DM-32UV").
   * Operator annotation only — not used for import, export, or validation.
   */
  targetRadios: string[];
  createdAt: string;
  updatedAt: string;
  codeplug: Codeplug;
}

export function defaultProjectName(sourceFiles?: string[]): string {
  if (!sourceFiles?.length) return DEFAULT_PROJECT_NAME;
  const base = sourceFiles[0].replace(/\.csv$/i, '').trim();
  return base || DEFAULT_PROJECT_NAME;
}

export function newProject(name: string, codeplug: Codeplug = emptyCodeplug()): CodeplugProject {
  const now = new Date().toISOString();
  return {
    id: newId(),
    name,
    description: '',
    notes: '',
    author: '',
    targetRadios: [],
    createdAt: now,
    updatedAt: now,
    codeplug,
  };
}
