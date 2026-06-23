import { resolveContactRefByWireName, resolveRxGroupListIdByName } from '../entityRefs.ts';
import { isAnalogMode, type ChannelMode } from '../channelModes.ts';
import type {
  Channel,
  ChannelModeProfile,
  Contact,
  RxGroupList,
  TalkGroup,
  Zone,
} from '../../models/codeplug.ts';
import { channelModeProfileDefaults } from '../../models/codeplug.ts';

/** Resolved export row — shared channel fields merged with one mode profile. */
export interface ExpandedChannelRow {
  sourceChannelId: string;
  wireName: string;
  mode: ChannelMode;
  bandwidthKHz: number | null;
  colourCode: number | null;
  timeslot: Channel['timeslot'];
  dmrId: number | null;
  rxTone: Channel['rxTone'];
  txTone: Channel['txTone'];
  squelch: number | null;
  contactRef: Channel['contactRef'];
  rxGroupListId: string | null;
  rxFrequency: number | null;
  txFrequency: number | null;
  location: Channel['location'];
  useLocation: boolean;
  power: number | null;
  rxOnly: boolean;
  aprsConfigName: string;
  voxEnabled: boolean;
  transmitTimeout: number | null;
  scanSkip: boolean;
  opengd77Extras: Record<string, string>;
}

export interface ExpandChannelOptions {
  /** Wire names already reserved (other channels + prior expanded rows). */
  reservedWireNames?: ReadonlySet<string>;
  /** Max display length before export warning (e.g. 1701 LCD). */
  maxNameLength?: number;
  warnings?: string[];
}

/** Build a profile from top-level channel mode-specific fields (single-mode path). */
export function profileFromChannelFields(channel: Channel): ChannelModeProfile {
  return {
    mode: channel.mode,
    bandwidthKHz: channel.bandwidthKHz,
    colourCode: channel.colourCode,
    timeslot: channel.timeslot,
    dmrId: channel.dmrId,
    rxTone: channel.rxTone,
    txTone: channel.txTone,
    squelch: channel.squelch,
    contactRef: channel.contactRef,
    rxGroupListId: channel.rxGroupListId,
  };
}

/** Effective mode profiles for a channel — synthetic from top-level when not multi-mode. */
export function resolveChannelModeProfiles(channel: Channel): ChannelModeProfile[] {
  if (channel.multiMode && channel.modeProfiles.length > 0) {
    return channel.modeProfiles;
  }
  return [profileFromChannelFields(channel)];
}

/** Suffix for derived export wire names per mode category. */
export function modeExportNameSuffix(mode: ChannelMode): string {
  return isAnalogMode(mode) ? '-F' : '-D';
}

/** Strip known multi-mode export suffixes for import grouping. */
export function stripModeExportSuffix(name: string): string {
  if (name.endsWith('-F') || name.endsWith('-D')) {
    return name.slice(0, -2);
  }
  return name;
}

function uniqueWireName(base: string, reserved: Set<string>): string {
  if (!reserved.has(base)) return base;
  let n = 2;
  while (reserved.has(`${base} ${n}`)) n++;
  return `${base} ${n}`;
}

function profileOpenGd77Extras(
  channel: Channel,
  profile: ChannelModeProfile,
): Record<string, string> {
  const wire = channel.meta?.imported?.multiModeProfileWire?.find((w) => w.mode === profile.mode);
  if (wire?.opengd77Extras) {
    return { ...channel.opengd77Extras, ...wire.opengd77Extras };
  }
  return channel.opengd77Extras;
}

function rowFromProfile(
  channel: Channel,
  profile: ChannelModeProfile,
  wireName: string,
): ExpandedChannelRow {
  return {
    sourceChannelId: channel.id,
    wireName,
    mode: profile.mode,
    bandwidthKHz: profile.bandwidthKHz,
    colourCode: profile.colourCode,
    timeslot: profile.timeslot,
    dmrId: profile.dmrId,
    rxTone: profile.rxTone,
    txTone: profile.txTone,
    squelch: profile.squelch,
    contactRef: profile.contactRef,
    rxGroupListId: profile.rxGroupListId,
    rxFrequency: channel.rxFrequency,
    txFrequency: channel.txFrequency,
    location: channel.location,
    useLocation: channel.useLocation,
    power: channel.power,
    rxOnly: channel.rxOnly,
    aprsConfigName: channel.aprsConfigName,
    voxEnabled: channel.voxEnabled,
    transmitTimeout: channel.transmitTimeout,
    scanSkip: channel.scanSkip,
    opengd77Extras: profileOpenGd77Extras(channel, profile),
  };
}

