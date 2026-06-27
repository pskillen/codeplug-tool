import type { EntityRef } from '../../lib/entityRefs.ts';
import {
  channelFieldDefaults,
  emptyCodeplug,
  type Channel,
  type Codeplug,
  type Contact,
  type RxGroupList,
  type RxGroupListMember,
  type TalkGroup,
  type Zone,
} from '../../models/codeplug.ts';
import { setMemberWireNames, stampImported } from '../../lib/entityProvenance.ts';
import { membersFromChannelIds } from '../../lib/zones.ts';

export function buildChannel(overrides: Partial<Channel> & Pick<Channel, 'id' | 'name'>): Channel {
  const {
    id,
    name,
    callsign = '',
    mode,
    multiMode,
    modeProfiles,
    exportNameMode,
    ...rest
  } = overrides;
  return {
    ...channelFieldDefaults(),
    id,
    name,
    callsign,
    exportNameMode: exportNameMode ?? 'name_only',
    mode: mode ?? 'dmr',
    multiMode: multiMode ?? false,
    modeProfiles: modeProfiles ?? [],
    ...rest,
  };
}

export type ZoneBuildInput = Partial<Zone> &
  Pick<Zone, 'id' | 'name'> & { memberChannelIds?: string[] };

export function buildZone(overrides: ZoneBuildInput): Zone {
  const legacyIds = (overrides as { memberChannelIds?: string[] }).memberChannelIds;
  const members = overrides.members ?? (legacyIds ? membersFromChannelIds(legacyIds) : []);
  return {
    ...overrides,
    members,
  };
}

/** Zone with member wire names in provenance (import/round-trip tests). */
export function buildImportedZone(overrides: ZoneBuildInput, memberWireNames: string[] = []): Zone {
  const zone = buildZone(overrides);
  if (memberWireNames.length === 0) return zone;
  return setMemberWireNames(
    stampImported(zone, {
      formatId: 'opengd77',
      sourceFile: 'Zones.csv',
      importedAt: new Date().toISOString(),
      memberWireNames,
    }),
    memberWireNames,
  );
}

export function buildTalkGroup(
  overrides: Partial<TalkGroup> & Pick<TalkGroup, 'id' | 'name'>,
): TalkGroup {
  return {
    number: '',
    ...overrides,
  };
}

export function buildContact(overrides: Partial<Contact> & Pick<Contact, 'id' | 'name'>): Contact {
  return {
    identifier: '',
    signalingMode: 'dmr',
    ...overrides,
  };
}

export function buildRglMember(ref: EntityRef, timeslot?: 1 | 2 | null): RxGroupListMember {
  return timeslot == null ? { ref } : { ref, timeslot };
}

export function buildRxGroupList(
  overrides: Partial<RxGroupList> & Pick<RxGroupList, 'id' | 'name'>,
): RxGroupList {
  return { memberRefs: [], ...overrides };
}

/** RX group list with member wire names in provenance. */
export function buildImportedRxGroupList(
  overrides: Partial<RxGroupList> & Pick<RxGroupList, 'id' | 'name'>,
  memberWireNames: string[] = [],
): RxGroupList {
  const rgl = buildRxGroupList(overrides);
  if (memberWireNames.length === 0) return rgl;
  return setMemberWireNames(
    stampImported(rgl, {
      formatId: 'opengd77',
      sourceFile: 'TG_Lists.csv',
      importedAt: new Date().toISOString(),
      memberWireNames,
    }),
    memberWireNames,
  );
}

export function buildCodeplug(overrides: Partial<Codeplug> = {}): Codeplug {
  return {
    ...emptyCodeplug(),
    ...overrides,
  };
}

/** Channel with default geolocation for map/channel tests. */
export function buildGeolocatedChannel(
  overrides: Partial<Channel> & Pick<Channel, 'id' | 'name'>,
): Channel {
  return buildChannel({
    location: { lat: 56.5, lon: -4.0 },
    useLocation: true,
    ...overrides,
  });
}
