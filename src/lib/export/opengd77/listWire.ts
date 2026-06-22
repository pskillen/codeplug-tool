import { channelNamesForIds } from '../../codeplugMutations.ts';
import { memberRefsToWireNames } from '../../entityRefs.ts';
import type { Channel, Contact, RxGroupList, TalkGroup, Zone } from '../../../models/codeplug.ts';

/** Zone member channel names for OpenGD77 export — from resolved memberChannelIds only. */
export function zoneExportMemberNames(zone: Zone, channels: Channel[]): string[] {
  return channelNamesForIds(channels, zone.memberChannelIds);
}

/** RX group list member wire names for OpenGD77 export — from memberRefs only. */
export function rxGroupListExportMemberNames(
  rgl: RxGroupList,
  talkGroups: TalkGroup[],
  contacts: Contact[],
): string[] {
  return memberRefsToWireNames(rgl.memberRefs, talkGroups, contacts);
}
