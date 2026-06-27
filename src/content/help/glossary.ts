export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Channel',
    definition:
      'One RF configuration — frequencies, mode, tones, and (for DMR) talk group references. What you switch to on the radio.',
  },
  {
    term: 'Zone',
    definition:
      'A named, ordered list of channels for on-radio zone switching. On OpenGD77 a zone also acts as the scan list.',
  },
  {
    term: 'Talk group',
    definition: 'A DMR group call — one logical group identified by a DMR ID.',
  },
  {
    term: 'Contact',
    definition: 'A private DMR call or a DTMF contact — not the same as a talk group.',
  },
  {
    term: 'TX contact',
    definition: 'The transmit target on a channel — may be a talk group or a private contact.',
  },
  {
    term: 'RX group list',
    definition:
      'A named list of talk groups (and contacts) a digital channel can receive — promiscuous receive.',
  },
  {
    term: 'Callsign',
    definition:
      'Repeater or site identifier (e.g. GB3KF). Used on the map and in CPS channel names.',
  },
  {
    term: 'Multi-mode channel',
    definition:
      'One logical channel carrying more than one RF mode (e.g. FM and DMR on the same site).',
  },
  {
    term: 'Scan skip',
    definition:
      'Channel flag to exclude it from scanning. Different from a scan list entity on DM32.',
  },
  {
    term: 'Codeplug project',
    definition: 'Named wrapper around one codeplug — your saved work including metadata.',
  },
];

export function glossaryMarkdown(): string {
  return glossaryTerms.map((t) => `**${t.term}** — ${t.definition}`).join('\n\n');
}
