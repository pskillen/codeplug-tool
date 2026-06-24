import type { Codeplug } from '../../../models/codeplug.ts';
import type { ExportOptions } from '../../import-export/types.ts';
import {
  expandAllChannelsForExport,
  expandZoneMemberWireNames,
} from '../../channelExpansion/index.ts';
import {
  effectiveMaxNameLength,
  expandOptionsFromExport,
} from '../../channelExpansion/exportOptions.ts';
import { DEFAULT_OPENGD77_PROFILE_ID, getOpenGd77Profile } from '../../opengd77/profiles.ts';

/** Collect export-time warnings for OpenGD77 profile limits (zone / TG list cardinality, name length). */
export function collectOpenGd77ExportWarnings(
  codeplug: Codeplug,
  options?: ExportOptions,
): string[] {
  const profile = getOpenGd77Profile(options?.profileId ?? DEFAULT_OPENGD77_PROFILE_ID);
  const warnings: string[] = [];
  const expandOpts = expandOptionsFromExport(codeplug, options, warnings);
  const maxNameLength = effectiveMaxNameLength(options, profile.nameLimit);

  expandAllChannelsForExport(codeplug.channels, {
    ...expandOpts,
    maxNameLength,
  });

  for (const zone of codeplug.zones) {
    const { warnings: zoneWarnings } = expandZoneMemberWireNames(zone, codeplug.channels, {
      ...expandOpts,
      maxNameLength,
      maxMembers: profile.zoneMembers,
    });
    warnings.push(...zoneWarnings);
  }

  for (const rgl of codeplug.rxGroupLists) {
    if (rgl.memberRefs.length > profile.tgListMembers) {
      warnings.push(
        `RX group list "${rgl.name}" has ${rgl.memberRefs.length} members; only ${profile.tgListMembers} export to OpenGD77`,
      );
    }
  }

  return warnings;
}
