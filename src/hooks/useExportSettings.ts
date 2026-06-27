import { useCallback, useState } from 'react';
import type { ChannelExportNameMode } from '../models/codeplug.ts';
import type { ExportOptions, MultiTalkGroupExportNameMode } from '../lib/import-export/types.ts';
import { DEFAULT_MULTI_TG_EXPORT_NAME_MODE } from '../lib/channelExpansion/multiTalkGroupWireName.ts';

export const STORAGE_KEY_EXPORT_SHORTEN_NAMES = 'mm9pdy-codeplug-tool.export.shortenNames';
export const STORAGE_KEY_EXPORT_MAX_NAME_LENGTH = 'mm9pdy-codeplug-tool.export.maxNameLength';
export const STORAGE_KEY_EXPORT_NAME_MODE_OVERRIDE = 'mm9pdy-codeplug-tool.export.nameModeOverride';
export const STORAGE_KEY_EXPORT_USE_TG_ABBREVIATION =
  'mm9pdy-codeplug-tool.export.useTalkGroupAbbreviation';
export const STORAGE_KEY_EXPORT_USE_CHANNEL_ABBREVIATION =
  'mm9pdy-codeplug-tool.export.useChannelAbbreviation';
export const STORAGE_KEY_EXPORT_MULTI_TG_NAME_MODE =
  'mm9pdy-codeplug-tool.export.multiTalkGroupExportNameMode';
export const STORAGE_KEY_EXPORT_SCRATCH_CHANNELS =
  'mm9pdy-codeplug-tool.export.exportScratchChannels';
export const STORAGE_KEY_EXPORT_ZONE_DERIVED_SCAN_LISTS =
  'mm9pdy-codeplug-tool.export.exportZoneDerivedScanLists';

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
  useChannelAbbreviation: boolean;
  multiTalkGroupExportNameMode: MultiTalkGroupExportNameMode;
  /** Master gate for zone exportScratchChannel flags (default on). */
  exportScratchChannels: boolean;
  /** Master gate for zone exportScanList flags (default on). */
  exportZoneDerivedScanLists: boolean;
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

function readUseChannelAbbreviation(): boolean {
  return localStorage.getItem(STORAGE_KEY_EXPORT_USE_CHANNEL_ABBREVIATION) === 'true';
}

const MULTI_TG_EXPORT_NAME_MODES: MultiTalkGroupExportNameMode[] = [
  'append',
  'callsign_name_tg',
  'callsign_tg',
  'callsign_tg_abbrev',
  'suffix_tg_abbrev',
  'suffix_tg_number',
];

function readMultiTalkGroupExportNameMode(): MultiTalkGroupExportNameMode {
  const saved = localStorage.getItem(STORAGE_KEY_EXPORT_MULTI_TG_NAME_MODE);
  if (saved && MULTI_TG_EXPORT_NAME_MODES.includes(saved as MultiTalkGroupExportNameMode)) {
    return saved as MultiTalkGroupExportNameMode;
  }
  return DEFAULT_MULTI_TG_EXPORT_NAME_MODE;
}

function readExportScratchChannels(): boolean {
  return localStorage.getItem(STORAGE_KEY_EXPORT_SCRATCH_CHANNELS) !== 'false';
}

function readExportZoneDerivedScanLists(): boolean {
  return localStorage.getItem(STORAGE_KEY_EXPORT_ZONE_DERIVED_SCAN_LISTS) !== 'false';
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
    useChannelAbbreviation: settings.useChannelAbbreviation,
    multiTalkGroupExportNameMode: settings.multiTalkGroupExportNameMode,
    exportScratchChannels: settings.exportScratchChannels,
    exportZoneDerivedScanLists: settings.exportZoneDerivedScanLists,
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
  const [useChannelAbbreviation, setUseChannelAbbreviationState] = useState(
    readUseChannelAbbreviation,
  );
  const [multiTalkGroupExportNameMode, setMultiTalkGroupExportNameModeState] = useState(
    readMultiTalkGroupExportNameMode,
  );
  const [exportScratchChannels, setExportScratchChannelsState] =
    useState(readExportScratchChannels);
  const [exportZoneDerivedScanLists, setExportZoneDerivedScanListsState] = useState(
    readExportZoneDerivedScanLists,
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

  const setUseChannelAbbreviation = useCallback((value: boolean) => {
    setUseChannelAbbreviationState(value);
    localStorage.setItem(STORAGE_KEY_EXPORT_USE_CHANNEL_ABBREVIATION, String(value));
  }, []);

  const setMultiTalkGroupExportNameMode = useCallback((value: MultiTalkGroupExportNameMode) => {
    setMultiTalkGroupExportNameModeState(value);
    localStorage.setItem(STORAGE_KEY_EXPORT_MULTI_TG_NAME_MODE, value);
  }, []);

  const setExportScratchChannels = useCallback((value: boolean) => {
    setExportScratchChannelsState(value);
    localStorage.setItem(STORAGE_KEY_EXPORT_SCRATCH_CHANNELS, String(value));
  }, []);

  const setExportZoneDerivedScanLists = useCallback((value: boolean) => {
    setExportZoneDerivedScanListsState(value);
    localStorage.setItem(STORAGE_KEY_EXPORT_ZONE_DERIVED_SCAN_LISTS, String(value));
  }, []);

  const settings: ExportSettings = {
    shortenNames,
    maxNameLength,
    nameModeOverride,
    useTalkGroupAbbreviation,
    useChannelAbbreviation,
    multiTalkGroupExportNameMode,
    exportScratchChannels,
    exportZoneDerivedScanLists,
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
    useChannelAbbreviation,
    setUseChannelAbbreviation,
    multiTalkGroupExportNameMode,
    setMultiTalkGroupExportNameMode,
    exportScratchChannels,
    setExportScratchChannels,
    exportZoneDerivedScanLists,
    setExportZoneDerivedScanLists,
    exportOptionsFromSettings: (base: ExportOptions = {}) =>
      exportOptionsFromSettings(settings, base),
  };
}
