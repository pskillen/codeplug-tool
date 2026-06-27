import type { VendorFormatId } from '../../lib/import-export/types.ts';

/** Hub topic slugs (URL segment after /help/) */
export type HelpHubTopicId =
  | 'what-is-this'
  | 'getting-started'
  | 'importing'
  | 'editing-channels'
  | 'zones'
  | 'talk-groups-contacts-rgl'
  | 'exporting'
  | 'map'
  | 'saving-syncing'
  | 'glossary'
  | 'reference-tools'
  | 'faq';

export type HelpTopicId =
  | HelpHubTopicId
  | 'gettingStarted.home'
  | 'gettingStarted.privacy'
  | 'import.newProjectOnly'
  | 'project.metadata'
  | 'project.targetRadios'
  | 'project.dashboard'
  | 'project.metadataExport'
  | 'importExport.overview'
  | 'importExport.mergeVsOverwrite'
  | 'importExport.formatPicker'
  | 'importExport.lossyBoundary'
  | 'importExport.exportOrder'
  | 'importExport.dm32ZoneExport'
  | 'importExport.oneProjectManyFormats'
  | 'importExport.unresolvedZoneMembers'
  | 'importExport.exportOptions.shortenNames'
  | 'importExport.exportOptions.maxNameLength'
  | 'importExport.exportOptions.nameModeOverride'
  | 'importExport.exportOptions.useChannelAbbreviation'
  | 'importExport.exportOptions.useTalkGroupAbbreviation'
  | 'importExport.exportOptions.multiTalkGroupExportNameMode'
  | 'importExport.exportOptions.radioProfile'
  | 'importExport.exportOptions.exportScratchChannels'
  | 'importExport.exportOptions.exportZoneDerivedScanLists'
  | 'channel.multiMode'
  | 'channel.txContact'
  | 'channel.rxGroupList'
  | 'channel.exportNameMode'
  | 'channel.mergeCandidates'
  | 'channel.mapFilters'
  | 'channel.rxOnly'
  | 'channel.callsign'
  | 'repeater.ukrepeater'
  | 'repeater.brandmeister'
  | 'zone.membership'
  | 'zone.order'
  | 'zone.mapHull'
  | 'zone.includeInScanList'
  | 'zone.exportScratchChannel'
  | 'zone.exportScanList'
  | 'zone.scanCarrier'
  | 'zone.fromDistance'
  | 'entity.duplicate'
  | 'talkGroup.namespace'
  | 'talkGroup.mergeCandidates'
  | 'talkGroup.abbreviation'
  | 'rxGroupList.promiscuous'
  | 'rxGroupList.memberTimeslot'
  | 'rxGroupList.memberCaps'
  | 'map.overview'
  | 'settings.mapTiles'
  | 'settings.mapboxToken'
  | 'settings.exportPrefs'
  | 'settings.googleDrive'
  | 'reference.overview'
  | 'reference.bandPlan'
  | 'reference.maidenhead'
  | 'empty.channels'
  | 'empty.zones'
  | 'empty.talkGroups'
  | 'empty.contacts'
  | 'empty.rxGroupLists'
  | 'empty.quota';

export interface HelpEntry {
  id: HelpTopicId;
  title: string;
  short: string;
  body?: string;
  formats?: VendorFormatId[];
  learnMoreSlug?: HelpHubTopicId;
}

export type VarianceId =
  | 'rxGroupListExport'
  | 'multiModeExport'
  | 'zoneAndScan'
  | 'zoneDerivedExport'
  | 'exportNamePipeline';

export interface FormatVarianceRow {
  aspect: string;
  opengd77: string;
  dm32: string;
  chirp: string;
}