/** Expand one logical channel into export rows (1 row when single-mode). */
export function expandChannelForExport(
  channel: Channel,
  options: ExpandChannelOptions = {},
): ExpandedChannelRow[] {
  const reserved = new Set(options.reservedWireNames ?? []);
  const warnings = options.warnings;
  const profiles = resolveChannelModeProfiles(channel);

  if (!channel.multiMode || profiles.length <= 1) {
    const name = uniqueWireName(channel.name, reserved);
    reserved.add(name);
    if (options.maxNameLength != null && name.length > options.maxNameLength) {
      warnings?.push(`Channel name "${name}" exceeds ${options.maxNameLength} characters`);
    }
    return [rowFromProfile(channel, profiles[0], name)];
  }

  const rows: ExpandedChannelRow[] = [];
  for (const profile of profiles) {
    const suffix = modeExportNameSuffix(profile.mode);
    const candidate = uniqueWireName(`${channel.name}${suffix}`, reserved);
    reserved.add(candidate);
    if (options.maxNameLength != null && candidate.length > options.maxNameLength) {
      warnings?.push(
        `Derived channel name "${candidate}" exceeds ${options.maxNameLength} characters`,
      );
    }
    rows.push(rowFromProfile(channel, profile, candidate));
  }
  return rows;
}

/** Expand all channels for export, preserving order and unique wire names. */
export function expandAllChannelsForExport(
  channels: Channel[],
  options: Omit<ExpandChannelOptions, 'reservedWireNames'> = {},
): ExpandedChannelRow[] {
  const reserved = new Set<string>();
  const rows: ExpandedChannelRow[] = [];
  for (const ch of channels) {
    const expanded = expandChannelForExport(ch, { ...options, reservedWireNames: reserved });
    for (const row of expanded) {
      reserved.add(row.wireName);
      rows.push(row);
    }
  }
  return rows;
}

export interface ExpandZoneMembersOptions extends ExpandChannelOptions {
  maxMembers?: number;
}

/** Map zone logical member ids to export wire names (expanded for multi-mode). */
export function expandZoneMemberWireNames(
  zone: Zone,
  channels: Channel[],
  options: ExpandZoneMembersOptions = {},
): { names: string[]; warnings: string[] } {
  const byId = new Map(channels.map((ch) => [ch.id, ch]));
  const reserved = new Set(options.reservedWireNames ?? []);
  const warnings: string[] = [];
  const names: string[] = [];

  for (const memberId of zone.memberChannelIds) {
    const ch = byId.get(memberId);
    if (!ch) continue;
    const expanded = expandChannelForExport(ch, {
      ...options,
      reservedWireNames: reserved,
      warnings,
    });
    for (const row of expanded) {
      if (options.maxMembers != null && names.length >= options.maxMembers) {
        warnings.push(
          `Zone "${zone.name}" exceeds ${options.maxMembers} members after multi-mode expansion`,
        );
        return { names, warnings };
      }
      names.push(row.wireName);
      reserved.add(row.wireName);
    }
  }

  return { names, warnings };
}

export interface MergeImportChannelsResult {
  channels: Channel[];
  merged: { sourceNames: string[]; resultName: string }[];
}

function frequenciesMatch(a: Channel, b: Channel): boolean {
  return a.rxFrequency === b.rxFrequency && a.txFrequency === b.txFrequency;
}

function locationsMatch(a: Channel, b: Channel): boolean {
  if (a.location == null && b.location == null) return true;
  if (a.location == null || b.location == null) return false;
  return a.location.lat === b.location.lat && a.location.lon === b.location.lon;
}

function canMergePair(a: Channel, b: Channel): boolean {
  if (a.mode === b.mode) return false;
  const baseA = stripModeExportSuffix(a.name);
  const baseB = stripModeExportSuffix(b.name);
  if (baseA !== baseB) return false;
  if (!frequenciesMatch(a, b)) return false;
  if (!locationsMatch(a, b)) return false;
  const aAnalog = isAnalogMode(a.mode);
  const bAnalog = isAnalogMode(b.mode);
  return aAnalog !== bAnalog;
}

