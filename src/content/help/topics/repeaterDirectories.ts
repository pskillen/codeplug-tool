import type { HelpEntry } from '../types.ts';

export const repeaterEntries: HelpEntry[] = [
  {
    id: 'repeater.ukrepeater',
    title: 'ukrepeater.net',
    short:
      'Search RSGB ETCC listings and add repeaters to your codeplug. Use the search mode dropdown or Auto; the pipeline panel shows each step.',
    learnMoreSlug: 'editing-channels',
    body: `## ukrepeater.net

Search by postcode, town, callsign, keeper, locator, or band. **My location** uses your browser position to find nearby repeaters.

The **How this search ran** panel lists geocoding, API calls, and filters — useful when results look wrong.`,
  },
  {
    id: 'repeater.brandmeister',
    title: 'BrandMeister',
    short:
      'Look up DMR repeaters on the BrandMeister network. Optionally create matching talk groups and an RX group list when adding a channel.',
    learnMoreSlug: 'editing-channels',
    body: `## BrandMeister

Add channels from network listings or **Look up** on the channel editor. **Check BrandMeister** on detail pages compares your data to the network and can suggest RX list corrections.`,
  },
];

export const mapEntries: HelpEntry[] = [
  {
    id: 'map.overview',
    title: 'Channel map',
    short:
      'Plots channels with valid coordinates. Zone hulls show grouping, not coverage. Configure tiles and grid on Settings.',
    learnMoreSlug: 'map',
    body: `## The map

Channels need **Use location** and coordinates to appear. FM and DMR use different marker colours. Co-located channels merge into one marker.

Zone hulls are a visual grouping aid — they do not represent RF coverage.`,
  },
];

export const persistenceEntries: HelpEntry[] = [
  {
    id: 'settings.mapTiles',
    title: 'Map tiles',
    short:
      'OpenStreetMap works with no API key. Mapbox streets or satellite need a token stored only in your browser.',
    learnMoreSlug: 'map',
  },
  {
    id: 'settings.mapboxToken',
    title: 'Mapbox token',
    short:
      'Stored in your browser only — never sent to our servers. Used for Mapbox tiles and optional geocoding.',
    learnMoreSlug: 'map',
  },
  {
    id: 'settings.exportPrefs',
    title: 'Export preferences',
    short:
      'Default name-shortening options for all exports. Override per download on Import & export.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'settings.googleDrive',
    title: 'Google Drive',
    short:
      'Save or open codeplug files on Google Drive. This is file interchange — your working copy still lives in the browser.',
    learnMoreSlug: 'saving-syncing',
  },
  {
    id: 'reference.overview',
    title: 'Reference tools',
    short: 'Lookup tables and converters available without opening a project.',
    learnMoreSlug: 'reference-tools',
  },
  {
    id: 'reference.bandPlan',
    title: 'Band plan',
    short: 'UK amateur band allocations and common receive services for quick frequency lookup.',
    learnMoreSlug: 'reference-tools',
  },
  {
    id: 'reference.maidenhead',
    title: 'Maidenhead converter',
    short: 'Convert between Maidenhead locators and latitude/longitude.',
    learnMoreSlug: 'reference-tools',
  },
  {
    id: 'empty.channels',
    title: 'No channels',
    short: 'Import a codeplug or create your first channel to get started.',
    learnMoreSlug: 'getting-started',
  },
  {
    id: 'empty.zones',
    title: 'No zones',
    short: 'Zones group channels for on-radio switching. Create one or import from your CPS.',
    learnMoreSlug: 'zones',
  },
  {
    id: 'empty.talkGroups',
    title: 'No talk groups',
    short: 'Talk groups are DMR group calls. Import a DMR codeplug or add them here.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
  },
  {
    id: 'empty.contacts',
    title: 'No contacts',
    short: 'Private and DTMF contacts live here. DMR imports usually populate this automatically.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
  },
  {
    id: 'empty.rxGroupLists',
    title: 'No RX group lists',
    short:
      'RX group lists define which talk groups a channel can receive. Common on DMR codeplugs.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
  },
  {
    id: 'empty.quota',
    title: 'Storage full',
    short:
      'Your browser storage limit was reached. Remove old projects or export to native YAML / cloud before continuing.',
    learnMoreSlug: 'saving-syncing',
  },
];
