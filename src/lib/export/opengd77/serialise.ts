import type { Codeplug } from '../../../models/codeplug.ts';
import { mapModeToOpenGd77ChannelType } from '../../channelModes.ts';
import { formatCsv } from '../csvWrite.ts';
import type { ExportOptions } from '../../import-export/types.ts';
import { DEFAULT_OPENGD77_PROFILE_ID, getOpenGd77Profile } from '../../opengd77/profiles.ts';
import {
  formatOpenGd77BandwidthWire,
  formatOpenGd77ColourCodeWire,
  formatOpenGd77DmrIdWire,
  formatOpenGd77FrequencyWire,
  formatOpenGd77PowerWire,
  formatOpenGd77SquelchWire,
  formatOpenGd77TimeslotWire,
  formatOpenGd77ToneWire,
  formatOpenGd77TransmitTimeoutWire,
} from './channelWire.ts';
import { contactRefWireNameForExport, rxGroupListWireNameForExport } from '../../entityRefs.ts';
import { rxGroupListExportMemberNames, zoneExportMemberNames } from '../../entityProvenance.ts';

/** OpenGD77 CSV serialisers — wire format in docs/reference/opengd77/;
 *  1701 profile limits in docs/reference/opengd77/radios/baofeng-1701.md. */
import {
  CHANNEL_COL,
  CHANNEL_HEADERS,
  CONTACT_COL,
  CONTACT_HEADERS,
  RX_GROUP_LIST_COL,
  RX_GROUP_LIST_HEADERS,
  VENDOR_EXTRA_HEADERS,
  wireVoxEnabled,
  wireYesNo,
  ZONE_HEADERS,
  zoneMemberHeaders,
  rxGroupListMemberHeaders,
  DTMF_HEADERS,
  APRS_HEADERS,
} from '../../import/opengd77/columns.ts';

function padRow(headers: string[], values: Record<string, string>): string[] {
  return headers.map((h) => values[h] ?? '');
}

export function serialiseChannels(codeplug: Codeplug, profileId?: string): string {
  const profile = getOpenGd77Profile(profileId ?? DEFAULT_OPENGD77_PROFILE_ID);
  // Channel Number is assigned at export (1..n in channel list order), not stored in the model.
  const rows = codeplug.channels.map((ch, i) => {
    const values: Record<string, string> = {
      [CHANNEL_COL.number]: String(i + 1),
      [CHANNEL_COL.name]: ch.name,
      [CHANNEL_COL.type]: mapModeToOpenGd77ChannelType(ch.mode),
      [CHANNEL_COL.rx]: formatOpenGd77FrequencyWire(ch.rxFrequency),
      [CHANNEL_COL.tx]: formatOpenGd77FrequencyWire(ch.txFrequency),
      [CHANNEL_COL.bandwidth]: formatOpenGd77BandwidthWire(ch.bandwidthKHz),
      [CHANNEL_COL.colourCode]: formatOpenGd77ColourCodeWire(ch.colourCode),
      [CHANNEL_COL.timeslot]: formatOpenGd77TimeslotWire(ch.timeslot),
      [CHANNEL_COL.contact]: contactRefWireNameForExport(ch, codeplug),
      [CHANNEL_COL.tgList]: rxGroupListWireNameForExport(ch, codeplug),
      [CHANNEL_COL.dmrId]: formatOpenGd77DmrIdWire(ch.mode, ch.dmrId),
      [CHANNEL_COL.rxTone]: formatOpenGd77ToneWire(ch.mode, ch.rxTone),
      [CHANNEL_COL.txTone]: formatOpenGd77ToneWire(ch.mode, ch.txTone),
      [CHANNEL_COL.squelch]: formatOpenGd77SquelchWire(ch.mode, ch.squelch),
      [CHANNEL_COL.power]: formatOpenGd77PowerWire(ch.power, profile.id),
      [CHANNEL_COL.rxOnly]: wireYesNo(ch.rxOnly),
      [CHANNEL_COL.allSkip]: wireYesNo(ch.scanSkip),
      [CHANNEL_COL.tot]: formatOpenGd77TransmitTimeoutWire(ch.transmitTimeout),
      [CHANNEL_COL.vox]: wireVoxEnabled(ch.voxEnabled),
      [CHANNEL_COL.aprs]: ch.aprsConfigName,
      [CHANNEL_COL.lat]: ch.location ? String(ch.location.lat) : '',
      [CHANNEL_COL.lon]: ch.location ? String(ch.location.lon) : '',
      [CHANNEL_COL.useLocation]: wireYesNo(ch.useLocation),
    };

    for (const header of VENDOR_EXTRA_HEADERS) {
      values[header] = ch.opengd77Extras[header] ?? '';
    }

    return padRow(CHANNEL_HEADERS, values);
  });

  return formatCsv(CHANNEL_HEADERS, rows);
}

