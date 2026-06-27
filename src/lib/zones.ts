import type { Channel, Zone, ZoneMemberEntry } from '../models/codeplug.ts';

/** Ordered channel ids for a zone. */
export function zoneMemberChannelIds(zone: Zone): string[] {
  return zone.members.map((m) => m.channelId);
}

/** Build member entries from ids — scan inclusion defaults to true. */
export function membersFromChannelIds(channelIds: string[]): ZoneMemberEntry[] {
  return channelIds.map((channelId) => ({ channelId }));
}

/** Merge member list preserving per-member scan flags where channel id unchanged. */
export function zoneMembersFromChannelIds(
  channelIds: string[],
  previous?: ZoneMemberEntry[],
): ZoneMemberEntry[] {
  const prevById = new Map((previous ?? []).map((m) => [m.channelId, m]));
  return channelIds.map((channelId) => {
    const prev = prevById.get(channelId);
    return prev ? { ...prev, channelId } : { channelId };
  });
}

export function memberIncludesInScanList(member: ZoneMemberEntry): boolean {
  return member.includeInScanList !== false;
}

/** Zone members that would be included in a derived scan list (before TG expansion). */
export function zoneScanEligibleMemberCount(zone: Zone, channels: Channel[]): number {
  const byId = new Map(channels.map((ch) => [ch.id, ch]));
  let count = 0;
  for (const member of zone.members) {
    if (!memberIncludesInScanList(member)) continue;
    const ch = byId.get(member.channelId);
    if (!ch || ch.scanSkip) continue;
    count++;
  }
  return count;
}

export function formatZoneScanListColumn(zone: Zone, channels: Channel[]): string {
  if (!zone.exportScanList) return '—';
  return `Enabled / ${zoneScanEligibleMemberCount(zone, channels)}`;
}

export function formatZoneScratchColumn(zone: Zone): string {
  return zone.exportScratchChannel ? 'Enabled' : '—';
}
