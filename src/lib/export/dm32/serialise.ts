import type { Codeplug, Channel } from '../../../models/codeplug.ts';
import { channelFieldDefaults } from '../../../models/codeplug.ts';
import {
  expandAllChannelsForExport,
  expandZoneMemberWireNames,
  type ExpandedChannelRow,
} from '../../channelExpansion/index.ts';
import {
  expandOptionsFromExport,
  effectiveMaxNameLength,
} from '../../channelExpansion/exportOptions.ts';
import { formatCsv } from '../csvWrite.ts';
import type { ExportOptions } from '../../import-export/types.ts';
import { DEFAULT_DM32_PROFILE_ID, getDm32Profile } from '../../dm32/profiles.ts';
import {
  CHANNEL_HEADERS,
  CONTACT_COL,
  CONTACT_HEADERS,
  DTMF_CONTACT_COL,
  DTMF_CONTACT_HEADERS,
  DM32_EXPORT_FILE_NAMES,
  DM32_NON_EXPANDABLE_RX_GROUP_LISTS,
  RX_GROUP_LIST_COL,
  RX_GROUP_LIST_HEADERS,
  TALKGROUP_COL,
  TALKGROUP_HEADERS,
  ZONE_COL,
  ZONE_HEADERS,
  SCAN_HEADERS,
  type Dm32ExportFileName,
} from '../../import/dm32/columns.ts';
import { serialiseDm32ChannelRow } from './channelWire.ts';
import { serialiseDerivedScanLists } from './scanWire.ts';
import { rxGroupListExportMemberNames } from './listWire.ts';
import { buildDm32TalkGroupWireNameMap } from './talkGroupWire.ts';
import {
  buildZoneScanExportPlan,
  scanListNameForCarrierWireName,
} from '../../zoneDerivedScanLists/index.ts';

export type Dm32ExportFiles = Record<Dm32ExportFileName, string>;

function padRow(headers: string[], values: Record<string, string>): string[] {
  return headers.map((h) => values[h] ?? '');
}

function dm32ExpandOptions(codeplug: Codeplug, options?: ExportOptions, warnings?: string[]) {
  return expandOptionsFromExport(
    codeplug,
    {
      expandModes: false,
      expandRxGroupLists: true,
      skipExpandWhenTxContactSet: true,
      nonExpandableRxGroupListNames: [...DM32_NON_EXPANDABLE_RX_GROUP_LISTS],
      profileId: options?.profileId,
      shortenNames: options?.shortenNames,
      maxNameLength: options?.maxNameLength,
      nameModeOverride: options?.nameModeOverride,
      useTalkGroupAbbreviation: options?.useTalkGroupAbbreviation,
      useChannelAbbreviation: options?.useChannelAbbreviation,
      multiTalkGroupExportNameMode: options?.multiTalkGroupExportNameMode,
      exportScratchChannels: options?.exportScratchChannels,
      exportZoneDerivedScanLists: options?.exportZoneDerivedScanLists,
    },
    warnings,
  );
}

function dm32MaxNameLength(options: ExportOptions | undefined, profileId: string): number {
  const profile = getDm32Profile(profileId);
  return effectiveMaxNameLength(options, profile.nameLimit);
}

export function serialiseDm32Files(codeplug: Codeplug, options?: ExportOptions): Dm32ExportFiles {
  const warnings: string[] = [];
  const talkGroupWireNames = buildDm32TalkGroupWireNameMap(codeplug.talkGroups, options);
  const profileId = options?.profileId ?? DEFAULT_DM32_PROFILE_ID;
  const profile = getDm32Profile(profileId);
  const expandOpts = dm32ExpandOptions(codeplug, options, warnings);
  const scanPlan = buildZoneScanExportPlan(
    codeplug,
    { ...expandOpts, maxNameLength: dm32MaxNameLength(options, profileId) },
    options,
    profile.scanListMembers,
  );
  warnings.push(...scanPlan.warnings);

  const files: Dm32ExportFiles = {
    'Channels.csv': serialiseChannels(codeplug, options, talkGroupWireNames, scanPlan, warnings),
    'Zones.csv': serialiseZones(codeplug, options, scanPlan),
    'Talkgroups.csv': serialiseTalkGroups(codeplug, talkGroupWireNames),
    'Contacts.csv': serialiseDmrContacts(codeplug),
    'RXGroupLists.csv': serialiseRxGroupLists(codeplug, talkGroupWireNames),
    'DTMFContacts.csv': serialiseDtmfContacts(codeplug),
    'Scan.csv':
      scanPlan.scanLists.length > 0
        ? serialiseDerivedScanLists(scanPlan.scanLists)
        : formatCsv(SCAN_HEADERS, []),
  };
  return files;
}

function syntheticSourceChannel(row: ExpandedChannelRow): Channel {
  return {
    ...channelFieldDefaults(),
    id: row.sourceChannelId,
    name: row.wireName,
    callsign: '',
    exportNameMode: 'name_only',
    mode: row.mode,
    rxFrequency: row.rxFrequency,
    txFrequency: row.txFrequency,
    contactRef: row.contactRef,
    rxGroupListId: row.rxGroupListId,
    location: row.location,
    useLocation: row.useLocation,
    bandwidthKHz: row.bandwidthKHz,
    colourCode: row.colourCode,
    timeslot: row.timeslot,
    dmrId: row.dmrId,
    rxTone: row.rxTone,
    txTone: row.txTone,
    squelch: row.squelch,
    power: row.power,
    opengd77Extras: row.opengd77Extras,
    multiMode: false,
    modeProfiles: [],
  };
}