export function serialiseZones(codeplug: Codeplug, profileId?: string): string {
  const profile = getOpenGd77Profile(profileId ?? DEFAULT_OPENGD77_PROFILE_ID);
  const memberHeaders = zoneMemberHeaders(profile.zoneMembers);
  const rows = codeplug.zones.map((zone) => {
    const values: Record<string, string> = { 'Zone Name': zone.name };
    zoneExportMemberNames(zone, codeplug.channels).forEach((name, i) => {
      if (i < memberHeaders.length) values[memberHeaders[i]] = name;
    });
    return padRow(ZONE_HEADERS, values);
  });
  return formatCsv(ZONE_HEADERS, rows);
}

export function serialiseContacts(codeplug: Codeplug): string {
  const rows: string[][] = [];

  for (const tg of codeplug.talkGroups) {
    rows.push(
      padRow(CONTACT_HEADERS, {
        [CONTACT_COL.name]: tg.name,
        [CONTACT_COL.id]: tg.number,
        [CONTACT_COL.idType]: 'Group',
        [CONTACT_COL.tsOverride]: tg.timeslotOverride,
      }),
    );
  }

  for (const contact of codeplug.contacts) {
    rows.push(
      padRow(CONTACT_HEADERS, {
        [CONTACT_COL.name]: contact.name,
        [CONTACT_COL.id]: contact.number,
        [CONTACT_COL.idType]: 'Private',
        [CONTACT_COL.tsOverride]: contact.timeslotOverride,
      }),
    );
  }

  return formatCsv(CONTACT_HEADERS, rows);
}

export function serialiseRxGroupLists(codeplug: Codeplug, profileId?: string): string {
  const profile = getOpenGd77Profile(profileId ?? DEFAULT_OPENGD77_PROFILE_ID);
  const memberHeaders = rxGroupListMemberHeaders(profile.tgListMembers);
  const rows = codeplug.rxGroupLists.map((list) => {
    const values: Record<string, string> = { [RX_GROUP_LIST_COL.name]: list.name };
    rxGroupListExportMemberNames(list, codeplug.talkGroups, codeplug.contacts).forEach(
      (name, i) => {
        if (i < memberHeaders.length) values[memberHeaders[i]] = name;
      },
    );
    return padRow(RX_GROUP_LIST_HEADERS, values);
  });
  return formatCsv(RX_GROUP_LIST_HEADERS, rows);
}

export function serialiseDtmfHeaderOnly(): string {
  return formatCsv(DTMF_HEADERS, []);
}

export function serialiseAprsHeaderOnly(): string {
  return formatCsv(APRS_HEADERS, []);
}

export interface OpenGd77ExportFiles {
  'Channels.csv': string;
  'Zones.csv': string;
  'Contacts.csv': string;
  'TG_Lists.csv': string;
  'DTMF.csv': string;
  'APRS.csv': string;
}

export function serialiseOpenGd77Files(
  codeplug: Codeplug,
  options?: ExportOptions,
): OpenGd77ExportFiles {
  const profileId = options?.profileId ?? DEFAULT_OPENGD77_PROFILE_ID;
  return {
    'Channels.csv': serialiseChannels(codeplug, profileId),
    'Zones.csv': serialiseZones(codeplug, profileId),
    'Contacts.csv': serialiseContacts(codeplug),
    'TG_Lists.csv': serialiseRxGroupLists(codeplug, profileId),
    'DTMF.csv': serialiseDtmfHeaderOnly(),
    'APRS.csv': serialiseAprsHeaderOnly(),
  };
}
