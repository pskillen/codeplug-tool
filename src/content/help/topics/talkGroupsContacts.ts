import type { HelpEntry } from '../types.ts';

export const talkGroupsContactsEntries: HelpEntry[] = [
  {
    id: 'talkGroup.namespace',
    title: 'Shared names',
    short:
      'Talk groups and contacts share one name space — a talk group and a contact cannot have the same name.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
  },
  {
    id: 'talkGroup.mergeCandidates',
    title: 'Find merge candidates',
    short:
      'Find talk groups that are really one logical group split by timeslot suffix (e.g. Scotland TS1 / Scotland TS2). Merging rewires RX lists and channel references.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
  },
  {
    id: 'talkGroup.abbreviation',
    title: 'Abbreviation',
    short: 'Optional shorter label used when export names must fit radio limits.',
    learnMoreSlug: 'exporting',
  },
];

export const rxGroupListEntries: HelpEntry[] = [
  {
    id: 'rxGroupList.promiscuous',
    title: 'RX group list',
    short:
      'A named list of talk groups (and contacts) a digital channel can receive. Lets one channel listen to several groups.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
    body: `## RX group lists

An RX group list defines **promiscuous receive** — which talk groups a channel listens to.

On OpenGD77 the channel keeps one row and points at the list. On DM32 the export may duplicate the channel once per list member because that radio picks one talk group per channel.`,
  },
  {
    id: 'rxGroupList.memberTimeslot',
    title: 'Member timeslot',
    short:
      'Which DMR timeslot (TS1 or TS2) this member uses on this repeater. OpenGD77 export may create separate contact names per slot.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
  },
  {
    id: 'rxGroupList.memberCaps',
    title: 'Member limits',
    short:
      'You can add as many members as you need here. The radio may truncate on export — you will see a warning, not a block in the editor.',
    learnMoreSlug: 'exporting',
  },
];
