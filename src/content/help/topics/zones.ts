import type { HelpEntry } from '../types.ts';

export const zoneEntries: HelpEntry[] = [
  {
    id: 'zone.membership',
    title: 'Zone members',
    short: 'Channels in this zone, in the order the radio will step through them. Order matters.',
    learnMoreSlug: 'zones',
  },
  {
    id: 'zone.order',
    title: 'Member order',
    short:
      'The first channel in the list is typically the default when you select this zone on the radio.',
    learnMoreSlug: 'zones',
  },
  {
    id: 'zone.mapHull',
    title: 'Zone hull on map',
    short: 'The coloured outline groups member channels visually. It is not a coverage area.',
    learnMoreSlug: 'map',
  },
  {
    id: 'zone.includeInScanList',
    title: 'Include in scan list',
    short:
      'When scan export is enabled for DM32, only members with this checked (and not scan-skipped) join the generated scan list. Ignored on OpenGD77.',
    learnMoreSlug: 'zones',
  },
  {
    id: 'zone.exportScratchChannel',
    title: 'Export scratch channel',
    short:
      'DM32 only — on export, add a scratch channel for this zone so you can change TX contact from the radio menu. Needs the export master toggle too.',
    learnMoreSlug: 'zones',
  },
  {
    id: 'zone.exportScanList',
    title: 'Export scan list',
    short:
      'DM32 only — on export, build a scan list and optional carrier channel from flagged members. Ignored on OpenGD77 (zone is already the scan list).',
    learnMoreSlug: 'zones',
  },
  {
    id: 'zone.scanCarrier',
    title: 'Scan carrier frequency',
    short:
      'Simplex frequency for the scan carrier channel when scan export is enabled. Default 145.500 MHz if unset.',
    learnMoreSlug: 'zones',
  },
  {
    id: 'zone.fromDistance',
    title: 'Zone from distance',
    short:
      'Pick a centre on the map or by locator, filter channels by radius, and create a zone from the selection. Unlocated channels are listed separately.',
    learnMoreSlug: 'zones',
    body: `## Zone from distance

Set a search centre (coordinates, Maidenhead locator, address, or your location). Adjust the radius to filter the table and map. Selected channels become zone members in nearest-first order.`,
  },
  {
    id: 'entity.duplicate',
    title: 'Duplicate',
    short:
      'Copy this entity with a new name. Zone copies keep the same member channels; import metadata is not copied.',
    learnMoreSlug: 'getting-started',
  },
];
