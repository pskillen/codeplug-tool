import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { buildNameToChannelId, resolveZoneMembers } from '../lib/codeplug.ts';
import type { ImportResult } from '../lib/import/types.ts';
import { emptyCodeplug, newId, type Codeplug, type Zone } from '../models/codeplug.ts';
import {
  defaultProjectName,
  newProject,
  type CodeplugProject,
} from '../models/codeplugProject.ts';
import {
  clearProjectsStorage,
  loadProjectsFromStorage,
  saveProjectsToStorage,
  StorageQuotaError,
  type ProjectsState,
} from './codeplugStorage.ts';

type ProjectsAction =
  | { type: 'IMPORT_NEW_PROJECT'; result: ImportResult; name?: string }
  | { type: 'APPLY_IMPORT'; result: ImportResult }
  | { type: 'SET_ACTIVE_PROJECT'; id: string }
  | { type: 'DELETE_PROJECT'; id: string }
  | { type: 'CLEAR' };

function applyImportToCodeplug(codeplug: Codeplug, result: ImportResult): Codeplug {
  const channels = result.channels ?? codeplug.channels;
  const nameToId = buildNameToChannelId(channels);

  let zones: Zone[];
  if (result.zones) {
    zones = result.zones.map((parsed) => {
      const { memberChannelIds } = resolveZoneMembers(parsed.memberNames, nameToId);
      return {
        id: newId(),
        name: parsed.name,
        sourceMemberNames: parsed.memberNames,
        memberChannelIds,
      };
    });
  } else {
    zones = codeplug.zones.map((zone) => {
      const { memberChannelIds } = resolveZoneMembers(zone.sourceMemberNames, nameToId);
      return { ...zone, memberChannelIds };
    });
  }

  const contacts = result.contacts ?? codeplug.contacts;
  const talkGroups = result.talkGroups ?? codeplug.talkGroups;

  let rxGroupLists = codeplug.rxGroupLists;
  if (result.rxGroupLists) {
    rxGroupLists = result.rxGroupLists.map((parsed) => ({
      id: newId(),
      name: parsed.name,
      sourceMemberNames: parsed.sourceMemberNames,
    }));
  }

  const sourceFiles = [...codeplug.meta.sourceFiles];
  for (const fileName of result.recognised) {
    if (!sourceFiles.includes(fileName)) sourceFiles.push(fileName);
  }

  return {
    ...codeplug,
    channels,
    zones,
    contacts,
    talkGroups,
    rxGroupLists,
    meta: {
      ...codeplug.meta,
      importedAt: result.recognised.length ? new Date().toISOString() : codeplug.meta.importedAt,
      sourceFiles,
    },
  };
}

function touchProject(project: CodeplugProject): CodeplugProject {
  return { ...project, updatedAt: new Date().toISOString() };
}

function importNewProjectState(
  state: ProjectsState,
  result: ImportResult,
  name?: string,
): ProjectsState {
  const projectName = name ?? defaultProjectName(result.recognised);
  const project = touchProject({
    ...newProject(projectName),
    codeplug: applyImportToCodeplug(emptyCodeplug(), result),
  });
  return {
    projects: [...state.projects, project],
    activeProjectId: project.id,
  };
}

function projectsReducer(state: ProjectsState, action: ProjectsAction): ProjectsState {
  switch (action.type) {
    case 'IMPORT_NEW_PROJECT':
      return importNewProjectState(state, action.result, action.name);

    case 'APPLY_IMPORT': {
      if (!state.activeProjectId) {
        return importNewProjectState(state, action.result);
      }
      const activeId = state.activeProjectId;
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id !== activeId) return project;
          return touchProject({
            ...project,
            codeplug: applyImportToCodeplug(project.codeplug, action.result),
          });
        }),
      };
    }

    case 'SET_ACTIVE_PROJECT': {
      if (!state.projects.some((p) => p.id === action.id)) return state;
      return { ...state, activeProjectId: action.id };
    }

    case 'DELETE_PROJECT': {
      const projects = state.projects.filter((p) => p.id !== action.id);
      let activeProjectId = state.activeProjectId;
      if (activeProjectId === action.id) {
        activeProjectId = projects[0]?.id ?? null;
      }
      return { projects, activeProjectId };
    }

    case 'CLEAR': {
      if (!state.activeProjectId) return state;
      const activeId = state.activeProjectId;
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id !== activeId) return project;
          return touchProject({ ...project, codeplug: emptyCodeplug() });
        }),
      };
    }

    default:
      return state;
  }
}