function mergeTwoChannels(primary: Channel, secondary: Channel): Channel {
  const fmSource = isAnalogMode(primary.mode) ? primary : secondary;
  const dmrSource = isAnalogMode(primary.mode) ? secondary : primary;
  const modeProfiles = [profileFromChannelFields(fmSource), profileFromChannelFields(dmrSource)];
  const imported = primary.meta?.imported ?? secondary.meta?.imported;
  return syncChannelFromPrimaryProfile({
    ...fmSource,
    name: stripModeExportSuffix(fmSource.name),
    multiMode: true,
    mode: 'fm',
    modeProfiles,
    meta: {
      imported: {
        formatId: imported?.formatId ?? 'opengd77',
        sourceFile: imported?.sourceFile ?? 'Channels.csv',
        importedAt: imported?.importedAt ?? new Date().toISOString(),
        multiModeProfileWire: [
          {
            mode: fmSource.mode,
            contactWireName: fmSource.meta?.imported?.contactWireName,
            rxGroupListWireName: fmSource.meta?.imported?.rxGroupListWireName,
            opengd77Extras: fmSource.opengd77Extras,
          },
          {
            mode: dmrSource.mode,
            contactWireName: dmrSource.meta?.imported?.contactWireName,
            rxGroupListWireName: dmrSource.meta?.imported?.rxGroupListWireName,
            opengd77Extras: dmrSource.opengd77Extras,
          },
        ],
      },
    },
  });
}

/** Best-effort collapse of paired flat import rows into multi-mode channels. */
export function mergeImportChannelsBestEffort(channels: Channel[]): MergeImportChannelsResult {
  const merged: MergeImportChannelsResult['merged'] = [];
  const used = new Set<string>();
  const result: Channel[] = [];

  for (let i = 0; i < channels.length; i++) {
    if (used.has(channels[i].id)) continue;
    let combined: Channel | null = null;

    for (let j = i + 1; j < channels.length; j++) {
      if (used.has(channels[j].id)) continue;
      if (canMergePair(channels[i], channels[j])) {
        combined = mergeTwoChannels(channels[i], channels[j]);
        used.add(channels[i].id);
        used.add(channels[j].id);
        merged.push({
          sourceNames: [channels[i].name, channels[j].name],
          resultName: combined.name,
        });
        break;
      }
    }

    if (combined) {
      result.push(combined);
    } else if (!used.has(channels[i].id)) {
      result.push(channels[i]);
      used.add(channels[i].id);
    }
  }

  return { channels: result, merged };
}

/** Sync top-level mode-specific fields from the primary profile (channel.mode). */
export function syncChannelFromPrimaryProfile(channel: Channel): Channel {
  if (!channel.multiMode || channel.modeProfiles.length === 0) {
    return channel;
  }
  const primary =
    channel.modeProfiles.find((p) => p.mode === channel.mode) ?? channel.modeProfiles[0];
  return {
    ...channel,
    mode: primary.mode,
    bandwidthKHz: primary.bandwidthKHz,
    colourCode: primary.colourCode,
    timeslot: primary.timeslot,
    dmrId: primary.dmrId,
    rxTone: primary.rxTone,
    txTone: primary.txTone,
    squelch: primary.squelch,
    contactRef: primary.contactRef,
    rxGroupListId: primary.rxGroupListId,
  };
}

/** Update or insert a profile on a multi-mode channel. */
export function upsertModeProfile(channel: Channel, profile: ChannelModeProfile): Channel {
  const existing = channel.modeProfiles.findIndex((p) => p.mode === profile.mode);
  const modeProfiles =
    existing >= 0
      ? channel.modeProfiles.map((p, i) => (i === existing ? profile : p))
      : [...channel.modeProfiles, profile];
  return syncChannelFromPrimaryProfile({ ...channel, multiMode: true, modeProfiles });
}

export function emptyModeProfile(mode: ChannelMode): ChannelModeProfile {
  return channelModeProfileDefaults(mode);
}

/** Resolve per-profile contact/RGL refs from multi-mode import merge wire stash. */
export function resolveMultiModeChannelProfiles(
  channels: Channel[],
  talkGroups: TalkGroup[],
  contacts: Contact[],
  rxGroupLists: RxGroupList[],
): Channel[] {
  return channels.map((ch) => {
    const wires = ch.meta?.imported?.multiModeProfileWire;
    if (!ch.multiMode || !wires?.length) return ch;

    const modeProfiles = ch.modeProfiles.map((profile) => {
      const wire = wires.find((w) => w.mode === profile.mode);
      if (!wire) return profile;

      let contactRef = profile.contactRef;
      if (!contactRef && wire.contactWireName) {
        contactRef = resolveContactRefByWireName(wire.contactWireName, talkGroups, contacts);
      }

      let rxGroupListId = profile.rxGroupListId;
      if (!rxGroupListId && wire.rxGroupListWireName) {
        rxGroupListId = resolveRxGroupListIdByName(wire.rxGroupListWireName, rxGroupLists);
      }

      return { ...profile, contactRef, rxGroupListId };
    });

    return syncChannelFromPrimaryProfile({ ...ch, modeProfiles });
  });
}