export function serialiseChannels(
  codeplug: Codeplug,
  options?: ExportOptions,
  talkGroupWireNames?: ReturnType<typeof buildDm32TalkGroupWireNameMap>,
  scanPlan?: ReturnType<typeof buildZoneScanExportPlan>,
  warnings?: string[],
): string {
  const profileId = options?.profileId ?? DEFAULT_DM32_PROFILE_ID;
  const expandOpts = dm32ExpandOptions(codeplug, options, warnings);
  const expanded = [
    ...expandAllChannelsForExport(codeplug.channels, {
      ...expandOpts,
      maxNameLength: dm32MaxNameLength(options, profileId),
    }),
    ...(scanPlan?.carrierRows ?? []),
  ];
  const byId = new Map(codeplug.channels.map((ch) => [ch.id, ch]));
  const rows = expanded.map((row, i) => {
    const source = byId.get(row.sourceChannelId) ?? syntheticSourceChannel(row);
    const scanListName = scanPlan ? scanListNameForCarrierWireName(scanPlan, row.wireName) : null;
    return padRow(
      CHANNEL_HEADERS,
      serialiseDm32ChannelRow(
        row,
        source,
        codeplug,
        profileId,
        i + 1,
        talkGroupWireNames,
        scanListName,
      ),
    );
  });
  return formatCsv(CHANNEL_HEADERS, rows);
}

export function serialiseZones(
  codeplug: Codeplug,
  options?: ExportOptions,
  scanPlan?: ReturnType<typeof buildZoneScanExportPlan>,
): string {
  const profileId = options?.profileId ?? DEFAULT_DM32_PROFILE_ID;
  const expandOpts = dm32ExpandOptions(codeplug, options);
  const rows = codeplug.zones.map((zone, i) => {
    const { names } = expandZoneMemberWireNames(zone, codeplug.channels, {
      ...expandOpts,
      maxNameLength: dm32MaxNameLength(options, profileId),
    });
    const carrier = scanPlan?.carrierWireNameByZoneId.get(zone.id);
    const memberNames = carrier ? [carrier, ...names] : names;
    return padRow(ZONE_HEADERS, {
      [ZONE_COL.number]: String(i + 1),
      [ZONE_COL.name]: zone.name,
      [ZONE_COL.members]: memberNames.join('|'),
    });
  });
  return formatCsv(ZONE_HEADERS, rows);
}

export function serialiseTalkGroups(
  codeplug: Codeplug,
  talkGroupWireNames: ReturnType<typeof buildDm32TalkGroupWireNameMap>,
): string {
  const rows = codeplug.talkGroups.map((tg, i) =>
    padRow(TALKGROUP_HEADERS, {
      [TALKGROUP_COL.number]: String(i + 1),
      [TALKGROUP_COL.name]: talkGroupWireNames.get(tg.id) ?? tg.name,
      [TALKGROUP_COL.id]: tg.number,
      [TALKGROUP_COL.type]: tg.callType === 'private' ? 'Private Call' : 'Group Call',
    }),
  );
  return formatCsv(TALKGROUP_HEADERS, rows);
}

export function serialiseDmrContacts(codeplug: Codeplug): string {
  const dmr = codeplug.contacts.filter((c) => c.signalingMode === 'dmr');
  const rows = dmr.map((contact, i) =>
    padRow(CONTACT_HEADERS, {
      [CONTACT_COL.number]: String(i + 1),
      [CONTACT_COL.id]: contact.identifier,
      [CONTACT_COL.repeater]: '',
      [CONTACT_COL.name]: contact.name,
      [CONTACT_COL.city]: '',
      [CONTACT_COL.province]: '',
      [CONTACT_COL.country]: '',
      [CONTACT_COL.remark]: '',
      [CONTACT_COL.type]: 'Private Call',
      [CONTACT_COL.alertCall]: '0',
    }),
  );
  return formatCsv(CONTACT_HEADERS, rows);
}

export function serialiseDtmfContacts(codeplug: Codeplug): string {
  const dtmf = codeplug.contacts.filter((c) => c.signalingMode === 'dtmf');
  const rows = dtmf.map((contact, i) =>
    padRow(DTMF_CONTACT_HEADERS, {
      [DTMF_CONTACT_COL.number]: String(i + 1),
      [DTMF_CONTACT_COL.name]: contact.name,
      [DTMF_CONTACT_COL.id]: contact.identifier,
    }),
  );
  return formatCsv(DTMF_CONTACT_HEADERS, rows);
}

export function serialiseRxGroupLists(
  codeplug: Codeplug,
  talkGroupWireNames: ReturnType<typeof buildDm32TalkGroupWireNameMap>,
): string {
  const rows = codeplug.rxGroupLists.map((list, i) =>
    padRow(RX_GROUP_LIST_HEADERS, {
      [RX_GROUP_LIST_COL.number]: String(i + 1),
      [RX_GROUP_LIST_COL.name]: list.name,
      [RX_GROUP_LIST_COL.members]: rxGroupListExportMemberNames(
        list,
        codeplug,
        talkGroupWireNames,
      ).join('|'),
    }),
  );
  return formatCsv(RX_GROUP_LIST_HEADERS, rows);
}

export { DM32_EXPORT_FILE_NAMES };
