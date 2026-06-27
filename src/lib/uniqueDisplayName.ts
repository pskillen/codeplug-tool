import type { Codeplug } from '../models/codeplug.ts';

/** Next display name not in `taken` — `base`, then `base (copy)`, then `base (2)`, … */
export function uniqueDisplayName(base: string, taken: Set<string>): string {
  const trimmed = base.trim() || 'Untitled';
  if (!taken.has(trimmed)) return trimmed;
  const copyName = `${trimmed} (copy)`;
  if (!taken.has(copyName)) return copyName;
  for (let n = 2; n < 10_000; n++) {
    const candidate = `${trimmed} (${n})`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${trimmed} (${Date.now()})`;
}

export function collectChannelNames(codeplug: Codeplug): Set<string> {
  return new Set(codeplug.channels.map((ch) => ch.name).filter(Boolean));
}

export function collectZoneNames(codeplug: Codeplug): Set<string> {
  return new Set(codeplug.zones.map((z) => z.name).filter(Boolean));
}

export function collectTalkGroupContactNames(codeplug: Codeplug): Set<string> {
  return new Set([
    ...codeplug.talkGroups.map((tg) => tg.name).filter(Boolean),
    ...codeplug.contacts.map((c) => c.name).filter(Boolean),
  ]);
}

export function collectRxGroupListNames(codeplug: Codeplug): Set<string> {
  return new Set(codeplug.rxGroupLists.map((r) => r.name).filter(Boolean));
}
