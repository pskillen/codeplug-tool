import {
  CODEPLUG_SCHEMA_VERSION,
  type Codeplug,
} from '../models/codeplug.ts';
import type { CodeplugProject } from '../models/codeplugProject.ts';
import { newProject } from '../models/codeplugProject.ts';

export const CODEPLUG_STORAGE_KEY = 'opengd77-map.codeplug';
export const CODEPLUG_STORAGE_VERSION = 1;

export interface ProjectsState {
  activeProjectId: string | null;
  projects: CodeplugProject[];
}

export class StorageQuotaError extends Error {
  constructor(message = 'LocalStorage quota exceeded') {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

export function isValidCodeplug(value: unknown): value is Codeplug {
  if (!value || typeof value !== 'object') return false;
  const cp = value as Codeplug;
  if (cp.meta?.schemaVersion !== CODEPLUG_SCHEMA_VERSION) return false;
  return (
    Array.isArray(cp.channels) &&
    Array.isArray(cp.zones) &&
    Array.isArray(cp.talkGroups) &&
    Array.isArray(cp.tgLists) &&
    Array.isArray(cp.contacts)
  );
}

export function isValidProject(value: unknown): value is CodeplugProject {
  if (!value || typeof value !== 'object') return false;
  const p = value as CodeplugProject;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.createdAt === 'string' &&
    typeof p.updatedAt === 'string' &&
    isValidCodeplug(p.codeplug)
  );
}

export function isPersistableProjects(state: ProjectsState): boolean {
  return state.projects.length > 0;
}

export function serializeProjects(state: ProjectsState): string {
  return JSON.stringify({
    version: CODEPLUG_STORAGE_VERSION,
    activeProjectId: state.activeProjectId,
    projects: state.projects,
  });
}

function normalizeActiveProjectId(
  activeProjectId: string | null,
  projects: CodeplugProject[],
): string | null {
  if (!projects.length) return null;
  if (activeProjectId && projects.some((p) => p.id === activeProjectId)) {
    return activeProjectId;
  }
  return projects[0].id;
}

export function deserializeProjects(json: string): ProjectsState | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;
  const envelope = parsed as { version?: number; activeProjectId?: unknown; projects?: unknown };

  if (envelope.version !== CODEPLUG_STORAGE_VERSION) return null;
  if (!Array.isArray(envelope.projects)) return null;

  const projects = envelope.projects.filter(isValidProject);
  const activeProjectId =
    typeof envelope.activeProjectId === 'string' || envelope.activeProjectId === null
      ? (envelope.activeProjectId as string | null)
      : null;

  return {
    projects,
    activeProjectId: normalizeActiveProjectId(activeProjectId, projects),
  };
}

export function loadProjectsFromStorage(): ProjectsState | null {
  const json = localStorage.getItem(CODEPLUG_STORAGE_KEY);
  if (!json) return null;

  const state = deserializeProjects(json);
  if (!state) {
    localStorage.removeItem(CODEPLUG_STORAGE_KEY);
    return null;
  }
  return state;
}

export function saveProjectsToStorage(state: ProjectsState): void {
  if (!isPersistableProjects(state)) {
    localStorage.removeItem(CODEPLUG_STORAGE_KEY);
    return;
  }

  try {
    localStorage.setItem(CODEPLUG_STORAGE_KEY, serializeProjects(state));
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      throw new StorageQuotaError();
    }
    throw err;
  }
}

export function clearProjectsStorage(): void {
  localStorage.removeItem(CODEPLUG_STORAGE_KEY);
}

/** @internal test helper */
export function seedProjectsStorage(state: ProjectsState): void {
  localStorage.setItem(CODEPLUG_STORAGE_KEY, serializeProjects(state));
}

/** @internal test helper */
export function makeSampleProjectsState(): ProjectsState {
  const a = newProject('Alpha');
  const b = newProject('Beta');
  return { activeProjectId: a.id, projects: [a, b] };
}
