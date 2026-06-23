import { expandZoneMemberWireNames } from '../../channelExpansion/index.ts';
import { memberRefsToWireNames } from '../../entityRefs.ts';
import type { Channel, Contact, RxGroupList, TalkGroup, Zone } from '../../../models/codeplug.ts';
import { getOpenGd77Profile, DEFAULT_OPENGD77_PROFILE_ID } from '../../opengd77/profiles.ts';

/** Zone member channel names for OpenGD77 export — expands multi-mode members. */
export function zoneExportMemberNames(
  zone: Zone,
  channels: Channel[],
  profileId?: string,
): string[] {
  const profile = getOpenGd77Profile(profileId ?? DEFAULT_OPENGD77_PROFILE_ID);
  const { names } = expandZoneMemberWireNames(zone, channels, {
    maxMembers: profile.zoneMembers,
  });
  return names;
}

/** RX group list member wire names for OpenGD77 export — from memberRefs only. */
export function rxGroupListExportMemberNames(
  rgl: RxGroupList,
  talkGroups: TalkGroup[],
  contacts: Contact[],
): string[] {
  return memberRefsToWireNames(rgl.memberRefs, talkGroups, contacts);
}
