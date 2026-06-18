import type { Channel } from '../models/codeplug.ts';

/** Case-sensitive, first-wins name → channel id map (OpenGD77 quirk at import boundary only). */
export function buildNameToChannelId(channels: Channel[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const ch of channels) {
    if (!map.has(ch.name)) map.set(ch.name, ch.id);
  }
  return map;
}

export function resolveZoneMembers(
  sourceMemberNames: string[],
  nameToId: Map<string, string>,
): { memberChannelIds: string[]; unresolved: string[] } {
  const memberChannelIds: string[] = [];
  const unresolved: string[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const memberName of sourceMemberNames) {
    if (seenNames.has(memberName)) continue;
    seenNames.add(memberName);

    const id = nameToId.get(memberName);
    if (!id) {
      unresolved.push(memberName);
      continue;
    }
    if (!seenIds.has(id)) {
      seenIds.add(id);
      memberChannelIds.push(id);
    }
  }

  return { memberChannelIds, unresolved };
}
