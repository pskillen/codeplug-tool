import {
  effectiveMaxNameLength,
  expandOptionsFromExport,
} from '../../channelExpansion/exportOptions.ts';
import { expandZoneMemberWireNames } from '../../channelExpansion/index.ts';
import { memberRefsToWireNames } from '../../entityRefs.ts';
import type { Codeplug, Contact, RxGroupList, TalkGroup, Zone } from '../../../models/codeplug.ts';
import type { ExportOptions } from '../../import-export/types.ts';
import { getOpenGd77Profile, DEFAULT_OPENGD77_PROFILE_ID } from '../../opengd77/profiles.ts';

/** Zone member channel names for OpenGD77 export — expands multi-mode members. */
export function zoneExportMemberNames(
  zone: Zone,
  codeplug: Codeplug,
  options?: ExportOptions,
): string[] {
  const profile = getOpenGd77Profile(options?.profileId ?? DEFAULT_OPENGD77_PROFILE_ID);
  const expandOpts = expandOptionsFromExport(codeplug, options);
  const { names } = expandZoneMemberWireNames(zone, codeplug.channels, {
    ...expandOpts,
    maxNameLength: effectiveMaxNameLength(options, profile.nameLimit),
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
