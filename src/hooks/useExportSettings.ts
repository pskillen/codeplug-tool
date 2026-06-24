import { useCallback, useState } from 'react';
import type { ChannelExportNameMode } from '../models/codeplug.ts';
import type { ExportOptions } from '../lib/import-export/types.ts';

export const STORAGE_KEY_EXPORT_SHORTEN_NAMES = 'mm9pdy-codeplug-tool.export.shortenNames';
export const STORAGE_KEY_EXPORT_MAX_NAME_LENGTH = 'mm9pdy-codeplug-tool.export.maxNameLength';
export const STORAGE_KEY_EXPORT_NAME_MODE_OVERRIDE = 'mm9pdy-codeplug-tool.export.nameModeOverride';
export const STORAGE_KEY_EXPORT_USE_TG_ABBREVIATION =
  'mm9pdy-codeplug-tool.export.useTalkGroupAbbreviation';

/** Sentinel for "respect each channel's stored exportNameMode". */
export const EXPORT_NAME_MODE_RESPECT_PER_CHANNEL = '';

export type ExportNameModeOverride =
  | ChannelExportNameMode
  | typeof EXPORT_NAME_MODE_RESPECT_PER_CHANNEL;

export interface ExportSettings {
  shortenNames: boolean;
  maxNameLength: number | null;
  nameModeOverride: ExportNameModeOverride;
  useTalkGroupAbbreviation: boolean;
}

function readShortenNames(): boolean {
  const saved = localStorage.getItem(STORAGE_KEY_EXPORT_SHORTEN_NAMES);
  return saved !== 'false';
}

function readMaxNameLength(): number | null {
  const saved = localStorage.getItem(STORAGE_KEY_EXPORT_MAX_NAME_LENGTH);
  if (!saved) return null;
  const parsed = Number.parseInt(saved, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function readNameModeOverride(): ExportNameModeOverride {
  const saved = localStorage.getItem(STORAGE_KEY_EXPORT_NAME_MODE_OVERRIDE);
  if (
    saved === 'callsign_name' ||
    saved === 'callsign_only' ||
    saved === 'name_only' ||
    saved === 'callsign_suffix'
  ) {
    return saved;
  }
  return EXPORT_NAME_MODE_RESPECT_PER_CHANNEL;
}

function readUseTalkGroupAbbreviation(): boolean {
  return localStorage.getItem(STORAGE_KEY_EXPORT_USE_TG_ABBREVIATION) === 'true';
}

/** Merge persisted export settings with per-download options (profile id, etc.). */
export function exportOptionsFromSettings(
  settings: ExportSettings,
  base: ExportOptions = {},
): ExportOptions {
  return {
    ...base,
    shortenNames: settings.shortenNames,
    ...(settings.maxNameLength != null ? { maxNameLength: settings.maxNameLength } : {}),
    ...(settings.nameModeOverride ? { nameModeOverride: settings.nameModeOverride } : {}),
    useTalkGroupAbbreviation: settings.useTalkGroupAbbreviation,
  };
}

export function useExportSettings() {
  const [shortenNames, setShortenNamesState] = useState(readShortenNames);
  const [maxNameLength, setMaxNameLengthState] = useState<number | null>(readMaxNameLength);
  const [nameModeOverride, setNameModeOverrideState] =
    useState<ExportNameModeOverride>(readNameModeOverride);
  const [useTalkGroupAbbreviation, setUseTalkGroupAbbreviationState] = useState(
    readUseTalkGroupAbbreviation,
  );

  const setShortenNames = useCallback((value: boolean) => {
    setShortenNamesState(value);
    localStorage.setItem(STORAGE_KEY_EXPORT_SHORTEN_NAMES, String(value));
  }, []);

  const setMaxNameLength = useCallback((value: number | null) => {
    setMaxNameLengthState(value);
    if (value == null) {
      localStorage.removeItem(STORAGE_KEY_EXPORT_MAX_NAME_LENGTH);
    } else {
      localStorage.setItem(STORAGE_KEY_EXPORT_MAX_NAME_LENGTH, String(value));
    }
  }, []);

  const setNameModeOverride = useCallback((value: ExportNameModeOverride) => {
    setNameModeOverrideState(value);
    if (!value) {
      localStorage.removeItem(STORAGE_KEY_EXPORT_NAME_MODE_OVERRIDE);
    } else {
      localStorage.setItem(STORAGE_KEY_EXPORT_NAME_MODE_OVERRIDE, value);
    }
  }, []);

  const setUseTalkGroupAbbreviation = useCallback((value: boolean) => {
    setUseTalkGroupAbbreviationState(value);
    localStorage.setItem(STORAGE_KEY_EXPORT_USE_TG_ABBREVIATION, String(value));
  }, []);

  const settings: ExportSettings = {
    shortenNames,
    maxNameLength,
    nameModeOverride,
    useTalkGroupAbbreviation,
  };

  return {
    settings,
    shortenNames,
    setShortenNames,
    maxNameLength,
    setMaxNameLength,
    nameModeOverride,
    setNameModeOverride,
    useTalkGroupAbbreviation,
    setUseTalkGroupAbbreviation,
    exportOptionsFromSettings: (base: ExportOptions = {}) =>
      exportOptionsFromSettings(settings, base),
  };
}
