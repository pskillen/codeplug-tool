import type { HelpEntry, HelpHubTopicId } from '../types.ts';

export const hubTopics: HelpHubTopicId[] = [
  'what-is-this',
  'getting-started',
  'importing',
  'editing-channels',
  'zones',
  'talk-groups-contacts-rgl',
  'exporting',
  'map',
  'saving-syncing',
  'glossary',
  'reference-tools',
  'faq',
];

export const hubEntries: HelpEntry[] = [
  {
    id: 'what-is-this',
    title: "What this tool is (and isn't)",
    short:
      'Design a codeplug layout in the browser; export for your CPS; flash the radio in vendor software.',
    body: `This tool helps you **design** a codeplug layout — channels, zones, talk groups, and contacts — with a clearer UI than most CPS packages.

It does **not** write your radio's binary codeplug. You export to a format your CPS already understands (usually CSV), import there, and flash the radio as you do today.

Your work saves in your browser. Nothing is uploaded unless you choose cloud save.`,
  },
  {
    id: 'getting-started',
    title: 'Getting started',
    short: 'Start fresh, import on Home, or merge on Import & export.',
    body: `## Create or open

- **Home → Start fresh** — new blank project.
- **Home → Import** — new project from a CPS export.
- **Import & export → Import** — add to the project you have open (merge or overwrite).

## Edit

Use Channels, Zones, and the other sections. Changes save automatically.

## Export

**Import & export → Export** — pick your radio format and download. You can export the same project to OpenGD77, DM32, and CHIRP for different radios.`,
  },
  {
    id: 'importing',
    title: 'Importing your codeplug',
    short: 'Pick format explicitly; folder drop for multi-file exports; merge is safe to repeat.',
    body: `## Formats

| Format | Files |
| --- | --- |
| OpenGD77 | Folder of CSVs (Channels, Zones, Contacts, TG_Lists, …) |
| DM32 | Folder of CSVs |
| CHIRP | Single channels CSV |
| Native YAML | Single YAML file (this tool's own format) |

## Merge vs overwrite

**Merge** updates what changed and leaves the rest alone. **Overwrite** replaces whole entity types.

Some files are skipped by design (e.g. OpenGD77 DTMF/APRS stubs) — that is normal.

## Re-importing

Importing the same CPS again after no edits does nothing harmful — merge is idempotent.`,
  },
  {
    id: 'editing-channels',
    title: 'Editing channels',
    short: 'Single or multi-mode; TX contact and RX group list for DMR; map needs coordinates.',
    body: `## Modes

A channel can be single-mode or **multi-mode** (e.g. FM + DMR on one repeater). Digital fields (colour code, timeslot, DMR ID) apply to DMR; tones and bandwidth mainly apply to analogue.

## DMR references

- **TX contact** — what you transmit on (talk group or private contact).
- **RX group list** — what you can receive. Behaviour on export depends on your target radio (see Exporting).

## Names

**Callsign** is the site id; **name** is a qualifier. **Export name mode** controls how they combine in the CPS file.`,
  },
  {
    id: 'zones',
    title: 'Zones',
    short: 'Group channels for switching; order matters; scan semantics differ by radio.',
    body: `Zones are how you group channels on the radio face.

**OpenGD77:** the zone **is** the scan list — member order is scan order.

**DM32:** scanning is separate. You can flag members for scan export and optionally emit a scan list and carrier channel when exporting to DM32 (zone flag + export master toggle).

**Zone from distance** builds a zone from channels near a map point.`,
  },
  {
    id: 'talk-groups-contacts-rgl',
    title: 'Talk groups, contacts & RX group lists',
    short: 'Group calls, privates, and promiscuous receive lists.',
    body: `## Talk groups vs contacts

- **Talk group** — DMR group call (one per DMR ID).
- **Contact** — private call or DTMF.

Names cannot collide between talk groups and contacts.

## RX group lists

Ordered lists of talk groups (and contacts) a channel can **receive**. On OpenGD77 the channel references the list. On DM32 export may create one channel row per member.

## Timeslots

Per-repeater timeslot is set on **RX group list membership**, not on the talk group itself. OpenGD77 export may create \`Scotland T1\` / \`Scotland T2\` wire names when slots differ.

Use **Find merge candidates** on Talk groups if import left duplicate slot-suffixed names.`,
  },
  {
    id: 'exporting',
    title: 'Exporting for your radio',
    short:
      'Pick profile first; names are composed then optionally shortened; formats reshape differently.',
    body: `## Order of operations

1. Radio profile (limits and power ladder)
2. Compose channel names (per-channel or global override)
3. Expand multi-mode rows and/or RX group list members (format-specific)
4. Shorten names to fit limits

## One project, many radios

The same layout exports differently:

- **OpenGD77** — one row per channel; RX lists in a separate file; multi-mode splits to \`-F\`/\`-D\`.
- **DM32** — may duplicate channels per RX list member; optional zone scratch and scan synthesis.
- **CHIRP** — analogue channels only; DMR fields are not exported.

## Lossy edges

CHIRP drops digital fields. OpenGD77 DTMF/APRS are not fully modelled. Check warnings after export.`,
  },
  {
    id: 'map',
    title: 'The map',
    short: 'Channels with location; zone hulls for grouping; Settings for tiles.',
    body: `The inset map on Summary, Channels, and Zones shows channels that have **Use location** and valid coordinates.

Zone hulls outline member groups — they are not coverage predictions.

Set tile provider and optional Mapbox token on **Settings**. Maidenhead grid overlay is optional.`,
  },
  {
    id: 'saving-syncing',
    title: 'Saving & syncing',
    short: 'Auto-save to browser; optional YAML or Google Drive interchange.',
    body: `Your project auto-saves to browser storage.

**Native YAML** export/import is lossless for this tool's own format.

**Google Drive** saves a copy of your file — open it later to restore. It does not replace live browser storage while you edit.`,
  },
  {
    id: 'glossary',
    title: 'Glossary',
    short: 'Terms used in this tool.',
    body: '', // filled from glossary.ts at render time
  },
  {
    id: 'reference-tools',
    title: 'Reference tools',
    short: 'In-app lookup utilities.',
    body: `- [Band plan](/reference/band-plan) — UK allocations and services
- [Maidenhead](/reference/maidenhead) — locator ↔ coordinates`,
  },
  {
    id: 'faq',
    title: 'FAQ & troubleshooting',
    short: 'Common questions.',
    body: `## Why does my export look different per radio?

Each CPS format has different rules. DM32 duplicates channels for RX list members; OpenGD77 does not. Multi-mode may split on OpenGD77 but not on DM32.

## Why were rows split or duplicated?

Usually multi-mode (\`-F\`/\`-D\`) or RX group list expansion on DM32. Check export format and zone/RX settings.

## Why did a field disappear?

Cross-format export is lossy at the edges. CHIRP is analogue-only. Export notes list truncations.

## Storage full?

Delete old projects on Home or export to YAML/Drive. Browser storage has a finite quota.`,
  },
];
