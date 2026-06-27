import type { HelpEntry } from '../types.ts';

export const importExportEntries: HelpEntry[] = [
  {
    id: 'importExport.overview',
    title: 'Import & export',
    short:
      'Import merges into your **active** project. Export downloads CPS files for your chosen radio format. One project can export to several formats.',
    learnMoreSlug: 'importing',
    body: `## Import & export

This page is for an **open** project:

- **Import** — merge or overwrite entities from a CPS export into the project you have open.
- **Export** — download files your vendor CPS can read.

Import on **Home** always starts a **new** project instead.`,
  },
  {
    id: 'importExport.mergeVsOverwrite',
    title: 'Merge vs overwrite',
    short:
      'Merge updates matching entities by name and leaves others untouched. Overwrite replaces whole entity types from the import file.',
    learnMoreSlug: 'importing',
    body: `## Merge vs overwrite

**Merge (default)** — only entity types in the import are touched. Channels, zones, and talk groups match by name (case-sensitive). Re-importing the same file is safe — unchanged data stays as-is.

**Overwrite** — replaces the entire list for each entity type in the import. Use when you want a clean swap, not a patch.`,
  },
  {
    id: 'importExport.formatPicker',
    title: 'Format selection',
    short:
      'Choose the CPS format you are importing. We do not auto-detect — pick OpenGD77, DM32, CHIRP, or native YAML. Multi-file formats accept a folder drop.',
    learnMoreSlug: 'importing',
  },
  {
    id: 'importExport.lossyBoundary',
    title: 'Lossy export',
    short:
      'Not every format stores every field. DMR details are dropped on CHIRP export; DTMF and APRS files are not modelled for OpenGD77. Check export notes after download.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOrder',
    title: 'Export name pipeline',
    short:
      'Names are built in order: radio profile → compose base name → split multi-mode / fan-out talk groups → shorten to fit limits.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.dm32ZoneExport',
    title: 'DM32 zone-derived export',
    short:
      'Scratch channels and scan lists need both a per-zone flag **and** these master toggles on. OpenGD77 ignores zone export flags.',
    formats: ['dm32'],
    learnMoreSlug: 'zones',
    body: `## DM32 zone-derived export

Two levels must agree:

1. **Per zone** — enable scratch channel or scan list on the zone edit page.
2. **Here on export** — master toggles must be on for this download.

If a master toggle is off, no scratch or scan output is emitted even when zones are flagged.`,
  },
  {
    id: 'importExport.oneProjectManyFormats',
    title: 'One project, many radios',
    short:
      'Design once, export separately to OpenGD77, DM32, CHIRP, or native YAML. Each format reshapes the layout for that radio — row counts and columns will differ.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.unresolvedZoneMembers',
    title: 'Unresolved zone members',
    short:
      'A zone references a channel name that is not in this import. The zone is imported but those slots stay empty until you add or import the missing channels.',
    learnMoreSlug: 'zones',
  },
  {
    id: 'importExport.exportOptions.radioProfile',
    title: 'Radio profile',
    short:
      'Sets name length limits, power levels, and capacity caps for the target hardware. Pick this first — other export options depend on it.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOptions.shortenNames',
    title: 'Shorten long channel names',
    short:
      'When on, names longer than the target length are abbreviated at export. This switch also enables the other name options below.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOptions.maxNameLength',
    title: 'Target name length',
    short:
      'Maximum characters for channel names on export. Leave empty to use the radio profile default (pick a profile first).',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOptions.nameModeOverride',
    title: 'Export name mode override',
    short:
      "Force one name style for **all** channels on this export only. Differs from each channel's own export name mode in the channel editor.",
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOptions.useChannelAbbreviation',
    title: 'Use channel abbreviations',
    short:
      'Prefer the channel abbreviation when composing export names — useful when names must fit a short limit.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOptions.useTalkGroupAbbreviation',
    title: 'Use talk group abbreviations',
    short: 'DM32 only — use talk group abbreviations in multi-talkgroup export name suffixes.',
    formats: ['dm32'],
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOptions.multiTalkGroupExportNameMode',
    title: 'Multi-talkgroup export name style',
    short:
      'DM32 only — how channel names are formed when an RX group list is expanded into one row per talk group.',
    formats: ['dm32'],
    learnMoreSlug: 'exporting',
  },
  {
    id: 'importExport.exportOptions.exportScratchChannels',
    title: 'Export scratch channels',
    short:
      'DM32 only — emit scratch channels for zones with **Export scratch channel** enabled. Turn off to skip all scratch rows for this download.',
    formats: ['dm32'],
    learnMoreSlug: 'zones',
  },
  {
    id: 'importExport.exportOptions.exportZoneDerivedScanLists',
    title: 'Export scan lists',
    short:
      'DM32 only — build Scan.csv and scan carrier channels for zones with **Export scan list** enabled. Turn off to skip scan synthesis.',
    formats: ['dm32'],
    learnMoreSlug: 'zones',
  },
];
