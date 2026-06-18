import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emptyCodeplug } from '../models/codeplug.ts';
import { newProject } from '../models/codeplugProject.ts';
import {
  CODEPLUG_STORAGE_KEY,
  CODEPLUG_STORAGE_VERSION,
  clearProjectsStorage,
  deserializeProjects,
  isPersistableProjects,
  isValidCodeplug,
  isValidProject,
  loadProjectsFromStorage,
  makeSampleProjectsState,
  saveProjectsToStorage,
  seedProjectsStorage,
  serializeProjects,
  StorageQuotaError,
} from './codeplugStorage.ts';

describe('codeplugStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('round-trips the projects envelope', () => {
    const state = makeSampleProjectsState();
    const json = serializeProjects(state);
    const parsed = JSON.parse(json) as {
      version: number;
      activeProjectId: string | null;
      projects: unknown[];
    };

    expect(parsed.version).toBe(CODEPLUG_STORAGE_VERSION);
    expect(parsed.activeProjectId).toBe(state.activeProjectId);
    expect(parsed.projects).toHaveLength(2);
    expect(deserializeProjects(json)).toEqual(state);
  });

  it('persists and loads via localStorage', () => {
    const state = makeSampleProjectsState();
    saveProjectsToStorage(state);
    expect(loadProjectsFromStorage()).toEqual(state);
  });

  it('removes the key when the project set is empty', () => {
    saveProjectsToStorage({ activeProjectId: null, projects: [] });
    expect(localStorage.getItem(CODEPLUG_STORAGE_KEY)).toBeNull();
    expect(loadProjectsFromStorage()).toBeNull();
  });

  it('returns null for invalid JSON and clears the key on load', () => {
    localStorage.setItem(CODEPLUG_STORAGE_KEY, 'not-json');
    expect(loadProjectsFromStorage()).toBeNull();
    expect(localStorage.getItem(CODEPLUG_STORAGE_KEY)).toBeNull();
  });

  it('returns null for unknown envelope versions', () => {
    localStorage.setItem(
      CODEPLUG_STORAGE_KEY,
      JSON.stringify({ version: 99, activeProjectId: null, projects: [] }),
    );
    expect(loadProjectsFromStorage()).toBeNull();
  });

  it('filters invalid projects and fixes activeProjectId', () => {
    const good = newProject('Good');
    const bad = { id: 'x', name: 'Bad' };
    const json = JSON.stringify({
      version: CODEPLUG_STORAGE_VERSION,
      activeProjectId: 'missing-id',
      projects: [good, bad],
    });

    const state = deserializeProjects(json);
    expect(state?.projects).toHaveLength(1);
    expect(state?.projects[0].name).toBe('Good');
    expect(state?.activeProjectId).toBe(good.id);
  });

  it('sets activeProjectId to null when all projects are invalid', () => {
    const json = JSON.stringify({
      version: CODEPLUG_STORAGE_VERSION,
      activeProjectId: 'missing',
      projects: [{ id: 'x' }],
    });
    expect(deserializeProjects(json)).toEqual({ activeProjectId: null, projects: [] });
  });

  it('validates codeplug and project shapes', () => {
    expect(isValidCodeplug(emptyCodeplug())).toBe(true);
    expect(isValidCodeplug({ meta: { schemaVersion: 999 } })).toBe(false);

    const project = newProject('Test');
    expect(isValidProject(project)).toBe(true);
    expect(isValidProject({ ...project, name: 1 })).toBe(false);
  });

  it('isPersistableProjects is false for an empty set', () => {
    expect(isPersistableProjects({ activeProjectId: null, projects: [] })).toBe(false);
    expect(isPersistableProjects(makeSampleProjectsState())).toBe(true);
  });

  it('throws StorageQuotaError when setItem hits quota', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    expect(() => saveProjectsToStorage(makeSampleProjectsState())).toThrow(StorageQuotaError);
    vi.restoreAllMocks();
  });

  it('clearProjectsStorage removes the key', () => {
    seedProjectsStorage(makeSampleProjectsState());
    clearProjectsStorage();
    expect(localStorage.getItem(CODEPLUG_STORAGE_KEY)).toBeNull();
  });
});
