import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { buildNameToChannelId, resolveZoneMembers } from '../lib/codeplug.ts';
import type { ImportResult } from '../lib/import/types.ts';
import {
  CODEPLUG_SCHEMA_VERSION,
  emptyCodeplug,
  newId,
  type Codeplug,
  type Zone,
} from '../models/codeplug.ts';

/** #9 will wire this to LocalStorage persistence. */
export const CODEPLUG_STORAGE_KEY = 'opengd77-map.codeplug';

type CodeplugAction =
  | { type: 'APPLY_IMPORT'; result: ImportResult }
  | { type: 'CLEAR' };

function applyImport(state: Codeplug, result: ImportResult): Codeplug {
  const channels = result.channels ?? state.channels;
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
    zones = state.zones.map((zone) => {
      const { memberChannelIds } = resolveZoneMembers(zone.sourceMemberNames, nameToId);
      return { ...zone, memberChannelIds };
    });
  }

  const sourceFiles = [...state.meta.sourceFiles];
  for (const fileName of result.recognised) {
    if (!sourceFiles.includes(fileName)) sourceFiles.push(fileName);
  }

  return {
    ...state,
    channels,
    zones,
    meta: {
      ...state.meta,
      importedAt: result.recognised.length ? new Date().toISOString() : state.meta.importedAt,
      sourceFiles,
    },
  };
}

function codeplugReducer(state: Codeplug, action: CodeplugAction): Codeplug {
  switch (action.type) {
    case 'APPLY_IMPORT':
      return applyImport(state, action.result);
    case 'CLEAR':
      return emptyCodeplug();
    default:
      return state;
  }
}

export function serializeCodeplug(codeplug: Codeplug): string {
  return JSON.stringify(codeplug);
}

export function deserializeCodeplug(json: string): Codeplug | null {
  try {
    const parsed = JSON.parse(json) as Codeplug;
    if (parsed?.meta?.schemaVersion !== CODEPLUG_SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

interface CodeplugContextValue {
  codeplug: Codeplug;
  applyImport: (result: ImportResult) => void;
  clear: () => void;
}

const CodeplugContext = createContext<CodeplugContextValue | null>(null);

export function CodeplugProvider({ children }: { children: ReactNode }) {
  const [codeplug, dispatch] = useReducer(codeplugReducer, undefined, emptyCodeplug);

  const applyImport = useCallback((result: ImportResult) => {
    dispatch({ type: 'APPLY_IMPORT', result });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const value = useMemo(
    () => ({ codeplug, applyImport, clear }),
    [codeplug, applyImport, clear],
  );

  return <CodeplugContext.Provider value={value}>{children}</CodeplugContext.Provider>;
}

export function useCodeplug(): CodeplugContextValue {
  const ctx = useContext(CodeplugContext);
  if (!ctx) throw new Error('useCodeplug must be used within CodeplugProvider');
  return ctx;
}
