import type { HelpEntry, HelpTopicId } from './types.ts';
import { gettingStartedEntries } from './topics/gettingStarted.ts';
import { importExportEntries } from './topics/importExport.ts';
import { channelEntries } from './topics/channels.ts';
import { zoneEntries } from './topics/zones.ts';
import { talkGroupsContactsEntries, rxGroupListEntries } from './topics/talkGroupsContacts.ts';
import { repeaterEntries, mapEntries, persistenceEntries } from './topics/repeaterDirectories.ts';
import { hubEntries } from './topics/hub.ts';

const allEntries: HelpEntry[] = [
  ...gettingStartedEntries,
  ...importExportEntries,
  ...channelEntries,
  ...zoneEntries,
  ...talkGroupsContactsEntries,
  ...rxGroupListEntries,
  ...repeaterEntries,
  ...mapEntries,
  ...persistenceEntries,
  ...hubEntries,
];

const byId = new Map<HelpTopicId, HelpEntry>(allEntries.map((e) => [e.id, e]));

export function getHelpEntry(id: HelpTopicId): HelpEntry | undefined {
  return byId.get(id);
}

export function getHelpShort(id: HelpTopicId): string {
  return getHelpEntry(id)?.short ?? '';
}

export function getAllHelpEntries(): HelpEntry[] {
  return allEntries;
}

export { hubEntries, hubTopics } from './topics/hub.ts';
