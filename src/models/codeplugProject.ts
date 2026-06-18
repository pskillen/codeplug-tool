import { emptyCodeplug, newId, type Codeplug } from './codeplug.ts';

export const DEFAULT_PROJECT_NAME = 'Imported codeplug';

export interface CodeplugProject {
  id: string;
  name: string;
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
  return { id: newId(), name, createdAt: now, updatedAt: now, codeplug };
}
