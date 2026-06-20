import type { ValidationIssue } from './channel.ts';

export const PROJECT_NAME_MAX = 80;
export const PROJECT_DESCRIPTION_MAX = 200;
export const PROJECT_AUTHOR_MAX = 120;
export const PROJECT_NOTES_MAX = 4000;
export const PROJECT_TARGET_RADIOS_MAX_ITEMS = 20;
export const PROJECT_TARGET_RADIO_ITEM_MAX = 80;

export interface ProjectMetadataInput {
  name: string;
  description?: string;
  notes?: string;
  author?: string;
  targetRadios?: string[];
}

export function normalizeTargetRadios(items: string[]): string[] {
  return items.map((item) => item.trim()).filter((item) => item.length > 0);
}

export function hasDuplicateTargetRadios(items: string[]): boolean {
  const seen = new Set<string>();
  for (const item of items) {
    const key = item.trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

export function validateProjectMetadata(input: ProjectMetadataInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const name = input.name.trim();

  if (!name) {
    issues.push({ field: 'name', message: 'Project name is required', severity: 'error' });
  } else if (name.length > PROJECT_NAME_MAX) {
    issues.push({
      field: 'name',
      message: `Project name must be at most ${PROJECT_NAME_MAX} characters`,
      severity: 'error',
    });
  }

  const description = (input.description ?? '').trim();
  if (description.length > PROJECT_DESCRIPTION_MAX) {
    issues.push({
      field: 'description',
      message: `Description must be at most ${PROJECT_DESCRIPTION_MAX} characters`,
      severity: 'error',
    });
  }

  const author = (input.author ?? '').trim();
  if (author.length > PROJECT_AUTHOR_MAX) {
    issues.push({
      field: 'author',
      message: `Author must be at most ${PROJECT_AUTHOR_MAX} characters`,
      severity: 'error',
    });
  }

  const notes = (input.notes ?? '').trim();
  if (notes.length > PROJECT_NOTES_MAX) {
    issues.push({
      field: 'notes',
      message: `Notes must be at most ${PROJECT_NOTES_MAX} characters`,
      severity: 'error',
    });
  }

  const targetRadios = normalizeTargetRadios(input.targetRadios ?? []);
  if (targetRadios.length > PROJECT_TARGET_RADIOS_MAX_ITEMS) {
    issues.push({
      field: 'targetRadios',
      message: `At most ${PROJECT_TARGET_RADIOS_MAX_ITEMS} target radios allowed`,
      severity: 'error',
    });
  }

  for (const item of targetRadios) {
    if (item.length > PROJECT_TARGET_RADIO_ITEM_MAX) {
      issues.push({
        field: 'targetRadios',
        message: `Each target radio label must be at most ${PROJECT_TARGET_RADIO_ITEM_MAX} characters`,
        severity: 'error',
      });
      break;
    }
  }

  if (hasDuplicateTargetRadios(targetRadios)) {
    issues.push({
      field: 'targetRadios',
      message: 'Target radios must be unique',
      severity: 'error',
    });
  }

  return issues;
}

export type ProjectMetadataPatch = Partial<{
  name: string;
  description: string;
  notes: string;
  author: string;
  targetRadios: string[];
}>;

export function sanitizeProjectMetadataPatch(patch: ProjectMetadataPatch): ProjectMetadataPatch {
  const sanitized: ProjectMetadataPatch = {};
  if (patch.name !== undefined) sanitized.name = patch.name.trim();
  if (patch.description !== undefined) sanitized.description = patch.description.trim();
  if (patch.notes !== undefined) sanitized.notes = patch.notes.trim();
  if (patch.author !== undefined) sanitized.author = patch.author.trim();
  if (patch.targetRadios !== undefined) {
    sanitized.targetRadios = normalizeTargetRadios(patch.targetRadios);
  }
  return sanitized;
}
