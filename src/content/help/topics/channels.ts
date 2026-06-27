import type { HelpEntry } from '../types.ts';

export const channelEntries: HelpEntry[] = [
  {
    id: 'channel.multiMode',
    title: 'Multi-mode channel',
    short:
      'One logical channel with several RF modes (e.g. FM and DMR on the same repeater). Mode-specific fields live on each tab.',
    learnMoreSlug: 'editing-channels',
    body: `## Multi-mode channels

Enable multi-mode when one site uses more than one RF mode on the same channel name.

On export, OpenGD77 splits these into separate rows (e.g. \`-F\` and \`-D\` suffixes). DM32 keeps them on one native dual-mode row.`,
  },
  {
    id: 'channel.txContact',
    title: 'TX contact',
    short:
      'The talk group or private contact this channel transmits on. Can reference either a talk group or a contact.',
    learnMoreSlug: 'editing-channels',
  },
  {
    id: 'channel.rxGroupList',
    title: 'RX group list',
    short:
      'Which talk groups this digital channel can receive. Export behaviour differs by radio — OpenGD77 keeps one row; DM32 may duplicate the channel per member.',
    learnMoreSlug: 'talk-groups-contacts-rgl',
  },
  {
    id: 'channel.exportNameMode',
    title: 'Export name mode',
    short:
      "How this channel's CPS name is built from callsign and name. The global override on Import & export wins for a single download.",
    learnMoreSlug: 'exporting',
  },
  {
    id: 'channel.mergeCandidates',
    title: 'Find merge candidates',
    short:
      'Detects channel pairs that should be one logical channel (multi-mode or multi-talkgroup). Preview before merging — zones and RX lists are rewired.',
    learnMoreSlug: 'editing-channels',
  },
  {
    id: 'channel.mapFilters',
    title: 'Map filters',
    short:
      'Only channels with **Use location** and valid coordinates appear on the map. **Hide from map** excludes a channel without deleting it.',
    learnMoreSlug: 'map',
  },
  {
    id: 'channel.rxOnly',
    title: 'RX only',
    short:
      'Receive-only — the radio will not transmit on this channel. Squelch and power set to default mean "use the radio\'s setting".',
    learnMoreSlug: 'editing-channels',
  },
  {
    id: 'channel.callsign',
    title: 'Callsign',
    short: 'Repeater or site identifier — used on the map and when composing the CPS channel name.',
    learnMoreSlug: 'editing-channels',
  },
];