function emptyProjectsState(): ProjectsState {
  return { activeProjectId: null, projects: [] };
}

function activeProject(state: ProjectsState): CodeplugProject | null {
  if (!state.activeProjectId) return null;
  return state.projects.find((p) => p.id === state.activeProjectId) ?? null;
}

interface CodeplugContextValue {
  codeplug: Codeplug;
  applyImport: (result: ImportResult) => void;
  clear: () => void;
  persistenceError: string | null;
  clearPersistenceError: () => void;
}

interface ProjectsContextValue {
  projects: CodeplugProject[];
  activeProjectId: string | null;
  activeProject: CodeplugProject | null;
  importNewProject: (result: ImportResult, name?: string) => void;
  applyImportToActive: (result: ImportResult) => void;
  setActiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
  persistenceError: string | null;
  clearPersistenceError: () => void;
}

const CodeplugContext = createContext<CodeplugContextValue | null>(null);
const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function CodeplugProvider({ children }: { children: ReactNode }) {
  const [projectsState, dispatch] = useReducer(
    projectsReducer,
    undefined,
    () => loadProjectsFromStorage() ?? emptyProjectsState(),
  );
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  useEffect(() => {
    try {
      saveProjectsToStorage(projectsState);
    } catch (err) {
      const message =
        err instanceof StorageQuotaError
          ? 'Could not save to browser storage (quota exceeded). Your changes work for now but may be lost on reload.'
          : 'Could not save to browser storage. Your changes may be lost on reload.';
      queueMicrotask(() => setPersistenceError(message));
    }
  }, [projectsState]);

  const clearPersistenceError = useCallback(() => {
    setPersistenceError(null);
  }, []);

  const applyImport = useCallback(
    (result: ImportResult) => {
      setPersistenceError(null);
      dispatch({ type: 'APPLY_IMPORT', result });
    },
    [],
  );

  const clear = useCallback(() => {
    setPersistenceError(null);
    dispatch({ type: 'CLEAR' });
    if (!projectsState.activeProjectId) {
      clearProjectsStorage();
    }
  }, [projectsState.activeProjectId]);

  const importNewProject = useCallback((result: ImportResult, name?: string) => {
    setPersistenceError(null);
    dispatch({ type: 'IMPORT_NEW_PROJECT', result, name });
  }, []);

  const applyImportToActive = useCallback((result: ImportResult) => {
    setPersistenceError(null);
    dispatch({ type: 'APPLY_IMPORT', result });
  }, []);

  const setActiveProject = useCallback((id: string) => {
    setPersistenceError(null);
    dispatch({ type: 'SET_ACTIVE_PROJECT', id });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setPersistenceError(null);
    dispatch({ type: 'DELETE_PROJECT', id });
  }, []);

  const current = activeProject(projectsState);
  const codeplug = current?.codeplug ?? emptyCodeplug();

  const codeplugValue = useMemo(
    () => ({
      codeplug,
      applyImport,
      clear,
      persistenceError,
      clearPersistenceError,
    }),
    [codeplug, applyImport, clear, persistenceError, clearPersistenceError],
  );

  const projectsValue = useMemo(
    () => ({
      projects: projectsState.projects,
      activeProjectId: projectsState.activeProjectId,
      activeProject: current,
      importNewProject,
      applyImportToActive,
      setActiveProject,
      deleteProject,
      persistenceError,
      clearPersistenceError,
    }),
    [
      projectsState,
      current,
      importNewProject,
      applyImportToActive,
      setActiveProject,
      deleteProject,
      persistenceError,
      clearPersistenceError,
    ],
  );

  return (
    <ProjectsContext.Provider value={projectsValue}>
      <CodeplugContext.Provider value={codeplugValue}>{children}</CodeplugContext.Provider>
    </ProjectsContext.Provider>
  );
}

export function useCodeplug(): CodeplugContextValue {
  const ctx = useContext(CodeplugContext);
  if (!ctx) throw new Error('useCodeplug must be used within CodeplugProvider');
  return ctx;
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within CodeplugProvider');
  return ctx;
}

/** @internal test export */
export { applyImportToCodeplug, projectsReducer };
